# Task Management CI/CD

A simple, complete Task Management application used to demonstrate a **single CI/CD pipeline** that automatically detects whether the UI or API changed, and builds/deploys only the changed part.

## 1. Project Structure

```text
task-management-cicd/
│
├── UI/                     → React + Vite application
├── API/                    → Java Spring Boot + Maven application
├── terraform/               → Azure infrastructure (Terraform)
└── .github/workflows/       → Single GitHub Actions pipeline (pipeline.yml)
```

- **UI/** — React app. Users can view, add, complete, and delete tasks. Talks to the API via `VITE_API_URL`.
- **API/** — Spring Boot REST API with `controller/`, `model/`, `service/` packages. Stores tasks in memory (no database).
- **terraform/** — Creates an Azure Resource Group, an App Service Plan, and two App Services (UI + API). Nothing else.
- **.github/workflows/pipeline.yml** — The one and only pipeline. Detects changed folders and builds/deploys accordingly.

## 2. Application

Each task has: `id`, `title`, `description`, `completed`.

API endpoints:

| Method | Path              | Description        |
|--------|-------------------|---------------------|
| GET    | /api/tasks        | List all tasks      |
| POST   | /api/tasks        | Create a task       |
| PUT    | /api/tasks/{id}   | Update a task       |
| DELETE | /api/tasks/{id}   | Delete a task       |

## 3. Local Setup

### Run the API

```bash
cd API
mvn spring-boot:run
```

API runs at `http://localhost:8080`.

Build the API jar:

```bash
cd API
mvn clean package
```

### Run the UI

```bash
cd UI
npm install
npm run dev
```

UI runs at `http://localhost:5173`.

Copy `UI/.env.example` to `UI/.env` and set:

```text
VITE_API_URL=http://localhost:8080
```

Build the UI:

```bash
cd UI
npm run build
```

## 4. Terraform Setup

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# edit terraform.tfvars — app names must be globally unique on Azure
terraform init
terraform plan
terraform apply
```

This creates:

- 1 Resource Group
- 1 App Service Plan (Linux, shared by both apps)
- 1 App Service for the UI
- 1 App Service for the API

Outputs: `ui_app_service_name`, `api_app_service_name`, `ui_url`, `api_url`.

## 5. GitHub Actions — How the Pipeline Works

The pipeline is defined in `.github/workflows/pipeline.yml` and runs on every push to `main`.

**Jobs:**

1. `detect-changes` — uses `dorny/paths-filter` to check whether files under `UI/` and/or `API/` changed.
2. `build-ui` — runs **only** if `UI/` changed. Installs deps and runs `npm run build`.
3. `build-api` — runs **only** if `API/` changed. Runs `mvn clean package`.
4. `deploy-ui` — runs **only** if `UI/` changed **and** `build-ui` succeeded. Deploys the `UI/dist` folder to the UI App Service.
5. `deploy-api` — runs **only** if `API/` changed **and** `build-api` succeeded. Deploys the built jar to the API App Service.

`deploy-ui` never depends on `build-api`, and `deploy-api` never depends on `build-ui` — each track is fully independent.

### Scenarios

**UI change only**
```text
Build UI  → RUN     Build API  → SKIP
Deploy UI → RUN     Deploy API → SKIP
```

**API change only**
```text
Build UI  → SKIP    Build API  → RUN
Deploy UI → SKIP    Deploy API → RUN
```

**Both changed**
```text
Build UI  → RUN     Build API  → RUN
Deploy UI → RUN     Deploy API → RUN
```

## 6. Required GitHub Secrets

Configure these under **Repo Settings → Secrets and variables → Actions**:

| Secret               | Description                                                                 |
|-----------------------|-------------------------------------------------------------------------------|
| `AZURE_CREDENTIALS`   | JSON output of `az ad sp create-for-rbac --sdk-auth` (service principal with Contributor role on the resource group) |
| `AZURE_UI_APP_NAME`   | Name of the UI App Service (must match Terraform's `ui_app_name` output)     |
| `AZURE_API_APP_NAME`  | Name of the API App Service (must match Terraform's `api_app_name` output)   |
| `VITE_API_URL`        | Public URL of the deployed API (e.g. `https://task-management-api-app.azurewebsites.net`) used when building the UI |

No credentials, secrets, or subscription IDs are ever hardcoded in the source code — everything sensitive comes from GitHub Secrets and is injected into the Azure login step at run time via `azure/login`.

## 7. Acceptance Tests

1. Change any file under `UI/` and push to `main` → only Build UI and Deploy UI run.
2. Change any file under `API/` and push to `main` → only Build API and Deploy API run.
3. Change files under both `UI/` and `API/` and push to `main` → all four jobs run.
