
import { Telegraf } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import axios from 'axios';
import { createCanvas, loadImage, registerFont } from "canvas";

registerFont("./gagalin.ttf", { family: "gagalin" })

interface LastMsg {
	message_id: number,
	type: string,

}

interface ItemsDescription {
	itemId: string,
	description: string,
	price: string
}


interface Client {
	_id: string,
	customerId: number,
	invoice: string,
	country: number,
	segmentation: number,
	cluster: number,
	avgPrice: number,
	avgQuantity: number,
	nextOrderPredicted: number,
	nextOrder: number,
	name: string,
	bestProduct: string
}

interface BestProducts {
	itemId: string,
	quantity: number,
	name?: string,
	price?: number
}
interface Segmentation {
	id: number;
	name: string,
	desc: string,
	action: string
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const items: ItemsDescription[] = require('./data/items.json');
let lastMsg: LastMsg = { message_id: 0, type: "" }

// buildImage();



const bot = new Telegraf("5074785160:AAFtjCHJQCVBaW5wuyFSwKwZ1Xlu8Mogxp0")
// const axios = new Axios();
const defaultPath = "http://localhost:3001";
bot.start(ctx => {
	ctx.reply('Bienvenido al Proyecto de Martinez y Rigotti')
})
bot.help(ctx => ctx.reply('Welcomee'))
bot.start(ctx => ctx.reply('Welcomee'))
bot.command(['menu', 'opciones'], ctx => { ctx.reply("Opciones:") })

const start = ['hola', 'buenos dias', 'ayuda', 'Hola', 'Buenos dias', ' Ayuda'];
let data: Client;
bot.hears(start, ctx => {
	if (ctx?.chat?.id) {

		bot.telegram.sendMessage(ctx.chat.id, "En que te puedo ayudar?", {

			reply_markup: {
				remove_keyboard: true,
				one_time_keyboard: true,
				inline_keyboard: [

					[{ text: "Info de un cliente", callback_data: "client" }],
					[{ text: "Info de productos", callback_data: "products" }],
					[{ text: "Cargar pedido", callback_data: "outScopeMain" }],
					[{ text: "Otras opciones", callback_data: "outScopeMain" }],
					[{ text: "Salir", callback_data: "exit" }],
				]
			}
		})
	}
})

bot.action('main', ctx => {
	if (ctx?.chat?.id) {
		bot.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message?.message_id ?? 0)

		bot.telegram.sendMessage(ctx.chat.id, "En que te puedo ayudar?", {

			reply_markup: {
				remove_keyboard: true,
				one_time_keyboard: true,
				inline_keyboard: [

					[{ text: "Info de un cliente", callback_data: "client" }],
					[{ text: "Info de productos", callback_data: "products" }],
					[{ text: "Cargar pedido", callback_data: "outScopeMain" }],
					[{ text: "Otras opciones", callback_data: "outScopeMain" }],
					[{ text: "Salir", callback_data: "exit" }],
				]
			}
		})
	}
})

bot.action('client', ctx => {
	if (ctx?.chat?.id) {
		bot.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message?.message_id ?? 0)
		const result = bot.telegram.sendMessage(ctx.chat.id, "Dime el número de cliente", {
			reply_markup: { input_field_placeholder: "Id del cliente", force_reply: true },
			entities: [{
				type: "phone_number", offset: 1, length: 44
			}]
		})
		result.then(it => lastMsg = { message_id: it.message_id, type: "getClient" }).catch(err => {
			(`Error ocurrido: ${err}!!`)
		})
	}
});
bot.action('lastOrder', ctx => {
	if (ctx?.chat?.id) {
		// bot.telegram.deleteMessage(ctx.chat.id,ctx.callbackQuery.message?.message_id ?? 0)
		// bot.telegram.sendMessage(ctx.chat.id, "El último pedido fue de $600")
		bot.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message?.message_id, "", "El último pedido fue de $600", {

			reply_markup: {
				inline_keyboard: [

					[{ text: "Volver", callback_data: "clientOptions" }],

				]
			}
		})
	}
}
);
bot.action('outScopeMain', ctx => {
	if (ctx?.chat?.id) {

		bot.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message?.message_id, "", "Característica no soportada en el PDG",  {
			reply_markup: {
				inline_keyboard: [

					[{ text: "Volver", callback_data: "main" }, { text: "Salir", callback_data: "exit" }],

				]
			}
		})
		// bot.telegram.sendMessage(ctx.chat.id, "Caracteristica no soportada en el PDG")
	}
});

bot.action('outScopeClient', ctx => {
	if (ctx?.chat?.id) {

		bot.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message?.message_id, "", "Característica no soportada en el PDG",  {
			reply_markup: {
				inline_keyboard: [

					[{ text: "Volver", callback_data: "clientOptions" }, { text: "Salir", callback_data: "exit" }],

				]
			}
		})
		// bot.telegram.sendMessage(ctx.chat.id, "Caracteristica no soportada en el PDG")
	}
});

