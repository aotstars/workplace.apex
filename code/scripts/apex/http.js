import { getAppUrl } from "./env.js";

export const get = function (url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getAppUrl() + url,
      crossDomain: true,
      type: "get",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-API-KEY", "CODEX@123");
      },
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

export const post_upload = function (url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getAppUrl() + url,
      crossDomain: true,
      headers: {
        "Access-Control-Allow-Origin": "http://The web site allowed to access",
        "Access-Control-Allow-Origin": "CODEX@123",
      },
      contentType: false,
      processData: false,
      type: "POST",
      data: data,
      beforeSend: function (xhr) {
        xhr.setRequestHeader("X-API-KEY", "CODEX@123");
      },
      success: function (response) {
        console.log(response);
        resolve(response);
      },
      error: function (error) {
        console.log(error);
        reject(error);
      },
    });
  });
};

export const post = function (url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getAppUrl() + url,
      crossDomain: true,
      type: "post",
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-API-KEY", "CODEX@123");
      },
      success: function (response) {
        console.log(response);
        resolve(response);
      },
      error: function (error) {
        console.log(error);
        reject(error);
      },
    });
  });
};

export const remove = function (url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getAppUrl() + url,
      crossDomain: true,
      type: "delete",
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-API-KEY", "CODEX@123");
      },
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};

export const patch = function (url, data) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: getAppUrl() + url,
      crossDomain: true,
      type: "patch",
      data: JSON.stringify(data),
      beforeSend: function (xhr) {
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("X-API-KEY", "CODEX@123");
      },
      success: function (response) {
        resolve(response);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
};
