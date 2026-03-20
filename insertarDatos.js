const axios = require("axios");

async function insertarDatos() {
  const datos = [
    {
      dispositivo: "Panel Solar 1",
      voltaje: 12.6,
      corriente: 3.2
    },
    {
      dispositivo: "Bateria Principal",
      voltaje: 11.1,
      corriente: 2.9
    },
    {
      dispositivo: "Controlador Solar",
      voltaje: 15.0,
      corriente: 4.1
    }
  ];

  try {
    for (const dato of datos) {
      const res = await axios.post("http://localhost:5000/api/voltaje", dato);
     
      console.log("Insertado:", res.data);
    }
  } catch (error) {
    console.error("Error insertando datos:", error.response?.data || error.message);
  }
}

insertarDatos();