/**
 * Cloudinary configuration and helpers.
 * Mostly client-side via next-cloudinary, but this file can hold
 * server-side utility functions if needed.
 */

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_CONFIG = {
  cloudName,
  uploadPreset: "unsigned_preset",
};
