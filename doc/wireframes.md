# Wireframes del MVP

Los wireframes describen las pantallas principales de SmartChef y el flujo de navegación entre ellas.

---

# Pantallas públicas

## `/`

Landing Page.

Muestra:

- Descripción de SmartChef.
- Botón **Iniciar sesión**.
- Botón **Registrarse**.

---

## `/signup`

Formulario de registro.

Campos:

- Name
- Username
- Email
- Password

Botón:

- Crear cuenta.

---

## `/login`

Formulario de inicio de sesión.

Campos:

- Email
- Password

Botón:

- Iniciar sesión.

---

# Pantallas privadas (requieren autenticación)

Las siguientes pantallas solo estarán disponibles para usuarios autenticados.

Si un usuario intenta acceder sin haber iniciado sesión, será redirigido automáticamente a la página principal (`/`).

---

## `/dashboard`

Página principal del usuario.

Muestra:

- Mensaje de bienvenida.
- Accesos rápidos.
- Número de ingredientes almacenados.
- Número de recetas favoritas.

---

## `/pantry`

Gestión de la despensa.

Permite:

- Ver ingredientes.
- Añadir ingrediente.
- Editar ingrediente.
- Eliminar ingrediente.

---

## `/recipes`

Buscador de recetas.

Permite:

- Buscar recetas por nombre utilizando TheMealDB.
- Acceder al detalle de una receta.

---

## `/recipes/:mealId`

Detalle de una receta.

Muestra:

- Imagen.
- Ingredientes.
- Instrucciones de preparación.

Permite:

- Comparar los ingredientes de la receta con la despensa del usuario.
- Guardar la receta en favoritos.
- Eliminar la receta de favoritos.

---

## `/favorites`

Lista de recetas favoritas.

Permite:

- Ver recetas favoritas.
- Acceder al detalle de una receta.
- Eliminar una receta de favoritos.

---

## `/profile`

Perfil del usuario autenticado.

Muestra:

- Nombre.
- Username.
- Email.
- Número de ingredientes almacenados.
- Número de recetas favoritas.

Permite:

- Cerrar sesión.

---

## Flujo de navegación

```text 

usuario no autenticado 
        |
___________________
|                  | 
/signup             /login
                    |
                Inicio de sesion
                    |
                    /dashboard
                    |
____________________________________________
|               |           |              |
/pantry        /recipes    /favorites     /profile
                |
                /recipes/:mealId
                |
                comparar ingredientes
                |
                /guardar / eliminar favorito 

Si el usuario NO esta autenticado:

/dashboard
/pantry
/recipes
/favorites
/profile


Redirección automática a "/"
```