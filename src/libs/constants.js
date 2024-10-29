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
};
