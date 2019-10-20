import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";

export const TutorialsTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.tutorials" m="Learn about the various aspects" />}
  />;

export const TutorialsTab = () => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="tutorials.subtitle" m="Tutorials"/></div>
    <div className="overview-no-tickets">
    </div>
  </Aux>
);
