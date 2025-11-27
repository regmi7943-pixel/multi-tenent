const fetch = require('node-fetch'); // Or use built-in fetch if Node 18+

async function testRegister() {
    try {
        const response = await fetch('http://143.110.191.23:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
             
               "email": "admin@gmail.com",
  "password": "admin"
            })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (error) {
        console.error('Error:', error);
    }
}

testRegister();
