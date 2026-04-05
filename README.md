# Text Converter

A full-stack text-to-speech application that lets authenticated users convert pasted text or uploaded documents into MP3 audio, then manage generated outputs through a conversion history dashboard.

## Project Overview

Text Converter is built as a **FastAPI backend + React (Vite) frontend** system with JWT-based authentication, persistent conversion history, file text extraction, and pluggable TTS provider support.

At a high level, users can:
- Sign up / log in.
- Convert plain text to audio.
- Upload supported documents (`.txt`, `.docx`, `.pdf`) and convert extracted text to audio.
- Stream, download, review, and delete past conversion outputs.

---

## Features

- **User Authentication**
  - Signup, login, current-user lookup (`/auth/me`), and JWT-protected APIs.
- **Text-to-Audio Conversion**
  - Converts typed/pasted text into generated MP3 files.
- **File Upload Conversion**
  - Extracts text from supported files and synthesizes speech.
- **Conversion History**
  - List, view details, delete, and regenerate previous conversions.
- **Audio Delivery**
  - Backend serves generated files through download endpoints.
- **Pluggable TTS Provider Layer**
  - Provider factory and abstraction currently support Edge TTS and OpenAI TTS.
- **Synchronous-by-default Processing**
  - Endpoints support synchronous conversion with extensibility for async/background execution.

---

## Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** for API framework
- **Uvicorn** for ASGI server
- **SQLAlchemy** for ORM / persistence
- **SQLite** (default) for local database
- **Pydantic + pydantic-settings** for schema/configuration
- **passlib + python-jose** for password hashing and JWT handling
- **edge-tts** and optional **OpenAI Python SDK** for TTS providers
- **python-docx** and **pypdf** for file text extraction

### Frontend
- **React 18**
- **Vite**
- **React Router**
- **Tailwind CSS**

---

## Supported File Types

The upload flow currently supports:
- `.txt`
- `.docx`
- `.pdf`

Any other extension is rejected by backend validation.

---

## TTS Engine Architecture

The TTS subsystem is organized around a provider abstraction so you can switch engines without changing API-level conversion logic.

### Components
- **`TTSProvider` base interface**
  - Defines provider contract (`synthesize_chunk`, `list_voices`).
- **Provider implementations**
  - `EdgeTTSProvider` (`edge-tts`)
  - `OpenAITTSProvider` (`openai-tts`)
- **Provider factory**
  - Resolves configured provider name (`tts_provider`) to concrete implementation.
- **`TextToSpeechService`**
  - Cleans text, splits long inputs into chunks, synthesizes each chunk, and writes combined MP3 output.
- **Runtime async helper**
  - Bridges async provider calls into service endpoints.

### Provider Selection
Configured via backend settings:
- `tts_provider=edge-tts` (default)
- `tts_provider=openai-tts` (requires `OPENAI_API_KEY`)

---

## Folder Structure

```text
text-converter/
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ router.py
│  │  │  └─ v1/
│  │  │     ├─ api.py
│  │  │     └─ endpoints/
│  │  │        ├─ auth.py
│  │  │        ├─ conversion.py
│  │  │        ├─ health.py
│  │  │        └─ history.py
│  │  ├─ core/
│  │  │  ├─ config.py
│  │  │  └─ security.py
│  │  ├─ db/
│  │  │  ├─ base.py
│  │  │  ├─ init_db.py
│  │  │  └─ session.py
│  │  ├─ deps/
│  │  │  └─ auth.py
│  │  ├─ models/
│  │  │  ├─ conversion.py
│  │  │  ├─ saved_voice_preference.py
│  │  │  └─ user.py
│  │  ├─ schemas/
│  │  │  ├─ auth.py
│  │  │  ├─ conversion.py
│  │  │  ├─ history.py
│  │  │  └─ user.py
│  │  ├─ services/
│  │  │  ├─ auth_service.py
│  │  │  ├─ conversion_service.py
│  │  │  └─ history_service.py
│  │  ├─ tts/
│  │  │  ├─ base.py
│  │  │  ├─ factory.py
│  │  │  ├─ runtime.py
│  │  │  ├─ service.py
│  │  │  └─ providers/
│  │  │     ├─ edge_tts_provider.py
│  │  │     └─ openai_tts_provider.py
│  │  ├─ utils/
│  │  │  └─ text_extraction.py
│  │  └─ main.py
│  ├─ requirements.txt
│  └─ run.py
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ context/
│  │  ├─ hooks/
│  │  ├─ pages/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ package.json
│  ├─ tailwind.config.js
│  └─ vite.config.js
└─ README.md
```

