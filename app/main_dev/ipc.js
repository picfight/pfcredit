import fs from "fs-extra";
import path from "path";
import parseArgs from "minimist";
import { OPTIONS } from "./constants";
import { createLogger } from "./logging";
import { getWalletPath, getWalletDBPathFromWallets, getPfcdPath, pfcdCfg, pfcctlCfg, appDataDirectory, getExecutablePath, getPfcdRpcCert } from "./paths";
import { createTempPfcdConf, initWalletCfg, newWalletConfigCreation, getWalletCfg, readPfcdConfig } from "../config";
import { launchPFCD, launchPFCWallet, GetPfcdPID, GetPfcwPID, closePFCW, GetPfcwPort } from "./launch";

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const logger = createLogger();
let watchingOnlyWallet;

export const getAvailableWallets = (network) => {
  // Attempt to find all currently available wallet.db's in the respective network direction in each wallets data dir
  const availableWallets = [];
  const isTestNet = network !== "mainnet";

  const walletsBasePath = getWalletPath(isTestNet);
  const walletDirs = fs.readdirSync(walletsBasePath);
  walletDirs.forEach(wallet => {
    const walletDirStat = fs.statSync(path.join(walletsBasePath, wallet));
    if (!walletDirStat.isDirectory()) return;

    const cfg = getWalletCfg(isTestNet, wallet);
    const lastAccess = cfg.get("lastaccess");
    const watchOnly = cfg.get("iswatchonly");
    const walletDbFilePath = getWalletDBPathFromWallets(isTestNet, wallet);
    const finished = fs.pathExistsSync(walletDbFilePath);
    availableWallets.push({ network, wallet, finished, lastAccess, watchOnly });
  });

  return availableWallets;
};

export const deleteDaemon = (appData, testnet) => {
  let removeDaemonDirectory = getPfcdPath();
  if (appData) removeDaemonDirectory = appData;
  let removeDaemonDirectoryData = path.join(removeDaemonDirectory, "data", testnet ? "testnet3" : "mainnet");
  try {
    if (fs.pathExistsSync(removeDaemonDirectoryData)) {
      fs.removeSync(removeDaemonDirectoryData);
      logger.log("info", "removing " + removeDaemonDirectoryData);
    }
    return true;
  } catch (e) {
    logger.log("error", "error deleting daemon data: " + e);
    return false;
  }
};

export const startDaemon = (mainWindow, daemonIsAdvanced, primaryInstance, appData, testnet, reactIPC) => {
  if (GetPfcdPID() && GetPfcdPID() !== -1) {
    logger.log("info", "Skipping restart of daemon as it is already running " + GetPfcdPID());
    var newConfig = {};
    if (appData) {
      newConfig = readPfcdConfig(appData, testnet);
      newConfig.rpc_cert = getPfcdRpcCert(appData);
    } else {
      newConfig = readPfcdConfig(getPfcdPath(), testnet);
      newConfig.rpc_cert = getPfcdRpcCert();
    }
    newConfig.pid =  GetPfcdPID();
    return newConfig;
  }
  if(appData){
    logger.log("info", "launching pfcd with different appdata directory");
  }
  if (!daemonIsAdvanced && !primaryInstance) {
    logger.log("info", "Running on secondary instance. Assuming pfcd is already running.");
    let pfcdConfPath = getPfcdPath();
    if (!fs.existsSync(pfcdCfg(pfcdConfPath))) {
      pfcdConfPath = createTempPfcdConf();
    }
    return -1;
  }
  try {
    let pfcdConfPath = getPfcdPath();
    if (!fs.existsSync(pfcdCfg(pfcdConfPath))) {
      pfcdConfPath = createTempPfcdConf();
    }
    return launchPFCD(mainWindow, daemonIsAdvanced, pfcdConfPath, appData, testnet, reactIPC);
  } catch (e) {
    logger.log("error", "error launching pfcd: " + e);
  }
};

export const createWallet = (testnet, walletPath) => {
  const newWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (!fs.pathExistsSync(newWalletDirectory)){
      fs.mkdirsSync(newWalletDirectory);

      // create new configs for new wallet
      initWalletCfg(testnet, walletPath);
      newWalletConfigCreation(testnet, walletPath);
    }
    return true;
  } catch (e) {
    logger.log("error", "error creating wallet: " + e);
    return false;
  }
};

export const removeWallet = (testnet, walletPath) => {
  let removeWalletDirectory = getWalletPath(testnet, walletPath);
  try {
    if (fs.pathExistsSync(removeWalletDirectory)) {
      fs.removeSync(removeWalletDirectory);
    }
    return true;
  } catch (e) {
    logger.log("error", "error creating wallet: " + e);
    return false;
  }
};

export const startWallet = (mainWindow, daemonIsAdvanced, testnet, walletPath, reactIPC) => {
  if (GetPfcwPID()) {
    logger.log("info", "pfcwallet already started " + GetPfcwPID());
    mainWindow.webContents.send("pfcwallet-port", GetPfcwPort());
    return GetPfcwPID();
  }
  initWalletCfg(testnet, walletPath);
  try {
    return launchPFCWallet(mainWindow, daemonIsAdvanced, walletPath, testnet, reactIPC);
  } catch (e) {
    logger.log("error", "error launching pfcwallet: " + e);
  }
};

export const stopWallet = () => {
  return closePFCW(GetPfcwPID());
};

export const checkDaemon = (mainWindow, rpcCreds, testnet) => {
  let args = [ "getblockcount" ];
  let host, port;
  let currentBlockCount;

  if (!rpcCreds){
    args.push(`--configfile=${pfcctlCfg(appDataDirectory())}`);
  } else if (rpcCreds) {
    if (rpcCreds.rpc_user) {
      args.push(`--rpcuser=${rpcCreds.rpc_user}`);
    }
    if (rpcCreds.rpc_password) {
      args.push(`--rpcpass=${rpcCreds.rpc_password}`);
    }
    if (rpcCreds.rpc_cert) {
      args.push(`--rpccert=${rpcCreds.rpc_cert}`);
    }
    if (rpcCreds.rpc_host) {
      host = rpcCreds.rpc_host;
    }
    if (rpcCreds.rpc_port) {
      port = rpcCreds.rpc_port;
    }
    args.push("--rpcserver=" + host + ":" + port);
  }

  if (testnet) {
    args.push("--testnet");
  }

  const pfcctlExe = getExecutablePath("pfcctl", argv.customBinPath);
  if (!fs.existsSync(pfcctlExe)) {
    logger.log("error", "The pfcctl file does not exists");
  }

  logger.log("info", `checking if daemon is ready  with pfcctl ${args}`);

  const spawn = require("child_process").spawn;
  const pfcctl = spawn(pfcctlExe, args, { detached: false, stdio: [ "ignore", "pipe", "pipe", "pipe" ] });

  pfcctl.stdout.on("data", (data) => {
    currentBlockCount = data.toString();
    logger.log("info", data.toString());
    mainWindow.webContents.send("check-daemon-response", currentBlockCount);
  });
  pfcctl.stderr.on("data", (data) => {
    logger.log("error", data.toString());
    mainWindow.webContents.send("check-daemon-response", 0);
  });
};

export const setWatchingOnlyWallet = (isWatchingOnly) => {
  watchingOnlyWallet = isWatchingOnly;
};

export const getWatchingOnlyWallet = () => watchingOnlyWallet;
