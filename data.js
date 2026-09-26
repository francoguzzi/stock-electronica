// Base offline + detector de valores + familias por patrón + marcas
const KNOWLEDGE = [
  // --- Micros y lógica (ICs) ---
  { keys: ["ATMEGA328P", "ATMEGA328"], name: "ATmega328P", cat: "ICs", desc: "Microcontrolador 8 bits, el corazón del Arduino UNO/Nano.", pkg: "DIP-28", min: 2 },
  { keys: ["ATTINY85", "ATTINY"], name: "ATtiny85", cat: "ICs", desc: "Microcontrolador 8 bits de 8 pines para proyectos chicos.", pkg: "DIP-8", min: 3 },
  { keys: ["PIC16F877A", "PIC16F"], name: "PIC16F877A", cat: "ICs", desc: "Microcontrolador 8 bits clásico de Microchip, 40 pines.", pkg: "DIP-40", min: 2 },
  { keys: ["LM324"], name: "LM324", cat: "ICs", desc: "Amplificador operacional cuádruple. Para amplificar, comparar y filtrar señales.", pkg: "DIP-14", min: 5 },
  { keys: ["LM386"], name: "LM386", cat: "ICs", desc: "Amplificador de audio de baja potencia (parlantes chicos).", pkg: "DIP-8", min: 3 },
  { keys: ["LM358"], name: "LM358", cat: "ICs", desc: "Amplificador operacional doble, primo del LM324.", pkg: "DIP-8", min: 5 },
  { keys: ["NE555", "555"], name: "NE555", cat: "ICs", desc: "Temporizador clásico para osciladores, pulsos y retardos.", pkg: "DIP-8", min: 5 },
  { keys: ["74HC595", "74595"], name: "74HC595", cat: "ICs", desc: "Registro de desplazamiento: expande 3 pines a 8 salidas (LEDs, displays).", pkg: "DIP-16", min: 3 },
  { keys: ["74HC00"], name: "74HC00", cat: "ICs", desc: "4 puertas lógicas NAND TTL/CMOS.", pkg: "DIP-14", min: 3 },
  { keys: ["74HC04"], name: "74HC04", cat: "ICs", desc: "6 inversores lógicos (NOT).", pkg: "DIP-14", min: 3 },
  { keys: ["74HC74"], name: "74HC74", cat: "ICs", desc: "Doble flip-flop tipo D.", pkg: "DIP-14", min: 3 },
  { keys: ["CD4017", "4017"], name: "CD4017", cat: "ICs", desc: "Contador decimal: secuenciador de 10 salidas (luces, efectos).", pkg: "DIP-16", min: 3 },
  { keys: ["CD4060", "4060"], name: "CD4060", cat: "ICs", desc: "Contador con oscilador integrado para divisores de frecuencia.", pkg: "DIP-16", min: 3 },
  { keys: ["ULN2003"], name: "ULN2003", cat: "ICs", desc: "Array de 7 transistores Darlington para relés, motores y cargas.", pkg: "DIP-16", min: 3 },
  { keys: ["ULN2803"], name: "ULN2803", cat: "ICs", desc: "Array de 8 transistores Darlington, primo grande del ULN2003.", pkg: "DIP-18", min: 2 },
  { keys: ["L293D", "L293"], name: "L293D", cat: "ICs", desc: "Doble puente H para motores DC chicos, hasta 600mA.", pkg: "DIP-16", min: 2 },
  { keys: ["PCF8574"], name: "PCF8574", cat: "ICs", desc: "Expansor de 8 pines digitales por I2C.", pkg: "DIP-16", min: 2 },
  { keys: ["MCP23017"], name: "MCP23017", cat: "ICs", desc: "Expansor de 16 pines digitales por I2C.", pkg: "DIP-28", min: 2 },
  { keys: ["DS3231"], name: "DS3231", cat: "ICs", desc: "Reloj de tiempo real preciso con I2C (con batería).", pkg: "Módulo", min: 2 },
  { keys: ["DS1307"], name: "DS1307", cat: "ICs", desc: "Reloj de tiempo real económico con I2C.", pkg: "DIP-8", min: 2 },
  { keys: ["24LC256", "24C256", "EEPROM"], name: "24LC256", cat: "ICs", desc: "Memoria EEPROM 256 kbit por I2C.", pkg: "DIP-8", min: 2 },
  { keys: ["MAX232"], name: "MAX232", cat: "ICs", desc: "Convierte niveles TTL a RS232 (puerto serie).", pkg: "DIP-16", min: 2 },
  { keys: ["LM741"], name: "LM741", cat: "ICs", desc: "Amplificador operacional clásico de una sola unidad.", pkg: "DIP-8", min: 3 },
  { keys: ["LM339", "LM393"], name: "LM339", cat: "ICs", desc: "Comparador cuádruple/doble para detectar umbrales.", pkg: "DIP-14", min: 3 },
  { keys: ["TL072", "TL082", "TL071", "TL081"], name: "TL072", cat: "ICs", desc: "Op-amp de bajo ruido para audio.", pkg: "DIP-8", min: 3 },
  { keys: ["CD4051", "4051"], name: "CD4051", cat: "ICs", desc: "Multiplexor analógico de 8 canales.", pkg: "DIP-16", min: 2 },
  { keys: ["74HC138"], name: "74HC138", cat: "ICs", desc: "Decodificador de 3 a 8 líneas.", pkg: "DIP-16", min: 2 },
  { keys: ["74LS47", "7447"], name: "74LS47", cat: "ICs", desc: "Driver BCD a display 7 segmentos.", pkg: "DIP-16", min: 2 },
  { keys: ["MCP3008"], name: "MCP3008", cat: "ICs", desc: "Conversor ADC 10 bits de 8 canales por SPI.", pkg: "DIP-16", min: 1 },
  { keys: ["PCF8591"], name: "PCF8591", cat: "ICs", desc: "ADC/DAC de 8 bits por I2C.", pkg: "DIP-16", min: 1 },
  { keys: ["MAX485"], name: "MAX485", cat: "ICs", desc: "Transceptor RS485 para comunicación industrial.", pkg: "DIP-8", min: 2 },
  // --- Reguladores ---
  { keys: ["7805"], name: "7805", cat: "Reguladores", desc: "Regulador lineal 5V 1A.", pkg: "TO-220", min: 5, specs: { volt: "5V" } },
  { keys: ["7812"], name: "7812", cat: "Reguladores", desc: "Regulador lineal 12V 1A.", pkg: "TO-220", min: 5, specs: { volt: "12V" } },
  { keys: ["7905"], name: "7905", cat: "Reguladores", desc: "Regulador lineal negativo -5V 1A.", pkg: "TO-220", min: 3, specs: { volt: "5V" } },
  { keys: ["LM317"], name: "LM317", cat: "Reguladores", desc: "Regulador ajustable 1.2-37V 1.5A.", pkg: "TO-220", min: 4 },
  { keys: ["LM1117"], name: "LM1117", cat: "Reguladores", desc: "Regulador LDO 800mA, primo del AMS1117.", pkg: "SOT-223", min: 5 },
  { keys: ["AMS1117", "1117-3.3", "1117"], name: "AMS1117", cat: "Reguladores", desc: "Regulador LDO (3.3V o 5V según versión), típico para ESP.", pkg: "SOT-223", min: 5 },
  { keys: ["TL431"], name: "TL431", cat: "Reguladores", desc: "Referencia de tensión ajustable, tipo zener programable.", pkg: "TO-92", min: 5 },
  { keys: ["LM2596", "XL4015", "STEP DOWN", "STEP-DOWN"], name: "Módulo LM2596", cat: "Reguladores", desc: "Módulo reductor DC-DC ajustable (step-down), hasta 3A.", pkg: "Módulo", min: 2 },
  { keys: ["MT3608", "STEP UP", "STEP-UP"], name: "Módulo MT3608", cat: "Reguladores", desc: "Módulo elevador DC-DC ajustable (step-up).", pkg: "Módulo", min: 2 },
  // --- Transistores / MOSFET ---
  { keys: ["BC547", "BC548"], name: "BC547", cat: "Transistores", desc: "Transistor NPN de uso general, conmutación y amplificación.", pkg: "TO-92", min: 10 },
  { keys: ["BC557", "BC558"], name: "BC557", cat: "Transistores", desc: "Transistor PNP complementario del BC547.", pkg: "TO-92", min: 10 },
  { keys: ["BC337", "BC327"], name: "BC337", cat: "Transistores", desc: "Transistor NPN/PNP de media potencia, hasta 800mA.", pkg: "TO-92", min: 10 },
  { keys: ["2N2222", "2N3904", "PN2222"], name: "2N2222", cat: "Transistores", desc: "Transistor NPN de conmutación rápida.", pkg: "TO-92", min: 10 },
  { keys: ["2N3906"], name: "2N3906", cat: "Transistores", desc: "Transistor PNP de señal, par del 2N3904.", pkg: "TO-92", min: 10 },
  { keys: ["BD139", "BD140"], name: "BD139/140", cat: "Transistores", desc: "Transistores de potencia NPN/PNP 1.5A para audio y fuentes.", pkg: "TO-126", min: 5 },
  { keys: ["TIP31", "TIP32"], name: "TIP31/32", cat: "Transistores", desc: "Transistores de potencia NPN/PNP para audio y fuentes.", pkg: "TO-220", min: 5 },
  { keys: ["TIP41", "TIP42"], name: "TIP41/42", cat: "Transistores", desc: "Transistores de potencia 6A para audio y control.", pkg: "TO-220", min: 4 },
  { keys: ["TIP120", "TIP122"], name: "TIP120", cat: "Transistores", desc: "Transistor Darlington NPN 5A para cargas con poca corriente de base.", pkg: "TO-220", min: 4 },
  { keys: ["S8050", "S8550"], name: "S8050", cat: "Transistores", desc: "Transistores NPN/PNP chicos, muy usados en módulos.", pkg: "TO-92", min: 10 },
  { keys: ["MPSA42", "MPSA92"], name: "MPSA42", cat: "Transistores", desc: "Transistor de alta tensión (300V) para fuentes.", pkg: "TO-92", min: 5 },
  { keys: ["TIP125", "TIP127"], name: "TIP125", cat: "Transistores", desc: "Transistor Darlington PNP 5A.", pkg: "TO-220", min: 4 },
  { keys: ["BD135", "BD136"], name: "BD135", cat: "Transistores", desc: "Transistores NPN/PNP de media potencia 1.5A.", pkg: "TO-126", min: 5 },
  { keys: ["MJE13003", "13003"], name: "MJE13003", cat: "Transistores", desc: "Transistor NPN de alta tensión para fuentes conmutadas.", pkg: "TO-126", min: 4 },
  { keys: ["C945", "A733", "C1815", "A1015"], name: "C945", cat: "Transistores", desc: "Transistores chicos japoneses NPN/PNP de señal.", pkg: "TO-92", min: 10 },
  { keys: ["IGBT", "IRG4PC", "FGA25"], name: "IGBT", cat: "Transistores", desc: "Transistor bipolar de puerta aislada para alta potencia e inversores.", pkg: "TO-247", min: 2 },
  { keys: ["IRF9540", "IRF4905", "MOSFET P"], name: "IRF9540", cat: "Transistores", desc: "MOSFET canal P de potencia, complementario de los N.", pkg: "TO-220", min: 4 },
  { keys: ["AO3400", "AO3401"], name: "AO3400", cat: "Transistores", desc: "MOSFET SMD logic-level para conmutar con 3.3/5V.", pkg: "SOT-23", min: 10 },
  { keys: ["SOT-23", "TRANSISTOR SMD", "BC847", "BC857"], name: "Transistor SMD", cat: "Transistores", desc: "Transistor SMD SOT-23. Completá el código.", pkg: "SOT-23", min: 10 },
  { keys: ["2N3055"], name: "2N3055", cat: "Transistores", desc: "Transistor de potencia NPN 15A para fuentes y audio.", pkg: "TO-3", min: 2 },
  { keys: ["2N7000"], name: "2N7000", cat: "Transistores", desc: "MOSFET canal N de señal, se dispara con 5V lógicos.", pkg: "TO-92", min: 10 },
  { keys: ["IRLZ44N", "IRLZ44"], name: "IRLZ44N", cat: "Transistores", desc: "MOSFET N logic-level para conmutar con 5V directo del micro.", pkg: "TO-220", min: 5 },
  { keys: ["IRFZ44N", "IRFZ44"], name: "IRFZ44N", cat: "Transistores", desc: "MOSFET N de potencia 49A para conmutar cargas grandes.", pkg: "TO-220", min: 5 },
  { keys: ["IRF540"], name: "IRF540", cat: "Transistores", desc: "MOSFET N de potencia para conmutación y PWM.", pkg: "TO-220", min: 5 },
  // --- Diodos / LED ---
  { keys: ["1N4007", "1N4004"], name: "1N4007", cat: "Diodos / LED", desc: "Diodo rectificador 1A 1000V.", pkg: "DO-41", min: 20 },
  { keys: ["1N5408", "1N5404"], name: "1N5408", cat: "Diodos / LED", desc: "Diodo rectificador 3A para fuentes.", pkg: "DO-27", min: 10 },
  { keys: ["FR107", "FR207", "UF4007", "DIODO RAPIDO"], name: "FR107", cat: "Diodos / LED", desc: "Diodo de recuperación rápida para fuentes conmutadas.", pkg: "DO-41", min: 10 },
  { keys: ["FOTODIODO", "FOTOTRANSISTOR"], name: "Fotodiodo", cat: "Diodos / LED", desc: "Sensor de luz por diodo/transistor fotosensible.", pkg: "5mm", min: 5 },
  { keys: ["1N4148"], name: "1N4148", cat: "Diodos / LED", desc: "Diodo de señal rápida 100V.", pkg: "DO-35", min: 20 },
  { keys: ["1N5819", "1N5822", "SCHOTTKY"], name: "1N5819", cat: "Diodos / LED", desc: "Diodo Schottky de caída baja, para fuentes conmutadas.", pkg: "DO-41", min: 10 },
  { keys: ["ZENER", "BZX55", "BZX79"], name: "Diodo zener", cat: "Diodos / LED", desc: "Diodo que regula tensión; el código indica los volts (ej: 5V1, 12V).", pkg: "DO-35", min: 10 },
  { keys: ["PUENTE RECTIFICADOR", "PUENTE DE DIODOS", "KBP", "GBJ", "W10"], name: "Puente rectificador", cat: "Diodos / LED", desc: "4 diodos en uno para rectificar AC a DC en fuentes.", pkg: "Varios", min: 3 },
  { keys: ["LED RGB", "RGB"], name: "LED RGB", cat: "Diodos / LED", desc: "LED tricolor (rojo+verde+azul) de 4 pines.", pkg: "5mm", min: 10 },
  { keys: ["LED 3MM", "LED 10MM"], name: "LED 3mm", cat: "Diodos / LED", desc: "LED chico o grande para indicación.", pkg: "3/10mm", min: 10 },
  { keys: ["LED 1W", "LED 3W", "LED ALTA POTENCIA", "LED COB"], name: "LED potencia", cat: "Diodos / LED", desc: "LED de alta potencia, necesita disipador y driver.", pkg: "Varios", min: 5 },
  { keys: ["LED BICOLOR", "LED 2 COLORES"], name: "LED bicolor", cat: "Diodos / LED", desc: "LED de dos colores según polaridad.", pkg: "5mm", min: 10 },
  { keys: ["WS2812B", "NEOPIXEL", "TIRA LED"], name: "WS2812B", cat: "Diodos / LED", desc: "LED RGB direccionable para tiras y matrices.", pkg: "5050", min: 2 },
  { keys: ["LED SMD", "LED 0805", "LED 5050", "LED 0603"], name: "LED SMD", cat: "Diodos / LED", desc: "LED para montaje en PCB.", pkg: "SMD", min: 10 },
  { keys: ["LED"], name: "LED 5mm", cat: "Diodos / LED", desc: "Diodo emisor de luz.", pkg: "5mm", min: 20 },
  { keys: ["7 SEGMENTOS", "7SEG", "DISPLAY", "TM1637"], name: "Display 7 segmentos", cat: "Diodos / LED", desc: "Display numérico LED, simple o módulo TM1637 con reloj.", pkg: "Varios", min: 2 },
  // --- Tiristores / TRIACs ---
  { keys: ["Q6015L5", "Q6015"], name: "Q6015L5", cat: "Tiristores", desc: "TRIAC 15A 600V, compuerta sensible, para control de potencia AC (dimmers, motores).", pkg: "TO-220 aislado", min: 3, specs: { amps: "15A", volt: "600V" } },
  { keys: ["BT136"], name: "BT136", cat: "Tiristores", desc: "TRIAC 4A 600V para cargas AC pequeñas y dimmers.", pkg: "TO-220", min: 5 },
  { keys: ["BT138", "BTA16", "BTA41", "BTB16"], name: "BT138", cat: "Tiristores", desc: "TRIAC 12A o más para cargas AC medias y grandes.", pkg: "TO-220 aislado", min: 4 },
  { keys: ["TIC226"], name: "TIC226", cat: "Tiristores", desc: "TRIAC 8A 400/600V de uso general.", pkg: "TO-220", min: 4 },
  { keys: ["MAC97"], name: "MAC97", cat: "Tiristores", desc: "TRIAC pequeño 0.6A para disparo y señal.", pkg: "TO-92", min: 5 },
  { keys: ["MCR100", "2N5060", "SCR", "TIRISTOR"], name: "MCR100-6", cat: "Tiristores", desc: "SCR (tiristor unidireccional) sensible para control DC y pulsos.", pkg: "TO-92", min: 5 },
  { keys: ["BT169"], name: "BT169", cat: "Tiristores", desc: "SCR pequeño sensible para disparo y control.", pkg: "TO-92", min: 5 },
  { keys: ["DIAC", "DB3", "DB4"], name: "Diac DB3", cat: "Tiristores", desc: "Dispara TRIACs en dimmers y controles de fase.", pkg: "DO-35", min: 5 },
  { keys: ["TLP521", "TLP621"], name: "TLP521", cat: "Tiristores", desc: "Optoacoplador con transistor para aislar señales.", pkg: "DIP-4", min: 5 },
  { keys: ["MOC3021", "MOC3041", "MOC3063", "PC817", "OPTOACOPLADOR", "OPTO"], name: "MOC3021 / PC817", cat: "Tiristores", desc: "Optoacoplador para aislar y disparar TRIACs con seguridad.", pkg: "DIP-6/4", min: 5 },
  { keys: ["4N25", "4N35", "4N33"], name: "4N25", cat: "Tiristores", desc: "Optoacoplador con transistor de salida para aislar señales.", pkg: "DIP-6", min: 5 },
  // --- Drivers ---
  { keys: ["DRV8825", "8825"], name: "DRV8825", cat: "Drivers", desc: "Driver paso a paso bipolar, 2.5A, 8.2-45V, microstepping 1/32.", pkg: "Pololu", min: 2 },
  { keys: ["A4988"], name: "A4988", cat: "Drivers", desc: "Driver paso a paso bipolar, 2A, 8-35V, microstepping 1/16.", pkg: "Pololu", min: 2 },
  { keys: ["TMC2208", "TMC2209"], name: "TMC2208", cat: "Drivers", desc: "Driver paso a paso silencioso con UART, para impresoras 3D.", pkg: "Pololu", min: 2 },
  { keys: ["L298N", "L298"], name: "L298N", cat: "Drivers", desc: "Driver doble puente H para motores DC y paso a paso, hasta 2A.", pkg: "Módulo", min: 2 },
  // --- Sensores ---
  { keys: ["DHT22", "DHT11", "DHT"], name: "DHT22", cat: "Sensores", desc: "Sensor de temperatura y humedad digital.", pkg: "Módulo", min: 2 },
  { keys: ["DS18B20"], name: "DS18B20", cat: "Sensores", desc: "Sensor de temperatura digital 1-Wire, versión waterproof para agua.", pkg: "TO-92/sonda", min: 3 },
  { keys: ["LM35"], name: "LM35", cat: "Sensores", desc: "Sensor de temperatura analógico, 10mV por grado.", pkg: "TO-92", min: 3 },
  { keys: ["BMP280", "BME280", "BMP180"], name: "BMP280", cat: "Sensores", desc: "Sensor de presión, temperatura (y humedad el BME280) por I2C.", pkg: "Módulo", min: 2 },
  { keys: ["MPU6050", "MPU9250"], name: "MPU6050", cat: "Sensores", desc: "Acelerómetro + giroscopio 6 ejes por I2C.", pkg: "Módulo", min: 2 },
  { keys: ["HC-SR04", "HCSR04", "ULTRASONICO"], name: "HC-SR04", cat: "Sensores", desc: "Sensor ultrasónico de distancia.", pkg: "Módulo", min: 2 },
  { keys: ["HC-SR501", "PIR", "MOVIMIENTO"], name: "HC-SR501", cat: "Sensores", desc: "Sensor de movimiento por infrarrojo pasivo.", pkg: "Módulo", min: 2 },
  { keys: ["LDR", "FOTORRESISTENCIA"], name: "LDR", cat: "Sensores", desc: "Resistencia que varía con la luz, para detectores de oscuridad.", pkg: "5mm", min: 5 },
  { keys: ["NTC", "TERMISTOR", "10K NTC"], name: "NTC 10K", cat: "Sensores", desc: "Termistor: resistencia que varía con la temperatura.", pkg: "Varios", min: 5 },
  { keys: ["MQ-2", "MQ2", "MQ-135", "MQ135", "SENSOR GAS", "SENSOR HUMO"], name: "MQ-2", cat: "Sensores", desc: "Sensor de gas/humo para alarmas y calidad de aire.", pkg: "Módulo", min: 2 },
  { keys: ["HX711", "CELDA DE CARGA", "STRAIN GAUGE"], name: "HX711", cat: "Sensores", desc: "Módulo para celdas de carga (balanza digital).", pkg: "Módulo", min: 1 },
  { keys: ["RC522", "RFID", "MFRC522"], name: "RC522", cat: "Sensores", desc: "Lector RFID 13.56MHz para tarjetas y llaveros.", pkg: "Módulo", min: 1 },
  { keys: ["FC-28", "HUMEDAD SUELO", "SENSOR SUELO"], name: "FC-28", cat: "Sensores", desc: "Sensor de humedad de suelo para riego.", pkg: "Módulo", min: 2 },
  { keys: ["TCRT5000", "SEGUIDOR LINEA", "INFRARROJO REFLEX"], name: "TCRT5000", cat: "Sensores", desc: "Sensor infrarrojo reflexivo para seguidor de línea y cuentavueltas.", pkg: "Módulo", min: 3 },
  { keys: ["SHT30", "SHT31", "SHT35"], name: "SHT31", cat: "Sensores", desc: "Sensor de temperatura y humedad preciso por I2C.", pkg: "Módulo", min: 1 },
  { keys: ["VL53L0X", "VL53L", "SENSOR LASER"], name: "VL53L0X", cat: "Sensores", desc: "Sensor de distancia por láser (ToF).", pkg: "Módulo", min: 1 },
  { keys: ["TCS3200", "TCS34725", "SENSOR COLOR"], name: "TCS3200", cat: "Sensores", desc: "Sensor de color RGB.", pkg: "Módulo", min: 1 },
  { keys: ["TSOP", "TSOP1838", "RECEPTOR IR", "CONTROL REMOTO IR"], name: "TSOP1838", cat: "Sensores", desc: "Receptor infrarrojo 38kHz para controles remotos.", pkg: "Varios", min: 2 },
  { keys: ["KY-038", "KY038", "SENSOR SONIDO", "MICROFONO"], name: "KY-038", cat: "Sensores", desc: "Sensor de sonido con micrófono.", pkg: "Módulo", min: 1 },
  { keys: ["FC-37", "FC37", "SENSOR LLUVIA"], name: "FC-37", cat: "Sensores", desc: "Sensor de lluvia con placa.", pkg: "Módulo", min: 1 },
  { keys: ["BME680"], name: "BME680", cat: "Sensores", desc: "Sensor de gas, presión, temp y humedad por I2C.", pkg: "Módulo", min: 1 },
  { keys: ["APDS9960", "SENSOR GESTOS"], name: "APDS9960", cat: "Sensores", desc: "Sensor de gestos, proximidad y color.", pkg: "Módulo", min: 1 },
  { keys: ["TSL2561", "SENSOR LUZ"], name: "TSL2561", cat: "Sensores", desc: "Sensor de luz ambiental digital.", pkg: "Módulo", min: 1 },
  { keys: ["INA219", "ACS712", "SENSOR CORRIENTE"], name: "INA219", cat: "Sensores", desc: "Sensor de corriente y tensión por I2C/efecto hall.", pkg: "Módulo", min: 1 },
  { keys: ["QMC5883", "HMC5883", "BRUJULA", "MAGNETOMETRO"], name: "QMC5883", cat: "Sensores", desc: "Brújula digital (magnetómetro) por I2C.", pkg: "Módulo", min: 1 },
  { keys: ["ADXL345", "ACELEROMETRO"], name: "ADXL345", cat: "Sensores", desc: "Acelerómetro 3 ejes por I2C/SPI.", pkg: "Módulo", min: 1 },
  { keys: ["SW-420", "SW420", "SENSOR VIBRACION"], name: "SW-420", cat: "Sensores", desc: "Sensor de vibración con comparador.", pkg: "Módulo", min: 1 },
  { keys: ["KY-026", "SENSOR LLAMA", "LLAMA"], name: "KY-026", cat: "Sensores", desc: "Sensor de llama infrarrojo.", pkg: "Módulo", min: 1 },
  { keys: ["SENSOR NIVEL AGUA", "NIVEL LIQUIDO", "BOYA"], name: "Sensor nivel agua", cat: "Sensores", desc: "Detecta nivel de líquidos (boya o contacto).", pkg: "Varios", min: 1 },
  { keys: ["ENDSTOP", "FINAL IMPRESORA", "ENDSTOP OPTICO"], name: "Endstop", cat: "Sensores", desc: "Final de carrera mecánico u óptico para 3D/CNC.", pkg: "Varios", min: 2 },
  { keys: ["A3144", "HALL", "SENSOR HALL", "SS49E"], name: "Sensor Hall", cat: "Sensores", desc: "Detecta campos magnéticos (imanes).", pkg: "TO-92", min: 3 },
  { keys: ["REED", "AMPOLLETA MAGNETICA", "INTERRUPTOR MAGNETICO"], name: "Reed switch", cat: "Sensores", desc: "Interruptor que cierra ante un imán.", pkg: "Varios", min: 3 },
  { keys: ["TILT", "SW-520D", "SENSOR INCLINACION"], name: "Sensor tilt", cat: "Sensores", desc: "Detecta inclinación y movimiento brusco.", pkg: "Módulo", min: 2 },
  // --- Módulos / placas ---
  { keys: ["ARDUINO UNO", "UNO R3"], name: "Arduino UNO R3", cat: "Módulos / Placas", desc: "Placa microcontroladora ATmega328P, la estándar para aprender.", pkg: "Placa", min: 1 },
  { keys: ["ARDUINO NANO", "NANO"], name: "Arduino Nano", cat: "Módulos / Placas", desc: "Placa microcontroladora compacta ATmega328 para protoboard.", pkg: "Placa", min: 2 },
  { keys: ["PRO MICRO", "SPARKFUN PRO MICRO"], name: "Pro Micro", cat: "Módulos / Placas", desc: "Placa chica ATmega32U4 con USB.", pkg: "Placa", min: 1 },
  { keys: ["DIGISPARK", "MINI USB AVR"], name: "Digispark", cat: "Módulos / Placas", desc: "Placa mínima ATtiny85 con USB.", pkg: "Placa", min: 1 },
  { keys: ["ARDUINO MEGA", "MEGA2560", "MEGA 2560"], name: "Arduino Mega 2560", cat: "Módulos / Placas", desc: "Placa con muchos pines para proyectos grandes.", pkg: "Placa", min: 1 },
  { keys: ["PRO MINI"], name: "Arduino Pro Mini", cat: "Módulos / Placas", desc: "Placa mínima ATmega328 sin USB, para montaje final.", pkg: "Placa", min: 2 },
  { keys: ["ESP32-CAM", "ESP32 CAM", "OV2640"], name: "ESP32-CAM", cat: "Módulos / Placas", desc: "ESP32 con cámara para video IoT.", pkg: "Placa", min: 1 },
  { keys: ["ESP32-S2", "ESP32-S3", "ESP32-C3", "ESP32C3"], name: "ESP32-S3", cat: "Módulos / Placas", desc: "Variante del ESP32 (S2/S3/C3 según versión).", pkg: "Placa", min: 2 },
  { keys: ["ESP32", "ESP32 DEVKIT", "NODEMCU-32"], name: "ESP32 DevKit", cat: "Módulos / Placas", desc: "Placa con WiFi + Bluetooth para IoT.", pkg: "Placa", min: 2 },
  { keys: ["ESP8266", "NODEMCU", "WEMOS D1"], name: "ESP8266 NodeMCU", cat: "Módulos / Placas", desc: "Placa con WiFi simple y barata para IoT.", pkg: "Placa", min: 2 },
  { keys: ["BLUE PILL", "STM32F103"], name: "Blue Pill STM32", cat: "Módulos / Placas", desc: "Placa ARM Cortex-M3 de 32 bits, potente y barata.", pkg: "Placa", min: 1 },
  { keys: ["RASPBERRY PICO", "RP2040", "PICO"], name: "Raspberry Pi Pico", cat: "Módulos / Placas", desc: "Placa dual-core ARM con MicroPython y C.", pkg: "Placa", min: 1 },
  { keys: ["ARDUINO LEONARDO", "LEONARDO"], name: "Arduino Leonardo", cat: "Módulos / Placas", desc: "Placa ATmega32U4 con USB nativo.", pkg: "Placa", min: 1 },
  { keys: ["RASPBERRY PI", "RASPBERRY 4", "RASPBERRY ZERO", "RPI", "RASPBERRY 3"], name: "Raspberry Pi", cat: "Módulos / Placas", desc: "Microcomputadora para Linux y proyectos.", pkg: "Placa", min: 1 },
  { keys: ["BLACK PILL", "BLACKPILL", "STM32F401", "STM32F411"], name: "Black Pill", cat: "Módulos / Placas", desc: "Placa ARM Cortex-M4 potente.", pkg: "Placa", min: 1 },
  { keys: ["SIM7600", "4G LTE", "MODULO 4G"], name: "SIM7600", cat: "Módulos / Placas", desc: "Módulo 4G LTE para datos y GPS.", pkg: "Módulo", min: 1 },
  { keys: ["ADAPTADOR I2C", "BACKPACK LCD", "MOCHILA I2C"], name: "Backpack I2C", cat: "Módulos / Placas", desc: "Mochila I2C para LCD 16x2/20x4 (2 cables).", pkg: "Módulo", min: 1 },
  { keys: ["PN532", "NFC"], name: "PN532", cat: "Módulos / Placas", desc: "Lector NFC/RFID por I2C/SPI.", pkg: "Módulo", min: 1 },
  { keys: ["NRF24L01", "NRF24"], name: "NRF24L01", cat: "Módulos / Placas", desc: "Radio 2.4GHz para comunicar placas entre sí.", pkg: "Módulo", min: 2 },
  { keys: ["HC-05", "HC-06", "HC05", "BLUETOOTH HC"], name: "HC-05", cat: "Módulos / Placas", desc: "Módulo Bluetooth clásico para control con celular.", pkg: "Módulo", min: 1 },
  { keys: ["SIM800L", "SIM800", "GSM", "GPRS"], name: "SIM800L", cat: "Módulos / Placas", desc: "Módulo GSM/GPRS para SMS y datos con chip de celular.", pkg: "Módulo", min: 1 },
  { keys: ["NEO-6M", "NEO-M8N", "NEO6M", "GPS NEO"], name: "NEO-6M", cat: "Módulos / Placas", desc: "Módulo GPS para posición y hora.", pkg: "Módulo", min: 1 },
  { keys: ["SG90", "SERVO 9G"], name: "Servo SG90", cat: "Módulos / Placas", desc: "Servomotor chico 9g para brazos y dirección.", pkg: "Servo", min: 2 },
  { keys: ["MG996R", "MG90S"], name: "Servo MG996R", cat: "Módulos / Placas", desc: "Servomotor de alto torque con engranajes metálicos.", pkg: "Servo", min: 1 },
  { keys: ["SERVO TESTER", "PROBADOR SERVO"], name: "Servo tester", cat: "Módulos / Placas", desc: "Probador manual de servos sin placa.", pkg: "Módulo", min: 1 },
  { keys: ["NEMA23", "NEMA 23"], name: "Motor NEMA23", cat: "Módulos / Placas", desc: "Motor paso a paso grande para CNC.", pkg: "Motor", min: 1 },
  { keys: ["RUEDA ROBOT", "RUEDA 65MM", "RUEDA"], name: "Rueda robot", cat: "Módulos / Placas", desc: "Rueda para motorreductor TT.", pkg: "Varios", min: 2 },
  { keys: ["CHASIS", "CHASIS ROBOT", "KIT ROBOT"], name: "Chasis robot", cat: "Módulos / Placas", desc: "Chasis 2WD/4WD para robotitos.", pkg: "Kit", min: 1 },
  { keys: ["NEMA17", "NEMA 17", "MOTOR PASO A PASO", "MOTOR PAP"], name: "Motor NEMA17", cat: "Módulos / Placas", desc: "Motor paso a paso bipolar para 3D y CNC.", pkg: "Motor", min: 1 },
  { keys: ["LCD 16X2", "LCD1602", "LCD 20X4", "LCD2004"], name: "LCD 16x2", cat: "Módulos / Placas", desc: "Display de texto 16x2, simple o con adaptador I2C.", pkg: "Módulo", min: 1 },
  { keys: ["OLED", "SSD1306", "0.96"], name: "OLED 0.96", cat: "Módulos / Placas", desc: "Display OLED 128x64 por I2C, nítido y chico.", pkg: "Módulo", min: 1 },
  { keys: ["TECLADO 4X4", "TECLADO MATRICIAL", "KEYPAD"], name: "Teclado 4x4", cat: "Módulos / Placas", desc: "Teclado matricial de membrana 16 teclas.", pkg: "Membrana", min: 1 },
  { keys: ["MB102", "FUENTE PROTOBOARD", "FUENTE MB102"], name: "Fuente MB102", cat: "Módulos / Placas", desc: "Fuente 3.3/5V para protoboard.", pkg: "Módulo", min: 1 },
  { keys: ["TP4056"], name: "TP4056", cat: "Módulos / Placas", desc: "Módulo cargador de baterías Li-ion 1A, con y sin protección.", pkg: "Módulo", min: 2 },
  { keys: ["JOYSTICK", "KY-023"], name: "Joystick KY-023", cat: "Módulos / Placas", desc: "Joystick analógico XY con pulsador.", pkg: "Módulo", min: 1 },
  { keys: ["ENCODER", "KY-040"], name: "Encoder KY-040", cat: "Módulos / Placas", desc: "Encoder rotativo con pulsador para menús y volumen.", pkg: "Módulo", min: 2 },
  { keys: ["TB6600"], name: "TB6600", cat: "Drivers", desc: "Driver paso a paso 4A para motores grandes.", pkg: "Módulo", min: 1 },
  { keys: ["TB6560"], name: "TB6560", cat: "Drivers", desc: "Driver paso a paso 3A para CNC.", pkg: "Módulo", min: 1 },
  { keys: ["L9110S", "L9110", "MX1508"], name: "L9110S", cat: "Drivers", desc: "Driver doble para motores DC chicos.", pkg: "Módulo", min: 2 },
  { keys: ["IR2110", "IR2104"], name: "IR2110", cat: "Drivers", desc: "Driver para MOSFET/IGBT en medio puente y puente H.", pkg: "DIP-14", min: 2 },
  { keys: ["PCA9685"], name: "PCA9685", cat: "Módulos / Placas", desc: "Driver 16 canales PWM por I2C para servos y LEDs.", pkg: "Módulo", min: 1 },
  { keys: ["DFPLAYER", "DF PLAYER", "MP3"], name: "DFPlayer Mini", cat: "Módulos / Placas", desc: "Reproductor MP3 con microSD para Arduino.", pkg: "Módulo", min: 1 },
  { keys: ["MOTORREDUCTOR", "MOTOR TT", "MOTOR AMARILLO"], name: "Motorreductor TT", cat: "Módulos / Placas", desc: "Motor DC amarillo con reductora para robotitos.", pkg: "Motor", min: 2 },
  { keys: ["PAM8403", "AMP 3W", "AMPLIFICADOR DIGITAL"], name: "PAM8403", cat: "Módulos / Placas", desc: "Amplificador digital estéreo 3W.", pkg: "Módulo", min: 1 },
  { keys: ["HM-10", "HM10", "BLUETOOTH 4.0", "BLE 4.0"], name: "HM-10", cat: "Módulos / Placas", desc: "Módulo Bluetooth Low Energy.", pkg: "Módulo", min: 1 },
  { keys: ["LORA", "RA-02", "SX1278", "SX1276"], name: "LoRa RA-02", cat: "Módulos / Placas", desc: "Radio LoRa de largo alcance.", pkg: "Módulo", min: 1 },
  { keys: ["FTDI", "CP2102", "CH340", "USB TTL", "PROGRAMADOR USB"], name: "USB-TTL", cat: "Módulos / Placas", desc: "Adaptador USB a serie TTL para programar placas.", pkg: "Módulo", min: 1 },
  { keys: ["MAX7219", "MATRIZ LED", "MATRIZ 8X8"], name: "MAX7219", cat: "Módulos / Placas", desc: "Driver para matriz LED 8x8 y displays por SPI.", pkg: "Módulo", min: 1 },
  { keys: ["TFT", "ILI9341", "ST7735"], name: "Display TFT", cat: "Módulos / Placas", desc: "Display TFT color por SPI.", pkg: "Módulo", min: 1 },
  { keys: ["MCP2515", "CAN BUS", "MODULO CAN"], name: "MCP2515", cat: "Módulos / Placas", desc: "Módulo CAN bus por SPI.", pkg: "Módulo", min: 1 },
  { keys: ["SSR", "RELE ESTADO SOLIDO", "SOLID STATE"], name: "Relé SSR", cat: "Módulos / Placas", desc: "Relé de estado sólido para conmutar AC sin chispa.", pkg: "Módulo", min: 1 },
  { keys: ["USBASP", "PROGRAMADOR AVR"], name: "USBasp", cat: "Módulos / Placas", desc: "Programador USB para micros AVR.", pkg: "Módulo", min: 1 },
  { keys: ["ST-LINK", "STLINK"], name: "ST-Link", cat: "Módulos / Placas", desc: "Programador/depurador para STM32.", pkg: "Módulo", min: 1 },
  { keys: ["CNC", "CNC SHIELD", "SHIELD CNC", "SHIELD ARDUINO", "PROTO SHIELD"], name: "CNC Shield", cat: "Módulos / Placas", desc: "Shield para CNC/3D sobre Arduino UNO.", pkg: "Placa", min: 1 },
  { keys: ["RAMPS", "RAMPS 1.4"], name: "RAMPS 1.4", cat: "Módulos / Placas", desc: "Controladora para impresora 3D sobre Mega.", pkg: "Placa", min: 1 },
  { keys: ["PROTOBOARD", "BREADBOARD"], name: "Protoboard", cat: "Otros", desc: "Placa de prototipado sin soldadura.", pkg: "400/830 pts", min: 1 },
  // --- Pasivos / varios ---
  { keys: ["POT DESLIZANTE", "SLIDE POT", "DESLIZANTE"], name: "Pot deslizante", cat: "Resistencias", desc: "Potenciómetro deslizante para consolas y volumen.", pkg: "Varios", min: 2 },
  { keys: ["POTENCIOMETRO", "POT 10K", "B10K", "B100K", "POT"], name: "Potenciómetro", cat: "Resistencias", desc: "Resistencia variable para ajuste, volumen y sensores. El código indica el valor (ej: B10K).", pkg: "Lineal", min: 5 },
  { keys: ["PRESET", "TRIMMER", "TRIM POT"], name: "Preset / trimmer", cat: "Resistencias", desc: "Resistencia variable chica para calibrar en la PCB.", pkg: "Varios", min: 5 },
  { keys: ["RESISTENCIA 1/4", "RESISTENCIA CARBONO", "1/4W"], name: "Resistencia 1/4W", cat: "Resistencias", desc: "Resistencia de carbón 1/4W. Completá el valor en ohm.", pkg: "Axial", min: 20 },
  { keys: ["RESISTENCIA DE POTENCIA", "RESISTENCIA CERAMICA", "CEMENTO", "WIREWOUND", "5W"], name: "Resistencia potencia", cat: "Resistencias", desc: "Resistencia de potencia (1W o más). Completá valor y watts.", pkg: "Axial/cemento", min: 5 },
  { keys: ["RESISTENCIA SMD", "SMD 0805", "SMD 0603", "SMD 1206"], name: "Resistencia SMD", cat: "Resistencias", desc: "Resistencia chip para PCB. Completá el valor.", pkg: "SMD", min: 20 },
  { keys: ["3296", "3362", "PRESET MULTIVUELTA"], name: "Preset 3296", cat: "Resistencias", desc: "Preset multivuelta para ajuste fino.", pkg: "Varios", min: 5 },
  { keys: ["RESISTENCIA 0", "0 OHM", "PUENTE 0"], name: "Resistencia 0Ω", cat: "Resistencias", desc: "Puente de 0 ohm para PCB.", pkg: "Axial/SMD", min: 10 },
  { keys: ["CRISTAL", "CRYSTAL", "XTAL", "RESONADOR"], name: "Cristal", cat: "Otros", desc: "Genera reloj estable para micros. El valor va en MHz (ej: 16MHz).", pkg: "HC-49", min: 5 },
  { keys: ["INDUCTOR", "CHOKE", "BOBINA"], name: "Inductor", cat: "Otros", desc: "Bobina para filtros y fuentes. El valor va en uH/mH.", pkg: "Varios", min: 5 },
  { keys: ["FUSIBLE", "FUSE"], name: "Fusible", cat: "Otros", desc: "Protección contra sobrecorriente. Indicá amperes y tamaño.", pkg: "5x20mm", min: 10 },
  { keys: ["PTC", "FUSIBLE REARMABLE", "POLYFUSE"], name: "PTC rearmable", cat: "Otros", desc: "Fusible rearmable PTC.", pkg: "Varios", min: 5 },
  { keys: ["VARISTOR", "VARISTORES", "TVS", "SUPRESOR PICOS"], name: "Varistor", cat: "Otros", desc: "Protege contra picos de la red.", pkg: "Varios", min: 5 },
  { keys: ["COOLER", "VENTILADOR", "FAN 12V", "FAN 5V"], name: "Cooler", cat: "Otros", desc: "Ventilador para refrigerar gabinetes y fuentes.", pkg: "Varios", min: 1 },
  { keys: ["GABINETE", "CARCASA", "CAJA PROYECTO", "CAJA PLASTICA"], name: "Gabinete", cat: "Otros", desc: "Caja plástica para montar proyectos.", pkg: "Varios", min: 1 },
  { keys: ["IMAN", "NEODIMIO", "MAGNETO"], name: "Imán neodimio", cat: "Otros", desc: "Imán potente para sensores hall y cierres.", pkg: "Varios", min: 2 },
  { keys: ["TRANSFORMADOR"], name: "Transformador", cat: "Otros", desc: "Baja tensión de red para fuentes. Indicá primario y secundario.", pkg: "Varios", min: 1 },
  { keys: ["BUZZER", "ZUMBADOR"], name: "Buzzer 5V", cat: "Otros", desc: "Zumbador activo (suena solo) o pasivo (tono por PWM).", pkg: "12mm", min: 3 },
  { keys: ["PULSADOR", "BUTTON", "TACT", "MICROSWITCH", "FINAL DE CARRERA", "SWITCH"], name: "Pulsador táctil", cat: "Otros", desc: "Switch momentáneo 6x6mm o final de carrera para detectar posición.", pkg: "Varios", min: 10 },
  { keys: ["DISIPADOR", "HEATSINK"], name: "Disipador", cat: "Otros", desc: "Aluminio para refrigerar reguladores y transistores TO-220.", pkg: "Varios", min: 3 },
  { keys: ["PORTAPILAS", "PORTA PILAS", "PORTABATERIA", "BROCHE 9V", "CLIP 9V", "CLIP BATERIA"], name: "Portapilas", cat: "Insumos", desc: "Portapilas AA/AAA/9V. Completá formato.", pkg: "Varios", min: 2 },
  { keys: ["CR2032", "PILA BOTON", "PILA RELOJ"], name: "Pila botón", cat: "Otros", desc: "Pila botón 3V para RTC y controles.", pkg: "CR2032", min: 3 },
  { keys: ["LIPO 2S", "LIPO 3S", "7.4V", "11.1V", "BATERIA LIPO"], name: "Batería LiPo", cat: "Otros", desc: "Batería LiPo para RC y drones. Completá celdas y mAh.", pkg: "Varios", min: 1 },
  { keys: ["18650", "BATERIA", "PILA", "LIPO", "BATERÍA", "ALCALINA"], name: "Batería 18650", cat: "Otros", desc: "Batería recargable Li-ion. Indicá capacidad en mAh.", pkg: "18650", min: 2 },
  { keys: ["MODULO RELE", "RELE 2 CANALES", "RELE 4 CANALES", "RELE 8 CANALES", "RELAY MODULE"], name: "Módulo relé", cat: "Módulos / Placas", desc: "Módulo de 2/4/8 relés con optoacoplador.", pkg: "Módulo", min: 1 },
  { keys: ["RELE", "RELAY", "SRD-05"], name: "Relé 5V", cat: "Otros", desc: "Interruptor electromecánico para cargas AC/DC.", pkg: "Módulo", min: 3 },
  // --- Conectores ---
  { keys: ["ELECTROLITICO", "CAPACITOR ELECTROLITICO"], name: "Capacitor electrolítico", cat: "Capacitores", desc: "Electrolítico polarizado. Completá capacidad y voltaje.", pkg: "Radial", min: 10 },
  { keys: ["CERAMICO", "CAPACITOR CERAMICO", "MLCC"], name: "Capacitor cerámico", cat: "Capacitores", desc: "Cerámico multicapa. Completá capacidad y voltaje.", pkg: "Varios", min: 10 },
  { keys: ["POLIESTER", "FILM", "MKT", "MKP"], name: "Capacitor poliéster", cat: "Capacitores", desc: "De film para audio y filtros. Completá capacidad y voltaje.", pkg: "Varios", min: 5 },
  { keys: ["TANTALIO", "TANTALUM"], name: "Capacitor tantalio", cat: "Capacitores", desc: "Tantalio polarizado, compacto. Completá capacidad y voltaje.", pkg: "SMD", min: 5 },
  { keys: ["SUPERCAPACITOR", "SUPERCAP"], name: "Supercapacitor", cat: "Capacitores", desc: "Gran capacidad en faradios para respaldo.", pkg: "Varios", min: 1 },
  { keys: ["CAPACITOR SMD", "CONDENSADOR SMD"], name: "Capacitor SMD", cat: "Capacitores", desc: "Capacitor chip. Completá capacidad y voltaje.", pkg: "SMD", min: 10 },
  { keys: ["BORNERA", "BORNE", "TERMINAL BLOCK"], name: "Bornera", cat: "Conectores", desc: "Conector a tornillo para cables en PCB.", pkg: "5.08mm", min: 10 },
  { keys: ["JUMPER", "DUPONT"], name: "Jumpers Dupont", cat: "Conectores", desc: "Cables para protoboard y conexiones rápidas.", pkg: "M-H/M-M", min: 1 },
  { keys: ["HEADER", "PIN HEADER", "PINES"], name: "Tira de pines", cat: "Conectores", desc: "Pines macho/hembra para PCB y módulos.", pkg: "2.54mm", min: 5 },
  { keys: ["DC JACK", "JACK DC", "CONECTOR DC"], name: "Jack DC", cat: "Conectores", desc: "Jack de alimentación 5.5x2.1mm para fuentes.", pkg: "Panel/PCB", min: 3 },
  { keys: ["JST"], name: "Conector JST", cat: "Conectores", desc: "Conector chico para baterías y placas (ej: JST-XH).", pkg: "Varios", min: 5 },
  { keys: ["JACK 3.5", "JACK AUDIO", "AUDIO JACK", "PLUG 3.5"], name: "Jack 3.5mm", cat: "Conectores", desc: "Jack estéreo 3.5mm para audio.", pkg: "Panel/PCB", min: 3 },
  { keys: ["COCODRILO", "CAIMAN", "PINZA COCODRILO"], name: "Pinza cocodrilo", cat: "Conectores", desc: "Pinza cocodrilo para pruebas y fuentes.", pkg: "Varios", min: 5 },
  { keys: ["USB", "USB-A", "MICRO USB", "USB-C", "TYPE-C", "CONECTOR USB"], name: "Conector USB", cat: "Conectores", desc: "Conector USB. Completá tipo (A, micro o C).", pkg: "Varios", min: 3 },
  { keys: ["BANANA", "PLUG BANANA", "BINDING POST"], name: "Banana", cat: "Conectores", desc: "Conectores banana para fuentes y pruebas.", pkg: "Varios", min: 4 },
  { keys: ["TERMINAL PALA", "TERMINAL ANILLO", "TERMINAL OJAL", "FASTON"], name: "Terminales", cat: "Conectores", desc: "Terminales pala/anillo para crimpar cables.", pkg: "Varios", min: 10 },
  { keys: ["DB9", "CONECTOR DB9", "PUERTO SERIE DB9"], name: "DB9", cat: "Conectores", desc: "Conector serie de 9 pines.", pkg: "Varios", min: 2 },
  { keys: ["RJ45", "ETHERNET", "CONECTOR RED"], name: "RJ45", cat: "Conectores", desc: "Jack de red Ethernet con LEDs.", pkg: "Varios", min: 2 },
  { keys: ["SONDA", "SONDA GANCHO", "GRABBER", "PUNTA PRUEBA"], name: "Sonda gancho", cat: "Conectores", desc: "Punta de prueba con gancho para medir.", pkg: "Varios", min: 2 },
  // --- Insumos / herramientas de taller ---
  { keys: ["ESTAÑO", "ESTANO", "STANNOL", "60/40", "63/37", "ROLLO DE ESTAÑO"], name: "Estaño", cat: "Insumos", desc: "Rollo de estaño para soldar. Completá aleación y diámetro (ej: 60/40 0.8mm).", pkg: "Rollo", min: 2 },
  { keys: ["FLUX", "FUNDENTE"], name: "Flux", cat: "Insumos", desc: "Flux para mejorar la soldadura SMD y THT.", pkg: "Jeringa/frasco", min: 2 },
  { keys: ["PASTA DE SOLDAR", "SOLDER PASTE", "PASTA SMD"], name: "Pasta de soldar", cat: "Insumos", desc: "Pasta para soldar SMD con stencil o jeringa.", pkg: "Jeringa", min: 1 },
  { keys: ["MALLA DESOLDANTE", "MALLA PARA DESOLDAR", "SOLDER WICK", "TRENZA DESOLDANTE"], name: "Malla desoldante", cat: "Insumos", desc: "Malla de cobre para retirar estaño.", pkg: "Rollo", min: 2 },
  { keys: ["ALCOHOL ISOPROPILICO", "ISOPROPANOL", "ALCOHOL ISOPROPÍLICO"], name: "Alcohol isopropílico", cat: "Insumos", desc: "Para limpiar flux y placas.", pkg: "1L", min: 1 },
  { keys: ["PASTA TERMICA", "GRASA TERMICA", "THERMAL PASTE"], name: "Pasta térmica", cat: "Insumos", desc: "Pasta para mejorar contacto con disipadores.", pkg: "Jeringa", min: 1 },
  { keys: ["CAUTIN", "CAUTÍN", "SOLDADOR", "LAPIZ SOLDADOR"], name: "Cautín", cat: "Insumos", desc: "Cautín para soldar. Completá potencia (ej: 60W).", pkg: "Varios", min: 1 },
  { keys: ["ESTACION DE SOLDADO", "ESTACION SOLDADURA"], name: "Estación de soldado", cat: "Insumos", desc: "Estación con control de temperatura.", pkg: "Equipo", min: 1 },
  { keys: ["PUNTA CAUTIN", "PUNTAS DE CAUTIN", "PUNTA LOGICA", "REPUESTO CAUTIN"], name: "Puntas de cautín", cat: "Insumos", desc: "Puntas de repuesto / punta lógica para testear.", pkg: "Varios", min: 3 },
  { keys: ["DESOLDADOR", "CHUPON", "BOMBA DESOLDANTE", "SOLDER SUCKER"], name: "Desoldador", cat: "Insumos", desc: "Bomba/chupón para retirar estaño fundido.", pkg: "Varios", min: 1 },
  { keys: ["MULTIMETRO", "MULTÍMETRO", "TESTER", "POLIMETRO"], name: "Multímetro", cat: "Insumos", desc: "Para medir tensión, corriente y continuidad.", pkg: "Equipo", min: 1 },
  { keys: ["BRUCELAS", "TWEEZER", "PINZA PRECISION"], name: "Brucelas", cat: "Insumos", desc: "Pinza de precisión para SMD.", pkg: "Varios", min: 1 },
  { keys: ["PINZA", "ALICATE", "PELACABLES", "CUTTER"], name: "Pinza / alicate", cat: "Insumos", desc: "Herramienta de mano: corte, punta o pelacables.", pkg: "Varios", min: 1 },
  { keys: ["KAPTON", "CINTA AISLANTE", "CINTA AISLADORA", "CINTA ELECTRICA"], name: "Cinta Kapton/aislante", cat: "Insumos", desc: "Cinta para aislar y enmascarar.", pkg: "Rollo", min: 2 },
  { keys: ["TERMOCONTRAIBLE", "TUBO TERMOCONTRAIBLE", "HEAT SHRINK", "ESPAGUETI"], name: "Termocontraíble", cat: "Insumos", desc: "Tubo para aislar empalmes. Completá diámetro.", pkg: "Varios", min: 2 },
  { keys: ["PCB", "PLAQUETA", "PERFBOARD", "PCB VIRGEN", "FENOLICO", "FIBRA DE VIDRIO", "DOT MATRIX", "PLAQUETA UNIVERSAL"], name: "PCB / plaqueta", cat: "Insumos", desc: "Placa virgen o perforada para prototipos. Completá tipo y tamaño.", pkg: "Varios", min: 2 },
  { keys: ["HOTEND", "NOZZLE", "BOQUILLA"], name: "Hotend", cat: "Insumos", desc: "Hotend y boquillas para impresora 3D.", pkg: "Varios", min: 1 },
  { keys: ["FILAMENTO", "PLA", "ABS", "PETG", "TPU"], name: "Filamento", cat: "Insumos", desc: "Bobina para impresión 3D. Completá material y kilos.", pkg: "1kg", min: 1 },
  { keys: ["TERCERA MANO", "THIRD HAND", "SOPORTE PCB"], name: "Tercera mano", cat: "Insumos", desc: "Soporte con lupa y cocodrilos para soldar.", pkg: "Varios", min: 1 },
  { keys: ["ESPONJA SOLDADOR", "LIMPIACAUTIN", "BRONCE LIMPIADOR", "LIMPIA PUNTAS"], name: "Limpia puntas", cat: "Insumos", desc: "Esponja o bronce para limpiar la punta del cautín.", pkg: "Varios", min: 2 },
  { keys: ["HUSILLO", "TORNILLO T8", "LEADSCREW", "TUERCA T8"], name: "Husillo T8", cat: "Insumos", desc: "Husillo con tuerca para eje Z de 3D/CNC.", pkg: "Varios", min: 1 },
  { keys: ["VARILLA LISA", "EJE 8MM", "RODAMIENTO LINEAL", "LM8UU"], name: "Varilla lisa", cat: "Insumos", desc: "Guía lineal 8mm con rodamientos LM8UU.", pkg: "Varios", min: 2 },
  { keys: ["CORREA GT2", "POLEA GT2", "GT2"], name: "Correa GT2", cat: "Insumos", desc: "Correa y poleas dentadas para 3D/CNC.", pkg: "Varios", min: 1 },
  { keys: ["TORNILLO", "SEPARADOR", "STANDOFF", "TUERCA", "DISTANCIADOR"], name: "Tornillería", cat: "Insumos", desc: "Tornillos M2/M3, tuercas y separadores para placas.", pkg: "Varios", min: 5 },
  { keys: ["LUPA", "LUPA CON LUZ"], name: "Lupa", cat: "Insumos", desc: "Lupa con luz para soldar SMD.", pkg: "Varios", min: 1 },
  { keys: ["ANTIESTATICA", "PULSERA ESD", "ESTERILLA ESD"], name: "Antiestática", cat: "Insumos", desc: "Pulsera/esterilla ESD para proteger CMOS.", pkg: "Varios", min: 1 },
  { keys: ["DOBLE FAZ", "CINTA DOBLE"], name: "Cinta doble faz", cat: "Insumos", desc: "Cinta doble faz para fijar módulos y placas.", pkg: "Rollo", min: 1 },
  { keys: ["DSO138", "OSCILOSCOPIO"], name: "DSO138", cat: "Insumos", desc: "Mini osciloscopio en kit para el taller.", pkg: "Kit", min: 1 },
  { keys: ["FUENTE", "FUENTE LABORATORIO", "FUENTE REGULABLE", "FUENTE 30V"], name: "Fuente laboratorio", cat: "Insumos", desc: "Fuente regulable de banco. Completá volts/amperes.", pkg: "Equipo", min: 1 },
  { keys: ["DESTORNILLADOR", "SET PRECISION", "TORX"], name: "Destornilladores", cat: "Insumos", desc: "Set de precisión para electrónica.", pkg: "Set", min: 1 },
  { keys: ["ADAPTADOR SOIC", "SOIC", "PLACA ADAPTADORA"], name: "Adaptador SOIC", cat: "Insumos", desc: "Placa para pasar SMD a DIP.", pkg: "Varios", min: 2 },
];