---

## Backend Setup

### 1) Create and activate a virtual environment

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

### 2) Install dependencies

```bash
pip install -r requirements.txt
```

### 3) Configure environment variables (optional but recommended)

Create `backend/.env`:

```env
APP_NAME=Text Converter API
DEBUG=true
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8000

# Database
SQLITE_DB_FILE=text_converter.db
SQLALCHEMY_DATABASE_URI=sqlite:///./text_converter.db

# CORS
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]

# JWT
JWT_SECRET_KEY=change-me-in-production
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# TTS provider selection
TTS_PROVIDER=edge-tts
# OPENAI_API_KEY=your_key_here
# OPENAI_TTS_MODEL=gpt-4o-mini-tts

# Storage
UPLOADS_DIR=uploads
OUTPUT_DIR=outputs
```

> Notes:
> - `edge-tts` works without OpenAI credentials.
> - Set `TTS_PROVIDER=openai-tts` only when `OPENAI_API_KEY` is configured.

---

## Frontend Setup

### 1) Install dependencies

```bash
cd frontend
npm install
```

### 2) Configure API base URL

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## How to Run Backend

From `backend/`:

```bash
python run.py
```

Backend default URL:
- `http://localhost:8000`

Useful endpoints:
- OpenAPI docs: `http://localhost:8000/docs`
- Health: `GET /api/v1/health`

---

## How to Run Frontend

From `frontend/`:

```bash
npm run dev
```

Frontend default URL:
- `http://localhost:5173`

---

## Auth Flow

1. **Signup** (`POST /api/v1/auth/signup`) creates user account.
2. **Login** (`POST /api/v1/auth/login`) returns JWT access token.
3. Frontend stores token (localStorage) and sends it as `Authorization: Bearer <token>`.
4. **Current user** (`GET /api/v1/auth/me`) validates token and returns profile.
5. Protected conversion/history routes require valid JWT.

---

## Text-to-Audio Flow

1. User enters text + voice/language/speed in UI.
2. Frontend calls `POST /api/v1/conversions/text` with JWT.
3. Backend validates text and creates conversion record (`pending`).
4. Service processes conversion (`processing`) using `TextToSpeechService`.
5. Chunks are synthesized by configured provider and merged to MP3.
6. Conversion is marked `completed` and returns `output_audio_url`.
7. Frontend resolves URL, plays audio, and supports download.

---

## File-Upload-to-Audio Flow

1. User uploads `.txt`, `.docx`, or `.pdf` and selects voice settings.
2. Frontend submits `multipart/form-data` to `POST /api/v1/conversions/file`.
3. Backend validates extension and stores file under `uploads/`.
4. Text extraction utility parses file content.
5. Backend creates conversion record and runs TTS synthesis.
6. Output MP3 is saved under `outputs/` and response includes audio URL.
7. Frontend displays extracted text preview and playback/download controls.

---

## History Flow

1. Frontend calls `GET /api/v1/history` to list user conversions.
2. User can open a specific item via `GET /api/v1/history/{conversion_id}`.
3. User can delete via `DELETE /api/v1/history/{conversion_id}` (audio file removed when present).
4. User can regenerate via `POST /api/v1/history/{conversion_id}/regenerate` to create a new output from prior settings/content.

---

## Future Improvements

- Add background queue processing (Celery/RQ/Arq) for non-blocking long conversions.
- Add robust automated tests (unit/integration/e2e) and CI pipeline.
- Replace local SQLite with PostgreSQL for production workloads.
- Add role-based access and token refresh flow.
- Add pagination/sorting/filtering at API layer for history endpoints.
- Add waveform preview and richer audio controls in frontend.
- Add rate limiting, observability, and structured logging.
- Add cloud storage support (S3/GCS/Azure Blob) for generated audio and uploads.
- Add voice/language discovery in frontend from `/voices` and `/languages` APIs instead of static mock options.

---

## License

No license file is currently included in this repository. Add a `LICENSE` file before open-source distribution.
