# Sistema Prototípico de Alerta Temprana para Incendios Forestales

**Universidad Nacional Rosario Castellanos | Licenciatura en Ciencia de Datos para Negocios | Grupo 203**

Este repositorio aloja la solución integral web desarrollada para la asignatura de *Problema Prototípico*. Es una herramienta de "Tecnología Frugal" diseñada para operar sin conexión a internet, permitiendo a las comunidades de Valle de Bravo estimar el riesgo de incendios forestales mediante modelos matemáticos.

## 📋 Descripción General

La plataforma integra análisis de datos históricos, modelado predictivo y responsabilidad social en una interfaz web ligera y accesible. El proyecto responde a la problemática de la **brecha digital** y la **falta de prevención** en zonas vulnerables.

### Módulos Principales:

1.  **Inicio y Contexto (Dashboard):** Visualización de datos históricos (2014-2024) con análisis de tendencias, correlación de Pearson y gráficos de aceleración del daño ambiental.
2.  **Modelo Predictivo (Simulador):**
    * Implementación manual de **Regresión Logística Multivariante**.
    * **Semáforo de Riesgo:** Protocolo de actuación automático (Verde/Amarillo/Rojo) con mensajes de prevención específicos.
    * Normalización de variables ajustada a máximos históricos locales.
3.  **Costos y Sostenibilidad:** Análisis financiero (ROI > 6,000%), estructura de costos de desarrollo y alineación con los ODS 13 y 15 de la Agenda 2030.

## 🎓 Integración Multidisciplinaria

Este proyecto acredita competencias de las siguientes 6 asignaturas:

* **Cálculo Diferencial:** Aplicación de derivadas parciales en el algoritmo de *Descenso de Gradiente* (ver script de entrenamiento en Python).
* **Álgebra Lineal:** Operaciones vectoriales y producto punto para el cálculo de la variable latente $z$ y normalización de espacios vectoriales.
* **Estadística:** Implementación de métricas de dispersión (Desviación Estándar) y Correlación de Pearson en el Dashboard.
* **Programación para la Ciencia de Datos:** Desarrollo de algoritmos *from-scratch* (sin librerías de caja negra) en JavaScript y Python.
* **Redacción y Compilación de Textos:** Documentación técnica estructurada, justificación teórica y narrativa de datos.
* **Desarrollo Sostenible y Responsabilidad Social:** Enfoque ético del algoritmo, priorizando la seguridad comunitaria y la accesibilidad tecnológica.

## 🚀 Características Técnicas

* **Arquitectura:** Client-Side pura (HTML5 + CSS3 + JS Vanilla). Funciona 100% Offline.
* **Motor Matemático:** Función Sigmoide $\sigma(z) = \frac{1}{1 + e^{-z}}$.
* **Visualización:** Chart.js para gráficos interactivos y KPIs animados.
* **Entrenamiento:** Los coeficientes $\beta$ fueron obtenidos mediante un script de Python (incluido en Anexos) usando un dataset sintético validado.

## 👥 Equipo de Desarrollo

* Manuel Palma Garay
* David Ramsés Lugo Hernández
* Leslie Paola Alvarado Cruz
* Damián Sánchez Morales

## 📂 Estructura del Repositorio

```text
proyecto-prototipico/
├── index.html      # Dashboard con análisis estadístico
├── modelo.html     # Simulador de riesgo con Semáforo y Protocolos
├── costos.html     # Análisis financiero y ROI
├── styles.css      # Estilos institucionales (UNRC)
├── script.js       # Lógica del modelo logístico y gráficos
├── train_model.py  # Script de entrenamiento (Descenso de Gradiente)
└── README.md       # Documentación técnica
