const db = require('../config/database');

class Reserva {
    // Crear una nueva reserva
    static async crear(data) {
        const { cliente_id, servicio_id, fecha, hora_inicio, hora_fin, notas } = data;
        
        try {
            const [result] = await db.execute(
                `INSERT INTO reservas (cliente_id, servicio_id, fecha, hora_inicio, hora_fin, notas, estado) 
                 VALUES (?, ?, ?, ?, ?, ?, 'pendiente')`,
                [cliente_id, servicio_id, fecha, hora_inicio, hora_fin, notas]
            );
            
            return result.insertId;
        } catch (error) {
            if (error.sqlState === '45000') {
                throw new Error('Ya existe una reserva en ese horario');
            }
            throw error;
        }
    }

    // Buscar por ID con detalles
    static async buscarPorId(id) {
        const [rows] = await db.execute(
            `SELECT r.*, 
                    c.nombre as cliente_nombre, c.email as cliente_email, c.telefono as cliente_telefono,
                    s.nombre as servicio_nombre, s.duracion, s.precio
             FROM reservas r
             JOIN clientes c ON r.cliente_id = c.id
             JOIN servicios s ON r.servicio_id = s.id
             WHERE r.id = ?`,
            [id]
        );
        
        return rows[0];
    }

    // Listar todas las reservas
    static async listar(filtros = {}) {
        let query = `
            SELECT r.*, 
                   c.nombre as cliente_nombre, c.email as cliente_email, c.telefono as cliente_telefono,
                   s.nombre as servicio_nombre, s.duracion, s.precio
            FROM reservas r
            JOIN clientes c ON r.cliente_id = c.id
            JOIN servicios s ON r.servicio_id = s.id
            WHERE 1=1
        `;
        const params = [];

        if (filtros.fecha) {
            query += ' AND r.fecha = ?';
            params.push(filtros.fecha);
        }

        if (filtros.estado) {
            query += ' AND r.estado = ?';
            params.push(filtros.estado);
        }

        if (filtros.fecha_desde) {
            query += ' AND r.fecha >= ?';
            params.push(filtros.fecha_desde);
        }

        if (filtros.fecha_hasta) {
            query += ' AND r.fecha <= ?';
            params.push(filtros.fecha_hasta);
        }

        query += ' ORDER BY r.fecha DESC, r.hora_inicio DESC';

        const [rows] = await db.execute(query, params);
        return rows;
    }

    // Obtener disponibilidad para una fecha
    static async obtenerDisponibilidad(fecha, servicioId) {
        // Obtener horario de trabajo para ese día
        const diaSemana = new Date(fecha + 'T00:00:00').getDay();
        
        const [horarios_trabajo] = await db.execute(
            'SELECT * FROM horarios_trabajo WHERE dia_semana = ? AND activo = TRUE',
            [diaSemana]
        );

        if (horarios_trabajo.length === 0) {
            return { 
                fecha,
                horarios_disponibles: [],
                servicio_id: parseInt(servicioId),
                mensaje: 'Día no laborable'
            };
        }

        // Verificar si es un día bloqueado
        const [diaBloqueado] = await db.execute(
            'SELECT * FROM dias_bloqueados WHERE fecha = ?',
            [fecha]
        );

        if (diaBloqueado.length > 0) {
            return { 
                fecha,
                horarios_disponibles: [],
                servicio_id: parseInt(servicioId),
                mensaje: diaBloqueado[0].motivo || 'Día bloqueado'
            };
        }

        // Obtener duración del servicio
        const [servicio] = await db.execute(
            'SELECT duracion FROM servicios WHERE id = ?',
            [servicioId]
        );

        if (servicio.length === 0) {
            throw new Error('Servicio no encontrado');
        }

        const duracionServicio = servicio[0].duracion;

        // Obtener reservas existentes para esa fecha
        const [reservasExistentes] = await db.execute(
            `SELECT hora_inicio, hora_fin FROM reservas 
             WHERE fecha = ? AND estado NOT IN ('cancelada')
             ORDER BY hora_inicio`,
            [fecha]
        );

        // Generar slots disponibles
        const horaInicio = horarios_trabajo[0].hora_inicio; // ej: "09:00:00"
        const horaFin = horarios_trabajo[0].hora_fin;       // ej: "17:00:00"
        
        // Convertir horas a minutos
        const [hInicio, mInicio] = horaInicio.split(':').map(Number);
        const [hFin, mFin] = horaFin.split(':').map(Number);
        
        const minutosInicio = hInicio * 60 + mInicio;
        const minutosFin = hFin * 60 + mFin;
        
        // Generar todos los slots posibles cada 30 minutos
        const slotsDisponibles = [];
        const intervalo = 30; // Intervalo de 30 minutos entre slots
        
        for (let minutos = minutosInicio; minutos + duracionServicio <= minutosFin; minutos += intervalo) {
            const hora = Math.floor(minutos / 60);
            const min = minutos % 60;
            const horaSlot = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            
            // Calcular hora fin del slot
            const minutosFinSlot = minutos + duracionServicio;
            const horaFinSlot = Math.floor(minutosFinSlot / 60);
            const minFinSlot = minutosFinSlot % 60;
            const horaFinSlotStr = `${horaFinSlot.toString().padStart(2, '0')}:${minFinSlot.toString().padStart(2, '0')}`;
            
            // Verificar si hay conflicto con reservas existentes
            let hayConflicto = false;
            for (const reserva of reservasExistentes) {
                const inicioReserva = reserva.hora_inicio.substring(0, 5);
                const finReserva = reserva.hora_fin.substring(0, 5);
                
                // Verificar superposición
                if (!(horaFinSlotStr <= inicioReserva || horaSlot >= finReserva)) {
                    hayConflicto = true;
                    break;
                }
            }
            
            if (!hayConflicto) {
                slotsDisponibles.push(horaSlot);
            }
        }
        
        return {
            fecha,
            horarios_disponibles: slotsDisponibles,
            servicio_id: parseInt(servicioId)
        };
    }

    // Actualizar estado de reserva
    static async actualizarEstado(id, estado) {
        const estadosValidos = ['pendiente', 'confirmada', 'completada', 'cancelada'];
        
        if (!estadosValidos.includes(estado)) {
            throw new Error('Estado no válido');
        }

        await db.execute(
            'UPDATE reservas SET estado = ? WHERE id = ?',
            [estado, id]
        );
        
        return true;
    }

    // Actualizar reserva
    static async actualizar(id, data) {
        const { fecha, hora_inicio, hora_fin, notas, estado } = data;
        
        await db.execute(
            'UPDATE reservas SET fecha = ?, hora_inicio = ?, hora_fin = ?, notas = ?, estado = ? WHERE id = ?',
            [fecha, hora_inicio, hora_fin, notas, estado, id]
        );
        
        return true;
    }

    // Cancelar reserva
    static async cancelar(id) {
        return await this.actualizarEstado(id, 'cancelada');
    }

    // Obtener estadísticas
    static async obtenerEstadisticas(fechaInicio, fechaFin) {
        const [stats] = await db.execute(
            `SELECT 
                COUNT(*) as total_reservas,
                SUM(CASE WHEN estado = 'completada' THEN 1 ELSE 0 END) as completadas,
                SUM(CASE WHEN estado = 'cancelada' THEN 1 ELSE 0 END) as canceladas,
                SUM(CASE WHEN estado = 'pendiente' THEN 1 ELSE 0 END) as pendientes
             FROM reservas
             WHERE fecha BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );
        
        return stats[0];
    }
}

module.exports = Reserva;
