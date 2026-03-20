const db = require("../config/db");
const enviarAlerta = require("../services/telegramService");

// ==============================
// RECIBIR VOLTAJE
// ==============================
exports.recibirVoltaje = async (req, res) => {

  // 👉 SI ABRES EN EL NAVEGADOR
  if (req.method === "GET") {
    return res.json({
      status: "OK",
      mensaje: "🚀 API activa y lista para recibir datos"
    });
  }

  const { dispositivo, voltaje, corriente } = req.body;

  let estado = "NORMAL";

  if (voltaje < 11.5) {
    estado = "BAJO";
//     enviarAlerta(`⚠ BATERIA BAJA
// Dispositivo: ${dispositivo}
// Voltaje: ${voltaje}V
// Corriente: ${corriente}A`);
  }

  if (voltaje > 14.8) {
    estado = "SOBRECARGA";
//     enviarAlerta(`⚠ SOBRECARGA
// Dispositivo: ${dispositivo}
// Voltaje: ${voltaje}V
// Corriente: ${corriente}A`);
  }


  try {
    const [result] = await db.query(
      "INSERT INTO monitoreo_baterias(dispositivo, voltaje, corriente, estado) VALUES (?, ?, ?, ?)",
      [dispositivo, voltaje, corriente, estado]
    );

    // 🔥 LOG BONITO
    console.log("\n==============================");
    console.log("📥 NUEVO DATO RECIBIDO");
    console.log("==============================");
    console.log(`📡 Dispositivo: ${dispositivo}`);
    console.log(`🔋 Voltaje: ${voltaje} V`);
    console.log(`⚡ Corriente: ${corriente} A`);
    console.log(`📊 Estado: ${estado}`);
    console.log(`🆔 ID: ${result.insertId}`);
    console.log("==============================\n");

    return res.json({
      mensaje: "Dato guardado",
      id: result.insertId,
      dispositivo,
      voltaje,
      corriente,
      estado,
    });

  } catch (err) {
    console.error("❌ Error guardando dato:", err);
    return res.status(500).json({ error: "Error guardando datos" });
  }
};

// ==============================
// OBTENER DATOS
// ==============================
// exports.obtenerDatos = async (req, res) => {
//   try {
//     const [result] = await db.query(
//       "SELECT * FROM monitoreo_baterias ORDER BY fecha DESC LIMIT 30"
//     );

//     console.log("📊 Consultando últimos 30 datos...");

//     // return res.json({
//     //   status: "OK",
//     //   mensaje: "✅ API activa",
//     //   total: result.length,
//     //   datos: result
//     // });

//   res.json(result);

//   } catch (err) {
//     console.error("❌ Error consultando datos:", err);
//    res.status(500).json({ error: "Error consultando datos" });
//   }
// };


// ==============================
// OBTENER DATOS FILTRADOS (cada 5 minutos)
// ==============================
exports.obtenerDatos = async (req, res) => {
  try {
    // Tomar solo los últimos 100 datos
    const [result] = await db.query(
      "SELECT * FROM monitoreo_baterias ORDER BY fecha DESC LIMIT 30"
    );

    // Filtrar para mostrar 1 dato cada 5 minutos (300000 ms)
    const filtrados = [];
    let lastTime = 0;

    result.reverse().forEach((dato) => { // reversa para procesar cronológicamente
      const tiempoDato = new Date(dato.fecha).getTime();
      if (tiempoDato - lastTime >= 300000 || lastTime === 0) { // 5 min
        filtrados.push(dato);
        lastTime = tiempoDato;
      }
    });

    // res.json({
    //   mensaje: "Datos filtrados cada 5 minutos",
    //   cantidadTotal: result.length,
    //   cantidadMostrada: filtrados.length,
    //   datos: filtrados.reverse(), // invertimos para mostrar del más reciente al más viejo
    // });

    res.json(filtrados.reverse())
  } catch (err) {
    console.error("❌ Error consultando datos:", err);
    res.status(500).json({ error: "Error consultando datos" });
  }
};
// ==============================
// BORRAR TODOS LOS DATOS
// ==============================
exports.borrarDatos = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM monitoreo_baterias");

    console.log(`🗑️ Se eliminaron ${result.affectedRows} registros`);

    return res.json({
      mensaje: "Datos eliminados correctamente",
      registrosEliminados: result.affectedRows,
    });

  } catch (err) {
    console.error("❌ Error eliminando datos:", err);
    return res.status(500).json({ error: "Error eliminando datos" });
  }
};

// ==============================
// BORRAR DATO POR ID
// ==============================
exports.borrarDatoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      "DELETE FROM monitoreo_baterias WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      console.log(`⚠ ID ${id} no encontrado`);
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    console.log(`🗑️ Dato ${id} eliminado`);

    return res.json({
      mensaje: "Dato eliminado correctamente",
      id,
    });

  } catch (err) {
    console.error("❌ Error eliminando dato:", err);
    return res.status(500).json({ error: "Error eliminando dato" });
  }
};

// ==============================
// ACTUALIZAR DATO POR ID
// ==============================
exports.actualizarDato = async (req, res) => {
  const { id } = req.params;
  const { dispositivo, voltaje, corriente } = req.body;

  let estado = "NORMAL";
  if (voltaje < 11.5) estado = "BAJO";
  if (voltaje > 14.8) estado = "SOBRECARGA";

  try {
    const [result] = await db.query(
      `UPDATE monitoreo_baterias 
       SET dispositivo = ?, voltaje = ?, corriente = ?, estado = ?
       WHERE id = ?`,
      [dispositivo, voltaje, corriente, estado, id]
    );

    if (result.affectedRows === 0) {
      console.log(`⚠ ID ${id} no encontrado`);
      return res.status(404).json({ error: "Registro no encontrado" });
    }

    console.log(`✏️ Dato ${id} actualizado`);

    return res.json({
      mensaje: "Dato actualizado correctamente",
      id,
      dispositivo,
      voltaje,
      corriente,
      estado,
    });

  } catch (err) {
    console.error("❌ Error actualizando dato:", err);
    return res.status(500).json({ error: "Error actualizando dato" });
  }
};