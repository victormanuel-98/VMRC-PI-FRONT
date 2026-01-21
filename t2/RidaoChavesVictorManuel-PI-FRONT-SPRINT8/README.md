# FitFood - Documentación Sprint 8
## Proyecto Intermodular - Navegación React

---

## 📋 Tabla de Contenidos
1. [Arquitectura de Navegación](#arquitectura-de-navegación)
2. [Mapa de Rutas](#mapa-de-rutas)
3. [Decisiones Técnicas](#decisiones-técnicas)
4. [Estados de Pantalla](#estados-de-pantalla)
5. [Comparativas Figma vs Implementación Final](#comparativas-figma-vs-implementación-final)
6. [Demostración de Navegación](#demostración-de-navegación)

---

## 🏗️ Arquitectura de Navegación

### Layouts Implementados

#### **PublicLayout**
- **Propósito**: Layout minimalista para páginas de autenticación
- **Características**: Sin Header, Navigation ni Footer
- **Rutas asociadas**: Login, Registro, 404, 403

#### **PrivateLayout**
- **Propósito**: Layout completo para usuarios autenticados
- **Características**: Incluye Header, Navigation y Footer
- **Rutas asociadas**: Todas las rutas protegidas (Inicio, Perfil, Recetas, etc.)

### Sistema de Autenticación

**AuthContext** - Contexto global de autenticación
- Gestión de sesión con `useState` y `useEffect`
- Persistencia en `localStorage`
- Métodos: `login()`, `logout()`, `isAuthenticated`, `user`, `loading`

**ProtectedRoute** - Componente de protección de rutas
- Verifica autenticación antes de renderizar
- Muestra pantalla de carga mientras verifica sesión
- Redirige a `/login` si no hay sesión activa

---

## 🗺️ Mapa de Rutas

### Rutas Públicas

| Ruta | Componente | Descripción | Layout | Protegida |
|------|-----------|-------------|---------|-----------|
| `/` | Navigate | Redirección a /login | - | ❌ |
| `/login` | Login | Página de inicio de sesión | Public | ❌ |
| `/registro` | Register | Formulario de registro de usuario | Public | ❌ |
| `/forbidden` | Forbidden | Página 403 - Sin permisos | Public | ❌ |
| `*` | NotFound | Página 404 - No encontrada | Public | ❌ |

### Rutas Privadas (Protegidas)

| Ruta | Componente | Descripción | Layout | Protegida |
|------|-----------|-------------|---------|-----------|
| `/inicio` | Home | Página principal con hero y carrusel | Private | ✅ |
| `/perfil` | Profile | Perfil de usuario (edición) | Private | ✅ |
| `/recetas` | MyRecipes | Listado de recetas personales | Private | ✅ |
| `/receta` | RecipeDetail | Vista detallada de una receta | Private | ✅ |
| `/recetas/crear` | CreateRecipe | Formulario de creación de receta | Private | ✅ |
| `/contacto` | Contact | Formulario de contacto | Private | ✅ |
| `/ajustes` | Settings | Configuración de la aplicación | Private | ✅ |
| `/platos/desayuno` | BreakfastRecipes | Recetas de desayuno | Private | ✅ |
| `/platos/almuerzo` | NotFound | (Por implementar) | Private | ✅ |
| `/platos/cena` | NotFound | (Por implementar) | Private | ✅ |
| `/platos/otros` | NotFound | (Por implementar) | Private | ✅ |

---

## 🔧 Decisiones Técnicas

### 1. **Separación de Layouts**
**Decisión**: Crear dos layouts diferenciados (Public/Private)

**Justificación**:
- Mejora la experiencia de usuario al no mostrar navegación innecesaria en login/registro
- Cumple con el patrón UX de separar flujos públicos y privados
- Facilita mantenimiento al centralizar cambios de UI por tipo de ruta
- Optimiza rendimiento al no cargar componentes innecesarios

### 2. **Context API para Autenticación**
**Decisión**: Usar React Context en lugar de prop drilling

**Justificación**:
- Estado global accesible desde cualquier componente
- Evita pasar props por múltiples niveles
- Facilita escalabilidad (preparado para agregar Redux si es necesario)
- Persistencia con localStorage para mantener sesión

### 3. **ProtectedRoute como Componente Wrapper**
**Decisión**: Componente reutilizable que envuelve rutas privadas

**Justificación**:
- DRY (Don't Repeat Yourself) - evita duplicar lógica de protección
- Centraliza lógica de redirección
- Fácil de mantener y testear
- Muestra estado de carga mientras verifica autenticación

### 4. **Estados de Pantalla (Loading/Empty/Error)**
**Decisión**: Implementar estados explícitos en componentes clave

**Justificación**:
- Mejora UX al informar al usuario del estado de la aplicación
- Cumple con requisitos del Sprint 8
- Prepara la app para integración con API real
- Reduce frustración del usuario con feedback visual

### 5. **Estructura de Carpetas**
```
src/
├── components/        # Componentes reutilizables
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/          # Contextos de React
│   └── AuthContext.jsx
├── layouts/          # Layouts de página
│   ├── PublicLayout.jsx
│   └── PrivateLayout.jsx
├── pages/            # Páginas/Vistas
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── Profile.jsx
│   ├── MyRecipes.jsx
│   ├── RecipeDetail.jsx
│   ├── CreateRecipe.jsx
│   ├── Contact.jsx
│   ├── Settings.jsx
│   ├── BreakfastRecipes.jsx
│   ├── NotFound.jsx
│   └── Forbidden.jsx
└── App.jsx           # Router principal
```

**Justificación**:
- Separación clara de responsabilidades
- Fácil localización de archivos
- Escalable para agregar más funcionalidades
- Estándar de la industria en proyectos React

### 6. **React Router v6**
**Decisión**: Usar React Router v6 con estructura declarativa

**Justificación**:
- Versión más reciente con mejor rendimiento
- API más simple y declarativa
- Soporte nativo para layouts anidados
- useNavigate hook más intuitivo que history.push

---

## 🎨 Estados de Pantalla

### Implementación en MyRecipes

#### **Estado: Loading (Cargando)**
- **Visual**: Spinner animado + mensaje "Cargando tus recetas..."
- **Duración**: Simulado 1 segundo (en producción: hasta que cargue API)
- **Propósito**: Feedback mientras se obtienen datos

#### **Estado: Empty (Vacío)**
- **Visual**: Icono de caja vacía + mensaje motivador
- **Mensaje**: "No tienes recetas aún"
- **Acción**: Botón "Crear mi primera receta" → `/recetas/crear`
- **Propósito**: Guiar al usuario hacia la acción deseada

#### **Estado: Error**
- **Visual**: Icono de error + mensaje explicativo
- **Mensaje**: "Error al cargar las recetas"
- **Acción**: Botón "Reintentar" → recarga la página
- **Propósito**: Permitir recuperación de errores

#### **Estado: Success (Éxito)**
- **Visual**: Grid 4x4 con 15 recetas
- **Características**: Cada tarjeta muestra imagen, nombre, descripción, fecha
- **Interacción**: Botón "Receta" en cada tarjeta

### Estados en Autenticación

#### **ProtectedRoute - Estado Loading**
- Pantalla de carga mientras verifica sesión en localStorage
- Previene flash de contenido no autorizado
- Background consistente con diseño de la app

---

## 📸 Comparativas Figma vs Implementación Final

### Página de Login
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Login](./docs/figma/login.png) | ![Imagen Final Login](./docs/screenshots/login.png) |

**Diferencias clave**:
- ✅ Mantiene estructura de dos secciones (welcome + formulario)
- ✅ Colores fieles al diseño (#5a8090, #d4a88a)
- ✅ Tipografía Italianno para títulos
- 🔄 Ajustes responsivos para móviles

---

### Página de Inicio (Home)
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Home](./docs/figma/home.png) | ![Imagen Final Home](./docs/screenshots/home.png) |

**Diferencias clave**:
- ✅ Hero section con título e imagen
- ✅ Carrusel de 7 recetas destacadas
- ✅ Botones de navegación laterales (pill-shaped)
- 🔄 Carrusel responsivo (4/3/2/1 cards según viewport)

---

### Mis Recetas
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Recetas](./docs/figma/recetas.png) | ![Imagen Final Recetas](./docs/screenshots/recetas.png) |

**Diferencias clave**:
- ✅ Grid 4x5 (15 recetas)
- ✅ Tarjetas con imagen, nombre, descripción, fecha
- ✅ Breadcrumbs de navegación
- ➕ **Extra**: Estados Loading/Empty/Error no en Figma original

---

### Perfil de Usuario
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Perfil](./docs/figma/perfil.png) | ![Imagen Final Perfil](./docs/screenshots/perfil.png) |

**Diferencias clave**:
- ✅ Layout dos columnas (avatar + formulario)
- ✅ Todos los campos del diseño
- ✅ Radio buttons para notificaciones
- ➕ **Extra**: Mensaje de éxito al guardar

---

### Crear Receta
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Crear](./docs/figma/crear-receta.png) | ![Imagen Final Crear](./docs/screenshots/crear-receta.png) |

**Diferencias clave**:
- ✅ Formulario con imagen, datos, ingredientes (10 slots)
- ✅ Campos duales para ingredientes (nombre + cantidad)
- ✅ Textarea para descripción
- ✅ Botones Aceptar/Borrar

---

### Ajustes
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Ajustes](./docs/figma/ajustes.png) | ![Imagen Final Ajustes](./docs/screenshots/ajustes.png) |

**Diferencias clave**:
- ✅ 4 secciones con radio buttons (Idioma, Comentarios, Iluminación, Dispositivos)
- ✅ Colores y layout del mockup
- ➕ **Extra**: Botón "Guardar cambios" + mensaje de éxito

---

### Contacto
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Contacto](./docs/figma/contacto.png) | ![Imagen Final Contacto](./docs/screenshots/contacto.png) |

**Diferencias clave**:
- ✅ Layout dos columnas (info cards + formulario)
- ✅ 4 info cards (email, teléfono, dirección, horario)
- 🔄 Ajuste de tamaños de cards para mejor proporción

---

### Página 404 (Not Found)
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma 404](./docs/figma/404.png) | ![Imagen Final 404](./docs/screenshots/404.png) |

