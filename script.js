// Datos Base (Mantenidos)
const labels = ['2021','2022','2023','2024'];
const incendios = [1453,1046,927,818];
const superficie = [14168,9467,20000,1450];

// Opciones para que las gráficas se adapten al contenedor del acordeón
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false, // Importante para que llenen el alto del contenedor
    animation: { duration: 800 }
};

function ctx(id){ return document.getElementById(id).getContext('2d'); }

// --- Inicialización de Gráficas (Con nuevas opciones) ---
const lineChartInst = new Chart(ctx('lineChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Forestales', data:incendios.slice(), borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true, tension:0.3 }] }, options: commonOptions });
const barChartInst = new Chart(ctx('barChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[{ label:'Superficie Afectada (ha)', data: superficie.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: commonOptions });
const pieChartInst = new Chart(ctx('pieChart'), { type:'pie', data:{ labels: labels.slice(), datasets:[{ label:'Porcentaje de Incendios', data:incendios.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: commonOptions });
const areaChartInst = new Chart(ctx('areaChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Acumulados', data: incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]), backgroundColor:'rgba(178,34,34,0.3)', borderColor:'#B22222', fill:true }] }, options: commonOptions });
const groupedChartInst = new Chart(ctx('groupedChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[ { label:'Incendios', data:incendios.slice(), backgroundColor:'#B22222' }, { label:'Superficie (ha)', data:superficie.slice(), backgroundColor:'#FA8072' } ] }, options: commonOptions });
const monthlyChartInst = new Chart(ctx('monthlyChart'), { type:'line', data:{ labels:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio'], datasets:[{ label:'Incendios Mensuales 2024', data:[120,180,250,300,200,100,50], borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true }] }, options: commonOptions });

// --- Función para Refrescar Gráficas (Mantenida) ---
function refreshCharts(){
  lineChartInst.data.labels = labels.slice(); lineChartInst.data.datasets[0].data = incendios.slice(); lineChartInst.update();
  barChartInst.data.labels = labels.slice(); barChartInst.data.datasets[0].data = superficie.slice(); barChartInst.update();
  pieChartInst.data.labels = labels.slice(); pieChartInst.data.datasets[0].data = incendios.slice(); pieChartInst.update();
  areaChartInst.data.labels = labels.slice(); areaChartInst.data.datasets[0].data = incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]); areaChartInst.update();
  groupedChartInst.data.labels = labels.slice(); groupedChartInst.data.datasets[0].data = incendios.slice(); groupedChartInst.data.datasets[1].data = superficie.slice(); groupedChartInst.update();
}

// --- Lógica del Contador Total (Mantenida) ---
const totalCtx = document.getElementById('totalDonut').getContext('2d');
const totalLabel = document.getElementById('totalLabel');

function computeTotal() { return incendios.reduce((s,v)=>s+v,0); }

let totalDonutInst = new Chart(totalCtx, {
  type: 'doughnut',
  data: { labels: ['Completado','Restante'], datasets: [{ data: [0, 1], backgroundColor: ['#B22222', '#eee'], hoverOffset: 4 }] },
  options: { cutout: '75%', plugins: { legend: { display: false }, tooltip: {enabled: false} }, animation: { duration: 1000 } }
});

let counterAnimationId = null;
function animateCounterTo(target, durationMs) {
  if (counterAnimationId) cancelAnimationFrame(counterAnimationId);
  const start = performance.now(); const from = 0;
  function step(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const value = Math.round(from + (target - from) * t);
    totalLabel.textContent = value.toLocaleString();
    totalDonutInst.data.datasets[0].data = [value, Math.max(0, target - value)];
    totalDonutInst.update('none'); // Update sin animación interna del chart para fluidez
    if (t < 1) { counterAnimationId = requestAnimationFrame(step); }
    else { setTimeout(() => startTotalLoop(durationMs), 1500); } // Pausa más larga al final
  }
  counterAnimationId = requestAnimationFrame(step);
}

let loopTimeout = null;
function startTotalLoop(durationMs = 3000) {
  if (loopTimeout) clearTimeout(loopTimeout);
  animateCounterTo(computeTotal(), durationMs);
}

const originalRefresh = refreshCharts;
refreshCharts = function() {
  originalRefresh();
  totalDonutInst.data.datasets[0].data = [0, Math.max(1,computeTotal())];
  totalDonutInst.update();
  startTotalLoop(3000);
};
startTotalLoop(3000);

// --- Funciones de Estadísticas (RENOVADAS) ---
function formatNumber(n){ return Number(n).toLocaleString(undefined, {maximumFractionDigits: 1}); }
function median(arr){ const a = arr.slice().sort((x,y)=>x-y); const m = Math.floor(a.length/2); return a.length%2 ? a[m] : (a[m-1]+a[m])/2; }

// NUEVO: Construir tarjeta de años con mejor diseño visual
function buildYearCard(){
  const el = document.getElementById('yearListCard'); if(!el) return;
  el.innerHTML = '';
  el.className = 'styled-list'; // Asegurar clase base

  for(let i=0;i<labels.length;i++){
    const row = document.createElement('div'); row.className='year-row';
    // Usamos iconos de Font Awesome (fa-fire, fa-tree)
    row.innerHTML = `
      <div class="year-badge">${labels[i]}</div>
      <div class="data-group">
        <div class="data-point" title="Incendios">
            <i class="fa-solid fa-fire"></i> ${formatNumber(incendios[i])}
        </div>
        <div class="data-point" title="Superficie (ha)">
            <i class="fa-solid fa-tree"></i> ${formatNumber(superficie[i])} ha
        </div>
      </div>
    `;
    el.appendChild(row);
  }
}

// NUEVO: Construir estadísticas generales con diseño de tarjetas (Métricas)
function buildGeneralCard(){
  const el = document.getElementById('generalStatsCard'); if(!el) return;
  
  // Cálculos
  const totalInc = incendios.reduce((s,v)=>s+v,0);
  const totalSup = superficie.reduce((s,v)=>s+v,0);
  const avgInc = Math.round(totalInc / incendios.length);
  const avgSup = Math.round(totalSup / superficie.length);
  const maxInc = Math.max(...incendios); const maxIncYear = labels[incendios.indexOf(maxInc)];
  const maxSup = Math.max(...superficie);
  const pctChange = ((incendios[incendios.length-1] - incendios[0]) / incendios[0]) * 100;
  const medianInc = median(incendios);

  el.innerHTML = '<div class="metrics-grid"></div>';
  const grid = el.querySelector('.metrics-grid');

  // Función auxiliar para crear cajitas de métricas
  const createMetric = ( title, value, sub, accentClass = '') => {
      return `
        <div class="metric-box ${accentClass}">
            <h4>${title}</h4>
            <span class="metric-value">${value}</span>
            <span class="metric-sub">${sub}</span>
        </div>
      `;
  };

  // Generar HTML de las métricas
  let metricsHTML = '';
  metricsHTML += createMetric('Total Incendios', formatNumber(totalInc), 'Periodo 2021-2024', 'accent-red');
  metricsHTML += createMetric('Total Superficie', formatNumber(totalSup), 'Hectáreas afectadas', 'accent-green');
  metricsHTML += createMetric('Promedio Anual', formatNumber(avgInc), 'Incendios por año', 'accent-orange');
  metricsHTML += createMetric('Promedio Superficie', formatNumber(avgSup), 'Ha por año', 'accent-blue');
  metricsHTML += createMetric('Pico Incendios', formatNumber(maxInc), `Año ${maxIncYear}`, 'accent-red');
  metricsHTML += createMetric('Tendencia', `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%`, 'Cambio 2021 vs 2024', pctChange > 0 ? 'accent-red' : 'accent-green');
  metricsHTML += createMetric('Mediana Incendios', formatNumber(medianInc), 'Valor central', 'accent-orange');


  grid.innerHTML = metricsHTML;
}

// Hook para actualizar stats
(function(){ const orig = window.refreshCharts || function(){}; window.refreshCharts = function(){ orig(); buildYearCard(); buildGeneralCard(); }; })();
buildYearCard(); buildGeneralCard();

// --- NUEVO: Lógica del Acordeón ---
document.addEventListener('DOMContentLoaded', function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Cerrar todos los demás (opcional, si quieres que solo uno esté abierto a la vez)
            // accordionHeaders.forEach(h => {
            //     if(h !== this) {
            //         h.classList.remove('active');
            //         h.nextElementSibling.style.display = 'none';
            //     }
            // });

            // Alternar el actual
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (this.classList.contains('active')) {
                content.style.display = 'block';
            } else {
                content.style.display = 'none';
            }
            // Forzar redibujado de Chart.js si es necesario al mostrarse
             const canvas = content.querySelector('canvas');
             if(canvas){
                 const chartInstance = Chart.getChart(canvas);
                 if(chartInstance) chartInstance.resize();
             }
        });
    });
});

