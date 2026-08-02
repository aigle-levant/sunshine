# VoiceKart AI - AI-Powered Business Assistant

A modern, multilingual voice-enabled business assistant application that intelligently processes natural language input to extract and manage business data (customers, orders, payments, expenses) and generate marketing content. Built with React 19, Express.js, and Claude AI.

## 🎯 Overview

VoiceKart AI helps small business owners and entrepreneurs manage their operations through:
- **Voice-First Interface**: Speak or type in multiple languages to instantly extract business data
- **AI-Powered Extraction**: Uses Claude AI to intelligently parse unstructured business information
- **Comprehensive Dashboard**: Manage orders, customers, payments, and view detailed analytics
- **Marketing Automation**: Generate content calendars, analyze brand presence, and create weekly marketing plans
- **Multilingual Support**: Seamlessly handle English, Tamil, Hindi, and Telugu (including mixed-language input)

---

## ✨ Key Features

### 📱 Voice Input & Processing
- Record or type business information in English, Tamil, Hindi, or Telugu
- Automatically extract structured data (customer info, orders, payments, expenses)
- Intelligent text transcription and natural language understanding
- Real-time preview of extracted data

### 📊 Business Dashboard
Comprehensive management interface with:
- **Overview** - Key metrics, balance summary, and quick stats
- **Orders** - View, manage, and track customer orders
- **Customers** - Customer database and contact management
- **Payments** - Payment tracking and transaction history
- **Business Insights** - AI-generated recommendations and analytics
- **Reports** - Detailed financial and operational reports

### 🎨 Marketing Tools
- **Content Studio** - AI-powered content generation for social media
- **Content Calendar** - Visual planning of marketing campaigns
- **Weekly Planner** - Editable table for organizing weekly content strategy
- **Brand Integration** - Connect Instagram accounts and analyze brand presence
- **Marketing Strategy** - AI-generated strategy based on business data

### 🔗 Social Media Integration
- **Instagram Analytics** - Scrape Instagram account data for brand analysis
- **Competitor Analysis** - Analyze Instagram followers, engagement, and content strategy
- **Brand Insights** - AI-powered recommendations for brand improvement

### 💰 Smart Finance Management
- **Income/Expense Tracking** - Automatically categorize financial transactions
- **Balance Summary** - Real-time financial overview
- **Expense Reports** - Detailed breakdown by category and date

---

## 🛠 Tech Stack

### Frontend
- **React 19.2.7** - Modern UI framework with hooks and concurrent rendering
- **Vite 8.1.1** - Lightning-fast build tool and dev server
- **Tailwind CSS 4.3.3** - Utility-first CSS framework for responsive design
- **Framer Motion 12.43.0** - Smooth animations and transitions
- **React Router DOM 7.18.2** - Client-side navigation and routing
- **Supabase JS 2.111.0** - Authentication and real-time database
- **Lucide React 1.27.0** - Beautiful, consistent icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express 5.2.1** - Lightweight, flexible HTTP server framework
- **Claude AI SDK 0.115.0** - Integration with Anthropic's Claude AI
- **Apify Client 2.24.0** - Web scraping for Instagram data collection
- **CORS 2.8.6** - Cross-origin resource sharing middleware
- **Dotenv 17.4.2** - Environment variable management

---

## 📁 Project Structure

```
voicekart-ai/
├── frontend/                          # React application
│   ├── src/
│   │   ├── pages/                    # Route pages
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Speak.jsx             # Voice input page
│   │   │   ├── Login.jsx & Signup.jsx # Authentication
│   │   │   ├── Dashboard.jsx         # Protected dashboard layout
│   │   │   └── NotFound.jsx          # 404 page
│   │   │
│   │   ├── components/               # Reusable React components (80+)
│   │   │   ├── voice/                # Voice recording & transcription
│   │   │   ├── dashboard/            # Dashboard widgets & charts
│   │   │   ├── marketing/            # Content calendar & planning tools
│   │   │   ├── planner/              # Weekly planner components
│   │   │   ├── home/                 # Landing page sections
│   │   │   ├── customers/            # Customer management
│   │   │   └── common/               # Navbar, footer, theme toggle
│   │   │
│   │   ├── context/                  # React context for state
│   │   │   └── ThemeContext.jsx      # Dark/light mode management
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useVoiceRecorder.js   # Voice recording
│   │   │   ├── useSpeechTranscript.js # Audio transcription
│   │   │   └── useTheme.js           # Theme management
│   │   │
│   │   ├── services/                 # API & external service clients
│   │   │   ├── api.js                # Backend communication
│   │   │   ├── auth.js               # Supabase authentication
│   │   │   ├── instagram.js          # Instagram data fetching
│   │   │   ├── contentStudio.js      # AI content generation
│   │   │   └── planner.js            # Weekly plan API calls
│   │   │
│   │   ├── App.jsx                   # Main router & route definitions
│   │   ├── main.jsx                  # React app bootstrap
│   │   └── index.css                 # Global styles
│   │
│   ├── vite.config.js               # Vite build configuration
│   ├── eslint.config.js             # Linting rules
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example                 # Example environment variables
│   └── .gitignore
│
├── backend/                          # Express API server
│   ├── server.js                    # Main Express application
│   ├── claude.js                    # Claude AI initialization
│   │
│   ├── routes/                      # API route handlers
│   │   ├── instagram.js             # Instagram scraping endpoints
│   │   └── planner.js               # Content planning endpoints
│   │
│   ├── services/                    # Business logic & external APIs
│   │   └── instagram.js             # Instagram data scraping service
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── .env.example                 # Example environment variables
│   ├── .env                         # Actual environment (git-ignored)
│   └── .gitignore
│
├── README.md                        # This file
├── IMPLEMENTATION_GUIDE.md          # Supabase setup guide
├── CODE_CHANGES.md                  # Detailed code modifications
├── CHANGES_SUMMARY.md               # Feature summary
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher (v18+ recommended)
- **npm** or **yarn** package manager
- **Anthropic API key** (from https://console.anthropic.com)
- **Apify token** (optional, for Instagram scraping)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/aigle-levant/voicekart-ai.git
cd voicekart-ai
```

