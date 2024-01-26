// läser in konfigurationsvariabler från .env-filen
require('dotenv').config();

// importerar din server från server.js
const app = require('./server.js');

// hämtar porten från miljövariabler
const PORT = process.env.BACKEND_PORT;

// lyssnar på servern på den specificerade porten
app.listen(PORT, () => {
    console.log(`HTTP-server lyssnar på port ${PORT}`);
});
