import { LinksTab, LinksTabHeader } from "./LinksTab";
import { LogsTab, LogsTabHeader } from "./LogsTab";
import { TutorialsTab, TutorialsTabHeader } from "./TutorialsTab";
import { TabbedPage, TabbedPageTab as Tab, TitleHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { Switch, Redirect } from "react-router-dom";
import { AboutModalButton } from "buttons";
import { helpPage } from "connectors";

const HelpPageHeader = ({ appVersion, updateAvailable }) =>
  <TitleHeader
    iconClassName="help"
    title={<T id="help.title" m="Help" />}
    optionalButton={
      <AboutModalButton
        version={appVersion}
        updateAvailable={updateAvailable}
        buttonLabel={<T id="help.about" m="About Pfcredit" />}
      />}
  />;

const HelpPage = ({ appVersion, updateAvailable }) =>
  <TabbedPage header={<HelpPageHeader appVersion={appVersion} updateAvailable={updateAvailable} />}>
    <Switch><Redirect from="/help" exact to="/help/links" /></Switch>
    <Tab path="/help/links" component={LinksTab} header={LinksTabHeader} link={<T id="help.tab.links" m="Links"/>}/>
    <Tab path="/help/tutorials" component={TutorialsTab} header={TutorialsTabHeader} link={<T id="help.tab.tutorials" m="Tutorials"/>}/>
    <Tab path="/help/logs" component={LogsTab} header={LogsTabHeader} link={<T id="help.tab.logs" m="Logs"/>}/>
  </TabbedPage>;

export default helpPage(HelpPage);
