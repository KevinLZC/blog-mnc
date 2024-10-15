import nodemailer from "nodemailer";

const {
  SMTP_USER,
  SMTP_SERVICE,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_PASS,
} = import.meta.env;

const transporter = nodemailer.createTransport({
  service: SMTP_SERVICE,
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE === "true",
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export interface IEmailData {
  name: string;
  subject?: string;
  email: string;
  content: string;
}

export const sendEmail = async (data: IEmailData): Promise<void> => {
  const {
    name,
    subject = "Solicitud de información",
    email,
    content,
  } = data;

  // HTML email template
  const htmlTemplate = generateHtmlTemplate(name, email, content);

  try {
    const info = await transporter.sendMail({
      from: `${name} <${email}>`,
      to: SMTP_USER,
      subject,
      html: htmlTemplate,
    });

    console.log(
      `Email sent successfully to ${SMTP_USER}. Message ID: ${info.messageId}`,
    );
  } catch (error: any) {
    console.error(
      `Failed to send email to ${SMTP_USER}. Error: ${error.message}`,
    );
  }
};

const generateHtmlTemplate = (
  name: string,
  from: string,
  content: string,
): string => {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitud de Información</title>
      <style>
        /* Common styles */
        *, *::before, *::after {
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
          color: #333;
        }

        .container {
          max-width: 650px;
          margin: 40px auto;
          background: #fff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e0e0;
        }

        .header {
          text-align: center;
          padding: 30px 0;
          background: #004b87;
          color: #fff;
          border-radius: 10px 10px 0 0;
        }

        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .header p {
          font-size: 14px;
          margin: 5px 0 0;
          font-style: italic;
        }

        .logo {
          text-align: center;
          margin: 20px 0;
        }

        .logo img {
          max-width: 250px;
          width: 50%;
        }

        .content {
          padding: 30px;
          line-height: 1.8;
          font-size: 16px;
          color: #555;
        }

        .content p {
          margin: 0 0 15px;
        }

        .highlight {
          font-weight: bold;
          color: #004b87;
        }

        .message-box {
          background: #f0f4f7;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border-left: 4px solid #004b87;
        }

        .footer {
          text-align: center;
          padding: 20px;
          font-size: 14px;
          color: #888;
          background: #f2f2f2;
          border-radius: 0 0 10px 10px;
          border-top: 1px solid #e0e0e0;
        }

        .footer p {
          margin: 0;
        }

        .btn {
          display: inline-block;
          padding: 12px 25px;
          margin-top: 20px;
          background: #004b87;
          color: #fff;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
        }

        .btn:hover {
          background: #003b6b;
        }

        /* Responsive styles */
        @media only screen and (max-width: 600px) {
          .container {
            padding: 20px;
          }

          .header h1 {
            font-size: 22px;
          }

          .content {
            padding: 20px;
            font-size: 14px;
          }

          .btn {
            padding: 10px 20px;
            font-size: 14px;
          }

          .logo img {
            max-width: 120px;
          }
        }

        @media only screen and (max-width: 400px) {
          .container {
            padding: 15px;
          }

          .header h1 {
            font-size: 20px;
          }

          .content {
            padding: 15px;
            font-size: 13px;
          }

          .btn {
            padding: 8px 18px;
            font-size: 12px;
          }

          .logo img {
            max-width: 100px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Solicitud de Información</h1>
          <p>Recibida desde el blog de la Maestría en Nutrición Clínica</p>
        </div>
        <div class="logo">
          <img src="http://localhost:4321/public/images/logo.png" alt="Logo Dependencia" />
        </div>
        <div class="content">
          <p>Hola,</p>
          <p>Has recibido una nueva solicitud de información a través del blog:</p>
          <p><span class="highlight">Nombre:</span> ${name}</p>
          <p><span class="highlight">Correo electrónico:</span> ${from}</p>
          <p><span class="highlight">Mensaje:</span></p>
          <div class="message-box">${content}</div>
          <p>Quedo a la espera de su pronta respuesta.</p>
          <p>Gracias,</p>
          <p><strong>El equipo del blog de la Maestría en Nutrición Clínica</strong></p>
          <a href="mailto:${from}" class="btn">Responder</a>
        </div>
        <div class="footer">
          <p>© 2024 Universidad de Colima. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
