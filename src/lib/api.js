import { getBaseURL } from "@/helpers/url";

const BASE_URL = getBaseURL();

export const getAllStudents = () => {
  return fetch(BASE_URL + "/api/students");
};

export const bulkDeleteStudentById = (bulkIdToDelete) => {
  return fetch(BASE_URL + "/api/students/delete/bulk", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: bulkIdToDelete }),
  });
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

export const putEditStudent = (data) => {
  return fetch(BASE_URL + "/api/students", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

export const postAddStudent = (data) => {
  return fetch(BASE_URL + "/api/students", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
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
