# Plataforma Web: Proyecto Prototípico de Incendios Forestales

Este proyecto es una solución integral web desarrollada para la **Universidad Nacional Rosario Castellanos** (Grupo 203). Su objetivo es concientizar sobre los incendios forestales en el Estado de México, presentar datos históricos (2021-2024) y ofrecer herramientas de predicción matemática, todo alineado con los ODS de la Agenda 2030.

## 📋 Descripción General

La plataforma ha evolucionado de un dashboard estático a un sitio web informativo, analítico e interactivo con tres módulos principales:

1.  **Inicio y Contexto:** Dashboard con visualización de datos históricos, KPIs animados e información educativa basada en folletos de divulgación.
2.  **Modelo Predictivo:**
    * Integración del Sistema Nacional de Predicción (CONAFOR/UJED).
    * **Simulador de Riesgo Local:** Una herramienta interactiva desarrollada por el equipo que aplica **Regresión Logística** para calcular la probabilidad de incendio en Valle de Bravo en tiempo real.
3.  **Costos y Sostenibilidad:** Análisis financiero detallado, retorno de inversión (ROI) del prototipo y su impacto en los Objetivos de Desarrollo Sostenible.

## 🚀 Características Principales

* **Simulador Matemático Interactivo:** Implementación de la función Sigmoide para el cálculo de probabilidades basado en variables meteorológicas (Temperatura y Humedad), sin uso de librerías externas de IA.
* **Arquitectura Modular:** Separación clara de responsabilidades (HTML Estructural, CSS Unificado, JS Centralizado).
* **Visualización de Datos Avanzada:** 8 tipos de gráficos interactivos (Chart.js) incluyendo proyecciones presupuestales y tendencias históricas.
* **Identidad Institucional:** Diseño UI consistente con la paleta de colores oficial de la UNRC (Guinda #9F2241) y animaciones CSS fluidas.
* **Experiencia de Usuario (UX):** Navegación intuitiva, acordeones exclusivos para manejo de información y contadores dinámicos.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica y accesibilidad.
* **CSS3:** Diseño responsivo, Grid/Flexbox y animaciones personalizadas.
* **JavaScript (ES6):**
    * Lógica de negocio y manipulación del DOM.
    * Implementación de algoritmos matemáticos (Cálculo/Álgebra).
    * Manejo de eventos y observadores de intersección.
* **Chart.js:** Librería para renderizado de gráficos dinámicos.

## 👥 Equipo de Desarrollo (Grupo 203)

* Manuel Palma Garay
* David Ramsés Lugo Hernández
* Leslie Paola Alvarado Cruz
* Damián Sánchez Morales

## 📂 Estructura del Proyecto

```text
proyecto-prototipico/
├── index.html      # [INICIO] Dashboard de datos, KPIs animados y contexto educativo
├── modelo.html     # [MODELO] Simulador de Regresión Logística y visualización externa
├── costos.html     # [COSTOS] Análisis financiero, gráficas de presupuesto y ROI
├── styles.css      # Hoja de estilos unificada (Diseño Institucional + Componentes)
├── script.js       # Lógica centralizada (Gráficos, Simulador, Interacciones)
└── README.md       # Documentación técnica del proyecto
