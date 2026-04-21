import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { enviarMensaje } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';

const Contact = () => {
    const { user } = useAuth();
    const { t } = useUiPreferences();
    const contactHighlights = [
        { label: t('contact.highlight.response', 'Tiempo medio de respuesta'), value: '< 24h' },
        { label: t('contact.highlight.users', 'Usuarios atendidos'), value: '+12.000' },
        { label: t('contact.highlight.satisfaction', 'Satisfacción soporte'), value: '4.9/5' }
    ];

    const faqs = [
        {
            question: t('contact.faq1q', '¿Cuánto tardáis en responder?'),
            answer: t('contact.faq1a', 'Normalmente respondemos en menos de 24 horas laborables.')
        },
        {
            question: t('contact.faq2q', '¿Puedo sugerir nuevas funciones?'),
            answer: t('contact.faq2a', 'Sí, nos encantan las sugerencias para mejorar FitFood.')
        },
        {
            question: t('contact.faq3q', '¿Qué incluir en una incidencia?'),
            answer: t('contact.faq3a', 'Describe el problema y, si puedes, añade pasos para reproducirlo.')
        }
    ];

    const breadcrumbItems = [
        { label: t('nav.home', 'Inicio'), path: '/inicio' },
        { label: t('contact.breadcrumb', 'Contacto'), path: '/contacto' }
    ];
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        email: user?.email || '',
        asunto: '',
        contenido: ''
    });

    const [enviado, setEnviado] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setEnviando(true);

        try {
            const respuesta = await enviarMensaje(formData, localStorage.getItem('token'));

            if (respuesta.id) {
                setEnviado(true);
                setTimeout(() => {
                    setEnviado(false);
                    setFormData({
                        nombre: user?.nombre || '',
                        email: user?.email || '',
                        asunto: '',
                        contenido: ''
                    });
                }, 3000);
            }
        } catch {
            setError(t('contact.error', 'Error al enviar el mensaje. Inténtalo de nuevo.'));
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="contact-page">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="contact-container">
                <div className="contact-hero">
                    <div className="contact-hero-content">
                        <span className="contact-kicker">{t('contact.kicker', 'Soporte FitFood')}</span>
                        <h1 className="contact-title">{t('contact.title', 'Contáctanos')}</h1>
                        <p className="contact-subtitle">
                            {t('contact.subtitle', 'Cuéntanos qué necesitas y te ayudamos a resolverlo rápido. Queremos que tu experiencia en FitFood sea excelente.')}
                        </p>

                        <div className="contact-highlight-list">
                            {contactHighlights.map((item) => (
                                <article key={item.label} className="contact-highlight-card">
                                    <span>{item.label}</span>
                                    <strong>{item.value}</strong>
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="contact-hero-image">
                        <img src="/images/650_1200.jpg" alt={t('contact.title', 'Contáctanos')} />
                    </div>
                </div>

                <div className="contact-content">
                    <div className="contact-form-section">
                        <h2 className="contact-section-title">{t('contact.messageTitle', 'Envíanos un mensaje')}</h2>
                        <p className="contact-section-text">{t('contact.messageSubtitle', 'Te responderemos con la mayor brevedad posible.')}</p>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nombre">{t('contact.fullName', 'Nombre completo')}</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder={t('contact.placeholderName', 'Tu nombre')}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">{t('register.email', 'Correo electrónico')}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="tu@email.com"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="asunto">{t('contact.subject', 'Asunto')}</label>
                                <input
                                    type="text"
                                    id="asunto"
                                    name="asunto"
                                    value={formData.asunto}
                                    onChange={handleChange}
                                    placeholder={t('contact.placeholderSubject', '¿En qué podemos ayudarte?')}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="contenido">{t('contact.message', 'Mensaje')}</label>
                                <textarea
                                    id="contenido"
                                    name="contenido"
                                    value={formData.contenido}
                                    onChange={handleChange}
                                    placeholder={t('contact.placeholderMessage', 'Escribe tu mensaje aquí...')}
                                    rows="6"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button" disabled={enviando}>
                                {enviando ? t('contact.sending', 'Enviando...') : t('contact.send', 'Enviar mensaje')}
                            </button>

                            {error && <div className="error-message">{error}</div>}

                            {enviado && (
                                <div className="success-message">
                                    {t('contact.sent', 'Mensaje enviado correctamente. Te contactaremos pronto.')}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="contact-info-section">
                        <div className="contact-info-intro">
                            <h3>{t('contact.otherChannelsTitle', 'También puedes escribirnos por otras vías')}</h3>
                            <p>{t('contact.otherChannelsBody', 'Escoge el canal que prefieras y nos pondremos en contacto contigo.')}</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Email</h3>
                            <p>contacto@fitfood.com</p>
                            <p>soporte@fitfood.com</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>{t('contact.phone', 'Teléfono')}</h3>
                            <p>+34 900 123 456</p>
                            <p>Lun - Vie: 9:00 - 18:00</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>{t('contact.address', 'Dirección')}</h3>
                            <p>Calle Saludable, 123</p>
                            <p>{t('contact.cityCountry', '28001 Madrid, España')}</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3>{t('contact.schedule', 'Horario')}</h3>
                            <p>{t('contact.weekSchedule', 'Lunes - Viernes: 9:00 - 18:00')}</p>
                            <p>{t('contact.saturdaySchedule', 'Sábados: 10:00 - 14:00')}</p>
                        </div>

                        <div className="contact-faq-card">
                            <h3>{t('contact.faqTitle', 'Preguntas frecuentes')}</h3>
                            <div className="contact-faq-list">
                                {faqs.map((faq) => (
                                    <article key={faq.question} className="contact-faq-item">
                                        <strong>{faq.question}</strong>
                                        <p>{faq.answer}</p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
