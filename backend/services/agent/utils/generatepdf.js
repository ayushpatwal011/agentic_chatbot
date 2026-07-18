import PDFDocument from "pdfkit";

export const generatePDF = async (data) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50,
                info: {
                    Author: "HomeWorkAI",
                    Title: data.title,
                    Creator: "HomeWorkAI"
                }
            });

            const chunks = [];
            doc.on("data", (chunk) => chunks.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", (err) => reject(err));

            const colors = {
                title: "#111827",
                subtitle: "#6B7B90",
                heading: "#1F2937",
                text: "#374151",
                bullet: "#2563EB",
                footer: "#9CA3AF"
            };

            // ---------- Title ----------
            doc
                .fillColor(colors.title)
                .font("Helvetica-Bold")
                .fontSize(24)
                .text(data.title, { align: "center" });

            doc.moveDown(0.3);

            // ---------- Subtitle ----------
            if (data.subtitle) {
                doc
                    .fillColor(colors.subtitle)
                    .font("Helvetica")
                    .fontSize(12)
                    .text(data.subtitle, { align: "center" });
            }

            doc.moveDown(1.5);

            // Divider line under header
            doc
                .strokeColor("#E5E7EB")
                .lineWidth(1)
                .moveTo(doc.page.margins.left, doc.y)
                .lineTo(doc.page.width - doc.page.margins.right, doc.y)
                .stroke();

            doc.moveDown(1);

            // ---------- Sections ----------
            (data.sections || []).forEach((section, index) => {
                // Avoid orphaned heading near page bottom
                if (doc.y > doc.page.height - 150) {
                    doc.addPage();
                }

                doc
                    .fillColor(colors.heading)
                    .font("Helvetica-Bold")
                    .fontSize(15)
                    .text(`${index + 1}. ${section.heading}`);

                doc.moveDown(0.5);

                (section.points || []).forEach((point) => {
                    const bulletY = doc.y;

                    doc
                        .fillColor(colors.bullet)
                        .font("Helvetica-Bold")
                        .fontSize(11)
                        .text("•", doc.page.margins.left, bulletY, { continued: false });

                    doc
                        .fillColor(colors.text)
                        .font("Helvetica")
                        .fontSize(11)
                        .text(point, doc.page.margins.left + 15, bulletY, {
                            width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 15,
                            align: "left"
                        });

                    doc.moveDown(0.4);
                });

                doc.moveDown(1);
            });

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};