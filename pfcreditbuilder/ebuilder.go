package main

import (
	"github.com/jfixby/coinknife"
	"github.com/jfixby/pin"
	"github.com/jfixby/pin/commandline"
	"github.com/jfixby/pin/fileops"
	"path/filepath"
	"strings"
)

func main() {
	set := &coinknife.Settings{
		PathToInputRepo:        `D:\PICFIGHT\src\github.com\decred\decrediton`,
		PathToOutputRepo:       `D:\PICFIGHT\src\github.com\picfight\pfcredit`,
		DoNotProcessAnyFiles:   false,
		DoNotProcessSubfolders: false,
		FileNameProcessor:      nameGenerator,
		IsFileProcessable:      processableFiles,
		FileContentProcessor:   fileGenerator,
		IgnoredFiles:           ignoredFiles(),
		InjectorsPath:          filepath.Join("", "code_injections"),
		GoFmt:                  coinknife.GoFmt,
		AppendGitIgnore:        coinknife.AppendGitIgnore,
	}

	coinknife.Build(set)
}

func nameGenerator(data string) string {
	//data = coinknife.Replace(data, "decred/dcrd", "picfight/pfcd")
	return fileGenerator(data)
}

func fileGenerator(data string) string {

	data = coinknife.Replace(data, "decred/decrediton", "picfight/pfcredit")
	data = coinknife.Replace(data, "decrediton", "pfcredit")
	data = coinknife.Replace(data, "Decrediton", "Pfcredit")
	data = coinknife.Replace(data, "Decredition", "Pfcredit")
	data = coinknife.Replace(data, "DECREDITON", "PFCREDIT")

	data = coinknife.Replace(data, "decred/dcrdata", "picfight/pfcdata")
	data = coinknife.Replace(data, "dcrdata", "pfcdata")
	data = coinknife.Replace(data, "Dcrdata", "Pfcdata")
	data = coinknife.Replace(data, "DCRDATA", "PFCDATA")

	data = coinknife.Replace(data, "dcrctl", "pfcctl")
	data = coinknife.Replace(data, "dcrutil", "pfcutil")

	data = coinknife.Replace(data, "decred/dcrwallet", "picfight/pfcwallet")
	data = coinknife.Replace(data, "dcrwallet", "pfcwallet")
	data = coinknife.Replace(data, "Dcrwallet", "Pfcwallet")
	data = coinknife.Replace(data, "DCRWALLET", "PFCWALLET")

	data = coinknife.Replace(data, "decred/dcrd", "picfight/pfcd")
	data = coinknife.Replace(data, "dcrd", "pfcd")
	data = coinknife.Replace(data, "Dcrd", "Pfcd")
	data = coinknife.Replace(data, "DCRD", "PFCD")

	//data = coinknife.Replace(data, "DcrdataVersion", "PfcdataVersion")
	data = coinknife.Replace(data, "DCR", "PFC")

	//data = coinknife.Replace(data, "DecredLoading", "PicFightCoinLoading")
	//
	//data = coinknife.Replace(data, "unit of Decred", "unit of PicFight Coin")
	//data = coinknife.Replace(data, " Decred ", " PicFight Coin ")
	//
	//data = coinknife.Replace(data, "_decred_", "_picfight_")
	//
	//data = coinknife.Replace(data, "_decred", "_picfight")
	//data = coinknife.Replace(data, "decred_", "picfight_")
	//
	//data = coinknife.Replace(data, "a decred address", "a picfight wallet address")
	//data = coinknife.Replace(data, " decred ", " picfight ")

	data = coinknife.Replace(data, "https://explorer.pfcdata.org", "http://explorer.picfight.org")
	data = coinknife.Replace(data, "https://testnet.pfcdata.org", "http://testnet.picfight.org")

	data = coinknife.Replace(data, "explorer.pfcdata.org", "explorer.picfight.org")
	data = coinknife.Replace(data, "testnet.pfcdata.org", "testnet.picfight.org")

	data = coinknife.Replace(data, "e.g. Dxx", "e.g. Jxx")
	data = coinknife.Replace(data, "DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X", "JxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X")

	data = coinknife.Replace(data, `if (network === "mainnet" && addr[0] !== "D") return ERR_INVALID_ADDR_NETWORKPREFIX;`, `if (network === "mainnet" && addr[0] !== "J") return ERR_INVALID_ADDR_NETWORKPREFIX;`)

	data = coinknife.Replace(data, "Mainnet Decred addresses always begin with letter D", "Mainnet PicFight Coin addresses always begin with letter J")
	data = coinknife.Replace(data, "Testnet Decred addresses always begin with letter T", "Testnet PicFight Coin addresses always begin with letter T")

	//
	//data = coinknife.Replace(data, "Decred ", "PicFight Coin ")
	//data = coinknife.Replace(data, " Decred", " PicFight Coin")

	return data
}

// ignoredFiles
func ignoredFiles() map[string]bool {
	ignore := make(map[string]bool)
	ignore[".git"] = true
	ignore[".github"] = true
	ignore[".idea"] = true
	ignore["pfcreditbuilder"] = true
	return ignore
}

