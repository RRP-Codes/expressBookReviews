const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "your_secret_key";

const isValid = (username) => { 
    //write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    //write code to check if username and password match the one we have in records.
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
  const { username, password } = req.body;

    // Validate request
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        // Create JWT token
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

        // Save token in session (if using express-session)
        req.session.authorization = { accessToken: token, username };

        return res.status(200).json({ message: "User logged in successfully", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: "Review is required"});
    }
    
    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "You must be logged in to post a review" });
    }

    const username = req.session.authorization.username;

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found "});
    }
    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;
    
    return res.status(200).json({ message: `Review for ISBN ${isbn} by ${username} added/updated successfully`, reviews: book.reviews });

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Check if user is logged in
    if (!req.session.authorization || !req.session.authorization.username) {
        return res.status(403).json({ message: "You must be logged in to delete a review" });
    }

    const username = req.session.authorization.username;

    // Check if book exists
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for this book
    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "No review found by this user for this book" });
    }

    // Delete the review
    delete book.reviews[username];

    return res.status(200).json({ 
        message: `Review by ${username} for ISBN ${isbn} deleted successfully`, 
        reviews: book.reviews 
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
