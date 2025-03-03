/**
 * Cloudflare Images API integration
 *
 * This file contains functions to interact with Cloudflare Images API
 * for uploading, retrieving, and managing images.
 */

// Replace these with your actual Cloudflare credentials
const CLOUDFLARE_ACCOUNT_ID = import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "";
const CLOUDFLARE_API_TOKEN = import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "";
const CLOUDFLARE_IMAGES_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

/**
 * Upload an image to Cloudflare Images
 * @param file The file to upload
 * @param metadata Optional metadata for the image
 * @returns Promise with the upload result
 */
export async function uploadImageToCloudflare(
  file: File,
  metadata?: Record<string, string>,
) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    if (metadata) {
      formData.append("metadata", JSON.stringify(metadata));
    }

    const response = await fetch(CLOUDFLARE_IMAGES_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to upload image to Cloudflare",
      );
    }

    return data.result;
  } catch (error) {
    console.error("Error uploading to Cloudflare:", error);
    throw error;
  }
}

/**
 * Get a list of images from Cloudflare Images
 * @param page Page number for pagination
 * @param perPage Number of items per page
 * @returns Promise with the list of images
 */
export async function getCloudflareImages(page = 1, perPage = 100) {
  try {
    const response = await fetch(
      `${CLOUDFLARE_IMAGES_API_URL}?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to fetch images from Cloudflare",
      );
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching images from Cloudflare:", error);
    throw error;
  }
}

/**
 * Delete an image from Cloudflare Images
 * @param imageId The ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteCloudflareImage(imageId: string) {
  try {
    const response = await fetch(`${CLOUDFLARE_IMAGES_API_URL}/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message || "Failed to delete image from Cloudflare",
      );
    }

    return data.result;
  } catch (error) {
    console.error("Error deleting image from Cloudflare:", error);
    throw error;
  }
}

/**
 * Get image details from Cloudflare Images
 * @param imageId The ID of the image
 * @returns Promise with the image details
 */
export async function getCloudflareImageDetails(imageId: string) {
  try {
    const response = await fetch(`${CLOUDFLARE_IMAGES_API_URL}/${imageId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.errors?.[0]?.message ||
          "Failed to fetch image details from Cloudflare",
      );
    }

    return data.result;
  } catch (error) {
    console.error("Error fetching image details from Cloudflare:", error);
    throw error;
  }
}

/**
 * Get the URL for a Cloudflare image with optional transformations
 * @param imageId The ID of the image
 * @param variant The variant/transformation to apply (default: 'public')
 * @returns The URL for the image
 */
export function getCloudflareImageUrl(imageId: string, variant = "public") {
  return `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${imageId}/${variant}`;
}
