import { FormattedMessage as T } from "react-intl";
import { HelpLink, HelpLinkAboutModal } from "buttons";
import { DescriptionHeader } from "layout";
import "style/Help.less";

export const LinksTabHeader = () =>
  <DescriptionHeader
    description={<T id="help.description.links" m="If you have any difficulty with pfcredit, please use the following links to help find a solution." />}
  />;

export const LinksTab = () => (
  <Aux>

    <div className="tabbed-page-subtitle"><T id="help.subtitle.communications" m="Communications"/></div>
    <div className="help-icons-list">
      <HelpLink className={"help-forum-icon"} href="https://t.me/PicFightChat" title={<T id="help.telegram" m="Telegram" />} subtitle={<T id="help.telegram.subtitle" m="t.me/PicFightChat"/>}/>
      <HelpLink className={"help-forum-icon"} href="https://vk.com/picfight" title={<T id="help.forum" m="VK" />} subtitle={<T id="help.forum.subtitle" m="vk.com/picfight"/>}/>
    </div>

    <div className="tabbed-page-subtitle"><T id="help.subtitle.project" m="Project Related"/></div>
    <div className="help-icons-list">
      <HelpLink className={"help-github-icon"} href="https://github.com/picfight/" title={<T id="help.github.title" m="Github"/>} subtitle={<T id="help.github.subtitle" m="github.com/picfight/"/>} />
      <HelpLink className={"help-blockchain-explorer-icon"} href="http://explorer.picfight.org" title={<T id="help.blockchain" m=" Blockchain Explorer" />} subtitle={<T id="help.blockchain.subtitle" m="explorer.picfight.org"/>}/>
      <HelpLinkAboutModal className={"help-star-icon"}
        title={<T id="help.about.pfcredit" m="About Pfcredit"/>}
        subtitle={<T id="help.about.pfcredit.subtitle" m="Software Summary"/>}
      />
    </div>

  </Aux>
);
