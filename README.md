# 🍲 SmartChef

Aplicación web full-stack para la gestión inteligente de la despensa y la búsqueda de recetas. SmartChef te permite guardar los ingredientes que tienes en casa, buscar recetas por nombre, categoría, país de origen o ingrediente, comprobar qué te falta para cocinarlas, y guardar tus favoritas, valorarlas y comentarlas.

El proyecto nace como ejercicio de bootcamp (Ironhack) y está planteado como una aplicación completa: frontend en React, API REST propia en Express/MongoDB, e integración con una API pública de recetas de terceros ([TheMealDB](https://www.themealdb.com/api.php)).

## 📖 Índice

- [Capturas de pantalla](#-capturas-de-pantalla)
- [Funcionalidades](#-funcionalidades)
- [Stack tecnológico](#️-stack-tecnológico)
- [Arquitectura general](#-arquitectura-general)
- [Estructura del código](#-estructura-del-código)
- [La API en detalle](#-la-api-en-detalle)
  - [Modelos de datos](#modelos-de-datos)
  - [Autenticación y sesión](#autenticación-y-sesión)
  - [Middlewares](#middlewares)
  - [Endpoints](#endpoints)
  - [Integración con TheMealDB](#integración-con-themealdb)
- [El frontend en detalle](#-el-frontend-en-detalle)
- [Puesta en marcha](#-puesta-en-marcha)
- [Testing](#-testing)
- [Despliegue](#-despliegue)

## 📸 Capturas de pantalla

| Home | Login |
|---|---|
| ![Home](smartchef-images/home.png) | ![Login](smartchef-images/login.png) |

| Búsqueda de recetas | Mi despensa |
|---|---|
| ![Búsqueda de recetas](smartchef-images/recipe-search.png) | ![Mi despensa](smartchef-images/my-pantry.png) |

| Mis recetas favoritas | Detalle de receta |
|---|---|
| ![Mis recetas favoritas](smartchef-images/my-favorite-recipes.png) | ![Detalle de receta](smartchef-images/recipe-detail-01.png) |

| Detalle de receta (ingredientes) | Detalle de receta (comentarios) |
|---|---|
| ![Detalle de receta - ingredientes](smartchef-images/recipe-detail-02.png) | ![Detalle de receta - comentarios](smartchef-images/recipe-detail-03.png) |

## ✨ Funcionalidades

- **Autenticación de usuarios**: registro, login y sesión persistente basada en cookies.
- **Mi despensa**: añadir, editar y eliminar los ingredientes (con cantidad y unidad) que tienes en casa.
- **Búsqueda de recetas**: por texto libre, categoría, país de origen o ingrediente, combinando filtros entre sí, usando TheMealDB como fuente de recetas.
- **Detalle de receta**: instrucciones, lista de ingredientes con cantidades y enlace al vídeo (cuando existe).
- **Comprobación de despensa**: para cada receta, indica qué ingredientes ya tienes en tu despensa y cuáles te faltan.
- **Favoritos**: guarda recetas para consultarlas más tarde y elimínalas cuando quieras.
- **Valoraciones**: puntúa una receta de 1 a 5, con una valoración por usuario y receta (se actualiza si vuelves a votar).
- **Comentarios**: escribe, edita y elimina comentarios en cada receta.

## 🛠️ Stack tecnológico

**Frontend (`web/`)**

| Tecnología | Uso |
|---|---|
| React 19 | Librería de UI |
| Vite | Bundler y servidor de desarrollo |
| React Router (v7/v8) | Enrutado de la SPA |
| React Hook Form | Gestión de formularios (login, registro, despensa) |
| Axios | Cliente HTTP hacia la API |
| oxlint | Linter |

**Backend (`api/`)**

| Tecnología | Uso |
|---|---|
| Express 5 | Framework del servidor HTTP / API REST |
| Mongoose | ODM sobre MongoDB |
| express-session + connect-mongo | Sesión de usuario persistida en MongoDB |
| bcryptjs | Hash de contraseñas |
| convict + dotenv | Configuración por variables de entorno con validación |
| pino / pino-http | Logging estructurado |
| http-errors | Errores HTTP tipados para los controladores |
| serverless-http | Adaptador de Express para ejecutarse como función serverless |
| axios | Cliente HTTP hacia la API externa TheMealDB |
| Jest, Supertest, mongodb-memory-server, @faker-js/faker | Testing de la API |

## 🏗️ Arquitectura general

SmartChef es un **monorepo** con dos aplicaciones independientes que se comunican por HTTP:

```
┌──────────────┐        HTTP + cookie de sesión        ┌──────────────┐        HTTP        ┌──────────────┐
│   web/       │ ─────────────────────────────────────▶│   api/       │───────────────────▶│  TheMealDB   │
│  React SPA   │◀───────────────────────────────────── │ Express REST │◀────────────────────│ (API externa)│
└──────────────┘                                        └──────┬───────┘                    └──────────────┘
                                                                │
                                                                ▼
                                                         ┌──────────────┐
                                                         │   MongoDB    │
                                                         │ (usuarios,   │
                                                         │  despensa,   │
                                                         │  favoritos,  │
                                                         │  ratings,    │
                                                         │  comentarios)│
                                                         └──────────────┘
```

- **Datos propios de SmartChef** (usuarios, ítems de despensa, favoritos, valoraciones, comentarios) se guardan en **MongoDB**.
- **Datos de recetas** (nombre, ingredientes, instrucciones, imágenes...) **no se almacenan**: se piden en cada petición a la API pública **TheMealDB**, de modo que la API de SmartChef actúa como una capa intermedia (BFF) que combina esos datos externos con los datos propios del usuario (por ejemplo, al comprobar la despensa contra los ingredientes de una receta).
- La sesión se mantiene mediante una **cookie httpOnly** gestionada por `express-session`, y el frontend viaja con `withCredentials: true` para que el navegador la envíe en cada petición.

## 📂 Estructura del código

```
smartchef/
├── web/                          # Frontend (React + Vite)
│   └── src/
│       ├── pages/                # Una página por ruta
│       │   ├── home-page.jsx             # "/" — portada, categorías destacadas
│       │   ├── login-page.jsx            # "/login"
│       │   ├── register-page.jsx         # "/register"
│       │   ├── recipe-search-page.jsx    # "/recipe-search" — buscador con filtros
│       │   ├── recipe-detail-page.jsx    # "/recipes/:mealId" — detalle + rating/comentarios
│       │   ├── pantry-page.jsx           # "/my-pantry" — CRUD de la despensa
│       │   └── favorites-page.jsx        # "/my-favorite-recipes"
│       ├── components/           # Componentes reutilizables, agrupados por dominio
│       │   ├── auth/                     # login-form, register-form
│       │   ├── pantry/                   # pantry-list, pantry-item, pantry-form
│       │   ├── gallery/, favorites-gallery/, favorite-button/
│       │   ├── recipe-detail/, rating/, comments/
│       │   └── ui/                       # navbar y componentes de interfaz genéricos
│       ├── layouts/               # page-layout: layout común (navbar + contenido)
│       ├── contexts/              # auth-context: usuario logueado, login/logout, favoritos
│       ├── services/              # api-service.js: único punto de acceso a la API (Axios)
│       └── assets/                # logo e iconos estáticos
│
├── api/                           # Backend (Express + MongoDB)
│   ├── src/
│   │   ├── server.js              # Punto de entrada: conecta a Mongo y arranca el servidor HTTP
│   │   ├── app.js                 # App de Express: middlewares globales + montaje de rutas
│   │   ├── controllers/           # Router + lógica por recurso (ver detalle más abajo)
│   │   │   ├── index.js                  # Ensambla el router principal /api/v0
│   │   │   ├── users.controller.js
│   │   │   ├── pantryItems.controller.js
│   │   │   ├── favorites.controller.js
│   │   │   ├── recipes.controller.js
│   │   │   ├── mealCategories.controller.js
│   │   │   ├── rating.controller.js
│   │   │   └── comments.controller.js
│   │   ├── middlewares/
│   │   │   ├── auth.mid.js               # Exige sesión válida y adjunta req.user
│   │   │   └── errors.mid.js             # 404 y manejador global de errores
│   │   └── lib/
│   │       ├── models/                   # Esquemas de Mongoose (ver detalle más abajo)
│   │       ├── db.js                     # Conexión a MongoDB
│   │       ├── session.js                # Configuración de express-session + connect-mongo
│   │       ├── cors.js                   # Configuración de CORS (origen permitido + credenciales)
│   │       └── config.js                 # Configuración tipada con convict (env vars)
│   ├── netlify/functions/api.js   # Envuelve la app Express con serverless-http para Netlify
│   └── seeds.js                   # Script para poblar la base de datos con datos de ejemplo (faker)
│
├── smartchef-images/              # Capturas de pantalla usadas en este README
├── doc/                           # Documentación de diseño (idea, wireframes, diseño de la API)
├── netlify.toml                   # Configuración de build y redirecciones de Netlify
└── README.md
```

## 🔌 La API en detalle

Toda la API cuelga del prefijo **`/api/v0`** (montado en [api/src/app.js](api/src/app.js)). Responde en JSON y usa códigos de estado HTTP estándar; los errores de validación de Mongoose se traducen a `400` con un objeto `errors` por campo, y los errores de sesión/permiso a `401`/`404` (ver [errors.mid.js](api/src/middlewares/errors.mid.js)).

### Modelos de datos

Todos los modelos viven en [api/src/lib/models/](api/src/lib/models/) y usan `timestamps: true` (añaden `createdAt`/`updatedAt`) y un `toJSON.transform` que sustituye `_id` por `id` y oculta `__v` (y, en el caso del usuario, la contraseña).

| Modelo | Campos principales | Notas |
|---|---|---|
| **User** | `name`, `username` (único), `email` (único, formato validado), `password` (hasheada) | La contraseña se cifra con `bcryptjs` en un hook `pre("save")`; incluye el método de instancia `checkPassword()` y virtuals `pantryItems`/`favorites` para poblar relaciones. |
| **PantryItem** | `ingredient`, `quantity`, `unit`, `user` (ref. `User`) | Un ingrediente de la despensa de un usuario. |
| **Favorite** | `mealId`, `mealName`, `mealThumb`, `user` (ref. `User`) | Referencia a una receta de TheMealDB guardada como favorita. |
| **Rating** | `mealId`, `rating` (1-5), `user` (ref. `User`) | Índice único compuesto `{ mealId, user }`: como máximo una valoración por usuario y receta. |
| **Comment** | `mealId`, `comment`, `user` (ref. `User`) | Comentario de un usuario sobre una receta. |
| **mealCategory** | `mealName`, `mealThumb`, `externalId`, `country` | Forma normalizada de los resultados de TheMealDB por categoría (no se persiste como colección propia de negocio, se usa como shape de respuesta). |

### Autenticación y sesión

- El login (`POST /users/login`) verifica el email y la contraseña (`user.checkPassword`) y, si son correctos, guarda `req.session.userId` en la sesión.
- La sesión se persiste en **MongoDB** vía `connect-mongo` ([session.js](api/src/lib/session.js)), con cookie `httpOnly`, `maxAge` de 24 horas y `secure` configurable por entorno.
- El middleware [`auth.mid.js`](api/src/middlewares/auth.mid.js) protege las rutas privadas: comprueba que existe `req.session.userId`, carga el `User` correspondiente y lo expone como `req.user`; si no hay sesión o el usuario ya no existe, responde `401`.
- El logout destruye la sesión (`req.session.destroy`).
- Toda la configuración sensible (URI de Mongo, secreto de sesión, origen CORS, flag `secure` de la cookie) se valida con **convict** en [config.js](api/src/lib/config.js) a partir de variables de entorno (ver `api/.env`).

### Middlewares

| Middleware | Función |
|---|---|
| `pino-http` | Log estructurado de cada petición/respuesta. |
| `cors` ([cors.js](api/src/lib/cors.js)) | Restringe el origen permitido (frontend) y habilita el envío de credenciales/cookies. |
| `express.json()` | Parseo del body JSON. |
| `session` | Sesión de usuario (ver arriba). |
| `auth` | Exige sesión válida en las rutas privadas y adjunta `req.user`. |
| `errors.notFound` / `errors.globalHandler` | 404 genérico y manejo centralizado de errores (validación de Mongoose, `CastError` de `_id`, errores HTTP con `http-errors`, y fallback `500`). |

### Endpoints

Rutas montadas en [api/src/controllers/index.js](api/src/controllers/index.js). 🔒 = requiere sesión (middleware `auth`).

**Usuarios**

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `POST` | `/users` | | Registro de un nuevo usuario. `409` si el username ya existe. |
| `POST` | `/users/login` | | Login por email/contraseña. Crea la sesión. |
| `DELETE` | `/users/logout` | 🔒 | Cierra la sesión actual. |
| `GET` | `/users/profile` | 🔒 | Devuelve el usuario autenticado. |

**Despensa (`pantry`)**

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `GET` | `/pantry` | 🔒 | Lista los ingredientes del usuario autenticado. |
| `POST` | `/pantry` | 🔒 | Crea un ingrediente (`ingredient`, `quantity`, `unit`). |
| `GET` | `/pantry/:id` | 🔒 | Detalle de un ingrediente propio. |
| `PATCH` | `/pantry/:id` | 🔒 | Actualiza un ingrediente propio. |
| `DELETE` | `/pantry/:id` | 🔒 | Elimina un ingrediente propio. |

**Favoritos**

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `GET` | `/favorites` | 🔒 | Lista las recetas favoritas del usuario. |
| `POST` | `/favorites` | 🔒 | Añade una receta a favoritos (`mealId`, `mealName`, `mealThumb`). |
| `GET` | `/favorites/:id` | 🔒 | Detalle de un favorito propio. |
| `DELETE` | `/favorites/:id` | 🔒 | Elimina un favorito propio. |

**Recetas** (proxy sobre TheMealDB, ver sección siguiente)

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `GET` | `/recipes/search` | | Busca recetas por `q`, `category`, `country` y/o `ingredient` (combinables). |
| `GET` | `/recipes/:mealId` | | Detalle completo de una receta por id de TheMealDB. |
| `GET` | `/recipes/:mealId/check-pantry` | 🔒 | Compara los ingredientes de la receta con la despensa del usuario y devuelve `available`/`missing`. |

**Categorías de recetas**

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `GET` | `/meal-categories/:category` | 🔒 | Lista recetas de una categoría de TheMealDB, normalizadas al shape de `mealCategory`. |

**Valoraciones (`ratings`)**

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `GET` | `/ratings/:mealId` | 🔒 | Lista las valoraciones de una receta (una por usuario), con el usuario populado. |
| `POST` | `/ratings` | 🔒 | Crea o actualiza (`upsert`) la valoración del usuario para esa receta (`mealId`, `rating`). |
| `PATCH` | `/ratings/:id` | 🔒 | Actualiza una valoración propia. |
| `DELETE` | `/ratings/:id` | 🔒 | Elimina una valoración propia. |

**Comentarios**

| Método | Ruta | 🔒 | Descripción |
|---|---|---|---|
| `GET` | `/comments/:mealId` | 🔒 | Lista los comentarios de una receta, con el usuario populado, más recientes primero. |
| `POST` | `/comments` | 🔒 | Crea un comentario (`mealId`, `comment`). |
| `PATCH` | `/comments/:id` | 🔒 | Edita un comentario propio. |
| `DELETE` | `/comments/:id` | 🔒 | Elimina un comentario propio. |

En todos los recursos privados (despensa, favoritos, ratings, comentarios) el controlador filtra siempre por `user: req.user._id`, de modo que un usuario nunca puede leer, editar ni borrar los datos de otro.

### Integración con TheMealDB

El controlador [recipes.controller.js](api/src/controllers/recipes.controller.js) actúa como intermediario entre el frontend y [TheMealDB](https://www.themealdb.com/api.php):

- **Búsqueda (`search`)**: según los parámetros recibidos, llama a `search.php` (por nombre), `filter.php?i=` (por ingrediente), `filter.php?c=` (por categoría) o `filter.php?a=` (por país). Cuando se combinan varios filtros a la vez, la API de TheMealDB no lo permite de forma nativa, así que SmartChef amplía cada resultado con `lookup.php?i=` (petición por receta) para obtener los datos completos y poder filtrar en el propio backend por categoría, país y/o ingrediente simultáneamente.
- **Detalle (`detail`)**: hace `lookup.php?i=` y devuelve la respuesta de TheMealDB tal cual.
- **Comprobar despensa (`checkPantry`)**: obtiene el detalle de la receta, extrae sus hasta 20 ingredientes (`strIngredient1..20`), los compara (en minúsculas) contra la despensa del usuario en MongoDB, y devuelve dos listas: `available` (ingredientes que ya tienes) y `missing` (los que te faltan).
- **Categorías** ([mealCategories.controller.js](api/src/controllers/mealCategories.controller.js)): llama a `filter.php?c=` y normaliza cada receta al shape `{ mealName, mealThumb, externalId, country }`.

## 💻 El frontend en detalle

- **Enrutado** ([App.jsx](web/src/App.jsx)): rutas declarativas con `react-router-dom` para `/`, `/login`, `/register`, `/recipes/:mealId`, `/my-favorite-recipes`, `/recipe-search` y `/my-pantry`.
- **Servicio de API** ([api-service.js](web/src/services/api-service.js)): única capa de acceso a la API — una instancia de Axios (`withCredentials: true` para enviar la cookie de sesión) con un interceptor de respuesta que (a) desempaqueta `response.data` automáticamente y (b) redirige a `/login` ante un `401`, salvo que ya se esté en login/registro.
- **Contexto de autenticación** ([auth-context.jsx](web/src/contexts/auth-context.jsx)): `AuthContextProvider` carga el perfil y los favoritos al montar la app, persiste el usuario en `localStorage` (clave `current-user`) para una recarga instantánea, y expone `login`, `logout`, `updateFavorites` y `syncFavorites` al resto de la aplicación vía el hook `useAuth()`.
- **Páginas** ([pages/](web/src/pages/)): cada ruta tiene su propia página, que compone los componentes de dominio (formularios, listas, galerías) dentro del layout común ([page-layout.jsx](web/src/layouts/page-layout/page-layout.jsx), que incluye la barra de navegación).
- **Componentes por dominio** ([components/](web/src/components/)):
  - `auth/` — formularios de login y registro (con `react-hook-form`).
  - `pantry/` — listado, formulario y elemento individual de la despensa.
  - `gallery/` y `favorites-gallery/` — grids de recetas (resultados de búsqueda / favoritas), con `favorite-button/` para marcar/desmarcar.
  - `recipe-detail/` — ficha de una receta (ingredientes, instrucciones, vídeo).
  - `rating/` y `comments/` — valoración y comentarios de una receta.
  - `ui/` — componentes de interfaz genéricos (p. ej. `navbar/`).

## 🚀 Puesta en marcha

### Requisitos

- Node.js
- Una instancia de MongoDB (local o Atlas)

### Backend (`api/`)

```bash
cd api
npm install
cp .env.example .env   # o crea .env manualmente (ver variables abajo)
npm run dev             # arranca con recarga automática (node --watch)
```

Variables de entorno (`api/.env`):

| Variable | Descripción | Por defecto |
|---|---|---|
| `PORT` | Puerto en el que escucha la API | `3000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | — |
| `CORS_ORIGIN` | Origen permitido para CORS (el frontend) | `http://localhost:5173` |
| `SESSION_SECRET` | Secreto para firmar la cookie de sesión | — |
| `SESSION_SECURE` | `true` solo si se sirve por HTTPS (producción) | `false` |

### Frontend (`web/`)

```bash
cd web
npm install
npm run dev       # http://localhost:5173 por defecto
```

El frontend espera la variable `VITE_BASE_API_URL` apuntando a la URL base de la API (p. ej. `http://localhost:3000/api/v0`).

Cada carpeta (`web/` y `api/`) gestiona sus propias dependencias y variables de entorno de forma independiente.

## 🧪 Testing

La API incluye tests con **Jest** + **Supertest**, ejecutados contra una base de datos en memoria (**mongodb-memory-server**) para no depender de una instancia real de MongoDB:

```bash
cd api
npm test
```

El script `npm run seeds` ([seeds.js](api/seeds.js)) permite poblar una base de datos de desarrollo con datos de ejemplo generados con `@faker-js/faker`.

## ☁️ Despliegue

El proyecto está configurado para desplegarse en **Netlify** ([netlify.toml](netlify.toml)):

- El build instala y compila el frontend (`web/dist` como sitio estático) e instala las dependencias del backend.
- La API Express se ejecuta como una **Netlify Function** ([api/netlify/functions/api.js](api/netlify/functions/api.js)), que envuelve la app de Express con `serverless-http`.
- Redirecciones: las peticiones a `/api/*` se enrutan a la función serverless; el resto de rutas las sirve el `index.html` del SPA (necesario para que funcione el enrutado de React Router al recargar o compartir una URL).
