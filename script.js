// --- DATOS BASE ---
const labels = ['2021','2022','2023','2024'];
const incendios = [1453,1046,927,818];
const superficie = [14168,9467,20000,1450];

// Configuración común de gráficas
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 }
};

function ctx(id){ return document.getElementById(id).getContext('2d'); }

// --- INICIALIZACIÓN DE GRÁFICAS (Chart.js) ---
const lineChartInst = new Chart(ctx('lineChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Forestales', data:incendios.slice(), borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true, tension:0.3 }] }, options: commonOptions });
const barChartInst = new Chart(ctx('barChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[{ label:'Superficie Afectada (ha)', data: superficie.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: commonOptions });
const pieChartInst = new Chart(ctx('pieChart'), { type:'pie', data:{ labels: labels.slice(), datasets:[{ label:'Porcentaje de Incendios', data:incendios.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: commonOptions });
const areaChartInst = new Chart(ctx('areaChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Acumulados', data: incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]), backgroundColor:'rgba(178,34,34,0.3)', borderColor:'#B22222', fill:true }] }, options: commonOptions });
const groupedChartInst = new Chart(ctx('groupedChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[ { label:'Incendios', data:incendios.slice(), backgroundColor:'#B22222' }, { label:'Superficie (ha)', data:superficie.slice(), backgroundColor:'#FA8072' } ] }, options: commonOptions });
const monthlyChartInst = new Chart(ctx('monthlyChart'), { type:'line', data:{ labels:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio'], datasets:[{ label:'Incendios Mensuales 2024', data:[120,180,250,300,200,100,50], borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true }] }, options: commonOptions });

// --- FUNCIÓN DE REFRESCO (Para actualizaciones dinámicas) ---
function refreshCharts(){
  lineChartInst.data.labels = labels.slice(); lineChartInst.data.datasets[0].data = incendios.slice(); lineChartInst.update();
  barChartInst.data.labels = labels.slice(); barChartInst.data.datasets[0].data = superficie.slice(); barChartInst.update();
  pieChartInst.data.labels = labels.slice(); pieChartInst.data.datasets[0].data = incendios.slice(); pieChartInst.update();
  areaChartInst.data.labels = labels.slice(); areaChartInst.data.datasets[0].data = incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]); areaChartInst.update();
  groupedChartInst.data.labels = labels.slice(); groupedChartInst.data.datasets[0].data = incendios.slice(); groupedChartInst.data.datasets[1].data = superficie.slice(); groupedChartInst.update();
  
  // Regenerar tarjetas de estadísticas
  buildYearCard(); 
  buildGeneralCard();
}

// --- LÓGICA DEL CONTADOR ANIMADO (Donut + Label) ---
const totalCtx = document.getElementById('totalDonut').getContext('2d');
const totalLabel = document.getElementById('totalLabel');
const donutCanvas = document.getElementById('totalDonut');

function computeTotal() { return incendios.reduce((s,v)=>s+v,0); }

let totalDonutInst = new Chart(totalCtx, {
  type: 'doughnut',
  data: { labels: ['Completado','Restante'], datasets: [{ data: [0, 1], backgroundColor: ['#B22222', '#eee'], hoverOffset: 4 }] },
  options: { 
      cutout: '75%', 
      plugins: { legend: { display: false }, tooltip: {enabled: false} }, 
      animation: { duration: 0 } 
  }
});

let counterAnimationId = null;

function animateCounterTo(target, durationMs) {
  if (counterAnimationId) cancelAnimationFrame(counterAnimationId);
  const start = performance.now();
  const from = 0; 
  
  function step(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const ease = t * (2 - t); 
    
    const value = Math.round(from + (target - from) * ease);
    totalLabel.textContent = value.toLocaleString();
    
    totalDonutInst.data.datasets[0].data = [value, Math.max(0, target - value)];
    totalDonutInst.update('none'); // Actualización ligera sin re-render total

    if (t < 1) {
      counterAnimationId = requestAnimationFrame(step);
    } 
  }
  counterAnimationId = requestAnimationFrame(step);
}

// Intersection Observer para iniciar animación al hacer scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) animateCounterTo(computeTotal(), 2500);
    });
}, { threshold: 0.5 });

if(donutCanvas) observer.observe(donutCanvas);

