import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Ruta para el formulario de inscripción
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

// Ruta para fans (registro por IP)
const fansFile = path.join(__dirname, 'fans.json');

app.post('/api/fan', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  let fans = [];
  if (fs.existsSync(fansFile)) {
    fans = JSON.parse(fs.readFileSync(fansFile, 'utf-8'));
  }

  if (fans.includes(ip)) {
    return res.status(400).json({ message: 'Ya estás registrado como fan' });
  }

  fans.push(ip);
  fs.writeFileSync(fansFile, JSON.stringify(fans, null, 2));

  res.status(200).json({ message: '¡Gracias por unirte como fan!' });
});

// Ruta para consultar el número total de fans
app.get('/api/fans', (req, res) => {
  let fans = [];
  if (fs.existsSync(fansFile)) {
    fans = JSON.parse(fs.readFileSync(fansFile, 'utf-8'));
  }
  res.json({ total: fans.length });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
