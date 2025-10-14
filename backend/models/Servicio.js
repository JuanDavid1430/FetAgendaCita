const db = require('../config/database');

class Servicio {
    // Crear un nuevo servicio
    static async crear(data) {
        const { nombre, descripcion, duracion, precio } = data;
        
        const [result] = await db.execute(
            'INSERT INTO servicios (nombre, descripcion, duracion, precio) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, duracion, precio]
        );
        
        return result.insertId;
    }

    // Listar todos los servicios activos
    static async listarActivos() {
        const [rows] = await db.execute(
            'SELECT * FROM servicios WHERE activo = TRUE ORDER BY nombre'
        );
        
        return rows;
    }

    // Listar todos los servicios
    static async listar() {
        const [rows] = await db.execute(
            'SELECT * FROM servicios ORDER BY nombre'
        );
        
        return rows;
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const [rows] = await db.execute(
            'SELECT * FROM servicios WHERE id = ?',
            [id]
        );
        
        return rows[0];
    }

    // Actualizar
    static async actualizar(id, data) {
        const { nombre, descripcion, duracion, precio, activo } = data;
        
        await db.execute(
            'UPDATE servicios SET nombre = ?, descripcion = ?, duracion = ?, precio = ?, activo = ? WHERE id = ?',
            [nombre, descripcion, duracion, precio, activo, id]
        );
        
        return true;
    }

    // Eliminar (soft delete)
    static async eliminar(id) {
        await db.execute(
            'UPDATE servicios SET activo = FALSE WHERE id = ?',
            [id]
        );
        
        return true;
    }

    // Eliminar permanentemente
    static async eliminarPermanente(id) {
        await db.execute(
            'DELETE FROM servicios WHERE id = ?',
            [id]
        );
        
        return true;
    }
}

module.exports = Servicio;
