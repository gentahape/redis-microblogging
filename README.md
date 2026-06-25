# Redis Microblogging API

## Project Description
Redis Microblogging API is a backend application that serves as the foundation for a microblogging platform. It utilizes Redis as its primary data store to handle high-frequency read and write operations typically found in social networks. The application supports essential microblogging features such as user management, social connections (following/unfollowing), post creation, feed generation (including trending topics), and real-time notification streaming.

## Purpose
The primary goal of this project is to demonstrate a scalable microblogging architecture using Redis. By leveraging Redis's in-memory data structures, the application ensures fast data retrieval and efficient caching, which are crucial for real-time social media interactions, feed rendering, and notification delivery.

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building the RESTful API.
- **Redis**: In-memory data structure store used as a database and message broker.
- **dotenv**: Module to load environment variables from a `.env` file.
- **Nodemon**: Development utility that automatically restarts the server upon file changes.

## Installation

1. **Navigate to the project directory**:
   ```bash
   cd redis-microblogging
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory by copying the provided example:
   ```bash
   cp .env.example .env
   ```
   Open the `.env` file and configure the necessary variables:
   ```env
   PORT=3000
   REDIS_URL=your_redis_connection_string_here
   ```

4. **Ensure Redis is running**:
   Make sure you have a local Redis server running or provide a valid remote `REDIS_URL` in your `.env` file.

## Usage

You can start the application in two different modes based on your needs:

- **Development Mode** (uses Nodemon for hot-reloading):
  ```bash
  npm run dev
  ```

- **Production Mode**:
  ```bash
  npm run prod
  ```

By default, the server will be running on `http://localhost:3000` (or the port defined in your `.env` file).

## API Routes

The application exposes the following RESTful API endpoints:

### Users (`/api/users`)
- `POST /register` : Register a new user account.
- `GET /:user_id` : Retrieve the profile details of a specific user.
- `POST /:user_id/follow` : Follow the specified user.
- `POST /:user_id/unfollow` : Unfollow the specified user.
- `GET /:user_id/mutual/:target_id` : Retrieve the mutual connections between two users.

### Feeds (`/api/feeds`)
- `GET /trending` : Retrieve the globally trending posts or topics.
- `GET /:user_id` : Retrieve the personalized timeline/feed for a specific user.

### Posts (`/api/posts`)
- `POST /:user_id` : Create a new post for the specified user.
- `GET /:user_id` : Retrieve all posts created by the specified user.
- `DELETE /:user_id/:post_id` : Delete a specific post belonging to the user.

### Notifications (`/api/notifications`)
- `GET /stream` : Stream real-time notifications for the client.