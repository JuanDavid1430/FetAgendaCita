-- Script de creación de base de datos para FetAgenda
-- Sistema de Reserva de Citas

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS Fetagenda CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE Fetagenda;

-- Tabla de Administradores
CREATE TABLE IF NOT EXISTS administradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Servicios
CREATE TABLE IF NOT EXISTS servicios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT NOT NULL COMMENT 'Duración en minutos',
    precio DECIMAL(10, 2),
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_telefono (telefono)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Horarios de Trabajo
CREATE TABLE IF NOT EXISTS horarios_trabajo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana TINYINT NOT NULL COMMENT '0=Domingo, 1=Lunes, ..., 6=Sábado',
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_dia (dia_semana)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Días Bloqueados (Feriados, Vacaciones)
CREATE TABLE IF NOT EXISTS dias_bloqueados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de Reservas/Citas
CREATE TABLE IF NOT EXISTS reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    servicio_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'completada', 'cancelada') DEFAULT 'pendiente',
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (servicio_id) REFERENCES servicios(id) ON DELETE RESTRICT,
    INDEX idx_fecha (fecha),
    INDEX idx_estado (estado),
    INDEX idx_cliente (cliente_id),
    INDEX idx_servicio (servicio_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo

-- Administrador por defecto (password: admin123 - debes cambiar esto en producción)
INSERT INTO administradores (nombre, email, password, telefono) VALUES
('Administrador', 'admin@fetagenda.com', '$2b$10$XIuusi43kOGBvD2TzDe3xO3YalCA7ft30OcLjAALBiLr55VFK6gaO', '1234567890');

-- Horarios de trabajo por defecto (Lunes a Viernes, 9 AM a 5 PM)
INSERT INTO horarios_trabajo (dia_semana, hora_inicio, hora_fin, activo) VALUES
(1, '09:00:00', '17:00:00', TRUE), -- Lunes
(2, '09:00:00', '17:00:00', TRUE), -- Martes
(3, '09:00:00', '17:00:00', TRUE), -- Miércoles
(4, '09:00:00', '17:00:00', TRUE), -- Jueves
(5, '09:00:00', '17:00:00', TRUE), -- Viernes
(6, '09:00:00', '13:00:00', FALSE), -- Sábado (deshabilitado por defecto)
(0, '09:00:00', '13:00:00', FALSE); -- Domingo (deshabilitado por defecto)

INSERT INTO servicios (nombre, descripcion, duracion, precio, activo) VALUES
('Corte de Cabello Dama', 'Corte personalizado según tu estilo, incluye lavado y secado', 45, 250.00, 1),
('Corte de Cabello Caballero', 'Corte masculino moderno, incluye lavado y peinado', 30, 150.00, 1),
('Tinte Completo', 'Aplicación de tinte de calidad premium en todo el cabello', 120, 600.00, 1),
('Mechas Californianas', 'Mechas naturales para dar luminosidad a tu cabello', 150, 800.00, 1),
('Alaciado Permanente', 'Tratamiento de alaciado duradero con queratina', 180, 1200.00, 1),
('Peinado para Evento', 'Peinado profesional para bodas, fiestas o eventos especiales', 60, 400.00, 1),
('Tratamiento Capilar', 'Hidratación profunda y reparación del cabello maltratado', 45, 350.00, 1),
('Corte + Tinte', 'Paquete especial: corte y tinte completo', 150, 750.00, 1),
('Barba y Bigote', 'Perfilado y arreglo de barba con diseño personalizado', 20, 100.00, 1),
('Manicure', 'Cuidado completo de manos y uñas con esmaltado', 45, 200.00, 1),
('Pedicure', 'Cuidado completo de pies y uñas con masaje relajante', 60, 250.00, 1),
('Depilación Facial', 'Depilación de cejas, bozo y rostro', 30, 150.00, 1);

-- Trigger para validar que no haya solapamiento de reservas
DELIMITER //
CREATE TRIGGER validar_reserva_antes_insertar
BEFORE INSERT ON reservas
FOR EACH ROW
BEGIN
    DECLARE conflicto INT;
    
    SELECT COUNT(*) INTO conflicto
    FROM reservas
    WHERE fecha = NEW.fecha
    AND estado NOT IN ('cancelada')
    AND (
        (hora_inicio <= NEW.hora_inicio AND hora_fin > NEW.hora_inicio)
        OR (hora_inicio < NEW.hora_fin AND hora_fin >= NEW.hora_fin)
        OR (hora_inicio >= NEW.hora_inicio AND hora_fin <= NEW.hora_fin)
    );
    
    IF conflicto > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe una reserva en ese horario';
    END IF;
END//
DELIMITER ;



-- Actualizar información del administrador
UPDATE administradores 
SET nombre = 'StyleCut Admin', 
    telefono = '5559876543' 
WHERE email = 'admin@fetagenda.com';


