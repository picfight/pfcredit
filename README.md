# pfCredit

[![Build Status](https://travis-ci.org/picfight/pfcredit.png?branch=master)](https://travis-ci.org/picfight/pfcredit)
[![ISC License](http://img.shields.io/badge/license-ISC-blue.svg)](http://copyfree.org)

pfCredit is a cross-platform GUI wallet for PicFight coin based on the [Decred/Decrediton](https://github.com/decred/decrediton).

## Installation

Currently pfCredit is available on Windows, Linux, and macOS.

pfCredit will NOT use or in any way disrupt the CLI wallet file you may
already be using at this time.

Download the pfCredit release for your operating system on [picfgith/picfgith-binaries](https://github.com/picfgith/pfcredit/releases).

## Usage

When you launch pfCredit, you will be prompted to select a wallet to use. Select your wallet or create a new one using the in-app wizard. Be sure to save your seed and make your password memorable.

## Building from the source code and developing

### Setting up your development environment

To build the code you need to install on your machine:

- NodeJS

- npm

- Yarn

- Go-lang and Git

### Building

First you need to build and install `pfcd`, `pfcwallet` and `pfcctl`.

- [pfcd/pfcctl installation instructions](https://github.com/picfight/pfcd)
- [pfcwallet installation instructions](https://github.com/picfight/pfcwallet)

Adjust the following steps for the paths you want to use.

``` bash
mkdir code
cd code
git clone https://github.com/picfight/pfcredit.git
cd pfCredit
yarn
mkdir bin/
cp $GOPATH/bin/dcr* bin/
yarn dev
```

This would build and run the pfCredit.

### Windows

Don`t build on Windows. This is the path of pain and suffering. Instead install a virtual machine with linux and use the build instructions for linux.

### Releasing the end-user app

Necessary build commands are located in the `package.json` file, see the `scripts`
section of the file for details and build commands:
```bash
...
    "dev": "npm run hot-server -- --start-hot",
    "package": "npm run build && build --publish never",
    "package-win": "npm run build && build --win --x64 --ia32",
    "package-linux": "npm run build && build --linux",
    "package-mac": "npm run build && build --mac",
    "package-all": "npm run build && build -mwl",
    "package-dev-linux": "npm run build && build --linux tar.gz",
...
```

For example use `package-linux` command as follows:

```bash
yarn package-linux
```

After it is finished it will have the built rpm, deb and tar.gz in the releases/ directory.

If you're only interested in a tar.gz, you can alternatively use:

```bash
yarn package-dev-linux
```

### Options

When running a release version, there are a few options available.

To see additional debug information (including the output of pfcd and pfcwallet) run:

```
pfcredit --debug
```

To pass additional arguments to pfcwallet (such as to increase the logging level run:

```
pfcredit --extrawalletargs='-d=debug'
```

### Node

It will be helpful to you to run the pfcd node in a separate process and simply attach to it between pfCredit restarts. In order to see the advanced daemon configuration options you open your ```config.json``` and set the ```daemon_start_advanced``` flag to ```true``` as follows:

```"daemon_start_advanced": true,```

Note: Your config.json file is located in the following directory(s)

Windows - ```C:\Users\<your-username>\AppData\Local\Pfcredit\config.json```

OSX - ```$HOME/Library/Application\ Support/Pfcredit/config.json```

Linux - ```~/.config/pfcredit/config.json```

Run the following to start the Decred daemon in a standalone terminal window:

Windows - ```pfcd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=C:\Users\<username>\AppData\Local\Pfcd\rpc.cert```

OSX - ```pfcd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=$HOME/Library/Application\ Support/Pfcd/rpc.cert```

Linux - ```pfcd --testnet -u USER -P PASSWORD --rpclisten=127.0.0.1:19119 --rpccert=~/.pfcd/rpc.cert```

You can connect to this daemon in ```Advanced Startup => Different Local Daemon Location``` and input the parameters requested. Note that all the parameters needed are present in the command you used to start the node for your respective system.

## Issue Tracker

The
[integrated github issue tracker](https://github.com/picfight/pfcredit/issues)
is used for this project.

## License

pfCredit is licensed under the [copyfree](http://copyfree.org) ISC License.
