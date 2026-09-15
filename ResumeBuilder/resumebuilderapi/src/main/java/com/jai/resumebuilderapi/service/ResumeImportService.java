package com.jai.resumebuilderapi.service;

import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ResumeImportService {

    // ================= IMPORT RESUME =================

    public String extractText(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Please select a resume file."
            );
        }

        String fileName = file.getOriginalFilename();

        if (fileName == null) {
            throw new IllegalArgumentException(
                    "Invalid file name."
            );
        }

        String lowerFileName =
                fileName.toLowerCase();

        // ================= PDF =================

        if (lowerFileName.endsWith(".pdf")) {

            try (
                var document =
                        Loader.loadPDF(file.getBytes())
            ) {

                PDFTextStripper stripper =
                        new PDFTextStripper();

                return stripper.getText(document);
            }
        }

        // ================= DOCX =================

        if (lowerFileName.endsWith(".docx")) {

            StringBuilder text =
                    new StringBuilder();

            try (
                XWPFDocument document =
                        new XWPFDocument(file.getInputStream())
            ) {

                for (
                    XWPFParagraph paragraph :
                    document.getParagraphs()
                ) {

                    String paragraphText =
                            paragraph.getText();

                    if (
                        paragraphText != null &&
                        !paragraphText.isBlank()
                    ) {

                        text.append(
                                paragraphText
                        );

                        text.append("\n");
                    }
                }
            }

            return text.toString();
        }

        // ================= UNSUPPORTED =================

        throw new IllegalArgumentException(
                "Only PDF and DOCX files are supported."
        );
    }
}