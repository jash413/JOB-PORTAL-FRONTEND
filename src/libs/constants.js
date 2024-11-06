export const SERVER = process.env.GATSBY_API_URL;

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
  GET_CANDIDATE: SERVER + "/api/v1/candidates/:id",
  DOWNLOAD_RESUME: SERVER + "/api/v1/candidates/:id/resume",
  CANDIDATE_EDUCATION: SERVER + "/api/v1/education",
  UPDATE_CANDIDATE_EDUCATION: SERVER + "/api/v1/education/:id",
  CAND_EDU_DETAILS_LIST: SERVER + "/api/v1/education/get-edu-details",
};
