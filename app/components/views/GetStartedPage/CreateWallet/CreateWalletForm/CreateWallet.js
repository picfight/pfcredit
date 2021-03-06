import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { SeedCopyConfirmModal } from "modals";
import { LoaderBarBottom } from "indicators";
import { Documentation } from "shared";
import { BackBtnMsg, CreateWalletTitleMsg } from "../../messages";
import "style/CreateWalletForm.less";

const CreateWallet = ({
  mnemonic,
  createWalletConfirmNewSeed,
  handleCopySeed,
  showCopySeedConfirm,
  onCancelCopySeedConfirm,
  onSubmitCopySeedConfirm,
  onReturnToWalletSelection,
  getCurrentBlockCount,
  getNeededBlocks,
  getEstimatedTimeLeft,
  getDaemonSynced,
}) => (
  <Aux>
    <div className="getstarted content">
      <div className="go-back-screen-button-area">
        <div className="go-back-screen-button" onClick={onReturnToWalletSelection}/>
      </div>
      <div className="content-title">
        <CreateWalletTitleMsg />
      </div>
      <Documentation name="WalletCreationWarning" className="create-wallet-warning" />
      <div className="seedArea">
        {mnemonic.split(" ").map((word, i) => {
          return (
            <div key={i} className="seedWord">
              {word}
            </div>
          );
        })}
        <div className="copy" onClick={handleCopySeed}>
          <T id="createWallet.copy" m="Copy seed words to clipboard" />
        </div>
      </div>
      <div className="toolbar">
        <KeyBlueButton className="wallet-key-blue-button" onClick={createWalletConfirmNewSeed}>
          <T id="createWallet.continueBtn" m="Continue" />
        </KeyBlueButton>
        <InvisibleButton
          className="go-back-button"
          onClick={onReturnToWalletSelection}>
          <BackBtnMsg />
        </InvisibleButton>
      </div>
      <LoaderBarBottom  {...{ getCurrentBlockCount, getNeededBlocks, getEstimatedTimeLeft, getDaemonSynced }}  />
    </div>
    <SeedCopyConfirmModal
      show={showCopySeedConfirm}
      onSubmit={onSubmitCopySeedConfirm}
      onCancelModal={onCancelCopySeedConfirm}
    />
  </Aux>
);

export default CreateWallet;