// Genéricos por fragmento: enganchan escritura parcial ("RESI", "CAPA", "DIOD...")
// Se buscan DESPUÉS de la base exacta, para no tapar códigos específicos.
const GENERIC = [
  { frag: ["RESIST"], name: "Resistencia", cat: "Resistencias", desc: "Resistencia. Limita la corriente. Completá valor en ohm y potencia.", pkg: "Axial", min: 10 },
  { frag: ["CAPACIT", "CONDENS"], name: "Capacitor", cat: "Capacitores", desc: "Capacitor. Almacena energía. Completá capacidad y voltaje.", pkg: "Varios", min: 10 },
  { frag: ["DIODO", "DIODE"], name: "Diodo", cat: "Diodos / LED", desc: "Diodo. Completá tipo y valores.", pkg: "Varios", min: 10 },
  { frag: ["TRANSIST"], name: "Transistor", cat: "Transistores", desc: "Transistor. Completá modelo (ej: BC547) y polaridad.", pkg: "Varios", min: 5 },
  { frag: ["INDUCT", "BOBINA"], name: "Inductor", cat: "Otros", desc: "Bobina para filtros y fuentes. El valor va en uH/mH.", pkg: "Varios", min: 5 },
  { frag: ["REGULA"], name: "Regulador", cat: "Reguladores", desc: "Regulador de tensión. Completá modelo (ej: 7805) y voltaje.", pkg: "Varios", min: 3 },
  { frag: ["SENSOR"], name: "Sensor", cat: "Sensores", desc: "Sensor. Completá qué mide y el modelo.", pkg: "Módulo", min: 2 },
  { frag: ["CONECT"], name: "Conector", cat: "Conectores", desc: "Conector. Completá tipo y paso.", pkg: "Varios", min: 5 },
  { frag: ["FUSIB", "FUSE"], name: "Fusible", cat: "Otros", desc: "Protección contra sobrecorriente. Indicá amperes y tamaño.", pkg: "5x20mm", min: 10 },
  { frag: ["CRIST", "XTAL"], name: "Cristal", cat: "Otros", desc: "Genera reloj estable. El valor va en MHz (ej: 16MHz).", pkg: "HC-49", min: 5 },
  { frag: ["BUZZER", "ZUMBAD"], name: "Buzzer 5V", cat: "Otros", desc: "Zumbador activo o pasivo.", pkg: "12mm", min: 3 },
  { frag: ["POTENCI"], name: "Potenciómetro", cat: "Resistencias", desc: "Resistencia variable. El código indica el valor (ej: B10K).", pkg: "Lineal", min: 5 },
  { frag: ["ESTAÑO", "ESTANO", "FLUX", "SOLDAD", "HERRAMI"], name: "Insumo de soldadura", cat: "Insumos", desc: "Insumo de taller para soldar. Completá tipo y medida.", pkg: "Varios", min: 2 },
  { frag: ["PCB", "PLAQUETA", "PERFBOARD"], name: "PCB / plaqueta", cat: "Insumos", desc: "Placa para prototipos. Completá tipo y tamaño.", pkg: "Varios", min: 2 },
  { frag: ["CABLE", "WIRE", "ALAMBRE"], name: "Cable", cat: "Conectores", desc: "Cable/conductor. Completá calibre (AWG o mm), color y largo.", pkg: "Rollo", min: 1 },
  { frag: ["APDS", "TSL25", "VL53", "SHT3", "TCS3", "TSOP", "KY-0", "FC-3", "INA2", "ACS7", "ADXL", "QMC", "HMC", "BME6", "A3144", "SW-4", "SW-5"], name: "Sensor (código)", cat: "Sensores", desc: "Sensor por código. Completá qué mide y el modelo.", pkg: "Módulo", min: 1 },
  { frag: ["MJE", "C945", "A733", "C181", "A101", "S805", "S855"], name: "Transistor (código)", cat: "Transistores", desc: "Transistor por código. Verificá NPN/PNP en el datasheet.", pkg: "TO-92", min: 5 },
  { frag: ["TB65", "TB66", "L911", "MX15"], name: "Driver (código)", cat: "Drivers", desc: "Driver por código. Completá modelo y corriente.", pkg: "Módulo", min: 1 },
  { frag: ["LM11", "AMS1"], name: "Regulador LDO", cat: "Reguladores", desc: "Regulador LDO. Completá modelo y voltaje.", pkg: "SOT-223", min: 3 },
];

