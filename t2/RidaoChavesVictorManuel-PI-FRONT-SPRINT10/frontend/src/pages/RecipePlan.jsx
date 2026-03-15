import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const weekPlan = [
  { day: 'Lunes', meal: 'Bowl mediterráneo', kcal: '520 kcal', route: '/platos/almuerzo' },
  { day: 'Martes', meal: 'Tortilla + ensalada', kcal: '470 kcal', route: '/platos/cena' },
  { day: 'Miércoles', meal: 'Pad thai saludable', kcal: '560 kcal', route: '/platos/almuerzo' },
  { day: 'Jueves', meal: 'Sopa + tostadas', kcal: '430 kcal', route: '/platos/cena' },
  { day: 'Viernes', meal: 'Salmón con arroz', kcal: '590 kcal', route: '/platos/almuerzo' }
];

const RecipePlan = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mis Recetas', path: '/recetas' },
    { label: 'Plan semanal', path: '/recetas/plan' }
  ];

  return (
    <div className="plan-page">
      <Breadcrumbs items={breadcrumbItems} />

      <section className="plan-hero">
        <div>
          <span className="collections-kicker">Planificación</span>
          <h1>Plan semanal sugerido</h1>
          <p>Una propuesta base para organizar tus comidas. Puedes usarla como punto de partida.</p>
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
            <button className="recipe-button" onClick={() => navigate(item.route)}>Ver ideas</button>
          </article>
        ))}
      </section>
    </div>
  );
};

export default RecipePlan;
