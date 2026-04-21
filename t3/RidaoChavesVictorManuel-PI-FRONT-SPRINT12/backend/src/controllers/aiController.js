// Controlador para la integración de IA: gestiona el chat con el asistente FitFood
// Responde en español, ayuda sobre recetas, nutrición, uso de la app y hábitos saludables
// No da consejos médicos ni diagnósticos
const LMSTUDIO_BASE_URL = process.env.LMSTUDIO_BASE_URL || 'http://localhost:1234/v1';
const LMSTUDIO_MODEL = process.env.LMSTUDIO_MODEL || 'qwen3';
const LMSTUDIO_TIMEOUT_MS = Number(process.env.LMSTUDIO_TIMEOUT_MS || 20000);

const buildSystemPrompt = (usuario) => {
    const nombre = usuario?.nombre || 'usuario';
    return (
        'Eres el asistente de FitFood. Responde en español con un tono claro, breve y práctico. ' +
        'Ayuda con recetas, nutrición básica, uso de la app y hábitos saludables. ' +
        'No des consejos médicos ni diagnósticos. Si falta información, haz una pregunta breve. ' +
        `El usuario se llama ${nombre}.`
    );
};

export const chatConIA = async (req, res) => {
    try {
        const { mensajes } = req.body;

        if (!Array.isArray(mensajes) || mensajes.length === 0) {
            return res.status(400).json({ mensaje: 'La conversación está vacía' });
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), LMSTUDIO_TIMEOUT_MS);

        const payload = {
            model: LMSTUDIO_MODEL,
            temperature: 0.4,
            max_tokens: 512,
            messages: [
                { role: 'system', content: buildSystemPrompt(req.usuario) },
                ...mensajes,
            ],
        };

        const response = await fetch(`${LMSTUDIO_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(502).json({ mensaje: 'Error al conectar con el modelo', detalle: errorText });
        }

        const data = await response.json();
        const respuesta = data?.choices?.[0]?.message?.content || '';

        return res.status(200).json({ respuesta });
    } catch (error) {
        const mensaje = error.name === 'AbortError'
            ? 'Tiempo de espera agotado al consultar la IA'
            : 'Error al procesar la consulta con IA';
        return res.status(500).json({ mensaje });
    }
};
