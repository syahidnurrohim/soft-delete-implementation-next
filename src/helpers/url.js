export const getBaseURL = (path = "") => {
  const baseURL = window.location.origin;
  return new URL(path, baseURL).toString();
};
