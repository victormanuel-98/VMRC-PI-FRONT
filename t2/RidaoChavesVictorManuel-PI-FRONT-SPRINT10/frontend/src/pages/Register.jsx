import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { registro } from '../services/api';

const DEFAULT_AVATAR = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22 viewBox=%220 0 180 180%22%3E%3Crect width=%22180%22 height=%22180%22 rx=%2212%22 fill=%22%23dfe8ed%22/%3E%3Ccircle cx=%2290%22 cy=%2268%22 r=%2232%22 fill=%22%2384a3b1%22/%3E%3Cpath d=%22M36 156c10-30 30-48 54-48s44 18 54 48%22 fill=%22none%22 stroke=%22%2384a3b1%22 stroke-width=%2218%22 stroke-linecap=%22round%22/%3E%3C/svg%3E';

const Register = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState(DEFAULT_AVATAR);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    contrasena: '',
    email: '',
    telefono: '',
    notificaciones: false,
    visibilidad: 'publica'
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { preferences, toggleTheme, toggleLanguage, t } = useUiPreferences();

  const requiredFields = ['nombre', 'apellidos', 'usuario', 'contrasena', 'email'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: nextValue
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const readerPreview = new FileReader();
      readerPreview.onloadend = () => {
        setPreviewImage(readerPreview.result);
      };
      readerPreview.readAsDataURL(file);

      const readerBase64 = new FileReader();
      readerBase64.onloadend = () => {
        setImagenUrl(readerBase64.result);
      };
      readerBase64.readAsDataURL(file);
    }
  };

  const handlePreviewError = (e) => {
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  const validateForm = () => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = true;
      }
    });

    if (formData.email && !formData.email.includes('@')) {
      newErrors.email = true;
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (formData.contrasena && !strongPassword.test(formData.contrasena)) {
      newErrors.contrasena = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const datosRegistro = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        usuario: formData.usuario,
        contrasena: formData.contrasena,
        email: formData.email,
        telefono: formData.telefono,
        foto: imagenUrl,
        notificaciones: formData.notificaciones,
        visibilidad: formData.visibilidad
      };

      const respuesta = await registro(datosRegistro);
      
      if (respuesta.token) {
        setSubmitMessage(t('register.success', '¡Cuenta creada correctamente! Redirigiendo a login...'));
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ general: respuesta.mensaje || t('register.errorCreate', 'Error al crear la cuenta') });
      }
    } catch (err) {
      setErrors({ general: err?.message || t('register.errorConnection', 'Error de conexión. Verifica que el servidor esté activo.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page auth-page">
      <div className="auth-quick-controls">
        <button type="button" onClick={toggleTheme} className="auth-quick-btn">
          {preferences.theme === 'dark' ? t('auth.themeLight', 'Modo claro') : t('auth.themeDark', 'Modo oscuro')}
        </button>
        <button type="button" onClick={toggleLanguage} className="auth-quick-btn">
          {preferences.language === 'en' ? t('auth.spanish', 'Español') : t('auth.english', 'English')}
        </button>
      </div>
      <div className="register-container auth-register-shell">
        <div className="auth-heading register-heading">
          <span className="auth-badge">FitFood</span>
          <h1 className="welcome-title">{t('register.title', 'Crear cuenta')}</h1>
          <p className="welcome-subtitle">{t('register.subtitle', 'Accede a tus recetas, planes y ajustes personalizados.')}</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-content">
            <div className="register-left register-left-modern">
              <h3 className="register-section-title">{t('register.photo', 'Foto de perfil')}</h3>
              <div className="register-avatar">
                <img src={previewImage || DEFAULT_AVATAR} alt="Avatar" onError={handlePreviewError} />
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
                className="upload-image-btn"
                onClick={() => document.getElementById('image-upload').click()}
              >
                {t('register.uploadImage', 'Subir imagen')}
              </button>
            </div>

            <div className="register-right">
              <h3 className="register-section-title">{t('register.personalData', 'Datos personales')}</h3>
              
              <div className="form-row-register">
                <label>{t('register.firstName', 'Nombre')} {requiredFields.includes('nombre') && <span className="required-icon">▶</span>}</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? 'input-error' : ''}
                  placeholder={t('contact.placeholderName', 'Tu nombre')}
                />
              </div>

              <div className="form-row-register">
                <label>{t('register.lastName', 'Apellidos')} {requiredFields.includes('apellidos') && <span className="required-icon">▶</span>}</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={errors.apellidos ? 'input-error' : ''}
                  placeholder={t('register.placeholderLastName', 'Tus apellidos')}
                />
              </div>

              <div className="form-row-register">
                <label>{t('register.username', 'Nombre de usuario')} {requiredFields.includes('usuario') && <span className="required-icon">▶</span>}</label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className={errors.usuario ? 'input-error' : ''}
                  placeholder={t('register.placeholderUsername', 'Tu nombre de usuario')}
                />
              </div>

              <div className="form-row-register">
                <label>{t('register.password', 'Contraseña')} {requiredFields.includes('contrasena') && <span className="required-icon">▶</span>}</label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className={errors.contrasena ? 'input-error' : ''}
                  placeholder={t('register.placeholderPassword', 'Mín. 8, mayúscula, número y símbolo')}
                />
              </div>

              <div className="form-row-register">
                <label>{t('register.email', 'Correo electrónico')} {requiredFields.includes('email') && <span className="required-icon">▶</span>}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'input-error' : ''}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-row-register">
                <label>{t('register.phone', 'Número de teléfono')} <span className="optional-icon">▶</span></label>
                <div className="phone-input-group">
                  <span className="phone-prefix">+34</span>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder={t('register.placeholderPhone', 'Tu teléfono')}
                  />
                </div>
              </div>

              <div className="form-row-register">
                <label>{t('register.notifications', 'Notificaciones al correo')} <span className="optional-icon">▶</span></label>
                <input
                  type="checkbox"
                  name="notificaciones"
                  checked={formData.notificaciones}
                  onChange={handleChange}
                  className="checkbox-input"
                />
              </div>

              <div className="form-row-register visibility-row">
                <label>{t('register.visibility', 'Visibilidad')} <span className="optional-icon">▶</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibilidad"
                      value="publica"
                      checked={formData.visibilidad === 'publica'}
                      onChange={handleChange}
                    />
                    {t('register.public', 'Público')}
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibilidad"
                      value="privada"
                      checked={formData.visibilidad === 'privada'}
                      onChange={handleChange}
                    />
                    {t('register.private', 'Privado')}
                  </label>
                </div>
              </div>

              <p className="required-note">{t('register.requiredNote', "*Los campos con el icono '▶' son obligatorios")}</p>
            </div>
          </div>

          <div className="register-button-container">
            <button
              type="button"
              className="back-login-btn"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              {t('register.backToLogin', 'Volver al login')}
            </button>
            <button type="submit" className="create-account-btn register-submit-btn" disabled={loading}>
              {loading ? t('register.submitLoading', 'Creando cuenta...') : t('register.submit', 'Crear usuario')}
            </button>
          </div>

          {errors.general && (
            <div className="error-message">
              {errors.general}
            </div>
          )}

          {submitMessage && (
            <div className="register-success-message">
              {submitMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
