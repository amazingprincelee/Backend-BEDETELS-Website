import "dotenv/config";
import {v2 as cloudinary} from "cloudinary";
import path from "path"; 


cloudinary.config(
    {
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_KEY,
        api_secret: process.env.CLOUDINARY_SECRET
    }
);

export const isCloudinaryConnected = async () => {

    try {

      const response =  await cloudinary.api.ping();
      return response.status === "ok"
        
    } catch (error) {
        console.log("Cloudinary error, isCloudinatyConnected error", error.message);
        return false
        
    }

};



export const upload = async (file, folderName) => {
  try {
    // Get extension of the file
    const ext = path.extname(file).toLowerCase();

    // Default: images
    let resourceType = "image";

    if (
      [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt"].includes(ext)
    ) {
      resourceType = "raw"; // for documents
    } else if ([".mp4", ".mov", ".avi", ".mkv", ".webm"].includes(ext)) {
      resourceType = "video"; // for videos
    }

    const options = {
      folder: folderName,
      public_id: `${Date.now()}`, // unique id per upload
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    };

    // ✅ If it's a non-image (raw doc/pdf), force it as downloadable
    if (resourceType === "raw") {
      options.flags = "attachment";
    }

    const result = await cloudinary.uploader.upload(file, options);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
