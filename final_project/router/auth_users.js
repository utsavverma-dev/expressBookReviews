const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];

// Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Check username & password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};


// ================= LOGIN =================
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "User successfully logged in",
      token: accessToken
    });
  } else {
    return res.status(403).json({ message: "Invalid login credentials" });
  }
});


// ================= ADD / MODIFY REVIEW =================
regd_users.put("/auth/review/:isbn", (req, res) => {

  // Check login
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  // Check book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully"
  });
});


// ================= DELETE REVIEW =================
regd_users.delete("/auth/review/:isbn", (req, res) => {

  // Check login
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  // Check book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Delete only user's review
  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully"
    });
  } else {
    return res.status(404).json({
      message: "Review not found"
    });
  }
});


// ================= EXPORTS =================
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;