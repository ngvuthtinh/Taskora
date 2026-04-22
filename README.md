# 🚀 Taskora - Modern Collaborative Kanban System

Taskora is a high-performance, real-time Kanban board application designed to streamline project management and team collaboration. Inspired by Trello, Taskora combines a sleek, modern interface with powerful background automation and live synchronization.

![Taskora Banner](https://via.placeholder.com/1200x400?text=Taskora+Modern+Kanban+Management)

## ✨ Key Features

### 📡 Real-time Collaboration
*   **Live Sync:** Powered by **Socket.io**, all board actions (drag-and-drop, creates, deletes) are synchronized across all active users instantly.
*   **Board Rooms:** Efficient data broadcasting restricted to specific board members using Socket.io rooms.

### 🔔 Smart Notification System
*   **Activity Alerts:** Stay informed with in-app notifications for board invitations and task assignments.
*   **Live Badge:** Real-time unread notification count on the navigation bar.
*   **Deep-linking:** Click a notification to jump directly to the board and automatically open the specific task's detail modal.

### ⏰ Automated Deadline Reminders
*   **Cron Job Automation:** A server-side background task runs periodic checks for upcoming deadlines.
*   **Smart Alerts:** Automatically notifies assigned members 24 hours before a task expires.

### 🎨 Premium User Experience
*   **Rich Aesthetics:** A modern UI featuring vibrant color palettes, glassmorphism effects, and smooth animations.
*   **Card Management:** Detailed modals for labels, descriptions, due dates, and member assignments.
*   **Profile Customization:** Integrated with **Cloudinary** for high-quality, cloud-hosted user avatars.

## 🛠️ Technical Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
*   **Core:** React.js (Vite)
*   **State Management:** Hooks & Context
*   **Drag & Drop:** `@hello-pangea/dnd`
*   **Real-time:** `socket.io-client`

### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (Mongoose)
*   **Real-time:** `socket.io`
*   **Automation:** `node-cron`
*   **Cloud Storage:** Cloudinary (via Multer)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Atlas account
*   Cloudinary account

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/taskora.git
    cd taskora
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    ```
    Create a `.env` file in the `backend` folder:
    ```env
    PORT=8000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_name
    CLOUDINARY_API_KEY=your_key
    CLOUDINARY_API_SECRET=your_secret
    ```

3.  **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Run the application:**
    ```bash
    # Terminal 1 (Backend)
    cd backend
    npm run dev

    # Terminal 2 (Frontend)
    cd frontend
    npm run dev
    ```

## 📸 Screenshots

| Dashboard | Real-time Board | Task Detail |
|-----------|-----------------|-------------|
| ![Dashboard Placeholder](https://via.placeholder.com/300x200?text=Dashboard) | ![Board Placeholder](https://via.placeholder.com/300x200?text=Live+Board) | ![Modal Placeholder](https://via.placeholder.com/300x200?text=Task+Modal) |