bot.action('predictionOrder', ctx => {
	if (ctx?.chat?.id) {
		bot.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message?.message_id, "", `A travéz de una prediccíon el cliente compraria $ ${data.nextOrderPredicted}, cuando el valor real fue $ ${data.nextOrder}`, {

			reply_markup: {
				inline_keyboard: [

					[{ text: "Volver", callback_data: "clientOptions" }],

				]
			}
		})
	}
})


bot.action('topProductsByClient', async ctx => {
	if (ctx?.chat?.id) {
		// const rex = new RegExp("^'([.*])'$");
		bot.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message?.message_id ?? 0)
		const rex = /'\w+', (\d+)*/g

		const bestProductsByClient = data.bestProduct.match(rex)
		// "'post'".replaceAll("'","","gi")
		if (bestProductsByClient) {
			const bestProductsByClient2 = bestProductsByClient.map(it => { return it.split(",") })
			const imageProducts = await buildImageByClient(bestProductsByClient2, data.name)
			bot.telegram.sendPhoto(ctx.chat.id, { source: imageProducts }, {
				reply_markup: {
					inline_keyboard: [

						[{ text: "Volver", callback_data: "clientOptions" }, { text: "Cancelar", callback_data: "exit" }],

					]
				}
			})

		}

	}
});

bot.action('clientStatus', ctx => {
	if (ctx?.chat?.id) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const segmentationTable = require('./data/segmentation.json')
		const segmentationClient = searchSegmentacion(data, segmentationTable)
		bot.telegram.editMessageText(
			ctx.chat.id, ctx.callbackQuery.message?.message_id, "",
			`El cliente ${data.name} pertenece al segmento ${data.segmentation.toString()}, el cual presenta la particularidad de ${segmentationClient.desc}`,
			{
				reply_markup: {

					inline_keyboard: [
						[{ text: "Ver Acción que se puede tomar hacia el cliente", callback_data: "segmentacionAction" }],
						[{ text: "volver", callback_data: "clientOptions" },
						{ text: "Cancelar", callback_data: "exit" }
						]
					]

				}
			})
	}
});

bot.action('segmentacionAction', ctx => {
	if (ctx?.chat?.id) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const segmentationTable = require('./data/segmentation.json')
		const segmentationClient = searchSegmentacion(data, segmentationTable)
		bot.telegram.editMessageText(
			ctx.chat.id, ctx.callbackQuery.message?.message_id, "",
			`Como el cliente ${data.name} pertenece al segmento ${data.segmentation.toString()}, se puede realizar la siguiente accion, ${segmentationClient.action}`,
			{
				reply_markup: {

					inline_keyboard: [

						[{ text: "volver", callback_data: "clientOptions" },
						{ text: "Cancelar", callback_data: "exit" }
						]
					]

				}
			})
		// bot.telegram.editMessageText(ctx.chat.id,ctx.callbackQuery.message?.message_id,"", `Como el cliente ${data.name} pertenece al segmento ${data.segmentation.toString()}, se puede realizar la siguiente accion, ${segmentationClient.action}`,)
	}
});
bot.action('exit', ctx => {
	if (ctx?.chat?.id) {
		bot.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message?.message_id ?? 0)
	}
});

bot.action('products', async ctx => {
	if (ctx?.chat?.id) {
		const uri = `${defaultPath}/getProducts`;
		const result = await axios.get(uri).catch(err => err);
		if (result.data) {
			const bestProducts: BestProducts[] = result.data;

			const imageProducts = await buildImage(bestProducts)
			bot.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message?.message_id ?? 0)
			bot.telegram.sendPhoto(ctx.chat.id, { source: imageProducts },	{
				reply_markup: {

					inline_keyboard: [

						[{ text: "volver", callback_data: "main" },
						{ text: "Cancelar", callback_data: "exit" }
						]
					]

				}
			} )
		}
		else {
			if (result.response?.status === 404) {
				bot.telegram.sendMessage(ctx.chat.id, result.response.data.err, {
					parse_mode: 'HTML',
					reply_markup: {
						inline_keyboard: [
							[
								{ text: "Introducir otro cliente", callback_data: "client" },
								{ text: "Cancelar", callback_data: "exit" }
							]
						]
					}
				})
			}
			else {
				bot.telegram.editMessageText(ctx.chat.id, ctx.callbackQuery.message?.message_id, '', 'Ocurrio un error en la conexíón con la base de datos, reintentar')
			}
		}



	}
})

