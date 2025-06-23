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

app.use(cors({
  origin: 'http://localhost:5173', // Cambia aquí si tu frontend corre en otro dominio o puerto
  credentials: true
}));
app.use(express.json());

// Configuración nodemailer (ajusta con tus datos en .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Ruta para recibir formulario de inscripción
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

const fansFile = path.join(__dirname, 'fans.json');

// POST para registrar fan (por IP)
app.post('/api/fan', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  console.log('IP del fan:', ip);

  let fans = [];
  if (fs.existsSync(fansFile)) {
    try {
      const data = fs.readFileSync(fansFile, 'utf-8');
      console.log('fans.json antes:', data);
      const parsed = JSON.parse(data);
      fans = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error leyendo fans.json:', err);
      fans = [];
    }
  }

  if (fans.includes(ip)) {
    console.log('IP ya registrada.');
    return res.status(400).json({ message: 'Ya estás registrado como fan' });
  }

  fans.push(ip);
  try {
    fs.writeFileSync(fansFile, JSON.stringify(fans, null, 2));
    console.log('fans.json actualizado:', JSON.stringify(fans, null, 2));
    res.status(200).json({ message: '¡Gracias por unirte como fan!' });
  } catch (err) {
    console.error('Error escribiendo en fans.json:', err);
    res.status(500).json({ message: 'Error al registrar fan' });
  }
});

// GET para verificar si IP ya es fan
app.get('/api/fan', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  let fans = [];
  if (fs.existsSync(fansFile)) {
    try {
      const data = fs.readFileSync(fansFile, 'utf-8');
      const parsed = JSON.parse(data);
      fans = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error leyendo fans.json:', err);
      fans = [];
    }
  }
  const alreadyFan = fans.includes(ip);
  res.json({ alreadyFan });
});

// GET para total de fans
app.get('/api/fans', (req, res) => {
  let fans = [];
  if (fs.existsSync(fansFile)) {
    try {
      const data = fs.readFileSync(fansFile, 'utf-8');
      const parsed = JSON.parse(data);
      fans = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error leyendo fans.json:', err);
      fans = [];
    }
  }
  res.json({ total: fans.length });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
