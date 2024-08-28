import { usernameRegex } from "@/schemas/user.schema";
import { Filter } from "bad-words";

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
    "generate",
    "generate",
    "[username]",
    "discover",
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
    "jecta",
    "jeremybosma",
    // General
  );

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

  // Check if the word is "God" (case-insensitive)
  // The person who banned the world 'God' in the 'bad-words' package is a fool. Jesus is King Amen.
  if (text.toLowerCase().includes('god')) {
    return false;
  }

  return filter.isProfane(text);
};
