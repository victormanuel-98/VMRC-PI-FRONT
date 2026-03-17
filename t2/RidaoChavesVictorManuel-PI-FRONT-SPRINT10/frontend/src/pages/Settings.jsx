import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { obtenerPerfilUsuario, actualizarPerfilUsuario } from '../services/api';

const Settings = () => {
  const { user } = useAuth();
  const { preferences, setLanguage, setTheme, t } = useUiPreferences();
  const breadcrumbItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    { label: t('nav.settings', 'Ajustes'), path: '/ajustes' }
  ];
  const [settings, setSettings] = useState({
    idioma: 'espanol',
    comentarios: 'publico',
    iluminacion: 'claro',
    conectarDispositivo: 'no',
    unidades: 'metrico',
    resumenSemanal: 'si',
    objetivoNutricional: 'equilibrado',
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
          <p>{t('settings.loading', 'Cargando ajustes...')}</p>
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

        <div className="settings-card modern-settings-card">
          <section className="settings-group">
            <h2>{t('settings.accountPrivacy', 'Cuenta y privacidad')}</h2>

            <div className="setting-row">
              <span className="setting-label">{t('settings.language', 'Idioma')}:</span>
              <div className="setting-options">
                <button
                  type="button"
                  className={`setting-chip ${settings.idioma === 'espanol' ? 'active' : ''}`}
                  onClick={() => handleChange('idioma', 'espanol')}
                >
                  {t('settings.spanish', 'Español')}
                </button>
                <button
                  type="button"
                  className={`setting-chip ${settings.idioma === 'ingles' ? 'active' : ''}`}
                  onClick={() => handleChange('idioma', 'ingles')}
                >
                  {t('settings.english', 'Inglés')}
                </button>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t('settings.comments', 'Comentarios')}:</span>
              <div className="setting-options">
                <button
                  type="button"
                  className={`setting-chip ${settings.comentarios === 'publico' ? 'active' : ''}`}
                  onClick={() => handleChange('comentarios', 'publico')}
                >
                  {t('settings.public', 'Público')}
                </button>
                <button
                  type="button"
                  className={`setting-chip ${settings.comentarios === 'privado' ? 'active' : ''}`}
                  onClick={() => handleChange('comentarios', 'privado')}
                >
                  {t('settings.private', 'Privado')}
                </button>
              </div>
            </div>

            <div className="setting-row device-row">
              <span className="setting-label">{t('settings.devices', 'Dispositivos')}:</span>
              <div className="device-question">
                <span className="device-text">{t('settings.connectMobile', '¿Conectar con la cuenta de tu móvil?')}</span>
                <div className="setting-options">
                  <button
                    type="button"
                    className={`setting-chip ${settings.conectarDispositivo === 'si' ? 'active' : ''}`}
                    onClick={() => handleChange('conectarDispositivo', 'si')}
                  >
                    {t('settings.yes', 'Sí')}
                  </button>
                  <button
                    type="button"
                    className={`setting-chip ${settings.conectarDispositivo === 'no' ? 'active' : ''}`}
                    onClick={() => handleChange('conectarDispositivo', 'no')}
                  >
                    {t('settings.no', 'No')}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="settings-group">
            <h2>{t('settings.usageExperience', 'Experiencia de uso')}</h2>

            <div className="setting-row">
              <span className="setting-label">{t('settings.appearance', 'Iluminación')}:</span>
              <div className="setting-options">
                <button
                  type="button"
                  className={`setting-chip ${settings.iluminacion === 'claro' ? 'active' : ''}`}
                  onClick={() => handleChange('iluminacion', 'claro')}
                >
                  {t('settings.light', 'Modo claro')}
                </button>
                <button
                  type="button"
                  className={`setting-chip ${settings.iluminacion === 'oscuro' ? 'active' : ''}`}
                  onClick={() => handleChange('iluminacion', 'oscuro')}
                >
                  {t('settings.dark', 'Modo oscuro')}
                </button>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t('settings.units', 'Unidades')}:</span>
              <div className="setting-options">
                <button
                  type="button"
                  className={`setting-chip ${settings.unidades === 'metrico' ? 'active' : ''}`}
                  onClick={() => handleChange('unidades', 'metrico')}
                >
                  {t('settings.metric', 'Métrico')}
                </button>
                <button
                  type="button"
                  className={`setting-chip ${settings.unidades === 'imperial' ? 'active' : ''}`}
                  onClick={() => handleChange('unidades', 'imperial')}
                >
                  {t('settings.imperial', 'Imperial')}
                </button>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t('settings.weeklySummary', 'Resumen semanal')}:</span>
              <div className="setting-options">
                <button
                  type="button"
                  className={`setting-chip ${settings.resumenSemanal === 'si' ? 'active' : ''}`}
                  onClick={() => handleChange('resumenSemanal', 'si')}
                >
                  {t('settings.enabled', 'Activado')}
                </button>
                <button
                  type="button"
                  className={`setting-chip ${settings.resumenSemanal === 'no' ? 'active' : ''}`}
                  onClick={() => handleChange('resumenSemanal', 'no')}
                >
                  {t('settings.disabled', 'Desactivado')}
                </button>
              </div>
            </div>

            <div className="setting-row">
              <span className="setting-label">{t('settings.nutritionGoal', 'Objetivo nutricional')}:</span>
              <div className="setting-select-wrap">
                <select
                  className="setting-select"
                  value={settings.objetivoNutricional}
                  onChange={(e) => handleChange('objetivoNutricional', e.target.value)}
                >
                  <option value="equilibrado">{t('settings.goalBalanced', 'Equilibrado')}</option>
                  <option value="energia">{t('settings.goalEnergy', 'Más energía')}</option>
                  <option value="definicion">{t('settings.goalDefinition', 'Definición')}</option>
                  <option value="ganancia">{t('settings.goalGain', 'Ganancia muscular')}</option>
                </select>
              </div>
            </div>
          </section>
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