// processableFiles
func processableFiles(file string) bool {
	if strings.HasSuffix(file, ".png") {
		return false
	}
	if strings.HasSuffix(file, ".jpg") {
		return false
	}
	if strings.HasSuffix(file, ".jpeg") {
		return false
	}
	if strings.HasSuffix(file, ".exe") {
		return false
	}
	if strings.HasSuffix(file, ".svg") {
		return false
	}
	if strings.HasSuffix(file, ".ico") {
		return false
	}
	if strings.HasSuffix(file, ".bin") {
		return false
	}
	if strings.HasSuffix(file, ".bin") {
		return false
	}
	if strings.HasSuffix(file, ".db") {
		return false
	}
	if strings.HasSuffix(file, ".bz2") {
		return false
	}
	if strings.HasSuffix(file, ".gz") {
		return false
	}
	if strings.HasSuffix(file, ".hex") {
		return false
	}
	if strings.HasSuffix(file, ".mp4") {
		return false
	}
	if strings.HasSuffix(file, ".gif") {
		return false
	}
	if strings.HasSuffix(file, ".ttf") {
		return false
	}
	if strings.HasSuffix(file, ".icns") {
		return false
	}
	if strings.HasSuffix(file, ".woff") {
		return false
	}
	if strings.HasSuffix(file, ".woff2") {
		return false
	}
	if strings.HasSuffix(file, ".eot") {
		return false
	}
	if strings.HasSuffix(file, ".sum") {
		return false
	}
	if strings.HasSuffix(file, ".lock") {
		return false
	}

	//------------------------------
	if strings.HasSuffix(file, ".mod") {
		return true
	}
	if strings.HasSuffix(file, ".go") {
		return true
	}
	if strings.HasSuffix(file, ".md") {
		return true
	}

	//-
	if strings.HasSuffix(file, "api.proto") {
		return true
	}
	if strings.HasSuffix(file, ".pot") {
		return true
	}
	if strings.HasSuffix(file, ".gyp") {
		return true
	}
	if strings.HasSuffix(file, ".cc") {
		return true
	}
	if strings.HasSuffix(file, ".h") {
		return true
	}
	if strings.HasSuffix(file, "notes.sample") {
		return true
	}
	if strings.HasSuffix(file, ".desktop") {
		return true
	}
	if strings.HasSuffix(file, ".log") {
		return true
	}
	if strings.HasSuffix(file, "pfcd.service") {
		return true
	}
	if strings.HasSuffix(file, ".conf") {
		return true
	}
	if strings.HasSuffix(file, ".json") {
		return true
	}
	if strings.HasSuffix(file, ".py") {
		return true
	}
	if strings.HasSuffix(file, ".tmpl") {
		return true
	}
	if strings.HasSuffix(file, ".js") {
		return true
	}
	if strings.HasSuffix(file, ".sh") {
		return true
	}
	if strings.HasSuffix(file, ".css") {
		return true
	}
	if strings.HasSuffix(file, "LICENSE") {
		return true
	}
	if strings.HasSuffix(file, "CONTRIBUTORS") {
		return true
	}
	if strings.HasSuffix(file, "Dockerfile") {
		return true
	}
	if strings.HasSuffix(file, "Dockerfile.alpine") {
		return true
	}
	if strings.HasSuffix(file, "CHANGES") {
		return true
	}
	if strings.HasSuffix(file, ".iml") {
		return true
	}
	if strings.HasSuffix(file, ".yml") {
		return true
	}
	if strings.HasSuffix(file, ".toml") {
		return true
	}

	if strings.HasSuffix(file, ".xml") {
		return true
	}
	if strings.HasSuffix(file, ".gitignore") {
		return true
	}
	if strings.HasSuffix(file, ".editorconfig") {
		return true
	}
	if strings.HasSuffix(file, ".eslintignore") {
		return true
	}
	if strings.HasSuffix(file, ".stylelintrc") {
		return true
	}
	if strings.HasSuffix(file, "config") {
		return true
	}
	if strings.HasSuffix(file, ".html") {
		return true
	}
	if strings.HasSuffix(file, ".po") {
		return true
	}
	if strings.HasSuffix(file, ".less") {
		return true
	}

	pin.E("Unknown file type", file)
	return false
}

func fixSecp256k1Checksum(targetProject string) {
	invalidParent := filepath.Join(targetProject, "btcec")
	invalid := filepath.Join(invalidParent, "secp256k1.go")
	fileops.Delete(invalid)

	batName := "checksum_update.bat"
	batTemplate := filepath.Join("assets", batName)
	batData := fileops.ReadFileToString(batTemplate)
	batData = strings.Replace(batData, "#TARGET_FOLDER#", invalidParent, -1)
	batFile := filepath.Join(batName)
	fileops.WriteStringToFile(batFile, batData)

	ext := &commandline.ExternalProcess{
		CommandName: batFile,
	}
	ext.Launch(true)
	ext.Wait()
}
