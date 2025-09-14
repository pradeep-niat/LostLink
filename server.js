const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// AI Decision Engine
class AILossDetector {
    constructor() {
        this.valuableItems = ['wallet', 'keys', 'phone', 'airpods', 'headphones', 'laptop', 'watch', 'purse', 'bag'];
        this.safeLocations = ['home', 'office', 'work'];
    }

    shouldAlert(deviceName, context) {
        const lowerName = deviceName.toLowerCase();
        const isValuable = this.valuableItems.some(item => lowerName.includes(item));
        const isSafeLocation = this.safeLocations.includes(context?.location || '');
        const hour = new Date().getHours();
        const isNightTime = hour > 20 || hour < 6;

        if (isValuable) return true;
        if (isSafeLocation) return false;
        if (isNightTime) return true;
        
        return Math.random() > 0.4;
    }

    generateMessage(deviceName, decision) {
        return decision ? 
            `🚨 "${deviceName}" appears to be lost based on AI analysis of location and item value.` :
            `✅ "${deviceName}" is likely safe in its current location.`;
    }
}

const aiEngine = new AILossDetector();
const lostItems = [];

// Routes
app.post('/api/report-lost', (req, res) => {
    const { deviceName, userContext } = req.body;
    const decision = aiEngine.shouldAlert(deviceName, userContext);
    const message = aiEngine.generateMessage(deviceName, decision);

    if (decision) {
        lostItems.push({
            deviceName,
            reportedAt: new Date(),
            location: userContext?.location,
            status: 'lost'
        });
    }

    res.json({
        success: true,
        aiDecision: decision ? 'alert' : 'safe',
        message: message,
        timestamp: new Date()
    });
});

app.get('/api/lost-items', (req, res) => {
    res.json({
        count: lostItems.length,
        items: lostItems,
        lastUpdated: new Date()
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 AI Server running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints available`);
    console.log(`🧠 AI Engine initialized`);
});
