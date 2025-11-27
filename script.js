// ==========================================
// 1. DATOS BASE (Compartidos en el Proyecto)
// ==========================================
const labels = ['2021','2022','2023','2024'];
const incendios = [1453,1046,927,818];
const superficie = [14168,9467,20000,1450];

// Opciones comunes para gráficos Chart.js
const commonOptions = { 
    responsive: true, 
    maintainAspectRatio: false, 
    animation: { duration: 800 } 
};

// Función auxiliar para obtener contexto 2D de forma segura
function ctx(id){ 
    const el = document.getElementById(id); 
    return el ? el.getContext('2d') : null; 
}

// Función para formatear números (ej: 1,200)
function formatNumber(n){ 
    return Number(n).toLocaleString(undefined, {maximumFractionDigits: 1}); 
}

// Función matemática: Mediana
function median(arr){ 
    const a = arr.slice().sort((x,y)=>x-y); 
    const m = Math.floor(a.length/2); 
    return a.length%2 ? a[m] : (a[m-1]+a[m])/2; 
}

// ==========================================
// 2. LÓGICA DE INICIO (Index.html)
// ==========================================

// Inicializar Gráficos Principales
if(document.getElementById('lineChart')) {
    new Chart(ctx('lineChart'), { type:'line', data:{ labels: labels, datasets:[{ label:'Incendios Forestales', data:incendios, borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.1)', fill:true, tension:0.3 }] }, options: commonOptions });
    new Chart(ctx('barChart'), { type:'bar', data:{ labels: labels, datasets:[{ label:'Superficie (ha)', data: superficie, backgroundColor:'#B22222' }] }, options: commonOptions });
    new Chart(ctx('pieChart'), { type:'pie', data:{ labels: labels, datasets:[{ data:incendios, backgroundColor:['#9F2241','#B22222','#CD5C5C','#FA8072'] }] }, options: commonOptions });
    new Chart(ctx('areaChart'), { type:'line', data:{ labels: labels, datasets:[{ label:'Acumulado', data: incendios.reduce((a,v,i)=>[...a, v+(a[i-1]||0)],[]), backgroundColor:'rgba(178,34,34,0.2)', borderColor:'#B22222', fill:true }] }, options: commonOptions });
    new Chart(ctx('groupedChart'), { type:'bar', data:{ labels: labels, datasets:[ { label:'Incendios', data:incendios, backgroundColor:'#B22222' }, { label:'Superficie', data:superficie, backgroundColor:'#444' } ] }, options: commonOptions });
    new Chart(ctx('monthlyChart'), { type:'line', data:{ labels:['Ene','Feb','Mar','Abr','May','Jun','Jul'], datasets:[{ label:'2024', data:[120,180,250,300,200,100,50], borderColor:'#B22222', tension:0.3 }] }, options: commonOptions });

    // A. Construir lista "Desglose Anual"
    const yearListEl = document.getElementById('yearListCard');
    if(yearListEl) {
        yearListEl.innerHTML = ''; 
        yearListEl.className = 'styled-list'; 
        for(let i=0; i<labels.length; i++){
            const row = document.createElement('div'); 
            row.className='year-row';
            row.innerHTML = `
                <div class="year-badge">${labels[i]}</div>
                <div class="data-group">
                    <div class="data-point" title="Incendios"><i class="fa-solid fa-fire"></i> ${formatNumber(incendios[i])}</div>
                    <div class="data-point" title="Superficie (ha)"><i class="fa-solid fa-tree"></i> ${formatNumber(superficie[i])} ha</div>
                </div>`;
            yearListEl.appendChild(row);
        }
    }

    // B. Construir "Métricas Generales"
    const generalStatsEl = document.getElementById('generalStatsCard');
    if(generalStatsEl) {
        const totalInc = incendios.reduce((s,v)=>s+v,0);
        const totalSup = superficie.reduce((s,v)=>s+v,0);
        const avgInc = Math.round(totalInc / incendios.length);
        const avgSup = Math.round(totalSup / superficie.length);
        const maxInc = Math.max(...incendios); 
        const maxIncYear = labels[incendios.indexOf(maxInc)];
        const pctChange = ((incendios[incendios.length-1] - incendios[0]) / incendios[0]) * 100;
        const medianInc = median(incendios);

        generalStatsEl.innerHTML = '<div class="metrics-grid"></div>';
        const grid = generalStatsEl.querySelector('.metrics-grid');
        
        const createMetric = (t, v, s, c = '') => 
            `<div class="metric-box ${c}"><h4>${t}</h4><span class="metric-value">${v}</span><span class="metric-sub">${s}</span></div>`;

        let h = '';
        h += createMetric('Total Incendios', formatNumber(totalInc), '2021-2024', 'accent-red');
        h += createMetric('Total Superficie', formatNumber(totalSup), 'Hectáreas', 'accent-green');
        h += createMetric('Promedio Anual', formatNumber(avgInc), 'Incendios', 'accent-orange');
        h += createMetric('Promedio Superficie', formatNumber(avgSup), 'Ha por año', 'accent-blue');
        h += createMetric('Mediana', formatNumber(medianInc), 'Valor central', 'accent-orange');
        h += createMetric('Pico Máximo', formatNumber(maxInc), `Año ${maxIncYear}`, 'accent-red');
        h += createMetric('Tendencia', `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%`, 'Cambio Total', pctChange > 0 ? 'accent-red' : 'accent-green');
        
        grid.innerHTML = h;
    }
}

// --- RESTAURADO Y MEJORADO: Contador Animado Infinito ---
const donutCanvas = document.getElementById('totalDonut');
if(donutCanvas) {
    const totalCtx = donutCanvas.getContext('2d');
    const totalLabel = document.getElementById('totalLabel');
    const totalVal = incendios.reduce((s,v)=>s+v,0);

    let totalDonutInst = new Chart(totalCtx, {
        type: 'doughnut',
        data: { labels: ['Completado','Restante'], datasets: [{ data: [0, 1], backgroundColor: ['#B22222', '#eee'], borderWidth: 0, hoverOffset: 4 }] },
        options: { cutout: '75%', events: [], plugins: { legend: { display: false }, tooltip: {enabled: false} }, animation: { duration: 0 } }
    });

    let counterAnimationId = null;
    
    // Función de animación
    function runAnimation() {
        if (counterAnimationId) cancelAnimationFrame(counterAnimationId); // Cancelar si ya existe para reiniciar
        const durationMs = 2000;
        const start = performance.now();
        const from = 0; 
        
        function step(now) {
            const t = Math.min(1, (now - start) / durationMs);
            const ease = t * (2 - t); // Ease-Out
            const value = Math.round(from + (totalVal - from) * ease);
            
            if(totalLabel) totalLabel.textContent = value.toLocaleString();
            totalDonutInst.data.datasets[0].data = [value, Math.max(0, totalVal - value)];
            totalDonutInst.update('none'); 
            
            if (t < 1) {
                counterAnimationId = requestAnimationFrame(step);
            }
        } 
        counterAnimationId = requestAnimationFrame(step);
    }

    // Observer: Se dispara CADA VEZ que entra en pantalla
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { 
            if (entry.isIntersecting) {
                runAnimation();
                // NOTA: Eliminamos 'observer.unobserve' para que siga observando siempre
            }
        });
    }, { threshold: 0.5 });
    observer.observe(donutCanvas);
}


// ==========================================
// 3. FUNCIONALIDAD GLOBAL (Acordeón Exclusivo)
// ==========================================
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const isActive = header.classList.contains('active');
        
        // 1. Cerrar TODOS los paneles primero
        accordionHeaders.forEach(h => {
            h.classList.remove('active');
            h.nextElementSibling.style.display = 'none';
        });

        // 2. Si el que clickeamos NO estaba activo, lo abrimos.
        // (Si estaba activo, el paso 1 ya lo cerró, así que funciona como toggle)
        if (!isActive) {
            header.classList.add('active');
            const content = header.nextElementSibling;
            content.style.display = 'block';
            
            // Redimensionar gráfico si existe dentro
            const cvs = content.querySelector('canvas');
            if(cvs){ const chart = Chart.getChart(cvs); if(chart) chart.resize(); }
        }
    });
});


