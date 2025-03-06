# Online-Medical-Consultation
### MediCare: Modernizing Medication<br>
Production Link: https://medicare-phi-three.vercel.app<br>
Demo Video Link: https://www.youtube.com/watch?v=2j2Xmqy3z3I

## Introduction
This is a full-featured online medical consultation application built using Next.js for the frontend and a Node.js/Express backend. The application allows users to register as either a patient or a doctor, find and contact doctors, and engage in real-time communication using Socket.io. Doctors can add prescriptions and update patient details.

## Features
- User authentication using Google OAuth
- Register as a patient or doctor
- Search and find doctors based on specialization
- Real-time messaging with doctors via Socket.io
- Doctors can add prescriptions for patients
- Doctors can update patient details
- Secure data handling with MongoDB
- Integrated Medical Chatbot 

## Tech Stack
### Frontend:
- Next.js
- NextAuth.js (for Google OAuth authentication)
- Fetch API (for API calls)
- Tailwind CSS (for styling)

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose for ORM)
- Socket.io for real-time messaging

## Installation and Setup
### Prerequisites:
Ensure you have the following installed:
- Node.js
- MongoDB
- npm or yarn

### Steps to Run the Project:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/iamakashrout/Online-Medical-Consultation.git
   cd Online-Medical-Consultation
2. **Install dependencies:**
   - For backend:
     ```bash
     cd backend
     npm install
   - For frontend:
     ```bash
     cd frontend
     npm install
3. **Set up environment variables:**
    - Create a .env file in the backend folder and add:
      ```bash
      MONGO_URL=your_mongodb_connection_string
      BASE_URL=https://medicare-3gxl.onrender.com
    - Create a .env file in the frontend folder and add:
      ```bash
      JWT_SECRET=your_jwt_secret
      GOOGLE_CLIENT_SECRET=your_google_client_secret
      GOOGLE_CLIENT_ID=your_google_client_id
4. **Start the application:**
    - Run the backend server:
      ```bash
      cd backend
      npm start
    - Run the frontend app:
      ```bash
      cd frontend
      npm run dev
5. **Access the application:** Open ```http://localhost:3000``` in your browser.

## Contributing
Feel free to fork the repo and submit pull requests. Make sure to follow coding standards and write clean, modular code.

## Contact
For any issues, feel free to reach out via GitHub Issues.
