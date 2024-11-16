const PDFDocument = require('pdfkit');
const fs = require('fs');

class PDFService {
    static async generateResumePDF(resumeData) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new PDFDocument({
                    margin: 50,
                    size: 'A4'
                });

                // Create a write stream
                const buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    const pdfData = Buffer.concat(buffers);
                    resolve(pdfData);
                });

                // Add content to PDF
                this.addHeader(doc, resumeData);
                this.addProfessionalSummary(doc, resumeData);
                this.addWorkExperience(doc, resumeData);
                this.addEducation(doc, resumeData);
                this.addSkills(doc, resumeData);

                doc.end();
            } catch (error) {
                reject(error);
            }
        });
    }

    static addHeader(doc, data) {
        doc.fontSize(24)
           .font('Helvetica-Bold')
           .text(data.fullName, { align: 'center' });

        doc.fontSize(14)
           .font('Helvetica')
           .text(data.professionalTitle, { align: 'center' });

        doc.moveDown()
           .fontSize(10)
           .text(`Email: ${data.email}`, { align: 'center' })
           .text(`Phone: ${data.phone}`, { align: 'center' });

        doc.moveDown();
    }

    static addProfessionalSummary(doc, data) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Professional Summary')
           .moveDown(0.5);

        doc.fontSize(10)
           .font('Helvetica')
           .text(data.professionalSummary);

        doc.moveDown();
    }

    static addWorkExperience(doc, data) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Work Experience')
           .moveDown(0.5);

        data.experience.forEach(exp => {
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text(exp.jobTitle)
               .fontSize(10)
               .font('Helvetica')
               .text(`${exp.company} | ${exp.startDate} - ${exp.endDate || 'Present'}`)
               .text(exp.description);

            doc.moveDown();
        });
    }

    static addEducation(doc, data) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Education')
           .moveDown(0.5);

        data.education.forEach(edu => {
            doc.fontSize(12)
               .font('Helvetica-Bold')
               .text(edu.degree)
               .fontSize(10)
               .font('Helvetica')
               .text(`${edu.institution} | ${edu.graduationDate}`)
               .text(edu.fieldOfStudy);

            doc.moveDown();
        });
    }

    static addSkills(doc, data) {
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .text('Skills')
           .moveDown(0.5);

        doc.fontSize(10)
           .font('Helvetica')
           .text('Technical Skills: ' + data.technicalSkills.join(', '))
           .moveDown(0.5)
           .text('Soft Skills: ' + data.softSkills.join(', '));
    }
}

module.exports = PDFService; 