import math

# ==========================================
# 1. DEFINICIÓN DEL DATASET DE ENTRENAMIENTO
# ==========================================
# Estructura: [ISC, Temp, Humedad, Viento, DiasSinLluvia]
# Basado en los umbrales teóricos del Sistema UJED
dataset = [
    # Casos de Riesgo Bajo (Clase 0)
    {"x": [35, 15, 80, 3, 1],  "y": 0},
    {"x": [45, 20, 70, 4, 3],  "y": 0},
    {"x": [55, 25, 60, 5, 5],  "y": 0},
    
    # Casos de Riesgo Alto (Clase 1)
    {"x": [65, 30, 50, 6, 14], "y": 1},
    {"x": [80, 35, 40, 7, 20], "y": 1},
    {"x": [95, 40, 30, 8, 30], "y": 1}
]

# ==========================================
# 2. FUNCIÓN DE NORMALIZACIÓN (Feature Scaling)
# ==========================================
def normalize(row):
    # Mapea los valores físicos al rango [0, 1] para estabilidad numérica
    # Divisores basados en máximos históricos locales (Valle de Bravo)
    return [
        row[0] / 100.0,  # ISC (Máx 100)
        row[1] / 40.0,   # Temp (Máx 40°C)
        row[2] / 100.0,  # Humedad (Máx 100%)
        row[3] / 10.0,   # Viento (Máx 10 m/s)
        row[4] / 30.0    # Días sin lluvia (Máx 30)
    ]

# Preprocesamiento del dataset
X_norm = [normalize(d["x"]) for d in dataset]
Y = [d["y"] for d in dataset]
m = len(Y)  # Número de ejemplos de entrenamiento

# ==========================================
# 3. HIPÓTESIS Y FUNCIÓN DE COSTO
# ==========================================
def sigmoid(z):
    # Evitar overflow matemático con límites seguros
    if z < -20: return 0.0000001
    if z > 20: return 0.9999999
    return 1.0 / (1.0 + math.exp(-z))

# ==========================================
# 4. ALGORITMO DE OPTIMIZACIÓN: DESCENSO DE GRADIENTE
# ==========================================
# Inicialización de parámetros
betas = [0.0] * 6  # [Intercepto, b1, b2, b3, b4, b5]
alpha = 0.5        # Tasa de aprendizaje (Learning Rate)
iterations = 20000

print(f"Entrenando modelo por {iterations} iteraciones...")

for it in range(iterations):
    gradients = [0.0] * 6
    
    for i in range(m):
        # A. Forward Propagation: Calcular predicción actual
        # z = b0 + b1*x1 + ... + b5*x5
        z = betas[0] # Intercepto
        for j in range(5):
            z += betas[j+1] * X_norm[i][j]
        
        h = sigmoid(z) # Hipótesis h(x)
        
        # B. Cálculo del Error
        error = h - Y[i]
        
        # C. Backpropagation: Acumular gradientes
        # Derivada parcial: dJ/db = (h - y) * xj
        gradients[0] += error * 1  # Para el intercepto (x0 = 1)
        for j in range(5):
            gradients[j+1] += error * X_norm[i][j]
            
    # D. Actualización de Pesos (Paso del Gradiente)
    # beta_j := beta_j - alpha * (1/m) * sum(errores)
    for j in range(6):
        betas[j] = betas[j] - alpha * (1.0/m) * gradients[j]

# ==========================================
# 5. RESULTADOS FINALES
# ==========================================
print("\n=== ENTRENAMIENTO COMPLETADO ===")
print("Copia estos valores en tu archivo script.js:\n")
print(f"const beta0 = {betas[0]:.8f};")
print(f"const beta1 = {betas[1]:.8f}; // ISC")
print(f"const beta2 = {betas[2]:.8f}; // Temp")
print(f"const beta3 = {betas[3]:.8f}; // Humedad")
print(f"const beta4 = {betas[4]:.8f}; // Viento")
print(f"const beta5 = {betas[5]:.8f}; // Dias")
