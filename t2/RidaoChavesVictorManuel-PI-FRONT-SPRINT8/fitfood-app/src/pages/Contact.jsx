import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const Contact = () => {
    const breadcrumbItems = [
        { label: 'Inicio', path: '/inicio' },
        { label: 'Contacto', path: '/contacto' }
    ];
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: ''
    });

    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario de contacto:', formData);
        setEnviado(true);
        setTimeout(() => {
            setEnviado(false);
            setFormData({
                nombre: '',
                email: '',
                asunto: '',
                mensaje: ''
            });
        }, 3000);
    };

    return (
        <div className="contact-page">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="contact-container">
                <div className="contact-header">
                    <h1 className="contact-title">Contáctanos</h1>
                    <p className="contact-subtitle">¿Tienes alguna pregunta? Estamos aquí para ayudarte</p>
                </div>

                <div className="contact-content">
                    <div className="contact-form-section">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nombre">Nombre completo</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Correo electrónico</label>
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
                                <label htmlFor="asunto">Asunto</label>
                                <input
                                    type="text"
                                    id="asunto"
                                    name="asunto"
                                    value={formData.asunto}
                                    onChange={handleChange}
                                    placeholder="¿En qué podemos ayudarte?"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mensaje">Mensaje</label>
                                <textarea
                                    id="mensaje"
                                    name="mensaje"
                                    value={formData.mensaje}
                                    onChange={handleChange}
                                    placeholder="Escribe tu mensaje aquí..."
                                    rows="6"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="submit-button">
                                Enviar mensaje
                            </button>

                            {enviado && (
                                <div className="success-message">
                                    ✓ Mensaje enviado correctamente. Te contactaremos pronto.
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="contact-info-section">
                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Email</h3>
                            <p>contacto@fitfood.com</p>
                            <p>soporte@fitfood.com</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Teléfono</h3>
                            <p>+34 900 123 456</p>
                            <p>Lun - Vie: 9:00 - 18:00</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <h3>Dirección</h3>
                            <p>Calle Saludable, 123</p>
                            <p>28001 Madrid, España</p>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <h3>Horario</h3>
                            <p>Lunes - Viernes: 9:00 - 18:00</p>
                            <p>Sábados: 10:00 - 14:00</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
