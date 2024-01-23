import { isBrowser } from "./is-browser.js";

export function isSmallScreen() {
  return isBrowser() && window.innerWidth < 768;
}
