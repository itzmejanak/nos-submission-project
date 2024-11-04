// netlify/functions/fetchData.js
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    try {
        const res = await fetch("http://172.104.50.136:8080/");
        
        if (!res.ok) {
            return {
                statusCode: res.status,
                body: JSON.stringify({ error: `HTTP error! status: ${res.status}` }),
            };
        }

        const data = await res.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};