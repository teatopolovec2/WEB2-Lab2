"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var database_1 = __importDefault(require("./database"));
var crypto_1 = __importDefault(require("crypto"));
var CIPHER_ALGORITHM = 'aes-256-ctr';
var _a = require('express-validator'), body = _a.body, validationResult = _a.validationResult;
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.set("views", path_1.default.join(__dirname, "views"));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    res.render('index');
});
app.post('/submitKomentar', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (req.body.komentar.length > 255)
                        res.status(400).json({ error: ('Predugačak komentar.') });
                    return [4 /*yield*/, database_1.default.createKomentar(req.body.komentar)];
                case 1:
                    rez = _a.sent();
                    if (rez.rowCount === 1) {
                        res.status(200).send(rez.rows[0]);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).send(error_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post('/submitKomentarIsklj', [body('komentar').trim().escape()], function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var errors, rez, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (req.body.komentar.length > 255)
                        return [2 /*return*/, res.status(400).json({ error: ('Predugačak komentar.') })];
                    errors = validationResult(req);
                    if (!errors.isEmpty()) {
                        return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, database_1.default.createKomentar(req.body.komentar)];
                case 2:
                    rez = _a.sent();
                    if (rez.rowCount === 1) {
                        ;
                        res.status(200).send(rez.rows[0]);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    res.status(500).send(error_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
var createKey = function () {
    var str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&/()=?^"!|[]{}*+-:.;,_@#<>';
    return str.split('').sort(function () { return Math.random() - 0.5; }).join('');
};
var key = createKey();
app.post('/submitKarticaIsklj', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var sha256, iv, cipher, ciphertext, rez, sha256_1, input, iv_1, decipher, ciphertext_1, decryptedText, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (req.body.kartica.length < 16)
                        res.status(400).json({ error: ('Broj kartice mora imati 16 znamenki.') });
                    sha256 = crypto_1.default.createHash('sha256');
                    sha256.update(key);
                    iv = crypto_1.default.randomBytes(16);
                    cipher = crypto_1.default.createCipheriv(CIPHER_ALGORITHM, sha256.digest(), iv);
                    ciphertext = Buffer.concat([cipher.update(Buffer.from(req.body.kartica)), cipher.final()]);
                    return [4 /*yield*/, database_1.default.createKartica(Buffer.concat([iv, ciphertext]).toString('base64'))];
                case 1:
                    rez = _a.sent();
                    if (rez.rowCount === 1) {
                        sha256_1 = crypto_1.default.createHash('sha256');
                        sha256_1.update(key);
                        input = Buffer.from(rez.rows[0].brojkartice, 'base64');
                        iv_1 = input.slice(0, 16);
                        decipher = crypto_1.default.createDecipheriv(CIPHER_ALGORITHM, sha256_1.digest(), iv_1);
                        ciphertext_1 = input.slice(16);
                        decryptedText = decipher.update(ciphertext_1) + decipher.final('utf8');
                        rez.rows[0].desifrirano = decryptedText;
                        res.status(200).send(rez.rows[0]);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(500).send(error_3.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.post('/submitKartica', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (req.body.kartica.length < 16)
                        res.status(400).json({ error: ('Broj kartice mora imati 16 znamenki.') });
                    return [4 /*yield*/, database_1.default.createKartica(req.body.kartica)];
                case 1:
                    rez = _a.sent();
                    if (rez.rowCount === 1) {
                        res.status(200).send(rez.rows[0]);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    res.status(500).send(error_4.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
app.get('/tablica', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var rez, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, database_1.default.komentari()];
                case 1:
                    rez = _a.sent();
                    res.status(200).send(rez.rows);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    res.status(500).send(error_5.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
});
var hostname = '127.0.0.1';
var externalUrl = process.env.RENDER_EXTERNAL_URL;
var port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 4080;
if (externalUrl) {
    var hostname_1 = '0.0.0.0';
    database_1.default.createTable()
        .then(function () {
        app.listen(port, hostname_1, function () {
            console.log("Server locally running at http://".concat(hostname_1, ":").concat(port, "/"));
        });
    })
        .catch(function () {
        process.exit(1);
    });
}
else {
    database_1.default.createTable()
        .then(function () {
        app.listen(port, hostname, function () {
            console.log("Server locally running at http://".concat(hostname, ":").concat(port, "/"));
        });
    })
        .catch(function () {
        process.exit(1);
    });
}
;
