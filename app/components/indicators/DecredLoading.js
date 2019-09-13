import "style/Loading.less";

const PicfightLoading = ({ hidden }) => (
  <div
    className={"new-logo-animation"}
    style={{ display: hidden ? "none" : "block" }}/>
);

export default PicfightLoading;
