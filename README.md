# Sunshine

A multilingual voice-enabled business assistant application that processes natural language input to extract and manage business data (customers, orders, payments, expenses).

## Features

- **🎤 Voice Input Processing**: Convert speech to structured business data using AI
- **🌍 Multilingual Support**: Process input in English, Tamil, Hindi, and Telugu
- **📊 Comprehensive Dashboard**:
  - Overview & Analytics
  - Order Management
  - Customer Management
  - Payment Tracking
  - Business Insights
  - Marketing Tools
  - Detailed Reports
- **💰 Smart Expense Tracking**: Automatically categorize income and expenses
- **🤖 AI-Powered Extraction**: Uses Claude AI to intelligently parse business information from natural language

## Tech Stack

### Frontend

- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Router** - Client-side navigation

### Backend

- **Express.js** - Lightweight web framework
- **Claude AI SDK** - Natural language processing
- **Node.js** - JavaScript runtime

## Project Structure

```
sunshine/
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # Route pages (Home, Speak, Dashboard, etc.)
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context for state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API communication
│   │   ├── App.jsx          # Main app router
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Express API server
    ├── server.js            # Main server file
    ├── claude.js            # Claude AI integration
    ├── package.json
    └── .env                 # Environment variables
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Anthropic API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/aigle-levant/sunshine.git
cd sunshine
```

1. **Set up backend**

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```bash
ANTHROPIC_API_KEY=your_api_key_here
PORT=5000
```

1. **Set up frontend**

```bash
cd ../frontend
npm install
```

### Running the Application

**Terminal 1 - Start Backend Server**

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server**

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173` (or similar)

## API Endpoints

### Health Check

- `GET /` - Server status
- `GET /api/health` - Health check with entry count

### Process & Extract

- `POST /api/process` - Extract business data from text/speech (returns JSON preview)

### Entry Management

- `POST /api/entries` - Create a new entry
- `GET /api/entries` - Get all entries with optional filters
  - Query params: `type` (in/out), `date` (YYYY-MM-DD)
- `DELETE /api/entries/:id` - Delete an entry

### Analytics

- `GET /api/summary` - Get income/expense summary and balance

### Admin

- `POST /api/entries/reset` - Clear all entries

## Core Features

### Voice Processing

Record or input text in English, Tamil, Hindi, or Telugu to:

- Extract customer information
- Identify orders with items, quantities, and delivery dates
- Process payments
- Generate business insights

### Dashboard

Navigate different business sections:

- **Overview**: Key metrics and summary
- **Orders**: Manage customer orders
- **Customers**: Customer database
- **Payments**: Payment tracking
- **Insights**: AI-generated business insights
- **Marketing**: Marketing tools and campaigns
- **Reports**: Detailed analytics

## Language Support

The application intelligently handles:

- **English**: Full support
- **Tamil** (தமிழ்): Full support including Tamil-specific keywords
- **Hindi**: Partial support
- **Telugu**: Partial support
- **Mixed Language Input**: Seamlessly processes inputs mixing multiple languages

## Build for Production

### Frontend

```bash
cd frontend
npm run build
```

Builds optimized bundle to `frontend/dist`

### Backend

Backend runs directly with Node.js - no build step required

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or issues, please open an issue on GitHub.
