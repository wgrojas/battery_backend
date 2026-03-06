const axios = require("axios")

const enviarAlerta = async (mensaje)=>{

try{

const url = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`

await axios.post(url,{
chat_id:process.env.TELEGRAM_CHAT,
text:mensaje
})

}catch(error){

console.log("Error enviando Telegram",error)

}

}

module.exports = enviarAlerta