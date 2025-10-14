const Administrador = require('../models/Administrador');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login de administrador
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const admin = await Administrador.buscarPorEmail(email);

        if (!admin) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const passwordValida = await Administrador.verificarPassword(password, admin.password);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            administrador: {
                id: admin.id,
                nombre: admin.nombre,
                email: admin.email,
                telefono: admin.telefono
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Obtener perfil del administrador autenticado
exports.perfil = async (req, res) => {
    try {
        const admin = await Administrador.buscarPorId(req.administradorId);

        if (!admin) {
            return res.status(404).json({ error: 'Administrador no encontrado' });
        }

        res.json(admin);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// Cambiar contraseña
exports.cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, nuevoPassword } = req.body;

        if (!passwordActual || !nuevoPassword) {
            return res.status(400).json({ error: 'Contraseña actual y nueva contraseña son requeridas' });
        }

        const admin = await Administrador.buscarPorEmail(
            (await Administrador.buscarPorId(req.administradorId)).email
        );

        const passwordValida = await Administrador.verificarPassword(passwordActual, admin.password);

        if (!passwordValida) {
            return res.status(401).json({ error: 'Contraseña actual incorrecta' });
        }

        await Administrador.cambiarPassword(req.administradorId, nuevoPassword);

        res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};
