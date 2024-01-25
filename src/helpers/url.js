import { isBrowser } from "./is-browser";

export const getBaseURL = (path = "") => {
  const baseURL = isBrowser() ? window.location.origin : process.env.BASE_URL;
  return new URL(path, baseURL).toString();
};
