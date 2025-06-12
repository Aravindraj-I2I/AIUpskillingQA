import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://api.mail.tm';

const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
});

async function getDomain() {
    const res = await axiosInstance.get(`${BASE_URL}/domains`);
    return res.data['hydra:member'][0].domain;
}

export async function getTempEmail() {
    const domain = await getDomain();
    const username = Math.random().toString(36).substring(2, 12);
    const email = `${username}@${domain}`;
    const password = 'Test123456!';

    try {
        // Register the account (ignore if it already exists)
        await axiosInstance.post(`${BASE_URL}/accounts`, {
            address: email,
            password,
        });
    } catch (err) {
        if (err.response?.status !== 422) {
            console.error('Error creating account:', err.message);
            throw err;
        }
    }

    const tokenRes = await axiosInstance.post(`${BASE_URL}/token`, {
        address: email,
        password,
    });

    const token = tokenRes.data.token;
    console.log(" Using Mail.tm temp email:", email);
    console.log(" JWT Token:", token);

    return { email, token };
}

export async function extractVerificationCode(token) {
    const maxAttempts = 15;
    const delay = 5000;

    console.log("Using token:", token);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const res = await axiosInstance.get(`${BASE_URL}/messages`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const messages = res.data['hydra:member'];
            if (messages.length > 0) {
                const msgId = messages[0].id;
                const messageRes = await axiosInstance.get(`${BASE_URL}/messages/${msgId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const body = messageRes.data.html || messageRes.data.text || '';
                const html = Array.isArray(body) ? body.join('') : body;

                const $ = cheerio.load(html);
                let verificationCode = null;

                $('p').each((i, elem) => {
                    const paragraphText = $(elem).text().trim();
                    if (paragraphText === "Here’s the one-time verification code you requested.") {
                        const h3Elem = $(elem).next('h3');
                        if (h3Elem.length) {
                            verificationCode = h3Elem.text().trim();
                        }
                    }
                });

                if (verificationCode) {
                    console.log("Extracted verification code:", verificationCode);
                    return verificationCode;
                }
            }

            console.log(`Waiting for email... attempt ${attempt}`);
            await new Promise((r) => setTimeout(r, delay));

        } catch (error) {
            if (error.response?.status === 401) {
                console.error('Unauthorized: Invalid or expired Mail.tm token.');
                throw new Error('Unauthorized: Invalid or expired Mail.tm token.');
            }
            console.error('Error fetching verification code:', error.message);
            throw error;
        }
    }

    throw new Error('Verification code not received in time.');
}




