-- Crear bd 

CREATE DATABASE IF NOT EXISTS cecyt9
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_general_ci;

    USE cecyt9;

    -- USUARIOS
    CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        correo VARCHAR(100) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL,
        boleta CHAR(10) NOT NULL UNIQUE,
        rol VARCHAR(20) NOT NULL DEFAULT 'alumno'
    ) ENGINE=InnoDB DEFAULT CHARACTER SET utf8mb4;


    -- talleres 

    CREATE TABLE IF NOT EXISTS talleres (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        descripcion TEXT,
        instructor VARCHAR(100),
        fecha DATE,
        cupo INT DEFAULT 30,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;

    -- ASISTENCIAS

    CREATE TABLE IF NOT EXISTS asistencias (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        taller_id INT NOT NULL,
        nombre_alumno VARCHAR(100) NULL,
        boleta VARCHAR(10) NULL,
        fecha_asistencia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
        FOREIGN KEY (taller_id) REFERENCES talleres(id) ON DELETE CASCADE,
        UNIQUE KEY unique_asistencia (usuario_id, taller_id)
    ) ENGINE=InnoDB;


    -- DATOS RANDOM PARA PRUEBAS

    INSERT IGNORE INTO usuarios (nombre, correo, boleta, rol, contrasena) VALUES
    ('Control Escolar', 'control@cecyt9.local', '2026000011', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Ricardo Gomez Cruz', 'ricardo.gomez@alumno.cecyt9.local', '2026000012', 'alumno', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Patricia Flores Mejia', 'patricia.flores@alumno.cecyt9.local', '2026000013', 'alumno', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Eduardo Jimenez Ortiz', 'eduardo.jimenez@docente.cecyt9.local', '2026000014', 'docente', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Gabriela Alva Chavez', 'gabriela.alva@alumno.cecyt9.local', '2026000015', 'alumno', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Mauricio Sosa Castro', 'mauricio.sosa@alumno.cecyt9.local', '2026000016', 'alumno', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Laura Mendez Rios', 'laura.mendez@docente.cecyt9.local', '2026000017', 'docente', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
    ('Andres Esparza Nova', 'andres.esparza@alumno.cecyt9.local', '2026000018', 'alumno', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

    INSERT IGNORE INTO talleres (nombre, descripcion, instructor, fecha, cupo) VALUES
    ('Fundamentos de Linux', 'Introducción a la terminal y comandos básicos del sistema', 'Ing. Cosme Fulanito De Tal', '2026-10-28', 30),
    ('Ciberseguridad 101', 'Principios esenciales de seguridad informática y hacking ético', 'Ing. Max Power Simpson', '2026-10-29', 25),
    ('Desarrollo en Flutter', 'Creación de aplicaciones móviles nativas para iOS y Android', 'Ing. El Chavo Del Ocho', '2026-04-15', 20),
    ('Backend con Node.js', 'Construcción de APIs REST eficientes y escalables', 'Ing. Laura Flores', '2026-05-10', 35),
    ('Modelado de Datos NoSQL', 'Estructura de bases de datos no relacionales con MongoDB', 'Ing. Ricardo Medina', '2026-05-20', 25),
    ('Frontend con React', 'Desarrollo de interfaces de usuario modernas y basadas en componentes', 'Ing. Gabriela Solis', '2026-06-05', 30);

INSERT IGNORE INTO asistencias (usuario_id, taller_id) VALUES
    (2, 2),
    (2, 5),
    (3, 2),
    (3, 4),
    (5, 3),
    (5, 6),
    (6, 2),
    (6, 1),
    (8, 4),
    (8, 5);
