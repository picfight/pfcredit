import { pfcwalletCfg, getWalletPath, getExecutablePath, pfcdCfg, getPfcdRpcCert } from "./paths";
import { getWalletCfg, readPfcdConfig } from "../config";
import { createLogger, AddToPfcdLog, AddToPfcwalletLog, GetPfcdLogs, GetPfcwalletLogs, lastErrorLine } from "./logging";
import parseArgs from "minimist";
import { OPTIONS } from "./constants";
import os from "os";
import fs from "fs-extra";
import stringArgv from "string-argv";
import { concat, isString } from "lodash";

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);

let pfcdPID;
let dcrwPID;

let dcrwPort;

function closeClis() {
  // shutdown daemon and wallet.
  // Don't try to close if not running.
  if(pfcdPID && pfcdPID !== -1)
    closePFCD(pfcdPID);
  if(dcrwPID && dcrwPID !== -1)
    closePFCW(dcrwPID);
}

function closePFCD() {
  if (require("is-running")(pfcdPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to pfcd at pid:" + pfcdPID);
    process.kill(pfcdPID, "SIGINT");
  }
}

export const closePFCW = () => {
  try {
    if (require("is-running")(dcrwPID) && os.platform() != "win32") {
      logger.log("info", "Sending SIGINT to pfcwallet at pid:" + dcrwPID);
      process.kill(dcrwPID, "SIGINT");
    }
    dcrwPID = null;
    return true;
  } catch (e) {
    logger.log("error", "error closing wallet: " + e);
    return false;
  }
};

export async function cleanShutdown(mainWindow, app) {
  // Attempt a clean shutdown.
  return new Promise(resolve => {
    const cliShutDownPause = 2; // in seconds.
    const shutDownPause = 3; // in seconds.
    closeClis();
    // Sent shutdown message again as we have seen it missed in the past if they
    // are still running.
    setTimeout(function () { closeClis(); }, cliShutDownPause * 1000);
    logger.log("info", "Closing pfcredit.");

    let shutdownTimer = setInterval(function () {
      const stillRunning = (require("is-running")(pfcdPID) && os.platform() != "win32");

      if (!stillRunning) {
        logger.log("info", "Final shutdown pause. Quitting app.");
        clearInterval(shutdownTimer);
        if (mainWindow) {
          mainWindow.webContents.send("daemon-stopped");
          setTimeout(() => { mainWindow.close(); app.quit(); }, 1000);
        } else {
          app.quit();
        }
        resolve(true);
      }
      logger.log("info", "Daemon still running in final shutdown pause. Waiting.");

    }, shutDownPause * 1000);
  });
}

export const launchPFCD = (mainWindow, daemonIsAdvanced, daemonPath, appdata, testnet, reactIPC) => {
  const spawn = require("child_process").spawn;
  let args = [ "--nolisten" ];
  let newConfig = {};
  if (appdata) {
    args.push(`--appdata=${appdata}`);
    newConfig = readPfcdConfig(appdata, testnet);
    newConfig.rpc_cert = getPfcdRpcCert(appdata);
  } else {
    args.push(`--configfile=${pfcdCfg(daemonPath)}`);
    newConfig = readPfcdConfig(daemonPath, testnet);
    newConfig.rpc_cert = getPfcdRpcCert();
  }
  if (testnet) {
    args.push("--testnet");
  }

  const pfcdExe = getExecutablePath("pfcd", argv.customBinPath);
  if (!fs.existsSync(pfcdExe)) {
    logger.log("error", "The pfcd file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch pfcd: " + e);
    }
  }

  logger.log("info", `Starting ${pfcdExe} with ${args}`);

  const pfcd = spawn(pfcdExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", "pipe", "pipe" ]
  });

  pfcd.on("error", function (err) {
    logger.log("error", "Error running pfcd.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running pfcd.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  pfcd.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0) {
      const lastPfcdErr = lastErrorLine(GetPfcdLogs());
      logger.log("error", "pfcd closed due to an error: ", lastPfcdErr);
      reactIPC.send("error-received", true, lastPfcdErr);
    } else {
      logger.log("info", `pfcd exited with code ${code}`);
    }
  });

  pfcd.stdout.on("data", (data) => AddToPfcdLog(process.stdout, data, debug));
  pfcd.stderr.on("data", (data) => AddToPfcdLog(process.stderr, data, debug));

  newConfig.pid = pfcd.pid;
  pfcdPID = pfcd.pid;
  logger.log("info", "pfcd started with pid:" + newConfig.pid);

  pfcd.unref();
  return newConfig;
};

// DecodeDaemonIPCData decodes messages from an IPC message received from pfcd/
// pfcwallet using their internal IPC protocol.
// NOTE: very simple impl for the moment, will break if messages get split
// between data calls.
const DecodeDaemonIPCData = (logger, data, cb) => {
  let i = 0;
  while (i < data.length) {
    if (data[i++] !== 0x01) throw "Wrong protocol version when decoding IPC data";
    const mtypelen = data[i++];
    const mtype = data.slice(i, i+mtypelen).toString("utf-8");
    i += mtypelen;
    const psize = data.readUInt32LE(i);
    i += 4;
    const payload = data.slice(i, i+psize);
    i += psize;
    cb(mtype, payload);
  }
};