function genericMatch(t) {
  const toks = t.split(/[^A-Z0-9]+/).filter((x) => x.length >= 3);
  for (const g of GENERIC) {
    if (g.frag.some((f) => t.includes(f))) return { type: "generic", g, partial: false };
  }
  for (const g of GENERIC) {
    if (g.frag.some((f) => toks.some((tok) => f.startsWith(tok)))) return { type: "generic", g, partial: true };
  }
  for (const b of (BRANDS || [])) {
    if (b.keys.some((k) => toks.some((tok) => tok.length >= 4 && k.startsWith(tok)))) return { type: "brand", b };
  }
  return null;
}

// Marcas solas (sin modelo): piden el modelo en vez de adivinar
const BRANDS = [
  { keys: ["POLOLU"], brand: "Pololu", cat: "Módulos / Placas", desc: "Módulo marca Pololu (drivers, motores o sensores).", min: 2 },
  { keys: ["ARDUINO"], brand: "Arduino", cat: "Módulos / Placas", desc: "Placa Arduino.", min: 1 },
  { keys: ["ADAFRUIT", "SPARKFUN", "ELEGOO", "KEYESTUDIO"], brand: "marca maker", cat: "Módulos / Placas", desc: "Módulo de marca maker (sensor, display o placa).", min: 1 },
];

