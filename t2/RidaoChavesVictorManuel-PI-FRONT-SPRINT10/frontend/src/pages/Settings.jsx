import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { obtenerPerfilUsuario, actualizarPerfilUsuario } from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  const { preferences, setLanguage, setTheme, t } = useUiPreferences();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarAjustes = async () => {
      try {
        const localSettings = localStorage.getItem('userSettings');
        if (localSettings) {
          const parsed = JSON.parse(localSettings);
          setSettings((prev) => ({
            ...prev,
            ...parsed,
            idioma: parsed.idioma || (preferences.language === 'en' ? 'ingles' : 'espanol'),
            iluminacion: parsed.iluminacion || (preferences.theme === 'dark' ? 'oscuro' : 'claro')
          }));
        } else {
          setSettings((prev) => ({
            ...prev,
            idioma: preferences.language === 'en' ? 'ingles' : 'espanol',
            iluminacion: preferences.theme === 'dark' ? 'oscuro' : 'claro'
          }));
        }

        if (!user?.id) {
          setLoading(false);
          return;
        }

        const token = localStorage.getItem('token');
        const respuesta = await obtenerPerfilUsuario(user.id, token);

        if (respuesta?.usuario) {
          setSettings((prev) => ({
            ...prev,
            comentarios: respuesta.usuario.visibilidad === 'privada' ? 'privado' : 'publico',
          }));
        }
      } catch {
        // fallback a localStorage
      } finally {
        setLoading(false);
      }
    };

    cargarAjustes();
  }, [user?.id]);

  const handleChange = (category, value) => {
    setSettings((prev) => ({ ...prev, [category]: value }));
  };

  const handleSave = async () => {
    const mergedSettings = {
      ...settings,
      idioma: settings.idioma,
      iluminacion: settings.iluminacion
    };
    localStorage.setItem('userSettings', JSON.stringify(mergedSettings));

    setLanguage(settings.idioma === 'ingles' ? 'en' : 'es');
    setTheme(settings.iluminacion === 'oscuro' ? 'dark' : 'light');

    try {
      if (user?.id) {
        const token = localStorage.getItem('token');
        await actualizarPerfilUsuario(
          user.id,
          {
            visibilidad: settings.comentarios === 'privado' ? 'privada' : 'publica',
          },
          token
        );
      }
    } catch {
      // mantenemos guardado local aunque falle backend
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <div className="settings-page">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="settings-container">
          <p>Cargando ajustes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="settings-container">
        <div className="settings-top">
          <h1 className="settings-title">{t('settings.title', 'AJUSTES GENERALES')}</h1>
          <p className="settings-subtitle">{t('settings.subtitle', 'Controla idioma, apariencia y preferencias de interacción.')}</p>
        </div>

        <div className="settings-card">
          <div className="setting-row">
            <label className="setting-label">{t('settings.language', 'Idioma')}:</label>
            <div className="setting-options">
              <label className="option-checkbox">
                <span>{t('settings.spanish', 'Español')}</span>
                <input
                  type="radio"
                  name="idioma"
                  value="espanol"
                  checked={settings.idioma === 'espanol'}
                  onChange={() => handleChange('idioma', 'espanol')}
                />
              </label>
              <label className="option-checkbox">
                <span>{t('settings.english', 'Inglés')}</span>
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
            <label className="setting-label">{t('settings.comments', 'Comentarios')}:</label>
            <div className="setting-options">
              <label className="option-checkbox">
                <span>{t('settings.public', 'Público')}</span>
                <input
                  type="radio"
                  name="comentarios"
                  value="publico"
                  checked={settings.comentarios === 'publico'}
                  onChange={() => handleChange('comentarios', 'publico')}
                />
              </label>
              <label className="option-checkbox">
                <span>{t('settings.private', 'Privado')}</span>
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
            <label className="setting-label">{t('settings.appearance', 'Iluminación')}:</label>
            <div className="setting-options">
              <label className="option-checkbox">
                <span>{t('settings.light', 'Modo claro')}</span>
                <input
                  type="radio"
                  name="iluminacion"
                  value="claro"
                  checked={settings.iluminacion === 'claro'}
                  onChange={() => handleChange('iluminacion', 'claro')}
                />
              </label>
              <label className="option-checkbox">
                <span>{t('settings.dark', 'Modo oscuro')}</span>
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
            <label className="setting-label">{t('settings.devices', 'Dispositivos')}:</label>
            <div className="device-question">
              <span className="device-text">{t('settings.connectMobile', '¿Conectar con la cuenta de tu móvil?')}</span>
              <div className="setting-options">
                <label className="option-checkbox">
                  <span>{t('settings.yes', 'Sí')}</span>
                  <input
                    type="radio"
                    name="conectarDispositivo"
                    value="si"
                    checked={settings.conectarDispositivo === 'si'}
                    onChange={() => handleChange('conectarDispositivo', 'si')}
                  />
                </label>
                <label className="option-checkbox">
                  <span>{t('settings.no', 'No')}</span>
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
          {t('settings.save', 'Guardar cambios')}
        </button>

        {saved && (
          <div className="success-message">
            {t('settings.saved', 'Cambios guardados correctamente')}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
