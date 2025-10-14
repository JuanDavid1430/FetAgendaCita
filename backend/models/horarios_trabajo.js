const db = require('../config/database');

class horarios_trabajo {
    // Obtener todos los horarios
    static async listar() {
        const [rows] = await db.execute(
            'SELECT * FROM horarios_trabajo ORDER BY dia_semana'
        );
        
        return rows;
    }

    // Obtener horario por día
    static async buscarPorDia(diaSemana) {
        const [rows] = await db.execute(
            'SELECT * FROM horarios_trabajo WHERE dia_semana = ?',
            [diaSemana]
        );
        
        return rows[0];
    }

    // Actualizar horario
    static async actualizar(diaSemana, data) {
        const { hora_inicio, hora_fin, activo } = data;
        
        await db.execute(
            `UPDATE horarios_trabajo 
             SET hora_inicio = ?, hora_fin = ?, activo = ? 
             WHERE dia_semana = ?`,
            [hora_inicio, hora_fin, activo, diaSemana]
        );
        
        return true;
    }

    // Crear o actualizar horario
    static async crearOActualizar(diaSemana, data) {
        const { hora_inicio, hora_fin, activo } = data;
        
        const [existing] = await db.execute(
            'SELECT id FROM horarios_trabajo WHERE dia_semana = ?',
            [diaSemana]
        );
        
        if (existing.length > 0) {
            return await this.actualizar(diaSemana, data);
        }
        
        const [result] = await db.execute(
            'INSERT INTO horarios_trabajo (dia_semana, hora_inicio, hora_fin, activo) VALUES (?, ?, ?, ?)',
            [diaSemana, hora_inicio, hora_fin, activo]
        );
        
        return result.insertId;
    }

    // Activar/desactivar día
    static async toggleActivo(diaSemana) {
        await db.execute(
            'UPDATE horarios_trabajo SET activo = NOT activo WHERE dia_semana = ?',
            [diaSemana]
        );
        
        return true;
    }
}

module.exports = horarios_trabajo;
