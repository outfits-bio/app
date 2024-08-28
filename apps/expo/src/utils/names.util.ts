import { PostType } from "@acme/db";

/**
 * This isn't SOLID, I'm sorry Uncle Bob :(
 * @param type PostType
 * @returns strings
 */
export const getPostTypeName = (type: PostType): string => {
  switch (type) {
    case PostType.OUTFIT:
      return "Outfits";
    case PostType.HOODIE:
      return "Outerwear";
    case PostType.SHIRT:
      return "Tops";
    case PostType.PANTS:
      return "Bottoms";
    case PostType.SHOES:
      return "Footwear";
    case PostType.WATCH:
      return "Accessories";
    case PostType.GLASSES:
      return "Glasses";
    case PostType.HEADWEAR:
      return "Headwear";
    case PostType.JEWELRY:
      return "Jewelry";
  }
};

