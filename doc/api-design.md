# Diseño de la API

## Modelos de datos

### User

| Campo | Tipo | Validaciones | Notas |
|---|---|---|---|
| `name` | String | required | Nombre completo |
| `username` | String | required, unique, trim | Nombre de usuario |
| `email` | String | required, unique, lowercase | Login |
| `password` | String | required, mínimo 8 caracteres | Hash bcrypt |
| `avatar` | String | optional | Imagen |

**Relaciones:** un User tiene muchos PantryItems y Favorites.

```js
const userSchema = new Schema(
{
  name: String,
  username: String,
  email: String,
  password: String,
  //avatar: String
},
{ timestamps: true }
);

userSchema.virtual("pantryItems", {
  ref: "PantryItem",
  localField: "_id",
  foreignField: "user"
});

userSchema.virtual("favorites", {
  ref: "Favorite",
  localField: "_id",
  foreignField: "user"
});
```
---

### PantryItem

| Campo         | Tipo     | Validaciones |
|---            |---       |---           |
| `ingredient`  | String   | required     | 
| `quantity`    | Number   | required     |
| `unit`        | String   | required     |
| `user`        | ObjectId | ref User     |

**Relaciones:** un PantryItem pertenece a un User.

```js
const pantryItemSchema = new Schema(
{
  ingredient: String,
  quantity: Number,
  unit: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
{ timestamps: true }
);
```
---

### Favorite

| Campo       | Tipo     | Validaciones |
|---          |---       |---           |
| `mealId`    | String   | required     | 
| `mealName`  | String   | required     | 
| `mealThumb` | String   | optional     | 
| `user`      | ObjectId | ref User     |

**Relaciones:** un Favorite pertenece a un User.

```js
const favoriteSchema = new Schema(
{
  mealId: String,
  mealName: String,
  mealThumb: String,

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

},
{ timestamps: true }
);
```

---

## Endpoints

Todos los endpoints tienen el prefijo `/api/v0`.

Los marcados con 🔒 requieren autenticación.

### Usuarios

| Método | Ruta               | Descripción      |
|---     |---                 |---               |
| POST   | `/api/v0/users`    | Registro         |
| POST   | `/api/v0/sessions` | Login            |
| DELETE | `/api/v0/sessions` | 🔒 Logout        |
| GET    | `/api/v0/users/me` | 🔒 Perfil        |
| PATCH  | `/api/v0/users/me` | 🔒 Editar perfil |

---

### Pantry

| Método    | Ruta                 | Descripción             |
|---        |---                   |---                      |
| GET       | `/api/v0/pantry`     | 🔒 Obtener ingredientes |
| POST      | `/api/v0/pantry`     | 🔒 Añadir ingrediente   |
| PATCH     | `/api/v0/pantry/:id` | 🔒 Editar ingrediente   |
| DELETE    | `/api/v0/pantry/:id` | 🔒 Eliminar ingrediente |

---

### Recipes

Estos endpoints consultan TheMealDB.

| Método | Ruta                                  | Descripción                                       |
|---     |---                                    |---                                                |
| GET    | `/api/v0/recipes/search?q=`           | Buscar recetas                                    |
| GET    | `/api/v0/recipes/:mealId`             | Obtener detalle de una receta                     |
| GET    | `/api/v0/recipes/:mealId/check-pantry`| 🔒 Comparar la receta con la despensa del usuario |


---

### Favorites

| Método | Ruta                    | Descripción                |
|---     |---                      |---                         |
| GET    | `/api/v0/favorites`     | 🔒 Listar favoritos        |
| POST   | `/api/v0/favorites`     | 🔒 Guardar receta favorita |
| DELETE | `/api/v0/favorites/:id` | 🔒 Eliminar favorito       |

---

## Cobertura Frontend - API

| Pantalla           | Endpoint                            |
|---                 |---                                  |
| `/signup`          | POST `/users`                       |
| `/login`           | POST `/sessions`                    |
| `/dashboard`       | GET `/users/me`                     |
| `/pantry`          | CRUD `/pantry`                      |
| `/recipes`         | GET `/recipes/search`               |
| `/recipes/:mealId` | GET `/recipes/:mealId`              |
| `/recipes/:mealId` | GET `/recipes/:mealId/check-pantry` |
| `/favorites`       | CRUD `/favorites`                   |
| `/profile`         | GET `/PATCH /users/me`              |