export const launchPFCWallet = (mainWindow, daemonIsAdvanced, walletPath, testnet, reactIPC) => {
  const spawn = require("child_process").spawn;
  let args = [ "--configfile=" + pfcwalletCfg(getWalletPath(testnet, walletPath)) ];

  const cfg = getWalletCfg(testnet, walletPath);

  args.push("--ticketbuyer.nospreadticketpurchases");
  args.push("--ticketbuyer.balancetomaintainabsolute=" + cfg.get("balancetomaintain"));
  args.push("--ticketbuyer.maxfee=" + cfg.get("maxfee"));
  args.push("--ticketbuyer.maxpricerelative=" + cfg.get("maxpricerelative"));
  args.push("--ticketbuyer.maxpriceabsolute=" + cfg.get("maxpriceabsolute"));
  args.push("--ticketbuyer.maxperblock=" + cfg.get("maxperblock"));
  args.push("--addridxscanlen=" + cfg.get("gaplimit"));

  const dcrwExe = getExecutablePath("pfcwallet", argv.customBinPath);
  if (!fs.existsSync(dcrwExe)) {
    logger.log("error", "The pfcwallet file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
      const pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch pfcwallet: " + e);
    }
  } else {
    args.push("--rpclistenerevents");
    args.push("--pipetx=4");
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs !== undefined && isString(argv.extrawalletargs)) {
    args = concat(args, stringArgv(argv.extrawalletargs));
  }

  logger.log("info", `Starting ${dcrwExe} with ${args}`);

  const pfcwallet = spawn(dcrwExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", "pipe", "pipe", "ignore", "pipe" ]
  });

  const notifyGrpcPort = (port) => {
    dcrwPort = port;
    logger.log("info", "wallet grpc running on port", port);
    mainWindow.webContents.send("pfcwallet-port", port);
  };

  pfcwallet.stdio[4].on("data", (data) => DecodeDaemonIPCData(logger, data, (mtype, payload) => {
    if (mtype === "grpclistener") {
      const intf = payload.toString("utf-8");
      const matches = intf.match(/^.+:(\d+)$/);
      if (matches) {
        notifyGrpcPort(matches[1]);
      } else {
        logger.log("error", "GRPC port not found on IPC channel to pfcwallet: " + intf);
      }
    }
  }));

  pfcwallet.on("error", function (err) {
    logger.log("error", "Error running pfcwallet.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running pfcwallet.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  pfcwallet.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0) {
      const lastPfcwalletErr = lastErrorLine(GetPfcwalletLogs());
      logger.log("error", "pfcwallet closed due to an error: ", lastPfcwalletErr);
      reactIPC.sendSync("error-received", false, lastPfcwalletErr);
    } else {
      logger.log("info", `pfcwallet exited with code ${code}`);
    }
  });

  const addStdoutToLogListener = (data) => AddToPfcwalletLog(process.stdout, data, debug);

  // waitForGrpcPortListener is added as a stdout on("data") listener only on
  // win32 because so far that's the only way we found to get back the grpc port
  // on that platform. For linux/macOS users, the --pipetx argument is used to
  // provide a pipe back to pfcredit, which reads the grpc port in a secure and
  // reliable way.
  const waitForGrpcPortListener = (data) => {
    const matches = /PFCW: gRPC server listening on [^ ]+:(\d+)/.exec(data);
    if (matches) {
      notifyGrpcPort(matches[1]);
      // swap the listener since we don't need to keep looking for the port
      pfcwallet.stdout.removeListener("data", waitForGrpcPortListener);
      pfcwallet.stdout.on("data", addStdoutToLogListener);
    }
    AddToPfcwalletLog(process.stdout, data, debug);
  };

  pfcwallet.stdout.on("data", os.platform() == "win32" ? waitForGrpcPortListener : addStdoutToLogListener);
  pfcwallet.stderr.on("data", (data) => {
    AddToPfcwalletLog(process.stderr, data, debug);
  });

  dcrwPID = pfcwallet.pid;
  logger.log("info", "pfcwallet started with pid:" + dcrwPID);

  pfcwallet.unref();
  return dcrwPID;
};

export const GetPfcwPort = () => dcrwPort;

export const GetPfcdPID = () => pfcdPID;

export const GetPfcwPID = () => dcrwPID;

export const readExesVersion = (app, grpcVersions) => {
  let spawn = require("child_process").spawnSync;
  let args = [ "--version" ];
  let exes = [ "pfcd", "pfcwallet", "pfcctl" ];
  let versions = {
    grpc: grpcVersions,
    pfcredit: app.getVersion()
  };

  for (let exe of exes) {
    let exePath = getExecutablePath("pfcd", argv.customBinPath);
    if (!fs.existsSync(exePath)) {
      logger.log("error", "The pfcd file does not exists");
    }

    let proc = spawn(exePath, args, { encoding: "utf8" });
    if (proc.error) {
      logger.log("error", `Error trying to read version of ${exe}: ${proc.error}`);
      continue;
    }

    let versionLine = proc.stdout.toString();
    if (!versionLine) {
      logger.log("error", `Empty version line when reading version of ${exe}`);
      continue;
    }

    let decodedLine = versionLine.match(/\w+ version ([^\s]+)/);
    if (decodedLine !== null) {
      versions[exe] = decodedLine[1];
    } else {
      logger.log("error", `Unable to decode version line ${versionLine}`);
    }
  }

  return versions;
};
