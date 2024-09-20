const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "username-1",
  "password": "password-1"
}];

const isValid = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}


// Check if the user with the given username and password exists
const authenticatedUser = (username, password) => {
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password

  if (!username || !password) {
    return res.status(404), json({ message: 'Error logging in' })
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: { password, username }
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const bookId = req.params.isbn
  const review = req.body.review
  let token = req.session.authorization['accessToken'];
  let username
  jwt.verify(token, "access", (err, user) => {
    username = user.data.username
  });
  const newReiew =
    {
      id: 1,
      review: review
    }
  const book = books[bookId]
  const userReviews = book.reviews[username] ? book.reviews[username] : []
  book.reviews[username]=[...userReviews, newReiew]
  return res.status(200).json({message: `The reivew for book with ISBN ${bookId} has been added`});
});

// Delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const bookId = req.params.isbn
  const review = req.body.review
  let token = req.session.authorization['accessToken'];
  let username
  jwt.verify(token, "access", (err, user) => {
    username = user.data.username
  });
  const newReiew =
    {
      id: 1,
      review: review
    }
  const book = books[bookId]
  delete book.reviews[username]
  console.log(book)

  return res.status(200).json({message: `The reivew for the ISBN ${bookId} posted by the ${username} deleted`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
