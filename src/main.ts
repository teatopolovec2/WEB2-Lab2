import express, { Request, Response } from 'express';
import path from 'path';
import db from './database';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config()
const CIPHER_ALGORITHM = 'aes-256-ctr';

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.get('/',  function (req, res) {
    res.render('index');
});
app.post('/submitKomentar', async function (req, res) {    //pohrana komentara - uključena ranjivost (unos se ne provjerava)
    try {
        if(req.body.komentar.length > 255) res.status(400).json({ error:('Predugačak komentar.')});
        const rez = await db.createKomentar(req.body.komentar); //pohrana komentara u bazu
        if (rez.rowCount === 1) {
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});
app.post('/submitKomentarIsklj', async function (req : Request , res : Response) {   //pohrana komentara - isključena ranjivost (dezinficiran unos)
    if(req.body.komentar.length > 255) return res.status(400).json({ error:('Predugačak komentar.')});
    let komentar = req.body.komentar;
    komentar = komentar.trim();
    var sanitiziraj: { [key: string]: string }; //sanitizacija unosa
    komentar = komentar.replace(/[&<>"'`\\/{}]/g, (znak: string) => {
        sanitiziraj = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#96;',
            '\\': '&#92;',
            '/': '&#47;',
            '{': '&#123;',
            '}': '&#125;'
        };
        return sanitiziraj[znak];
    });
    try {
        const rez = await db.createKomentar(komentar); //pohrana komentara u bazu
        if (rez.rowCount === 1) {
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});
const key : string = process.env.KEY!;
app.post('/submitKarticaIsklj', async function (req, res) {    //pohrana broja kartice - isključena ranjivost (šifriran broj)
    try {
        if(req.body.kartica.length != 16) res.status(400).json({ error:('Broj kartice mora imati 16 znamenki.')});
        const sha256 = crypto.createHash('sha256');
        sha256.update(key);  //algoritam SHA-256 za hash ključa
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);
        const ciphertext = Buffer.concat([cipher.update(Buffer.from(req.body.kartica)), cipher.final()]); //šifriran broj kartice aes-256-ctr algoritmom 
        const rez = await db.createKartica(Buffer.concat([iv, ciphertext]).toString('base64')); //pohrana iv + šifriranog broja u bazu
        if (rez.rowCount === 1) {
            const sha256 = crypto.createHash('sha256');    //dešifriranje broja kartice
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

app.post('/submitKartica', async function (req, res) {    //pohrana broja kartice - uključena ranjivost (broj se pohranjuje bez šifriranja)
    try {
        if(req.body.kartica.length != 16) res.status(400).json({ error:('Broj kartice mora imati 16 znamenki.')});
        const rez = await db.createKartica(req.body.kartica);  //pohrana broja u bazu
        if (rez.rowCount === 1) {
            res.status(200).send(rez.rows[0]);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/tablica', async function (req, res) { //dohvat svih komentara
    try {
        const rez = await db.komentari();
        res.cookie('cookie', '123cookie123', { //cookie koji će biti "ukraden"
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
        res.cookie('cookie2', '123cookie123', { //cookie koji neće moći biti "ukraden" (httpOnly)
            secure: true,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
          });
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
