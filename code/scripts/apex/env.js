export const login_url = "/internal/v1/auth/login";
export const validate_url = "/internal/auth/validate";
export const forgot_url = "/internal/auth/forgot";
export const logout_url = "/auth/sign-out";
export const reset_url = "/internal/auth/reset";

export const get_applicants_url = "/internal/stores/ts";
export const get_applicant_jobs_url = "/internal/system/jobs";
export const get_applicant_specific_url = "/internal/record/specific";
export const get_stores_url = "/internal/stores/";
export const get_applicant_specific_review_url =
  "/internal/record/ts/specific/reviews";
export const get_applicant_review_documents_url =
  "/internal/record/specific/reviews/documents";
export const get_applicant_documents = "/internal/record/documents";
export const post_applicant_exam_log_url = "/internal/record/exam";
export const post_applicant_store_eval_url =
  "/internal/record/review_store_app";

export function getAppUrl() {
  const hostname = window.location.hostname;
  // const devUrl = "http://staging.api.sparkles.com.ph";
  //const devUrl = "http://localhost:8080/webservice-hr-api";
  const devUrl = "https://api.starjobs.com.ph/webservice-hr-api";
  const prodUrl = "https://api.starjobs.com.ph/webservice-hr-api";

  if (hostname === "127.0.0.1" || hostname === "localhost") {
    return devUrl;
  } else {
    return prodUrl;
  }
}
