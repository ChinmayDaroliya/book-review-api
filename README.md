# Book Review API

A RESTful API built with Node.js and Express for a Book Review system. This API allows users to register, add books, write reviews, and search for books.

## Features

- User authentication (JWT)
- CRUD operations for books and reviews
- Users can only review a book once
- Book search functionality
- Pagination for books and reviews

## Database Schema

### User
- `_id`: ObjectId (auto-generated)
- `name`: String, required
- `email`: String, required, unique
- `password`: String, required (stored as hashed)
- `createdAt`: Date, default: Date.now

### Book
- `_id`: ObjectId (auto-generated)
- `title`: String, required
- `author`: String, required
- `description`: String, required
- `genre`: String, enum of supported genres, required
- `publicationYear`: Number, required
- `user`: ObjectId reference to User model, required
- `createdAt`: Date, default: Date.now
- Virtual field: `reviews` - linked to Review model

### Review
- `_id`: ObjectId (auto-generated)
- `title`: String, required
- `text`: String, required
- `rating`: Number, required (1-5)
- `book`: ObjectId reference to Book model, required
- `user`: ObjectId reference to User model, required
- `createdAt`: Date, default: Date.now
- Compound index: `{book: 1, user: 1}` with `unique: true` constraint (prevents duplicate reviews)

## Setup & Installation

1. Clone the repository
```bash
git clone https://github.com/ChinmayDaroliya/book-review-api.git
cd book-review-api
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/book-review-api
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=30d
```

4. Run the server
```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register a new user
- `POST /api/v1/auth/login` - Login user and get token

### Books
- `POST /api/v1/books` - Add a new book (Auth required)
- `GET /api/v1/books` - Get all books with pagination and filters
- `GET /api/v1/books/:id` - Get book details with reviews
- `DELETE /api/v1/books/:id` - Delete a book (Auth required, only by book owner)

### Reviews
- `POST /api/v1/books/:bookId/reviews` - Add a review to a book (Auth required)
- `PUT /api/v1/reviews/:id` - Update your own review (Auth required)
- `DELETE /api/v1/reviews/:id` - Delete your own review (Auth required)

### Search
- `GET /api/v1/search?q=searchTerm` - Search books by title or author

## Example API Requests

### Register a new user
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "123456"}'
```

### Add a new book (with auth token)
```bash
curl -X POST http://localhost:5000/api/v1/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "description": "A novel about the American Dream", "genre": "Fiction", "publicationYear": 1925}'
```

### Get all books with pagination
```bash
curl -X GET "http://localhost:5000/api/v1/books?page=1&limit=10"
```

### Search for books
```bash
curl -X GET "http://localhost:5000/api/v1/search?q=gatsby"
```

### Delete a book (with auth token)
```bash
curl -X DELETE http://localhost:5000/api/v1/books/BOOK_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Design Decisions

1. **JWT Authentication**: Used for secure API access without sessions.
2. **MongoDB with Mongoose**: For flexible schema development and easy relationship handling.
3. **Middleware Pattern**: Separates authentication logic from route handlers.
4. **Virtual Population**: Books virtually populate their reviews for efficient data retrieval.
5. **Compound Index**: Ensures users can only review a book once.
6. **Pagination**: Implemented on both book listing and reviews to handle large datasets efficiently.
7. **Case-insensitive Search**: Allows flexible searching by book title or author.

## Future Improvements

- Add role-based authorization (admin, moderator, user)
- Implement book cover image uploads
- Add categories/tags for better organization
- Create user profiles with favorite books
- Add social features like commenting on reviews