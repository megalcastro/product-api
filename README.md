# Product API

This project is an API for managing products, with automatic synchronization from Contentful and features for testing, linting, and coverage.

## Prerequisites

- Docker (compatible with Colima on macOS/Linux)
- Node.js 18+
- npm or Yarn
- Valid environment configuration

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/megalcastro/product-api.git
   cd product-api
   ```

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

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

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

## Running with Docker

### Setup

1. Make sure Docker is installed. If you use macOS/Linux, install and use Colima (if Docker Desktop is installed locally, proceed to step #2):

   ```bash
   colima start
   ```

2. Build and run the container:

   ```bash
   docker-compose up --build
   ```

3. Congratulations, the Products API is now running with Docker 🎉 ㋿️ 🥳

## API Testing Examples via HTTP

### Register before using the APIs

```bash
curl --location 'http://localhost:3000/api/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "lucho",
    "email": "guardian.99@hotmail.com",
    "password": "123456"
}'
```

### Log in

```bash
curl --location 'http://localhost:3000/api/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "guardian.99@hotmail.com",
    "password": "123456"
}'
```

### Copy and paste the generated `access_token` as a Bearer token to retrieve all products

```bash
curl --location 'http://localhost:3000/api/products' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1YXJkaWFuLjk5QGhvdG1haWwuY29tIiwic3ViIjoxLCJpYXQiOjE3MzcyMTM4MDcsImV4cCI6MTczNzIxNzQwN30.EByyfn9VQF2cT_zq3dX8kwFiXKELV82HGnhI24qeBZc'
```

### To delete products

```bash
curl --location --request PATCH 'http://localhost:3000/api/products/delete/ZIMPDOPD' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imd1YXJkaWFuLjk5QGhvdG1haWwuY29tIiwic3ViIjoxLCJpYXQiOjE3MzcyMTM4MDcsImV4cCI6MTczNzIxNzQwN30.EByyfn9VQF2cT_zq3dX8kwFiXKELV82HGnhI24qeBZc'
```

### Report of deleted products

```bash
curl --location 'http://localhost:3000/api/reports/deleted-percentage'
```

### Automatic Product Insertion from Contentful

The `ContentfulService` automatically synchronizes products upon container startup using the `@Cron` method. This ensures products stay updated without manual intervention.

## Running in Development without Docker

1. Run the database locally (optionally with Docker):

   ```bash
   docker run -d \
     --name product-db \
     -e POSTGRES_USER=user \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=your_db \
     -p 5432:5432 \
     postgres:15
   ```

2. Start the application:

   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

## Running Unit Tests

To run unit tests and get coverage metrics:

```bash
npm run test
npm run test:cov
```

## Validate Linters

Ensure the code adheres to linter rules:

```bash
npm run lint
```

## GitHub Actions

The project includes a workflow to run tests and validations on every `push` or `pull request`. The `.github/workflows/ci.yml` file ensures that linters and tests are executed automatically.

## FAQs

### What does the Contentful synchronization do?

The `ContentfulService` performs the following actions:

1. Fetches products from Contentful using its API.
2. Maps the data to match the database model.
3. Inserts new products into the database.
4. Avoids duplicates using the SKU key.

---

Thank you for using Product API! If you have questions or suggestions, feel free to open an issue in the repository.