// Familias por patrón (cubre cientos de códigos sin listarlos uno por uno,
// incluyendo escritura parcial: "TIP3", "BC54", "1N40", "74HC", "L78"...)
const FAMILIES = [
  { re: /\b74(HC|HCT|LS|AC|ACT|LVC)?\d{0,4}[A-Z]?\b/, cat: "ICs", desc: "IC lógico serie 74xx. Completá el código e indicá la función.", pkg: "DIP/SMD", min: 3 },
  { re: /\bCD4\d{0,3}\b/, cat: "ICs", desc: "IC lógico CMOS serie 4000. Completá el código.", pkg: "DIP-16", min: 3 },
  { re: /\b24C\d{2,3}\b/, cat: "ICs", desc: "Memoria EEPROM serie 24C. Completá el código.", pkg: "DIP-8", min: 2 },
  { re: /\bL?78(\d{0,2})\b/, cat: "Reguladores", desc: "Regulador lineal positivo (el número es el voltaje).", pkg: "TO-220", min: 5, voltFrom: 1 },
  { re: /\bL?79(\d{0,2})\b/, cat: "Reguladores", desc: "Regulador lineal negativo (el número es el voltaje).", pkg: "TO-220", min: 3, voltFrom: 1 },
  { re: /\bAMS1117-?(\d\.?\d?)?\b/, cat: "Reguladores", desc: "Regulador LDO de bajo dropout.", pkg: "SOT-223", min: 5, voltFrom: 1 },
  { re: /\b1N\d{1,4}[A-Z]?\b/, cat: "Diodos / LED", desc: "Diodo serie 1N (400x rectificador, 4148 señal, 47xx zener, 58xx Schottky). Completá el código.", pkg: "DO-41", min: 10 },
  { re: /\b(BC\d{0,3}|2N\d{0,5}|2S[ABCD]?\d*|BD\d{0,3}|TIP\d{0,4}|MPSA\d*|MPS2222A?|BCW\d*)\b/, cat: "Transistores", desc: "Transistor bipolar (verificá NPN/PNP en el datasheet).", pkg: "TO-92/220", min: 5 },
  { re: /\b(IRF\d{0,4}[A-Z]*|IRL\w*|STP\d*\w*|FQP\d*\w*|AO\d+|SI\d+|2N7000|BS170)\b/, cat: "Transistores", desc: "MOSFET de potencia o señal (verificá canal N/P).", pkg: "TO-220/92", min: 5 },
  { re: /\b(BT1[36]?\d?|BTA\d*|BTB\d*|TIC\d*|MAC\d*|MCR\d*|Q\d{0,4}L?\d?|TYN\d*|C106\w*)\b/, cat: "Tiristores", desc: "TRIAC o SCR para control de potencia AC/DC. Completá el código.", pkg: "TO-220/92", min: 4 },
  { re: /\b(ATMEGA\d*\w*|ATTINY\d*|PIC\d*\w*|STM32\w*)\b/, cat: "ICs", desc: "Microcontrolador (chip). Si es placa, elegí Módulos / Placas.", pkg: "Varios", min: 2 },
];

