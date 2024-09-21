import multer from "multer";
import { fromBuffer } from "pdf2pic";
import Tesseract from "tesseract.js";
import mammoth from "mammoth";

const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("document");

export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileBuffer = req.file.buffer;
  const mimeType = req.file.mimetype;

  try {
    // Handle PDF files
    if (mimeType === "application/pdf") {
      const options = {
        density: 300,
        format: "png",
        width: 1654,
        height: 2339,
        quality: 100,
      };

      const pdfToPic = fromBuffer(fileBuffer, options);
      const pageImages = await pdfToPic(1);
      const imagePath = pageImages.path;

      const {
        data: { text },
      } = await Tesseract.recognize(imagePath, "eng");
      return res.send({ text });
    }

    // Handle DOCX files
    if (
      mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const { value: text } = await mammoth.extractRawText({
        buffer: fileBuffer,
      });
      return res.send({ text });
    }

    // Handle image files
    if (mimeType.startsWith("image/")) {
      const {
        data: { text },
      } = await Tesseract.recognize(fileBuffer, "eng");
      return res.send({ text });
    }

    res
      .status(400)
      .send("Unsupported file type. Please upload a PDF, DOCX, or an image.");
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).send("Error processing file.");
  }
};
