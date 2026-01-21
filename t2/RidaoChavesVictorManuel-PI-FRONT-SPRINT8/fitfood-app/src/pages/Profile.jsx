import React, { useState, useEffect } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const Profile = () => {
  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mi Perfil', path: '/perfil' }
  ];
  const [formData, setFormData] = useState({
    nombre: 'Victor Manuel',
    apellidos: 'Ridao Chaves',
    usuario: 'victor_98',
    contrasena: 'Admin123',
    correo: 'victormanuel.ridaochaves@gmail.com',
    telefono: '',
    notificaciones: true
  });

  const [previewImage, setPreviewImage] = useState('/default-avatar.png');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setPreviewImage(savedAvatar);
    }
  }, []);

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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        localStorage.setItem('userAvatar', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos guardados:', formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="profile-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="profile-container">
        <h1 className="profile-title">Mi perfil</h1>
        
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="profile-content">
            <div className="profile-left">
              <div className="profile-avatar">
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
                className="change-image-btn"
                onClick={() => document.getElementById('image-upload').click()}
              >
                Cambiar imagen
              </button>
            </div>

            <div className="profile-right">
              <div className="form-row">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="apellidos">Apellidos:</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="usuario">Usuario:</label>
                <input
                  type="text"
                  id="usuario"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="contrasena">Contraseña:</label>
                <input
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  value={formData.contrasena}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Opcional"
                />
              </div>

              <div className="form-row notifications-row">
                <label>Notificaciones:</label>
                <div className="checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="notificaciones"
                      checked={formData.notificaciones === true}
                      onChange={() => setFormData(prev => ({ ...prev, notificaciones: true }))}
                    />
                    Sí
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="radio"
                      name="notificaciones"
                      checked={formData.notificaciones === false}
                      onChange={() => setFormData(prev => ({ ...prev, notificaciones: false }))}
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="save-btn">
            Guardar cambios
          </button>

          {saved && (
            <div className="success-message">
              ✓ Cambios guardados correctamente
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
