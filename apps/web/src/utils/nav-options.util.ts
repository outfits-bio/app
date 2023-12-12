export const showSlash = (pathname: string) => {
  const paths = ["/"];

  if (paths.includes(pathname)) return false;

  return true;
};

export const showActions = (pathname: string) => {
  const paths = ["/", "/onboarding"];

  if (paths.includes(pathname)) return false;

  return true;
};

export const showSearch = (pathname: string) => {
  const paths = ["/onboarding"];

  if (paths.includes(pathname)) return false;

  return true;
};
