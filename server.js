const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const User = require("./models/user");

const app = express();
const PORT = 4000;

// ✅ Middleware cors middleware in your Express app to allow cross-origin requests
app.use(cors());
app.use(express.json());

// ✅ Serve static files  Express's built-in middleware 
app.use("/assets", express.static(path.join(__dirname, "assets")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use("/views", express.static(path.join(__dirname, "views")));

// ✅ Default route (load login.html)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/index3", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index3.html"));
});


// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/youtube-clon", {
  useNewUrlParser: true,  //more modern and flexible connection strings.
  useUnifiedTopology: true,// new unified topology engine(server monitoring, connection handling)
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Sign Up:Creates a new use
app.post("/signup", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);//201 means "Created" (a standard success status for POST requests).
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "User already exists" });
  }
});
// Login:Checks if credentials match
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  //If no user is found, it sends a 401 Unauthorized response.
//This means the credentials are incorrect.
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  res.json(user);
});

// Fetch account info:Fetches user profile
app.get("/user/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });//route parameters values -in URL path
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});
// ✅ Delete user by email
app.delete("/user/:email", async (req, res) => {
  try {//params:Retrieves values from the URL (e.g., /user/:email)
    const deletedUser = await User.findOneAndDelete({ email: req.params.email });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


//signup


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
