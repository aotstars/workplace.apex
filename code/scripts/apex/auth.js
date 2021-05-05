import { getAppUrl, login_url, forgot_url, logout_url } from "./env.js";

export function authUser(credentials, success, error) {
  $.ajax({
    url: getAppUrl() + login_url,
    crossDomain: true,
    type: "post",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-API-KEY", "CODEX@123");
    },
    data: JSON.parse(credentials),
    success: success,
    error: error,
  });
}

export async function forgotPassword(data, success, error) {
  $.ajax({
    url: getAppUrl() + forgot_url,
    crossDomain: true,
    type: "post",
    dataType: "json",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("X-API-KEY", "CODEX@123");
    },
    data: JSON.parse(data),
    success: success,
    error: error,
  });
}

export async function signOutTemporary() {
  localStorage.removeItem("route");
  localStorage.removeItem("jwt");
  localStorage.removeItem("uid");
  localStorage.removeItem("company");
  localStorage.removeItem("token");
  localStorage.removeItem("status");
}

export async function signOut() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getAppUrl() + logout_url,
      crossDomain: true,
      type: "get",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("X-API-KEY", "CODEX@123");
      },
      success: function (response) {
        localStorage.removeItem("route");
        localStorage.removeItem("jwt");
        localStorage.removeItem("uid");
        localStorage.removeItem("company");
        localStorage.removeItem("token");
        localStorage.removeItem("status");
        resolve(response);
      },
      error: function (error) {
        console.log(error);
        reject(error);
      },
    });
  });
}

export function authPage() {
  if (localStorage.getItem("jwt") === null) {
    window.location.href = "/";
  }
}

export function redirectIfLoggedIn() {
  console.log(localStorage.getItem("jwt"));
  if (localStorage.getItem("jwt") !== null) {
    window.location.href = `index-${localStorage.getItem("route")}.html`;
  }
}