function parseSpecs(text) {
  const t = (text || "").toUpperCase().replace(",", ".");
  const out = {};
  let m;
  m = t.match(/(\d+(?:\.\d+)?)\s*(PF|NF|UF|MF|F)\b/) || t.match(/(\d+)[U](\d+)/);
  if (m) out.cap = m[0].replace(/\s+/g, "");
  m = t.match(/(\d+(?:\.\d+)?)\s*(MEG|M|K|R|OHM|OHMIOS?)\b/) || t.match(/\b(\d+[KR]\d+)\b/);
  if (m && !out.cap) out.res = m[0].replace(/\s+/g, "");
  m = t.match(/(\d+(?:\.\d+)?)\s*(KV|V)\b/);
  if (m) out.volt = m[0].replace(/\s+/g, "");
  m = t.match(/\b([3-9]\.\d)\b/);
  if (m && !out.volt) out.volt = m[1] + "V";
  m = t.match(/(1\/\d+W|\d+(?:\.\d+)?\s*W)\b/);
  if (m) out.watts = m[0].replace(/\s+/g, "");
  m = t.match(/(\d+(?:\.\d+)?)\s*A\b/);
  if (m) out.amps = m[0].replace(/\s+/g, "");
  m = t.match(/(\d+(?:\.\d+)?)\s*(MHZ|KHZ|GHZ|HZ)\b/);
  if (m) out.freq = m[0].replace(/\s+/g, "");
  m = t.match(/(\d+(?:\.\d+)?)\s*(MTS|METROS?|MT)\b/);
  if (m) out.len = m[0].replace(/\s+/g, "");
  m = t.match(/(\d+(?:\.\d+)?)\s*(MM2|MM|CM)\b/) || t.match(/(\d+)\s*AWG\b/);
  if (m) out.size = m[0].replace(/\s+/g, "");
  return out;
}

