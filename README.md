# 🐳 Docker Voting System Demo

This project demonstrates a **real-time course voting system** built with a microservices architecture using Docker.
Users can vote for their preferred courses, and results update live with smooth ranking animations.

---

# 🧠 Architecture Overview

Think of the system like a relay race 🏁:

1. **Vote App (Python Flask)** → receives votes
2. **Redis** → acts as a fast queue (shock absorber ⚡)
3. **Worker (Python)** → processes votes asynchronously
4. **PostgreSQL** → stores votes permanently
5. **Result App (Node.js + Socket.io)** → streams live results

### Flow:

User → Vote App → Redis → Worker → Postgres → Result App (real-time UI)

---

# 🚀 Running the Project

1️⃣ Build and start all services

```
docker compose up --build
```

2️⃣ Access the apps

- 🗳️ Voting App → http://localhost:8080
- 📊 Live Results → http://localhost:4000

3️⃣ Test the system

- Open the voting page
- Click any course
- Open the results page
- Watch the leaderboard update in real-time with smooth animations 🎯

---

# 🧪 Verify via CLI (optional)

Check worker logs:

```
docker compose logs -f worker
```

You should see:

- Worker connected to Postgres
- Worker ready, listening to Redis...
- Processed vote for course_id=1

---

# 🧠 Why This Architecture?

Instead of writing directly to the database:

- Vote App → Postgres ❌

We use:

- Vote App → Redis → Worker → Postgres ✅

Benefits:

- ⚡ Handles high traffic without slowing down
- 🧵 Asynchronous processing (non-blocking)
- 🧱 Scalable (can add more workers easily)
- 🛡️ Protects the database from overload

This pattern is widely used in real-world systems like queue-based processing in platforms such as Netflix.

---

# ✨ Features

- Real-time updates using Socket.io
- Smooth animated ranking transitions
- Queue-based architecture (Redis)
- Persistent storage (Postgres)
- Fully containerized with Docker

---

# 🛠️ Tech Stack

- Python (Flask, Worker)
- Node.js (Express + Socket.io)
- Redis
- PostgreSQL
- Docker & Docker Compose
