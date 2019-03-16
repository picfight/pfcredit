import SpvSyncFormBody from "./Form";
import { getPfcwalletLastLogLine } from "wallet";
import ReactTimeout from "react-timeout";

function parseLogLine(line) {
  const res = /^[\d :\-.]+ \[...\] (.+)$/.exec(line);
  return res ? res[1] : "";
}

@autobind
class SpvSync extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    this.props.setInterval(() => {
      Promise
        .all([ getPfcwalletLastLogLine() ])
        .then(([ pfcwalletLine ]) => {
          const lastPfcwalletLogLine = parseLogLine(pfcwalletLine);
          if (lastPfcwalletLogLine !== this.lastPfcwalletLogLine)
          {
            this.lastPfcwalletLogLine = lastPfcwalletLogLine;
          }
        });
    }, 2000);
    if (this.props.walletPrivatePassphrase) {
      this.props.startSPVSync(this.props.walletPrivatePassphrase);
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  getInitialState() {
    return {
      lastPfcdLogLine: "",
      lastPfcwalletLogLine: "",
      passPhrase: "",
      hasAttemptedDiscover: false
    };
  }
  render() {
    const { passPhrase, hasAttemptedDiscover } = this.state;
    const { onSetPassPhrase, onSpvSync, onKeyDown, lastPfcwalletLogLine } = this;
    const { Form,
      firstBlockTime,
      syncFetchTimeStart,
      syncFetchHeadersLastHeaderTime,
      syncFetchHeadersComplete } = this.props;
    return (
      <SpvSyncFormBody {...{
        ...this.props,
        firstBlockTime,
        syncFetchHeadersComplete,
        syncFetchTimeStart,
        syncFetchHeadersLastHeaderTime,
        Form,
        lastPfcwalletLogLine,
        passPhrase,
        hasAttemptedDiscover,
        onSetPassPhrase,
        onSpvSync,
        onKeyDown }}/>);
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPassPhrase(passPhrase) {
    if (passPhrase != "") {
      this.setState({ hasAttemptedDiscover: true });
    }

    this.setState({ passPhrase });
  }

  onSpvSync() {
    const { passPhrase } = this.state;

    if (!passPhrase) {
      return this.setState({ hasAttemptedDiscover: true });
    }

    const { startSPVSync, onSetWalletPrivatePassphrase } = this.props;

    onSetWalletPrivatePassphrase && onSetWalletPrivatePassphrase(passPhrase);
    startSPVSync(passPhrase);
    this.resetState();
  }

  onKeyDown(e) {
    if (e.keyCode == 13) {   // Enter key
      e.preventDefault();
      this.onSpvSync();
    }
  }

}

export default ReactTimeout(SpvSync);