// --- Vista externa (iframe) ---
(function(){
  const DEFAULT_EXTERNAL_URL = 'https://forestales.ujed.mx/incendios2/';
  
  const input = document.getElementById('externalUrl');
  const btn = document.getElementById('loadExternal');
  const frame = document.getElementById('externalFrame');
  
  // Función para validar si es una URL real
  function isValidUrl(u){
    try{ const url = new URL(u); return url.protocol === 'http:' || url.protocol === 'https:'; } catch(e){ return false; }
  }

  // Función para asegurar que empiece con https://
  function normalize(val){
    const pref = val.match(/^https?:\/\//i) ? '' : 'https://';
    return pref + val;
  }

  // Función principal de carga
  function loadUrl(raw){
    const val = (raw||'').trim();
    if(!val) return false;
    const candidate = normalize(val);
    if(!isValidUrl(candidate)) return false;
    
    // Asignar la URL al iframe
    frame.src = candidate;
    
    // Guardar en memoria para la próxima vez
    try{ localStorage.setItem('lastExternalUrl', candidate); } catch(e){}
    input.value = candidate;
    return true;
  }

  // Escuchar el click del botón
  if(btn){
      btn.addEventListener('click', ()=>{
        const val = (input.value||'').trim();
        if(!val){ alert('Introduce una URL.'); return; }
        if(!loadUrl(val)) alert('URL inválida. Usa http(s)://');
      });
  }

  // Autocarga inteligente al abrir la página
  try{
    // Recuperamos la última URL usada o usamos la de la NASA por defecto
    const stored = localStorage.getItem('lastExternalUrl');
    // Priorizamos la constante DEFAULT si lo guardado (stored) era la URL vieja que fallaba
    const initial = (input && input.value && input.value.trim()) || DEFAULT_EXTERNAL_URL;
    
    if(initial){ loadUrl(initial); }
  }catch(e){ 
      console.log("Error accediendo a localStorage", e);
  }
})();