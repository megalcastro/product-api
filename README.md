# Product API

Este proyecto es una API para la gestión de productos, con sincronización automática desde Contentful y funcionalidades para pruebas, linting, y cobertura.

## Requisitos Previos

- Docker (compatible con Colima en macOS/Linux)
- Node.js 18+
- npm o Yarn
- Configuración de entorno válida


## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/product-api.git
   cd product-api
   ```

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
JWT_SECRET=your_secret_key_here

CONTENTFUL_SPACE_ID=''
CONTENTFUL_ACCESS_TOKEN=''
CONTENTFUL_ENVIRONMENT=master
CONTENTFUL_CONTENT_TYPE=product

DB_HOST='localhost'
DB_PORT='5432'
DB_USER=''
DB_PASSWORD=''
DB_NAME='tasks_db'
```

2. Instala las dependencias:

   ```bash
   npm install
   # o
   yarn install
   ```

## Ejecutar con Docker

### Configuración

1. Asegúrate de tener Docker instalado. Si usas macOS/Linux, instala y usa Colima:

   ```bash
   colima start
   ```

2. Construye y ejecuta el contenedor:

   ```bash
   docker-compose up --build
   ```

### Inserción Automática de Productos desde Contentful

El servicio `ContentfulService` sincroniza automáticamente los productos al iniciar el contenedor gracias al método decorado con `@Cron`. Esto asegura que los productos estén actualizados sin intervención manual.

## Ejecutar en Desarrollo

1. Ejecuta la base de datos localmente (opcional con Docker):

   ```bash
   docker run -d \
     --name product-db \
     -e POSTGRES_USER=user \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=your_db \
     -p 5432:5432 \
     postgres:15
   ```

2. Inicia la aplicación:

   ```bash
   npm run start:dev
   # o
   yarn start:dev
   ```

## Ejecutar Pruebas Unitarias

Para ejecutar las pruebas unitarias y obtener métricas de cobertura:

```bash
npm run test
npm run test:cov
```

## Validar Linters

Asegúrate de que el código sigue las reglas del linter:

```bash
npm run lint
```

## GitHub Actions

El proyecto incluye un flujo de trabajo para ejecutar pruebas y validaciones en cada `push` o `pull request`. El archivo `.github/workflows/ci.yml` asegura que los linters y las pruebas se ejecuten automáticamente.

## Contribuir

1. Crea una rama para tu funcionalidad:

   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```

2. Haz tus cambios y confirma:

   ```bash
   git add .
   git commit -m "Agrega nueva funcionalidad"
   ```

3. Sube tus cambios y abre un Pull Request:

   ```bash
   git push origin feature/nueva-funcionalidad
   ```

## Preguntas Frecuentes

### ¿Qué hace la sincronización de Contentful?

El servicio `ContentfulService` realiza las siguientes acciones:

1. Descarga productos desde Contentful usando su API.
2. Mapea los datos para ajustarse al modelo de base de datos.
3. Inserta productos nuevos en la base de datos.
4. Evita duplicados usando la clave SKU.

### ¿Cómo agrego nuevos productos manualmente?

Puedes usar el servicio de productos para agregar nuevos productos manualmente. Consulta la documentación de la API para más detalles.

---

¡Gracias por usar Product API! Si tienes dudas o sugerencias, no dudes en abrir un issue en el repositorio.

