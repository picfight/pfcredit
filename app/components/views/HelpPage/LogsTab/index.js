import Logs from "./Page";
import { getPfcdLogs, getPfcwalletLogs } from "wallet";
import { logging } from "connectors";
import { DescriptionHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import ReactTimeout from "react-timeout";

export const LogsTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.logs" m="Please find your current logs below to look for any issue or error you are having." />}
  />;
@autobind
class LogsTabBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  componentDidMount() {
    const interval = this.props.setInterval(() => {
      Promise
        .all([ getPfcdLogs(), getPfcwalletLogs() ])
        .then(([ rawPfcdLogs, rawPfcwalletLogs ]) => {
          const pfcdLogs = Buffer.from(rawPfcdLogs).toString("utf8");
          const pfcwalletLogs = Buffer.from(rawPfcwalletLogs).toString("utf8");
          if ( pfcdLogs !== this.state.pfcdLogs )
            this.setState({ pfcdLogs });
          if ( pfcwalletLogs !== this.state.pfcwalletLogs )
            this.setState({ pfcwalletLogs });
        });
    }, 2000);
    this.setState({ interval });
  }

  componentWillUnmount() {
    this.props.clearInterval(this.state.interval);
  }

  getInitialState() {
    return {
      interval: null,
      pfcdLogs: "",
      pfcwalletLogs: "",
      picfightitonLogs: null,
      showPfcdLogs: false,
      showPfcwalletLogs: false,
      showPfcreditLogs: false
    };
  }

  render() {
    const { onShowPfcreditLogs, onShowPfcdLogs, onShowPfcwalletLogs,
      onHidePfcreditLogs, onHidePfcdLogs, onHidePfcwalletLogs
    } = this;
    const { isDaemonRemote, isDaemonStarted } = this.props;
    const {
      pfcdLogs, pfcwalletLogs, picfightitonLogs, showPfcdLogs, showPfcwalletLogs, showPfcreditLogs
    } = this.state;
    return (
      <Logs
        {...{
          ...this.props, ...this.state }}
        {...{
          showPfcreditLogs,
          showPfcdLogs,
          showPfcwalletLogs,
          onShowPfcreditLogs,
          onShowPfcdLogs,
          onShowPfcwalletLogs,
          onHidePfcreditLogs,
          onHidePfcdLogs,
          onHidePfcwalletLogs,
          pfcdLogs,
          pfcwalletLogs,
          picfightitonLogs,
          isDaemonRemote,
          isDaemonStarted
        }}
      />
    );
  }

  onShowPfcreditLogs() {
    this.setState({ showPfcreditLogs: true });
  }

  onHidePfcreditLogs() {
    this.setState({ showPfcreditLogs: false });
  }

  onShowPfcdLogs() {
    this.setState({ showPfcdLogs: true });
  }

  onHidePfcdLogs() {
    this.setState({ showPfcdLogs: false });
  }

  onShowPfcwalletLogs() {
    this.setState({ showPfcwalletLogs: true });
  }

  onHidePfcwalletLogs() {
    this.setState({ showPfcwalletLogs: false });
  }
}

export const LogsTab = ReactTimeout(logging(LogsTabBody));