// ==========================================
// 4. LÓGICA DE MODELO (Iframe y Simulador)
// ==========================================
const loadBtn = document.getElementById('loadExternal');
if(loadBtn) {
    loadBtn.addEventListener('click', () => {
        const frame = document.getElementById('externalFrame');
        if(frame) frame.src = document.getElementById('externalUrl').value;
    });
    // Pequeño delay para asegurar carga
    setTimeout(() => loadBtn.click(), 500);
}

// Referencias a los 5 inputs del modelo
const inputISC = document.getElementById('inputISC');
const inputTemp = document.getElementById('inputTemp');
const inputHum = document.getElementById('inputHum');
const inputWind = document.getElementById('inputWind');
const inputDays = document.getElementById('inputDays');

// Solo ejecutamos si existen los elementos (estamos en modelo.html)
if(inputISC && inputTemp && inputHum && inputWind && inputDays) {

    // Coeficientes exactos del Reporte PDF (Regresión Logística Manual) 
    const beta0 = -8.17124513;
    const beta1 = 4.50336363;   // ISC
    const beta2 = 5.71485795;   // Temp
    const beta3 = -13.56025600; // Humedad (Negativo: más humedad = menos riesgo)
    const beta4 = 4.57188636;   // Viento
    const beta5 = 20.60845995;  // Días sin lluvia

    function calcularProbabilidad() {
        // 1. Obtener valores crudos de la UI
        const rawISC = parseFloat(inputISC.value);
        const rawTemp = parseFloat(inputTemp.value);
        const rawHum = parseFloat(inputHum.value);
        const rawWind = parseFloat(inputWind.value);
        const rawDays = parseFloat(inputDays.value);

        // Actualizar etiquetas visuales
        document.getElementById('valISC').textContent = rawISC;
        document.getElementById('valTemp').textContent = rawTemp;
        document.getElementById('valHum').textContent = rawHum;
        document.getElementById('valWind').textContent = rawWind;
        document.getElementById('valDays').textContent = rawDays;

        // 2. Normalización de Variables (Tal cual el reporte PDF) 
        // Esto es crucial: el modelo se entrenó con datos entre 0 y 1.
        const x1 = rawISC / 100.0;
        const x2 = rawTemp / 40.0;
        const x3 = rawHum / 100.0;
        const x4 = rawWind / 10.0;
        const x5 = rawDays / 30.0;

        // 3. Cálculo de Z (Suma ponderada)
        const z = beta0 + (beta1 * x1) + (beta2 * x2) + (beta3 * x3) + (beta4 * x4) + (beta5 * x5);

        // 4. Función Sigmoide
        const prob = 1.0 / (1.0 + Math.exp(-z));
        const pct = (prob * 100).toFixed(2); // Dos decimales para precisión técnica

        // 5. Renderizado de resultados
        const resultProb = document.getElementById('resultProb');
        const resultText = document.getElementById('resultText');

        resultProb.textContent = pct + '%';

        // Umbrales visuales para feedback al usuario
        // El reporte dice corte en 0.5 (50%), aquí damos feedback graduado
        if(prob < 0.30) {
            resultProb.style.color = '#2ecc71'; 
            resultText.textContent = "Riesgo Bajo"; 
            resultText.style.backgroundColor = '#2ecc71';
        } else if (prob < 0.70) {
            resultProb.style.color = '#f1c40f'; 
            resultText.textContent = "Riesgo Medio"; 
            resultText.style.backgroundColor = '#f1c40f';
        } else {
            resultProb.style.color = '#c0392b'; 
            resultText.textContent = "¡PELIGRO ALTO!"; 
            resultText.style.backgroundColor = '#c0392b';
        }
    }

    // Listeners para los 5 inputs
    const inputs = [inputISC, inputTemp, inputHum, inputWind, inputDays];
    inputs.forEach(el => el.addEventListener('input', calcularProbabilidad));

    // Cálculo inicial
    calcularProbabilidad();
}

