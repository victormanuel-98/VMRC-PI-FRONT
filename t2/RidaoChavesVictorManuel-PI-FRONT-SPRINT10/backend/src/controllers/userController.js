// Eliminar usuario: RESTRICCIÓN - Solo admin puede borrar otros, nadie puede borrarse a sí mismo.
export const eliminarUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioAutenticado = req.usuario;

        // Evitar que el usuario se borre a sí mismo
        if (usuarioAutenticado.id === id) {
            return res.status(403).json({ mensaje: 'No puedes eliminar tu propia cuenta (restricción de sistema).' });
        }

        // Solo admin puede borrar otros usuarios
        if (usuarioAutenticado.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No tienes permisos para eliminar usuarios.' });
        }

        const usuarioDB = await User.findById(id);
        if (!usuarioDB) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        await usuarioDB.deleteOne();
        res.status(200).json({ mensaje: 'Usuario eliminado correctamente por el administrador' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
    }
};
// Controlador de usuarios: gestiona registro, login, perfil, actualización y validaciones de usuario
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import sendEmail from '../utils/email.js';

const esContraseniaFuerte = (contrasena) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasena);
};

export const registrar = async (req, res) => {
    try {
        const { usuario, email, nombre, apellidos, contrasena, rol } = req.body;

        if (!usuario || !email || !nombre || !contrasena) {
            return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ mensaje: 'Email inválido' });
        }

        if (!esContraseniaFuerte(contrasena)) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial (@$!%*?&)',
            });
        }

        const usuarioExistente = await User.findOne({ $or: [{ usuario }, { email }] });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'Usuario o email ya registrado' });
        }

        const nuevoUsuario = new User({
            usuario,
            email,
            nombre,
            apellidos,
            contrasena,
            rol: rol || 'usuario',
        });

        await nuevoUsuario.save();

        // Enviar correo de bienvenida (no bloqueante)
        sendEmail({
            email: nuevoUsuario.email,
            subject: 'Bienvenido a FitFood',
            mensaje: `Hola ${nuevoUsuario.nombre}, ¡gracias por registrarte en FitFood!`,
            html: `<h1>Bienvenido a FitFood</h1><p>Hola ${nuevoUsuario.nombre},</p><p>¡Gracias por registrarte en nuestra aplicación de recetas saludables!</p>`
        }).catch(err => console.error('Error email:', err.message));

        const token = jwt.sign(
            { id: nuevoUsuario._id, usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: nuevoUsuario._id,
                usuario: nuevoUsuario.usuario,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre,
                rol: nuevoUsuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el registro', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        if (!usuario || !contrasena) {
            return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos' });
        }

        const usuarioEncontrado = await User.findOne({ $or: [{ usuario }, { email: usuario }] }).select('+contrasena');
        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        const esValida = await usuarioEncontrado.compararContrasena(contrasena);
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        const token = jwt.sign(
            { id: usuarioEncontrado._id, usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuarioEncontrado._id,
                usuario: usuarioEncontrado.usuario,
                email: usuarioEncontrado.email,
                nombre: usuarioEncontrado.nombre,
                rol: usuarioEncontrado.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
};

export const verificarToken = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({
            valido: true,
            usuario: {
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al verificar token', error: error.message });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await User.findById(id).select('-contrasena');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({
            usuario: {
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                foto: usuario.foto,
                rol: usuario.rol,
                notificaciones: usuario.notificaciones,
                visibilidad: usuario.visibilidad,
                createdAt: usuario.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, email, telefono, foto, biografia, notificaciones, visibilidad, contrasenaActual, contrasenaNueva } = req.body;

        if (req.usuario.id !== id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para modificar este perfil' });
        }

        const usuario = await User.findById(id).select('+contrasena');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        if (nombre !== undefined) usuario.nombre = nombre;
        if (apellidos !== undefined) usuario.apellidos = apellidos;
        if (telefono !== undefined) usuario.telefono = telefono;
        if (foto !== undefined) usuario.foto = foto;
        if (biografia !== undefined) usuario.biografia = biografia;
        if (notificaciones !== undefined) usuario.notificaciones = notificaciones;
        if (visibilidad !== undefined) usuario.visibilidad = visibilidad;

        if (email !== undefined && email !== usuario.email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ mensaje: 'Email inválido' });
            }
            const emailExistente = await User.findOne({ email });
            if (emailExistente) {
                return res.status(400).json({ mensaje: 'Email ya registrado' });
            }
            usuario.email = email;
        }

        if (contrasenaNueva) {
            if (!contrasenaActual) {
                return res.status(400).json({ mensaje: 'Contraseña actual requerida' });
            }

            const esValida = await usuario.compararContrasena(contrasenaActual);
            if (!esValida) {
                return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
            }

            if (!esContraseniaFuerte(contrasenaNueva)) {
                return res.status(400).json({
                    mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial',
                });
            }

            usuario.contrasena = contrasenaNueva;
        }

        await usuario.save();
        // Emitir evento websocket
        if (req.app && req.app.get) {
            const io = req.app.get('io');
            if (io) {
                io.emit('perfilActualizado', { usuario });
            }
        }

        res.status(200).json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario: {
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                foto: usuario.foto,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
    }
};
