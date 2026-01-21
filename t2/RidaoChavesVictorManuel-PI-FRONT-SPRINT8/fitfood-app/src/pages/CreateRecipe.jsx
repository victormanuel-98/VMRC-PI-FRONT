import React, { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';

const MAX_INGREDIENTS = 10;

const CreateRecipe = () => {
  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mis Recetas', path: '/mis-recetas' },
    { label: 'Crear Nueva Receta', path: '/crear-receta' }
  ];
  const [form, setForm] = useState({
    nombre: '',
    dificultad: 'facil',
    autor: '',
    descripcionCorta: '',
    descripcionLarga: '',
  });

  const [ingredients, setIngredients] = useState(
    Array.from({ length: MAX_INGREDIENTS }, (_, idx) => ({ id: idx, name: '', quantity: 0 }))
  );

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (id, field, value) => {
    setIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)));
  };

  const handleClear = () => {
    setForm({ nombre: '', dificultad: 'facil', autor: '', descripcionCorta: '', descripcionLarga: '' });
    setIngredients(Array.from({ length: MAX_INGREDIENTS }, (_, idx) => ({ id: idx, name: '', quantity: 0 })));
    setPreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result || null);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Receta guardada (demo)');
  };

  return (
    <div className="create-recipe-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="create-recipe-card">
        <header className="create-header">
          <p className="create-subtitle">
            Aquí puedes crear tu propia receta, podrás añadir una imagen con el resultado así como la lista de
            ingredientes, ingredientes y mucho más...
          </p>
        </header>

        <section className="section-block">
          <h2 className="section-heading">DATOS</h2>
          <div className="data-grid">
            <div className="upload-panel">
              <div className="upload-box">
                {preview ? <img src={preview} alt="Vista previa" /> : <div className="upload-placeholder" />}
              </div>
              <label className="upload-button">
                Subir desde el dispositivo
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>

            <div className="form-panel">
              <div className="form-row">
                <label>Nombre del plato:</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Escribir..."
                />
              </div>

              <div className="form-row difficulty-row">
                <label>Dificultad:</label>
                <div className="difficulty-options">
                  {[
                    { value: 'facil', label: 'Fácil' },
                    { value: 'medio', label: 'Medio' },
                    { value: 'dificil', label: 'Difícil' },
                  ].map((opt) => (
                    <label key={opt.value} className="difficulty-option">
                      <input
                        type="radio"
                        name="dificultad"
                        value={opt.value}
                        checked={form.dificultad === opt.value}
                        onChange={handleChange}
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <label>Autor:</label>
                <input
                  type="text"
                  name="autor"
                  value={form.autor}
                  onChange={handleChange}
                  placeholder="Escribir..."
                />
              </div>

              <div className="form-row">
                <label>Descripción:</label>
                <input
                  type="text"
                  name="descripcionCorta"
                  value={form.descripcionCorta}
                  onChange={handleChange}
                  placeholder="Escribir..."
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-heading">INGREDIENTES</h2>
          <div className="ingredients-grid">
            {ingredients.map((ing) => (
              <div key={ing.id} className="ingredient-row">
                <input
                  type="text"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                  placeholder="Escribe el nombre del alimento"
                />
                <div className="quantity-input">
                  <span>x</span>
                  <input
                    type="number"
                    min="0"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(ing.id, 'quantity', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-heading">DESCRIPCIÓN</h2>
          <textarea
            name="descripcionLarga"
            value={form.descripcionLarga}
            onChange={handleChange}
            placeholder="Escribir..."
            rows={8}
          />
        </section>

        <div className="actions">
          <button className="primary" onClick={handleSubmit}>Aceptar</button>
          <button className="secondary" onClick={handleClear}>Limpiar campos</button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
