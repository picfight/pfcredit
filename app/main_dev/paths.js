import path from "path";
import os from "os";
import fs from "fs-extra";
import { initWalletCfg, newWalletConfigCreation } from "../config";

// In all the functions below the Windows path is constructed based on
// os.homedir() rather than using process.env.LOCALAPPDATA because in my tests
// that was available when using the standalone node but not there when using
// electron in production mode.
export function appDataDirectory() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "PicFightiton");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","decrediton");
  } else {
    return path.join(os.homedir(),".config","decrediton");
  }
}

export function getGlobalCfgPath() {
  return path.resolve(appDataDirectory(), "config.json");
}

export function getWalletsDirectoryPath() {
  return path.join(appDataDirectory(), "wallets");
}

export function getWalletsDirectoryPathNetwork(testnet) {
  return path.join(appDataDirectory(), "wallets", testnet ? "testnet" : "mainnet");
}

export function getWalletPath(testnet, walletPath = "", testnet3) {
  const testnetStr = testnet ? "testnet" : "mainnet";
  const testnet3Str = testnet3 === true ? "testnet3" : testnet3 === false ? "mainnet" : "";
  return path.join(getWalletsDirectoryPath(), testnetStr, walletPath, testnet3Str);
}

export function getDefaultWalletDirectory(testnet, testnet3) {
  return getWalletPath(testnet, "default-wallet", testnet3);
}

export function getDefaultWalletFilesPath(testnet, filePath = "") {
  return path.join(getDefaultWalletDirectory(testnet), filePath);
}

export function getWalletDBPathFromWallets(testnet, walletPath) {
  const network = testnet ? "testnet" : "mainnet";
  const networkFolder = testnet ? "testnet3" : "mainnet";
  return path.join(getWalletsDirectoryPath(), network, walletPath, networkFolder, "wallet.db");
}

export function getPicFightitonWalletDBPath(testnet) {
  return path.join(appDataDirectory(), testnet ? "testnet3" : "mainnet", "wallet.db");
}

export function pfcctlCfg(configPath) {
  return path.resolve(configPath, "pfcctl.conf");
}

export function pfcdCfg(configPath) {
  return path.resolve(configPath, "pfcd.conf");
}

export function pfcwalletCfg(configPath) {
  return path.resolve(configPath, "pfcwallet.conf");
}

export function getPfcdPath() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Pfcd");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","pfcd");
  } else {
    return path.join(os.homedir(),".pfcd");
  }
}

export function getPfcwalletPath() {
  if (os.platform() == "win32") {
    return path.join(os.homedir(), "AppData", "Local", "Pfcwallet");
  } else if (process.platform === "darwin") {
    return path.join(os.homedir(), "Library","Application Support","pfcwallet");
  } else {
    return path.join(os.homedir(),".pfcwallet");
  }
}

export function getPfcdRpcCert (appDataPath) {
  return path.resolve(appDataPath ? appDataPath : getPfcdPath(), "rpc.cert");
}

export function getExecutablePath(name, customBinPath) {
  let binPath = customBinPath ? customBinPath :
    process.env.NODE_ENV === "development"
      ? path.join(__dirname, "..", "..", "bin")
      : path.join(process.resourcesPath, "bin");
  let execName = os.platform() !== "win32" ? name : name + ".exe";

  return path.join(binPath, execName);
}

export function getDirectoryLogs(dir) {
  return path.join(dir, "logs");
}

export function checkAndInitWalletCfg (testnet) {
  const walletDirectory = getDefaultWalletDirectory(testnet);

  if (!fs.pathExistsSync(walletDirectory) && fs.pathExistsSync(getPicFightitonWalletDBPath(testnet))) {
    fs.mkdirsSync(walletDirectory);

    // check for existing mainnet directories
    if ( fs.pathExistsSync(getPicFightitonWalletDBPath(testnet)) ) {
      fs.copySync(getPicFightitonWalletDBPath(testnet), path.join(getDefaultWalletDirectory(testnet, testnet),"wallet.db"));
    }

    // copy over existing config.json if it exists
    if (fs.pathExistsSync(getGlobalCfgPath())) {
      fs.copySync(getGlobalCfgPath(), getDefaultWalletFilesPath(testnet, "config.json"));
    }

    // create new configs for default mainnet wallet
    initWalletCfg(testnet, "default-wallet");
    newWalletConfigCreation(testnet, "default-wallet");
  }
}
