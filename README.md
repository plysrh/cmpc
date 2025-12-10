# CMPC Libros - Sistema de Gestión de Inventario

Aplicación web completa para la gestión de inventario de libros con frontend en React, backend en NestJS y base de datos PostgreSQL.

## Arquitectura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│  React + Vite   │─────▶│  NestJS API     │─────▶│   PostgreSQL    │
│  (Frontend)     │      │  (Backend)      │      │   (Database)    │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
     Port 5173                Port 3000                Port 5432
```

### Decisiones de Diseño

**Frontend:**

- **React + TypeScript**: Type safety y mejor experiencia de desarrollo
- **Vite**: Build rápido y HMR eficiente
- **Tailwind CSS**: Estilos utilitarios para desarrollo ágil
- **React Hook Form**: Validación de formularios con mínimo re-render
- **React Router**: Navegación con sincronización de URL
- **Cookie Storage**: Almacenamiento seguro de tokens JWT

**Backend:**

- **NestJS**: Framework escalable con arquitectura modular
- **Sequelize**: ORM robusto con soporte TypeScript
- **JWT**: Autenticación stateless y segura
- **Interceptores**: Logging centralizado y transformación de respuestas
- **Soft Delete**: Preservación de datos históricos

## Instalación y Configuración

### Opción 1: Desarrollo Local

1. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en `cmpc-backend/`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=cmpc_books
JWT_SECRET=cmpc-secret-key-2024
PORT=3000
```

4. **Iniciar PostgreSQL**

```bash
# Usando Docker
docker run -d \
  --name postgres \
  -e POSTGRES_DB=cmpc_books \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

5. **Iniciar backend**

```bash
npm run dev:backend
```

6. **Iniciar frontend**

```bash
npm run dev:frontend
```

### Opción 2: Docker Compose (Recomendado)

```bash
npm run docker:up
```

## Uso

### Acceso a la Aplicación

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

### Usuario de Prueba

```
Email: test@cmpc.com
Password: test123
```

### Funcionalidades Principales

**1. Login**

- Acceder con credenciales de prueba
- El token JWT se almacena en cookies

**2. Listado de Libros**

- Ver todos los libros con paginación (20 por página)
- Filtrar por campo específico (título, autor, editorial, género)
- Filtrar por disponibilidad
- Ordenar por cualquier columna (click en encabezado)
- Búsqueda en tiempo real con debounce

**3. Crear Libro**

- Click en "Nuevo Libro"
- Completar formulario con validación
- Campos: título, autor, editorial, precio, género, disponibilidad

**4. Editar Libro**

- Click en "Editar" en la fila del libro
- Modificar campos necesarios
- Guardar cambios

**5. Eliminar Libro**

- Click en "Eliminar" en la fila del libro (soft delete)

**6. Exportar CSV**

- Click en "Exportar CSV"
- Descarga archivo con todos los libros

## Testing

### Ejecutar Todos los Tests

```bash
npm test
```

### Tests por Workspace

**Backend - Tests Unitarios**

```bash
npm run test:backend
```

**Backend - Tests E2E**

```bash
npm run test:e2e
```

**Frontend - Tests Unitarios**

```bash
npm run test:frontend
```

### Cobertura de Tests

- **Backend**: 35 tests unitarios + 18 tests e2e
- **Frontend**: 15 tests unitarios
- **Cobertura**: >80%

## Despliegue con Docker

### Levantar Servicios

```bash
npm run docker:up
```

### Detener Servicios

```bash
npm run docker:down
```

### Servicios Incluidos

1. **PostgreSQL** (puerto 5432)
   - Base de datos con persistencia en volumen
   - Healthcheck configurado

2. **Backend** (puerto 3000)
   - API NestJS
   - Espera a que PostgreSQL esté listo
   - Auto-restart habilitado

3. **Frontend** (puerto 5173)
   - Aplicación React servida por Nginx
   - Build optimizado para producción

4. **Seed automático**
   - Ejecuta `seed:users` y `seed:books` automáticamente
   - Crea usuario de prueba y 1000 libros de ejemplo

## Estructura del Proyecto

```
com.zentagroup/
├── cmpc-backend/              # Backend NestJS
│   ├── src/
│   │   ├── auth/             # Módulo de autenticación
│   │   ├── books/            # Módulo de libros
│   │   ├── users/            # Módulo de usuarios
│   │   ├── common/           # Interceptores y utilidades
│   │   └── main.ts           # Entry point
│   ├── test/                 # Tests e2e
│   ├── Dockerfile
│   └── package.json
│
├── cmpc-frontend/            # Frontend React
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Servicios API
│   │   ├── types/            # Tipos TypeScript
│   │   └── App.tsx           # Componente principal
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml        # Orquestación de servicios
├── package.json              # Workspace raíz
├── .env.example              # Variables de entorno ejemplo
└── README.md                 # Este archivo
```

## API Documentation

Swagger UI disponible en: http://localhost:3000/api

## Scripts Disponibles

### Workspace Raíz

- `npm install` - Instala dependencias de todos los workspaces
- `npm run dev:backend` - Inicia backend en modo desarrollo
- `npm run dev:frontend` - Inicia frontend en modo desarrollo
- `npm run build` - Construye backend y frontend
- `npm test` - Ejecuta tests de backend y frontend
- `npm run test:e2e` - Ejecuta tests e2e del backend
- `npm run create:db` - Crear base de datos cmpc_books
- `npm run seed:users` - Crear usuario de prueba
- `npm run seed:books` - Poblar con 1000 libros de prueba
- `npm run docker:up` - Levanta servicios con Docker Compose y ejecuta seeds automáticamente
- `npm run docker:down` - Detiene servicios Docker Compose

### Backend (cmpc-backend)

- `npm run start:dev` - Modo desarrollo con hot reload
- `npm run start:prod` - Modo producción
- `npm run build` - Compilar TypeScript
- `npm test` - Tests unitarios
- `npm run test:e2e` - Tests e2e
- `npm run test:cov` - Tests con cobertura
- `npm run create:db` - Crear base de datos cmpc_books
- `npm run seed:users` - Crear usuario de prueba
- `npm run seed:books` - Poblar con 1000 libros de prueba

### Frontend (cmpc-frontend)

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm test` - Tests unitarios
- `npm run lint` - Linter ESLint

