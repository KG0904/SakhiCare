# 🌸 SakhiCare — Menstrual Health Web App

A full-stack menstrual health platform to track cycles, predict periods & ovulation, support pregnancy journeys, and provide educational resources for everyone.

---

## 🚀 Live Demo
🌐 **Frontend (Live App):** https://sakhi-care-t1jw.vercel.app  
⚙️ **Backend API:** https://sakhicare.onrender.com  

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

* Signup page
* <img width="1107" height="825" alt="image" src="https://github.com/user-attachments/assets/b582b16f-75d1-4366-87f9-7cc901a35a69" />
* Calendar view
* <img width="1244" height="826" alt="image" src="https://github.com/user-attachments/assets/f3ad8e20-a688-4f35-8054-dab1f4c0546e" />
* Health Modes
* <img width="1311" height="820" alt="image" src="https://github.com/user-attachments/assets/a93d9f18-1667-4dcc-a8af-7418dbc92a6f" />
* Chatbot
* <img width="1282" height="774" alt="image" src="https://github.com/user-attachments/assets/234c2c46-a8ed-48d7-b1e0-c59158fbcdaf" />



---

## 🧠 Design Goals

* Supportive & inclusive
* Privacy-first
* Simple, educational UX

---

## 👩‍💻 Author

**Kritika Gaur**
