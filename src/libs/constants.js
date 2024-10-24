export const SERVER = process.env.GATSBY_API_URL;

export const REQ = {
  REFRESH_TOKEN: SERVER + "/auth/refresh-token",
  REGISTER_USER: SERVER + "/api/v1/auth/register",
  LOGIN_USER: SERVER + "/api/v1/auth/login",
};
