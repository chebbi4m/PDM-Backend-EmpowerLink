import nodemailer from 'nodemailer';

async function sendAttachment(to, subject, body, attachment) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT, // Port spécifique de votre fournisseur
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: true, // Il est recommandé de ne pas désactiver cette vérification
            },
        });

        const message = {
            from: process.env.EMAIL_USERNAME,
            to,
            subject,
            text: body,
            attachments: [
                {
                    filename: attachment.originalname,
                    content: attachment.buffer,
                },
            ],
        };

        await transporter.sendMail(message);

        console.log("Email sent successfully.");
    } catch (error) {
        console.error(error);

        // Vous pouvez personnaliser les messages d'erreur en fonction des erreurs rencontrées
        if (error.code === "ECONNREFUSED") {
            throw new Error("Could not connect to email server. Please try again later.");
        } else {
            throw new Error("An error occurred while sending the email. Please try again later.");
        }
    }
}

export default sendAttachment;
