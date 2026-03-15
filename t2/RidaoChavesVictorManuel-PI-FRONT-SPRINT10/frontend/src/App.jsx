import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UiPreferencesProvider } from './context/UiPreferencesContext';
import PublicLayout from './layouts/PublicLayout';
import PrivateLayout from './layouts/PrivateLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Contact from './pages/Contact';
import MyRecipes from './pages/MyRecipes';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import Settings from './pages/Settings';
import BreakfastRecipes from './pages/BreakfastRecipes';
import RecipeCollections from './pages/RecipeCollections';
import RecipePlan from './pages/RecipePlan';
import PlatesExplorer from './pages/PlatesExplorer';
import NotFound from './pages/NotFound';
import Forbidden from './pages/Forbidden';
import './styles/styles.css';

function App() {
  return (
    <AuthProvider>
      <UiPreferencesProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
            <Route path="/registro" element={<PublicLayout><Register /></PublicLayout>} />
            
            <Route path="/inicio" element={<ProtectedRoute><PrivateLayout><Home /></PrivateLayout></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><PrivateLayout><Profile /></PrivateLayout></ProtectedRoute>} />
            <Route path="/recetas" element={<ProtectedRoute><PrivateLayout><MyRecipes /></PrivateLayout></ProtectedRoute>} />
            <Route path="/recetas/colecciones" element={<ProtectedRoute><PrivateLayout><RecipeCollections /></PrivateLayout></ProtectedRoute>} />
            <Route path="/recetas/plan" element={<ProtectedRoute><PrivateLayout><RecipePlan /></PrivateLayout></ProtectedRoute>} />
            <Route path="/contacto" element={<ProtectedRoute><PrivateLayout><Contact /></PrivateLayout></ProtectedRoute>} />
            <Route path="/receta/:id" element={<ProtectedRoute><PrivateLayout><RecipeDetail /></PrivateLayout></ProtectedRoute>} />
            <Route path="/recetas/crear" element={<ProtectedRoute><PrivateLayout><CreateRecipe /></PrivateLayout></ProtectedRoute>} />
            <Route path="/ajustes" element={<ProtectedRoute><PrivateLayout><Settings /></PrivateLayout></ProtectedRoute>} />
            <Route path="/platos/explorar" element={<ProtectedRoute><PrivateLayout><PlatesExplorer /></PrivateLayout></ProtectedRoute>} />
            <Route path="/platos/desayuno" element={<ProtectedRoute><PrivateLayout><BreakfastRecipes /></PrivateLayout></ProtectedRoute>} />
            <Route path="/platos/almuerzo" element={<ProtectedRoute><PrivateLayout><BreakfastRecipes categoria="almuerzo" titulo="Almuerzos" descripcion="Recetas equilibradas para la comida principal" /></PrivateLayout></ProtectedRoute>} />
            <Route path="/platos/cena" element={<ProtectedRoute><PrivateLayout><BreakfastRecipes categoria="cena" titulo="Cenas" descripcion="Recetas ligeras y completas para la noche" /></PrivateLayout></ProtectedRoute>} />
            <Route path="/platos/otros" element={<ProtectedRoute><PrivateLayout><BreakfastRecipes categoria="otros" titulo="Otros platos" descripcion="Descubre snacks, postres, bebidas y más" /></PrivateLayout></ProtectedRoute>} />
            
            <Route path="/forbidden" element={<PublicLayout><Forbidden /></PublicLayout>} />
            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </div>
        </Router>
      </UiPreferencesProvider>
    </AuthProvider>
  );
}

export default App;
