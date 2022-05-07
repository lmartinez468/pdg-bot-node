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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const canvas_1 = require("canvas");
const dotenv_1 = __importDefault(require("dotenv"));
const telegraf_1 = require("telegraf");
const express_1 = __importDefault(require("express"));
dotenv_1.default.config();
(0, canvas_1.registerFont)("./gagalin.ttf", { family: "gagalin" });
(0, canvas_1.registerFont)("./EraserRegular.ttf", { family: "EraserRegular" });
const app = (0, express_1.default)();
app.listen(process.env.PORT || 3000);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const items_json_1 = __importDefault(require("./data/items.json"));
const segmentation_json_1 = __importDefault(require("./data/segmentation.json"));
const isLocal = process.env.isLocal;
// "5074785160:AAFtjCHJQCVBaW5wuyFSwKwZ1Xlu8Mogxp0" bot Local
// "5305750219:AAEjbYGphn3rxCkUcDfrZfVtmgr4WXTIPbg" bot remote in heroku
const bot = isLocal ? new telegraf_1.Telegraf("5074785160:AAFtjCHJQCVBaW5wuyFSwKwZ1Xlu8Mogxp0") : new telegraf_1.Telegraf("5305750219:AAEjbYGphn3rxCkUcDfrZfVtmgr4WXTIPbg");
const defaultPath = isLocal ? "http://localhost:3001" : "https://api-node-martinez-rigotti.herokuapp.com";
let lastMsg = { message_id: 0, type: "" };
bot.start(ctx => {
    ctx.reply('Bienvenido al Proyecto de Martinez y Rigotti');
});
bot.help(ctx => ctx.reply('Welcomee'));
bot.start(ctx => ctx.reply('Welcomee'));
bot.command(['menu', 'opciones'], ctx => { ctx.reply("Opciones:"); });
const start = ['hola', 'buenos dias', 'ayuda', 'Hola', 'Buenos dias', ' Ayuda'];
let data;
bot.hears(start, ctx => {
    var _a;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.sendMessage(ctx.chat.id, "En que te puedo ayudar?", {
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                inline_keyboard: [
                    [{ text: "Info de un cliente", callback_data: "client" }],
                    [{ text: "Productos Top históricos", callback_data: "products" }],
                    [{ text: "Productos Top del mes", callback_data: "productsMonth" }],
                    [{ text: "Otras opciones", callback_data: "outScopeMain" }],
                    [{ text: "Salir", callback_data: "exit" }],
                ]
            }
        });
    }
});
bot.action('main', ctx => {
    var _a, _b, _c;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.deleteMessage(ctx.chat.id, (_c = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id) !== null && _c !== void 0 ? _c : 0);
        bot.telegram.sendMessage(ctx.chat.id, "En que te puedo ayudar?", {
            reply_markup: {
                remove_keyboard: true,
                one_time_keyboard: true,
                inline_keyboard: [
                    [{ text: "Info de un cliente", callback_data: "client" }],
                    [{ text: "Productos Top históricos", callback_data: "products" }],
                    [{ text: "Productos Top del mes", callback_data: "productsMonth" }],
                    [{ text: "Otras opciones", callback_data: "outScopeMain" }],
                    [{ text: "Salir", callback_data: "exit" }],
                ]
            }
        });
    }
});
bot.action('client', ctx => {
    var _a, _b, _c;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.deleteMessage(ctx.chat.id, (_c = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id) !== null && _c !== void 0 ? _c : 0);
        const result = bot.telegram.sendMessage(ctx.chat.id, "Dime el número de cliente", {
            reply_markup: { input_field_placeholder: "Id del cliente", force_reply: true },
            entities: [{
                    type: "phone_number", offset: 1, length: 44
                }]
        });
        result.then(it => lastMsg = { message_id: it.message_id, type: "getClient" }).catch(err => {
            (`Error ocurrido al encontrar el cliente: ${err}!!`);
        });
    }
});
bot.action('lastOrder', ctx => {
    var _a, _b;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        // bot.telegram.deleteMessage(ctx.chat.id,ctx.callbackQuery.message?.message_id ?? 0)
        // bot.telegram.sendMessage(ctx.chat.id, "El último pedido fue de $600")
        bot.telegram.editMessageText(ctx.chat.id, (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id, "", "El último pedido fue de $600", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Volver", callback_data: "clientOptions" }],
                ]
            }
        });
    }
});
bot.action('outScopeMain', ctx => {
    var _a, _b;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.editMessageText(ctx.chat.id, (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id, "", "Característica no soportada en el PDG", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Volver", callback_data: "main" }, { text: "Salir", callback_data: "exit" }],
                ]
            }
        });
    }
});
bot.action('outScopeClient', ctx => {
    var _a, _b;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.editMessageText(ctx.chat.id, (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id, "", "Característica no soportada en el PDG", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Volver", callback_data: "clientOptions" }, { text: "Salir", callback_data: "exit" }],
                ]
            }
        });
    }
});
bot.action('predictionOrder', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.deleteMessage(ctx.chat.id, (_c = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id) !== null && _c !== void 0 ? _c : 0);
        const imagePrediction = yield buildImageByPrediction(data);
        bot.telegram.sendPhoto(ctx.chat.id, { source: imagePrediction }, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "volver", callback_data: "clientOptions" },
                        { text: "Cancelar", callback_data: "exit" }
                    ]
                ]
            }
        });
    }
}));
bot.action('topProductsByClient', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    if ((_d = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _d === void 0 ? void 0 : _d.id) {
        // const rex = new RegExp("^'([.*])'$");
        bot.telegram.deleteMessage(ctx.chat.id, (_f = (_e = ctx.callbackQuery.message) === null || _e === void 0 ? void 0 : _e.message_id) !== null && _f !== void 0 ? _f : 0);
        const rex = /'\w+', (\d+)*/g;
        const bestProductsByClient = data.bestProduct.match(rex);
        // "'post'".replaceAll("'","","gi")
        if (bestProductsByClient) {
            const bestProducts = bestProductsByClient.map(it => { return it.split(","); });
            const imageProducts = yield buildImageByClient(bestProducts, data.name);
            bot.telegram.sendPhoto(ctx.chat.id, { source: imageProducts }, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Volver", callback_data: "clientOptions" }, { text: "Cancelar", callback_data: "exit" }],
                    ]
                }
            });
        }
    }
}));
bot.action('clientStatus', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j;
    if ((_g = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _g === void 0 ? void 0 : _g.id) {
        const segmentationClient = searchSegmentacion(data, segmentation_json_1.default);
        const imageClasification = yield buildImageBySegmentClient(segmentationClient, data.name);
        bot.telegram.deleteMessage(ctx.chat.id, (_j = (_h = ctx.callbackQuery.message) === null || _h === void 0 ? void 0 : _h.message_id) !== null && _j !== void 0 ? _j : 0);
        bot.telegram.sendPhoto(ctx.chat.id, { source: imageClasification }, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Ver Acción que se puede tomar hacia el cliente", callback_data: "segmentacionAction" }],
                    [{ text: "volver", callback_data: "clientOptions" },
                        { text: "Cancelar", callback_data: "exit" }
                    ]
                ]
            }
        });
    }
}));
bot.action('segmentacionAction', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _k, _l, _m;
    if ((_k = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _k === void 0 ? void 0 : _k.id) {
        const segmentationClient = searchSegmentacion(data, segmentation_json_1.default);
        const imageAction = yield buildImageByAction(segmentationClient, data.name);
        bot.telegram.deleteMessage(ctx.chat.id, (_m = (_l = ctx.callbackQuery.message) === null || _l === void 0 ? void 0 : _l.message_id) !== null && _m !== void 0 ? _m : 0);
        bot.telegram.sendPhoto(ctx.chat.id, { source: imageAction }, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "volver", callback_data: "clientOptions" },
                        { text: "Cancelar", callback_data: "exit" }
                    ]
                ]
            }
        });
    }
}));
bot.action('exit', ctx => {
    var _a, _b, _c;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.deleteMessage(ctx.chat.id, (_c = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id) !== null && _c !== void 0 ? _c : 0);
    }
});
bot.action('products', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _o, _p, _q, _r, _s;
    if ((_o = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _o === void 0 ? void 0 : _o.id) {
        const uri = `${defaultPath}/getProducts`;
        const result = yield axios_1.default.get(uri).catch(err => err);
        if (result.data) {
            const bestProducts = result.data;
            const imageProducts = yield buildImage(bestProducts, "historicamente");
            bot.telegram.deleteMessage(ctx.chat.id, (_q = (_p = ctx.callbackQuery.message) === null || _p === void 0 ? void 0 : _p.message_id) !== null && _q !== void 0 ? _q : 0);
            bot.telegram.sendPhoto(ctx.chat.id, { source: imageProducts }, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "volver", callback_data: "main" },
                            { text: "Cancelar", callback_data: "exit" }
                        ]
                    ]
                }
            });
        }
        else {
            if (((_r = result.response) === null || _r === void 0 ? void 0 : _r.status) === 404 && result.response.data.err) {
                bot.telegram.sendMessage(ctx.chat.id, result.response.data.err, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Cancelar", callback_data: "exit" }
                            ]
                        ]
                    }
                });
            }
            else {
                bot.telegram.editMessageText(ctx.chat.id, (_s = ctx.callbackQuery.message) === null || _s === void 0 ? void 0 : _s.message_id, '', 'Ocurrio un error en la conexíón con la base de datos, reintentar');
            }
        }
    }
}));
bot.action('productsMonth', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _t, _u, _v, _w, _x;
    if ((_t = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _t === void 0 ? void 0 : _t.id) {
        const uri = `${defaultPath}/getProductsMonth`;
        const result = yield axios_1.default.get(uri).catch(err => err);
        if (result.data) {
            const bestProducts = result.data;
            const imageProducts = yield buildImage(bestProducts, "DEL MES");
            bot.telegram.deleteMessage(ctx.chat.id, (_v = (_u = ctx.callbackQuery.message) === null || _u === void 0 ? void 0 : _u.message_id) !== null && _v !== void 0 ? _v : 0);
            bot.telegram.sendPhoto(ctx.chat.id, { source: imageProducts }, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "volver", callback_data: "main" },
                            { text: "Cancelar", callback_data: "exit" }
                        ]
                    ]
                }
            });
        }
        else {
            if (((_w = result.response) === null || _w === void 0 ? void 0 : _w.status) === 404 && result.response.data.err) {
                bot.telegram.sendMessage(ctx.chat.id, result.response.data.err, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Cancelar", callback_data: "exit" }
                            ]
                        ]
                    }
                });
            }
            else {
                bot.telegram.editMessageText(ctx.chat.id, (_x = ctx.callbackQuery.message) === null || _x === void 0 ? void 0 : _x.message_id, '', 'Ocurrio un error en la conexíón con la base de datos, reintentar');
            }
        }
    }
}));
bot.on("message", (newMsg) => __awaiter(void 0, void 0, void 0, function* () {
    var _y, _z;
    const response = newMsg.message;
    // bot.telegram.deleteMessage(response.chat.id,newMsg.)
    if (((_y = response.reply_to_message) === null || _y === void 0 ? void 0 : _y.message_id) == lastMsg.message_id) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        switch (lastMsg.type) {
            case "getClient":
                {
                    bot.telegram.deleteMessage(response.chat.id, response.reply_to_message.message_id);
                    bot.telegram.deleteMessage(response.chat.id, response.message_id);
                    if (isNaN(Number(response.text))) {
                        bot.telegram.sendMessage(newMsg.chat.id, `El cliente debe ser numerico`, {
                            reply_markup: {
                                inline_keyboard: [
                                    [{ text: "Introducir nuevamente", callback_data: "client" },
                                        { text: "Cancelar", callback_data: "exit" }]
                                ]
                            }
                        });
                    }
                    else {
                        const uri = `${defaultPath}/${lastMsg.type}/${response.text}`;
                        const result = yield axios_1.default.get(uri).catch(err => err);
                        if (result.data) {
                            data = result.data;
                            bot.telegram.sendMessage(newMsg.chat.id, `El cliente es ${data.name}? `, {
                                reply_markup: {
                                    inline_keyboard: [
                                        [{ text: "Sí", callback_data: "clientOptions" },
                                            { text: "No", callback_data: "client" },
                                            { text: "Cancelar", callback_data: "exit" }]
                                    ]
                                }
                            });
                        }
                        else {
                            if (((_z = result.response) === null || _z === void 0 ? void 0 : _z.status) === 404 && result.response.data.err) {
                                bot.telegram.sendMessage(newMsg.chat.id, result.response.data.err, {
                                    reply_markup: {
                                        inline_keyboard: [
                                            [
                                                { text: "Introducir otro cliente", callback_data: "client" },
                                                { text: "Cancelar", callback_data: "exit" }
                                            ]
                                        ]
                                    }
                                });
                            }
                            else {
                                bot.telegram.sendMessage(newMsg.chat.id, 'Ocurrio un error en la conexíón con la base de datos, reintentar');
                            }
                        }
                    }
                }
                break;
            case "value":
                break;
            default:
                break;
        }
    }
}));
bot.action('clientOptions', ctx => {
    var _a, _b, _c, _d;
    if ((_a = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _a === void 0 ? void 0 : _a.id) {
        bot.telegram.deleteMessage(ctx.chat.id, (_c = (_b = ctx.callbackQuery.message) === null || _b === void 0 ? void 0 : _b.message_id) !== null && _c !== void 0 ? _c : 0);
        bot.telegram.sendMessage((_d = ctx === null || ctx === void 0 ? void 0 : ctx.chat) === null || _d === void 0 ? void 0 : _d.id, `Menu de cliente`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Predicción próxima Compra", callback_data: "predictionOrder" }],
                    [{ text: "Ver Monto del último pedido", callback_data: "lastOrder" }],
                    [{ text: "Ver clasificación del cliente", callback_data: "clientStatus" }],
                    [{ text: "Productos top del cliente", callback_data: "topProductsByClient" }],
                    [{ text: "Estadisticas del cliente", callback_data: "outScopeClient" }],
                    [{ text: "Cancelar", callback_data: "exit" }]
                ]
            }
        });
    }
});
bot.launch();
function buildImage(products, title) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, canvas_1.loadImage)('./data/template/top-products.png');
        // const image = await loadImage('./top-products.png'); Probar este cambio
        const canvas = (0, canvas_1.createCanvas)(1080, 1920);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 1080, 1920);
        ctx.font = '45px gagalin';
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText("Producto", 340, 330);
        ctx.fillText("Cantidad", 830, 330);
        ctx.fillStyle = "rgb(180,187,171)";
        let y = 490;
        const x = 830;
        products.slice(0, 5).forEach((product) => {
            const productDescription = searchName(product);
            ctx.font = '42px gagalin';
            ctx.fillText(productDescription.description.slice(0, 18), 340, y);
            ctx.font = '45px Impact';
            ctx.fillText(product.quantity.toString(), x, y);
            y = y + 200;
        });
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.font = '65px gagalin';
        ctx.textAlign = 'center';
        ctx.fillText(title, 540, 180);
        return canvas.toBuffer("image/png");
    });
}
function buildImageByClient(products, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, canvas_1.loadImage)('./data/template/top-products.png');
        // const image = await loadImage('./top-products.png'); probar este cambio
        const canvas = (0, canvas_1.createCanvas)(1080, 1920);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 1080, 1920);
        ctx.font = '55px gagalin';
        ctx.fillStyle = "rgb(217,149,22)";
        const removeAccents = client.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        ctx.fillText(`al cliente ${removeAccents}`, 170, 210);
        ctx.font = '45px gagalin';
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText("Producto", 340, 330);
        ctx.fillText("Precio", 830, 330);
        ctx.fillStyle = "rgb(180,187,171)";
        let y = 490;
        const x = 830;
        products.slice(0, 5).forEach((product) => {
            const productToSeach = { "itemId": product[0].toString().replace("'", "").replace("'", ""), "quantity": parseInt(product[1]) };
            const productDescription = searchName(productToSeach);
            ctx.font = '42px gagalin';
            ctx.fillText(productDescription.description.slice(0, 18), 340, y);
            ctx.font = '45px Impact';
            ctx.fillText("$" + productDescription.price.slice(0, 5), x, y);
            y = y + 200;
        });
        return canvas.toBuffer("image/png");
    });
}
function buildImageBySegmentClient(segmentationClient, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, canvas_1.loadImage)('./data/template/Clasification.png');
        const icon = yield (0, canvas_1.loadImage)(`./data/icons/${segmentationClient.id}.png`);
        const canvas = (0, canvas_1.createCanvas)(1080, 1920);
        const x = canvas.width / 2;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 1080, 1920);
        const imageCenterX = (canvas.width - 230) / 2;
        ctx.drawImage(icon, imageCenterX, 300, 200, 230);
        ctx.font = '55px gagalin';
        ctx.fillStyle = "rgb(217,149,22)";
        const removeAccents = client.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        ctx.textAlign = 'center';
        ctx.fillText(`${removeAccents}`, x, 150);
        ctx.font = '70px gagalin';
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.textAlign = 'center';
        ctx.fillText(segmentationClient.name, x, 630);
        ctx.font = '35px gagalin';
        ctx.fillStyle = "rgb(41,99,132)";
        ctx.textAlign = 'left';
        const descriptionNormalized = segmentationClient.desc.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const description = descriptionNormalized.split(/(.{40})/).filter(O => O);
        let yTextArea = 850;
        description.forEach(chunk => {
            yTextArea = yTextArea + 100;
            ctx.fillText(chunk, 150, yTextArea, 800);
        });
        return canvas.toBuffer("image/png");
    });
}
function buildImageByAction(segmentationClient, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, canvas_1.loadImage)('./data/template/action.png');
        const icon = yield (0, canvas_1.loadImage)(`./data/icons/${segmentationClient.id}.png`);
        const canvas = (0, canvas_1.createCanvas)(1080, 1920);
        const x = canvas.width / 2;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 1080, 1920);
        ctx.drawImage(icon, 80, 250, 100, 115);
        ctx.font = '55px gagalin';
        ctx.fillStyle = "rgb(217,149,22)";
        const removeAccents = client.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        ctx.textAlign = 'center';
        ctx.fillText(`${removeAccents}`, x, 150);
        ctx.font = '70px gagalin';
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.textAlign = 'left';
        ctx.fillText(segmentationClient.name, 220, 340);
        ctx.font = '35px gagalin';
        ctx.fillStyle = "rgb(41,99,132)";
        ctx.textAlign = 'left';
        const descriptionNormalized = segmentationClient.action.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        const description = descriptionNormalized.split(/(.{40})/).filter(O => O);
        let yTextArea = 510;
        description.forEach(chunk => {
            yTextArea = yTextArea + 100;
            ctx.fillText(chunk, 150, yTextArea, 800);
        });
        return canvas.toBuffer("image/png");
    });
}
function buildImageByPrediction(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const image = yield (0, canvas_1.loadImage)('./data/template/prediction.png');
        const canvas = (0, canvas_1.createCanvas)(1080, 1920);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, 1080, 1920);
        ctx.font = '65px EraserRegular';
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fillText("PREDICCION: $" + client.nextOrderPredicted.toString().split(".")[0], 310, 740);
        ctx.fillText("REAL: $" + client.nextOrder.toString().split(".")[0], 310, 940);
        return canvas.toBuffer("image/png");
    });
}
const searchName = (product) => {
    return items_json_1.default.find(item => item.itemId == product.itemId) || { price: "10", description: "producto" };
};
const searchSegmentacion = (data, segmentTable) => {
    return segmentTable.find((segment) => segment.id == data.segmentation) || { id: 0, desc: "0", name: "0", action: "action to do" };
};
//# sourceMappingURL=index.js.map