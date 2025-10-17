require('dotenv').config();
const nodemailer = require('nodemailer');

// Configurar transporter de email para Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Función para probar el envío de email
const testEmail = async () => {
    try {
        console.log('🔧 Configurando email...');
        console.log('📧 Usuario:', process.env.EMAIL_USER);
        console.log('🔑 Contraseña configurada:', process.env.EMAIL_PASSWORD ? 'Sí' : 'No');
        
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_USER, // Enviar a ti mismo para probar
            subject: '🧪 Prueba de Email - FetAgenda',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #667eea;">✅ ¡Email Funcionando!</h1>
                    <p>Si recibes este email, significa que la configuración de Gmail está funcionando correctamente.</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>Sistema:</strong> FetAgenda - Sistema de Reservas</p>
                </div>
            `
        };

        console.log('📤 Enviando email de prueba...');
        const result = await transporter.sendMail(mailOptions);
        
        console.log('✅ ¡Email enviado exitosamente!');
        console.log('📧 Message ID:', result.messageId);
        console.log('📬 Revisa tu bandeja de entrada (y spam)');
        
    } catch (error) {
        console.error('❌ Error al enviar email:', error.message);
        
        if (error.code === 'EAUTH') {
            console.error('🔐 Error de autenticación:');
            console.error('   - Verifica que EMAIL_USER sea correcto');
            console.error('   - Verifica que EMAIL_PASSWORD sea la contraseña de aplicación');
            console.error('   - Asegúrate de que la verificación en 2 pasos esté activada');
        }
        
        if (error.code === 'ECONNECTION') {
            console.error('🌐 Error de conexión:');
            console.error('   - Verifica tu conexión a internet');
            console.error('   - Gmail podría estar bloqueando la conexión');
        }
    }
};

// Ejecutar la prueba
testEmail();
