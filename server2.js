const express = require("express")
const cors = require("cors")
const axios = require("axios")

const app = express()

app.use(cors())
app.use(express.json())

const PORT = 5000

// Ruta principal
app.get("/", (req,res)=>{

res.send("API Monitor Solar funcionando")

})


// Ruta para recibir voltaje del ESP32
app.post("/api/voltaje", async (req,res)=>{

try{

const voltaje = req.body.voltaje

console.log("Voltaje recibido:", voltaje)

// Ejemplo de uso de Axios (simulación de enviar alerta)
const respuesta = await axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")

console.log("Consulta externa realizada")

res.json({
mensaje:"Voltaje recibido correctamente",
voltaje:voltaje
})

}catch(error){

console.log(error)

res.status(500).json({
error:"Error en la API"
})

}

})


app.listen(PORT,()=>{

console.log("Servidor corriendo en puerto "+PORT)

})