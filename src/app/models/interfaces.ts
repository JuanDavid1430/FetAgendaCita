export interface Servicio {
    id?: number;
    nombre: string;
    descripcion?: string;
    duracion: number;
    precio?: number;
    activo?: boolean;
    created_at?: Date;
    updated_at?: Date;
}

export interface Cliente {
    id?: number;
    nombre: string;
    email: string;
    telefono: string;
}

export interface Reserva {
    id?: number;
    cliente_id?: number;
    servicio_id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin?: string;
    estado?: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
    notas?: string;
    cliente_nombre?: string;
    cliente_email?: string;
    cliente_telefono?: string;
    servicio_nombre?: string;
    duracion?: number;
    precio?: number;
    created_at?: Date;
}

export interface ReservaFormData {
    nombre: string;
    email: string;
    telefono: string;
    servicio_id: number;
    fecha: string;
    hora_inicio: string;
    notas?: string;
}

export interface Disponibilidad {
    disponible: boolean;
    motivo?: string;
    horario?: {
        inicio: string;
        fin: string;
    };
    duracion?: number;
    reservasExistentes?: Array<{
        hora_inicio: string;
        hora_fin: string;
    }>;
}

export interface DisponibilidadResponse {
    fecha: string;
    horarios_disponibles: string[];
    servicio_id: number;
    mensaje?: string;
}

export interface horarios_trabajo {
    id?: number;
    dia_semana: number; // 0=Domingo, 1=Lunes, etc.
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
}

export interface DiaBloqueado {
    id?: number;
    fecha: string;
    motivo?: string;
    created_at?: Date;
}

export interface Administrador {
    id?: number;
    nombre: string;
    email: string;
    telefono?: string;
    activo?: boolean;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    administrador: Administrador;
}

export interface Estadisticas {
    total_reservas: number;
    completadas: number;
    canceladas: number;
    pendientes: number;
}
