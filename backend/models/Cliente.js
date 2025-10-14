const db = require('../config/database');

class Cliente {
    // Crear o actualizar cliente
    static async crearOActualizar(data) {
        const { nombre, email, telefono } = data;
        
        // Buscar si ya existe por email o teléfono
        const [existing] = await db.execute(
            'SELECT id FROM clientes WHERE email = ? OR telefono = ?',
            [email, telefono]
        );
        
        if (existing.length > 0) {
            // Actualizar datos
            await db.execute(
                'UPDATE clientes SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
                [nombre, email, telefono, existing[0].id]
            );
            return existing[0].id;
        }
        
        // Crear nuevo
        const [result] = await db.execute(
            'INSERT INTO clientes (nombre, email, telefono) VALUES (?, ?, ?)',
            [nombre, email, telefono]
        );
        
        return result.insertId;
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const [rows] = await db.execute(
            'SELECT * FROM clientes WHERE id = ?',
            [id]
        );
        
        return rows[0];
    }

    // Buscar por email
    static async buscarPorEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM clientes WHERE email = ?',
            [email]
        );
        
        return rows[0];
    }

    // Listar todos
    static async listar() {
        const [rows] = await db.execute(
            'SELECT * FROM clientes ORDER BY created_at DESC'
        );
        
        return rows;
    }

    // Obtener historial de reservas de un cliente
    static async obtenerHistorialReservas(clienteId) {
        const [rows] = await db.execute(
            `SELECT r.*, s.nombre as servicio_nombre, s.precio 
             FROM reservas r 
             JOIN servicios s ON r.servicio_id = s.id 
             WHERE r.cliente_id = ? 
             ORDER BY r.fecha DESC, r.hora_inicio DESC`,
            [clienteId]
        );
        
        return rows;
    }
}

module.exports = Cliente;
