# Goal Tracker

A modern web application for defining and tracking personal goals, built with SvelteKit and Python.

## Features

- Create, update, and track personal goals with detailed information
- Categorize goals and set priorities to help with organization
- Break down goals into manageable milestones
- Track progress with visual indicators and completion percentages
- Receive automated suggestions for next steps based on goal progress
- View key statistics on the dashboard
- Filter and search goals

## Tech Stack

- **Frontend**: SvelteKit, JavaScript
- **Backend**: Python (Flask)
- **Database**: MongoDB
- **Styling**: Custom CSS with CSS variables for theming

## Getting Started

### Prerequisites

- Node.js (v16+)
- Python (v3.7+)

### Installation

1. Create docker database:
   ```
   docker-compose up --build
   ```

2. Install dependencies:
   ```
   npm install
   pip install -r backend/requirements.txt
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Start the backend server:
   ```
   npm run backend
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

- `/src` - Frontend SvelteKit application
  - `/components` - Reusable UI components
  - `/routes` - SvelteKit routes/pages
  - `/stores` - Svelte stores for state management
- `/backend` - Python Flask backend
  - `main.py` - API routes and logic

## Future Enhancements

- MongoDB integration for data persistence
- User authentication and multiple user support
- Goal sharing and collaboration features
- More sophisticated suggestion algorithm
- Export/import goals functionality
- Mobile app version

## License

MIT