#### 2. Set Up Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5000
ANTHROPIC_API_KEY=your_anthropic_api_key_here
APIFY_TOKEN=your_apify_token_here
```

Get your API keys:
- [Anthropic API Key](https://console.anthropic.com)
- [Apify Token](https://apify.com) (optional, for Instagram features)

#### 3. Set Up Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Running the Application

**Terminal 1 - Start Backend Server**

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

**Terminal 2 - Start Frontend Dev Server**

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173` (or check terminal output for the exact URL)

Visit `http://localhost:5173` in your browser to access the application.

---

## 📡 API Documentation

### Health & Status

#### `GET /`
Server status check

**Response:**
```json
{
  "message": "VoiceKart AI API Server"
}
```

#### `GET /api/health`
Health check with entry count

**Response:**
```json
{
  "status": "ok",
  "entries": 0
}
```

### Processing & Extraction

#### `POST /api/process`
Extract structured business data from text or voice input using Claude AI

**Request Body:**
```json
{
  "text": "Customer John Smith ordered 5 iPhone 15 Pro Max phones for delivery on August 15, 2024. Total payment is 80000 rupees.",
  "language": "en"
}
```

**Response:**
```json
{
  "extracted": {
    "customers": [{"name": "John Smith", ...}],
    "orders": [{"items": [{"name": "iPhone 15 Pro Max", "quantity": 5}], ...}],
    "payments": [{"amount": 80000, ...}]
  }
}
```

### Entry Management

#### `POST /api/entries`
Create a new business entry (income, expense, order, customer)

**Request Body:**
```json
{
  "type": "in|out",
  "amount": 1000,
  "category": "sales|expense",
  "description": "Product sale",
  "date": "2024-08-02"
}
```

**Response:**
```json
{
  "id": "entry_123",
  "type": "in",
  "amount": 1000,
  "category": "sales",
  "description": "Product sale",
  "date": "2024-08-02"
}
```

#### `GET /api/entries`
Retrieve all entries with optional filtering

**Query Parameters:**
- `type` (string) - Filter by type: "in" or "out"
- `date` (string) - Filter by date (YYYY-MM-DD format)

**Example:**
```
GET /api/entries?type=in&date=2024-08-02
```

**Response:**
```json
[
  {
    "id": "entry_123",
    "type": "in",
    "amount": 1000,
    "category": "sales",
    "description": "Product sale",
    "date": "2024-08-02"
  }
]
```

#### `DELETE /api/entries/:id`
Delete a specific entry

**Response:**
```json
{
  "message": "Entry deleted successfully"
}
```

### Analytics

#### `GET /api/summary`
Get income/expense summary and current balance

**Response:**
```json
{
  "totalIncome": 50000,
  "totalExpense": 20000,
  "balance": 30000,
  "entriesCount": 15
}
```

### Instagram Integration

#### `GET /api/instagram/analyze`
Analyze Instagram brand presence using Apify scraping

**Query Parameters:**
- `username` (string) - Instagram username to analyze

**Response:**
```json
{
  "username": "brand_account",
  "followers": 10500,
  "following": 350,
  "engagement": 4.2,
  "strategy": "AI-generated strategy based on follower data..."
}
```

### Weekly Planning

#### `POST /api/planner/generate`
Generate weekly content plan using Claude AI

**Request Body:**
```json
{
  "businessType": "e-commerce",
  "goals": "Increase engagement, Drive sales",
  "platforms": ["Instagram", "Twitter"]
}
```

**Response:**
```json
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "content": "Product showcase post",
      "platform": "Instagram"
    }
  ]
}
```

---

## 🌍 Language Support

VoiceKart AI intelligently handles multiple languages:

