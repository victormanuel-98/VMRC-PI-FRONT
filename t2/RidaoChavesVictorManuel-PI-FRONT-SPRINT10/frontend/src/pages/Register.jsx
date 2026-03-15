import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registro, subirImagenPerfil } from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState('/default-avatar.png');
  const [imagenUrl, setImagenUrl] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    usuario: '',
    contrasena: '',
    correo: '',
    telefono: '',
    notificaciones: false,
    visibilidad: 'publico'
  });

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const requiredFields = ['nombre', 'apellidos', 'usuario', 'contrasena', 'correo'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'radio' ? value : value)
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

      const readerUpload = new FileReader();
      readerUpload.onloadend = async () => {
        try {
          setLoading(true);
          const base64 = readerUpload.result;
          const respuesta = await subirImagenPerfil(base64, null);
          
          if (respuesta.url) {
            setImagenUrl(respuesta.url);
          }
        } catch (err) {
          console.error('Error al subir imagen:', err);
        } finally {
          setLoading(false);
        }
      };
      readerUpload.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = true;
      }
    });

    if (formData.correo && !formData.correo.includes('@')) {
      newErrors.correo = true;
    }

    if (formData.contrasena && formData.contrasena.length < 6) {
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
        correo: formData.correo,
        telefono: formData.telefono,
        foto: imagenUrl,
        notificaciones: formData.notificaciones,
        visibilidad: formData.visibilidad
      };

      const respuesta = await registro(datosRegistro);
      
      if (respuesta.token) {
        setSubmitMessage('¡Cuenta creada correctamente! Redirigiendo a login...');
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ general: respuesta.mensaje || 'Error al crear la cuenta' });
      }
    } catch (err) {
      setErrors({ general: 'Error de conexión. Verifica que el servidor esté activo.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-content">
            <div className="register-left">
              <h3 className="register-section-title">Foto de perfil</h3>
              <div className="register-avatar">
                <img src={previewImage} alt="Avatar" />
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
                Subir desde el dispositivo
              </button>
            </div>

            <div className="register-right">
              <h3 className="register-section-title">Datos personales</h3>
              
              <div className="form-row-register">
                <label>Nombre {requiredFields.includes('nombre') && <span className="required-icon">▶</span>}</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={errors.nombre ? 'input-error' : ''}
                  placeholder="Tu nombre"
                />
              </div>

              <div className="form-row-register">
                <label>Apellidos {requiredFields.includes('apellidos') && <span className="required-icon">▶</span>}</label>
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className={errors.apellidos ? 'input-error' : ''}
                  placeholder="Tus apellidos"
                />
              </div>

              <div className="form-row-register">
                <label>Nombre de usuario {requiredFields.includes('usuario') && <span className="required-icon">▶</span>}</label>
                <input
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  className={errors.usuario ? 'input-error' : ''}
                  placeholder="Tu nombre de usuario"
                />
              </div>

              <div className="form-row-register">
                <label>Contraseña {requiredFields.includes('contrasena') && <span className="required-icon">▶</span>}</label>
                <input
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  className={errors.contrasena ? 'input-error' : ''}
                  placeholder="Tu contraseña (mín. 6 caracteres)"
                />
              </div>

              <div className="form-row-register">
                <label>Correo electrónico {requiredFields.includes('correo') && <span className="required-icon">▶</span>}</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={errors.correo ? 'input-error' : ''}
                  placeholder="tu@email.com"
                />
              </div>

              <div className="form-row-register">
                <label>Número de teléfono <span className="optional-icon">▶</span></label>
                <div className="phone-input-group">
                  <span className="phone-prefix">+34</span>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Tu teléfono"
                  />
                </div>
              </div>

              <div className="form-row-register">
                <label>Notificaciones al correo <span className="optional-icon">▶</span></label>
                <input
                  type="checkbox"
                  name="notificaciones"
                  checked={formData.notificaciones}
                  onChange={handleChange}
                  className="checkbox-input"
                />
              </div>

              <div className="form-row-register visibility-row">
                <label>Visibilidad <span className="optional-icon">▶</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibilidad"
                      value="publico"
                      checked={formData.visibilidad === 'publico'}
                      onChange={handleChange}
                    />
                    Público
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="visibilidad"
                      value="privado"
                      checked={formData.visibilidad === 'privado'}
                      onChange={handleChange}
                    />
                    Privado
                  </label>
                </div>
              </div>

              <p className="required-note">*Los campos con el icono '▶' son obligatorios</p>
            </div>
          </div>

          <div className="register-button-container">
            <button type="submit" className="create-account-btn" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear usuario'}
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
