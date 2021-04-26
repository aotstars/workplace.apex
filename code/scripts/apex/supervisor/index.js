import { get, post } from "../http.js";
import { get_applicants_url, get_applicant_specific_url } from "../env.js";
const options = { year: "numeric", month: "long", day: "numeric" };

async function getApplicants() {
  $("#preloader").removeClass("preloader-hide");
  let _id = localStorage.getItem("uid");
  let _company = localStorage.getItem("company");
  try {
    const response = await get(`${get_applicants_url}/${_id}/${_company}`);
    console.log(response);
    if (response.status === 200) {
      localStorage.setItem("status", response.data[0].status);
      await setupDashbord(response.data);
    }
  } catch (err) {
    console.log(err);
  }
  $("#preloader").addClass("preloader-hide");
}

function setupDashbord(data) {
  var contentContainer = $("#supervisor-table");
  var content = "";
  if (data) {
    $.each(data, function (k, v) {
      const d = JSON.parse(v.data);
      if (
        d.person_mname !== "" ||
        d.person_mname !== undefined ||
        d.person_mname !== null
      ) {
        const check = d.person_mname.toLowerCase().replace("/", "");
        if (check === "na") {
          d.person_mname = "";
        }
      }
      let name = `${d.person_fname} ${d.person_mname} ${d.person_lname}`;
      content += `<tr>
        <th scope="row">${v.reference_id}</th>
        <td class="color-green-dark">${name}</td>
        <td>${v.job_title}</td>
        <td>${v.store_name}</td>
        <td>${new Date(v.date_created).toLocaleDateString(
          "en-us",
          options
        )}</td>
        <td><a href="index-review.html?id=${v.id}&company=${
        v.company
      }" class="btn btn-primary font-11">${
        parseInt(v.review_status) == 1
          ? "View Application"
          : "Review Application"
      }</a></td>
    </tr>`;
    });

    contentContainer.find("tbody").append(content);
  }
}

export async function init_supervisor() {
  await getApplicants();
}
