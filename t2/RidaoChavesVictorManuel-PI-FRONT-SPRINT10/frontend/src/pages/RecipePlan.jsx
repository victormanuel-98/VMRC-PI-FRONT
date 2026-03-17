import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useUiPreferences } from '../context/UiPreferencesContext';

const RecipePlan = () => {
  const navigate = useNavigate();
  const { t, preferences } = useUiPreferences();

  const weekPlan = [
    { day: preferences.language === 'en' ? 'Monday' : 'Lunes', meal: preferences.language === 'en' ? 'Mediterranean bowl' : 'Bowl mediterráneo', kcal: '520 kcal', route: '/platos/almuerzo' },
    { day: preferences.language === 'en' ? 'Tuesday' : 'Martes', meal: preferences.language === 'en' ? 'Omelette + salad' : 'Tortilla + ensalada', kcal: '470 kcal', route: '/platos/cena' },
    { day: preferences.language === 'en' ? 'Wednesday' : 'Miércoles', meal: preferences.language === 'en' ? 'Healthy pad thai' : 'Pad thai saludable', kcal: '560 kcal', route: '/platos/almuerzo' },
    { day: preferences.language === 'en' ? 'Thursday' : 'Jueves', meal: preferences.language === 'en' ? 'Soup + toasts' : 'Sopa + tostadas', kcal: '430 kcal', route: '/platos/cena' },
    { day: preferences.language === 'en' ? 'Friday' : 'Viernes', meal: preferences.language === 'en' ? 'Salmon with rice' : 'Salmón con arroz', kcal: '590 kcal', route: '/platos/almuerzo' }
  ];

  const breadcrumbItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    { label: t('plan.breadcrumb1', 'Mis Recetas'), path: '/recetas' },
    { label: t('plan.breadcrumb2', 'Plan semanal'), path: '/recetas/plan' }
  ];

  return (
    <div className="plan-page">
      <Breadcrumbs items={breadcrumbItems} />

      <section className="plan-hero">
        <div>
          <span className="collections-kicker">{t('plan.kicker', 'Planificación')}</span>
          <h1>{t('plan.title', 'Plan semanal sugerido')}</h1>
          <p>{t('plan.subtitle', 'Una propuesta base para organizar tus comidas. Puedes usarla como punto de partida.')}</p>
        </div>
        <img src="/images/Pagina inicio.png" alt="Plan semanal FitFood" />
      </section>

      <section className="plan-table">
        {weekPlan.map((item) => (
          <article key={item.day} className="plan-row">
            <div>
              <strong>{item.day}</strong>
              <p>{item.meal}</p>
            </div>
            <span>{item.kcal}</span>
            <button className="recipe-button" onClick={() => navigate(item.route)}>{t('plan.viewIdeas', 'Ver ideas')}</button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default RecipePlan;
