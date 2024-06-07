import DataUriParser from "datauri/parser.js";
import path from "path";

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Convert the module URL to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getDataUri = (file) => {
  if (!file) {
    throw new Error("File is undefined");
  }

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default getDataUri;


export const generateCertificate = async (name, courseName, completionDate) => {
  try {
    const fileUrl = 'https://res.cloudinary.com/dwjicc9at/image/upload/v1717760473/Untitled_yg6i89.png';  // Use your actual Cloudinary URL
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    firstPage.drawText(name, { x: 100, y: height - 200, size: 30, font, color: rgb(0, 0, 0) });
    firstPage.drawText(courseName, { x: 100, y: height - 250, size: 20, font, color: rgb(0, 0, 0) });
    firstPage.drawText(completionDate, { x: 100, y: height - 300, size: 20, font, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error('Could not generate certificate');
  }
};
