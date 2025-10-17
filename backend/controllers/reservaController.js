const Reserva = require('../models/Reserva');
const Cliente = require('../models/Cliente');
const Servicio = require('../models/Servicio');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Función para enviar email de confirmación
const enviarEmailConfirmacion = async (reserva, cliente, servicio) => {
    try {
        // Configurar transporter cada vez que se necesite
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        console.log('📧 Enviando email a:', cliente.email);
        console.log('🔧 Usando EMAIL_USER:', process.env.EMAIL_USER);
        console.log('🔑 EMAIL_PASSWORD configurada:', process.env.EMAIL_PASSWORD ? 'Sí' : 'No');
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: cliente.email,
            subject: '✨ Confirmación de Reserva - StyleCut',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 2rem;">💇‍♀️ StyleCut</h1>
                        <p style="color: white; margin: 0.5rem 0 0; opacity: 0.9;">Tu cita ha sido confirmada</p>
                    </div>
                    
                    <div style="background: white; padding: 2rem;">
                        <h2 style="color: #2d3748; margin-bottom: 1rem;">¡Hola ${cliente.nombre}! 👋</h2>
                        <p style="color: #718096; line-height: 1.6;">Tu reserva ha sido confirmada exitosamente. Aquí tienes todos los detalles:</p>
                        
                        <div style="background: #f7fafc; padding: 1.5rem; border-radius: 12px; margin: 1.5rem 0;">
                            <h3 style="color: #2d3748; margin-top: 0;">📋 Detalles de tu Cita</h3>
                            <ul style="list-style: none; padding: 0;">
                                <li style="margin: 0.75rem 0; color: #4a5568;">
                                    <strong style="color: #2d3748;">💇‍♀️ Servicio:</strong> ${servicio.nombre}
                                </li>
                                <li style="margin: 0.75rem 0; color: #4a5568;">
                                    <strong style="color: #2d3748;">📅 Fecha:</strong> ${reserva.fecha}
                                </li>
                                <li style="margin: 0.75rem 0; color: #4a5568;">
                                    <strong style="color: #2d3748;">🕐 Hora:</strong> ${reserva.hora_inicio}
                                </li>
                                <li style="margin: 0.75rem 0; color: #4a5568;">
                                    <strong style="color: #2d3748;">⏱️ Duración:</strong> ${servicio.duracion} minutos
                                </li>
                                <li style="margin: 0.75rem 0; color: #4a5568;">
                                    <strong style="color: #2d3748;">💰 Precio:</strong> $${servicio.precio}
                                </li>
                            </ul>
                        </div>
                        
                        <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 1rem; margin: 1.5rem 0;">
                            <p style="margin: 0; color: #234e52;">
                                <strong>💡 Importante:</strong> Si necesitas cancelar o modificar tu reserva, 
                                por favor contáctanos con al menos 24 horas de anticipación.
                            </p>
                        </div>
                        
                        <p style="color: #718096; text-align: center; margin: 2rem 0;">
                            ¡Te esperamos para que luzcas increíble! ✨
                        </p>
                    </div>
                    
                    <div style="background: #2d3748; padding: 1rem; text-align: center;">
                        <p style="color: #a0aec0; margin: 0; font-size: 0.9rem;">
                            © 2025 StyleCut - Sistema de Reservas FetAgenda
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email enviado exitosamente a: ${cliente.email}`);
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        console.error(`📧 Email fallido para: ${cliente.email}`);
    }
};

// Crear una nueva reserva (público)
exports.crear = async (req, res) => {
    try {
        const { nombre, email, telefono, servicio_id, fecha, hora_inicio, notas } = req.body;

        if (!nombre || !email || !telefono || !servicio_id || !fecha || !hora_inicio) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Verificar que el servicio existe
        const servicio = await Servicio.buscarPorId(servicio_id);
        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        // Crear o actualizar cliente
        const clienteId = await Cliente.crearOActualizar({ nombre, email, telefono });

        // Calcular hora de fin
        const horaInicio = new Date(`2000-01-01 ${hora_inicio}`);
        const horaFin = new Date(horaInicio.getTime() + servicio.duracion * 60000);
        const horaFinStr = horaFin.toTimeString().slice(0, 5);

        // Crear reserva
        const reservaId = await Reserva.crear({
            cliente_id: clienteId,
            servicio_id,
            fecha,
            hora_inicio,
            hora_fin: horaFinStr,
            notas
        });

        // Obtener datos completos de la reserva
        const reserva = await Reserva.buscarPorId(reservaId);
        const cliente = await Cliente.buscarPorId(clienteId);

        // Enviar email de confirmación
        await enviarEmailConfirmacion(reserva, cliente, servicio);

        res.status(201).json({
            mensaje: 'Reserva creada exitosamente',
            id: reservaId,
            reserva
        });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        
        if (error.message === 'Ya existe una reserva en ese horario') {
            return res.status(409).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener disponibilidad (público)
exports.obtenerDisponibilidad = async (req, res) => {
    try {
        const { fecha, servicio_id } = req.query;

        if (!fecha || !servicio_id) {
            return res.status(400).json({ error: 'Fecha y servicio_id son requeridos' });
        }

        const disponibilidad = await Reserva.obtenerDisponibilidad(fecha, servicio_id);
        res.json(disponibilidad);
    } catch (error) {
        console.error('Error al obtener disponibilidad:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Listar reservas (admin)
exports.listar = async (req, res) => {
    try {
        const filtros = {
            fecha: req.query.fecha,
            estado: req.query.estado,
            fecha_desde: req.query.fecha_desde,
            fecha_hasta: req.query.fecha_hasta
        };

        const reservas = await Reserva.listar(filtros);
        res.json(reservas);
    } catch (error) {
        console.error('Error al listar reservas:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener una reserva por ID
exports.obtener = async (req, res) => {
    try {
        const reserva = await Reserva.buscarPorId(req.params.id);
        
        if (!reserva) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        
        res.json(reserva);
    } catch (error) {
        console.error('Error al obtener reserva:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Actualizar estado de reserva (admin)
exports.actualizarEstado = async (req, res) => {
    try {
        const { estado } = req.body;

        if (!estado) {
            return res.status(400).json({ error: 'Estado es requerido' });
        }

        await Reserva.actualizarEstado(req.params.id, estado);
        
        res.json({ mensaje: 'Estado actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        
        if (error.message === 'Estado no válido') {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Cancelar reserva (admin)
exports.cancelar = async (req, res) => {
    try {
        await Reserva.cancelar(req.params.id);
        res.json({ mensaje: 'Reserva cancelada exitosamente' });
    } catch (error) {
        console.error('Error al cancelar reserva:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener estadísticas (admin)
exports.estadisticas = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ error: 'fecha_inicio y fecha_fin son requeridos' });
        }

        const stats = await Reserva.obtenerEstadisticas(fecha_inicio, fecha_fin);
        res.json(stats);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
