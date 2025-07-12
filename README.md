#  StackIt – A Minimal Q&A Forum Platform

StackIt is a clean, modern, and fully responsive Q&A web application built with **React**, **Vite**, **Tailwind CSS**, and powered by a **Python backend** using **SQLAlchemy + SQLite**. It supports role-based functionality (Guest, User, Admin), enabling users to ask questions, post answers, upvote/downvote, and manage content efficiently.


---

## Features

- 🔒 Role-based UI (Guest, User, Admin)
- 📝 Ask and Answer Questions
- ⬆️⬇️ Upvote / Downvote Answers
- 🧭 Pagination and Breadcrumb Navigation
- ✍️ Rich Text Editor (Bold, Italic, Emojis, Lists)
- 🔍 Search & Filter Tags
- 🎨 Clean Tailwind-based UI
- ⚙️ Backend with SQLAlchemy & SQLite
- 💾 LocalStorage simulation for frontend roles
- 📱 Mobile-First Responsive Design

---

## 👥 User Roles

| Role     | Capabilities                                                                 |
|----------|-------------------------------------------------------------------------------|
| **Guest** | Can view all questions and answers. Must log in to ask, answer, or vote.     |
| **User**  | Can ask questions, answer others, and vote.                                  |
| **Admin** | Can do everything a user can, plus moderate content (edit/delete/flag).      |

---

## 🛠 Tech Stack

| Layer         | Tech Used                            | Purpose                                      |
|---------------|--------------------------------------|----------------------------------------------|
| **Frontend**  | React + Vite                         | SPA with lightning-fast dev environment      |
| **Styling**   | Tailwind CSS                         | Utility-first responsive design              |
| **Routing**   | React Router (if used)               | Page navigation (Home, Ask, Detail)          |
| **Backend**   | Python + SQLAlchemy                  | API & ORM for data handling                  |
| **Database**  | SQLite                               | Lightweight relational DB                    |
| **Editor**    | Rich Text (Quill.js / Toast UI style)| Rich content input for questions/answers     |
| **State**     | React State + LocalStorage           | Role simulation and data caching             |

---


---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/BhanuPrakashYarajarla/StackIt.git
cd StackIt
## 🚀 Getting Started
```
### 2. Install Frontend Dependencies
```bash
npm install
```
### 3. Run React App (Frontend)
```bash
npm run dev
```

### 4. Set Up and Run Backend (Python)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
---

## 👥 Contributors

| Name                        | Role              
|-----------------------------|---------------------------------|
| **Bhanu Prakash Yarajarla** | Backend Developer, Project Lead |
| **Ranesh Chandra**          | Frontend Developer              | 
| **Sree Harshini**           | UI/UX Designer                  |
| **Ankit Gandhi**            | Reviewer                        |