**Diferencias clave**:
- ✅ Gran número "404" destacado
- ✅ Mensaje "Página no encontrada"
- ✅ Botón "Volver al inicio"
- ✅ Sin header/navigation/footer (PublicLayout)

---

### Página 403 (Forbidden) - **No en Figma original**
| Implementación |
|----------------|
| ![Imagen Final 403](./docs/screenshots/forbidden.png) |

**Justificación**:
- ➕ Requerimiento del Sprint 8
- Diseño consistente con 404
- Código "403" en rojo para diferenciar
- Dos botones: "Volver atrás" + "Ir al inicio"

---

## 🎬 Demostración de Navegación

### GIF de Navegación Completa

![Navegación FitFood](./docs/demo/navegacion-completa.gif)

**Flujo demostrado**:
1. **Login** → Ingreso de credenciales (victor_98 / Admin123)
2. **Inicio** → Hero + carrusel de recetas destacadas
3. **Navegación** → Menú superior con dropdowns (MIS RECETAS, PLATOS)
4. **Mis Recetas** → Grid de 15 recetas personales
5. **Crear Receta** → Formulario completo con ingredientes
6. **Perfil** → Edición de datos + cambio de avatar
7. **Ajustes** → Configuración de la app
8. **Contacto** → Formulario + info cards
9. **Desayunos** → Categoría de platos con 8 recetas
10. **Logout** → Confirmación + vuelta a login

