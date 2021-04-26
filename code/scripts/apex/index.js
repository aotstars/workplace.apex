import { loginPage } from "./login/index.js";
import { account } from "./accounts/index.js";
import { init_supervisor } from "./supervisor/index.js";
import { init_applicant } from "./applicant/index.js";
import { init_resume } from "./resume/index.js";
export function route(path) {
  setTimeout(function () {
    routeActive();
    switch (path) {
      case "":
      case "index":
        loginPage();
        break;
      case "index-supervisor":
        init_supervisor();
        break;
      case "index-applicant":
        init_supervisor();
        break;
      case "index-review":
        init_resume();
        break;
      default:
        break;
    }
    account();
  }, 1000);
}

export function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}

export function routeActive() {
  const path = window.location.pathname.replace("code/", "").replace("/", "");

  $("#footer-bar a").removeClass("text-active");
  if (path == "" || path == "/") {
    $("#footer-bar a[href='index-home.html']").addClass("color-highlight");
  } else if (path === "index-track.html") {
    $("#footer-bar a[href='index-details.html']").addClass("color-highlight");
  } else if (path === "index-view.html") {
    $("#footer-bar a[href='index-history.html']").addClass("color-highlight");
  } else {
    $("#footer-bar a[href='" + path + "'").addClass("color-highlight");
  }
}
