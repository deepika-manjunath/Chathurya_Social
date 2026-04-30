# MERN QR Attendance System

A full-stack attendance management application built with the MERN stack.  
It uses JWT-based authentication and QR codes for seamless attendance tracking.

## Features

- JWT Authentication (Login/Register)
- Secure API with protected routes
- Unique QR code for each user
- QR-based attendance marking via web app
- Real-time attendance recording

## Tech Stack

- Frontend: React.js
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JSON Web Token (JWT)

## Project Structure
root/<br>
├── frontend/<br>
├── server/<br>
└── README.md

## Setup

bash
# Clone repo
git clone <--repo-url-->

cd <--repo-name-->

# Install dependencies
cd server && npm install

cd ../frontend && npm install

# Environment Variables
Create .env in /server:<br>
PORT=5000<br>
MONGO_URI=your_mongo_uri<br>
JWT_SECRET=your_secret

# Run
# backend
cd server<br>
npm run dev

# frontend
cd frontend<br>
npm run dev

# QR Attendance Flow
User logs in<br>
QR code generated per user<br>
Scan via web app<br>
Attendance stored with timestamp
