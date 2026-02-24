const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const {Pool} = require('pg');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 4000;

const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: process.env.POSTGRES_PORT
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

io.on('connection', (socket) => {
    console.log('Client connected');
});

async function getVotes() {
    try {
        const result = await pool.query(`
            SELECT c.id,
                   c.name,
                   COUNT(v.id) ::int as votes
            FROM courses c
                     LEFT JOIN votes v ON c.id = v.course_id
            GROUP BY c.id, c.name
            ORDER BY c.id
        `);

        const rows = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            votes: Number(row.votes)
        }));

        console.log("DEBUG BACKEND:", rows);

        io.emit('results', rows);

    } catch (err) {
        console.error("DB ERROR:", err);
    }

    setTimeout(getVotes, 1000);
}

getVotes().then();

server.listen(PORT, () => {
    console.log(`Result app running on port ${PORT}`);
});