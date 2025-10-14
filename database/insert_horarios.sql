-- =============================================
-- CONFIGURACIÓN DE HORARIOS DE TRABAJO
-- Para la peluquería StyleCut
-- =============================================

USE Fetagenda;

-- Limpiar horarios existentes
TRUNCATE TABLE horarios_trabajo;

-- Insertar horarios de trabajo
-- dia_semana: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado

-- Lunes a Viernes: 9:00 AM - 7:00 PM
INSERT INTO horarios_trabajo (dia_semana, hora_inicio, hora_fin, activo) VALUES
(1, '09:00:00', '19:00:00', 1), -- Lunes
(2, '09:00:00', '19:00:00', 1), -- Martes
(3, '09:00:00', '19:00:00', 1), -- Miércoles
(4, '09:00:00', '19:00:00', 1), -- Jueves
(5, '09:00:00', '19:00:00', 1); -- Viernes

-- Sábado: 9:00 AM - 6:00 PM
INSERT INTO horarios_trabajo (dia_semana, hora_inicio, hora_fin, activo) VALUES
(6, '09:00:00', '18:00:00', 1); -- Sábado

-- Domingo: CERRADO (no se inserta registro)
-- Cuando no hay registro para un día, el sistema lo considera "no laborable"

-- Verificar los horarios insertados
SELECT 
    CASE dia_semana
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
    END AS Dia,
    hora_inicio,
    hora_fin,
    CASE WHEN activo = 1 THEN 'Activo' ELSE 'Inactivo' END AS Estado
FROM horarios_trabajo
ORDER BY dia_semana;

-- Ejemplo de insertar días bloqueados (vacaciones, días festivos)
-- Descomentar y ajustar fechas según necesites

-- INSERT INTO dias_bloqueados (fecha, motivo) VALUES
-- ('2025-12-25', 'Navidad - Cerrado'),
-- ('2025-01-01', 'Año Nuevo - Cerrado'),
-- ('2025-12-24', 'Nochebuena - Horario especial');

SELECT '✅ Horarios de trabajo configurados correctamente' AS Mensaje;
