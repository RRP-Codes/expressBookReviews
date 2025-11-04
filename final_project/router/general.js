const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  

    let userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // Add new user to users array
    users.push({ username: username, password: password });
    return res.status(201).json({ message: "User registered successfully" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, nulls, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn]; // Assuming 'books' is an object with ISBN as keys

  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" }); // Handle case if ISBN not found
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params.author; // Get author name from request parameters
    const booksByAuthor = [];

    // Get all ISBN keys from the books object
    const bookKeys = Object.keys(books);

    // Iterate through books to find matches by author
    bookKeys.forEach((isbn) => {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    });

    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor); // Return array of books by author
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; // Get title from request parameters
    const booksByTitle = [];

    // Get all ISBN keys from the books object
    const bookKeys = Object.keys(books);

    // Iterate through books to find matches by title
    bookKeys.forEach((isbn) => {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    if (booksByTitle.length > 0) {
        return res.json(booksByTitle); // Return array of books with matching title
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;  // Get ISBN from request parameters
    const book = books[isbn];      // Access the book details from 'books' object

    if (book && book.reviews) {
        return res.json(book.reviews);  // Return the reviews object
    } else if (book) {
        return res.json({ message: "No reviews available for this book" });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