| Language | Support Level | Notes |
|----------|--------------|-------|
| **English** | ✅ Full | Complete support for all features |
| **Tamil** (தமிழ்) | ✅ Full | Tamil-specific keywords and phrases recognized |
| **Hindi** | ⚠️ Partial | Basic support, some features may be limited |
| **Telugu** | ⚠️ Partial | Basic support, some features may be limited |
| **Mixed Languages** | ✅ Full | Seamlessly processes inputs mixing multiple languages |

### Example Multilingual Usage

```
Tamil: "John Smith-க்கு 5 iPhone phone வேணும். Total 50000 rupees."
Hindi: "5 iPhone phones ka order. Total payment 50000 rupees."
English: "Customer John Smith ordered 5 iPhone phones. Total 80000 rupees."
```

---

## 🎯 Usage Workflows

### 1. Voice-to-Data Workflow
1. Navigate to **Speak** page
2. Record or type business information (in any supported language)
3. Click "Process"
4. View extracted data and confirm/edit
5. Data automatically appears in Dashboard

### 2. Marketing Content Generation
1. Go to **Marketing** → **Content Studio**
2. Input business type and content goals
3. Claude AI generates content suggestions
4. View in **Content Calendar**
5. Copy to clipboard for social media posting

### 3. Instagram Brand Analysis
1. Go to **Marketing** → **Brand Integration**
2. Enter Instagram username
3. System scrapes account data using Apify
4. Claude analyzes followers, engagement, and strategy
5. Review AI-generated brand insights and recommendations

### 4. Weekly Planning
1. Go to **Marketing** → **Weekly Planner**
2. View editable weekly content table
3. Set content for each day and platform
4. Generate AI suggestions based on business goals
5. Export or share weekly plan

---

## 🏗 Building for Production

### Frontend Build

```bash
cd voicekart-ai/frontend
npm run build
```

Creates an optimized bundle in `frontend/dist`. You can preview with:

```bash
npm run preview
```

### Backend Deployment

The backend runs directly with Node.js - no build step needed. For production:

1. Set environment variables (use `.env` file or system variables)
2. Run: `node server.js`
3. Ensure `PORT` is set and accessible

### Environment Variables Checklist

**Backend**:
- ✅ `PORT` - Server port (default: 5000)
- ✅ `ANTHROPIC_API_KEY` - Claude AI API key (required)
- ⚠️ `APIFY_TOKEN` - Instagram scraping (optional)

**Frontend**:
- ✅ `VITE_SUPABASE_URL` - Supabase project URL (optional)
- ✅ `VITE_SUPABASE_ANON_KEY` - Supabase anon key (optional)

---

## 🔐 Security & Best Practices

### Authentication
- Uses Supabase for secure user authentication
- Demo user account available for testing
- API calls require proper CORS configuration

### API Security
- All endpoints validate input before processing
- Claude AI ensures safe data extraction
- No sensitive data stored in logs

### Development
- Use `.env` files (never commit)
- Environment variables required before running
- CORS configured for localhost development

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit with clear messages: `git commit -m "Add your feature"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a Pull Request with a description of changes

### Code Style
- Frontend: Follow React best practices and ESLint rules
- Backend: Clean, modular code with comments for complex logic
- Both: Use meaningful variable/function names

---

## 📝 Documentation

Additional documentation available:

- **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Supabase authentication setup
- **[CODE_CHANGES.md](CODE_CHANGES.md)** - Detailed code modifications
- **[CHANGES_SUMMARY.md](CHANGES_SUMMARY.md)** - Summary of implemented features

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify `ANTHROPIC_API_KEY` is set in `.env`
- Run `npm install` if node_modules missing

### Frontend won't load
- Check if backend is running on port 5000
- Clear browser cache and reload
- Check browser console for error messages

### Voice recording not working
- Ensure browser has microphone permissions
- Try a different browser (Chrome/Firefox recommended)
- Check that browser supports Web Audio API

### Instagram scraping fails
- Verify `APIFY_TOKEN` is set
- Check if Instagram account is public
- Ensure API quota not exceeded

---

## 📊 Project Statistics

- **Frontend Components**: 80+ reusable React components
- **Backend Endpoints**: 10+ API routes
- **Languages Supported**: 4 (English, Tamil, Hindi, Telugu)
- **AI Model**: Claude Haiku 4.5 (optimized for speed and cost)
- **Supported Browsers**: Chrome, Firefox, Safari, Edge (latest versions)

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support & Contact

For questions, issues, or suggestions:

- **GitHub Issues**: [Open an issue](https://github.com/aigle-levant/voicekart-ai/issues)
- **Email**: aiglelevant@gmail.com

---

## 🙏 Acknowledgments

- **Anthropic** - Claude AI for intelligent data extraction
- **React Team** - React 19 framework
- **Supabase** - Authentication and database
- **Apify** - Instagram data scraping
- **Tailwind CSS** - Utility-first CSS framework

---

**Happy selling! 🌞**

For the latest features and updates, check out our [GitHub repository](https://github.com/aigle-levant/voicekart-ai).
