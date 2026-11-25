const express = require("express");
const { users, posts } = require("./data.js");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.body = req.body ?? {};

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// GET ALL USERS
app.get("/users", (req, res) => {
    res.json(users);
});

// GET USER BY ID
app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});

// CREATE USER
app.post("/users", (req, res) => {
    const username  = req.body.username;

    if (!username) {
        return res.status(400).json({
            message: "Username is required"
        });
    }

    const newUser = {
        id: users.length
            ? Math.max(...users.map(u => u.id)) + 1
            : 1,
        username
    };

    users.push(newUser);

    res.status(201).json(newUser);
});

// DELETE USER
app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    users.splice(index, 1);

    res.json({
        message: "User deleted successfully"
    });
});


// ==========================
// POSTS ENDPOINTS
// ==========================

// GET ALL POSTS
app.get("/posts", (req, res) => {
    res.json(posts);
});

// GET POST BY ID
app.get("/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    res.json(post);
});

// GET POSTS BY USER ID
app.get("/users/:userId/posts", (req, res) => {
    const userId = Number(req.params.userId);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const userPosts = posts.filter(p => p.userId === userId);

    res.json(userPosts);
});

// CREATE POST
app.post("/posts", (req, res) => {
    const userId = req.body.userId;
    const content = req.body.content;

    if (!userId || !content) {
        return res.status(400).json({
            message: "userId and content are required"
        });
    }

    const user = users.find(u => u.id === Number(userId));

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const newPost = {
        id: posts.length
            ? Math.max(...posts.map(p => p.id)) + 1
            : 1,
        userId: Number(userId),
        content
    };

    posts.push(newPost);

    res.status(201).json(newPost);
});

// UPDATE POST
app.put("/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const post = posts.find(p => p.id === id);

    if (!post) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    const content = req.body.content;

    if (!content) {
        return res.status(400).json({
            message: "Content is required"
        });
    }

    post.content = content;

    res.json(post);
});

// DELETE POST
app.delete("/posts/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = posts.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Post not found"
        });
    }

    posts.splice(index, 1);

    res.json({
        message: "Post deleted successfully"
    });
});

// SEARCH POSTS
app.get("/search", (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword) {
        return res.status(400).json({
            message: "Keyword is required"
        });
    }

    const results = posts.filter(p =>
        p.content.toLowerCase().includes(keyword.toLowerCase())
    );

    res.json(results);
});


// ==========================
// START SERVER
// ==========================

const PORT = 3000;

app.listen(PORT, (err) => {
    if (err) return console.error("Failed to start:", err);
    console.log(`Server running on http://localhost:${PORT}`);
});