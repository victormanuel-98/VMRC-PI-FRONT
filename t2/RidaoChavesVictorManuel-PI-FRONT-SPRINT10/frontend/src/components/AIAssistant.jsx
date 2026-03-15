import React, { useState } from 'react';
import { enviarConsultaIA } from '../services/api';

const AIAssistant = () => {
    const [abierto, setAbierto] = useState(false);
    const [entrada, setEntrada] = useState('');
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');
    const [mensajes, setMensajes] = useState([
        { role: 'assistant', content: 'Hola, soy tu asistente FitFood. ¿En qué te ayudo hoy?' },
    ]);

    const enviar = async () => {
        const texto = entrada.trim();
        if (!texto || cargando) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setError('Necesitas iniciar sesión para usar el asistente.');
            return;
        }

        setError('');
        const nuevosMensajes = [...mensajes, { role: 'user', content: texto }];
        setMensajes(nuevosMensajes);
        setEntrada('');
        setCargando(true);

        try {
            const respuesta = await enviarConsultaIA(
                nuevosMensajes.map((m) => ({ role: m.role, content: m.content })),
                token
            );

            if (respuesta?.respuesta) {
                setMensajes((prev) => [...prev, { role: 'assistant', content: respuesta.respuesta }]);
            } else {
                setError(respuesta?.mensaje || 'No se pudo obtener respuesta de la IA.');
            }
        } catch (e) {
            setError('No se pudo conectar con la IA.');
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
                aria-label="Abrir asistente IA"
            >
                {abierto ? '' : ''}
            </button>

            {abierto && (
                <div className="ai-panel">
                    <div className="ai-header">
                        <div className="ai-title">Asistente FitFood</div>
                        <div className="ai-subtitle">Basado en Qwen3 (LM Studio)</div>
                    </div>

                    <div className="ai-messages">
                        {mensajes.map((m, idx) => (
                            <div key={idx} className={`ai-message ${m.role}`}>
                                {m.content}
                            </div>
                        ))}
                        {cargando && (
                            <div className="ai-message assistant">Pensando...</div>
                        )}
                    </div>

                    {error && <div className="ai-error">{error}</div>}

                    <div className="ai-input">
                        <textarea
                            value={entrada}
                            onChange={(e) => setEntrada(e.target.value)}
                            onKeyDown={manejarKeyDown}
                            placeholder="Escribe tu pregunta..."
                            rows={2}
                        />
                        <button onClick={enviar} disabled={cargando || !entrada.trim()}>
                            Enviar
                        </button>
                    </div>

                    <div className="ai-hints">
                        <button onClick={() => setEntrada('Sugiéreme un desayuno saludable y rápido.')}>Desayuno rápido</button>
                        <button onClick={() => setEntrada('¿Cómo equilibrar proteínas, grasas y carbohidratos?')}>Macronutrientes</button>
                        <button onClick={() => setEntrada('Dame ideas para una cena ligera.')}>Cena ligera</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIAssistant;
