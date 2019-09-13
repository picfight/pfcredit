import { FormattedMessage as T } from "react-intl";
import { HelpLink, HelpLinkInfoModal, HelpLinkAboutModal } from "buttons";
import { ConstitutionModalContent } from "modals";
import { DescriptionHeader } from "layout";
import "style/Help.less";

export const LinksTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.links" m="If you have any difficulty with pfcredit, please use the following links to help find a solution." />}
  />;

export const LinksTab = () => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="help.subtitle.project" m="Project Related"/></div>
    <div className="help-icons-list">
      <HelpLink className={"help-github-icon"} href="https://github.com/picfight/pfcredit" title={<T id="help.github.title" m="Github"/>} subtitle={<T id="help.github.subtitle" m="github.com/picfight/pfcredit"/>} />
      <HelpLink className={"help-docs-icon"} href="https://docs.picfight.org/" title={<T id="help.documentation" m="Documentation" />} subtitle={<T id="help.documentation.subtitle" m="docs.picfight.org"/>}/>
      <HelpLink className={"help-stakepools-icon"} href="https://picfight.org/stakepools" title={<T id="help.stakepools" m=" Stakepools" />} subtitle={<T id="help.stakepools.subtitle" m="picfight.org/stakepools"/>}/>
      <HelpLink className={"help-blockchain-explorer-icon"} href="https://explorer.pfcdata.org" title={<T id="help.blockchain" m=" Blockchain Explorer" />} subtitle={<T id="help.blockchain.subtitle" m="explorer.pfcdata.org"/>}/>
      <HelpLinkInfoModal className={"help-constitution-icon"}
        title={<T id="help.constitution" m="Constitution"/>}
        subtitle={<T id="help.constitution.subtitle" m="Picfight Project Constitution"/>}
        modalTitle={<h1><T id="help.constitution.modal.title" m="Picfight Constitution" /></h1>}
        modalContent={<ConstitutionModalContent />}
        double
      />
      <HelpLinkAboutModal className={"help-star-icon"}
        title={<T id="help.about.pfcredit" m="About Pfcredit"/>}
        subtitle={<T id="help.about.pfcredit.subtitle" m="Software Summary"/>}
      />
    </div>
    <div className="tabbed-page-subtitle"><T id="help.subtitle.communications" m="Communications"/></div>
    <div className="help-icons-list">
      <HelpLink className={"help-slack-icon"} href="https://slack.picfight.org" title={<T id="help.slack" m="Slack" />} subtitle={<T id="help.slack.subtitle" m="slack.picfight.org"/>}/>
      <HelpLink className={"help-rocketchat-icon"} href="https://rocketchat.picfight.org" title={<T id="help.rocketchat" m="RocketChat" />} subtitle={<T id="help.rocketchat.subtitle" m="rocketchat.picfight.org"/>}/>
      <HelpLink className={"help-matrix-icon"} href="https://riot.im/app/#/login" title={<T id="help.matrix" m="Matrix Chat" />} subtitle={<T id="help.matrix.subtitle" m="riot.im"/>}/>
      <HelpLink className={"help-forum-icon"} href="https://t.me/picfight" title={<T id="help.telegram" m="Telegram" />} subtitle={<T id="help.telegram.subtitle" m="t.me/picfight"/>}/>
      <HelpLink className={"help-forum-icon"} href="https://forum.picfight.org" title={<T id="help.forum" m="Forum" />} subtitle={<T id="help.forum.subtitle" m="forum.picfight.org"/>}/>
    </div>
  </Aux>
);
