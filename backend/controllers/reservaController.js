const Reserva = require('../models/Reserva');
const Cliente = require('../models/Cliente');
const Servicio = require('../models/Servicio');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transporter de email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Función para enviar email de confirmación
const enviarEmailConfirmacion = async (reserva, cliente, servicio) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: cliente.email,
            subject: 'Confirmación de Reserva - FetAgenda',
            html: `
                <h2>Confirmación de Reserva</h2>
                <p>Hola ${cliente.nombre},</p>
                <p>Tu reserva ha sido confirmada con los siguientes detalles:</p>
                <ul>
                    <li><strong>Servicio:</strong> ${servicio.nombre}</li>
                    <li><strong>Fecha:</strong> ${reserva.fecha}</li>
                    <li><strong>Hora:</strong> ${reserva.hora_inicio}</li>
                    <li><strong>Duración:</strong> ${servicio.duracion} minutos</li>
                    <li><strong>Precio:</strong> $${servicio.precio}</li>
                </ul>
                <p>Si necesitas cancelar o modificar tu reserva, por favor contáctanos.</p>
                <p>¡Te esperamos!</p>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar email:', error);
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
