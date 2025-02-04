# SnapURL - URL Shortener

SnapURL is a simple and efficient URL shortener that allows users to convert long URLs into short, trackable links.

## 🚀 Features
- User registration and login
- Shorten long URLs into compact links
- Track the number of times a link is clicked
- User-friendly interface
- Fast and lightweight

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS 
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (for storing URLs and tracking clicks)
- **Shortening Logic:** Custom unique identifier generation

## 📌 Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB running (or a cloud MongoDB instance)

### Steps to Run

1. Clone the repository:
   ```sh
   git clone https://github.com/muhadkeloth/snapurl.git
   ```
2. Install dependencies:
   ```sh
   cd backend
   npm install
   cd frontend
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following:
   ```env
   -backend
   PORT=5000
   JWT_SECRET
   MONGO_URI=your_mongodb_connection_string
   FRONTEND_URL=http://localhost:5000
   EMAIL_USER=emailId_for_otp
   EMAIL_PASS=email_passkey
   -frontend
   VITE_ENDPORTFRONT=backend_url
   ```
4. Start the backend server:
   ```sh
   cd backend
   npm run build
   npm run start
   ```
5. (If applicable) Start the frontend:
   ```sh
   cd frontend
   npm run build
   npm run preview
   ```

## 🎯 API Endpoints

### Shorten a URL
```http
POST /api/shortenURL
```
**Request Body:**
```json
{
  "longUrl": "https://example.com/long-url"
}
```
**Response:**
```json
{
  "url": "http://localhost:5000/abc123"
}
```

### Redirect to Original URL
```http
GET /link/:shortCode
```
Redirects to the original long URL.



## 📷 Screenshot of home page
<img width="942" alt="image" src="https://github.com/user-attachments/assets/b505eaf5-ce7f-42c9-bfca-63ed03dd9d5e" />


## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

## 🤝 Contributing
Feel free to submit pull requests or open issues to improve the project.

## 📧 Contact
For any inquiries, reach out at [muhadkeloth@gmail.com](mailto:muhadkeloth@gmail.com).

