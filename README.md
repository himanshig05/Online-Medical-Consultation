# Online-Medical-Consultation
### MediCare: Modernizing Medication<br>
Production Link: https://medicare-phi-three.vercel.app<br>
Demo Video Link: https://www.youtube.com/watch?v=2j2Xmqy3z3I

## Introduction

This is a comprehensive online medical consultation platform built with Next.js and Node.js/Express. Users can register as patients or doctors, search for doctors using voice-enabled search, and chat in real-time via Socket.io.

The app supports Google OAuth, dark mode, and Redis-powered search history caching. Doctors can manage patient profiles, attach downloadable media, and add or edit prescriptions. It features a voice-enabled AI chatbot with text-to-speech and word highlighting. Patients can rate and review doctors, with rating-based sorting and real-time notifications for review requests and updates.


## Features

- Seamless user authentication via Google OAuth  
- Role-based registration for patients and doctors  
- Search doctors by specialization with voice-enabled search bar  
- Real-time chat with doctors using Socket.io
  <img width="900" alt="image" src="https://github.com/user-attachments/assets/26b53618-2d28-4e8f-9460-eee823c89212" />
- Doctors can create new prescriptions and update existing ones in patient profiles
  <img width="900" alt="image" src="https://github.com/user-attachments/assets/d1dc5b4e-e306-4118-9296-c6a2d28ee258" />
- Media file attachments by doctors in patient profiles which is downloadable by patients  
- Secure data storage with MongoDB  
- Integrated medical chatbot with voice input and voice assistant
  <img width="900" alt="image" src="https://github.com/user-attachments/assets/1e7a4436-046c-4817-b96c-70cd0ae925b3" />
  - Text-to-speech with current word highlighting
    <img width="900" alt="image" src="https://github.com/user-attachments/assets/4e45fad5-7999-48b2-9b7c-38d9b22aace1" />
  - Resume and pause controls

- Dark mode enabled across the entire platform for better user experience  
- Redis-based caching implemented for faster search history suggestions
  <img width="900" alt="image" src="https://github.com/user-attachments/assets/8aad6b70-e746-4fd4-b12c-b1bef6df971d" />
 
- Patients can rate and review doctors, and average ratings are displayed
<img src="https://github.com/user-attachments/assets/12bb67eb-b6b0-4ef4-87ae-a8d61c043f20" width="900">
- Sorting option for doctors based on rating (low to high, high to low)
 <img src="https://github.com/user-attachments/assets/99df2a01-9be5-409d-b76d-a937be3e1675" width="900">
- Notification system:  
  - Doctors are notified when a patient submits a review request
  <img src="https://github.com/user-attachments/assets/20cbd22d-adcb-4de2-9c4a-a804236fac65" width="900">
  - Patients are notified when their review is accepted or rejected
   <img src="https://github.com/user-attachments/assets/f60789dd-d5ad-4fe0-b709-68eab6274f80" width="900">
  - Patients can resend review requests if rejected
- Secure payment gateway integration for seamless transactions
 


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
- Socket.io (for real-time messaging)  
- Redis (for caching and search history)  
- Google APIs (for chatbot voice functionalities)  
- Cloudinary (for storing and managing media files)
-  Docker (for containerization and deployment)


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
      REDIS_URL=your_redis_url
      CLOUDINARY_CLOUD_NAME=cloud_name
      CLOUDINARY_API_KEY=cloudinary_api_key
      CLOUDINARY_API_SECRET=cloudinary_api_secret
    - Create a .env file in the frontend folder and add:
      ```bash
      JWT_SECRET=your_jwt_secret
      GOOGLE_CLIENT_SECRET=your_google_client_secret
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_API_KEY=your_google_api_key
4. **Start the application:**

   - Run the backend server:
     ```bash
     cd backend
     npm start
     ```

   - Run the frontend app:
     ```bash
     cd frontend
     npm run dev
     ```

---

### Alternatively, Run with Docker

```bash
# Build and run the app using Docker
docker-compose up --build

5. **Access the application:** Open ```http://localhost:3000``` in your browser.

## Contributing
Feel free to fork the repo and submit pull requests. Make sure to follow coding standards and write clean, modular code.

## Contact
For any issues, feel free to reach out via GitHub Issues.