## Modelo de Base de Datos

### Tabla: users

```sql
id          UUID PRIMARY KEY
email       VARCHAR UNIQUE NOT NULL
password    VARCHAR NOT NULL
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

### Tabla: books

```sql
id              UUID PRIMARY KEY
titulo          VARCHAR NOT NULL
autor           VARCHAR NOT NULL
editorial       VARCHAR NOT NULL
precio          DECIMAL NOT NULL
genero          VARCHAR NOT NULL
disponibilidad  BOOLEAN DEFAULT true
createdAt       TIMESTAMP
updatedAt       TIMESTAMP
deletedAt       TIMESTAMP (soft delete)
```

## Limitaciones del Diseño Actual

### Estado Actual del Frontend

La interfaz actual presenta un diseño minimalista básico que requiere mejoras significativas:

**Problemas Identificados:**

- Diseño visual poco atractivo y genérico
- Falta de identidad visual corporativa
- Componentes con estilos básicos sin personalización
- Ausencia de elementos visuales modernos (gradientes, sombras, animaciones)
- Tipografía limitada sin jerarquía visual clara
- Paleta de colores muy restrictiva (solo grises y blancos)
- Falta de feedback visual en interacciones
- Diseño no optimizado para diferentes dispositivos

**Mejoras Requeridas con Tailwind CSS:**

1. **Sistema de Diseño Completo**
   - Implementar paleta de colores corporativa de CMPC
   - Definir sistema tipográfico con múltiples pesos y tamaños
   - Crear componentes reutilizables con variantes
   - Establecer espaciado consistente usando el sistema de Tailwind

2. **Componentes Modernos**
   - Cards con sombras y bordes redondeados
   - Botones con estados hover, focus y active
   - Inputs con mejor styling y validación visual
   - Modales y overlays para mejor UX
   - Loading states y skeletons

3. **Interactividad Mejorada**
   - Animaciones suaves con `transition-all duration-300`
   - Hover effects en elementos interactivos
   - Estados de loading con spinners
   - Feedback visual para acciones (toast notifications)
   - Micro-interacciones para mejorar la experiencia

4. **Responsive Design**
   - Layout adaptativo usando grid y flexbox de Tailwind
   - Breakpoints para mobile, tablet y desktop
   - Componentes que se adapten a diferentes tamaños
   - Navegación mobile-friendly

5. **Accesibilidad**
   - Contraste de colores apropiado
   - Focus states visibles
   - Aria labels y roles
   - Navegación por teclado

**Prioridad**: Alta - El diseño actual no cumple con estándares modernos de UX/UI

## Manejo de Errores

- **Frontend**: Mensajes de error amigables en UI
- **Backend**: Excepciones HTTP con códigos apropiados
- **Logging**: Registro de todas las operaciones y errores

## Población de Base de Datos

### Opción 1: Automática (Recomendado para desarrollo)

La base de datos se puebla automáticamente al iniciar la aplicación:

1. **Tablas**: Sequelize crea automáticamente las tablas (users, books) con `synchronize: true`
2. **Usuario de prueba**: Se crea automáticamente en el primer inicio
   - Email: test@cmpc.com
   - Password: test123
3. **Datos de libros**: Usar la interfaz web o API para crear libros manualmente

### Opción 2: Scripts de Seed (Para testing con datos masivos)

Se incluyen scripts para poblar la base de datos con datos de prueba:

**Crear base de datos:**

```bash
npm run create:db
```

- Crea la base de datos `cmpc_books` si no existe
- Crea las tablas `users` y `books` automáticamente
- Se conecta usando las credenciales por defecto de PostgreSQL

**Crear usuario de prueba:**

```bash
npm run seed:users
```

- Crea el usuario: test@cmpc.com / test123
- Si el usuario ya existe, no hace nada (ON CONFLICT DO NOTHING)

**Poblar con 1000 libros de prueba:**

```bash
npm run seed:books
```

- Genera 1000 libros con datos aleatorios usando Faker.js
- Incluye: títulos, autores, editoriales, precios, géneros y disponibilidad
- ⚠️ **ADVERTENCIA**: Este script ejecuta `TRUNCATE TABLE books` eliminando todos los libros existentes
- Inserta los datos en lotes de 100 para optimizar el rendimiento

**Ejecutar todos los scripts:**

```bash
npm run create:db
npm run seed:users
npm run seed:books
```

**Nota**: Los scripts se conectan directamente a PostgreSQL usando las credenciales por defecto (localhost:5432).

## Mejoras Futuras

### Arquitectura Backend

**Domain-Driven Design (DDD)**
- Implementar agregados para `Book`, `Author` y `Publisher`
- Crear value objects para `Price`, `Email` y `ISBN`
- Definir domain services para lógica de negocio compleja
- Separar domain models de persistence models

**Arquitectura Hexagonal**
- Crear puertos (interfaces) para repositorios y servicios externos
- Implementar adaptadores para base de datos, APIs externas y UI
- Aislar la lógica de dominio de la infraestructura
- Facilitar testing con mocks y stubs

### Modelo de Datos Normalizado

#### Diagrama de Entidades

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     AUTHORS     │       │      BOOKS      │       │   PUBLISHERS    │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (UUID) PK    │   ┌───│ id (UUID) PK    │───┐   │ id (UUID) PK    │
│ nombre          │   │   │ titulo          │   │   │ nombre          │
│ apellido        │   │   │ isbn            │   │   │ direccion       │
│ biografia        │   │   │ publisher_id FK │───┘   │ telefono        │
│ fecha_nacimiento│   │   │ precio          │       │ email           │
│ nacionalidad    │   │   │ genero          │       │ pais            │
│ createdAt       │   │   │ disponibilidad  │       │ createdAt       │
│ updatedAt       │   │   │ fecha_publicacion│      │ updatedAt       │
└─────────────────┘   │   │ paginas         │       └─────────────────┘
         │             │   │ descripcion     │
         │             │   │ createdAt       │
         │             │   │ updatedAt       │
         │             │   │ deletedAt       │
         │             │   └─────────────────┘
         │             │
         │             │   ┌─────────────────┐
         │             │   │  BOOK_AUTHORS   │
         │             │   ├─────────────────┤
         └─────────────────│ book_id FK      │
                           │ author_id FK    │
                           │ (PK Compuesta)  │
                           └─────────────────┘
```