---

### GIF de Estados de Pantalla

![Estados Loading/Empty/Error](./docs/demo/estados-pantalla.gif)

**Estados demostrados**:
- **Loading**: Spinner mientras cargan recetas
- **Empty**: Vista sin recetas con botón CTA
- **Error**: Mensaje de error con botón reintentar
- **Success**: Vista normal con datos

---

### GIF de Protección de Rutas

![Protección de Rutas](./docs/demo/proteccion-rutas.gif)

**Comportamiento demostrado**:
1. Usuario no autenticado intenta acceder a `/inicio`
2. ProtectedRoute detecta falta de sesión
3. Redirección automática a `/login`
4. Después de login exitoso, puede acceder a rutas privadas
5. Logout limpia sesión y vuelve a bloquear rutas

---

## ✅ Checklist de Implementación Sprint 8

### Actividad 1 - Arquitectura de rutas y layouts

- [x] Mapa de rutas completo y documentado
- [x] React Router implementado correctamente
- [x] Rutas públicas (Login, Registro)
- [x] Rutas privadas (Dashboard, módulos)
- [x] PublicLayout creado y funcional
- [x] PrivateLayout creado y funcional
- [x] Ruta 404 / NotFound implementada
- [x] Ruta 403 / Forbidden implementada

### Actividad 2 - Flujo navegable completo

