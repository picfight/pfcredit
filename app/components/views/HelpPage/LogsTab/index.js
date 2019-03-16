import Logs from "./Page";
import { getPfcdLogs, getPfcwalletLogs, getPicFightitonLogs } from "wallet";
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
    this.getLogs();
  }

  componentDidUpdate() {
    if(this.state.interval) {
      return;
    }
    const interval = this.props.setInterval(() => {
      this.getLogs();
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
      decreditonLogs: "",
      showPfcdLogs: false,
      showPfcwalletLogs: false,
      showPicFightitonLogs: false
    };
  }

  render() {
    const { onShowPicFightitonLogs, onShowPfcdLogs, onShowPfcwalletLogs,
      onHidePicFightitonLogs, onHidePfcdLogs, onHidePfcwalletLogs
    } = this;
    return (
      <Logs
        {...{
          ...this.props,
          ...this.state,
          onShowPicFightitonLogs,
          onShowPfcdLogs,
          onShowPfcwalletLogs,
          onHidePicFightitonLogs,
          onHidePfcdLogs,
          onHidePfcwalletLogs,
        }}
      />
    );
  }

  getLogs() {
    return Promise
      .all([ getPfcdLogs(), getPfcwalletLogs(), getPicFightitonLogs() ])
      .then(([ rawPfcdLogs, rawPfcwalletLogs, decreditonLogs ]) => {
        const pfcdLogs = Buffer.from(rawPfcdLogs).toString("utf8");
        const pfcwalletLogs = Buffer.from(rawPfcwalletLogs).toString("utf8");
        if ( pfcdLogs !== this.state.pfcdLogs ) {
          this.setState({ pfcdLogs });
        }
        if ( pfcwalletLogs !== this.state.pfcwalletLogs ) {
          this.setState({ pfcwalletLogs });
        }
        if ( decreditonLogs !== this.state.decreditonLogs ) {
          this.setState({ decreditonLogs });
        }
      });
  }

  onShowPicFightitonLogs() {
    this.setState({ showPicFightitonLogs: true });
  }

  onHidePicFightitonLogs() {
    this.setState({ showPicFightitonLogs: false });
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
