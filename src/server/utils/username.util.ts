import Filter from "bad-words";

export const validateUsername = (username: string) => {
  const filter = new Filter();

  filter.addWords(
    // System
    "home",
    "login",
    "signup",
    "settings",
    "onboarding",
    "profile",
    "[username]",
    "explore",
    "notifications",
    "shoot",
    "shots",
    "blog",
    // Socials
    "outfitsbio",
    "outfits",
    "outfits.bio",
    "discord",
    "discordapp",
    "twitter",
    "instagram",
    "bereal",
    "tiktok",
    "tumblr",
    "patreon",
    "kofi",
    // Authentic People
    "jecta"
    // General
  );

  const usernameRegex = /^[A-Za-z0-9!@#$%&*()_+=|<>?{}\[\]~'"-]+$/;

  if (
    username.startsWith("api/") ||
    username.startsWith("settings/") ||
    username.startsWith("blog/") ||
    username.startsWith("docs/") ||
    username.startsWith("auth/") ||
    username.length < 3 ||
    !usernameRegex.test(username) ||
    filter.isProfane(username)
  )
    return false;

  return true;
};

export const filterBadWords = (text: string) => {
  const filter = new Filter();

  return filter.isProfane(text);
};
