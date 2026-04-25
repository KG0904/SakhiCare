# 🌸 SakhiCare — Menstrual Health Web App

A full-stack menstrual health platform to track cycles, predict periods & ovulation, support pregnancy journeys, and provide educational resources for everyone.

---

## ✨ Features

* 📅 **Period Prediction** (default 30-day cycle, customizable)
* 🥚 **Ovulation & Fertility Window**
* 🩸 **Bleeding Duration Support** (default 5 days, user-defined)
* 🤰 **Pregnancy Mode** (week-by-week timeline, baby size, tips)
* ⚠️ **Irregular Cycle Alerts** (PCOS/PCOD/Thyroid awareness)
* 🥗 **Diet & Health Guidance**
* 💬 **Daily Motivation Quotes**
* 🔒 **Safe Sex Education**
* 👨 **Male Education Section**
* 🤖 **AI Chatbot (basic health guidance)**
* 🕵️ **Anonymous Mode (privacy-first)**

---

## 🛠️ Tech Stack

**Frontend:** React, Redux Toolkit, HTML, CSS, JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB
**Other:** JWT Auth, Bcrypt, REST APIs

---

## 📁 Project Structure

```
SakhiCare/
 ├── backend/        # Node + Express APIs
 ├── frontend/       # React app
 ├── .gitignore
 └── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/KG0904/SakhiCare.git
cd SakhiCare
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/menstrual-health
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend setup

```bash
cd frontend
npm install
npm start
```

---

## 🔗 API Endpoints 

* `POST /auth/signup`
* `POST /auth/login`
* `POST /cycle/add`
* `GET /prediction/next-period`
* `GET /prediction/ovulation`
* `POST /health/update`
* `POST /chatbot`

---

## 📸 Screenshots 

* Dashboard
* Calendar view
* Pregnancy mode
* Chatbot

---

## 🧠 Design Goals

* Supportive & inclusive
* Privacy-first
* Simple, educational UX

---

## 👩‍💻 Author

**Kritika Gaur**
