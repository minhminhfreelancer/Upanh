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
 * Upload an image to Cloudflare R2 via Worker API
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

    // Use our own Worker API endpoint instead of Cloudflare Images API
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to upload image to R2 storage");
    }

    return data;
  } catch (error) {
    console.error("Error uploading to R2:", error);
    throw error;
  }
}

/**
 * Get a list of images from R2 storage via Worker API
 * @returns Promise with the list of images
 */
export async function getCloudflareImages() {
  try {
    const response = await fetch("/api/images", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch images from R2 storage");
    }

    return data.images;
  } catch (error) {
    console.error("Error fetching images from R2:", error);
    throw error;
  }
}

/**
 * Delete an image from R2 storage via Worker API
 * @param imageId The ID of the image to delete
 * @returns Promise with the deletion result
 */
export async function deleteCloudflareImage(imageId: string) {
  try {
    const response = await fetch(`/api/images/${imageId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to delete image from R2 storage");
    }

    return data;
  } catch (error) {
    console.error("Error deleting image from R2:", error);
    throw error;
  }
}

/**
 * Get image details from R2 storage via Worker API
 * @param imageId The ID of the image
 * @returns Promise with the image details
 */
export async function getCloudflareImageDetails(imageId: string) {
  try {
    // For now, we'll just return the image URL since our API doesn't have a dedicated endpoint for image details
    // In a real application, you would create a specific endpoint for this
    return {
      id: imageId,
      url: `/api/images/${imageId}`,
      variants: [`/api/images/${imageId}`],
    };
  } catch (error) {
    console.error("Error fetching image details from R2:", error);
    throw error;
  }
}

/**
 * Get the URL for an image from R2 storage
 * @param imageId The ID of the image
 * @returns The URL for the image
 */
export function getCloudflareImageUrl(imageId: string) {
  return `/api/images/${imageId}`;
}
