# Forum App

## Purpose

This web application serves as a local forum platform where users can join discussions, create and interact with posts, and follow forum topics. It is built using the MERN stack (MongoDB, Express, React, Node.js) and is designed for educational purposes.

## Features

### User Authentication
- **Sign Up/Log In:** Users can create an account or log in to access the forum. Passwords are securely hashed and stored.
- **Local Authentication Only:** This app does not include email-based features like password reset.

### User Profile
- **Basic Profile Page:** Displays minimal user info, such as a username and a list of followed forums.
- **Edit Profile:** Users can update their username or basic details.

### Forum Pages
- **Browse Forums:** Explore various forum topics available in the app.
- **Subscribe to Forums:** Users can subscribe to forums to see relevant posts in their feed.

### Posts and Comments
- **Create Posts:** Users can write and publish posts under specific forums.
- **Upvote/Downvote Posts:** Engage with posts through upvotes or downvotes.
- **Commenting:** Add comments to posts for discussions.
- **Auto-Hide/Auto-Delete:** Posts that reach a threshold of negative votes (e.g., -5) are automatically hidden or removed.

### Following System
- **Follow Users:** Basic functionality to follow other users and view their posts in the feed.

### Search and Filter
- **Search Functionality:** Search for forums, posts, or users.
- **Filter Posts:** Sort posts by most recent or most upvoted.


## Technologies Used
- **Frontend:** React (Components, State Management)
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens) for session handling
- **Styling:** CSS for responsive design

## Development Milestones
1. **Authentication System**
2. **Forum Pages and Subscriptions**
3. **Post Creation and Interaction**
4. **Follow System**
5. **Search and Filter**
6. **Responsive UI**


## How to Run the App

Follow these steps to set up and run the Forum App locally:

### Prerequisites

1. **Install Node.js and npm:**
   - Use [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) to install Node.js.
   - Run the following commands:
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
     source ~/.nvm/nvm.sh
     nvm install --lts
     ```

2. **Install Homebrew (macOS only):**
   - If you’re on macOS and encounter issues related to `icu4c`, install it via Homebrew:
     ```bash
     brew install icu4c
     brew link --force icu4c
     ```

3. **Verify Installation:**
   - Ensure `node` and `npm` are correctly installed:
     ```bash
     node -v
     npm -v
     ```

### Adding Environment Variables
1.  **Create a .env file:**

    - In the server directory, create a file named .env:
    ```bash
    touch .env
    ```
2.  **Add the following variables:**

    - Replace the placeholders with your actual configurations:
    ```makefile
    PORT=5001
    MONGO_URI=mongodb://localhost:27017/forum-app
    JWT_SECRET=<your-secret-key>
    ```

    - JWT_SECRET: This is a key used to sign JSON Web Tokens (JWTs). You can generate a secure key using the following command:
    ```bash
    openssl rand -hex 64
    ```
---

### Running the App Locally

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd 2830-forum
   ```

2. **Install Dependencies:**

Use the `make install` command to install dependencies for both the frontend and backend:

    ```bash
    make install
    ``` 

3. **Start the App:**

Use the `make start` command to run both the frontend and backend:

    ```bash
    make start
    ```



