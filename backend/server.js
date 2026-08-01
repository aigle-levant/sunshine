import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// In-memory Store
// Replace with MongoDB/Postgres later without changing routes.
// ---------------------------------------------------------------------------
let entries = [];

// ---------------------------------------------------------------------------
// Parsing Logic
// ---------------------------------------------------------------------------
const EXPENSE_WORDS = [
    "expense",
    "spent",
    "paid",
    "bought",
    "செலவு",
    "கட்டினேன்",
    "வாங்கினேன்",
];

const INCOME_WORDS = [
    "income",
    "sold",
    "sale",
    "received",
    "வருமானம்",
    "விற்றேன்",
    "கிடைச்சது",
];

function parseEntry(text) {
    const amountMatch = text.match(/(\d+[\d,]*)/);

    const amount = amountMatch
        ? parseInt(amountMatch[1].replace(/,/g, ""), 10)
        : null;

    const lower = text.toLowerCase();

    let type = "out";

    if (INCOME_WORDS.some((w) => lower.includes(w))) {
        type = "in";
    } else if (EXPENSE_WORDS.some((w) => lower.includes(w))) {
        type = "out";
    }

    let category = type === "in" ? "Sale" : "Expense";

    if (/electric|மின்/.test(lower)) category = "Utility";
    if (/tea|coffee|டீ/.test(lower)) category = "Refreshment";
    if (/rice|அரிசி|grocery|groceries/.test(lower))
        category = "Goods";

    return {
        amount,
        type,
        category,
    };
}

function computeSummary() {
    const income = entries
        .filter((e) => e.type === "in")
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    const expense = entries
        .filter((e) => e.type === "out")
        .reduce((sum, e) => sum + (e.amount || 0), 0);

    return {
        income,
        expense,
        balance: income - expense,
        count: entries.length,
    };
}

// ---------------------------------------------------------------------------
// Health Check
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend Running~ chillax and enjoy",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "ok",
        entries: entries.length,
    });
});

// ---------------------------------------------------------------------------
// Parse Only (Preview)
// ---------------------------------------------------------------------------
app.post("/api/process", (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({
            success: false,
            error: "text is required",
        });
    }

    res.json({
        success: true,
        data: parseEntry(text),
    });
});

// ---------------------------------------------------------------------------
// Create Entry
// ---------------------------------------------------------------------------
app.post("/api/entries", (req, res) => {
    const { text, lang } = req.body;

    if (!text || typeof text !== "string") {
        return res.status(400).json({
            success: false,
            error: "text is required",
        });
    }

    const { amount, type, category } = parseEntry(text);

    const entry = {
        id: crypto.randomUUID(),
        rawText: text,
        lang: lang === "ta" ? "ta" : "en",
        amount,
        type,
        category,
        createdAt: new Date().toISOString(),
    };

    entries.unshift(entry);

    res.status(201).json({
        success: true,
        data: entry,
    });
});

// ---------------------------------------------------------------------------
// Get Entries
// ---------------------------------------------------------------------------
app.get("/api/entries", (req, res) => {
    let result = entries;

    const { type, date } = req.query;

    if (type === "in" || type === "out") {
        result = result.filter((e) => e.type === type);
    }

    if (date) {
        result = result.filter((e) => e.createdAt.startsWith(date));
    }

    res.json({
        success: true,
        count: result.length,
        data: result,
    });
});

// ---------------------------------------------------------------------------
// Delete Entry
// ---------------------------------------------------------------------------
app.delete("/api/entries/:id", (req, res) => {
    const before = entries.length;

    entries = entries.filter((e) => e.id !== req.params.id);

    if (entries.length === before) {
        return res.status(404).json({
            success: false,
            error: "Entry not found",
        });
    }

    res.json({
        success: true,
        message: "Entry deleted",
    });
});

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
app.get("/api/summary", (req, res) => {
    res.json({
        success: true,
        data: computeSummary(),
    });
});

// ---------------------------------------------------------------------------
// Reset Entries
// ---------------------------------------------------------------------------
app.post("/api/entries/reset", (req, res) => {
    entries = [];

    res.json({
        success: true,
        message: "All entries cleared",
    });
});

// ---------------------------------------------------------------------------
// 404 Handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
});

// ---------------------------------------------------------------------------
// Global Error Handler
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        success: false,
        error: "Internal Server Error",
    });
});

// ---------------------------------------------------------------------------
// Start Server
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});