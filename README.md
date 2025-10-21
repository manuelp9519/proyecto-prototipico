# proyecto-prototipico
dashboar
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
      <h2>📌 Agregar Datos Manualmente</h2>
      <form id="dataForm">
        <label>Año:</label>
        <input type="text" id="yearInput" required>
        <label>Incendios:</label>
        <input type="number" id="firesInput" required>
        <label>Superficie Afectada (ha):</label>
        <input type="number" id="areaInput" required>
        <button type="submit">Agregar y Actualizar</button>
      </form>
    </div>

    <div class="card">
      <h2>Visualizaciones</h2>
      <div class="chart-grid">
        <div class="chart-box"><canvas id="lineChart"></canvas></div>
        <div class="chart-box"><canvas id="barChart"></canvas></div>
        <div class="chart-box"><canvas id="scatterChart"></canvas></div>
        <div class="chart-box"><canvas id="pieChart"></canvas></div>
        <div class="chart-box"><canvas id="areaChart"></canvas></div>
        <div class="chart-box"><canvas id="groupedChart"></canvas></div>
        <div class="chart-box"><canvas id="monthlyChart"></canvas></div>
        <div class="chart-box"><canvas id="radarChart"></canvas></div>
        <div class="chart-box"><canvas id="bubbleChart"></canvas></div>
      </div>
    </div>
    <div class="card">
      <h2>Animaciones</h2>
      <div>
        <label><input type="checkbox" id="animEnable" checked> Activar animaciones</label>
        <label>Duración (ms):</label>
        <input type="range" id="animDuration" min="100" max="3000" step="100" value="1000">
        <span id="animDurationVal">1000</span>
        <label>Easing:</label>
        <select id="animEasing">
          <option value="linear">linear</option>
          <option value="easeInQuad">easeInQuad</option>
          <option value="easeOutQuad">easeOutQuad</option>
          <option value="easeInOutQuad">easeInOutQuad</option>
          <option value="easeOutBounce" selected>easeOutBounce</option>
        </select>
        <button id="applyAnim">Aplicar a todas</button>
      </div>
    </div>
  </div>

  <script>
    const labels = ['2021','2022','2023','2024'];
    const incendios = [1453,1046,927,818];
    const superficie = [14168,9467,20000,1450];

    const animationOptions = { animation: { duration: 1000, easing: 'easeOutBounce' } };

    function ctx(id){ return document.getElementById(id).getContext('2d'); }

    const lineChartInst = new Chart(ctx('lineChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Forestales', data:incendios.slice(), borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true, tension:0.3 }] }, options: animationOptions });

    const barChartInst = new Chart(ctx('barChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[{ label:'Superficie Afectada (ha)', data: superficie.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: animationOptions });

    const scatterChartInst = new Chart(ctx('scatterChart'), { type:'scatter', data:{ datasets:[{ label:'Incendios vs Superficie', data: incendios.map((x,i)=>({x,y:superficie[i]})), backgroundColor:'#B22222' }] }, options: animationOptions });

    const pieChartInst = new Chart(ctx('pieChart'), { type:'pie', data:{ labels: labels.slice(), datasets:[{ label:'Porcentaje de Incendios', data:incendios.slice(), backgroundColor:['#B22222','#CD5C5C','#FA8072','#F08080'] }] }, options: animationOptions });

    const areaChartInst = new Chart(ctx('areaChart'), { type:'line', data:{ labels: labels.slice(), datasets:[{ label:'Incendios Acumulados', data: incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]), backgroundColor:'rgba(178,34,34,0.3)', borderColor:'#B22222', fill:true }] }, options: animationOptions });

    const groupedChartInst = new Chart(ctx('groupedChart'), { type:'bar', data:{ labels: labels.slice(), datasets:[ { label:'Incendios', data:incendios.slice(), backgroundColor:'#B22222' }, { label:'Superficie (ha)', data:superficie.slice(), backgroundColor:'#FA8072' } ] }, options: animationOptions });

    const monthlyChartInst = new Chart(ctx('monthlyChart'), { type:'line', data:{ labels:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio'], datasets:[{ label:'Incendios Mensuales 2024', data:[120,180,250,300,200,100,50], borderColor:'#B22222', backgroundColor:'rgba(178,34,34,0.2)', fill:true }] }, options: animationOptions });

    const radarChartInst = new Chart(ctx('radarChart'), { type:'radar', data:{ labels:['Zinacantepec','Ocuilan','Jilotzingo','Malinalco'], datasets:[{ label:'Incendios por Municipio', data:[120,95,80,60], backgroundColor:'rgba(178,34,34,0.2)', borderColor:'#B22222' }] }, options: animationOptions });

    const bubbleChartInst = new Chart(ctx('bubbleChart'), { type:'bubble', data:{ datasets:[ { label:'2021', data:[{ x:1453,y:14168,r:7 }], backgroundColor:'#B22222' }, { label:'2022', data:[{ x:1046,y:9467,r:6 }], backgroundColor:'#CD5C5C' }, { label:'2023', data:[{ x:927,y:20000,r:8 }], backgroundColor:'#FA8072' }, { label:'2024', data:[{ x:818,y:1450,r:4 }], backgroundColor:'#F08080' } ] }, options: Object.assign({}, animationOptions, { scales:{ x:{ title:{ display:true, text:'Incendios' } }, y:{ title:{ display:true, text:'Superficie Afectada (ha)' } } } }) });

    function refreshCharts(){
      lineChartInst.data.labels = labels.slice(); lineChartInst.data.datasets[0].data = incendios.slice(); lineChartInst.update();
      barChartInst.data.labels = labels.slice(); barChartInst.data.datasets[0].data = superficie.slice(); barChartInst.update();
      scatterChartInst.data.datasets[0].data = incendios.map((x,i)=>({x,y:superficie[i]})); scatterChartInst.update();
      pieChartInst.data.labels = labels.slice(); pieChartInst.data.datasets[0].data = incendios.slice(); pieChartInst.update();
      areaChartInst.data.labels = labels.slice(); areaChartInst.data.datasets[0].data = incendios.reduce((acc,val,i)=>{ acc.push((acc[i-1]||0)+val); return acc; },[]); areaChartInst.update();
      groupedChartInst.data.labels = labels.slice(); groupedChartInst.data.datasets[0].data = incendios.slice(); groupedChartInst.data.datasets[1].data = superficie.slice(); groupedChartInst.update();
      bubbleChartInst.data.datasets = incendios.map((inc,i)=>({ label: labels[i]||`Año ${i}`, data:[{ x:inc,y:superficie[i]||0, r: Math.max(3, Math.round(Math.sqrt(inc)/10)) }], backgroundColor: ['#B22222','#CD5C5C','#FA8072','#F08080'][i%4] })); bubbleChartInst.update();
    }

    const dataForm = document.getElementById('dataForm');
    const yearInput = document.getElementById('yearInput');
    const firesInput = document.getElementById('firesInput');
    const areaInput = document.getElementById('areaInput');

    dataForm.addEventListener('submit', function(e){
      e.preventDefault();
      const year = yearInput.value.trim();
      const fires = parseInt(firesInput.value,10);
      const area = parseInt(areaInput.value,10);
      if(!year || Number.isNaN(fires) || Number.isNaN(area)){ alert('Por favor completa todos los campos con valores válidos.'); return; }
      const idx = labels.indexOf(year);
      if(idx>=0){ incendios[idx]=fires; superficie[idx]=area; } else { labels.push(year); incendios.push(fires); superficie.push(area); }
      yearInput.value=''; firesInput.value=''; areaInput.value='';
      refreshCharts();
    });

    // ---- Controles de animación ----
    const animEnable = document.getElementById('animEnable');
    const animDuration = document.getElementById('animDuration');
    const animDurationVal = document.getElementById('animDurationVal');
    const animEasing = document.getElementById('animEasing');
    const applyAnimBtn = document.getElementById('applyAnim');

    animDuration.addEventListener('input', () => { animDurationVal.textContent = animDuration.value; });

    function applyAnimationsToAll(enabled, duration, easing) {
      const charts = [lineChartInst, barChartInst, scatterChartInst, pieChartInst, areaChartInst, groupedChartInst, monthlyChartInst, radarChartInst, bubbleChartInst];
      charts.forEach(ch => {
        if (!ch) return;
        ch.options.animation = enabled ? { duration: Number(duration), easing: easing } : false;
        try { ch.update(); } catch (e) { /* ignore */ }
      });
    }

    applyAnimBtn.addEventListener('click', () => {
      applyAnimationsToAll(animEnable.checked, animDuration.value, animEasing.value);
    });
  </script>
</body>
</html>
