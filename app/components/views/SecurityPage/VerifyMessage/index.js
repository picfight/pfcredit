import { FormattedMessage as T, injectIntl } from "react-intl";
import VerifyMessageForm from "./Form";
import { verifyMessagePage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class VerifyMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingVerifyMessageInfo: false,
      address: "",
      addressError: null,
      message: "",
      messageError: null,
      signature: "",
      signatureError: null,
    };
  }

  componentDidMount() {
    this.props.getMessageVerificationServiceAttempt();
  }

  componentWillUnmount() {
    this.props.verifyMessageCleanStore();
  }

  render() {
    const { verifyMessageSuccess, isVerifyingMessage, intl } = this.props;
    const { address, message, signature, addressError, messageError, signatureError } = this.state;
    const { onChangeAddress, onChangeMessage, onChangeSignature, onSubmit } = this;

    let result = null;
    if (verifyMessageSuccess) {
      const isValid = verifyMessageSuccess.valid;
      let isValidDisplay = null;
      let resultClassName = "";
      if (isValid) {
        isValidDisplay = <T id="securitycenter.verify.result.valid" m="Valid signature!" />;
        resultClassName = "verify-valid";
      } else {
        isValidDisplay = <T id="securitycenter.verify.result.invalid" m="Invalid signature!" />;
        resultClassName = "verify-invalid";
      }

      result = (
        <div className={"security-center-message-result " + resultClassName}>
          {isValidDisplay}
        </div>
      );
    }

    return (
      <Aux>
        <VerifyMessageForm {...{ onSubmit, address, message, signature, addressError, messageError, signatureError, onChangeAddress, onChangeMessage, onChangeSignature, formatMessage: intl.formatMessage, isVerifyingMessage }} />
        {result}
      </Aux>
    );
  }

  onSubmit() {
    const { address, addressError, message, messageError, signature, signatureError } = this.state;
    if (addressError || messageError || signatureError) return;
    this.props.verifyMessageAttempt(address, message, signature);
  }

  onChangeAddress(address) {
    if (address == "") this.setState({ address: "", addressError: "Please enter an address" });
    else {
      this.props.validateAddress(address)
        .then( resp => {
          this.setState({ address, addressError: resp.getIsValid() ? "" : "Please enter a valid address" });
        })
        .catch( (error) => {
          console.log(error);
          this.setState({ address, addressError: "Error: Address validation failed, please try again." });
        });
    }
  }

  onChangeMessage(message){
    if (message == "") this.setState({ message: "", messageError: "Please enter a message" });
    else this.setState({ message, messageError: null });
  }

  onChangeSignature(signature) {
    if (signature == "") this.setState({ signature: "", signatureError: "Please enter a signature" });
    else this.setState({ signature, signatureError: null });
  }
}

VerifyMessage.propTypes = {
  intl: PropTypes.object.isRequired,
  getMessageVerificationServiceAttempt: PropTypes.func.isRequired,
  verifyMessageCleanStore: PropTypes.func.isRequired,
  verifyMessageError: PropTypes.string,
  verifyMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

export default verifyMessagePage(injectIntl(VerifyMessage));
