import { get, post } from "../http.js";
import {
  get_applicant_jobs_url,
  get_applicant_specific_url,
  get_applicant_review_documents_url,
  get_applicant_documents,
  post_applicant_exam_log_url,
} from "../env.js";

async function getRecruitmentReview() {
  $("#preloader").removeClass("preloader-hide");
  let _id = localStorage.getItem("uid");
  let _company = localStorage.getItem("company");
  try {
    const response = await get(
      `${get_applicant_specific_url}/${_company}/${_id}`
    );
    if (response.status === 200) {
      localStorage.setItem("status", response.data[0].status);
      await setupDashbord(response.data);
    }
  } catch (err) {
    console.log(err);
  }
  $("#preloader").addClass("preloader-hide");
}

async function postExamTake(l, j, n, e) {
  $("#preloader").addClass("preloader-hide");
  let _id = localStorage.getItem("uid");

  let d = {
    job: j,
    exam: e,
    id: _id,
  };

  try {
    const response = await post(`${post_applicant_exam_log_url}`, d);
    if (response.status === 200) {
      window.open(l, "_blank");
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
  $("#preloader").removeClass("preloader-hide");
}

async function getJobs() {
  let _company = localStorage.getItem("company");

  try {
    const response = await get(`${get_applicant_jobs_url}/${_company}`);
    if (response.status === 200) {
      await setupCMS(response.data);
    }
  } catch (err) {
    console.log(err);
  }
}

function setupDashbord(d) {
  if (d && d.length > 0) {
    const { data } = d[0];
    let profile = d[0];

    if (parseInt(profile.applying_for) !== 0) {
      var jobSelect = $("#job-select");
      var examContainer = $("#exam-link");
      jobSelect.attr("disabled", "disabled");
      jobSelect.val(profile.applying_for);
      examContainer
        .find(`ul[data-exam-container='${profile.applying_for}']`)
        .fadeIn();
    }

    setupProgress(profile.status);
  } else {
  }
}

function setupProgress(status) {
  var progress = $("#progress-action");
  var progressBody = $("#progress-body");
  progressBody.find(".multisteps-form__panel").removeClass("js-active");

  const step = [1, 2, 3, 4, 5, 6];
  step.splice(0, status);
  $.each(step, function (k, v) {
    progress
      .find("button[data-step='" + v + "']")
      .removeClass("js-active")
      .attr("disabled", "disabled");
  });
  progressBody
    .find(".multisteps-form__panel[data-step='" + status + "']")
    .addClass("js-active");
}

function setupCMS(d) {
  if (d && d.length > 0) {
    var jobSelect = $("#job-select");
    var examLink = $("#exam-link");
    var examHtml = "";
    var selectHtml = "";

    if (jobSelect.length > 0) {
      $.each(d, function (k, v) {
        const jobTitle = JSON.parse(v.meta_value).title;
        selectHtml += `<option value='${v.id}'>${jobTitle}</option>`;
        const status = parseInt(localStorage.getItem("status"));
        if (status === 1 || status === 0) {
          if (v.exams && v.exams.length > 0) {
            examHtml += ` <ul class="px-0 mb-0 hidden exam-container" data-exam-container="${v.id}" >`;
            $.each(v.exams, function (i, e) {
              const { id, notice, title, link } = JSON.parse(e.meta_value);

              examHtml += `<li>
              <a href="javascript:void(0)" data-exam-id='${id}' data-job-id='${v.id}' data-job-name='${jobTitle}' data-exam='${link}' data-menu="notice" data-notice='${notice}'
                  class="mr-3 font-16 exam-link-a">${title} <i class="ml-3 fas fa-arrow-right"></i></a></li>`;
            });

            examHtml += `</ul>`;
          }
        }
      });

      examLink.html(examHtml);
      jobSelect.append(selectHtml);
    }
  }
}

function handleJobSelect(d) {
  var examContainer = $("#exam-link");
  if (d && d.length > 0) {
    examContainer.find(".exam-container").hide();
    examContainer.find(`ul[data-exam-container='${d}']`).fadeIn();
  }
}

function handleExamNotice(d) {
  if (d) {
    const { notice, examId, jobId, jobName, exam } = d;
    var popup = $("#notice");
    popup.find("#notice-details").html(notice);
    popup.find("#notice-start").attr({
      "data-exam-id": examId,
      "data-job-id": jobId,
      "data-job-name": jobName,
      "data-link": exam,
    });
    $("#popup-notice").click();
  }
}

export async function init_applicant() {
  await getJobs();
  await getApplicantDetails();

  var jobSelect = $("#job-select");
  var examClick = $(".exam-link-a");
  var examTake = $("#notice-start");

  jobSelect.on("change", function (e) {
    e.preventDefault();
    handleJobSelect($(this).val());
  });

  examClick.on("click", function (e) {
    e.preventDefault();
    const v = $(this).data();
    handleExamNotice(v);
  });

  examTake.on("click", function (e) {
    e.preventDefault();
    const { link, jobId, jobName, examId } = $(this).data();
    if (link && jobId && examId) {
      postExamTake(link, jobId, jobName, examId);
    }
  });
}
