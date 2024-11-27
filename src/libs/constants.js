export const SERVER = process.env.GATSBY_API_URL;
export const PROD_SERVER = process.env.GATSBY_PROD_API_URL;
export const TINYMCE_API_KEY = process.env.GATSBY_TINYMCE_API_KEY;
export const GOOGLE_MAPS_API_KEY = process.env.GATSBY_GOOGLE_MAPS_API_KEY;

export const REQ = {
  REFRESH_TOKEN: SERVER + "/auth/refresh-token",
  REGISTER_USER: SERVER + "/api/v1/auth/register",
  LOGIN_USER: SERVER + "/api/v1/auth/login",
  SEND_OTP: SERVER + "/api/v1/auth/send-phone-otp",
  VERIFY_OTP: SERVER + "/api/v1/auth/verify-phone",
  SEND_EMAIL_VERIFY: SERVER + "/api/v1/auth/send-email-verification",
  VERIFY_EMAIL: SERVER + "/api/v1/auth/verify-email",
  FORGET_PASSWORD: SERVER + "/api/v1/auth/forgot-password",
  RESET_PASSWORD: SERVER + "/api/v1/auth/reset-password",
  PROFILE_DETAILS: SERVER + "/api/v1/auth/profile",
  CHANGE_PASSWORD: SERVER + "/api/v1/auth/change-password",
  JOB_CATEGORIES: SERVER + "/api/v1/job-categories/get-job-categories",
  CREATE_CANDIDATE: SERVER + "/api/v1/candidates",
  GET_CANDIDATE: SERVER + "/api/v1/candidates",
  CREATE_EXPERIENCE: SERVER + "/api/v1/experience",
  CANDIDATE_EXP_LIST: SERVER + "/api/v1/experience/candidate",
  GET_CANDIDATE: SERVER + "/api/v1/candidates/:id",
  DOWNLOAD_RESUME: (can_id) =>
    PROD_SERVER + `/api/v1/candidates/${can_id}/resume`,
  DOWNLOAD_PROFILE_IMG: (can_id) =>
    PROD_SERVER + `/api/v1/candidates/${can_id}/profile-image`,
  CANDIDATE_EDUCATION: SERVER + "/api/v1/education",
  UPDATE_CANDIDATE_EDUCATION: SERVER + "/api/v1/education/:id",
  CAND_EDU_DETAILS_LIST: SERVER + "/api/v1/education/get-edu-details",
  UPDATE_EXPERIENCE: (exp_id) => SERVER + `/api/v1/experience/${exp_id}`,
  DELETE_EXPERIENCE: (exp_id) => SERVER + `/api/v1/experience/${exp_id}`,
  GET_JOB_DETAILS: (job_id) => SERVER + `/api/v1/job-posts/${job_id}`,
  UPDATE_JOB_DETAILS: (job_id) => SERVER + `/api/v1/job-posts/${job_id}`,
  CREATE_EMPLOYER: SERVER + "/api/v1/employers",
  GET_EMPLOYERS: SERVER + "/api/v1/employers/:id",
  UPDATE_EMP_PROFILE: SERVER + "/api/v1/auth/edit-profile",
  CREATE_JOBPOST: SERVER + "/api/v1/job-posts",
  UPDATE_JOBPOST: SERVER + "/api/v1/job-posts/:id",
  GET_JOBPOST_RECORDS: SERVER + "/api/v1/job-posts/get-job-posts",
  GET_APPLICATIONS_EMPLOYER:
    SERVER + "/api/v1/job-applications/for-each-employer",
  UPDATE_APPLICATION_STATUS: (applicationId) =>
    SERVER + `/api/v1/job-applications/application/${applicationId}/status`,
  GET_GOOGLE_USER: SERVER + "/api/v1/auth/google",
  GET_NOT_ACCESSIBLE_CANDIDATES:
    SERVER + "/api/v1/employers/get-not-accessible-candidates",
  SEND_REQUEST_ACCESS: SERVER + "/api/v1/employers/request-access",
  GET_ACCESS_REQUEST_LIST: SERVER + "/api/v1/employers/get-access-requests",
  GET_JOBS_LIST_CANDIDATE:
    SERVER + "/api/v1/job-posts/get-job-posts-accessible-to-candidate",
  JOB_APPLIED: SERVER + "/api/v1/job-applications/apply",
  GET_EMPLOYER_DASHBOARD_STATS: SERVER + "/api/v1/employers/dashboard-data",
  GET_CANDIDATE_APPLICATIONS:
    SERVER + "/api/v1/job-applications/candidate-applications",
  GET_LOCATIONS_PLACEHOLDER: (value) =>
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      value
    )}&key=${GOOGLE_MAPS_API_KEY}`,
};
