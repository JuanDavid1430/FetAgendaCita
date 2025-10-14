const db = require('../config/database');
const bcrypt = require('bcrypt');

class Administrador {
    // Crear un nuevo administrador
    static async crear(data) {
        const { nombre, email, password, telefono } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO administradores (nombre, email, password, telefono) VALUES (?, ?, ?, ?)',
            [nombre, email, hashedPassword, telefono]
        );
        
        return result.insertId;
    }

    // Buscar por email
    static async buscarPorEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM administradores WHERE email = ? AND activo = TRUE',
            [email]
        );
        
        return rows[0];
    }

    // Buscar por ID
    static async buscarPorId(id) {
        const [rows] = await db.execute(
            'SELECT id, nombre, email, telefono, activo, created_at FROM administradores WHERE id = ?',
            [id]
        );
        
        return rows[0];
    }

    // Verificar password
    static async verificarPassword(passwordPlano, passwordHash) {
        return await bcrypt.compare(passwordPlano, passwordHash);
    }

    // Listar todos
    static async listar() {
        const [rows] = await db.execute(
            'SELECT id, nombre, email, telefono, activo, created_at FROM administradores'
        );
        
        return rows;
    }

    // Actualizar
    static async actualizar(id, data) {
        const { nombre, email, telefono } = data;
        
        await db.execute(
            'UPDATE administradores SET nombre = ?, email = ?, telefono = ? WHERE id = ?',
            [nombre, email, telefono, id]
        );
        
        return true;
    }

    // Cambiar contraseña
    static async cambiarPassword(id, nuevoPassword) {
        const hashedPassword = await bcrypt.hash(nuevoPassword, 10);
        
        await db.execute(
            'UPDATE administradores SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );
        
        return true;
    }
}

module.exports = Administrador;
