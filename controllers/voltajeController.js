const db = require("../config/db");
const enviarAlerta = require("../services/telegramService");

// recibir voltaje
exports.recibirVoltaje = async (req, res) => {
  const { dispositivo, voltaje, corriente } = req.body;

  let estado = "NORMAL";

  if (voltaje < 11.5) {
    estado = "BAJO";
    enviarAlerta(`⚠ BATERIA BAJA
Dispositivo: ${dispositivo}
Voltaje: ${voltaje}V
Corriente: ${corriente}A`);
  }

  if (voltaje > 14.8) {
    estado = "SOBRECARGA";
    enviarAlerta(`⚠ SOBRECARGA
Dispositivo: ${dispositivo}
Voltaje: ${voltaje}V
Corriente: ${corriente}A`);
  }

  try {
    const [result] = await db.query(
      "INSERT INTO monitoreo_baterias(dispositivo, voltaje, corriente, estado) VALUES (?, ?, ?, ?)",
      [dispositivo, voltaje, corriente, estado]
    );

    res.json({
      mensaje: "Dato guardado",
      dispositivo,
      voltaje,
      corriente,
      estado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error guardando datos" });
  }
};

// obtener datos
exports.obtenerDatos = async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT * FROM monitoreo_baterias ORDER BY fecha DESC LIMIT 100"
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error consultando datos" });
  }
};