const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    let userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// Get the full list of books
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = [];

    Object.keys(books).forEach(isbn => {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    });

    if (booksByAuthor.length > 0) {
        return res.json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = [];

    Object.keys(books).forEach(isbn => {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    if (booksByTitle.length > 0) {
        return res.json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else if (book) {
        // Book exists but no reviews
        return res.status(200).json({ message: "No reviews available for this book" });
    } else {
        // ISBN not found
        return res.status(404).json({ message: "Book not found" });
    }
});

public_users.get('/books', async (req, res) => {
    try {
        //  Promise
        const fetchBooks = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books);
                } else {
                    reject("No books found");
                }
            });
        };

        const bookList = await fetchBooks();
        return res.status(200).json(bookList);

    } catch (error) {
        return res.status(500).json({ message: error });
    }
});

public_users.get('/books-promise', (req, res) => {
    // Simulate API call with Promise
    const fetchBooks = new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    });

    fetchBooks
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Get book details by ISBN using async/await
public_users.get('/isbn-async/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const fetchBookByISBN = () => {
            return new Promise((resolve, reject) => {
                const book = books[isbn];
                if (book) {
                    resolve(book);
                } else {
                    reject("Book not found");
                }
            });
        };

        const bookDetails = await fetchBookByISBN();
        return res.status(200).json(bookDetails);

    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Get book details by ISBN using Promises
public_users.get('/isbn-promise/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    const fetchBookByISBN = new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });

    fetchBookByISBN
        .then(book => res.status(200).json(book))
        .catch(err => res.status(404).json({ message: err }));
});

// Get books by author using async/await
public_users.get('/author-async/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const fetchBooksByAuthor = () => {
            return new Promise((resolve, reject) => {
                const booksByAuthor = [];
                Object.keys(books).forEach(isbn => {
                    if (books[isbn].author === author) {
                        booksByAuthor.push(books[isbn]);
                    }
                });

                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("No books found by this author");
                }
            });
        };

        const result = await fetchBooksByAuthor();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Get books by author using Promises
public_users.get('/author-promise/:author', (req, res) => {
    const author = req.params.author;

    const fetchBooksByAuthor = new Promise((resolve, reject) => {
        const booksByAuthor = [];
        Object.keys(books).forEach(isbn => {
            if (books[isbn].author === author) {
                booksByAuthor.push(books[isbn]);
            }
        });

        if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
        } else {
            reject("No books found by this author");
        }
    });

    fetchBooksByAuthor
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json({ message: err }));
});

// Get books by title using async/await
public_users.get('/title-async/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const fetchBooksByTitle = () => {
            return new Promise((resolve, reject) => {
                const booksByTitle = [];
                Object.keys(books).forEach(isbn => {
                    if (books[isbn].title === title) {
                        booksByTitle.push(books[isbn]);
                    }
                });

                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject("No books found with this title");
                }
            });
        };

        const result = await fetchBooksByTitle();
        return res.status(200).json(result);

    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Get books by title using Promises
public_users.get('/title-promise/:title', (req, res) => {
    const title = req.params.title;

    const fetchBooksByTitle = new Promise((resolve, reject) => {
        const booksByTitle = [];
        Object.keys(books).forEach(isbn => {
            if (books[isbn].title === title) {
                booksByTitle.push(books[isbn]);
            }
        });

        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject("No books found with this title");
        }
    });

    fetchBooksByTitle
        .then(result => res.status(200).json(result))
        .catch(err => res.status(404).json({ message: err }));
});

module.exports.general = public_users;