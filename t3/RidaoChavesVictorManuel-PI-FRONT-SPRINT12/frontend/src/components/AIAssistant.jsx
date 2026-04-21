import React, { useState } from 'react';
import { enviarConsultaIA } from '../services/api';
import { useUiPreferences } from '../context/UiPreferencesContext';

const createMessage = (role, content) => ({
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content
});

const AIAssistant = () => {
    const { t } = useUiPreferences();
    const [abierto, setAbierto] = useState(false);
    const [entrada, setEntrada] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [mensajes, setMensajes] = useState([
        { id: 'assistant-welcome', role: 'assistant', content: t('assistant.welcome', 'Hola, soy tu asistente FitFood. ¿En qué te ayudo hoy?') },
    ]);

    const enviar = async () => {
        const texto = entrada.trim();
        if (!texto || cargando) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setError(t('assistant.errorLoginRequired', 'Necesitas iniciar sesión para usar el asistente.'));
            return;
        }

        setError('');
        const nuevosMensajes = [...mensajes, createMessage('user', texto)];
        setMensajes(nuevosMensajes);
        setEntrada('');
        setCargando(true);

        try {
            const respuesta = await enviarConsultaIA(
                nuevosMensajes.map((m) => ({ role: m.role, content: m.content })),
                token
            );

            if (respuesta?.respuesta) {
                setMensajes((prev) => [...prev, createMessage('assistant', respuesta.respuesta)]);
            } else {
                setError(respuesta?.mensaje || t('assistant.errorNoResponse', 'No se pudo obtener respuesta de la IA.'));
            }
        } catch (e) {
            console.error('AI assistant connection error:', e);
            setError(t('assistant.errorConnect', 'No se pudo conectar con la IA.'));
        } finally {
            setCargando(false);
        }
    };

    const manejarKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviar();
        }
    };

    return (
        <div className={`ai-assistant ${abierto ? 'open' : ''}`}>
            <button
                className="ai-toggle"
                onClick={() => setAbierto((prev) => !prev)}
                aria-label={t('assistant.openAria', 'Abrir asistente IA')}
            >
                <span className="ai-toggle-icon" aria-hidden="true">🤖</span>
            </button>

            {abierto && (
                <div className="ai-panel">
                    <div className="ai-header">
                        <div className="ai-title-row">
                            <span className="ai-logo" aria-hidden="true">🤖</span>
                            <div className="ai-title">{t('assistant.title', 'Asistente FitFood')}</div>
                        </div>
                        <div className="ai-subtitle">{t('assistant.subtitle', 'Basado en Qwen3 (LM Studio)')}</div>
                    </div>

                    <div className="ai-messages">
                        {mensajes.map((m) => (
                            <div key={m.id} className={`ai-message ${m.role}`}>
                                {m.content}
                            </div>
                        ))}
                        {cargando && (
                            <div className="ai-message assistant">{t('assistant.thinking', 'Pensando...')}</div>
                        )}
                    </div>

                    {error && <div className="ai-error">{error}</div>}

                    <div className="ai-input">
                        <textarea
                            value={entrada}
                            onChange={(e) => setEntrada(e.target.value)}
                            onKeyDown={manejarKeyDown}
                            placeholder={t('assistant.placeholder', 'Escribe tu pregunta...')}
                            rows={2}
                        />
                        <button onClick={enviar} disabled={cargando || !entrada.trim()}>
                            {t('assistant.send', 'Enviar')}
                        </button>
                    </div>

                    <div className="ai-hints">
                        <button onClick={() => setEntrada(t('assistant.promptBreakfast', 'Sugiéreme un desayuno saludable y rápido.'))}>{t('assistant.hintBreakfast', 'Desayuno rápido')}</button>
                        <button onClick={() => setEntrada(t('assistant.promptMacros', '¿Cómo equilibrar proteínas, grasas y carbohidratos?'))}>{t('assistant.hintMacros', 'Macronutrientes')}</button>
                        <button onClick={() => setEntrada(t('assistant.promptDinner', 'Dame ideas para una cena ligera.'))}>{t('assistant.hintDinner', 'Cena ligera')}</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
