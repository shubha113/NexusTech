import DataUriParser from "datauri/parser.js";
import path from "path";

import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
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


const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return rgb(r / 255, g / 255, b / 255);
};

export const generateCertificate = async (name, courseName) => {
  try {
    const fileUrl = 'https://res.cloudinary.com/dwjicc9at/image/upload/v1717785177/Untitled_1_iqcdwn.pdf';  // Use your actual Cloudinary URL
    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Replace these with the exact coordinates and color codes
    const nameX = 380; // X coordinate for name
    const nameY = 235; // Y coordinate for name
    const courseX = 241; // X coordinate for course name
    const courseY = 158; // Y coordinate for course name
    const dateX = 320; // X coordinate for date
    const dateY = 180; // Y coordinate for date

    const nameColor = hexToRgb('#F15A29'); // Replace with actual hex color code for the name
    const courseColor = hexToRgb('#0056A6'); // Replace with actual hex color code for the course

    firstPage.drawText(name, { x: nameX, y: nameY, size: 40, font: boldFont, color: nameColor });
    firstPage.drawText(courseName, { x: courseX, y: courseY, size: 20, font: boldFont, color: courseColor });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw new Error('Could not generate certificate');
  }
};
