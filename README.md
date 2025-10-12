# QuickMark - Smart Attendance System

A modern web-based attendance management system with facial recognition and geofencing capabilities.

## Features

- AI-powered facial recognition for attendance
- Geofencing for location-based attendance
- Real-time camera capture with background blur
- Modern responsive UI
- Role-based access (Admin/Teacher/Student)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js with Express
- Face Detection: face-api.js
- Geolocation: Browser Geolocation API

## Installation & Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/miniproject.git
    cd miniproject
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    MONGODB_URI=your_mongodb_connection_string
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

## Project Structure

```
miniproject/
├── public/           # Static files
├── server/           # Backend code
├── components/       # Reusable UI components
└── test/            # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT