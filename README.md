
# 🎥 YouTube Clone

A **full-stack YouTube-inspired web application** built using **Node.js, Express, and MongoDB**. This project demonstrates user authentication, static video playback, and a multi-page frontend mimicking core YouTube functionality.

> ⚠️ This project is for **learning and demonstration purposes** and is not production-ready.

---

## ✨ Features

* 🔐 User Signup & Login
* 📦 MongoDB Integration with Mongoose
* 🎬 Static Video Playback
* 🖼️ Image & Video Asset Management
* 🌐 Express REST APIs
* 🧩 Multi-page Frontend (HTML/CSS/JS)

---

## 🧱 Tech Stack

**Frontend**

* HTML5
* CSS3
* JavaScript (Vanilla)

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Tools & Libraries**

* Nodemon
* CORS
* bcrypt

---

## 📂 Project Structure

```bash
youtube-clon/
├── assets/
│   ├── v.mp4
│   └── image/
│
├── models/
│   └── user.js
│
├── views/
│   ├── signup.html
│   ├── login.html
│   └── index3.html
│
├── index1.html
├── index2.html
├── video-page.html
│
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd youtube-clon
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start MongoDB

Make sure MongoDB is running locally:

```bash
mongodb://127.0.0.1:27017/youtube-clon
```

### 4️⃣ Run the Server

```bash
nodemon server.js
```

or

```bash
node server.js
```

### 5️⃣ Open in Browser

```
http://localhost:4000
```

---

## 🔗 API Endpoints

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | `/`         | Signup page       |
| GET    | `/login`    | Login page        |
| POST   | `/signup`   | Create a new user |
| POST   | `/login`    | Authenticate user |
| GET    | `/assets/*` | Static assets     |

---

## 🔐 Authentication & Security

- Password fields are masked on the client side for privacy
- User data is stored using MongoDB
- `bcrypt` is included for password encryption
- Authentication logic can be extended with hashing, salting, and JWT sessions


---

## 🚧 Limitations

* No video upload functionality
* No real-time streaming
* No user sessions or JWT authentication
* Basic frontend styling only

---

## 🚀 Future Enhancements

* ✅ Password hashing with bcrypt
* 🔐 JWT-based authentication
* ⬆️ Video upload & streaming
* 👍 Like, comment & subscribe system
* 🎨 Improved UI/UX
* 🧪 Input validation & error handling

---

## 📜 License

This project is open-source and available for **educational use**.

---

## 🙌 Acknowledgements

Inspired by YouTube’s core interface and functionality.

---

