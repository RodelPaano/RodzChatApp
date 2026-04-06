# DOCUMENTATION FOR CHAT-APP-BACKEND

This is the backend for a chat application built using Node.js, Express, and MongoDB. It provides RESTful APIs for user authentication, chat room management, and message handling and Friend management. the backend also integrates with Socket.IO for real-time communication between clients.

## Features

- User registration and authentication using JWT.
- MVC architecture for better code organization.
- RESTful APIs for managing users, chat rooms, messages, and friends.
- Real-time communication using Socket.IO.
- PostgreSQL database for storing user data, chat rooms, messages, and friend relationships.
- Input validation and error handling for robust API endpoints.
- Comprehensive documentation for API endpoints and usage.
- Unit tests for critical components to ensure reliability and maintainability.
- User Info API to retrieve user details and friend lists.
- Friend management APIs to handle friend requests, acceptances, and rejections. and also to retrieve friend lists and pending friend requests. and also to remove friends from the friend list. and Block and unblock users or friends.
- Chat Room Management APIs to create, retrieve, update, and delete chat rooms. and also to add or remove users from chat rooms. and also to retrieve the list of chat rooms a user is part of.
- Message Handling APIs to send, retrieve, update, and delete messages. and also to retrieve the message history of a chat room. and also to mark messages as read or unread.
- Real-time Communication using Socket.IO to enable real-time messaging and notifications between clients. and also to handle events such as user joining or leaving a chat room, and new message notifications.
- Comprehensive API Documentation to provide clear and detailed information about the available endpoints, request/response formats, and usage examples for developers integrating with the backend.
- Unit Testing to ensure the reliability and maintainability of critical components of the backend, including user authentication, chat room management, message handling, and friend management functionalities.
- Scalability and Performance Optimization to handle a large number of concurrent users and messages efficiently, using techniques such as database indexing, caching, and load balancing.****

### User Features

- User Registration: Users can create an account by providing their username, email, and password and etc.
- User Authentication: Users can log in to their accounts using their credentials and receive a JWT token for authenticated requests.
- User Info: Users can retrieve their profile information and friend lists and Chat rooms they are part of using the User Info API.