function guessCat(t) {
  if (/UF|NF|PF\b|CAPACIT|CONDENS|ELECTROLIT|CERAMIC|\bCAP\b/.test(t)) return "Capacitores";
  if (/RESIST|\bRES\b|OHM|K7\b|K\b.*OHM|\b\d+K\d*\b|\b\d+R\b|POTENCI|PRESET|TRIMMER/.test(t)) return "Resistencias";
  if (/TRIAC|TIRISTOR|THYRISTOR|SCR\b|BT13|TIC226|MAC97|Q60|MOC30|PC817|OPTO/.test(t)) return "Tiristores";
  if (/7805|7812|7905|LM317|TL431|AMS1117|LM2596|MT3608|REGULAD|REGULATOR|STEP/.test(t)) return "Reguladores";
  if (/MOSFET|IRF|IRL|TIP3|TIP4|BC54|BC55|2N22|2N39|TRANSIST|BD13|BD14/.test(t)) return "Transistores";
  if (/1N40|1N41|1N54|1N58|ZENER|DIODE|DIODO|LED|SCHOTTKY|PUENTE|BRIDGE/.test(t)) return "Diodos / LED";
  if (/DRIVER|A4988|DRV|L298|TMC22/.test(t)) return "Drivers";
  if (/555|LM324|LM358|LM386|ULN200|ATMEGA|PIC\b|OPERACIONAL|LOGIC|74HC|CD40/.test(t)) return "ICs";
  if (/ESTAÑO|ESTANO|FLUX|FUNDENTE|SOLDAD|CAUTIN|MULTIMETRO|TESTER|PINZA|ALICATE|PELACABLES|KAPTON|TERMOCONTRAIBLE|HEAT SHRINK|PCB|PLAQUETA|PERFBOARD|FENOLICO|PORTAPILAS|DESOLDAD|CHUPON|TERCERA MANO|ISOPROPILICO|MALLA|TORNILLO|SEPARADOR|STANDOFF|HERRAMIENTA/.test(t)) return "Insumos";
  if (/ARDUINO|ESP32|ESP8266|\bESP\b|NANO\b|UNO\b|MEGA\b|PICO|PILL|DEVKIT|MODULO|MÓDULO|MODULE|BOARD|PLACA|SHIELD|SERVO|MOTOR|LCD|OLED|DISPLAY|TECLADO|KEYPAD|JOYSTICK|ENCODER|BLUETOOTH|WIFI|GSM|GPS|RFID|BATTERY|BATER/.test(t)) return "Módulos / Placas";
  if (/DHT|HC-SR04|HC-SR501|BMP|MPU|DS18B20|SENSOR|LDR|NTC|MQ-|HX711|PIR|ULTRASON/.test(t)) return "Sensores";
  if (/BORNERA|BORNE|JUMPER|DUPONT|CONECTOR|CONNECTOR|HEADER|PINES|JACK|JST|TERMINAL|BUTTON|CABLE/.test(t)) return "Conectores";
  if (/FUSE|FUSIBLE|CRISTAL|CRYSTAL|XTAL|BUZZER|ZUMBADOR|INDUCTOR|BOBINA|TRANSFORM|PROTOBOARD|BREADBOARD/.test(t)) return "Otros";
  return null;
}

