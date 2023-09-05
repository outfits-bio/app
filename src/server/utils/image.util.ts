import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { env } from "~/env.mjs";

export const generatePresignedUrl = async (
  userId: string,
  id?: string
): Promise<{
  url: string;
  id: string;
}> => {
  const s3 = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT,
  });

  let imageId = id ?? `${userId}-${Date.now()}`;

  let res: string;

  try {
    res = await getSignedUrl(
      s3,
      new PutObjectCommand({
        Bucket: "outfits",
        Key: `${userId}/${imageId}.png`,
        ContentType: "image/png",
      }),
      {
        expiresIn: 30,
      }
    );
  } catch (error) {
    console.error(error);

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid image!",
    });
  }

  return {
    url: res,
    id: imageId,
  };
};

export const deleteImage = async (
  userId: string,
  id: string
): Promise<void> => {
  const s3 = new S3Client({
    region: env.AWS_REGION,
    endpoint: env.AWS_ENDPOINT,
  });

  await s3.send(
    new DeleteObjectCommand({
      Bucket: "outfits",
      Key: `${userId}/${id}.png`,
    })
  );
};
