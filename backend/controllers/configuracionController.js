const horarios_trabajo = require('../models/horarios_trabajo');
const DiaBloqueado = require('../models/DiaBloqueado');

// Horarios de Trabajo

exports.listarHorarios = async (req, res) => {
    try {
        const horarios = await horarios_trabajo.listar();
        res.json(horarios);
    } catch (error) {
        console.error('Error al listar horarios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

exports.actualizarHorario = async (req, res) => {
    try {
        const { dia_semana } = req.params;
        const { hora_inicio, hora_fin, activo } = req.body;

        if (!hora_inicio || !hora_fin) {
            return res.status(400).json({ error: 'hora_inicio y hora_fin son requeridos' });
        }

        await horarios_trabajo.crearOActualizar(dia_semana, {
            hora_inicio,
            hora_fin,
            activo: activo !== undefined ? activo : true
        });

        res.json({ mensaje: 'Horario actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar horario:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Días Bloqueados

exports.listarDiasBloqueados = async (req, res) => {
    try {
        const dias = await DiaBloqueado.listarFuturos();
        res.json(dias);
    } catch (error) {
        console.error('Error al listar días bloqueados:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

exports.crearDiaBloqueado = async (req, res) => {
    try {
        const { fecha, motivo } = req.body;

        if (!fecha) {
            return res.status(400).json({ error: 'Fecha es requerida' });
        }

        const id = await DiaBloqueado.crear({ fecha, motivo });
        
        res.status(201).json({
            mensaje: 'Día bloqueado creado exitosamente',
            id
        });
    } catch (error) {
        console.error('Error al crear día bloqueado:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

exports.eliminarDiaBloqueado = async (req, res) => {
    try {
        await DiaBloqueado.eliminar(req.params.id);
        res.json({ mensaje: 'Día bloqueado eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar día bloqueado:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
