import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/api/inscripcion', async (req, res) => {
  try {
    const { discordName, position, message } = req.body;

    const mailOptions = {
      from: `"Blue Lock Team" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Nueva solicitud de inscripción para Zeus',
      html: `
        <h2>Nueva solicitud recibida</h2>
        <p><strong>Discord Name:</strong> ${discordName}</p>
        <p><strong>Posición:</strong> ${position}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Solicitud enviada correctamente' });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ message: 'Error al procesar la solicitud' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
