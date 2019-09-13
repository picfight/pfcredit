import { FormattedMessage as T } from "react-intl";
import "style/Logs.less";

const Logs = ({
  showPfcdLogs,
  showPfcwalletLogs,
  onShowPfcdLogs,
  onShowPfcwalletLogs,
  onHidePfcdLogs,
  onHidePfcwalletLogs,
  pfcdLogs,
  pfcwalletLogs,
  isDaemonRemote,
  isDaemonStarted,
  walletReady,
}
) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="logs.subtitle" m="System Logs"/></div>
    {!isDaemonRemote && isDaemonStarted ?
      !showPfcdLogs ?
        <div className="log-area hidden">
          <div className="log-area-title hidden" onClick={onShowPfcdLogs}>
            <T id="help.logs.pfcd" m="pfcd" />
          </div>
        </div>:
        <div className="log-area expanded">
          <div className="log-area-title expanded" onClick={onHidePfcdLogs}>
            <T id="help.logs.pfcd" m="pfcd" />
          </div>
          <div className="log-area-logs">
            <textarea rows="30" value={pfcdLogs} disabled />
          </div>
        </div> :
      <div/>
    }
    {!walletReady ? null : !showPfcwalletLogs ?
      <div className="log-area hidden">
        <div className="log-area-title hidden" onClick={onShowPfcwalletLogs}>
          <T id="help.logs.pfcwallet" m="pfcwallet" />
        </div>
      </div>:
      <div className="log-area expanded">
        <div className="log-area-title expanded" onClick={onHidePfcwalletLogs}>
          <T id="help.logs.pfcwallet" m="pfcwallet" />
        </div>
        <div className="log-area-logs">
          <textarea rows="30" value={pfcwalletLogs} disabled />
        </div>
      </div>
    }
  </Aux>
);

export default Logs;
