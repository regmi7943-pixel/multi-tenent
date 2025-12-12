const fetch = require('node-fetch'); // Check if node-fetch is available or use native fetch in node 18+

const BASE_URL = 'http://localhost:5000'; // Assuming standard port or from config
// I need to check API_BASE_URL from constants/config.ts

const run = async () => {
    // 1. Login to get token
    try {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@example.com', password: 'password123' }) // Default creds from guide
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login successful, token:', token ? 'Yes' : 'No');

        if (!token) return;

        // 2. Try GET /api/orders
        console.log('Trying GET /api/orders...');
        const res1 = await fetch(`${BASE_URL}/api/orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('GET /api/orders status:', res1.status);
        if (res1.ok) {
            const data = await res1.json();
            console.log('GET /api/orders data length:', Array.isArray(data) ? data.length : 'Not array');
        }

        // 3. Try GET /api/orders/waiter (we know this failed, but confirming)
        console.log('Trying GET /api/orders/waiter...');
        const res2 = await fetch(`${BASE_URL}/api/orders/waiter`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('GET /api/orders/waiter status:', res2.status);

    } catch (e) {
        console.error('Error:', e);
    }
};

run();
