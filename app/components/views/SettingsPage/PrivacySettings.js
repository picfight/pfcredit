import { FormattedMessage as T } from "react-intl";
import {
  EXTERNALREQUEST_NETWORK_STATUS, EXTERNALREQUEST_PFCDATA,
} from "main_dev/externalRequests";

const AllowableRequestType = ({ id, label, description, checked, onChange }) => (
  <div className="settings-row settings-row-checklist">
    <div className="settings-label">
      {label}
    </div>
    <div className="privacy-checkbox">
      <input id={id} type="checkbox" checked={checked} onChange={onChange}/>
      <label htmlFor={id}></label>
    </div>
    <div className="settings-checklist-description">
      {description}
    </div>
  </div>
);

const PrivacySettings = ({
  tempSettings,
  onChangeTempSettings
}) => {
  const toggle = (value) => () => {
    const allowedExternalRequests = [ ...tempSettings.allowedExternalRequests ];
    const idx = allowedExternalRequests.indexOf(value);
    if (idx > -1) {
      allowedExternalRequests.splice(idx, 1);
    } else {
      allowedExternalRequests.push(value);
    }
    onChangeTempSettings({ allowedExternalRequests });
  };

  return (
    <div className="settings-privacy">
      <div className="settings-column-title"><T id="settings.privacy.title" m="Privacy" /></div>
      <div className="settings-column-content">
        <AllowableRequestType
          label={<T id="settings.privacy.networkStatus.label" m="Network Information" />}
          id="networking"
          description={<T id="settings.privacy.networkStatus.description" m="General network information (block height, etc) from picfight.org" />}
          checked={tempSettings.allowedExternalRequests.indexOf(EXTERNALREQUEST_NETWORK_STATUS) > -1}
          onChange={toggle(EXTERNALREQUEST_NETWORK_STATUS)}
        />
        <AllowableRequestType
          label={<T id="settings.privacy.pfcdata.label" m="PicFight Coin Block Explorer" />}
          id="pfcdata"
          description={<T id="settings.privacy.pfcdata.description" m="Access chain information from explorer.picfight.org" />}
          checked={tempSettings.allowedExternalRequests.indexOf(EXTERNALREQUEST_PFCDATA) > -1}
          onChange={toggle(EXTERNALREQUEST_PFCDATA)}
        />
      </div>
    </div>
  );
};

export default PrivacySettings;
