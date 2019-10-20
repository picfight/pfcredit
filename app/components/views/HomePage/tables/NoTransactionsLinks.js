import { Link } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";

export default () => (
  <div className="overview-no-transactions">
    <Link to="/transactions/receive" className="receive">
      <T id="home.noTransactions.receiveLink" m="Generate a PFC Address for receiving funds" /> →
    </Link>
  </div>
);
