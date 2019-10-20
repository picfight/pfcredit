import Modal from "../Modal";
import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";

@autobind
class AboutModal extends React.Component {
  render() {
    const { show, onCancelModal, version, updateAvailable } = this.props;
    return (
      <Modal className="about-modal" {...{ show, onCancelModal }}>
        <div className="about-modal-icon"/>
        <div className="about-modal-content">
          <div className="about-modal-title">
            <T id="aboutModal.pfcredit" m="Pfcredit" />
          </div>
          <div className="info-modal-close-button-top" onClick={onCancelModal}/>
          <div className="about-modal-text-paragraph">
            <T id="aboutModal.paragraph1" m=""/>
          </div>
        </div>
        <div className="about-modal-bottom-area">
          <div className="about-modal-bottom-area-left">
            <T id="aboutModal.version" m="Version"/> {version} -&nbsp;
            {updateAvailable ?
              <a className="about-modal-upgrade" onClick={() => shell.openExternal("https://github.com/picfgith/picfgith-binaries/releases")}><T id="aboutModal.upgradeAvailable" m="Upgrade Available"/></a> :
              <a className="about-modal-upgrade" onClick={() => shell.openExternal("https://github.com/picfgith/picfgith-binaries/releases/tag/v"+`${version}`)}><T id="aboutModal.whatsNew" m="What's New?"/></a> }
          </div>
          <div className="about-modal-bottom-area-middle">
          </div>
          <div className="about-modal-bottom-area-right">
            <a onClick={() => shell.openExternal("https://github.com/picfight/pfcredit/blob/master/LICENSE")}><T id="aboutModal.licensing" m="Licensing information"/></a>
          </div>
        </div>
      </Modal>
    );
  }
}

export default AboutModal;
