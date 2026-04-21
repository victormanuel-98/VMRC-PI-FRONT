import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { obtenerPerfilUsuario, actualizarPerfilUsuario, subirImagenPerfil } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22256%22 height=%22256%22 viewBox=%220 0 256 256%22%3E%3Crect width=%22256%22 height=%22256%22 rx=%2232%22 fill=%22%23d9e7ef%22/%3E%3Ccircle cx=%22128%22 cy=%2296%22 r=%2248%22 fill=%22%2380a2b2%22/%3E%3Cpath d=%22M48 220c12-40 46-64 80-64s68 24 80 64%22 fill=%22none%22 stroke=%22%2380a2b2%22 stroke-width=%2224%22 stroke-linecap=%22round%22/%3E%3C/svg%3E';

const normalizeAvatarUrl = (value) => {
  if (typeof value !== 'string') return '';
  let cleaned = value.trim();
  if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
    cleaned = cleaned.slice(1, -1);
  }
  if (!cleaned || cleaned.toLowerCase() === 'null' || cleaned.toLowerCase() === 'undefined') return '';
  return cleaned;
};

const Profile = () => {
  const { t } = useUiPreferences();
  const { user } = useAuth();
  const breadcrumbItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    { label: t('nav.profile', 'Mi Perfil'), path: '/perfil' }
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

  const [previewImage, setPreviewImage] = useState(DEFAULT_AVATAR);
  const [imagenBase64, setImagenBase64] = useState(null);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const userInitials = useMemo(() => {
    const first = formData.nombre?.trim()?.charAt(0) || '';
    const last = formData.apellidos?.trim()?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || 'FF';
  }, [formData.nombre, formData.apellidos]);

  const avatarSrc = useMemo(() => {
    return normalizeAvatarUrl(previewImage) || DEFAULT_AVATAR;
  }, [previewImage]);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      if (!user?.id) {
        throw new Error(t('profile.invalidSession', 'Sesión inválida. Vuelve a iniciar sesión.'));
      }

      const token = localStorage.getItem('token');
      const respuesta = await obtenerPerfilUsuario(user.id, token);
      
      if (respuesta.usuario) {
        const { nombre, apellidos, usuario, email, telefono, foto, notificaciones } = respuesta.usuario;
        const savedAvatar = normalizeAvatarUrl(localStorage.getItem('userAvatar'));
        const apiAvatar = normalizeAvatarUrl(foto);

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
        
        setPreviewImage(apiAvatar || savedAvatar || DEFAULT_AVATAR);
        setAvatarFailed(false);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setMensaje({ texto: t('profile.loadError', 'Error al cargar el perfil'), tipo: 'error' });
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
        setMensaje({ texto: t('profile.imageSizeError', 'La imagen no puede superar los 5MB'), tipo: 'error' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setImagenBase64(reader.result);
        setAvatarFailed(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarError = () => {
    if (avatarSrc !== DEFAULT_AVATAR) {
      setPreviewImage(DEFAULT_AVATAR);
      setAvatarFailed(false);
      return;
    }
    setAvatarFailed(true);
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
          throw new Error(respuestaImagen.mensaje || t('createRecipe.errorImageUpload', 'Error al subir la imagen'));
        }
        fotoUrl = respuestaImagen.url;
      }

      if (formData.contrasenaNueva) {
        if (formData.contrasenaNueva !== formData.confirmarContrasena) {
          throw new Error(t('profile.passwordMismatch', 'Las contraseñas no coinciden'));
        }
        if (!formData.contrasenaActual) {
          throw new Error(t('profile.currentPasswordRequired', 'Debes ingresar tu contraseña actual para cambiarla'));
        }
        if (formData.contrasenaNueva.length < 8) {
          throw new Error(t('profile.passwordLengthError', 'La nueva contraseña debe tener al menos 8 caracteres'));
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
        throw new Error(respuesta.mensaje || t('profile.updateError', 'Error al actualizar el perfil'));
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
        const normalizedFotoUrl = normalizeAvatarUrl(fotoUrl);
        if (normalizedFotoUrl) {
          localStorage.setItem('userAvatar', normalizedFotoUrl);
          setPreviewImage(normalizedFotoUrl);
          setAvatarFailed(false);
        }
      }

      setFormData(prev => ({
        ...prev,
        contrasenaActual: '',
        contrasenaNueva: '',
        confirmarContrasena: ''
      }));

      setImagenBase64(null);
      setMensaje({ texto: t('profile.updated', 'Perfil actualizado correctamente'), tipo: 'success' });
      
      setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMensaje({ 
        texto: error.message || t('profile.updateError', 'Error al actualizar el perfil'), 
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
        <div className="loading">{t('profile.loading', 'Cargando perfil...')}</div>
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
              {!avatarFailed && (
                <img key={avatarSrc} src={avatarSrc} alt="Avatar" onError={handleAvatarError} />
              )}
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
              {t('profile.changeImage', 'Cambiar imagen')}
            </button>
          </div>

          <div className="profile-hero-right">
            <span className="profile-kicker">{t('profile.kicker', 'Perfil FitFood')}</span>
            <h1 className="profile-title">{formData.nombre || t('nav.profile', 'Mi perfil')}</h1>
            <p className="profile-subtitle">
              {t('profile.subtitle', 'Mantén tus datos actualizados para personalizar mejor tus recetas y recomendaciones.')}
            </p>
            <p className="profile-user-label">@{formData.usuario || 'fitfood'}</p>
          </div>
        </section>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-content modern-profile-layout">
            <div className="profile-right profile-main-form">
              <section className="profile-form-panel">
                <h3 className="profile-panel-title">{t('profile.personalData', 'Datos personales')}</h3>

                <div className="profile-field-grid">
                  <div className="profile-field">
                    <label htmlFor="nombre">{t('register.firstName', 'Nombre')}</label>
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
                    <label htmlFor="apellidos">{t('register.lastName', 'Apellidos')}</label>
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
                    <label htmlFor="usuario">{t('register.username', 'Usuario')}</label>
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
                    <label htmlFor="telefono">{t('register.phone', 'Teléfono')}</label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder={t('profile.optional', 'Opcional')}
                      disabled={guardando}
                    />
                  </div>
                </div>

                <div className="profile-field">
                  <label htmlFor="email">{t('register.email', 'Correo')}</label>
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
                  <span>{t('profile.notifications', 'Notificaciones')}</span>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="notificaciones"
                        checked={formData.notificaciones === true}
                        onChange={() => setFormData(prev => ({ ...prev, notificaciones: true }))}
                        disabled={guardando}
                      />
                      {t('common.yes', 'Sí')}
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="radio"
                        name="notificaciones"
                        checked={formData.notificaciones === false}
                        onChange={() => setFormData(prev => ({ ...prev, notificaciones: false }))}
                        disabled={guardando}
                      />
                      {t('common.no', 'No')}
                    </label>
                  </div>
                </div>
              </section>

              <section className="profile-form-panel">
                <h3 className="profile-panel-title">{t('profile.securityTitle', 'Seguridad de la cuenta')}</h3>
                <p className="profile-panel-note">{t('profile.securityNote', 'Rellena estos campos solo si deseas cambiar tu contraseña.')}</p>

                <div className="profile-field">
                  <label htmlFor="contrasenaActual">{t('profile.currentPassword', 'Contraseña actual')}</label>
                  <input
                    type="password"
                    id="contrasenaActual"
                    name="contrasenaActual"
                    value={formData.contrasenaActual}
                    onChange={handleChange}
                    placeholder={t('profile.currentPasswordPlaceholder', 'Requerida si cambias la contraseña')}
                    disabled={guardando}
                  />
                </div>

                <div className="profile-field-grid">
                  <div className="profile-field">
                    <label htmlFor="contrasenaNueva">{t('profile.newPassword', 'Nueva contraseña')}</label>
                    <input
                      type="password"
                      id="contrasenaNueva"
                      name="contrasenaNueva"
                      value={formData.contrasenaNueva}
                      onChange={handleChange}
                      placeholder={t('profile.newPasswordPlaceholder', 'Mínimo 8 caracteres')}
                      disabled={guardando}
                    />
                  </div>

                  <div className="profile-field">
                    <label htmlFor="confirmarContrasena">{t('profile.confirmPassword', 'Confirmar contraseña')}</label>
                    <input
                      type="password"
                      id="confirmarContrasena"
                      name="confirmarContrasena"
                      value={formData.confirmarContrasena}
                      onChange={handleChange}
                      placeholder={t('profile.confirmPasswordPlaceholder', 'Repite la nueva contraseña')}
                      disabled={guardando}
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>

          <button type="submit" className="save-btn" disabled={guardando}>
            {guardando ? t('common.saving', 'Guardando...') : t('profile.saveChanges', 'Guardar cambios')}
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
