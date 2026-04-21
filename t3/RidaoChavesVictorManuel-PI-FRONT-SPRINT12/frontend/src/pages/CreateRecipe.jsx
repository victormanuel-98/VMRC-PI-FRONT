import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { subirImagenReceta, crearReceta, obtenerIngredientes } from '../services/api';

const MAX_INGREDIENTS = 10;

const CreateRecipe = () => {
  const { t } = useUiPreferences();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const breadcrumbItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    { label: t('nav.myRecipes', 'Mis Recetas'), path: '/recetas' },
    { label: t('createRecipe.breadcrumb', 'Crear Nueva Receta'), path: '/recetas/crear' }
  ];

  const [form, setForm] = useState({
    nombre: '',
    dificultad: 'facil',
    descripcionCorta: '',
    descripcionLarga: '',
    categoria: 'almuerzo',
    tiempoPreparacion: 0,
  });

  const [ingredients, setIngredients] = useState(
    Array.from({ length: MAX_INGREDIENTS }, (_, idx) => ({
      id: idx,
      name: '',
      quantity: 0,
      ingredienteId: null
    }))
  );

  const [preview, setPreview] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ingredientSuggestions, setIngredientSuggestions] = useState([]);
  const [searchingIngredient, setSearchingIngredient] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = async (id, field, value) => {
    setIngredients((prev) => prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing)));

    if (field === 'name' && value.length > 2) {
      setSearchingIngredient(id);
      try {
        const respuesta = await obtenerIngredientes(value);
        if (respuesta.ingredientes) {
          setIngredientSuggestions(respuesta.ingredientes.map(ing => ({
            id: ing._id,
            nombre: ing.nombre,
            rowId: id
          })));
        }
      } catch (err) {
        console.error('Error buscando ingredientes:', err);
      }
    } else if (field === 'name' && value.length <= 2) {
      setIngredientSuggestions([]);
    }
  };

  const handleSelectIngredient = (rowId, ingredienteId, nombre) => {
    setIngredients((prev) =>
      prev.map((ing) =>
        ing.id === rowId ? { ...ing, name: nombre, ingredienteId: ingredienteId } : ing
      )
    );
    setIngredientSuggestions([]);
    setSearchingIngredient(null);
  };

  const handleClear = () => {
    setForm({
      nombre: '',
      dificultad: 'facil',
      descripcionCorta: '',
      descripcionLarga: '',
      categoria: 'almuerzo',
      tiempoPreparacion: 0,
    });
    setIngredients(Array.from({ length: MAX_INGREDIENTS }, (_, idx) => ({
      id: idx,
      name: '',
      quantity: 0,
      ingredienteId: null
    })));
    setPreview(null);
    setImagenUrl(null);
    setError('');
    setIngredientSuggestions([]);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result || null);
    reader.readAsDataURL(file);

    const readerUpload = new FileReader();
    readerUpload.onload = async (ev) => {
      try {
        setLoading(true);
        const base64 = ev.target?.result;
        const respuesta = await subirImagenReceta(base64, localStorage.getItem('token'));

        if (respuesta.url) {
          setImagenUrl(respuesta.url);
          setError('');
        } else {
          setError(t('createRecipe.errorImageUpload', 'Error al subir la imagen'));
        }
      } catch {
        setError(t('createRecipe.errorImageProcess', 'Error al procesar la imagen'));
      } finally {
        setLoading(false);
      }
    };
    readerUpload.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!isAuthenticated) {
        setError(t('createRecipe.errorLogin', 'Debes iniciar sesión'));
        return;
      }

      if (!form.nombre.trim()) {
        setError(t('createRecipe.errorNameRequired', 'El nombre de la receta es requerido'));
        return;
      }

      const ingredientesValidos = ingredients
        .filter((ing) => ing.name.trim() && ing.quantity > 0 && ing.ingredienteId)
        .map((ing) => ({
          ingrediente: ing.ingredienteId,
          cantidad: Number.parseFloat(ing.quantity),
        }));

      if (ingredientesValidos.length === 0) {
        setError(t('createRecipe.errorIngredients', 'Agrega al menos un ingrediente válido de la lista'));
        return;
      }

      setLoading(true);

      const datosReceta = {
        nombre: form.nombre,
        descripcionCorta: form.descripcionCorta,
        descripcionLarga: form.descripcionLarga,
        dificultad: form.dificultad,
        categoria: form.categoria,
        tiempoPreparacion: Number.parseInt(form.tiempoPreparacion, 10) || 0,
        imagen: imagenUrl,
        ingredientes: ingredientesValidos,
      };

      const respuesta = await crearReceta(datosReceta, localStorage.getItem('token'));

      if (respuesta.receta) {
        alert(t('createRecipe.success', 'Receta creada exitosamente'));
        navigate('/recetas');
      } else {
        setError(respuesta.mensaje || t('createRecipe.errorCreate', 'Error al crear la receta'));
      }
    } catch {
      setError(t('createRecipe.errorCreate', 'Error al crear la receta'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-recipe-page">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="create-recipe-card">
        <header className="create-header">
          <p className="create-subtitle">
            {t('createRecipe.subtitle', 'Aquí puedes crear tu propia receta, podrás añadir una imagen con el resultado así como la lista de ingredientes y mucho más...')}
          </p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <section className="section-block">
          <h2 className="section-heading">{t('createRecipe.dataTitle', 'DATOS')}</h2>
          <div className="data-grid">
            <div className="upload-panel">
              <div className="upload-box">
                {preview ? <img src={preview} alt={t('createRecipe.previewAlt', 'Vista previa')} /> : <div className="upload-placeholder" />}
                {loading && <p className="uploading">{t('createRecipe.uploading', 'Subiendo imagen...')}</p>}
              </div>
              <label className="upload-button">
                {t('createRecipe.uploadFromDevice', 'Subir desde el dispositivo')}
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
              </label>
            </div>

            <div className="form-panel">
              <div className="form-row">
                <label>{t('createRecipe.dishName', 'Nombre del plato')}:</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder={t('common.write', 'Escribir...')}
                />
              </div>

              <div className="form-row difficulty-row">
                <label>{t('home.recent.difficulty', 'Dificultad')}:</label>
                <div className="difficulty-options">
                  {[
                    { value: 'facil', label: t('createRecipe.easy', 'Fácil') },
                    { value: 'medio', label: t('createRecipe.medium', 'Medio') },
                    { value: 'dificil', label: t('createRecipe.hard', 'Difícil') },
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
                <label>{t('createRecipe.category', 'Categoría')}:</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option value="desayuno">{t('nav.breakfast', 'Desayuno')}</option>
                  <option value="almuerzo">{t('nav.lunch', 'Almuerzo')}</option>
                  <option value="merienda">{t('createRecipe.snackTime', 'Merienda')}</option>
                  <option value="cena">{t('nav.dinner', 'Cena')}</option>
                  <option value="snack">{t('createRecipe.snack', 'Snack')}</option>
                  <option value="postre">{t('createRecipe.dessert', 'Postre')}</option>
                  <option value="bebida">{t('createRecipe.drink', 'Bebida')}</option>
                </select>
              </div>

              <div className="form-row">
                <label>{t('createRecipe.prepTime', 'Tiempo de preparación (minutos)')}:</label>
                <input
                  type="number"
                  name="tiempoPreparacion"
                  value={form.tiempoPreparacion}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                />
              </div>

              <div className="form-row">
                <label>{t('home.recent.description', 'Descripción')}:</label>
                <input
                  type="text"
                  name="descripcionCorta"
                  value={form.descripcionCorta}
                  onChange={handleChange}
                  placeholder={t('common.write', 'Escribir...')}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-heading">{t('createRecipe.ingredientsTitle', 'INGREDIENTES')}</h2>
          <p className="section-note">{t('createRecipe.ingredientsHint', 'Escribe al menos 3 letras para buscar ingredientes en la base de datos')}</p>
          <div className="ingredients-grid">
            {ingredients.map((ing) => (
              <div key={ing.id} className="ingredient-row">
                <div className="ingredient-input-wrapper">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                    placeholder={t('createRecipe.ingredientPlaceholder', 'Escribe el nombre del alimento')}
                    className={ing.ingredienteId ? 'ingredient-selected' : ''}
                  />
                  {searchingIngredient === ing.id && ingredientSuggestions.some((s) => s.rowId === ing.id) && (
                    <div className="suggestions-dropdown">
                      {ingredientSuggestions
                        .filter(s => s.rowId === ing.id)
                        .map((suggestion) => (
                          <button
                            key={suggestion.id}
                            type="button"
                            className="suggestion-item"
                            onClick={() => handleSelectIngredient(ing.id, suggestion.id, suggestion.nombre)}
                          >
                            {suggestion.nombre}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <div className="quantity-input">
                  <span>x</span>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(ing.id, 'quantity', e.target.value)}
                    placeholder="0"
                  />
                  <span className="unit">g</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <h2 className="section-heading">{t('createRecipe.detailedDescription', 'DESCRIPCIÓN DETALLADA')}</h2>
          <textarea
            name="descripcionLarga"
            value={form.descripcionLarga}
            onChange={handleChange}
            placeholder={t('createRecipe.stepsPlaceholder', 'Escribe los pasos de preparación y otros detalles...')}
            rows={8}
          />
        </section>

        <div className="actions">
          <button
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t('common.saving', 'Guardando...') : t('common.accept', 'Aceptar')}
          </button>
          <button className="secondary" onClick={handleClear} disabled={loading}>
            {t('common.clearFields', 'Limpiar campos')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
