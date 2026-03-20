const axios = require("axios");

async function borrarDatos() {
  try {
    const res = await axios.delete("http://localhost:5000/api/eliminar");
   
    console.log("Respuesta:", res.data);
  } catch (error) {
    console.error("Error borrando datos:", error.response?.data || error.message);
  }
}

borrarDatos();
