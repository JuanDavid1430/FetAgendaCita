const Servicio = require('../models/Servicio');

// Listar todos los servicios activos (público)
exports.listarActivos = async (req, res) => {
    try {
        const servicios = await Servicio.listarActivos();
        res.json(servicios);
    } catch (error) {
        console.error('Error al listar servicios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Listar todos los servicios (admin)
exports.listar = async (req, res) => {
    try {
        const servicios = await Servicio.listar();
        res.json(servicios);
    } catch (error) {
        console.error('Error al listar servicios:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener un servicio por ID
exports.obtener = async (req, res) => {
    try {
        const servicio = await Servicio.buscarPorId(req.params.id);
        
        if (!servicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        
        res.json(servicio);
    } catch (error) {
        console.error('Error al obtener servicio:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Crear un nuevo servicio (admin)
exports.crear = async (req, res) => {
    try {
        const { nombre, descripcion, duracion, precio } = req.body;

        if (!nombre || !duracion) {
            return res.status(400).json({ error: 'Nombre y duración son requeridos' });
        }

        const id = await Servicio.crear({ nombre, descripcion, duracion, precio });
        
        res.status(201).json({ 
            mensaje: 'Servicio creado exitosamente',
            id 
        });
    } catch (error) {
        console.error('Error al crear servicio:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Actualizar un servicio (admin)
exports.actualizar = async (req, res) => {
    try {
        const { nombre, descripcion, duracion, precio, activo } = req.body;
        
        await Servicio.actualizar(req.params.id, {
            nombre,
            descripcion,
            duracion,
            precio,
            activo: activo !== undefined ? activo : true
        });
        
        res.json({ mensaje: 'Servicio actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Eliminar un servicio (admin)
exports.eliminar = async (req, res) => {
    try {
        await Servicio.eliminar(req.params.id);
        res.json({ mensaje: 'Servicio eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
