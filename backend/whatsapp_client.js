const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
    }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

let isReady = false;
let qrString = '';

// QR Code event
client.on('qr', (qr) => {
    console.log('QR_CODE_GENERATED');
    qrString = qr;
    qrcode.generate(qr, { small: true });
});

// Ready event
client.on('ready', () => {
    console.log('WHATSAPP_READY');
    isReady = true;
});

// Authenticated event
client.on('authenticated', () => {
    console.log('WHATSAPP_AUTHENTICATED');
});

// Disconnected event
client.on('disconnected', (reason) => {
    console.log('WHATSAPP_DISCONNECTED:', reason);
    isReady = false;
});

// Handle command line arguments
const command = process.argv[2];

async function sendMessage(phoneNumber, message) {
    try {
        // Format: phoneNumber@c.us
        const chatId = phoneNumber + '@c.us';
        await client.sendMessage(chatId, message);
        console.log('MESSAGE_SENT_SUCCESS');
        process.exit(0);
    } catch (error) {
        console.error('MESSAGE_SEND_ERROR:', error.message);
        process.exit(1);
    }
}

function checkStatus() {
    if (isReady) {
        console.log('STATUS_READY');
        process.exit(0);
    } else {
        console.log('STATUS_NOT_READY');
        process.exit(1);
    }
}

function getQR() {
    if (qrString) {
        console.log(qrString);
        process.exit(0);
    } else {
        console.log('NO_QR_YET');
        process.exit(1);
    }
}

// Initialize client
client.initialize();

// Wait for ready state before processing commands
setTimeout(() => {
    if (command === 'send' && process.argv.length >= 5) {
        const phoneNumber = process.argv[3];
        const message = process.argv.slice(4).join(' ');
        sendMessage(phoneNumber, message);
    } else if (command === 'status') {
        checkStatus();
    } else if (command === 'qr') {
        getQR();
    } else {
        console.error('Invalid command. Use: send <phone> <message> | status | qr');
        process.exit(1);
    }
}, 5000); // Give client time to initialize
