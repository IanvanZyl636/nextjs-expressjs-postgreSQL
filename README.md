# 🏗️ High-Level Architecture & Trade-Offs

This monorepo was designed to offer a **fully self-hostable**, **low-boilerplate**, **distributable-ready**, and **free full-stack application** (only requiring a domain name). No paid cloud services are used—**only Cloudflare Tunnel**, which is free.

The application and database architecture support **multi-instance deployment**, with built-in handling for **race conditions** in a distributed environment. The test suite spins up a test database during CI/CD to validate concurrent access handling with zero error tolerance.

Only the **frontend is publicly exposed**, while the backend and database are isolated within a Docker network. Internal services communicate via Docker networking. If necessary, the backend can be exposed externally since it runs in a separate container.

---

## 💻 Tech Stack

- **Backend:** Express.js

- **Frontend:** Next.js (Incremental Static Site Generation)
- **Shared Library:** Prisma models, Zod schemas, and constants
- **ORM:** Prisma + PostgreSQL
- **DB:** PostgreSQL
- **Mono Repo:** For fast project setup and run commands
- **CI/CD:** Jenkins (Open Source)

> PostgreSQL was chosen due to its popularity, but thanks to Prisma, you can easily switch to any [supported database](https://www.prisma.io/docs/orm/reference/supported-databases).

---

## ⚖️ Trade-Offs

### 1. Docker & Build Pipeline

To support `docker-compose up` (running DB, FE, and BE), the app must be built **twice**—once in the CI pipeline to test the build and again in `docker-compose` to generate the FE and BE images, there are ways around this but this was last on my list and used my time on different concerns. Ideally, I would assign profiles to the different services to allow me to run individual services from the same `docker-compose.yml` file, given the freedom to structure the build in the most efficient way.

### 2. End-to-End Testing

Although the system is **structured for e2e testing**, time constraints meant implementation is still pending.

---

## ✅ Testing & Linting

- **Linting:** ESLint (applied to FE, BE, and shared lib)
- **Testing:** Jest with TDD for backend services
- **Coverage:** 70% minimum threshold enforced in `jest.config.ts`. The Jenkins pipeline fails if coverage drops below this threshold.

---

## 🧩 Prisma & PostgreSQL

DB models are located in: `apps/backend/integrations/prisma/models`

Key commands:

- `npm run prisma:migrate` – Generate and apply DB schema + types
- `npm run prisma:deploy` – Apply existing migrations (no new generation)
- `npm run prisma:reset` – Reset the DB and apply migrations from scratch

The stack includes **Adminer** for browsing the database (included in `docker-compose.yml`).

---

## 🔧 Backend – Express.js

The backend is built with **Express.js** and structured with clear, modular directory scaffolding. Each integration (e.g., Express, Prisma, Swagger) is placed under the `integrations/` folder with its respective subfolder, such as `integrations/express`, making it easy to locate and manage implementation-specific code.

### 🔌 Integrations

- **Ergast API**: For querying F1 data.
- **Express**: Provides the core API setup and routing (GET, POST, DELETE).
- **Prisma**: Handles ORM with `.prisma` models. Migrations are applied using `prisma migrate`, and the DB connection is initialized on app startup with automatic retries every 3 seconds. Includes a utility `safeUpsertOrFindUnique` to handle race conditions in concurrent DB access—essential for distributed systems.
- **Swagger**: Generates OpenAPI documentation from `@swagger` comments inside `integrations/express/routers`.
- **Winston**: Advanced error logging to console, file, and DB through an Express middleware.

### 🧠 Services Layer

Business logic resides in the `services/` directory. Each service is class-based for easy mocking in unit tests and includes:

- A primary `*.service.ts` file as the main access point.
- A corresponding `*.utils.ts` file to break out utility functions, improving readability and testability.

There is no separate data access layer because Prisma covers that functionality.

### 🏁 Ergast Integration Logic

The following service functions handle integration with the Ergast API:

#### `getChampionBySeasons(startYear, endYear?)`

- Checks for existing champion data in the DB.
- If any season is missing, it fetches champion data using:

  ```
  {ergastRootApi}/driverStandings/1.json?limit={limit}&offset={offset}
  ```

- Stores the champion driver and constructor in the DB but skips race data to optimize initial performance.

#### `getRaceWinnersBySeason(seasonYear)`

- Checks if race data for the given season exists in the DB.
- If missing, fetches both:

  ```
  {ergastRootApi}/driverStandings/1.json?limit={limit}&offset={offset}
  {ergastRootApi}/{year}/results/1.json
  ```

- Uses this data to upsert into the DB.

Both functions use a locking utility:

```ts
getOrLockAndExecute(key, fn)
```

This ensures that concurrent calls to the same resource don’t cause conflicting writes. The first call executes while others wait and reuse the result. This is crucial for horizontally scaling in distributed environments.

### 🧰 Utility Wrappers

- **`safeUpsertOrFindUnique`**: A Prisma wrapper used in non-synchronous execution contexts. If a race condition occurs during upsert, it gracefully falls back to a DB query.

### 📄 Application Structure

- **`main.ts`**: The backend’s entry point. It sets up the server and initializes integrations. The structure is straightforward and self-explanatory.

### 🚫 Low Boilerplate

The backend avoids unnecessary boilerplate such as DTO-to-viewmodel mapping. Instead, the shared library defines query types that infer the response model. These inferred models are reused across both backend and frontend. This approach:

- Reduces redundant mapping logic.
- Ensures type safety across BE/FE.
- Catches breaking changes at build time when a query changes.

### 📦 OpenAPI Integration

If third parties consume your API, they can use the generated OpenAPI spec at:

```
/swagger.json
```

This can be used with tools like [`@openapitools/openapi-generator-cli`](https://www.npmjs.com/package/@openapitools/openapi-generator-cli) to auto-generate client SDKs or frontend integrations.

### ✅ Testing

- **Jest** is used for unit and integration testing.
- A Dockerized test DB is utilized for running tests.
- Connection string can be configured in `.env.test`.
- CI/CD (via Jenkins) automatically provisions a test DB and resets it after each run.

---

## 🖼️ Frontend – Next.js

The frontend is built using **Next.js** to leverage its full-stack capabilities and modern React features. Specifically, I’m utilizing **Incremental Static Regeneration (ISR)**, which offers a blend of static and dynamic rendering for optimal performance and flexibility.

### Why ISR?

Only the frontend is exposed to users — the backend and database are hosted on a private Docker network and are not directly accessible by the production frontend build. Because of this setup, traditional Static Site Generation (SSG) is not feasible at build time.

With ISR:
- Pages are rendered on-demand the first time they are accessed.
- Once rendered, they are cached and served statically to subsequent users.
- This results in fast load times and efficient performance while still allowing fresh data.

This hybrid approach provides the best of both worlds:
- **Speed**, since cached pages are served like traditional static content.
- **Flexibility**, as pages can be updated or added without rebuilding the entire site.

Caching behavior can be finely tuned to your application's needs, giving you complete control over how and when pages are regenerated.

---

## 📦 Monorepo Architecture
A shared library connects FE and BE:

- Shared Types & Queries:
  - Ensure type-safety between services
  - Breaks the build if data contracts mismatch
- Reduces duplication and allows early error detection in development

---

## 🧪 Jenkins – Open Source CI/CD

The monorepo comes with a pre-configured **Jenkins Docker setup** for seamless continuous integration and deployment.

### Getting Started

To start Jenkins locally, simply run:

```bash
npm run docker:jenkins:start
```

This command spins up Jenkins with a predefined job and pipeline configuration. These configurations live within the repository under:

```
docker/jenkins/config/
├── init.groovy.d/create-job.groovy  # Script to create the initial Jenkins job
├── Jenkinsfile                      # CI/CD pipeline definition
```

This setup allows for complete control over the CI/CD pipeline directly from your Git repository. You can easily customize or extend the pipeline logic as needed.

### Jenkins Pipeline Overview

The provided `Jenkinsfile` includes the following steps:

1. **Pull Latest Changes**
2. **Install Dependencies**
    - Runs `npm install`
3. **Database Setup**
    - Applies Prisma schema
    - Clears the test database
4. **Linting**
    - Lints all apps in the monorepo
5. **Building**
    - Builds all frontend and backend apps
6. **Testing**
    - Executes all unit and integration tests
7. **Deployment**
    - Applies the Prisma schema to the production database
    - Creates production containers for both frontend and backend apps
    - Runs the containers using Docker

### Optional Cloudflare Tunnel Integration

If you add the `cloud-flare-tunnel-token` to your Jenkins credentials vault, the pipeline will:

- Automatically spin up a **Cloudflare Tunnel** service
- Expose and host your frontend app from the Docker network to a custom domain configured in your Cloudflare account

This makes it easy to deploy and expose your applications securely, even from local or private environments.

---

# 🚀 How to run
## Apps
Be sure to setup the `.env` file, this is usually .gitignored but for the assessment it is included in the repo
```sh
docker compose up
```
This will spin up postgresql and prod version of BE and FE on docker container
```sh
npx nx run backend:serve
```
This runs the BE locally
```sh
npx nx run frontend:dev
```
This runs the FE locally
## Jenkins CI/CD setup
```sh
npm run docker:jenkins:start
```
after this command jenkins, test-db, prod-db and adminer containers wil spin up
* adminer is for connecting to the DB directly [http:localhost:8085](http:localhost:8085)
* jenkins UI [http:localhost:8080](http:localhost:8080)

You navigate to the jenkins UI and follow the onscreen setup which will ask for a administrator account token which will be in the logs of the jenkins docker container which you can just copy and past in. After that it allows you to create a jenkins admin user to login after that click on the option to install recommended plugins and then it will install and finalize jenkins. Then you will be navigated to the dashboard where you will find the preconfigured CI/CD for this mono repo.

For the other commands app related you can have a look at package.json the naming convension and actual command is straight forward

---

## 📌 Final Notes
This project was built with performance, type-safety, self-hostability, and developer experience in mind. While some trade-offs exist due to Docker and time constraints, the core system is robust, scalable, and production-ready with minimal cloud dependencies.