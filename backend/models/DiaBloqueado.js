const db = require('../config/database');

class DiaBloqueado {
    // Crear día bloqueado
    static async crear(data) {
        const { fecha, motivo } = data;
        
        const [result] = await db.execute(
            'INSERT INTO dias_bloqueados (fecha, motivo) VALUES (?, ?)',
            [fecha, motivo]
        );
        
        return result.insertId;
    }

    // Listar todos los días bloqueados
    static async listar() {
        const [rows] = await db.execute(
            'SELECT * FROM dias_bloqueados ORDER BY fecha'
        );
        
        return rows;
    }

    // Listar días bloqueados futuros
    static async listarFuturos() {
        const [rows] = await db.execute(
            'SELECT * FROM dias_bloqueados WHERE fecha >= CURDATE() ORDER BY fecha'
        );
        
        return rows;
    }

    // Buscar por fecha
    static async buscarPorFecha(fecha) {
        const [rows] = await db.execute(
            'SELECT * FROM dias_bloqueados WHERE fecha = ?',
            [fecha]
        );
        
        return rows[0];
    }

    // Verificar si una fecha está bloqueada
    static async estaBloqueada(fecha) {
        const dia = await this.buscarPorFecha(fecha);
        return dia !== undefined;
    }

    // Eliminar día bloqueado
    static async eliminar(id) {
        await db.execute(
            'DELETE FROM dias_bloqueados WHERE id = ?',
            [id]
        );
        
        return true;
    }

    // Eliminar por fecha
    static async eliminarPorFecha(fecha) {
        await db.execute(
            'DELETE FROM dias_bloqueados WHERE fecha = ?',
            [fecha]
        );
        
        return true;
    }
}

module.exports = DiaBloqueado;
