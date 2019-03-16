import { KeyBlueButton } from "buttons";
import { ShowError } from "shared";
import { FormattedMessage as T } from "react-intl";
import { getPfcdLastLogLine, getPfcwalletLastLogLine } from "wallet";
import ReactTimeout from "react-timeout";
import "style/GetStarted.less";

function parseLogLine(line) {
  const res = /^[\d :\-.]+ \[...\] (.+)$/.exec(line);
  return res ? res[1] : "";
}

const LastLogLinesFragment = ({ lastPfcdLogLine, lastPfcwalletLogLine }) => (
  <div className="get-started-last-log-lines">
    <div className="last-pfcd-log-line">{lastPfcdLogLine}</div>
    <div className="last-pfcwallet-log-line">{lastPfcwalletLogLine}</div>
  </div>
);

const StartupErrorFragment = ({ onRetryStartRPC }) => (
  <div className="advanced-page-form">
    <div className="advanced-daemon-row">
      <ShowError className="get-started-error" error="Connection to pfcd failed, please try and reconnect." />
    </div>
    <div className="loader-bar-buttons">
      <KeyBlueButton className="get-started-rpc-retry-button" onClick={onRetryStartRPC}>
        <T id="getStarted.retryBtn" m="Retry" />
      </KeyBlueButton>
    </div>
  </div>
);

@autobind
class StartRPCBody extends React.Component {

  constructor(props) {
    super(props);
    this.state = { lastPfcdLogLine: "", lastPfcwalletLogLine: "" };
  }

  componentDidMount() {
    this.props.setInterval(() => {
      Promise
        .all([ getPfcdLastLogLine(), getPfcwalletLastLogLine() ])
        .then(([ pfcdLine, pfcwalletLine ]) => {
          const lastPfcdLogLine = parseLogLine(pfcdLine);
          const lastPfcwalletLogLine = parseLogLine(pfcwalletLine);
          if ( lastPfcdLogLine !== this.state.lastPfcdLogLine ||
              lastPfcwalletLogLine !== this.state.lastPfcwalletLogLine)
          {
            this.setState({ lastPfcdLogLine, lastPfcwalletLogLine });
          }
        });
    }, 2000);
  }

  render () {
    const { startupError, getCurrentBlockCount } = this.props;

    return (
      <Aux>
        {!getCurrentBlockCount && <LastLogLinesFragment {...this.state} />}
        {startupError && <StartupErrorFragment {...this.props} />}
      </Aux>
    );
  }
}

export default ReactTimeout(StartRPCBody);
