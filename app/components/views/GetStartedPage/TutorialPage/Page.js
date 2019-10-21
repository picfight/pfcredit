import { InvisibleButton } from "buttons";
import "style/Tutorial.less";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { onboard04 } from "assets/videos";

const docByStep = {
  0: "GetStartedTutorialPage01",
};

const videosByStep = {
  0: onboard04,
};

const TutorialPage = ({ tutorialStep, finishTutorial }) => {
  return (
    <div className="getstarted-tutorial">
      <div className={"tutorial-side step-" + tutorialStep}>
        <video autoPlay loop src={videosByStep[tutorialStep]} width="100%" />
      </div>

      <div className="tutorial-main">
        <div className="tutorial-main-text">
          <Documentation name={docByStep[tutorialStep]} />
        </div>

        <div className="tutorial-main-toolbar">
          <InvisibleButton className="skip-button" onClick={finishTutorial}>
            <T id="tutorial.finishBtn" m={"Finish"}/>
          </InvisibleButton>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