// Palabras explícitas del usuario (ES+EN): si aparecen, la categoría se muestra
// aunque falten valores. Unidades sueltas tipo "uF" u "ohm" también valen.
function isStrongMatch(t) {
  const toks = t.split(/[^A-Z0-9]+/).filter(Boolean);
  if (toks.some((x) => ["UF", "NF", "PF", "OHM", "OHMS", "OHMIOS", "FARAD", "FARADIO"].includes(x))) return true;
  return /\b(RES|RESISTOR|RESISTENCIA|CAPACITOR|CONDENSADOR|CONDENS|ELECTROLITICO|CERAMICO|CERAMIC|INDUCTOR|BOBINA|DIODE|DIODO|TRANSISTOR|TRIAC|TIRISTOR|THYRISTOR|SCR|RELAY|RELE|FUSE|FUSIBLE|POTENTIOMETER|POTENCIOMETRO|PRESET|TRIMMER|REGULATOR|REGULADOR|CRYSTAL|CRISTAL|BUZZER|ZUMBADOR|BUTTON|PULSADOR|SWITCH|SENSOR|MODULE|MODULO|MÓDULO|BOARD|PLACA|DISPLAY|ENCODER|SERVO|MOTOR|BATTERY|BATERIA|CONNECTOR|CONECTOR|CABLE|WIRE|BRIDGE|PUENTE|ZENER|MOSFET|HEATSINK|DISIPADOR|TRANSFORMER|TRANSFORMADOR|KEYPAD|TECLADO|JOYSTICK|DRIVER|ARDUINO|NANO|UNO|MEGA|PICO|ESP|LCD|OLED|TFT|BLUETOOTH|WIFI|GSM|GPRS|GPS|RFID|DHT|BMP|MPU|PIR|LDR|NTC|BORNERA|BORNE|JUMPER|DUPONT|HEADER|PINES|JACK|JST|PROTOBOARD|BREADBOARD|OPTO|OPTOACOPLADOR|IRF|IRL|TIP|ESTAÑO|ESTANO|FLUX|SOLDADURA|SOLDADOR|CAUTIN|MULTIMETRO|TESTER|PINZA|ALICATE|KAPTON|TERMOCONTRAIBLE|PCB|PLAQUETA|PERFBOARD|PORTAPILAS|DESOLDADOR|ISOPROPILICO|MALLA|TORNILLO|SEPARADOR|STANDOFF|PELACABLES|FENOLICO|PASTA)\b/.test(t);
}

