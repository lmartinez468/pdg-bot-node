
const { Telegraf } = require('Telegraf')

const bot = new Telegraf("5074785160:AAFtjCHJQCVBaW5wuyFSwKwZ1Xlu8Mogxp0")

bot.start(ctx => {
	ctx.reply('Welcomee')
})
bot.help(ctx => ctx.reply('Welcomee'))
bot.start(ctx => ctx.reply('Welcomee'))
bot.command(['menu', 'opciones'], ctx => { ctx.reply("Opciones:") })

// bot.action('quote', ctx => {
// 	if (ctx?.chat?.id) {
// 		bot.telegram.sendMessage(ctx.chat.id, "tutu", {
// 			reply_markup: {
// 				inline_keyboard: [
// 					[
// 						{ text: "pepe", callback_data: "pepees" }
// 					]
// 				]
// 			}
// 		})
// 	}
// })
bot.launch()