// ==========================================
// 5. LÓGICA DE COSTOS (Gráficos)
// ==========================================
if(document.getElementById('costPie')) {
    if (typeof ChartDataLabels !== 'undefined') { Chart.register(ChartDataLabels); }

    const palette = {
      blue: '#2563eb', indigo: '#4f46e5', emerald: '#10b981', 
      amber: '#f59e0b', rose: '#f43f5e', sky: '#0ea5e9'
    };

    // 1. Gráfico de Pastel
    new Chart(ctx('costPie'), {
      type: 'pie',
      data: {
        labels: ['Investigación', 'Modelo Logístico', 'Dataset', 'Herramienta Digital', 'Telegram/Pruebas', 'Gastos Grales.'],
        datasets: [{
          data: [20000, 30000, 15000, 20000, 10000, 5000],
          backgroundColor: [palette.indigo, palette.blue, palette.emerald, palette.sky, palette.amber, palette.rose],
          borderWidth: 2, borderColor: '#fff'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } },
          datalabels: { color: '#fff', font: { weight: 'bold' }, formatter: (v, ctx) => {
            let sum = ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0);
            return ((v/sum)*100).toFixed(0) + '%';
          }}
        }
      }
    });

    // 2. Gráfico de Barras (Presupuesto)
    new Chart(ctx('budgetBar'), {
      type: 'bar',
      data: {
        labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [{
          label: 'Millones de MXN',
          data: [4391, 2750, 2580, 2780, 2820, 2533, 903], 
          backgroundColor: '#B22222', borderRadius: 4
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: { 
            y: { beginAtZero: true, grid: { color: '#f0f0f0' } }, 
            x: { grid: { display: false } } 
        },
        plugins: {
          legend: { display: false },
          datalabels: { anchor: 'end', align: 'top', color: '#555', font: { weight: 'bold', size: 10 }, formatter: v => v.toLocaleString() }
        }
      }
    });
}
