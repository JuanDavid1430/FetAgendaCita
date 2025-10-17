require('dotenv').config();

console.log('🔍 Diagnóstico de variables de entorno:');
console.log('=====================================');
console.log('📁 Directorio actual:', process.cwd());
console.log('📄 Archivo .env encontrado:', require('fs').existsSync('.env') ? 'Sí' : 'No');
console.log('');

console.log('📧 Variables de email:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NO DEFINIDA');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'CONFIGURADA' : 'NO DEFINIDA');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM || 'NO DEFINIDA');
console.log('');

console.log('🗄️ Variables de base de datos:');
console.log('DB_HOST:', process.env.DB_HOST || 'NO DEFINIDA');
console.log('DB_USER:', process.env.DB_USER || 'NO DEFINIDA');
console.log('DB_NAME:', process.env.DB_NAME || 'NO DEFINIDA');
console.log('');

console.log('🔐 Variables de servidor:');
console.log('PORT:', process.env.PORT || 'NO DEFINIDA');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CONFIGURADA' : 'NO DEFINIDA');
console.log('');

// Probar la configuración de nodemailer
const nodemailer = require('nodemailer');

console.log('📤 Probando configuración de Nodemailer...');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

console.log('✅ Transporter creado exitosamente');
console.log('🔧 Configuración:', {
    service: 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD ? '***' : 'NO CONFIGURADA'
});