**Relaciones:**
- `books.publisher_id` → `publishers.id` (Many-to-One)
- `book_authors.book_id` → `books.id` (Many-to-Many)
- `book_authors.author_id` → `authors.id` (Many-to-Many)

#### Definiciones de Tablas

**Entidad Authors**
```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  biografia TEXT,
  fecha_nacimiento DATE,
  nacionalidad VARCHAR(100),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Entidad Publishers**
```sql
CREATE TABLE publishers (
  id UUID PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  direccion TEXT,
  telefono VARCHAR(50),
  email VARCHAR(255),
  pais VARCHAR(100),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

**Tabla de Relación Books-Authors (Many-to-Many)**
```sql
CREATE TABLE book_authors (
  book_id UUID REFERENCES books(id),
  author_id UUID REFERENCES authors(id),
  PRIMARY KEY (book_id, author_id)
);
```

**Books Actualizada**
```sql
CREATE TABLE books (
  id UUID PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  publisher_id UUID REFERENCES publishers(id),
  precio DECIMAL(10,2) NOT NULL,
  genero VARCHAR(255) NOT NULL,
  disponibilidad BOOLEAN DEFAULT true,
  fecha_publicacion DATE,
  paginas INTEGER,
  descripcion TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  deletedAt TIMESTAMP
);
```

### Funcionalidades Adicionales

**Backend**

- Implementar paginación con cursor-based pagination
- Agregar rate limiting y throttling
- Implementar cache con Redis
- Agregar validación de ISBN
- Crear endpoints para gestión de autores y editoriales
- Implementar búsqueda full-text con Elasticsearch
- Agregar sistema de notificaciones
- Implementar audit logs detallados

**Frontend**

- Implementar lazy loading de imágenes
- Agregar modo oscuro/claro
- Crear dashboard con métricas y gráficos
- Implementar drag & drop para reordenar
- Agregar filtros avanzados con múltiples criterios
- Crear sistema de favoritos
- Implementar PWA (Progressive Web App)
- Agregar internacionalización (i18n)

**Base de Datos**

- Implementar índices compuestos para optimizar consultas
- Agregar particionamiento por fecha
- Implementar replicación master-slave
- Crear vistas materializadas para reportes
- Agregar constraints de integridad referencial
- Implementar triggers para auditoría automática

### Seguridad

- Implementar refresh tokens para JWT
- Agregar autenticación de dos factores (2FA)
- Implementar roles y permisos granulares
- Agregar encriptación de datos sensibles
- Implementar HTTPS con certificados SSL
- Agregar validación de entrada más estricta
- Implementar CORS más restrictivo
- Agregar headers de seguridad (HSTS, CSP, etc.)

### DevOps y Monitoreo

- Implementar CI/CD con GitHub Actions
- Agregar monitoreo con Prometheus y Grafana
- Implementar logging centralizado con ELK Stack
- Agregar health checks más detallados
- Implementar backup automático de base de datos
- Crear environments de staging y producción
- Agregar análisis de performance con APM
- Implementar alertas automáticas