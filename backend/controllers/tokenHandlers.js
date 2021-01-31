export const setRefreshCookie = (res, token) => {
  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
  });
};
