import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { subirImagenReceta, crearReceta, obtenerIngredientes } from '../services/api';

const MAX_INGREDIENTS = 10;

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mis Recetas', path: '/recetas' },
    { label: 'Crear Nueva Receta', path: '/recetas/crear' }
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
          setError('Error al subir la imagen');
        }
      } catch {
        setError('Error al procesar la imagen');
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
        setError('Debes iniciar sesión');
        return;
      }

      if (!form.nombre.trim()) {
        setError('El nombre de la receta es requerido');
        return;
      }

      const ingredientesValidos = ingredients
        .filter((ing) => ing.name.trim() && ing.quantity > 0 && ing.ingredienteId)
        .map((ing) => ({
          ingrediente: ing.ingredienteId,
          cantidad: parseFloat(ing.quantity),
        }));

      if (ingredientesValidos.length === 0) {
        setError('Agrega al menos un ingrediente válido de la lista');
        return;
      }

      setLoading(true);

      const datosReceta = {
        nombre: form.nombre,
        descripcionCorta: form.descripcionCorta,
        descripcionLarga: form.descripcionLarga,
        dificultad: form.dificultad,
        categoria: form.categoria,
        tiempoPreparacion: parseInt(form.tiempoPreparacion) || 0,
        imagen: imagenUrl,
        ingredientes: ingredientesValidos,
      };

      const respuesta = await crearReceta(datosReceta, localStorage.getItem('token'));

      if (respuesta.receta) {
        alert('Receta creada exitosamente');
        navigate('/recetas');
      } else {
        setError(respuesta.mensaje || 'Error al crear la receta');
      }
    } catch {
      setError('Error al crear la receta');
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
            Aquí puedes crear tu propia receta, podrás añadir una imagen con el resultado así como la lista de
            ingredientes y mucho más...
          </p>
        </header>

        {error && <div className="error-message">{error}</div>}

        <section className="section-block">
          <h2 className="section-heading">DATOS</h2>
          <div className="data-grid">
            <div className="upload-panel">
              <div className="upload-box">
                {preview ? <img src={preview} alt="Vista previa" /> : <div className="upload-placeholder" />}
                {loading && <p className="uploading">Subiendo imagen...</p>}
              </div>
              <label className="upload-button">
                Subir desde el dispositivo
                <input type="file" accept="image/*" onChange={handleImageChange} disabled={loading} />
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
                <label>Categoría:</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                >
                  <option value="desayuno">Desayuno</option>
                  <option value="almuerzo">Almuerzo</option>
                  <option value="merienda">Merienda</option>
                  <option value="cena">Cena</option>
                  <option value="snack">Snack</option>
                  <option value="postre">Postre</option>
                  <option value="bebida">Bebida</option>
                </select>
              </div>

              <div className="form-row">
                <label>Tiempo de preparación (minutos):</label>
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
                <label>Descripción corta:</label>
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
          <p className="section-note">Escribe al menos 3 letras para buscar ingredientes en la base de datos</p>
          <div className="ingredients-grid">
            {ingredients.map((ing) => (
              <div key={ing.id} className="ingredient-row">
                <div className="ingredient-input-wrapper">
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                    placeholder="Escribe el nombre del alimento"
                    className={ing.ingredienteId ? 'ingredient-selected' : ''}
                  />
                  {searchingIngredient === ing.id && ingredientSuggestions.filter(s => s.rowId === ing.id).length > 0 && (
                    <div className="suggestions-dropdown">
                      {ingredientSuggestions
                        .filter(s => s.rowId === ing.id)
                        .map((suggestion) => (
                          <div
                            key={suggestion.id}
                            className="suggestion-item"
                            onClick={() => handleSelectIngredient(ing.id, suggestion.id, suggestion.nombre)}
                          >
                            {suggestion.nombre}
                          </div>
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
          <h2 className="section-heading">DESCRIPCIÓN DETALLADA</h2>
          <textarea
            name="descripcionLarga"
            value={form.descripcionLarga}
            onChange={handleChange}
            placeholder="Escribe los pasos de preparación y otros detalles..."
            rows={8}
          />
        </section>

        <div className="actions">
          <button
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Aceptar'}
          </button>
          <button className="secondary" onClick={handleClear} disabled={loading}>
            Limpiar campos
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;
