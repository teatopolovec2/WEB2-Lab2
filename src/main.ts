import express, { Request, Response } from 'express';
import path from 'path';
import db from './database';
import crypto from 'crypto';
const CIPHER_ALGORITHM = 'aes-256-ctr';
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.get('/',  function (req, res) {
    res.render('index');
});
app.post('/submitKomentar', async function (req, res) {    
    try {
        if(req.body.komentar.length > 255) res.status(400).json({ error:('Predugačak komentar.')});
        const rez = await db.createKomentar(req.body.komentar);
        if (rez.rowCount === 1) {
            res.cookie('cookie', '123cookie123', {
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.post('/submitKomentarIsklj', [body('komentar').trim().escape()], async function (req : Request , res : Response) {   
    if(req.body.komentar.length > 255) return res.status(400).json({ error:('Predugačak komentar.')});
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 
    try {
        const rez = await db.createKomentar(req.body.komentar);
        if (rez.rowCount === 1) {
            res.cookie('cookie', '123cookie123', {
                secure: true,
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});
const createKey = (): string => {
    const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&/()=?^"!|[]{}*+-:.;,_@#<>';
    return str.split('').sort(() => Math.random() - 0.5).join('');
};
const key = createKey();
app.post('/submitKarticaIsklj', async function (req, res) {    
    try {
        if(req.body.kartica.length < 16) res.status(400).json({ error:('Broj kartice mora imati 16 znamenki.')});
        const sha256 = crypto.createHash('sha256');
        sha256.update(key);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);
        const ciphertext = Buffer.concat([cipher.update(Buffer.from(req.body.kartica)), cipher.final()]);
        const rez = await db.createKartica(Buffer.concat([iv, ciphertext]).toString('base64'));
        if (rez.rowCount === 1) {
            const sha256 = crypto.createHash('sha256');
            sha256.update(key);
            const input = Buffer.from(rez.rows[0].brojkartice, 'base64');
            const iv = input.slice(0, 16);
            const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);
            const ciphertext = input.slice(16);
            const decryptedText = decipher.update(ciphertext) + decipher.final('utf8');
            rez.rows[0].desifrirano = decryptedText;
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/submitKartica', async function (req, res) {    
    try {
        if(req.body.kartica.length < 16) res.status(400).json({ error:('Broj kartice mora imati 16 znamenki.')});
        const rez = await db.createKartica(req.body.kartica);
        if (rez.rowCount === 1) {
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/tablica', async function (req, res) {
    try {
        const rez = await db.komentari();
        res.status(200).send(rez.rows);
    } catch (error) {
        res.status(500).send(error.message);
    }
});



const hostname = '127.0.0.1';
const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;


if (externalUrl) {
    const hostname = '0.0.0.0';
    db.createTable()
    .then(() => {
        app.listen(port, hostname, () => {
            console.log(`Server locally running at http://${hostname}:${port}/`);
        });
    })
    .catch(() => {
        process.exit(1);
    });
}
else {
    db.createTable()
    .then(() => {
        app.listen(port, hostname, () => {
            console.log(`Server locally running at http://${hostname}:${port}/`);
        });
    })
    .catch(() => {
        process.exit(1);
    });
};
