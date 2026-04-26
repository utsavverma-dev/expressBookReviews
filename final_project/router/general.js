const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Task 6 - Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username or password missing" });
  }

  if (isValid(username)) {
    return res.status(404).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered" });
});

// Task 1 - Get all books
public_users.get('/', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Task 2 - Get by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn], null, 4));
});

// Task 3 - Get by Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  let filteredBooks = {};

  Object.keys(books).forEach(key => {
    if (books[key].author.toLowerCase() === author) {
      filteredBooks[key] = books[key];
    }
  });

  return res.send(JSON.stringify(filteredBooks, null, 4));
});

// Task 4 - Get by Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  let filteredBooks = {};

  Object.keys(books).forEach(key => {
    if (books[key].title.toLowerCase() === title) {
      filteredBooks[key] = books[key];
    }
  });

  return res.send(JSON.stringify(filteredBooks, null, 4));
});

// Task 5 - Get Reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});


// =================== TASKS 10–13 (ASYNC + AXIOS) ===================

// Task 10 - Get all books async
public_users.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.send(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11 - Get by ISBN async
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.send(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching book by ISBN" });
  }
});

// Task 12 - Get by Author async
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.send(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by author" });
  }
});

// Task 13 - Get by Title async
public_users.get('/async/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.send(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books by title" });
  }
});

module.exports.general = public_users;