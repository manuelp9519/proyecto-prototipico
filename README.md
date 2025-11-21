# Dashboard: Incendios Forestales en el Estado de México

Este proyecto es un **Dashboard Interactivo** diseñado para visualizar y analizar datos sobre incendios forestales en el Estado de México durante el periodo 2021-2024. Su objetivo es facilitar la interpretación de tendencias, superficies afectadas y estadísticas generales mediante gráficos dinámicos.

## 📋 Descripción General

La aplicación web presenta una interfaz limpia con múltiples visualizaciones de datos, permitiendo a los usuarios observar la evolución anual de los incendios y la superficie (hectáreas) afectada. Incluye un sistema de estadísticas automatizado que calcula promedios, medianas y desviaciones estándar en tiempo real.

## 🚀 Características Principales

* **Visualización de Datos:** 6 tipos de gráficos interactivos (Línea, Barra, Pastel, Área, Agrupado y Mensual) impulsados por *Chart.js*.
* **Contador Animado:** Un indicador visual en anillo que muestra el total acumulado de incendios con animación cíclica.
* **Panel de Estadísticas:** Cálculo automático de métricas clave (Totales, Promedios, Máximos, Mínimos y Variación porcentual).
* **Sistema de Predicción Externo:** Integración mediante iframe para cargar herramientas externas de predicción de incendios (por defecto conecta con *forestales.ujed.mx*).
* **Diseño Responsivo:** Tarjetas de información adaptables a diferentes resoluciones.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica del dashboard.
* **CSS3:** Estilos personalizados para tarjetas, layout flexible y diseño visual.
* **JavaScript (ES6):** Lógica de negocio, manipulación del DOM y cálculos estadísticos.
* **Chart.js:** Librería externa para la generación de gráficos dinámicos.

## 📂 Estructura del Proyecto

```text
proyecto-prototipico-2semestre/
├── index.html      # Estructura principal del dashboard
├── styles.css      # Hoja de estilos (colores, layout, tarjetas)
├── script.js       # Lógica de gráficas, datos y animaciones
└── README.md       # Documentación del proyecto