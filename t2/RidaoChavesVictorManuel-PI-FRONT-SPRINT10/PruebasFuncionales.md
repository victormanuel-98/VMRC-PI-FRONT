# PLAN DE PRUEBAS FUNCIONALES — FitFood v1.0

**Documento oficial de planificación y ejecución de pruebas funcionales**  
**Fecha:** Abril 2026  
**Versión:** 1.0  
**Responsable:** QA Engineering Senior (20+ años experiencia)  
**Estado:** Listo para Producción

---

## TABLA DE CONTENIDOS

1. [Introducción y Propósito](#1-introducción-y-propósito)
2. [Alcance de las Pruebas](#2-alcance-de-las-pruebas)
3. [Objetivos de Calidad](#3-objetivos-de-calidad)
4. [Estrategia de Pruebas](#4-estrategia-de-pruebas)
5. [Módulos y Áreas a Probar](#5-módulos-y-áreas-a-probar)
6. [Criterios de Entrada y Salida](#6-criterios-de-entrada-y-salida)
7. [Entorno de Pruebas](#7-entorno-de-pruebas)
8. [Roles y Responsabilidades](#8-roles-y-responsabilidades)
9. [Estimación de Esfuerzo](#9-estimación-de-esfuerzo)
10. [Gestión de Defectos](#10-gestión-de-defectos)
11. [Riesgos del Plan y Mitigaciones](#11-riesgos-del-plan-y-mitigaciones)
12. [Métricas e Indicadores](#12-métricas-e-indicadores-de-seguimiento)
13. [Listado de Áreas a Probar](#13-listado-inicial-de-áreas-a-probar)
14. [Resumen Ejecutivo](#resumen-ejecutivo)

---

## ANÁLISIS PREVIO (FASE 1) — RESUMEN EJECUTIVO

### Inventario del Proyecto

- **8 modelos MongoDB:** User, Recipe, Ingredient, Favorite, Rating, Message, History, Contact
- **10 controladores backend:** Authentication, Users, Recipes, Ingredients, Favorites, Ratings, Messages, Upload, History, AI
- **14 páginas React con 2 contextos globales:** AuthContext, UiPreferencesContext
- **10 rutas API principales:** /auth, /usuarios, /recetas, /ingredientes, /favoritos, /valoraciones, /mensajes, /historial, /upload, /ai

### Stack Tecnológico

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Frontend | React 18 + React Router 7 | Vite bundler |
| Backend | Node.js + Express | Versión 18+ |
| Base de Datos | MongoDB Atlas + Mongoose | 7.5.0 |
| Autenticación | JWT (JSON Web Tokens) | jsonwebtoken 9.0.2 |
| Encriptación | Bcrypt | bcryptjs 2.4.3 |
| Almacenamiento | Cloudinary | cloudinary 1.41.0 |
| Email | Nodemailer | nodemailer 8.0.2 |
| Utilidades | Validator, Helmet, CORS | múltiples |

### Puntos de Entrada

**50+ endpoints REST:**
- Autenticación: registro, login, verificar token
- Usuarios: obtener, actualizar perfil, cambiar contraseña
- Recetas: CRUD, búsqueda, filtros
- Ingredientes: búsqueda
- Favoritos: agregar, eliminar, listar
- Valoraciones: crear, obtener
- Upload: imágenes recete y perfil
- Historial: registro y consulta
- Mensajes: crear, listar, marcar leído
- IA: chat endpoint

### Reglas de Negocio Críticas

1. **Autenticación:** Email único, contraseña mínimo 8 caracteres (mayúscula + minúscula + número + símbolo), JWT expira en 7 días
2. **Gestión Recetas:** Usuario solo accede a propias recetas; máximo 10 ingredientes; categorías fijas; cálculo nutricional automático
3. **Favoritos:** Constraint único per usuario+receta
4. **Valoraciones:** 1-5 estrellas, constraint único per usuario+receta
5. **Roles:** Usuario, Nutricionista, Admin con permisos diferenciados
6. **Validación:** Email único, ingredientes validados por ID, cantidad >0

### Integraciones Externas

| Servicio | Propósito | Criticidad |
|----------|-----------|-----------|
| MongoDB Atlas | Persistencia datos | Crítica |
| Cloudinary | Almacenamiento imágenes | Alta |
| Nodemailer | Notificaciones email | Media |
| LM Studio | Asistente IA | Media |

### Riesgos Técnicos Detectados (12)

| # | Riesgo | Severidad | Mitigación |
|---|--------|-----------|-----------|
| 1 | Validación ingredientes débil en backend | CRÍTICA | Auditoría + test específico |
| 2 | localStorage sin encriptación | ALTA | Documentar como "Known Limitation" |
| 3 | Rutas protegidas solo frontend | CRÍTICA | Validación middleware backend |
| 4 | Sin rate limiting en auth | ALTA | Implementar express-rate-limit |
| 5 | Posible XSS en búsqueda | MEDIA | Sanitizar con validator.escape() |
| 6 | Sin verificación contraseña actual | CRÍTICA | Implementar validación compararContrasena |
| 7 | Falta token validation en middleware | CRÍTICA | Code review + cobertura middleware |
| 8 | Posible CORS bypass | MEDIA | Auditar .env CORS_ORIGIN |
| 9 | Sin retry en fallos red | MEDIA | Mostrar botón "Reintentar" |
| 10 | Sin validación tamaño imagen | MEDIA | Validar File.size <5MB frontend |
| 11 | Falta constraint único email | MEDIA | Tests POST /auth/registro duplicado |
| 12 | MongoDB índices no verificados | MEDIA | Auditoría mongosh |

---

## 1. INTRODUCCIÓN Y PROPÓSITO

### 1.1 Propósito del Documento

Este **Plan de Pruebas Funcionales** define la estrategia, alcance, niveles, técnicas, módulos, criterios de aceptación y métricas para validar exhaustivamente la aplicación **FitFood** antes de su despliegue a producción. El plan garantiza que todas las funcionalidades de riesgo crítico/alto sean probadas según estándares **IEEE 829-2013** y metodología **ISTQB Level 1**, asegurando calidad enterprise y trazabilidad completa.

### 1.2 Contexto del Proyecto

- **Aplicación:** FitFood v1.0 — Plataforma web fullstack de gestión de recetas saludables con perfiles de usuario, CRUD recetas, favoritos, valoraciones, historial nutricional, asistente IA, internacionalización (ES/EN) y tema oscuro/claro.
- **Stack:** React 19 + Node.js/Express + MongoDB Atlas + Cloudinary + Nodemailer + LM Studio
- **Usuarios objetivo:** Usuarios registrados con roles (usuario, nutricionista, admin)
- **Entornos:** Desarrollo (localhost) → QA (cloud) → Producción
- **Presupuesto de calidad:** 0 defectos Críticos, 100% Altos resueltos, <15% densidad defectos
- **Responsables:** QA Lead, QA Testers (2), Developers, Product Owner

### 1.3 Referencias y Estándares

- **IEEE 829-2013:** Software and systems engineering – Lifecycle processes – Documentation
- **ISTQB Foundation Level Syllabus v4.0:** Test design, execution, reporting
- **REST API Testing:** Best practices HTTP, status codes, payloads
- **OWASP Top 10 2023:** Injection, broken auth, XSS, CSRF, sensitive data
- **MongoDB Best Practices:** Índices, validación schema, queries

---

## 2. ALCANCE DE LAS PRUEBAS

### 2.1 Funcionalidades EN SCOPE

#### **A. Módulo Autenticación y Gestión de Sesión (P0-Crítica)**
✅ Registro de usuario (validación email único, contraseña fuerte, campos requeridos)
✅ Login (usuario o email + contraseña, JWT token generado)
✅ Logout y limpieza de sesión
✅ Verificación de token válido/expirado
✅ Rutas protegidas (redirección a /login sin token)
✅ Manejo de errores: credenciales inválidas, email duplicado, contraseña débil
✅ Email de bienvenida al registrarse
✅ Restricción: usuario NO puede eliminarse a sí mismo

#### **B. Módulo Perfil de Usuario (P1-Alta)**
✅ Visualizar datos personal (nombre, apellidos, email, teléfono, foto, rol)
✅ Editar datos (nombre, apellidos, teléfono, biografía)
✅ Cambiar contraseña (con verificación de contraseña actual)
✅ Upload avatar (fallback a default si falla)
✅ Validación email único (no permitir email registrado)
✅ Notificaciones checkbox (persistencia)
✅ Visibilidad (publica/privada)
✅ Dark mode en perfil (legibilidad y contraste)

#### **C. Módulo CRUD Recetas (P0-Crítica)**
✅ Crear receta (nombre, desc. corta/larga, dificultad, categoría, ingredientes, tiempo prep, imagen)
✅ Búsqueda y selección de ingredientes (validación ID existe)
✅ Validación cantidad ingredientes (>0, máx cantidad o límite de ingredientes)
✅ Upload imagen receta (Cloudinary, validación tamaño)
✅ Cálculo automático valores nutricionales (caloría, proteína, grasa, carb)
✅ Editar receta (solo propietario)
✅ Eliminar receta (solo propietario)
✅ Ver "Mis Recetas" (listado paginado)
✅ Validación autorización (usuario no puede editar/eliminar receta ajena)

#### **D. Módulo Detalle Receta y Valoraciones (P1-Alta)**
✅ Visualizar receta completa (todos los campos, ingredientes expandidos)
✅ Mostrar imagen receta (con fallback si URL inválida)
✅ Tabla/card con valores nutricionales
✅ Sistema de valoraciones 1–5 estrellas (POST, GET)
✅ Visualización de todas valoraciones del receta
✅ Límite único: usuario valora cada receta UNA sola vez (si revalora, reemplaza anterior)
✅ Cálculo promedio y total valoraciones
✅ Agregar a favoritos (POST)
✅ Eliminar de favoritos (DELETE)
✅ Indicador visual: ¿está en favoritos? (corazón lleno/vacío)

#### **E. Módulo Exploración de Recetas por Categoría (P1-Alta)**
✅ Filtro Desayuno (category=desayuno)
✅ Filtro Almuerzo (category=almuerzo)
✅ Filtro Cena (category=cena)
✅ Filtro Otros (snacks, postres, bebidas, merienda)
✅ Búsqueda por nombre/descripción (case-insensitive)
✅ Búsqueda por ingrediente
✅ Paginación (página, límite, total)
✅ Mensaje "sin resultados" claro
✅ Click receta → navega a /receta/:id

#### **F. Módulo Configuración y Preferencias (P1-Alta)**
✅ Cambiar tema: claro → oscuro (body.theme-dark, localStorage)
✅ Cambiar idioma: ES → EN (diccionario i18n, fallback ES)
✅ Cambiar privacidad: público ↔ privado
✅ Notificaciones: on/off (persistencia en perfil)
✅ Preferencias persisten entre sesiones (logout/login)
✅ Aplicación inmediata de tema en todas vistas
✅ Contraste en dark mode: legible, WCAG AA

#### **G. Módulo Internacionalización i18n (P1-Alta)**
✅ Todos los textos de UI traducidos EN (fallback ES si no existe)
✅ Mensajes de error localizados (validación, errores API)
✅ Placeholders, labels, botones EN
✅ Formato fechas según locale (ES=dd/mm/yyyy, EN=mm/dd/yyyy)
✅ Almacenamiento preferencia idioma (localStorage)

#### **H. Módulo Navegación y Control de Acceso (P1-Alta)**
✅ Header visible (logo, búsqueda, controles tema/idioma, avatar)
✅ Navegación sidebar/navbar funcional
✅ Breadcrumbs en rutas de detalle
✅ Footer con links
✅ Rutas protegidas: /recetas, /perfil, /ajustes, /receta/:id (redirect /login sin auth)
✅ Página 403 si usuario intenta acceder sin permisos
✅ Página 404 si recurso no existe
✅ Responsive: móvil (320px), tablet (768px), desktop (1920px)

#### **I. Módulo Favoritos (P1-Alta)**
✅ Agregar receta a favoritos (POST /api/favoritos)
✅ Eliminar de favoritos (DELETE /api/favoritos/:id)
✅ Listar mis favoritos (GET /api/favoritos, filtrado por usuario)
✅ Usuario solo ve/edita propios favoritos
✅ Constraint único: no duplicados (user+recipe)

#### **J. Módulo Historial de Consumo (P2-Media)**
✅ Registrar alimento consumido por fecha (ingrediente o receta)
✅ Cálculo automático de totales nutricionales
✅ Visualizar historial diario/semanal
✅ One-to-one user+date (no duplicar mismo día)

#### **K. Módulo Contacto y Mensajería (P2-Media)**
✅ Formulario contacto (nombre, email, asunto, mensaje)
✅ Validación email formato
✅ Mensaje requerido (mín 2 caracteres)
✅ Envío de mensaje (POST /api/mensajes)
✅ Confirmación visual después de envío
✅ Mensajes de contacto anónimos permitidos (sin auth)
✅ Admin ve todos mensajes

#### **L. Módulo Asistente IA (P3-Baja)**
✅ Botón flotante visible en rutas protegidas
✅ Panel abre/cierra
✅ Prompts sugeridos en idioma actual
✅ Input texto acepta texto libre
✅ Envío de prompts (POST /api/ai/chat)
✅ Respuesta IA mostrada

#### **M. Flujos End-to-End (P0-Crítica)**
✅ Registrar → Login → Home → Ver recetas → Click → Detalle → Valorar → Favorito → Perfil → Settings → Logout → Login → Datos persisten
✅ Crear receta: Inicio → Crear → Buscar ingredientes → Upload imagen → Guardar → Ver en Mis Recetas
✅ Editar perfil: Perfil → Cambiar datos → Cambiar avatar → Cambiar contraseña → Guardar
✅ Cambiar idioma/tema: Settings → Cambiar EN → Todos los botones EN → Cambiar a oscuro → Todo oscuro legible

### 2.2 Funcionalidades FUERA DE SCOPE

❌ Login social (Google, Facebook, GitHub)
❌ 2FA/MFA (two-factor authentication)
❌ Verificación SMS durante registro
❌ Recuperación contraseña por email
❌ Compartir recetas entre usuarios
❌ Comentarios en recetas
❌ Sistema de seguidores/follows
❌ Búsqueda Full-Text (MongoDB Atlas Search)
❌ Recomendaciones IA personalizadas
❌ Exportar recetas a PDF
❌ Integración pasarelas de pago
❌ Plan semanal automático
❌ Sincronización multi-dispositivo
❌ Historial de versiones de recetas

**Justificación:** Fuera de MVP v1.0. Roadmap v1.2+.

### 2.3 Niveles de Prueba Aplicables

| Nivel | Alcance | Enfoque en FitFood | Herramientas |
|-------|---------|------------------|-----------|
| **Unitario** | Métodos/funciones aisladas | Validaciones (email, password), cálculos nutricionales | Jest (backend) |
| **Integración** | Módulos + API + DB | Login → DB usuario creado, Crear receta → Imagen en Cloudinary | Postman, SuperTest |
| **Sistema** | Flujos end-to-end completos | Registrar → Login → Crear receta → Valorar → Favorito | Navegador (manual) |
| **Aceptación/UAT** | Requisitos business completos | Todos flujos con datos reales | Cliente/PO validación |

---

## 3. OBJETIVOS DE CALIDAD

### 3.1 Qué se Quiere Garantizar

1. **Funcionalidad 100% correcta** — Todos los flujos principales funcionan sin errores, datos se persisten correctamente, cálculos nutricionales son exactos.
2. **Seguridad robusta** — JWT válido, emails únicos, contraseñas hasheadas, sin SQL injection/XSS, tokens validados en backend, roles respetados.
3. **Usabilidad clara** — UI responsive en móvil/tablet/desktop, mensajes de error comprensibles, navegación intuitiva, dos idiomas funcionales.
4. **Confiabilidad ante fallos** — Errores de red manejados (mensajes útiles), imágenes inválidas con fallback, sesiones expiradas detectadas.
5. **Performance aceptable** — Carga página <3s, búsqueda ingredientes <1s, upload image <5s.
6. **Compatibilidad navegadores** — Chrome, Firefox, Safari, Edge (últimas versiones).

### 3.2 Métricas de Éxito

| Métrica | Mínimo | Target |
|---------|--------|--------|
| Cobertura de casos ejecutados | 95% | 100% |
| Cobertura código backend | 80% | 90% |
| Defectos Críticos abiertos | 0 | 0 |
| Defectos Altos resueltos | 100% | 100% |
| Defectos Medios resueltos | 80% | 100% |
| Defectos Bajos resueltos | 50% | 80% |
| Tasa de defectos escapados a PROD | <5% | <2% |
| Disponibilidad entorno QA | 98% | 99.5% |

---

## 4. ESTRATEGIA DE PRUEBAS

### 4.1 Tipos de Pruebas por Categoría

#### **A. Pruebas Funcionales de Caja Negra**
- **Qué:** Probar funciones sin ver código interno, basándose en especificaciones
- **Dónde:** Todos formularios, endpoints, botones, flujos usuario
- **Técnica:** Partición equivalencia, análisis valores límite
- **Herramientas:** Postman (API), navegador + DevTools (UI)

#### **B. Pruebas de Validación de Entradas**
- Campos requeridos: Email, contraseña, nombre, ingredientes, asunto contacto
- Formatos inválidos: Email sin @, contraseña <8 chars, números en nombre
- Límites: Nombre >100 chars, ingredientes >10 items, cantidad negativa
- Caracteres especiales: SQL injection en búsqueda, XSS en títulos

#### **C. Pruebas de Reglas de Negocio**
- Contraseña mínimo 8 + mayúscula + minúscula + número + símbolo
- Email único en registro
- Usuario solo edita recetas propias
- Cálculo nutricional correcto
- Categorías permitidas fijas
- Roles con permisos diferenciados

#### **D. Pruebas de Autorización y Control de Acceso**
- Sin token → 401 Unauthorized
- Token expirado → 401
- Usuario A no puede editar receta de Usuario B → 403 Forbidden
- Rutas protegidas sin auth → redirect /login

#### **E. Pruebas de Integración (Frontend ↔ Backend ↔ DB)**
- Registro → BD usuario creado email único
- Login → JWT retornado, localStorage almacenado
- Crear receta → imagen a Cloudinary, documento en DB
- Valorar → promedio y total actualizados

#### **F. Pruebas End-to-End (E2E)**

**Flujo 1: Registrar → Crear Receta → Valorar**
1. Registrarse con email único, password fuerte
2. Ir a /recetas/crear
3. Rellenar formulario: nombre, ingredientes (busca), categoría, dificultad
4. Upload imagen
5. Guardar + verificar en "Mis Recetas"
6. Click receta → /receta/:id
7. Valorar 5 estrellas + comentario
8. Verificar promedio 5.0

**Flujo 2: Editar Datos Perfil**
1. Login
2. Ir a /perfil
3. Cambiar nombre, teléfono, avatar
4. Cambiar contraseña (actual + nueva)
5. Guardar + Logout
6. Login con nueva contraseña → OK
7. Verificar datos persistidos

**Flujo 3: Exploración + Favoritos**
1. Home → Click "Ver Almuerzo"
2. Filtro categoría aplicado
3. Click receta detalle
4. Agregar a favoritos (❤️)
5. Cambiar idioma EN (en Settings)
6. Todos botones EN
7. Favorito aún presente

**Flujo 4: Contacto + Mensajería**
1. Click /contacto
2. Rellenar: nombre, email, asunto, mensaje
3. Enviar
4. Confirmación "Mensaje enviado"

#### **G. Pruebas de Regresión**
- Después de fix, re-ejecutar casos relacionados
- Suite smoke tests (casos críticos) antes de cada release
- Comparar resultados con baseline anterior

#### **H. Pruebas de Humo (Smoke Tests)**
- ✅ Registro funciona
- ✅ Login funciona
- ✅ Home carga recetas
- ✅ Crear receta funciona
- ✅ Valorar receta funciona
- ✅ Cambiar tema funciona
- ✅ Cambiar idioma funciona
- ✅ Logout funciona

### 4.2 Técnicas de Diseño de Casos

#### **1. Partición de Equivalencia**

**Email:**
- Válido: test@example.com
- Sin @: testexample.com
- Múltiples @: test@@example.com
- Vacío: ""

**Contraseña:**
- Fuerte: MyPassword123!
- Débil (<8): Pass1!
- Solo letras: MyPasswordNoNumber
- Sin mayúscula: mypassword123!

#### **2. Análisis de Valores Límite**

| Campo | Valor Min | Valor Máx | Test |
|-------|-----------|-----------|------|
| Nombre usuario | 3 chars | (sin máx) | 2, 3, 99, 100+ |
| Pass | 8 chars | (sin máx) | 7, 8, 9 |
| Ingredientes | 1 | ~10 | 0, 1, 10, 11 |
| Valoración | 1 | 5 | 0, 1, 5, 6 |
| Desc. corta | 0 | 200 | 199, 200, 201 |

#### **3. Tablas de Decisión**

**Autorización editar receta:**

| Token válido | Usuario propietario | Resultado |
|--------------|-------------------|-----------|
| No | N/A | 401 Unauthorized |
| Sí | No | 403 Forbidden |
| Sí | Sí | 200 OK |

#### **4. Transición de Estados**

```
[Creada] → [Guardada en DB] → [Visible Mis Recetas] → 
[Valorada] → [En Favoritos] → [Editada] → [Activa]
```

#### **5. Combinaciones (Pairwise)**

Idioma + Tema + Rol:
- (ES, claro, usuario)
- (ES, oscuro, nutricionista)
- (EN, claro, admin)
- (EN, oscuro, usuario)

### 4.3 Priorización por Riesgo

| Prioridad | Criterio | SLA Fix |
|-----------|----------|---------|
| **P0-Crítica** | Bloquea flujo principal, sin workaround | <4h |
| **P1-Alta** | Impacta experiencia principal | <1 día |
| **P2-Media** | Afecta funcionalidad secundaria | <3 días |
| **P3-Baja** | Cosméticos, typos, edge cases | <1 semana |

---

## 5. MÓDULOS Y ÁREAS A PROBAR

### 5.1 Módulo: AUTENTICACIÓN

| Área | Tipo | P | Riesgo | Técnica |
|------|------|---|--------|---------|
| Registro - Email único | Integración | P0 | Crítico | Partición, tabla decisión |
| Registro - Contraseña fuerte | Validación | P0 | Crítico | Partición, límites |
| Login - Credenciales correctas | Integración | P0 | Crítico | Caja negra |
| Login - JWT generado | Seguridad | P0 | Crítico | Análisis valores |
| Token en localStorage | Integración | P0 | Crítico | E2E |
| Logout - Token eliminado | Funcional | P0 | Crítico | Caja negra |
| Verificar Token - Válido | Funcional | P1 | Alto | Caja negra |
| Verificar Token - Expirado | Funcional | P1 | Alto | Límites |
| Rutas protegidas sin token | Acceso | P0 | Crítico | Tabla decisión |

**Total Autenticación: 19 casos** → 12h ejecución

### 5.2 Módulo: PERFIL DE USUARIO

| Área | Tipo | P | Riesgo |
|------|------|---|--------|
| Ver datos personales | Funcional | P1 | Alto |
| Editar nombre/apellidos | Funcional | P1 | Alto |
| Editar email único | Validación | P0 | Crítico |
| Cambiar contraseña | Validación | P0 | Crítico |
| Subir avatar | Integración | P1 | Alto |
| Avatar fallback | Funcional | P2 | Medio |
| Notificaciones | Funcional | P2 | Medio |
| Dark mode perfil | UI | P2 | Medio |
| Traducción EN | i18n | P1 | Alto |

**Total Perfil: 17 casos** → 10h ejecución

### 5.3 Módulo: GESTIÓN DE RECETAS

| Área | Tipo | P | Riesgo |
|------|------|---|--------|
| Crear - Nombre | Validación | P0 | Crítico |
| Crear - Ingredientes | Validación | P0 | Crítico |
| Crear - Imagen | Integración | P1 | Alto |
| Crear - Cálculo nutricional | Funcional | P0 | Crítico |
| Obtener recetas | Funcional | P1 | Alto |
| Filtro categoría | Funcional | P1 | Alto |
| Búsqueda texto | Funcional | P1 | Alto |
| Editar receta | Acceso | P0 | Crítico |
| Eliminar receta | Acceso | P0 | Crítico |
| Mis recetas listado | Funcional | P1 | Alto |

**Total Recetas: 27 casos** → 18h ejecución

### 5.4 Módulo: INGREDIENTES

| Área | Tipo | Casos |
|------|------|-------|
| Buscar <3 chars | Funcional | 1 |
| Buscar ≥3 chars | Integración | 2 |
| Validar ingredienteId NULL | Validación | 2 |
| Cantidad >0 | Validación | 1 |
| Máximo 10 ingredientes | Validación | 1 |
| Ingrediente no existe | Funcional | 1 |

**Total Ingredientes: 8 casos** → 6h ejecución

### 5.5 Módulo: DETALLE + VALORACIONES

| Área | Tipo | Casos |
|------|------|-------|
| Ver detalle receta | Funcional | 2 |
| Imagen receta | UI | 2 |
| Ingredientes listados | Funcional | 2 |
| Valores nutricionales exactitud | Funcional | 2 |
| Valorar 1-5 estrellas | Validación | 2 |
| POST valoración | Integración | 2 |
| Ver valoraciones | Funcional | 2 |
| Promedio actualiza | Funcional | 2 |
| Agregar favorito | Integración | 2 |
| Eliminar favorito | Integración | 1 |
| Estado botón favorito | Funcional | 1 |

**Total Detalle: 23 casos** → 14h ejecución

### 5.6 Módulo: EXPLORACIÓN CATEGORÍAS

| Área | Casos |
|------|-------|
| Filtro Desayuno | 1 |
| Filtro Almuerzo | 1 |
| Filtro Cena | 1 |
| Filtro Otros | 1 |
| Sin resultados | 1 |
| Click receta → detalle | 1 |
| Búsqueda alimento | 1 |
| Paginación | 1 |

**Total Exploración: 8 casos** → 6h ejecución

### 5.7 Módulo: CONFIGURACIÓN

| Área | P |
|------|---|
| Cambiar tema claro ↔ oscuro | P1 |
| Cambiar idioma ES ↔ EN | P1 |
| Cambiar privacidad | P2 |
| Notificaciones on/off | P2 |
| Preferencias persist sesiones | P1 |
| Dark mode legibilidad | P2 |
| Tema aplica inmediato | P1 |

**Total Configuración: 11 casos** → 8h ejecución

### 5.8 Módulo: INTERNACIONALIZACIÓN

| Área | P |
|------|---|
| Home EN | P0 |
| Login EN | P1 |
| Register EN | P1 |
| Profile EN | P1 |
| CreateRecipe EN | P1 |
| Mensajes error EN | P1 |
| Placeholders EN | P2 |
| Botones EN | P1 |
| Fechas locale | P2 |

**Total i18n: 13 casos** → 9h ejecución

### 5.9 Módulo: NAVEGACIÓN

| Área | P |
|------|---|
| Header visible | P2 |
| Navigation funcional | P1 |
| Breadcrumbs | P2 |
| Sin auth /recetas | P0 |
| Sin auth /perfil | P0 |
| Sin auth /ajustes | P0 |
| Página 403 | P1 |
| Página 404 | P2 |
| Dark mode 403/404 | P2 |

**Total Navegación: 11 casos** → 8h ejecución

### 5.10 Módulo: RESPONSIVIDAD

| Dispositivo | Casos |
|-------------|-------|
| Móvil 320×568 | 2 |
| Tablet 768×1024 | 2 |
| Desktop 1920×1080 | 2 |
| Pantalla táctil | 1 |
| Orientation changes | 1 |

**Total Responsividad: 8 casos** → 10h ejecución

### 5.11 Módulo: COMPATIBILIDAD

| Navegador | Casos |
|-----------|-------|
| Chrome latest | 1 |
| Firefox latest | 1 |
| Safari latest | 1 |
| Edge latest | 1 |

**Total Compatibilidad: 4 casos** → 8h ejecución

### 5.12 Módulo: SEGURIDAD

| Área | P |
|------|---|
| SQL Injection en búsqueda | P0 |
| XSS en título receta | P0 |
| XSS en comentario | P0 |
| CSRF protection | P1 |
| Contraseña hasheada | P0 |
| JWT signature válida | P0 |
| Validación backend | P0 |
| Email único backend | P1 |
| IngredienteID validado | P1 |
| Autorización receta | P0 |

**Total Seguridad: 12 casos** → 14h ejecución

### 5.13 Módulo: HISTORIAL Y MENSAJERÍA

| Área | Casos |
|------|-------|
| Crear historial | 2 |
| Obtener historial | 1 |
| Totales nutricional | 2 |
| Constraint único date | 1 |
| Formulario contacto | 1 |
| Envío mensaje | 1 |

**Total Historial/Mensajería: 8 casos** → 6h ejecución

---

## 6. CRITERIOS DE ENTRADA Y SALIDA

### 6.1 CRITERIOS DE ENTRADA

**Pre-requisitos obligatorios:**

✅ **Build estable:** `npm run build` sin errores, bundle en `frontend/dist`
✅ **Backend activo:** `npm run dev` funciona, endpoints accesibles
✅ **BD configurada:** MongoDB Atlas accesible, índices creados
✅ **Datos seed:** `npm run seed:todo` ejecutado, ≥100 recetas, ≥20 ingredientes
✅ **Cloudinary acceso:** Credentials en .env, test account activa
✅ **Entorno variables:** `.env` backend configurado completo
✅ **Requisitos aprobados:** Todas US validadas por PO
✅ **Equipo asignado:** QA Lead (1) + QA Testers (2), Dev disponible
✅ **Herramientas listas:** Postman, navegadores, DevTools, Jira/Azure DevOps
✅ **Casos escritos:** Plan + matriz de pruebas

### 6.2 CRITERIOS DE SALIDA

El ciclo se considera **FINALIZADO** si:

✅ **100% casos ejecutados** (0% pendientes, O máx 5% con justificación PO)
✅ **0 defectos Críticos abiertos** (todos resueltos + retestados)
✅ **100% defectos Altos resolvemos** O aprobamos como "Known Limitation"
✅ **≥80% defectos Medios resueltos**
✅ **≥50% defectos Bajos resueltos**
✅ **100% smoke tests PASS** (8 casos críticos)
✅ **Informe final generado** (resumen, matriz, recomendación)
✅ **Sign-off** QA Lead + PO + Dev Lead

---

## 7. ENTORNO DE PRUEBAS

### 7.1 Infraestructura Requerida

| Componente | Configuración | Detalles |
|-----------|--------------|---------|
| Frontend | Vite + nginx, HTTPS | localhost:5173 (dev) |
| Backend | Node.js 18+, Express, puerto 5000 | localhost:5000 |
| Base de Datos | MongoDB 7.5+, Atlas | mongodb+srv://user:pass@cluster |
| Almacenamiento | Cloudinary (test account) | Credenciales en .env |
| SMTP | Mailhog (dev) o SendGrid | localhost:1025 SMTP |
| Navegadores | Chrome, Firefox, Safari, Edge | Latest versions |
| Dispositivos | Desktop, Tablet, Móvil | DevTools + reales si posible |

### 7.2 Datos de Prueba Requeridos

#### **A. Usuarios Seed**

```json
{
  "usuarios": [
    {
      "usuario": "qa_user1",
      "email": "qa1@fitfood.test",
      "contrasena": "QATest123!",
      "nombre": "QA",
      "apellidos": "Test User 1",
      "rol": "usuario"
    },
    {
      "usuario": "qa_nutricionista",
      "email": "nutricionista@fitfood.test",
      "contrasena": "Nutricionista123!",
      "rol": "nutricionista"
    },
    {
      "usuario": "qa_admin",
      "email": "admin@fitfood.test",
      "contrasena": "AdminQA123!",
      "rol": "admin"
    }
  ]
}
```

#### **B. Ingredientes Seed (Mínimo 50)**
- Pollo: 165 cal, 31g proteína
- Arroz: 130 cal, 2.7g proteína
- Tomate: 18 cal, 0.9g proteína
- Lechuga: 15 cal, 1.2g proteína
- ... (46 más)

#### **C. Recetas Seed (Mínimo 100)**
- Desayuno: 20 recetas
- Almuerzo: 30 recetas
- Cena: 25 recetas
- Otros: 25 recetas

### 7.3 Herramientas

| Herramienta | Propósito | Licencia |
|-----------|-----------|---------|
| Postman | API testing | Free/Pro |
| Chrome DevTools | Debug, network | Integrado |
| MongoDB Compass | Visualizar BD | Free/Pro |
| Mailhog | Capturar emails | Open Source |
| Jira/Azure DevOps | Gestión defectos | Enterprise |
| BrowserStack | Multi-navegadores | Pagado |

---

## 8. ROLES Y RESPONSABILIDADES

### 8.1 QA Lead (1 persona, 100% dedicada)

**Responsabilidades:**
- Definir estrategia y plan de pruebas
- Revisar y aprobar casos
- Supervisar ejecución (daily standup)
- Triage y priorización defectos
- Comunicación a PO/Management
- Sign-off final y cierre ciclo

**Requisitos:** 15+ años QA, ISTQB Level 2+

**Comunicación:** Diaria con Dev Team + PO (Standup 15min)

### 8.2 QA Testers (2 personas, 100% dedicadas)

**Responsabilidades:**
- Diseño de casos de prueba
- Ejecución manual de pruebas
- Reporte de defectos con pasos reproductor
- Retest de fixes (regresión)
- Pruebas exploratorias

**Requisitos:** 8+ años QA, ISTQB Level 1+

### 8.3 Developers (Soporte)

**Responsabilidades:**
- Resolución defectos reportados
- Explicación lógica compleja
- Asesoría en edge cases técnicos

**Interacción:** Reuniones defectos diarias (si Críticos), Slack <2h respuesta

### 8.4 Product Owner

- Validación criterios de aceptación
- Aprobación "Known Limitations"
- Sign-off final (Go/No-Go)

---

## 9. ESTIMACIÓN DE ESFUERZO

### 9.1 Casos por Módulo

| Módulo | # Casos | Ejecución | Retest |
|--------|---------|-----------|--------|
| Autenticación | 19 | 12h | 8h |
| Perfil | 17 | 10h | 8h |
| CRUD Recetas | 27 | 18h | 15h |
| Ingredientes | 8 | 6h | 5h |
| Detalle + Valoraciones | 23 | 14h | 12h |
| Exploración Categorías | 8 | 6h | 5h |
| Configuración | 11 | 8h | 7h |
| i18n | 13 | 9h | 6h |
| Navegación | 11 | 8h | 7h |
| Responsividad | 8 | 10h | 4h |
| Compatibilidad | 4 | 8h | 3h |
| Seguridad | 12 | 14h | 10h |
| Historial/Mensajería | 8 | 6h | 5h |
| **TOTAL** | **169** | **129h** | **95h** |

### 9.2 Cronograma (Sprint 2 Semanas)

```
SEMANA 1
├─ Lunes: Kickoff, Criterios Entrada (2h)
├─ L-M: Diseño casos (8h)
├─ W-V: Ejecución Módulos Críticos (6h/día × 5 = 30h)
└─ V: Triage defectos (4h)

SEMANA 2
├─ L-W: Ejecución completar + Retest (8h/día × 3 = 24h)
├─ J: Regresión + cobertura final (6h)
├─ V: Informe + sign-off (4h)
└─ V EOD: Release to Production

TOTAL: 200h (1 QA Lead + 2 QA Testers)
```

### 9.3 Fases

| Fase | Descripción | Duración | Personas |
|------|-----------|----------|---------|
| P1: Preparación | Setup, Kickoff | 1-2 días | QA Lead |
| P2: Diseño | Escritura casos | 2-3 días | QA Lead + Tester |
| P3: Ejecución | Pruebas manuales | 5-7 días | 2 Testers |
| P4: Retest | Fixes + humos final | 2-3 días | 2 Testers |
| P5: Cierre | Informe + sign-off | 1-2 días | QA Lead |

---

## 10. GESTIÓN DE DEFECTOS

### 10.1 Clasificación por SEVERIDAD

| Severidad | Definición | Ejemplos | SLA |
|-----------|-----------|----------|-----|
| **CRÍTICA** | Bloquea funcionalidad core, aplicación inutilizable | Login no funciona, crear receta no guarda, BD down | <4h |
| **ALTA** | Funcionalidad importante rota, difícil workaround | Editar perfil no persiste, favoritos no agregan | <1 día |
| **MEDIA** | Funcionalidad secundaria, existe workaround | Validación confusa, traducción falta label | <3 días |
| **BAJA** | Cosméticos, typos, edge cases | Color incorrecto, typo | <1 semana |

### 10.2 Clasificación por PRIORIDAD

- **P0 (Blocker):** Detiene testing, crítico business
- **P1 (Must-Fix):** Debe resolverse antes release
- **P2 (Should-Fix):** Idealmente se resuelve
- **P3 (Nice-to-Fix):** Postergable

### 10.3 Ciclo de Vida

```
[NUEVO] → [ABIERTO] → [DEVELOPERS WORKING] → 
[READY FOR TEST] → [RETESTING] → [PASS/FAIL] → 
[CLOSED] o [DEFERRED]
```

### 10.4 Template de Reporte Defecto

```markdown
## DEFECTO: [Breve descripción]

**ID:** DEF-2024-001
**Severidad:** Crítica
**Prioridad:** P0
**Módulo:** Autenticación
**Estado:** Nuevo
**Asignado a:** [Dev]
**Fecha Reporte:** 2024-01-15

### DESCRIPCIÓN
Breve resumen del problema.

### PASOS REPRODUCIR
1. Ir a /login
2. Usuario: qa_user1, Contraseña: QATest123!
3. Click "Acceder"

### RESULTADO ACTUAL
Página muestra error 500.

### RESULTADO ESPERADO
Muestra error "Credenciales inválidas", permite reintentar.

### IMPACTO
Ningún usuario puede iniciar sesión. **Aplicación bloqueada.**

### EVIDENCIA
- Screenshot: login_error_500.png
- Console: console_output.txt
- Network: POST /api/auth/login → 500

### ENTORNO
- Browser: Chrome 121.0.6167.86
- OS: Windows 11
- URL: http://localhost:5173
- Commit: abc1234def
```

---

## 11. RIESGOS DEL PLAN Y MITIGACIONES

### 11.1 Riesgos Técnicos (12 CRÍTICOS)

| # | Riesgo | Severidad | Mitigación |
|---|--------|-----------|-----------|
| 1 | Validación ingredientes débil backend | CRÍTICA | Test `test-invalid-ingredient-id.md` + code review |
| 2 | localStorage sin encriptación | ALTA | Documentar "Known Limitation". Roadmap v1.2: httpOnly cookies |
| 3 | Rutas protegidas solo frontend | CRÍTICA | Auditoría: TODOS endpoints usan `autenticar` middleware |
| 4 | Sin rate limiting auth | ALTA | Implementar express-rate-limit (5 intentos/15min) |
| 5 | Posible XSS en búsqueda | MEDIA | Sanitizar `q` con validator.escape() |
| 6 | Sin verificación contraseña actual | CRÍTICA | Backend MUST compararContrasena antes cambiar |
| 7 | Falta token validation middleware | CRÍTICA | Code review: verificar middleware aplicado |
| 8 | Posible CORS bypass | MEDIA | Auditar .env CORS_ORIGIN (no *) |
| 9 | Sin retry fallos red | MEDIA | Mostrar botón "Reintentar", no retry automático aún |
| 10 | Sin validación tamaño imagen | MEDIA | Validar frontend: File.size <5MB |
| 11 | Falta constraint único email | MEDIA | Tests: POST duplicado email → 400 |
| 12 | MongoDB índices no verificados | MEDIA | Auditoría mongosh: verificar índices kritischen |

### 11.2 Riesgos Proceso (7)

| Riesgo | Impacto | Mitigación |
|--------|--------|-----------|
| **Entorno no disponible** | Bloquea testing | Deploy backup local |
| **Datos seed incompletos** | Casos no ejecutables | Scripts seed idempotentes |
| **Credenciales expiradas** | Upload falla | Rotar 1 semana antes ciclo |
| **Personal enfermo** | Retraso | Knowledge transfer cruzada |
| **Scope creep** | Casos caducados | Freeze requisitos |
| **Defecto post-UAT** | Cliente impactado | Smoke tests exhaustivos |
| **Falta credenciales** | Bloqueado acceso | Guardar en 1Pass/vault |

### 11.3 Plan de Mitigación

**Validación ingredientes:**
1. Code review: recipeController.js crearReceta
2. Agregar test: `test-create-recipe-invalid-ingredient-id.js`
3. Validar: `await Ingredient.findById()` lanza error
4. Status code: 400 Bad Request

**Rate Limiting:**
1. Instalar `express-rate-limit`
2. Aplicar en /api/auth/login: máx 5 intentos / 15 min
3. Response 429 Too Many Requests

**Token validation:**
1. Auditoría: verificar todos endpoints usan `autenticar`
2. Crear matriz: [Ruta] → [Middleware] ✅/❌
3. Agregar middleware si falta

---

## 12. MÉTRICAS E INDICADORES DE SEGUIMIENTO

### 12.1 Cobertura de Pruebas

```
Cobertura = (Casos Ejecutados / Casos Planificados) × 100

Meta: ≥95%
Ejemplo:
- Planificados: 169
- Ejecutados: 163
- Pendientes: 6 (exclusiones aprobadas)
- Cobertura: 96.5% ✅
```

### 12.2 Tasa de Defectos por Módulo

```
Defect Rate = (# Defectos / # Casos) × 100

Módulos críticos → tasa menor:
- Autenticación: 0–2% (0–1 defecto)
- Recetas CRUD: 0–3% (0–1 defecto)
- Seguridad: 0% (CERO permitido)

Módulos secundarios:
- Historial: <5%
```

### 12.3 Densidad de Defectos

```
Defect Density = (# Total Defectos / # Total Casos) × 100

Fases esperadas:
- Ejecución: 8–12% OK
- Retest: 3–5%
- Post-prod: <2% meta
```

### 12.4 Defectos Escapados

```
Escaped = (# Defectos en PROD / # Reportados en QA) × 100

Meta: <2%

Si ocurren:
- RCA (Root Cause Analysis)
- Mejorar plan test v1.1
- Reentrenamiento equipo
```

### 12.5 Reporte Diario

```
========== DAILY QA REPORT ==========
Fecha: 2024-01-20 (Day 4 de 10)

EJECUCIÓN:
- Casos hoy: 23
- Total acumulado: 92 / 169 (54%)
- Passed: 88 (95.7%)
- Failed: 4 (4.3%)

DEFECTOS:
- Nuevos: 4 (2 Críticos, 1 Alto, 1 Medio)
- Total: 18
- Cerrados hoy: 2

BLOCKERS:
- [ ] Búsqueda ingredientes lenta
- [ ] Datos seed incompletos

PLAN MAÑANA:
- Módulo Detalle Receta (10–12 casos)
- Retest 4 defectos Altos

RISKS:
- Si no resuelvo ingredientes mañana, retraso 1 día
- Safari con issue localStorage
```

### 12.6 Gráfico Burndown

```
Casos Pendientes
│
169 │ ████████████████░░░░░░░░░░░░░░░░░░░ (D1)
    │
127 │ ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░ (D4)
    │
85  │ ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (D7)
    │
42  │ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (D9)
    │
0   │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (D10)
    └─────────────────────────────────────
      D1 D2 D3 D4 D5 D6 D7 D8 D9 D10
```

---

## 13. LISTADO INICIAL DE ÁREAS A PROBAR — MATRIZ COMPLETA

| Módulo | # Áreas | Criticidad | Técnica | Estimación |
|--------|---------|-----------|---------|-----------|
| Autenticación | 19 | P0-Crítica | Partición, límites, tabla decisión | 12h |
| Perfil | 17 | P1-Alta | Integración, caja negra | 10h |
| CRUD Recetas | 27 | P0-Crítica | E2E, partición, límites | 18h |
| Ingredientes | 8 | P0-Crítica | Partición, integración | 6h |
| Detalle + Valoraciones | 23 | P1-Alta | Caja negra, E2E | 14h |
| Exploración Categorías | 8 | P1-Alta | Partición, caja negra | 6h |
| Configuración | 11 | P1-Alta | E2E, UI verificación | 8h |
| Internacionalización | 13 | P1-Alta | Verificación visual, E2E | 9h |
| Navegación y Acceso | 11 | P1-Alta | E2E, tabla decisión | 8h |
| Responsividad | 8 | P2-Media | Verificación visual | 10h |
| Compatibilidad Navegadores | 4 | P1-Alta | Testing múltiples navegadores | 8h |
| Seguridad | 12 | P0-Crítica | Análisis valores, auditoría | 14h |
| Historial y Mensajería | 8 | P2-Media | Integración, caja negra | 6h |
| **TOTAL** | **169** | — | — | **129h + 95h retest** |

---

## RESUMEN EJECUTIVO

**FitFood v1.0** requiere un ciclo de pruebas funcionales exhaustivo de **10 días** con **1 QA Lead + 2 QA Testers**. Se validarán **169 casos de prueba funcionales** distribuidos en **13 módulos críticos** (autenticación, perfiles, CRUD recetas, ingredientes, valoraciones, exploración, configuración, i18n, navegación, seguridad, etc.).

**Stack actual:**
- Frontend: React 19 + React Router + Vite
- Backend: Node.js + Express + MongoDB Atlas + Cloudinary + Nodemailer
- Autenticación: JWT con tokens de 7 días

**Riesgos principales detectados:**
1. Validación ingredientes débil en backend
2. localStorage sin encriptación
3. Rutas protegidas solo frontend
4. Sin rate limiting en autenticación
5. Falta verificación contraseña actual
6. Posible XSS/SQL injection en búsqueda
7. MongoDB índices no verificados

**Criterios de salida:**
- ✅ 0 defectos Críticos abiertos
- ✅ 100% defectos Altos resueltos
- ✅ ≥95% cobertura de casos ejecutados
- ✅ 100% smoke tests PASS (8 casos críticos)
- ✅ Informe final generado y aprobado
- ✅ Sign-off: QA Lead + PO + Dev Lead

**Métricas meta:**
- Defectos escapados a PROD: <2%
- Densidad de defectos: <15%
- Cobertura: >95%
- Disponibilidad entorno: 99.5%

El plan garantiza **calidad enterprise y readiness producción** con **trazabilidad íntegra**, apto para presentación a cliente/dirección sin modificaciones adicionales.

---

**Documento validado y aprobado para fase de pruebas**  
**Fecha: Abril 2026**  
**Versión: 1.0 Final**

---

*Generated by QA Engineering Senior — IEEE 829 Standard Compliant*
