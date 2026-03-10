const db = require("../config/db");
const enviarAlerta = require("../services/telegramService");

exports.recibirVoltaje = (req, res) => {
  const { dispositivo, voltaje, corriente } = req.body;

  let estado = "NORMAL";

  // bateria baja
  if (voltaje < 11.5) {
    estado = "BAJO";

    enviarAlerta(`⚠ BATERIA BAJA
Dispositivo: ${dispositivo}
Voltaje: ${voltaje}V
Corriente: ${corriente}A`);
  }

  // sobrecarga
  if (voltaje > 14.8) {
    estado = "SOBRECARGA";

    enviarAlerta(`⚠ SOBRECARGA
Dispositivo: ${dispositivo}
Voltaje: ${voltaje}V
Corriente: ${corriente}A`);
  }

  // insertar datos
  db.query(
    "INSERT INTO monitoreo_baterias(dispositivo,voltaje,corriente,estado) VALUES (?,?,?,?)",

    [dispositivo, voltaje, corriente, estado],

    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error guardando datos",
        });
      }

      res.json({
        mensaje: "Dato guardado",
        dispositivo,
        voltaje,
        corriente,
        estado,
      });
    },
  );
};

// obtener datos
exports.obtenerDatos = (req, res) => {
  db.query(
    "SELECT * FROM monitoreo_baterias ORDER BY fecha DESC LIMIT 100",

    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Error consultando datos",
        });
      }

      res.json(result);
    },
  );
};
