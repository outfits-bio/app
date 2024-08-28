export const formatAvatar = (image?: string | null, userId?: string) => {
  if (!image || !userId) {
    return "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
  }

  return image.startsWith("https://")
    ? image
    : `https://pub-4bf8804d3efc464b862de36f974618d4.r2.dev/${userId}/${image}.png`;
};

export const formatImage = (image?: string | null, userId?: string) => {
  if (!image || !userId) return "";

  return `https://pub-4bf8804d3efc464b862de36f974618d4.r2.dev/${userId}/${image}.png`;
};
