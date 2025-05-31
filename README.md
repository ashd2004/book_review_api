# Book Review API

## Description
A RESTful API built with Node.js, Express, MongoDB, and JWT for user authentication. This API supports book management, user reviews, and searching books.

## Setup Instructions

1. Clone the repo:
git clone <repo-url>
cd book-review-api

2. Install dependencies:
npm install

3. Create a \`.env\` file with:
PORT=3000
MONGO_URI=mongodb://localhost:27017/book_review_api
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d

4. Run the server:
npm run dev

## API Endpoints
(see full documentation in chat)

## Design Decisions
- MongoDB chosen for schema flexibility.
- One review per user per book enforced by unique index.
- JWT for stateless authentication.
- Basic pagination on lists for scalability.
