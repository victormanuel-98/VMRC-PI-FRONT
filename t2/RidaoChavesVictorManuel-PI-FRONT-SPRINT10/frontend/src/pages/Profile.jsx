import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { obtenerPerfilUsuario, actualizarPerfilUsuario, subirImagenPerfil } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

const Profile = () => {
  const { user } = useAuth();
  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mi Perfil', path: '/perfil' }
  ];
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    email: '',
    telefono: '',
    notificaciones: true,
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });

  const [previewImage, setPreviewImage] = useState('/default-avatar.png');
  const [imagenBase64, setImagenBase64] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const userInitials = useMemo(() => {
    const first = formData.nombre?.trim()?.charAt(0) || '';
    const last = formData.apellidos?.trim()?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'FF';
  }, [formData.nombre, formData.apellidos]);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      if (!user?.id) {
        throw new Error('Sesión inválida. Vuelve a iniciar sesión.');
      }

      const token = localStorage.getItem('token');
      const respuesta = await obtenerPerfilUsuario(user.id, token);
      
      if (respuesta.usuario) {
        const { nombre, apellidos, usuario, email, telefono, foto, notificaciones } = respuesta.usuario;
        setFormData({
          nombre: nombre || '',
          apellidos: apellidos || '',
          usuario: usuario || '',
          email: email || '',
          telefono: telefono || '',
          notificaciones: notificaciones ?? true,
          contrasenaActual: '',
          contrasenaNueva: '',
          confirmarContrasena: ''
        });
        
        if (foto) {
          setPreviewImage(foto);
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setMensaje({ texto: 'Error al cargar el perfil', tipo: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMensaje({ texto: 'La imagen no puede superar los 5MB', tipo: 'error' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImagenBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const token = localStorage.getItem('token');
      let fotoUrl = null;

      if (imagenBase64) {
        const respuestaImagen = await subirImagenPerfil(imagenBase64, token);
        if (respuestaImagen.error) {
          throw new Error(respuestaImagen.mensaje || 'Error al subir la imagen');
        }
        fotoUrl = respuestaImagen.url;
      }

      if (formData.contrasenaNueva) {
        if (formData.contrasenaNueva !== formData.confirmarContrasena) {
          throw new Error('Las contraseñas no coinciden');
        }
        if (!formData.contrasenaActual) {
          throw new Error('Debes ingresar tu contraseña actual para cambiarla');
        }
        if (formData.contrasenaNueva.length < 8) {
          throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
        }
      }

      const datosActualizacion = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        usuario: formData.usuario,
        email: formData.email,
        telefono: formData.telefono,
        notificaciones: formData.notificaciones
      };

      if (fotoUrl) {
        datosActualizacion.foto = fotoUrl;
      }

      if (formData.contrasenaNueva) {
        datosActualizacion.contrasenaActual = formData.contrasenaActual;
        datosActualizacion.contrasenaNueva = formData.contrasenaNueva;
      }

      const respuesta = await actualizarPerfilUsuario(user.id, datosActualizacion, token);

      if (respuesta.error) {
        throw new Error(respuesta.mensaje || 'Error al actualizar el perfil');
      }

      if (respuesta?.usuario) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          id: respuesta.usuario.id,
          usuario: respuesta.usuario.usuario,
          nombre: respuesta.usuario.nombre,
          rol: respuesta.usuario.rol,
          email: respuesta.usuario.email,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      if (fotoUrl) {
        localStorage.setItem('userAvatar', fotoUrl);
      }

      setFormData(prev => ({
        ...prev,
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
      }));

      setImagenBase64(null);
      setMensaje({ texto: 'Perfil actualizado correctamente', tipo: 'success' });
      
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMensaje({ 
        texto: error.message || 'Error al actualizar el perfil', 
        tipo: 'error' 
      });
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="loading">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="profile-container">
        <section className="profile-hero">
          <div className="profile-hero-left">
            <div className="profile-avatar large-avatar">
              <img src={previewImage} alt="Avatar" />
              <span className="profile-avatar-initials">{userInitials}</span>
            </div>
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="change-image-btn"
              onClick={() => document.getElementById('image-upload').click()}
              disabled={guardando}
            >
              Cambiar imagen
            </button>
          </div>

          <div className="profile-hero-right">
            <span className="profile-kicker">Perfil FitFood</span>
            <h1 className="profile-title">{formData.nombre || 'Mi perfil'}</h1>
            <p className="profile-subtitle">
              Mantén tus datos actualizados para personalizar mejor tus recetas y recomendaciones.
            </p>
            <p className="profile-user-label">@{formData.usuario || 'fitfood'}</p>
          </div>
        </section>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-content modern-profile-layout">
            <div className="profile-right profile-main-form">
              <section className="profile-form-panel">
                <h3 className="profile-panel-title">Datos personales</h3>

                <div className="profile-field-grid">
                  <div className="profile-field">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      disabled={guardando}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="apellidos">Apellidos</label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleChange}
                      required
                      disabled={guardando}
                    />
                  </div>
                </div>

                <div className="profile-field-grid">
                  <div className="profile-field">
                    <label htmlFor="usuario">Usuario</label>
                    <input
                      type="text"
                      id="usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleChange}
                      required
                      disabled={guardando}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="Opcional"
                      disabled={guardando}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="email">Correo</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={guardando}
                  />
                </div>

                <div className="profile-toggle-row">
                  <span>Notificaciones</span>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="notificaciones"
                        checked={formData.notificaciones === true}
                        onChange={() => setFormData(prev => ({ ...prev, notificaciones: true }))}
                        disabled={guardando}
                      />
                      Sí
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="notificaciones"
                        checked={formData.notificaciones === false}
                        onChange={() => setFormData(prev => ({ ...prev, notificaciones: false }))}
                        disabled={guardando}
                      />
                      No
                    </label>
                  </div>
                </div>
              </section>

              <section className="profile-form-panel">
                <h3 className="profile-panel-title">Seguridad de la cuenta</h3>
                <p className="profile-panel-note">Rellena estos campos solo si deseas cambiar tu contraseña.</p>

                <div className="profile-field">
                  <label htmlFor="contrasenaActual">Contraseña actual</label>
                  <input
                    type="password"
                    id="contrasenaActual"
                    name="contrasenaActual"
                    value={formData.contrasenaActual}
                    onChange={handleChange}
                    placeholder="Requerida si cambias la contraseña"
                    disabled={guardando}
                  />
                </div>

                <div className="profile-field-grid">
                  <div className="profile-field">
                    <label htmlFor="contrasenaNueva">Nueva contraseña</label>
                    <input
                      type="password"
                      id="contrasenaNueva"
                      name="contrasenaNueva"
                      value={formData.contrasenaNueva}
                      onChange={handleChange}
                      placeholder="Mínimo 8 caracteres"
                      disabled={guardando}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
                    <input
                      type="password"
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      placeholder="Repite la nueva contraseña"
                      disabled={guardando}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>

          {mensaje.texto && (
            <div className={`message ${mensaje.tipo}`}>
              {mensaje.texto}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
