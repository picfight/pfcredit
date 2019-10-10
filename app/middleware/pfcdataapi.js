// @flow
import axios from "axios";

export const PFCDATA_URL_TESTNET = "https://testnet.pfcdata.org/api";
export const PFCDATA_URL_MAINNET = "https://explorer.picfight.org/api";

const GET = (path) => {
  return axios.get(path);
};

export const getTreasuryInfo = (daURL, treasuryAddress) => GET(daURL + "/address/" + treasuryAddress + "/totals");
