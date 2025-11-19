<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard: Incendios Forestales en Edomex</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      background-color: #f4f4f4;
    }
    header {
      background-color: #B22222;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .section {
      padding: 20px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
  .stat-row{ display:flex;justify-content:space-between;padding:6px 4px;border-bottom:1px dashed #eee;font-size:14px }
    h2 { color: #B22222; }
    form input, form button { padding: 8px; margin: 5px 0; width: 100%; box-sizing: border-box; }
    form button { background-color: #B22222; color: white; border: none; cursor: pointer; }
    form button:hover { background-color: #8B0000; }
    .chart-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
    .chart-box { background-color: #fff; border-radius: 8px; padding: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); width: 300px; }
    canvas { width: 100%; height: auto; }
  
  </style>
</head>
<body>

  <header>
    <h1>Incendios Forestales en el Estado de México</h1>
    <p>Visualización de datos actualizados (2021–2024)</p>
  </header>

  <div class="section">
  

    <div class="card">
      <h2>Visualizaciones</h2>
      <div class="chart-grid">
        <div class="chart-box"><canvas id="lineChart"></canvas></div>
        <div class="chart-box"><canvas id="barChart"></canvas></div>
        <div class="chart-box"><canvas id="pieChart"> </canvas></div>
        <div class="chart-box"><canvas id="areaChart"></canvas></div>
        <div class="chart-box"><canvas id="groupedChart"></canvas></div>
        <div class="chart-box"><canvas id="monthlyChart"></canvas></div>

      </div>
    </div>
  
    <div class="card">
      <h2>Contador Total de Incendios (2021-2024)</h2>
      <div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
        <div style="width:220px;height:220px;position:relative;">
          <canvas id="totalDonut" width="220" height="220"></canvas>
          <div id="totalLabel" style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font-size:28px;font-weight:700;color:#B22222;">0</div>
        </div>
        <div style="flex:1;min-width:200px;">
          <p id="totalInfo">Progreso del total acumulado de incendios. Se reinicia cuando alcanza el total y vuelve a comenzar.</p>
        </div>
      </div>
    </div>
    <div class="card">
      <h2>sistema de prediccion</h2>
      <p></p>
    <div style="display:none;">
        <input id="externalUrl" type="text" placeholder="https://forestales.ujed.mx/incendios2/" style="flex:1;padding:8px;" />
        <button id="loadExternal" style="padding:8px;background:#B22222;color:#fff;border:none;cursor:pointer;border-radius:4px;">Cargar</button>
      </div>
      <div style="margin-top:12px;">
        <iframe id="externalFrame" src="about:blank" style="width:100%;height:400px;border:1px solid #ddd;border-radius:6px;"></iframe>
      </div>
    </div>
    
    
    <div class="card" id="statsCard">
      <h2>Estadísticas</h2>
      <div style="display:flex;gap:16px;flex-wrap:wrap;">
        <div style="flex:1;min-width:220px;" class="card">
          <h3>Desglose por año</h3>
          <div id="yearListCard">Cargando...</div>
        </div>
        <div style="flex:1;min-width:220px;" class="card">
          <h3>Estadísticas generales</h3>
          <div id="generalStatsCard">Cargando...</div>
        </div>
      </div>
    </div>
  </div>

  

  <script>
    const labels = ['2021','2022','2023','2024'];
    const incendios = [1453,1046,927,818];
    const superficie = [14168,9467,20000,1450];

  
  const animationOptions = { animation: false };

    function ctx(id){ return document.getElementById(id).getContext('2d'); }

    const lineChartInst = new Chart(ctx('lineChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Forestales', data:incendios.slice(), borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true, tension:0.3 }] }, options: animationOptions });

    const barChartInst = new Chart(ctx('barChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[{ label:'Superficie Afectada (ha)', data: superficie.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: animationOptions });

  

    const pieChartInst = new Chart(ctx('pieChart'), { type:'pie', data:{ labels: labels.slice(), datasets:[{ label:'Porcentaje de Incendios', data:incendios.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: animationOptions });

    const areaChartInst = new Chart(ctx('areaChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Acumulados', data: incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]), backgroundColor:'rgba(178,34,34,0.3)', borderColor:'#B22222', fill:true }] }, options: animationOptions });

    const groupedChartInst = new Chart(ctx('groupedChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[ { label:'Incendios', data:incendios.slice(), backgroundColor:'#B22222' }, { label:'Superficie (ha)', data:superficie.slice(), backgroundColor:'#FA8072' } ] }, options: animationOptions });

    const monthlyChartInst = new Chart(ctx('monthlyChart'), { type:'line', data:{ labels:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio'], datasets:[{ label:'Incendios Mensuales 2024', data:[120,180,250,300,200,100,50], borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true }] }, options: animationOptions });

  

  

    function refreshCharts(){
  lineChartInst.data.labels = labels.slice(); lineChartInst.data.datasets[0].data = incendios.slice(); lineChartInst.update();
  barChartInst.data.labels = labels.slice(); barChartInst.data.datasets[0].data = superficie.slice(); barChartInst.update();
  pieChartInst.data.labels = labels.slice(); pieChartInst.data.datasets[0].data = incendios.slice(); pieChartInst.update();
  areaChartInst.data.labels = labels.slice(); areaChartInst.data.datasets[0].data = incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]); areaChartInst.update();
  groupedChartInst.data.labels = labels.slice(); groupedChartInst.data.datasets[0].data = incendios.slice(); groupedChartInst.data.datasets[1].data = superficie.slice(); groupedChartInst.update();
    }

  

  

    
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
      // Animate from 0 to total
      animateCounterTo(total, durationMs);
      
    }

    
    const originalRefresh = refreshCharts;
    refreshCharts = function() {
      originalRefresh();
      
      const total = computeTotal();
      totalDonutInst.data.datasets[0].data = [0, Math.max(1,total)];
      totalDonutInst.update();
      startTotalLoop(3000);
    };

  
  startTotalLoop(3000);

  // ---- Vista externa (iframe) ----
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

    // Autocargar: prioridad -> input value (si hay), localStorage, DEFAULT_EXTERNAL_URL
    try{
      const stored = localStorage.getItem('lastExternalUrl');
      const initial = (input.value && input.value.trim()) || stored || DEFAULT_EXTERNAL_URL;
      if(initial){ loadUrl(initial); }
    }catch(e){ /* ignore localStorage errors */ }

  })();

  // Side panels logic removed

    // ---- Estadísticas reubicadas: construir contenidos para los nuevos cards ----
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

    
    (function(){ const orig = window.refreshCharts || function(){}; window.refreshCharts = function(){ orig(); buildYearCard(); buildGeneralCard(); }; })();

    
    buildYearCard(); buildGeneralCard();
  </script>
</body>
</html>
