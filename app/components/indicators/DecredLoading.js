import "style/Loading.less";

const PicFightLoading = ({ hidden }) => (
  <div
    className={"new-logo-animation"}
    style={{ display: hidden ? "none" : "block" }}/>
);

export default PicFightLoading;
