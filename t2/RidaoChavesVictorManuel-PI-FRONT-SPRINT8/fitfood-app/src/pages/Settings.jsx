import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const Settings = () => {
  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Ajustes', path: '/ajustes' }
  ];
  const [settings, setSettings] = useState({
    idioma: 'espanol',
    comentarios: 'publico',
    iluminacion: 'claro',
    conectarDispositivo: 'no',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (category, value) => {
    setSettings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = () => {
    // Aquí se guardarían los cambios (localStorage, API, etc.)
    console.log('Ajustes guardados:', settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="settings-container">
        <h1 className="settings-title">AJUSTES GENERALES</h1>

        <div className="settings-card">
          <div className="setting-row">
            <label className="setting-label">Idioma:</label>
            <div className="setting-options">
              <label className="option-checkbox">
                <span>Español</span>
                <input
                  type="radio"
                  name="idioma"
                  value="espanol"
                  checked={settings.idioma === 'espanol'}
                  onChange={() => handleChange('idioma', 'espanol')}
                />
              </label>
              <label className="option-checkbox">
                <span>Inglés</span>
                <input
                  type="radio"
                  name="idioma"
                  value="ingles"
                  checked={settings.idioma === 'ingles'}
                  onChange={() => handleChange('idioma', 'ingles')}
                />
              </label>
            </div>
          </div>

          <div className="setting-row">
            <label className="setting-label">Comentarios:</label>
            <div className="setting-options">
              <label className="option-checkbox">
                <span>Público</span>
                <input
                  type="radio"
                  name="comentarios"
                  value="publico"
                  checked={settings.comentarios === 'publico'}
                  onChange={() => handleChange('comentarios', 'publico')}
                />
              </label>
              <label className="option-checkbox">
                <span>Privado</span>
                <input
                  type="radio"
                  name="comentarios"
                  value="privado"
                  checked={settings.comentarios === 'privado'}
                  onChange={() => handleChange('comentarios', 'privado')}
                />
              </label>
            </div>
          </div>

          <div className="setting-row">
            <label className="setting-label">Iluminación:</label>
            <div className="setting-options">
              <label className="option-checkbox">
                <span>Modo claro</span>
                <input
                  type="radio"
                  name="iluminacion"
                  value="claro"
                  checked={settings.iluminacion === 'claro'}
                  onChange={() => handleChange('iluminacion', 'claro')}
                />
              </label>
              <label className="option-checkbox">
                <span>Modo oscuro</span>
                <input
                  type="radio"
                  name="iluminacion"
                  value="oscuro"
                  checked={settings.iluminacion === 'oscuro'}
                  onChange={() => handleChange('iluminacion', 'oscuro')}
                />
              </label>
            </div>
          </div>

          <div className="setting-row device-row">
            <label className="setting-label">Dispositivos:</label>
            <div className="device-question">
              <span className="device-text">¿Conectar con la cuenta de tu móvil?</span>
              <div className="setting-options">
                <label className="option-checkbox">
                  <span>Sí</span>
                  <input
                    type="radio"
                    name="conectarDispositivo"
                    value="si"
                    checked={settings.conectarDispositivo === 'si'}
                    onChange={() => handleChange('conectarDispositivo', 'si')}
                  />
                </label>
                <label className="option-checkbox">
                  <span>No</span>
                  <input
                    type="radio"
                    name="conectarDispositivo"
                    value="no"
                    checked={settings.conectarDispositivo === 'no'}
                    onChange={() => handleChange('conectarDispositivo', 'no')}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        <button className="save-button" onClick={handleSave}>
          Guardar cambios
        </button>

        {saved && (
          <div className="success-message">
            ✓ Cambios guardados correctamente
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
