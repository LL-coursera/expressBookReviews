const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Simulate an async operation using async/await
async function getBooks() {
  return new Promise((resolve, reject) => {
    // Simulate async operation
    setTimeout(() => {
      resolve(books);
    }, 1000); // Simulate 1-second delay
  });
}

// Route handler with async/await
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getBooks();  // Await the promise to resolve
    res.send(allBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error });
  }
});


// Simulate async operation using Promises to fetch book details by ISBN
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Book not found"));
      }
    }, 1000); // Simulate 1-second delay
  });
}

// Route handler with Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  getBookByISBN(isbn)
    .then((book) => {
      res.send(book);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});

  
// Simulate an async operation using Promises to fetch books by author
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksArray = Object.values(books);
      const filteredBooks = booksArray.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
      
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found by this author"));
      }
    }, 1000); // Simulate 1-second delay
  });
}

// Route handler with Promises
public_users.get('/author/:author', function (req, res) {
  const reqAuthor = req.params.author;

  getBooksByAuthor(reqAuthor)
    .then((filteredBooks) => {
      res.status(200).json(filteredBooks);
    })
    .catch((error) => {
      res.status(404).json({ message: error.message });
    });
});


// Simulate an async operation using async/await to fetch books by title
async function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksArray = Object.values(books);
      const filteredBooks = booksArray.filter(book => 
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 1000); // Simulate 1-second delay
  });
}

// Route handler with async/await
public_users.get('/title/:title', async function (req, res) {
  const reqTitle = req.params.title;

  try {
    const filteredBooks = await getBooksByTitle(reqTitle);
    res.status(200).json(filteredBooks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const bookId = req.params.isbn
  const data = books[bookId]
  // res.send(data)
  res.send(data.reviews)
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