// --- GENERACIÓN DE TARJETAS DE ESTADÍSTICAS (VERSIÓN MODERNA) ---
function formatNumber(n){ return Number(n).toLocaleString(undefined, {maximumFractionDigits: 1}); }
function median(arr){ const a = arr.slice().sort((x,y)=>x-y); const m = Math.floor(a.length/2); return a.length%2 ? a[m] : (a[m-1]+a[m])/2; }

function buildYearCard(){
  const el = document.getElementById('yearListCard'); if(!el) return;
  el.innerHTML = '';
  el.className = 'styled-list'; // Clase CSS moderna

  for(let i=0;i<labels.length;i++){
    const row = document.createElement('div'); row.className='year-row';
    row.innerHTML = `
      <div class="year-badge">${labels[i]}</div>
      <div class="data-group">
        <div class="data-point" title="Incendios"><i class="fa-solid fa-fire"></i> ${formatNumber(incendios[i])}</div>
        <div class="data-point" title="Superficie (ha)"><i class="fa-solid fa-tree"></i> ${formatNumber(superficie[i])} ha</div>
      </div>
    `;
    el.appendChild(row);
  }
}

function buildGeneralCard(){
  const el = document.getElementById('generalStatsCard'); if(!el) return;
  
  // Cálculos Estadísticos
  const totalInc = incendios.reduce((s,v)=>s+v,0);
  const totalSup = superficie.reduce((s,v)=>s+v,0);
  const avgInc = Math.round(totalInc / incendios.length);
  const avgSup = Math.round(totalSup / superficie.length);
  const maxInc = Math.max(...incendios); 
  const maxIncYear = labels[incendios.indexOf(maxInc)];
  const pctChange = ((incendios[incendios.length-1] - incendios[0]) / incendios[0]) * 100;
  const medianInc = median(incendios);

  // Generación de HTML Grid
  el.innerHTML = '<div class="metrics-grid"></div>';
  const grid = el.querySelector('.metrics-grid');
  const createMetric = (t, v, s, c = '') => `<div class="metric-box ${c}"><h4>${t}</h4><span class="metric-value">${v}</span><span class="metric-sub">${s}</span></div>`;

  let h = '';
  h += createMetric('Total Incendios', formatNumber(totalInc), '2021-2024', 'accent-red');
  h += createMetric('Total Superficie', formatNumber(totalSup), 'Hectáreas', 'accent-green');
  h += createMetric('Promedio Anual', formatNumber(avgInc), 'Incendios', 'accent-orange');
  h += createMetric('Promedio Superficie', formatNumber(avgSup), 'Ha por año', 'accent-blue');
  h += createMetric('Mediana Incendios', formatNumber(medianInc), 'Valor central', 'accent-orange');
  h += createMetric('Pico Máximo', formatNumber(maxInc), `Año ${maxIncYear}`, 'accent-red');
  h += createMetric('Tendencia', `${pctChange > 0 ? '+' : ''}${pctChange.toFixed(1)}%`, 'Cambio Total', pctChange > 0 ? 'accent-red' : 'accent-green');
  
  grid.innerHTML = h;
}

// Ejecutar funciones iniciales
buildYearCard(); 
buildGeneralCard();

// --- COMPORTAMIENTO DEL ACORDEÓN ---
document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('.accordion-header');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            content.style.display = this.classList.contains('active') ? 'block' : 'none';
            
            // Redimensionar gráfica si existe dentro
            const cvs = content.querySelector('canvas');
            if(cvs){ const chart = Chart.getChart(cvs); if(chart) chart.resize(); }
        });
    });
});

// --- LÓGICA DEL IFRAME EXTERNO ---
(function(){
  const DEFAULT_EXTERNAL_URL = 'https://forestales.ujed.mx/incendios2/';
  const input = document.getElementById('externalUrl');
  const btn = document.getElementById('loadExternal');
  const frame = document.getElementById('externalFrame');
  
  function loadUrl(raw){
    const val = (raw||'').trim();
    if(!val) return;
    frame.src = (val.match(/^https?:\/\//i) ? '' : 'https://') + val;
  }

  if(btn){
      btn.addEventListener('click', ()=>{ loadUrl(input.value); });
  }
  // Cargar URL inicial si existe
  try{
    const initial = (input && input.value) || DEFAULT_EXTERNAL_URL;
    loadUrl(initial);
  }catch(e){ }
})();