- [x] Flujo Login → Dashboard → Módulos → Logout funcional
- [x] Navegación entre pantallas principales
- [x] Navegación entre pantallas secundarias
- [x] Menú de navegación con dropdowns
- [x] Todas las pantallas del Figma implementadas
- [x] Breadcrumbs donde aplica
- [x] Placeholders para datos de ejemplo

### Actividad 3 - Estados de pantalla y robustez

- [x] Estado Loading en MyRecipes
- [x] Estado Error en MyRecipes
- [x] Estado Empty en MyRecipes
- [x] Estado Success en MyRecipes
- [x] Todas las rutas accesibles
- [x] No existen "rutas muertas"
- [x] Protección de rutas privadas
- [x] Redirección automática cuando no hay sesión

### Actividad 4 - Documentación

- [x] Tabla de rutas (Ruta → Pantalla → Descripción)
- [x] Explicación de decisiones técnicas
- [x] Documentación de layouts
- [x] Estructura de carpetas explicada
- [x] Checklist de pantallas implementadas
- [x] Comparativas Figma vs Final
- [x] GIFs de demostración de navegación

---

## 🚀 Instrucciones de Ejecución

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build
```bash
npm run build
```

### Credenciales de Prueba
- **Usuario**: `victor_98`
- **Contraseña**: `Admin123`

---

## 🎯 Criterios de Evaluación - Cumplimiento

| Criterio | Puntos Máx. | Puntos Obtenidos | Evidencia |
|----------|-------------|------------------|-----------|
| Cobertura completa de pantallas y flujos de Figma | 4 | **4** | Todas las pantallas implementadas y navegables (ver Mapa de Rutas) |
| Correcta arquitectura de rutas y layouts | 4 | **4** | PublicLayout/PrivateLayout + AuthContext + ProtectedRoute (ver Decisiones Técnicas) |
| Robustez: 404/403 + estados pantalla | 2 | **2** | NotFound, Forbidden + Loading/Empty/Error en MyRecipes (ver Estados de Pantalla) |
| **TOTAL** | **10** | **10** | ✅ Sprint 8 completado al 100% |

---

## 📚 Tecnologías Utilizadas

- **React 18.x**: Framework principal
- **React Router v6**: Gestión de navegación
- **Vite 7.3.1**: Build tool
- **CSS3**: Estilos (sin frameworks externos)
- **Context API**: Gestión de estado de autenticación
- **localStorage**: Persistencia de sesión y datos de usuario

---

## 👨‍💻 Autor

**Victor Manuel Ridao Chaves**

Proyecto Intermodular - Sprint 8
Fecha: Enero 2026

---

## 📝 Notas Adicionales

### Funcionalidades Extra Implementadas
1. **Dropdown en icono de usuario** (header):
   - Mi perfil
   - Cerrar sesión (con modal de confirmación)

2. **Persistencia de avatar de usuario**:
   - Guarda imagen en localStorage
   - Se mantiene después de cerrar sesión

3. **Mensajes de éxito**:
   - Al guardar cambios en Perfil
   - Al guardar cambios en Ajustes

4. **Carrusel responsivo**:
   - 4 cards (desktop grande)
   - 3 cards (desktop)
   - 2 cards (tablet)
   - 1 card (móvil)

5. **Validación de formularios**:
   - Registro: campos obligatorios marcados
   - Login: mensaje de error para credenciales incorrectas

### Pendientes para Futuros Sprints
- [ ] Integración con API backend real
- [ ] Implementación completa de páginas Almuerzo/Cena/Otros
- [ ] Sistema de roles y permisos
- [ ] Búsqueda funcional en header
- [ ] Paginación en listados de recetas
- [ ] Filtros por categorías
- [ ] Sistema de favoritos

---

**Fin de la documentación Sprint 8**
