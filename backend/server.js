import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ Configura CORS para aceptar solo peticiones desde tu frontend en Vercel
app.use(cors({
  origin: 'https://zeus-backend-production.up.railway.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use(express.json());

// 📦 Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// 📄 Modelo de fan
const fanSchema = new mongoose.Schema({
  ip: { type: String, unique: true },
  date: { type: Date, default: Date.now }
});

const Fan = mongoose.model('Fan', fanSchema);

// 📬 Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 📩 Ruta para el formulario de inscripción
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

// 💙 Ruta para registrar un fan por IP
app.post('/api/fan', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const exists = await Fan.findOne({ ip });

    if (exists) {
      return res.status(400).json({ message: 'Ya estás registrado como fan' });
    }

    await Fan.create({ ip });
    res.status(200).json({ message: '¡Gracias por unirte como fan!' });
  } catch (err) {
    console.error('Error registrando fan:', err);
    res.status(500).json({ message: 'Error al registrar fan' });
  }
});

// 📊 Ruta para consultar el número total de fans
app.get('/api/fans', async (req, res) => {
  try {
    const count = await Fan.countDocuments();
    res.json({ total: count });
  } catch (err) {
    console.error('Error al contar fans:', err);
    res.status(500).json({ message: 'Error al obtener el número de fans' });
  }
});

// 🤔 Ruta para verificar si ya es fan
app.get('/api/fan', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  try {
    const exists = await Fan.findOne({ ip });
    res.status(200).json({ alreadyFan: !!exists });
  } catch (err) {
    console.error('Error verificando fan:', err);
    res.status(500).json({ message: 'Error al verificar fan' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
