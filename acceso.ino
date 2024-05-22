#include <Keypad.h>

const byte rowsCount = 4;
const byte columsCount = 4;

char keys[rowsCount][columsCount] = {
   { '1','2','3', 'A' },
   { '4','5','6', 'B' },
   { '7','8','9', 'C' },
   { '#','0','*', 'D' }
};

const byte rowPins[rowsCount] = { 11, 10, 9, 8 };
const byte columnPins[columsCount] = { 7, 6, 5, 4 };

String inputBuffer = ""; // Variable para almacenar los números ingresados

Keypad keypad = Keypad(makeKeymap(keys), rowPins, columnPins, rowsCount, columsCount);

int pulsadorPin = 22; // Pin al que se conecta el pulsador
int valorPulsador = 0; // Variable donde se almacenará el estado del pulsador

bool tecladoActivado = false; // Variable para controlar el estado de activación/desactivación del teclado

void setup() {
  Serial.begin(9600); // Inicializar el puerto serial
  
  pinMode(pulsadorPin, INPUT_PULLUP); // Configurar el pin del pulsador como entrada con resistencia pull-up interna
}

void loop() {
  valorPulsador = digitalRead(pulsadorPin); // Leer el estado del pulsador

  // Verificar si se ha pulsado el botón
  if (valorPulsador == LOW) {
    // Si se ha pulsado el botón, alternar el estado del teclado
    tecladoActivado = !tecladoActivado;
    delay(500); // Debounce
  }

  // Si el teclado está activado, leer las teclas presionadas
  if (tecladoActivado) {
    char key = keypad.getKey();
    if (key) {
      if (key != 'A') {
        inputBuffer += key; // Concatenar el número a la variable
        if (inputBuffer.length() == 9) {
          // Si la longitud de inputBuffer es 9, enviar automáticamente
          Serial.println(inputBuffer);
          inputBuffer = ""; // Reiniciar inputBuffer para futuros números
          tecladoActivado = !tecladoActivado;
        }
      } else {
        // Si se presiona 'A', guardar el valor actual de inputBuffer
        Serial.println(inputBuffer);
        inputBuffer = ""; // Reiniciar inputBuffer para futuros números
        tecladoActivado = !tecladoActivado;
      }
    }
  }

  delay(100); // Esperar un breve periodo de tiempo antes de la siguiente iteración
}
