const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.post('/api/verify-face', (req, res) => {
    const { faceData } = req.body;
    // Use AI model to compare faceData with registered student
    // For demo, always return match: true
    res.json({ match: true });
});

app.post('/api/geofence-alert', (req, res) => {
    const { student, location } = req.body;
    // Send alert to admin/incharge (demo: log to console)
    console.log(`ALERT: ${student} left geofenced area at ${location}`);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Server running on port 3000'));
