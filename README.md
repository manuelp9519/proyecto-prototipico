# Plataforma Web: Proyecto Prototípico de Incendios Forestales

Este proyecto es una solución integral web desarrollada para la **Universidad Nacional Rosario Castellanos** (Grupo 203). Su objetivo es concientizar sobre los incendios forestales en el Estado de México, presentar datos históricos (2021-2024) y ofrecer herramientas de predicción, todo alineado con los ODS de la Agenda 2030.

## 📋 Descripción General

La plataforma ha evolucionado de un dashboard estático a un sitio web informativo y analítico con tres módulos principales:
1.  **Inicio y Contexto:** Información educativa basada en folletos de divulgación y visualización de datos históricos.
2.  **Modelo Predictivo:** Sección dedicada a herramientas de predicción (iframe externo y futuro modelo de Machine Learning).
3.  **Costos y Sostenibilidad:** Análisis de viabilidad económica e impacto ambiental.

## 🚀 Características Principales

* **Arquitectura Multi-página:** Navegación fluida entre Contexto, Modelo y Costos.
* **Identidad Institucional:** Diseño UI adaptado a la paleta de colores oficial de la UNRC (Guinda #9F2241).
* **Visualización de Datos:** 6 tipos de gráficos interactivos (Chart.js) y tarjetas de estadísticas avanzadas.
* **Contenido Educativo:** Integración de información sobre prevención, causas y números de emergencia.
* **Robustez Técnica:** Scripts optimizados para cargar componentes dinámicamente según la página activa.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica modular.
* **CSS3:** Estilos personalizados, Flexbox/Grid y animaciones CSS.
* **JavaScript (ES6):** Lógica de negocio, manipulación del DOM y cálculos estadísticos.
* **Chart.js:** Librería para visualización de datos.

## 👥 Equipo de Desarrollo (Grupo 203)

* Manuel Palma Garay
* David Ramsés Lugo Hernández
* Leslie Paola Alvarado Cruz
* Damián Sánchez Morales

## 📂 Estructura del Proyecto

```text
proyecto-prototipico/
├── index.html      # [INICIO] Contexto, folleto informativo y dashboard de datos
├── modelo.html     # [MODELO] Iframe de predicción y futuras herramientas ML
├── costos.html     # [COSTOS] Estructura para desglose financiero y ODS
├── styles.css      # Estilos globales (Tema Institucional UNRC)
├── script.js       # Lógica modular (Manejo de errores y gráficas)
└── README.md       # Documentación técnica del proyecto
