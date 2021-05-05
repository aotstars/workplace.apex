import { resetPassword } from "../auth.js";

function validateToken() {
  const _url = window.location.href.split("/");

  const _email = _url[3].split("?")[1];
  const _token = _url[4];

  if (_token === null || _email === undefined) {
    alert("Your reset password has expired...");
    window.location.href = "/";
  }

  $("#reset_token").val(_token);
  $("#reset_email").val(_email);
}

async function reset() {
  var container = $("#resetForm");
  const _validatePassword = $("#reset_password").val();
  const _validatePasswordConfirm = $("#reset_password_confirm").val();
  if (!validatePassword(_validatePassword, _validatePasswordConfirm)) {
    alert("Please provide a minimum 6 characters for your password.");
    return false;
  }

  await resetPassword(
    JSON.stringify({
      email: container.find("#reset_email").val(),
      password: container.find("#reset_password").val(),
      hash: container.find("#reset_token").val(),
    }),
    function (response) {
      console.log(response.length, response);
      if (response.length === 0)
        return alert(
          "Change password request has expired. Kindly request a new one"
        );

      alert("Change password success");
      window.location.href = "/";
    },
    function (error) {
      console.log(error.responseJSON.error);
    }
  );
}

function validatePassword(p, cp) {
  if (p === undefined || (p === null && cp === undefined) || cp === null) {
    return false;
  }

  if (p.length < 6 && cp.length < 6) {
    return false;
  }

  return true;
}

export function init_reset_password() {
  validateToken();
  var delay = (function () {
    var timer = 0;
    return function (callback, ms) {
      clearTimeout(timer);
      timer = setTimeout(callback, ms);
    };
  })();

  $("#reset_password_confirm").keyup(function () {
    const _validatePassword = $("#reset_password").val();
    const _validatePasswordConfirm = $(this).val();
    delay(function () {
      if (_validatePassword !== _validatePasswordConfirm) {
        alert("Password and Confirm password doesn't match");
        return false;
      }
    }, 1000);
  });

  $("#resetForm").on("submit", function (e) {
    e.preventDefault();
    reset($(this));
  });
}