bot.on("message", async newMsg => {
	const response = newMsg.message as Message.TextMessage
	// bot.telegram.deleteMessage(response.chat.id,newMsg.)
	if (response.reply_to_message?.message_id == lastMsg.message_id) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		switch (lastMsg.type) {
			case "getClient": {
				bot.telegram.deleteMessage(response.chat.id, response.reply_to_message.message_id)
				bot.telegram.deleteMessage(response.chat.id, response.message_id)
				if (isNaN(Number(response.text))) {
					bot.telegram.sendMessage(newMsg.chat.id, `El cliente debe ser numerico`, {
						reply_markup: {
							inline_keyboard: [
								[{ text: "Introducir nuevamente", callback_data: "client" },

								{ text: "Cancelar", callback_data: "exit" }]
							]
						}
					})
				} else {
					const uri = `${defaultPath}/${lastMsg.type}/${response.text}`;
					const result = await axios.get(uri).catch(err => err);
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
						})
					} else {
						if (result.response?.status === 404) {
							bot.telegram.sendMessage(newMsg.chat.id, result.response.data.err, {
								reply_markup: {
									inline_keyboard: [
										[
											{ text: "Introducir otro cliente", callback_data: "client" },
											{ text: "Cancelar", callback_data: "exit" }
										]
									]
								}
							})
						}
						else {
							bot.telegram.sendMessage(newMsg.chat.id, 'Ocurrio un error en la conexíón con la base de datos, reintentar')
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

})


bot.action('clientOptions', ctx => {
	if (ctx?.chat?.id) {
		bot.telegram.deleteMessage(ctx.chat.id, ctx.callbackQuery.message?.message_id ?? 0)

		bot.telegram.sendMessage(ctx?.chat?.id, `Menu de cliente`, {
			reply_markup: {
				inline_keyboard: [
					[{ text: "Predicción próxima Compra", callback_data: "predictionOrder" }],
					[{ text: "Ver Monto del último pedido", callback_data: "lastOrder" }],
					[{ text: "Ver estado/clasificacion del cliente", callback_data: "clientStatus" }],
					[{ text: "Productos top del cliente", callback_data: "topProductsByClient" }],
					[{ text: "Estadisticas del cliente", callback_data: "outScopeClient" }],
					[{ text: "Cancelar", callback_data: "exit" }]
				]
			}
		})
	}
})




bot.launch()

async function buildImage(products: BestProducts[]): Promise<Buffer> {
	const image = await loadImage('C:/Users/Luciano/PDG/BOT/botNode/top-products.png');
	// const image = await loadImage('./top-products.png'); Probar este cambio
	const canvas = createCanvas(1080, 1920);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, 1080, 1920);

	ctx.font = '45px gagalin';
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText("Producto", 340, 330)
	ctx.fillText("Precio", 830, 330)
	ctx.fillStyle = "rgb(180,187,171)";
	let y = 490;
	const x = 830
	products.slice(0, 5).forEach((product: BestProducts) => {
		const productDescription = searchName(product);
		ctx.font = '42px gagalin';
		ctx.fillText(productDescription.description.slice(0, 18), 340, y);
		ctx.font = '45px Impact';
		ctx.fillText("$" + productDescription.price.slice(0, 5), x, y);
		y = y + 200;

	});


	return canvas.toBuffer("image/png");
}
async function buildImageByClient(products: string[][], client: string): Promise<Buffer> {
	const image = await loadImage('C:/Users/Luciano/PDG/BOT/botNode/top-products.png');
	// const image = await loadImage('./top-products.png'); probar este cambio

	const canvas = createCanvas(1080, 1920);
	const ctx = canvas.getContext('2d');
	ctx.drawImage(image, 0, 0, 1080, 1920);
	ctx.font = '55px gagalin';
	ctx.fillStyle = "rgb(217,149,22)";
	const removeAccents = client.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
	ctx.fillText(`al cliente ${removeAccents}`, 170, 210)
	ctx.font = '45px gagalin';
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillText("Producto", 340, 330)
	ctx.fillText("Precio", 830, 330)
	ctx.fillStyle = "rgb(180,187,171)";
	let y = 490;
	const x = 830
	products.slice(0, 5).forEach((product: string[]) => {
		const productToSeach = { "itemId": product[0].toString().replace("'", "").replace("'", ""), "quantity": parseInt(product[1]) }
		const productDescription = searchName(productToSeach);
		ctx.font = '42px gagalin';
		ctx.fillText(productDescription.description.slice(0, 18), 340, y);
		ctx.font = '45px Impact';
		ctx.fillText("$" + productDescription.price.slice(0, 5), x, y);
		y = y + 200;

	});


	return canvas.toBuffer("image/png");
}

const searchName = (product: BestProducts) => {
	return items.find(item => item.itemId == product.itemId) || { price: "10", description: "producto" }
}
const searchSegmentacion = (data: Client, segmentTable: Segmentation[]): Segmentation => {
	return segmentTable.find((segment: Segmentation) => segment.id == data.segmentation) || { id: 0, desc: "0", name: "0", action: "action to do" }
}