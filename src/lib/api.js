const BASE_URL = "http://localhost:3000";

export const getAllStudents = () => {
  return fetch(BASE_URL + "/api/students");
};

export const getAllUniversities = () => {
  return fetch(BASE_URL + "/api/universities");
};
