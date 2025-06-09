#Kamlesh's Project (Airbnb Clone)

This is a full-stack web application inspired by Airbnb, developed using **Node.js**, **Express.js**, **MongoDB**, and **EJS templating**. It allows users to list, search, and review vacation rentals.

## Features

- User authentication and session management
- Create, update, and delete listings
- Post reviews on listings
- Image upload with cloud storage support
- RESTful routing with middleware for route protection

## Tech Stack

- **Backend:** Node.js, Express.js
- **Frontend:** EJS, HTML, CSS
- **Database:** MongoDB (via Mongoose)
- **Other Tools:** Cloudinary for image storage, Multer for file uploads

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Kamlesh-sProject-main.git
   cd Kamlesh-sProject-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   DB_URL=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   ```

4. **Run the application:**
   ```bash
   npm start
   ```

5. Visit `http://localhost:3000` in your browser.

## Folder Structure

```
.
â”œâ”€â”€ controllers/       # Route logic
â”œâ”€â”€ models/            # Mongoose schemas
â”œâ”€â”€ public/            # Static files (CSS, images)
â”œâ”€â”€ views/             # EJS templates
â”œâ”€â”€ init/              # Database seeding
â”œâ”€â”€ app.js             # Entry point
â”œâ”€â”€ cloudConfig.js     # Cloudinary setup
â”œâ”€â”€ middlewares.js     # Custom middleware
â””â”€â”€ .env               # Environment config
```

## License

This project is for educational purposes. Feel free to use and modify it.
