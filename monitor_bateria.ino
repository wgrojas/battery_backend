#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>  // Librería para JSON

// ===== CONFIGURACIÓN WIFI =====
const char* ssid = "TU_SSID";
const char* password = "TU_PASSWORD";

// ===== URL DE TU API =====
const char* serverUrl = "http://TU_SERVIDOR:5000/api/bateria"; // Cambia con tu backend

// ===== PINES =====
const int pinBateria = A0;   // Lectura voltaje
float voltajeBateria = 0;
float corrienteBateria = 0;  // Si tienes sensor real, reemplaza esta simulación

// Factor de voltaje si hay divisor resistivo
const float factorVoltaje = 2.0;

// Nombre del dispositivo
const char* nombreDispositivo = "Bateria Principal";

void setup() {
  Serial.begin(115200);
  delay(10);

  // Conexión WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
  Serial.print("IP del Wemos: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // ===== LEER VOLTAJE =====
  int lecturaADC = analogRead(pinBateria);
  voltajeBateria = lecturaADC * (3.3 / 1023.0) * factorVoltaje;

  // ===== SIMULAR CORRIENTE =====
  // Puedes reemplazarlo con un sensor real ACS712 u otro
  corrienteBateria = random(5, 15) / 10.0; // Simula entre 0.5A y 1.5A

  Serial.print("Voltaje: "); Serial.print(voltajeBateria); Serial.print(" V");
  Serial.print(" | Corriente: "); Serial.print(corrienteBateria); Serial.println(" A");

  // ===== ENVIAR DATOS AL BACKEND =====
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Crear JSON
    StaticJsonDocument<200> doc;
    doc["dispositivo"] = nombreDispositivo;
    doc["voltaje"] = voltajeBateria;
    doc["corriente"] = corrienteBateria;
    doc["estado"] = "NORMAL";

    String jsonData;
    serializeJson(doc, jsonData);

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.print("Respuesta API: ");
      Serial.println(response);
    } else {
      Serial.print("Error enviando datos: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  } else {
    Serial.println("WiFi no conectado, reintentando...");
  }

  delay(10000); // Enviar cada 10 segundos
}