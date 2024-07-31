# PolyTalk

The PolyTalk is designed to facilitate group discussions, acting as a moderator between participants. It utilizes the ChatGPT-4.0 model to generate responses and guide conversations.

## Features

- Facilitates group discussions
- Uses GPT-4.0 for response generation
- Real-time communication with WebSockets



## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (latest version)
- npm or yarn

### Installation

#### Backend

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/polyadic-chatbot.git
    cd polyadic-chatbot/backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file and add your environment variables:

    ```bash
    touch .env
    ```

    Add the following variables to the `.env` file:

    ```env
    OPENAI_API_KEY=your_openai_api_key
    MONGO_URI=your_mongodb_uri
    ```

4. Start the server:

    ```bash
    npm start
    ```

#### Frontend

1. Navigate to the frontend directory:

    ```bash
    cd ../frontend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Start the development server:

    ```bash
    npm run dev
    ```

### Running the Application

- **Backend**: `http://localhost:5000`
- **Frontend**: `http://localhost:3000`

## Deployment

### Backend

The backend is deployed on Heroku. Follow the [Heroku deployment guide](https://devcenter.heroku.com/articles/deploying-nodejs) for instructions.

### Frontend

The frontend is deployed on Netlify. Follow the [Netlify deployment guide](https://docs.netlify.com/site-deploys/create-deploys/) for instructions.

## Documentation

Refer to the following documentation for more information:

- [React.js Documentation](https://reactjs.org/docs/getting-started.html)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/en/starter/installing.html)
- [Socket.IO Documentation](https://socket.io/docs/v4)
- [OpenAI API Documentation](https://beta.openai.com/docs/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Contributing

Contributions are welcome! If you'd like to contribute to the project, feel free to fork the repository and submit a pull request with your changes.
