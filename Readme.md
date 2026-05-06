# TodoRol

Plataforma web para la gestión de campañas y partidas de juegos de rol. Permite crear y administrar campañas, personajes con fichas personalizadas, tiradas de dados con historial e invitación de jugadores.

## Tecnologías

- **Frontend:** React + Vite, React Router DOM, Axios, CSS Modules
- **Backend:** Node.js, Express, JWT, Bcrypt, Multer
- **Base de datos:** MySQL

---

## Requisitos previos

- Node.js v18 o superior
- npm
- MySQL 8 o superior
- Git

---

## Instalación y puesta en marcha

### 1. Clonar el repositorio

```bash
git clone https://github.com/Koffu9/proyecto-rol-daw
cd proyecto-rol
```

### 2. Base de datos

Crea la base de datos e importa el esquema:

```bash
mysql -u root -p
```

```sql
CREATE DATABASE proyecto_rol CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE proyecto_rol;
SOURCE database/schema.sql;
```

### 3. Backend

Accede a la carpeta del backend e instala las dependencias:

```bash
cd backend
npm install
```

Crea el archivo `.env` en la raíz de la carpeta `backend` con el siguiente contenido:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_NAME=proyecto_rol
JWT_SECRET=una_clave_secreta_larga_y_aleatoria
PORT=3000
```

Crea la carpeta de uploads para las imágenes:

```bash
mkdir uploads
```

Arranca el servidor:

```bash
npm run dev
```

El backend quedará disponible en `http://localhost:3000`.

### 4. Frontend

Abre una nueva terminal, accede a la carpeta del frontend e instala las dependencias:

```bash
cd frontend
npm install
```

Arranca el servidor de desarrollo:

```bash
npm run dev
```

El frontend quedará disponible en `http://localhost:5173`.



## Estructura del proyecto

proyecto-rol/
├── backend/
│   ├── src/
│   │   ├── config/         # Conexión a la BD y configuración de Multer
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Verificación de token JWT
│   │   ├── models/         # Consultas SQL
│   │   └── routes/         # Definición de endpoints
│   ├── uploads/            # Imágenes subidas por los usuarios
│   ├── .env                # Variables de entorno (no incluido en el repositorio)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── constants/      # Datos estáticos (clases y razas D&D)
│   │   ├── context/        # AuthContext
│   │   ├── pages/          # Vistas de la aplicación
│   │   └── services/       # Llamadas a la API
│   └── package.json
└── database/
    └── schema.sql          # Estructura de la base de datos

---

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `DB_HOST` | Host de la base de datos |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `PORT` | Puerto en el que corre el backend (por defecto 3000) |

---

## Scripts disponibles

### Backend

| `npx nodemon src/app.js` | Arranca el servidor con nodemon (recarga automática) |
| `node src/app.js` | Arranca el servidor en modo producción |

### Frontend

| `npm run dev` | Arranca el servidor de desarrollo con Vite |
| `npm run build` | Genera el build de producción |
| `npm run preview` | Previsualiza el build de producción |

---

## Solución de problemas comunes

**El backend no conecta con la base de datos**
Comprueba que las credenciales en el archivo `.env` son correctas y que MySQL está en ejecución.

**Error al subir imágenes**
Asegúrate de que la carpeta `backend/uploads/` existe y tiene permisos de escritura.

**El frontend no recibe datos del backend**
Verifica que el backend está corriendo en el puerto 3000 y que no hay errores en la consola del servidor.

**Token expirado o inválido**
Cierra sesión y vuelve a iniciar sesión para obtener un nuevo token.