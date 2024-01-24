const BASE_URL = "http://localhost:3000";

export const getAllStudents = () => {
  return fetch(BASE_URL + "/api/students");
};

export const deleteStudentById = (idToDelete) => {
  return fetch(BASE_URL + "/api/students/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: idToDelete }),
  });
};

export const getAllUniversities = () => {
  return fetch(BASE_URL + "/api/universities");
};

export const getAllBins = () => {
  return fetch(BASE_URL + "/api/bins");
};

export const postRestoreBin = (idToRestore) => {
  return fetch(BASE_URL + "/api/bins/restore", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: idToRestore }),
  });
};
