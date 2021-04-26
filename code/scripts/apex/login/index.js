import { authUser, forgotPassword, redirectIfLoggedIn } from "../auth.js";

function showErrorMessage(message) {
  $("#signin-error-message").html(message);
  $("#signin-error-message").removeAttr("hidden");
}

function hideErrorMessage() {
  $("#signin-error-message").attr("hidden", true);
}

function signin() {
  authUser(
    JSON.stringify({
      email: $("#form__signin-email").val(),
      password: $("#form__signin-password").val(),
    }),
    function (response) {
      if (response.status === 200) {
        localStorage.setItem("jwt", JSON.stringify(response.data));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("uid", response.data.store_id);
        localStorage.setItem("company", response.data.company);
        localStorage.setItem("route", response.data.route.replace("/", ""));
        window.location.href = `index-${response.data.route.replace(
          "/",
          ""
        )}.html`;
      }
    },
    function (error) {
      console.log(error.responseJSON.error);
    }
  );
}

function forgot() {
  var container = $("#forgotForm");
  forgotPassword(
    JSON.stringify({
      email: container.find("#forgot_email").val(),
    }),
    function (response) {
      window.location.reload();
    },
    function (error) {
      console.log(error.responseJSON.error);
    }
  );
}

export function loginPage(route) {
  redirectIfLoggedIn();
  $("#form__signin")
    .off()
    .on("submit", function (e) {
      e.preventDefault();
      alert(true);
      signin();
    });

  $("#signUpForm").on("submit", function (e) {
    e.preventDefault();
    if ($("#signUpAgreementCheckBox").is(":checked")) {
      $("#notification-1").toast("hide");
      signup($(this));
    } else {
      // $('#notification-1').removeClass('hidden');
      $("#notification-1").toast("show");
    }
  });

  $("#forgotForm").on("submit", function (e) {
    e.preventDefault();
    forgot($(this));
  });
}
