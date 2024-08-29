import express from "express";
import { single, multiple } from "../middlewares/upload.middleware";
import cloudinary from "../utils/cloudinary";
import { Request, Response } from "express";

const router = express.Router();

router.post("/upload/single", single, async (req: Request, res: Response) => {
  const file = req.file as any;

  if (!file) {
    return res.status(400).json({
      status: 400,
      message: "File is required",
    });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "files-upload" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(file.buffer);
    });

    res.status(200).json({
      status: 200,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server error",
      error,
    });
  }
});

router.post(
  "/upload/multiple",
  multiple,
  async (req: Request, res: Response) => {
    const files = req.files as any[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Files are required",
      });
    }

    try {
      const uploadPromises = files.map((file: any) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "files-upload" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      res.status(200).json({
        status: 200,
        message: "Files uploaded successfully",
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Server error",
        error,
      });
    }
  }
);

export default router;
