import { get, post } from "../http.js";
import {
  get_applicant_specific_url,
  get_applicant_specific_review_url,
  post_applicant_store_eval_url,
  get_stores_url,
} from "../env.js";

let url,
  _id,
  _company,
  store_id = "";

function setupParams() {
  url = new URL(window.location.href);
  _id = url.searchParams.get("id");
  _company = url.searchParams.get("company");
  store_id = localStorage.getItem("uid");
}

async function getStoreLists() {
  try {
    const response = await get(`${get_stores_url}/${_company}`);
    if (response.status === 200) {
      await setupDropdown(response.data);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getApplicantDetails() {
  $("#preloader").removeClass("preloader-hide");

  try {
    const response = await get(
      `${get_applicant_specific_url}/${_company}/${_id}`
    );
    if (response.status === 200) {
      await getReviewDetails(response.data[0].reference_id);
      await setupResume(response.data);
    }
  } catch (err) {
    console.log(err);
  }
  $("#preloader").addClass("preloader-hide");
}

async function getReviewDetails(_ref_id) {
  $("#preloader").removeClass("preloader-hide");

  try {
    const response = await get(
      `${get_applicant_specific_review_url}/${_company}/${_ref_id}`
    );
    if (response.status === 200) {
      await setupReviews(response.data);
    }
  } catch (err) {
    console.log(err);
  }
  $("#preloader").addClass("preloader-hide");
}

function setupResume(d) {
  if (d && d.length > 0) {
    const { data } = d[0];
    let profile = d[0];

    $("#reviewer_inpt, #store_inpt").val(store_id);
    $("#applicant_inpt").val(_id);
    $("#company_inpt").val(_company);

    if (data) {
      const d = JSON.parse(data);
      shortHeader(d, profile);
      shortPersonal(d, profile);
      shortId(d, profile);
      shortEducation(d, profile);
      shortFamily(d, profile);
      shortWork(d, profile);
      shortTraining(d, profile);
      shortMedical(d, profile);
      shortHospitalization(d, profile);
      shortMedicalHistory(d, profile);
      shortOther(d, profile);
    }

    $("#submit__btn").removeAttr("disabled");
  }
}

function shortHeader(d, p) {
  const attr = ["name", "email", "address", "contact", "img"];
  let address = "";
  let name = `${d.person_fname} ${d.person_mname} ${d.person_lname}`;

  if (d) {
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

    if (
      d.person_present_address_zipcode === d.person_permanent_address_zipcode
    ) {
      address = `Permanent & Present Address: <span class="font-weight-bold">
            ${d.person_permanent_address_zipcode} ${d.person_permanent_address_street} ${d.person_permanent_address_city}
        </span>`;
    } else {
      address = `<p>Permanent<p> Address: <span class="font-weight-bold">
        ${d.person_permanent_address_zipcode} ${d.person_permanent_address_zipcode} ${d.person_permanent_address_city}
    </span>  <p>Present Address: <span class="font-weight-bold">
    ${d.person_present_address_zipcode} ${d.person_present_address_street} ${d.person_present_address_city} </span></p>`;
    }

    let attrData = {
      name: name,
      email: d.person_email,
      address: address,
      contact: d.person_contact_no_mob,
      img: p.profile,
    };
    $.each(attr, function (k, v) {
      if (v === "img") {
        $("#short-" + v).attr("src", attrData[v]);
      } else {
        $("#short-" + v).html(attrData[v]);
      }
    });
  }
}

function shortPersonal(d, p) {
  const attr = [
    "gender",
    "civil",
    "religion",
    "citizenship",
    "height",
    "weight",
    "blood",
  ];
  let attrData = {
    gender: d.person_sex,
    civil: d.person_civil_status,
    religion: d.person_rel,
    citizenship: d.person_nationality,
    height: d.person_ht,
    weight: d.person_wt,
    blood: d.person_bloodtype,
  };
  $.each(attr, function (k, v) {
    $("#short-" + v).html(
      attrData[v].charAt(0).toUpperCase() + attrData[v].slice(1)
    );
  });
}

function shortId(d, p) {
  const attr = [
    "tin",
    "sss",
    "philhealth",
    "pagibig",
    "emerg-name",
    "emerg-contact",
    "emerg-relationship",
  ];
  let attrData = {
    tin: d.person_tin,
    sss: d.person_sss,
    philhealth: d.person_phlhealth,
    pagibig: d.person_pagibig,
    "emerg-name": d.person_emergency_name,
    "emerg-contact": d.person_emergency_contact_no,
    "emerg-relationship": d.person_emergency_relationship,
  };
  $.each(attr, function (k, v) {
    $("#short-" + v).html(
      attrData[v].charAt(0).toUpperCase() + attrData[v].slice(1)
    );
  });
}

function shortEducation(d, p) {
  const attr = ["elem", "elem-award", "elem-year", "hs", "hs-award", "hs-year"];

  let attrData = {
    elem: d.educ_elem,
    "elem-award": d.educ_elem_mentions,
    "elem-year": d.educ_elem_year,
    hs: d.educ_hs,
    "hs-award": d.educ_hs_mentions,
    "hs-year": d.educ_hs_year,
  };
  if (d.educ_college_graduated.toLowerCase() === "yes") {
    $("#short-college-container").fadeIn();
    attr.push(
      "college",
      "college-awards",
      "college-status",
      "college-course",
      "college-complete"
    );
    attrData["college"] = d.educ_college;
    attrData["college-awards"] = d.educ_cl_mentions;
    attrData["college-status"] = d.educ_college_graduated;
    attrData["college-course"] = d.educ_college_course;
    attrData["college-complete"] = d.educ_college_year;
  }

  if (d.vocational_chkbox !== undefined) {
    $("#short-voc-container").fadeIn();
    attr.push("voc", "voc-awards", "voc-course", "voc-year", "voc-status");
    attrData["voc"] = d.educ_voc;
    attrData["voc-course"] = d.educ_voc_course;
    attrData["voc-year"] = d.educ_voc_year;
    attrData["voc-status"] = d.vocational_chkbox;
  }
  $.each(attr, function (k, v) {
    $("#short-" + v).html(
      attrData[v].charAt(0).toUpperCase() + attrData[v].slice(1)
    );
  });
}

function shortFamily(d, p) {
  const attr = [
    "father",
    "father-age",
    "father-dob",
    "father-occ",
    "mother",
    "mother-age",
    "mother-dob",
    "mother-occ",
    "spouse",
    "spouse-occ",
    "spouse-age",
    "spouse-child",
  ];
  let attrData = {
    father: d.person_father,
    "father-age": d.person_father_age,
    "father-dob": d.person_father_bdate,
    "father-occ": d.person_father_occ,
    mother: d.person_mother,
    "mother-age": d.person_mother_age,
    "mother-dob": d.person_mother_bdate,
    "mother-occ": d.person_mother_occ,
    spouse: d.person_spouse_name,
    "spouse-occ": d.person_spouse_occ,
    "spouse-age": d.person_spouse_age,
    "spouse-child": d.person_spouse_child,
  };

  if (d.haveSiblings_chkbox.toLowerCase() === "on") {
    $("#short-siblings-container").fadeIn();
    $.each(d.person_sibling, function (i, e) {
      $("#short-siblings-body").append(
        `<tr>
            <td class="font-weight-bold text-dark pb-0 mb-0">${
              d.person_sibling_relationship[i].charAt(0).toUpperCase() +
              d.person_sibling_relationship[i].slice(1)
            }</td>
            <td class="font-weight-bold pb-0 mb-0">${e}</td>
          </tr>`
      );
    });
  }

  $.each(attr, function (k, v) {
    $("#short-" + v).html(
      attrData[v].charAt(0).toUpperCase() + attrData[v].slice(1)
    );
  });
}

function shortWork(d, p) {
  const attr = [
    "latest-employment",
    "latest-startdate",
    "latest-enddate",
    "latest-place",
    "latest-salary",
    "latest-reason",
  ];

  let attrData = {
    "latest-employment": d.person_position,
    "latest-startdate": d.person_startDate,
    "latest-enddate": d.person_lastDate,
    "latest-place": d.person_place_work,
    "latest-salary": d.person_month_salary,
    "latest-reason": d.person_reason_for_leaving,
  };

  if (d.person_contact_name) {
    $("#short-character-container").fadeIn();
    $.each(d.person_contact_name, function (i, e) {
      $("#short-character-body").append(
        `<div class="mb-2"><div class="row mb-0">
            <div class="col-6 text-dark pb-0 mb-0">Name & Position:</div>
            <div class="col-6 font-weight-bold pb-0 mb-0">${
              e.charAt(0).toUpperCase() + e.slice(1)
            } / ${
          d.person_contact_position[i].charAt(0).toUpperCase() +
          d.person_contact_position[i].slice(1)
        }</div>
          </div>
          <div class="row mb-0">
            <div class="col-6 text-dark pb-0 mb-0">Contact No. & Address:</div>
            <div class="col-6 font-weight-bold pb-0 mb-0">
            ${d.person_contact_no[i]}
            / ${
              d.person_contact_address[i].charAt(0).toUpperCase() +
              d.person_contact_address[i].slice(1)
            }
            </div>
          </div></div>`
      );
    });
  }

  $.each(attr, function (k, v) {
    $("#short-" + v).html(
      attrData[v].charAt(0).toUpperCase() + attrData[v].slice(1)
    );
  });
}

function shortTraining(d, p) {
  const attr = [
    "training",
    "dose",
    "sponsor",
    "convicted",
    "skill",
    "recognition",
    "membership",
  ];
  let attrData = {
    training: d.person_training_course,
    dose: d.person_training_details,
    sponsor: d.person_sponsor,
    convicted: d.person_convicted,
    skill: d.person_special_skill,
    recognition: d.person_recognition,
    membership: d.person_med_membership,
  };

  $.each(attr, function (k, v) {
    $("#short-" + v).html(
      attrData[v].charAt(0).toUpperCase() + attrData[v].slice(1)
    );
  });
}

function shortMedical(d, p) {
  let attrData = {
    "med-measle": d.illness_measles,
    "med-mumps": d.illness_mumps,
    "med-chicken": d.illness_chickenpox,
    "med-rheumatic": d.illness_rheumatic,
    "med-polio": d.illness_polio,
    "med-none": d.illness_none,
  };

  $.each(attrData, function (k, v) {
    if (v !== undefined) {
      $("#short-" + k).attr("checked", "checked");
    }
  });
}

function shortHospitalization(d, p) {
  $.each(d.surgery_name, function (i, e) {
    $("#short-surgery-body").append(
      `<div class="mb-2"><div class="row mb-0">
          <div class="col-6 text-dark pb-0 mb-0">Surgeries & Hospital</div>
          <div class="col-6 font-weight-bold pb-0 mb-0">${
            e.charAt(0).toUpperCase() + e.slice(1)
          } / ${
        d.surgery_name[i].charAt(0).toUpperCase() +
        d.surgery_hospital[i].slice(1)
      }</div>
        </div>
        <div class="row mb-0">
          <div class="col-6 text-dark pb-0 mb-0">Year</div>
          <div class="col-6 font-weight-bold pb-0 mb-0">
          ${d.surgery_year[i]}
          
          </div>
        </div></div>`
    );
  });

  $.each(d.other_hosp_name, function (i, e) {
    $("#short-surgery-body").append(
      `<div class="mb-2"><div class="row mb-0">
          <div class="col-6 text-dark pb-0 mb-0">Hospitalization & Hospital</div>
          <div class="col-6 font-weight-bold pb-0 mb-0">${
            e.charAt(0).toUpperCase() + e.slice(1)
          } / ${
        d.other_hosp_name[i].charAt(0).toUpperCase() +
        d.other_hosp_hospital[i].slice(1)
      }</div>
        </div>
        <div class="row mb-0">
          <div class="col-6 text-dark pb-0 mb-0">Year</div>
          <div class="col-6 font-weight-bold pb-0 mb-0">
          ${d.other_hosp_year[i]}
          
          </div>
        </div></div>`
    );
  });
}

function shortMedicalHistory(d, p) {
  let attrData = {
    "med-alcohol-abuse": d.medHISTORY_alcohol_abuse,
    "med-anemia": d.medHISTORY_anemia,
    "med-anesthetic": d.medHISTORY_anesthetic,
    "med-anxiety": d.medHISTORY_anxiety,
    "med-asthma": d.medHISTORY_asthma,
    "med-autoimmune": d.medHISTORY_autoimmuneProblems,
    "med-birth-defect": d.medHISTORY_birthDefetchs,
    "med-bladder-problem": d.medHISTORY_bladdeProblems,
    "med-bleeding-disease": d.medHISTORY_bleedingDisease,
    "med-blood-cloth": d.medHISTORY_bloodClots,
    "med-blood-transfusion": d.medHISTORY_bloodTransfusion,
    "med-bowel-disease": d.medHISTORY_bowelDisease,
    "med-diabetes": d.medHISTORY_depresion,
    "med-depression": d.medHISTORY_diabetes,
    "med-diabetes": d.medHISTORY_hearing_impairment,
    "med-hearing": d.medHISTORY_hearing_impairment,
    "med-heart-pain": d.medHISTORY_heartAttack,
    "med-hepatitisA": d.medHISTORY_hepatitisA,
    "med-hepatitisB": d.medHISTORY_hepatitisB,
    "med-hepatitisC": d.medHISTORY_hepatitisC,
    "family-adopted": d.fam_HISTORY_adopted,
    "family-alcohol": d.fam_HISTORY_alcohol_abuse,
    "family-anemia": d.fam_HISTORY_anemia,
    "family-anesthetic": d.fam_HISTORY_anesthetic,
    "family-anxiety": d.fam_HISTORY_anxiety,
    "family-athritis": d.fam_HISTORY_athritis,
    "family-bladder-problems": d.fam_HISTORY_bladdeProblems,
    "family-bladder-disease": d.fam_HISTORY_bleedingDisease,
    "family-cancer": d.bladder,
    "family-depression": d.fam_HISTORY_depresion,
    "family-diabetes": d.fam_HISTORY_diabetes,
    "family-heart-disease": d.fam_HISTORY_heartDisease,
    "family-blood-pressue": d.fam_HISTORY_highBlood,
    "family-cholesterol": d.fam_HISTORY_cholesterol,
    "family-kidney-disease": d.fam_HISTORY_kidneyDisease,
    "family-leukemia": d.fam_HISTORY_leukemia,
    "family-respiratory-disease": d.fam_HISTORY_respiratoryDisease,
    "family-migraine": d.fam_HISTORY_migraine,
    "family-osteoporosis": d.fam_HISTORY_osteoporosis,
    "family-seizures": d.fam_HISTORY_seizures,
    "family-allergy": d.fam_HISTORY_severAllergy,
    "family-stroke": d.fam_HISTORY_stroke,
    "family-thyroid": d.famHISTORY_thyroid,
  };

  $.each(attrData, function (k, v) {
    if (v !== undefined) {
      $("#short-" + k).attr("checked", "checked");
    }
  });
}

function shortOther(d, p) {
  function filterByReferral(dt) {
    switch (dt) {
      case "A":
        return "Employee Referral";
      case "B":
        return "Government Ads (PESO/Barangay)";
      case "C":
        return "Job Portal (Indeed, Trabahanap, Jobstreet, Bestjobs, LinkedIn or etc.";
      case "D":
        return "Social Media";
      case "E":
        return "Walk-In";
      default:
        return "";
    }
  }

  let attrData = {
    intent: d.pref_objective,
    find: filterByReferral(d.person_findHiring),
    invited: d.referral_name,
  };

  if (
    d.person_landmark_address !== "" ||
    d.person_landmark_address !== undefined
  ) {
    $("#short-map").html(`<iframe
    src="${d.person_landmark_address}"
    style="border: 0"
    allowfullscreen=""
    loading="lazy"></iframe>`);
  }

  $.each(attrData, function (k, v) {
    if (v !== undefined) {
      $("#short-" + k).html(v.charAt(0).toUpperCase() + v.slice(1));
    }
  });
}

function jQFormSerializeArrToJson(formSerializeArr) {
  var jsonObj = {};
  jQuery.map(formSerializeArr, function (n, i) {
    jsonObj[n.name] = n.value;
  });

  return jsonObj;
}

/* Recruitment */

function setupReviews(d) {
  const store = d[0].store_assess;
  const recruitment = d[0].recruitment;
  if (store.length > 0) {
    var form = $("#store_review__form");
    let storeData = JSON.parse(store);
    let status =
      parseInt(storeData.assess_evaluation) === 1 ? "Passed" : "Failed";
    $("#inpt-assess_ts_name").text(storeData.assess_ts_name);
    $("#inpt-assess_store_station").text(storeData.assess_store_station);
    $("#inpt-assess_reviewed_by").text(storeData.assess_reviewed_by);
    $("#inpt-assess_evaluation").text(status);
    $("#inpt-asseess_remarks").text(storeData.asseess_remarks);
    $("#inpt-assess_name_confirmation").text(
      storeData.assess_name_confirmation
    );
    form
      .find("span.color-highlight")
      .removeClass("input-style-1-inactive")
      .addClass("input-style-1-active");
    form.find("input,select,textarea").attr("disabled", true);
    form.find("button").remove();
  }

  if (recruitment.length > 0) {
    var form = $("#form-assessment");
    let recruitmentData = JSON.parse(recruitment);
    let status =
      parseInt(recruitmentData.assess_evaluation) === 1 ? "Passed" : "Failed";

    $("input[name='assess_date']").val(recruitmentData.assess_date);
    $("input[name='assess_raw_score']").val(recruitmentData.assess_raw_score);
    $("input[name='assess_percentage']").val(recruitmentData.assess_percentage);
    $("select[name='assess_occ_test']").val(recruitmentData.assess_occ_test);
    $("input[name='assess_personality_test']").val(
      recruitmentData.assess_personality_test
    );
    $("select[name='assess_evaluation']").val(
      recruitmentData.assess_evaluation
    );
    $("input[name='asseess_remarks']").val(recruitmentData.asseess_remarks);
    $("input[name='assess_deployment_store']").val(
      recruitmentData.assess_deployment_store
    );
    $("select[name='assess_pleasing']").val(recruitmentData.assess_pleasing);
    $("select[name='assess_groom']").val(recruitmentData.assess_groom);
    $("select[name='assess_body']").val(recruitmentData.assess_body);
    $("select[name='assess_eye']").val(recruitmentData.assess_eye);
    $("select[name='assess_assertive']").val(recruitmentData.assess_assertive);
    $("select[name='assess_natural']").val(recruitmentData.assess_natural);
    $("select[name='assess_cooperative']").val(
      recruitmentData.assess_cooperative
    );
    $("select[name='assess_responsible']").val(
      recruitmentData.assess_responsible
    );
    $("select[name='assess_self_motivated']").val(
      recruitmentData.assess_self_motivated
    );
    $("select[name='assess_patience']").val(recruitmentData.assess_patience);
    $("select[name='assess_dedicated']").val(recruitmentData.assess_dedicated);
    $("select[name='assess_success_oriented']").val(
      recruitmentData.assess_success_oriented
    );
    $("select[name='assess_quick_learner']").val(
      recruitmentData.assess_quick_learner
    );
    $("select[name='assess_hard_working']").val(
      recruitmentData.assess_hard_working
    );
    $("select[name='assess_intelligent']").val(
      recruitmentData.assess_intelligent
    );
    $("select[name='assess_self_confident']").val(
      recruitmentData.assess_self_confident
    );
    $("select[name='assess_educ_training']").val(
      recruitmentData.assess_educ_training
    );
    $("select[name='assess_sales_exp']").val(recruitmentData.assess_sales_exp);
    $("select[name='assess_qualification_serv_crew_exp']").val(
      recruitmentData.assess_qualification_serv_crew_exp
    );
    $("select[name='assess_cash_exp']").val(recruitmentData.assess_cash_exp);
    $("select[name='assess_comm_skill']").val(
      recruitmentData.assess_comm_skill
    );
    $("select[name='assess_creativity']").val(
      recruitmentData.assess_creativity
    );
    $("select[name='assess_logic']").val(recruitmentData.assess_logic);
    $("select[name='assess_serv_crew_exp']").val(
      recruitmentData.assess_serv_crew_exp
    );
    $("select[name='assess_commitment']").val(
      recruitmentData.assess_commitment
    );
    $("select[name='assess_know_org']").val(recruitmentData.assess_know_org);
    $("select[name='assess_know_ind']").val(recruitmentData.assess_know_ind);
    $("select[name='assess_realistic']").val(recruitmentData.assess_realistic);
    $("select[name='assess_match_needs']").val(
      recruitmentData.assess_match_needs
    );
    $("select[name='assess_nervous']").val(recruitmentData.assess_nervous);
    $("select[name='assess_debater']").val(recruitmentData.assess_debater);
    $("select[name='assess_out_of_way']").val(
      recruitmentData.assess_out_of_way
    );
    $("select[name='assess_sensitive_criticism']").val(
      recruitmentData.assess_sensitive_criticism
    );
    $("input[name='assess_bi_date']").val(recruitmentData.assess_bi_date);
    $("input[name='assess_bi_pos_held']").val(
      recruitmentData.assess_bi_pos_held
    );
    $("input[name='assess_bi_company']").val(recruitmentData.assess_bi_company);
    $("input[name='assess_bi_contact_pers']").val(
      recruitmentData.assess_bi_contact_pers
    );
    $("input[name='assess_bi_contact_pers_pos']").val(
      recruitmentData.assess_bi_contact_pers_pos
    );
    $("input[name='assess_bi_contact_pers_no']").val(
      recruitmentData.assess_bi_contact_pers_no
    );
    $("input[name='assess_bi_appnt_startD']").val(
      recruitmentData.assess_bi_appnt_startD
    );
    $("input[name='assess_bi_appnt_to']").val(
      recruitmentData.assess_bi_appnt_to
    );
    $("select[name='assess_bi_perfm']").val(recruitmentData.assess_bi_perfm);
    $("input[name='assess_bi_rel_peers']").val(
      recruitmentData.assess_bi_rel_peers
    );
    $("input[name='assess_bi_rel_superiors']").val(
      recruitmentData.assess_bi_rel_superiors
    );
    $("input[name='assess_bi_violations_derogatory']").val(
      recruitmentData.assess_bi_violations_derogatory
    );
    $("input[name='assess_bi_rol']").val(recruitmentData.assess_bi_rol);
    $("input[name='assess_bi_add_training']").val(
      recruitmentData.assess_bi_add_training
    );
    $("input[name='assess_bi_recommended']").val(
      recruitmentData.assess_bi_recommended
    );
  }
}

function setupDropdown(d) {
  if (d) {
    var container = $("#deployment_store");
    var content = "";
    $.each(d, function (k, v) {
      content += `<option value='${v.id}'>${v.name}</option>`;
    });

    container.append(content);
  }
}

async function reviewApplicant() {
  const evalData = $("#store_review__form").serializeArray();
  const d = {
    company: _company,
    id: _id,
    reviewer: store_id,
    store_assess: JSON.stringify(jQFormSerializeArrToJson(evalData)),
    review_status: $("#store_evaluation").val(),
  };

  try {
    const response = await post(`${post_applicant_store_eval_url}`, d);
    if (response.status === 200) {
      location.reload();
    }
  } catch (err) {
    console.log(err);
  }
}

export async function init_resume() {
  $("#preloader").removeClass("preloader-hide");
  await setupParams();
  await getStoreLists();
  await getApplicantDetails();
  $("#preloader").addClass("preloader-hide");

  $("#store_review__form")
    .off()
    .on("submit", function (e) {
      e.preventDefault();
      reviewApplicant();
    });
}
