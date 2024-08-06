export const DB_NAME = "TalkTime-db";

export const options = {
  path: "/",
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  SameSite: "None",
  secure: true,
};
