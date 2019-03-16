import ExternalLink from "./ExternalLink";

export default ({ children, path }) => (
  <ExternalLink
    href={"https://proposals.picfight.org" + (path||"")}
    hrefTestNet={"https://test-proposals.picfight.org" + (path||"")}
  >
    {children}
  </ExternalLink>
);
