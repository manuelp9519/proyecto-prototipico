// Datos Base
const labels = ['2021','2022','2023','2024'];
const incendios = [1453,1046,927,818];
const superficie = [14168,9467,20000,1450];

const animationOptions = { animation: false };

function ctx(id){ return document.getElementById(id).getContext('2d'); }

// --- Inicialización de Gráficas ---
const lineChartInst = new Chart(ctx('lineChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Forestales', data:incendios.slice(), borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true, tension:0.3 }] }, options: animationOptions });
const barChartInst = new Chart(ctx('barChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[{ label:'Superficie Afectada (ha)', data: superficie.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: animationOptions });
const pieChartInst = new Chart(ctx('pieChart'), { type:'pie', data:{ labels: labels.slice(), datasets:[{ label:'Porcentaje de Incendios', data:incendios.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: animationOptions });
const areaChartInst = new Chart(ctx('areaChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Acumulados', data: incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]), backgroundColor:'rgba(178,34,34,0.3)', borderColor:'#B22222', fill:true }] }, options: animationOptions });
const groupedChartInst = new Chart(ctx('groupedChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[ { label:'Incendios', data:incendios.slice(), backgroundColor:'#B22222' }, { label:'Superficie (ha)', data:superficie.slice(), backgroundColor:'#FA8072' } ] }, options: animationOptions });
const monthlyChartInst = new Chart(ctx('monthlyChart'), { type:'line', data:{ labels:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio'], datasets:[{ label:'Incendios Mensuales 2024', data:[120,180,250,300,200,100,50], borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true }] }, options: animationOptions });

// --- Función para Refrescar Gráficas ---
function refreshCharts(){
  lineChartInst.data.labels = labels.slice(); lineChartInst.data.datasets[0].data = incendios.slice(); lineChartInst.update();
  barChartInst.data.labels = labels.slice(); barChartInst.data.datasets[0].data = superficie.slice(); barChartInst.update();
  pieChartInst.data.labels = labels.slice(); pieChartInst.data.datasets[0].data = incendios.slice(); pieChartInst.update();
  areaChartInst.data.labels = labels.slice(); areaChartInst.data.datasets[0].data = incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]); areaChartInst.update();
  groupedChartInst.data.labels = labels.slice(); groupedChartInst.data.datasets[0].data = incendios.slice(); groupedChartInst.data.datasets[1].data = superficie.slice(); groupedChartInst.update();
}

// --- Lógica del Contador Total (Donut) ---
const totalCtx = document.getElementById('totalDonut').getContext('2d');
const totalLabel = document.getElementById('totalLabel');

function computeTotal() {
  return incendios.reduce((s,v)=>s+v,0);
}

let totalDonutInst = new Chart(totalCtx, {
  type: 'doughnut',
  data: {
    labels: ['Completado','Restante'],
    datasets: [{ data: [0, 1], backgroundColor: ['#B22222', '#eee'], hoverOffset: 4 }]
  },
  options: {
    cutout: '70%',
    plugins: { legend: { display: false } },
    animation: { duration: 1000 }
  }
});

let counterAnimationId = null;

function animateCounterTo(target, durationMs) {
  if (counterAnimationId) cancelAnimationFrame(counterAnimationId);
  const start = performance.now();
  const from = 0;
  function step(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const value = Math.round(from + (target - from) * t);
    totalLabel.textContent = value.toLocaleString();
    
    const completed = value;
    const total = target;
    const remaining = Math.max(0, total - completed);
    totalDonutInst.data.datasets[0].data = [completed, remaining];
    totalDonutInst.update();
    if (t < 1) {
      counterAnimationId = requestAnimationFrame(step);
    } else {
      setTimeout(() => startTotalLoop(durationMs), 800);
    }
  }
  counterAnimationId = requestAnimationFrame(step);
}

let loopTimeout = null;
function startTotalLoop(durationMs = 3000) {
  if (loopTimeout) clearTimeout(loopTimeout);
  const total = computeTotal();
  animateCounterTo(total, durationMs);
}

// Sobrescribir refreshCharts para incluir animaciones
const originalRefresh = refreshCharts;
refreshCharts = function() {
  originalRefresh();
  const total = computeTotal();
  totalDonutInst.data.datasets[0].data = [0, Math.max(1,total)];
  totalDonutInst.update();
  startTotalLoop(3000);
};

startTotalLoop(3000);

// --- Vista externa (iframe) ---
(function(){
  const DEFAULT_EXTERNAL_URL = 'https://forestales.ujed.mx/incendios2/';
  const input = document.getElementById('externalUrl');
  const btn = document.getElementById('loadExternal');
  const frame = document.getElementById('externalFrame');
  
  function isValidUrl(u){
    try{ const url = new URL(u); return url.protocol === 'http:' || url.protocol === 'https:'; } catch(e){ return false; }
  }

  function normalize(val){
    const pref = val.match(/^https?:\/\//i) ? '' : 'https://';
    return pref + val;
  }

  function loadUrl(raw){
    const val = (raw||'').trim();
    if(!val) return false;
    const candidate = normalize(val);
    if(!isValidUrl(candidate)) return false;
    frame.src = candidate;
    try{ localStorage.setItem('lastExternalUrl', candidate); } catch(e){}
    input.value = candidate;
    return true;
  }

  btn.addEventListener('click', ()=>{
    const val = (input.value||'').trim();
    if(!val){ alert('Introduce una URL.'); return; }
    if(!loadUrl(val)) alert('URL inválida. Usa http(s)://');
  });

  try{
    const stored = localStorage.getItem('lastExternalUrl');
    const initial = (input.value && input.value.trim()) || stored || DEFAULT_EXTERNAL_URL;
    if(initial){ loadUrl(initial); }
  }catch(e){ }
})();

// --- Funciones de Estadísticas ---
function formatNumber(n){ return Number(n).toLocaleString(); }
function median(arr){ const a = arr.slice().sort((x,y)=>x-y); const m = Math.floor(a.length/2); return a.length%2 ? a[m] : (a[m-1]+a[m])/2; }
function stddev(arr){ const mean = arr.reduce((s,v)=>s+v,0)/arr.length; const variance = arr.reduce((s,v)=>s+Math.pow(v-mean,2),0)/arr.length; return Math.sqrt(variance); }

function buildYearCard(){
  const el = document.getElementById('yearListCard'); if(!el) return;
  el.innerHTML = '';
  for(let i=0;i<labels.length;i++){
    const row = document.createElement('div'); row.className='stat-row';
    row.innerHTML = `<div>${labels[i]}</div><div>${formatNumber(incendios[i])} / ${formatNumber(superficie[i])} ha</div>`;
    el.appendChild(row);
  }
}

function buildGeneralCard(){
  const el = document.getElementById('generalStatsCard'); if(!el) return;
  const totalInc = incendios.reduce((s,v)=>s+v,0);
  const totalSup = superficie.reduce((s,v)=>s+v,0);
  const avgInc = Math.round(totalInc / incendios.length);
  const maxInc = Math.max(...incendios); const maxIncYear = labels[incendios.indexOf(maxInc)];
  const maxSup = Math.max(...superficie); const maxSupYear = labels[superficie.indexOf(maxSup)];
  const pctChange = ((incendios[incendios.length-1] - incendios[0]) / incendios[0]) * 100;
  const medianInc = median(incendios);
  const medianSup = median(superficie);
  const stdInc = stddev(incendios);
  const stdSup = stddev(superficie);
  
  el.innerHTML = '';
  const rows = [
    ['Incendios totales', formatNumber(totalInc)],
    ['Superficie total (ha)', formatNumber(totalSup)],
    ['Promedio inc/año', formatNumber(avgInc)],
    ['Mediana incendios', formatNumber(medianInc)],
    ['Desv. std incendios', formatNumber(stdInc.toFixed(1))],
    ['Mayor incendios', `${maxIncYear} (${formatNumber(maxInc)})`],
    ['Mayor superficie', `${maxSupYear} (${formatNumber(maxSup)} ha)`],
    ['Mediana superficie (ha)', formatNumber(medianSup)],
    ['Desv. std superficie', formatNumber(stdSup.toFixed(1))],
    ['Cambio 2021→2024', `${pctChange.toFixed(1)}%`]
  ];
  rows.forEach(r=>{ const div=document.createElement('div'); div.className='stat-row'; div.innerHTML=`<div>${r[0]}</div><div>${r[1]}</div>`; el.appendChild(div); });
}

// Hook para actualizar stats
(function(){ const orig = window.refreshCharts || function(){}; window.refreshCharts = function(){ orig(); buildYearCard(); buildGeneralCard(); }; })();

buildYearCard(); buildGeneralCard();