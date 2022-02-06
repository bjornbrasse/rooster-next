import { v2 as cloudinary } from 'cloudinary';

export const getCloudinarySignature = (): [
  signature: string,
  timestamp: number
] => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      // eager: 'w_400,h_300,c_pad|w_260,h_200,c_crop',
      public_key: 'test',
    },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return [signature, timestamp];
};