function requiredFor(cat) {
  if (cat === "Capacitores") return [["cap", "capacidad (ej: 100uF)"], ["volt", "voltaje (ej: 25V)"]];
  if (cat === "Resistencias") return [["res", "valor en ohm (ej: 10K, 4K7)"], ["watts", "potencia (ej: 1/4W)"]];
  if (cat === "Tiristores") return [["amps", "corriente (ej: 15A)"], ["volt", "tensión (ej: 600V)"]];
  if (cat === "Reguladores") return [["volt", "tensión de salida (ej: 5V)"]];
  if (cat === "Diodos / LED") return [];
  return [];
}

function analyzePart(text) {
  const t = (text || "").toUpperCase().trim();
  if (t.length < 2) return null;
  const hit = KNOWLEDGE.find((k) => k.keys.some((key) => key.length >= 3 && t.includes(key))) || null;
  if (hit) {
    const specs = parseSpecs(t);
    if (hit.specs) Object.assign(specs, hit.specs);
    const missing = requiredFor(hit.cat).filter(([k]) => !specs[k]).map(([, l]) => l);
    return { hit, cat: hit.cat, desc: hit.desc, pkg: hit.pkg, min: hit.min, specs, missing, confident: true };
  }
  const brand = (BRANDS || []).find((b) => b.keys.some((key) => t.includes(key))) || null;
  if (brand) {
    return { hit: null, brand: brand.brand, cat: brand.cat, desc: brand.desc, pkg: "", min: brand.min, specs: {}, missing: ["modelo exacto (ej: A4988, DRV8825, UNO R3)"], confident: true };
  }
  const gm = (typeof genericMatch === 'function') ? genericMatch(t) : null;
  if (gm && gm.type === "brand") {
    return { hit: null, brand: gm.b.brand, cat: gm.b.cat, desc: gm.b.desc + " (escribiendo…)", pkg: "", min: gm.b.min, specs: {}, missing: ["modelo exacto (ej: A4988, DRV8825, UNO R3)"], confident: true };
  }
  if (gm) {
    const specs = parseSpecs(t);
    const missing = requiredFor(gm.g.cat).filter(([k]) => !specs[k]).map(([, l]) => l);
    return { hit: null, generic: !gm.partial, cat: gm.g.cat, desc: gm.g.desc + (gm.partial ? " (escribiendo…)" : ""), pkg: gm.g.pkg, min: gm.g.min, specs, missing, confident: true };
  }
  for (const f of (FAMILIES || [])) {
    const m = t.match(f.re);
    if (m) {
      const specs = parseSpecs(t);
      if (f.voltFrom && m[f.voltFrom] && !specs.volt) {
        const vv = m[f.voltFrom];
        specs.volt = (vv.includes(".") ? vv : String(parseInt(vv, 10))) + "V";
      }
      const missing = requiredFor(f.cat).filter(([k]) => !specs[k]).map(([, l]) => l);
      return { hit: null, family: true, cat: f.cat, desc: f.desc, pkg: f.pkg, min: f.min, specs, missing, confident: true };
    }
  }
  const specs = parseSpecs(t);
  const cat = guessCat(t);
  if (!cat) {
    if (specs.cap) return { hit: null, cat: "Capacitores", desc: "Capacitor. Almacena energía, filtra y desacopla.", pkg: "", min: 10, specs, missing: requiredFor("Capacitores").filter(([k]) => !specs[k]).map(([, l]) => l), confident: true };
    if (specs.res) return { hit: null, cat: "Resistencias", desc: "Resistencia. Limita la corriente.", pkg: "", min: 10, specs, missing: requiredFor("Resistencias").filter(([k]) => !specs[k]).map(([, l]) => l), confident: true };
    return null;
  }
  const hasSpecs = Object.keys(specs).length > 0;
  const strong = (typeof isStrongMatch === 'function') ? isStrongMatch(t) : false;
  const desc = cat === "Capacitores" ? "Capacitor. Almacena energía, filtra y desacopla." : cat === "Resistencias" ? "Resistencia. Limita la corriente." : cat === "Otros" ? "Componente varios. Revisá la categoría." : "Componente " + cat + ". Revisá que la categoría sea correcta.";
  const missing = requiredFor(cat).filter(([k]) => !specs[k]).map(([, l]) => l);
  return { hit: null, cat, desc, pkg: "", min: 5, specs, missing, confident: hasSpecs || strong };
}

function lookupPart(text) {
  const a = analyzePart(text);
  return a && a.hit ? a.hit : a ? { name: "", cat: a.cat, desc: a.desc, pkg: a.pkg, min: a.min } : null;
}

// Normaliza unidades: 100UF→100uF, 25v→25V, 2a→2A, 1/4w→1/4W, 10k→10K
function normCap(raw) {
  const m = String(raw || "").replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(PF|NF|UF|MF|F)/i);
  if (!m) return raw;
  const units = { PF: "pF", NF: "nF", UF: "uF", MF: "mF", F: "F" };
  return m[1] + (units[m[2].toUpperCase()] || m[2]);
}
function normVolt(raw) {
  const m = String(raw || "").replace(",", ".").match(/(\d+(?:\.\d+)?)\s*(KV|V)/i);
  if (!m) return raw;
  return m[1] + (m[2].toUpperCase() === "KV" ? "kV" : "V");
}
function normAmps(raw) {
  const m = String(raw || "").replace(",", ".").match(/(\d+(?:\.\d+)?)\s*A/i);
  if (!m) return raw;
  return m[1] + "A";
}
function normWatts(raw) {
  const m = String(raw || "").trim().match(/(1\/\d+)\s*W?/i);
  if (m) return m[1] + "W";
  const m2 = String(raw || "").replace(",", ".").match(/(\d+(?:\.\d+)?)\s*W/i);
  if (!m2) return raw;
  return m2[1] + "W";
}
function normRes(raw) {
  const s = String(raw || "").replace(",", ".").trim();
  const m = s.match(/(\d+(?:\.\d+)?)\s*(MEG|M|K|R|OHM|OHMIOS?)/i) || s.match(/\b(\d+[KR]\d+)\b/i);
  if (!m) return raw;
  return m[0].toUpperCase().replace(/\s+/g, "").replace(/OHM|OHMIOS?/, "Ω");
}
function prettySpecs(specs) {
  const o = {};
  if (!specs) return o;
  if (specs.cap) o.cap = normCap(specs.cap);
  if (specs.res) o.res = normRes(specs.res);
  if (specs.volt) o.volt = normVolt(specs.volt);
  if (specs.amps) o.amps = normAmps(specs.amps);
  if (specs.watts) o.watts = normWatts(specs.watts);
  if (specs.freq) o.freq = String(specs.freq).toUpperCase().replace(/\s+/g, "");
  if (specs.len) o.len = String(specs.len).toUpperCase().replace(/\s+/g, "");
  if (specs.size) o.size = String(specs.size).toUpperCase().replace(/\s+/g, "");
  return o;
}
// Reparte en los 2 campos del formulario: Valor y Detalle
function splitValSpec(cat, specs) {
  const p = prettySpecs(specs || {});
  if (cat === "Capacitores") return { val: p.cap || "", spec: p.volt || "" };
  if (cat === "Resistencias") return { val: p.res || "", spec: p.watts || "" };
  if (cat === "Tiristores") return { val: p.amps || "", spec: p.volt || "" };
  if (cat === "Reguladores" || cat === "Diodos / LED") return { val: p.volt || "", spec: p.amps || "" };
  return { val: p.size || p.len || p.cap || p.res || p.amps || p.freq || "", spec: [p.volt, p.watts].filter(Boolean).join(" ") };
}
