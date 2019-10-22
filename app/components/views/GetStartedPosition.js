import { walletStartup } from "connectors";

@autobind
class GetStartedPosition extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onShowGetStarted();
  }
  render() {
    return (<Aux>sadfsdf</Aux>);
  }
}

export default walletStartup(GetStartedPosition);
