/* ============================ DATA ============================ */
const FB_REVENUE = {
  'Le Supreme / Bar Rotunda': {rev:6637901, yoy:-7.5},
  'Hiroki-San':               {rev:4156492, yoy:8.1},
  'Anthology':                {rev:4256384, yoy:7.2},
  "Kamper's":                 {rev:2520779, yoy:3.4},
};
const FB_TOTAL_REV = 17571556;     // consolidated F&B (matches outlet sum)
const ROOST_REV    = 8500000;      // provided
const TOTAL_REV    = FB_TOTAL_REV + ROOST_REV; // 26,071,556

// Kampers/Anthology revenue = Anthology + Kamper's (org groups them)
const KAMP_REV = FB_REVENUE['Anthology'].rev + FB_REVENUE["Kamper's"].rev;

const DIVISIONS = [
  { id:'leadership', name:'Executive Leadership', short:'Executive Leadership', revenue:null,
    groups:[ { name:null, revenue:null, positions:[
      {n:'John Lenchen', r:'VP of Sales', s:180000, note:'Apex role — oversees F&B, Sales, ROOST &amp; Shared Services'},
    ]}]},

  { id:'fb', name:'Food & Beverage', short:'Food & Beverage', revenue:FB_TOTAL_REV,
    groups:[
      { name:'F&B Leadership', revenue:null, positions:[
        {n:'David Massoni', r:'Director of Operations', s:160000},
        {n:'Patrick Jobst', r:'Director of Beverage', s:125000},
        {n:'Nyle Flynn', r:'Executive Chef', s:45000, note:'F&B-level allocation'},
      ]},
      { name:'Kampers / Anthology', revenue:KAMP_REV, positions:[
        {n:'Stephanie Jordan', r:'General Manager', s:100000},
        {n:'TBD', r:'Banquet Manager', s:90000, open:true},
        {n:'Joseph McMann', r:'Asst General Manager', s:75000},
        {n:'Mohammed', r:'Executive Chef', s:88000},
        {n:'Shiana', r:'Restaurant Manager', s:65000},
        {n:'Dylan Clement', r:'Sous Chef', s:59200},
      ]},
      { name:'Pastry', revenue:null, positions:[
        {n:'Hailey Enszer', r:'EC – Pastry', s:99000},
        {n:'Neal Murakami', r:'Sous – Pastry', s:57200},
      ]},
      { name:'Le Supreme / Bar Rotunda', revenue:FB_REVENUE['Le Supreme / Bar Rotunda'].rev, positions:[
        {n:'OPEN', r:'General Manager', s:95000, open:true},
        {n:'Jono Tacconilli', r:'Asst General Manager', s:88000},
        {n:'Nyle Flynn', r:'Executive Chef', s:100000},
        {n:'Dominic Fosmore', r:'Restaurant Manager', s:62500},
        {n:'Briana Swayze', r:'Restaurant Manager', s:67500},
        {n:'Dylan Trippe Edwards', r:'Sous Chef', s:68000},
        {n:'Mitchell Driesenga', r:'Sous Chef', s:65000},
        {n:'Nino Toigo', r:'Sous Chef', s:64000},
      ]},
      { name:'Hiroki-San', revenue:FB_REVENUE['Hiroki-San'].rev, positions:[
        {n:'Naomi Scott', r:'General Manager', s:88000},
        {n:'Petr Balcarovsky', r:'Restaurant Manager', s:70000},
        {n:'Christian Vasquez', r:'Executive Chef', s:95000},
        {n:'Louis Placido', r:'Sushi Chef', s:75000},
        {n:'Aiden Toby', r:'Sous Chef', s:64000},
      ]},
    ]},

  { id:'sales', name:'Sales', short:'Sales', revenue:null,
    groups:[ { name:null, revenue:null, positions:[
      {n:'John Lenchen', r:'VP of Sales', s:0, alloc:true, note:'Costed once under Executive Leadership'},
      {n:'Tamika Nixon', r:'Senior Sales – Corporate', s:95000},
      {n:'YooRim Kim', r:'Group Sales Manager', s:75000},
      {n:'Lyndsay Zelenak', r:'Senior Sales – Events', s:83000},
      {n:'Lee-Ann Platt', r:'Event Sales Manager', s:70000},
      {n:'Keeley Najor', r:'Conference Services Manager', s:60000},
    ]}]},

  { id:'roost', name:'ROOST', short:'ROOST', revenue:ROOST_REV,
    groups:[ { name:null, revenue:null, positions:[
      {n:'Chris Cavanough', r:'ROOST General Manager', s:80000, note:'57% allocation to Book Tower'},
      {n:'Jo-Nathan Gross', r:'Assistant General Manager', s:90000},
      {n:'Karla Robinson-Sims', r:'Housekeeping Manager', s:63000},
      {n:'MaShall Devine', r:'Asst Housekeeping Manager', s:48000},
      {n:'Rachelle Douro', r:'Director, Front Office', s:75000},
      {n:'Dominic Marchese', r:'Assistant, Front Office', s:50000},
    ]}]},

  { id:'shared', name:'Shared Services', short:'Shared Services', revenue:null,
    groups:[ { name:null, revenue:null, positions:[
      {n:'Craig Zerbe', r:'Facilities Manager', s:75000},
      {n:'Jenna Chimenti', r:'HR Coordinator', s:60000},
      {n:'Olivia Brazer', r:'Marketing / Comm Coordinator', s:60000},
    ]}]},
];

/* ============================ HELPERS ============================ */
const usd  = n => '$'+Math.round(n).toLocaleString('en-US');
const usdK = n => '$'+(n/1000).toLocaleString('en-US',{maximumFractionDigits:0})+'K';
const pct  = (n,d=1) => (n*100).toFixed(d)+'%';
const signedUsd = n => (n>=0?'+':'\u2212')+'$'+Math.abs(Math.round(n)).toLocaleString('en-US');
const signedPct = n => (n>=0?'+':'\u2212')+Math.abs(n).toFixed(1)+'%';

function groupTotal(g){ return g.positions.reduce((a,p)=>a+p.s,0); }
function divTotal(d){ return d.groups.reduce((a,g)=>a+groupTotal(g),0); }
function divHC(d){ // filled positions (exclude allocated $0 rows)
  return d.groups.reduce((a,g)=>a+g.positions.filter(p=>!p.alloc).length,0);
}
function divOpen(d){ return d.groups.reduce((a,g)=>a+g.positions.filter(p=>p.open).length,0); }

const GRAND   = DIVISIONS.reduce((a,d)=>a+divTotal(d),0);
const OPEN_BUDGET = DIVISIONS.reduce((a,d)=>a+d.groups.reduce((x,g)=>x+g.positions.filter(p=>p.open).reduce((y,p)=>y+p.s,0),0),0);
const FILLED  = GRAND - OPEN_BUDGET;
const HC_FILLED = DIVISIONS.reduce((a,d)=>a+divHC(d),0) - divOpen(DIVISIONS.find(d=>d.id==='leadership'));
const POS_FILLED = DIVISIONS.reduce((a,d)=>a+d.groups.reduce((x,g)=>x+g.positions.filter(p=>!p.alloc&&!p.open).length,0),0);
const POS_OPEN   = DIVISIONS.reduce((a,d)=>a+divOpen(d),0);

/* ============================ OVERVIEW ============================ */
function renderOverview(){
  const el = document.getElementById('view-overview');
  const costPctRev = GRAND/TOTAL_REV;

  // KPI cards
  let html = `
  <div class="breadcrumb">Intel &nbsp;&#8250;&nbsp; Reports &nbsp;&#8250;&nbsp; <b>Management Cost</b></div>
  <h1 class="pagetitle serif">Book Tower — Management Cost<span class="sub">Mapped leadership payroll &middot; fiscal 2026 plan</span></h1>

  <div class="kpis">
    <div class="kpi"><div class="lab">Total Management Cost</div>
      <div class="val">${usd(GRAND)}</div>
      <div class="meta">${usd(FILLED)} filled &middot; <span class="neg">${usd(OPEN_BUDGET)}</span> open</div>
      <div class="bar"><i style="width:${FILLED/GRAND*100}%"></i></div></div>

    <div class="kpi"><div class="lab">Mapped Positions</div>
      <div class="val">${POS_FILLED+POS_OPEN}</div>
      <div class="meta">${POS_FILLED} filled &middot; <span class="pos">${POS_OPEN} open to recruit</span></div>
      <div class="bar"><i style="width:${POS_FILLED/(POS_FILLED+POS_OPEN)*100}%"></i></div></div>

    <div class="kpi"><div class="lab">Cost as % of Revenue</div>
      <div class="val">${pct(costPctRev)}</div>
      <div class="meta">on ${usd(TOTAL_REV)} total revenue</div>
      <div class="bar"><i style="width:${costPctRev*100*3}%"></i></div></div>

    <div class="kpi"><div class="lab">Open-Role Budget</div>
      <div class="val">${usd(OPEN_BUDGET)}</div>
      <div class="meta">2 unfilled leadership seats</div>
      <div class="bar"><i style="width:${OPEN_BUDGET/GRAND*100}%;background:#B5503F"></i></div></div>
  </div>`;

  // Division summary table
  html += `<div class="block">
    <div class="head"><h3 class="serif">Division summary &middot; Mapped cost</h3>
      <span class="note">Budgeted basis &middot; includes open seats</span></div>
    <div class="pad"><table>
      <thead class="navy"><tr>
        <th>Division</th><th>Headcount</th><th>Open</th><th>Mgmt Cost</th>
        <th>% of Total</th><th>Revenue</th><th>Cost % Rev</th></tr></thead>
      <tbody>`;
  DIVISIONS.forEach(d=>{
    const t=divTotal(d), rev=d.revenue, cpr=rev?t/rev:null;
    html+=`<tr>
      <td><span class="nm">${d.name}</span></td>
      <td>${divHC(d)}</td>
      <td>${divOpen(d)?`<span class="neg">${divOpen(d)}</span>`:'<span class="dash">&mdash;</span>'}</td>
      <td>${usd(t)}</td>
      <td>${pct(t/GRAND)}</td>
      <td>${rev?usd(rev):'<span class="dash">&mdash;</span>'}</td>
      <td>${cpr!=null?pct(cpr):'<span class="dash">&mdash;</span>'}</td>
    </tr>`;
  });
  html+=`<tr class="grand">
      <td>Book Tower total</td>
      <td>${POS_FILLED+POS_OPEN}</td>
      <td><span class="neg">${POS_OPEN}</span></td>
      <td>${usd(GRAND)}</td>
      <td>100%</td>
      <td>${usd(TOTAL_REV)}</td>
      <td>${pct(GRAND/TOTAL_REV)}</td></tr>
      </tbody></table></div></div>`;

  // Cost-by-division bars
  const maxd = Math.max(...DIVISIONS.map(divTotal));
  html += `<div class="block"><div class="head"><h3 class="serif">Where the cost sits</h3>
      <span class="note">Mapped management payroll by division</span></div><div class="pad">`;
  DIVISIONS.slice().sort((a,b)=>divTotal(b)-divTotal(a)).forEach(d=>{
    const t=divTotal(d);
    html+=`<div class="barrow"><div class="bl">${d.name}</div>
      <div class="track"><i style="width:${t/maxd*100}%"></i></div>
      <div class="bv">${usd(t)}<span>${pct(t/GRAND,0)}</span></div></div>`;
  });
  html+=`</div></div>`;

  // Insights
  const fb=DIVISIONS.find(d=>d.id==='fb'), roost=DIVISIONS.find(d=>d.id==='roost');
  const fbCpr=divTotal(fb)/fb.revenue, roostCpr=divTotal(roost)/roost.revenue;
  html += `<div class="insights">
    <div class="insight"><div class="top"><span class="chip">Structure</span><span class="oid">O1</span>
      <span class="conf high"><span class="dot"></span>High confidence</span></div>
      <h4>F&amp;B carries ${pct(divTotal(fb)/GRAND,0)} of management cost against the full revenue base</h4>
      <p>Food &amp; Beverage runs <b>${usd(divTotal(fb))}</b> of mapped leadership payroll &mdash; about
      <b>${pct(fbCpr)}</b> of its ${usd(fb.revenue)} in revenue. ROOST is markedly leaner at
      <b>${pct(roostCpr)}</b> (${usd(divTotal(roost))} on ${usd(roost.revenue)}), reflecting a
      thinner rooms-side management layer. Sales and Shared Services sit above revenue as portfolio overhead.</p></div>

    <div class="insight"><div class="top"><span class="chip">Recruiting</span><span class="oid">O2</span>
      <span class="conf med"><span class="dot"></span>Medium confidence</span></div>
      <h4>Two open leadership seats represent ${usd(OPEN_BUDGET)} of budgeted-but-unfilled cost</h4>
      <p>The <b>Le Supreme / Bar Rotunda GM</b> ($95,000) and the <b>Kampers / Anthology Banquet Manager</b>
      ($90,000) are mapped but unfilled. Both sit in the F&amp;B outlets driving the largest revenue lines, so
      time-to-fill directly affects in-venue oversight. Filled-only cost today is <b>${usd(FILLED)}</b>.</p></div>
  </div>`;

  html += `<div class="foot">
    <b>Notes &amp; methodology.</b> Figures are mapped annual base salaries from the Book Tower org chart (rev. 06/15/26).
    John Lenchen (VP of Sales, $180,000) sits at the apex and is costed once under Executive Leadership; his Sales-division
    node is shown at $0 to avoid double-counting. Chris Cavanough (ROOST GM) is listed at $80,000 with a 57% allocation note.
    Open seats (shown in green on the org map) are included in budgeted cost. Pastry and F&amp;B Leadership are support layers
    with no directly attributed revenue. Revenue: F&amp;B full-year actuals ($17,571,556 consolidated) plus ROOST at
    $8,500,000 (provided). Cost % of revenue uses the combined ${usd(TOTAL_REV)} base.
  </div>`;

  el.innerHTML = html;
}

/* ============================ DIVISION DETAIL ============================ */
function renderDivision(divId){
  const d = DIVISIONS.find(x=>x.id===divId);
  const el = document.getElementById('view-division');
  const t = divTotal(d);
  const costPctRev = d.revenue ? t/d.revenue : null;

  let html = `
  <div class="breadcrumb">Intel &nbsp;&#8250;&nbsp; Management Cost &nbsp;&#8250;&nbsp; <b>${d.name}</b></div>
  <h1 class="pagetitle serif">${d.name}<span class="sub">Mapped positions &middot; ${divHC(d)} headcount</span></h1>

  <div class="kpis">
    <div class="kpi"><div class="lab">Division Mgmt Cost</div><div class="val">${usd(t)}</div>
      <div class="meta">${pct(t/GRAND)} of Book Tower total</div></div>
    <div class="kpi"><div class="lab">Headcount</div><div class="val">${divHC(d)}</div>
      <div class="meta">${divOpen(d)?`<span class="neg">${divOpen(d)} open</span>`:'fully staffed'}</div></div>
    <div class="kpi"><div class="lab">Avg Mapped Salary</div><div class="val">${usd(t/Math.max(divHC(d),1))}</div>
      <div class="meta">across mapped seats</div></div>
    <div class="kpi"><div class="lab">${d.revenue?'Cost % of Revenue':'Revenue Base'}</div>
      <div class="val">${costPctRev!=null?pct(costPctRev):'&mdash;'}</div>
      <div class="meta">${d.revenue?'on '+usd(d.revenue):'portfolio overhead'}</div></div>
  </div>`;

  const hasGroups = d.groups.length>1;
  html += `<div class="block">
    <div class="head"><h3 class="serif">${d.name} &middot; Mapped positions</h3>
      <span class="note">Annual base salary</span></div>
    <div class="pad"><table><thead class="navy"><tr>
      <th>Name</th><th>Role</th><th>Status</th><th class="sortable" data-sort="s">Base Salary <span class="arr">&#9660;</span></th>
      <th>% of ${hasGroups?'Group':'Division'}</th></tr></thead><tbody>`;

  d.groups.forEach(g=>{
    const gt = groupTotal(g);
    if(hasGroups){
      html+=`<tr class="grouphdr"><td colspan="5">
        <span class="grouplabel">${g.name}</span>
        ${g.revenue?`<span class="grouprev"> &middot; ${usd(g.revenue)} revenue &middot; ${pct(gt/g.revenue)} cost ratio</span>`:''}
      </td></tr>`;
    }
    g.positions.forEach(p=>{
      const denom = hasGroups?gt:t;
      let status = '<span class="dash">&mdash;</span>';
      if(p.open) status = '<span class="tag open">Open</span>';
      else if(p.alloc) status = '<span class="tag alloc">Allocated</span>';
      else if(p.note) status = '<span class="tag note">Note</span>';
      html+=`<tr data-salary="${p.s}">
        <td><span class="nm">${p.n}</span>${p.note?`<div class="role" style="color:#9aa3b2">${p.note}</div>`:''}</td>
        <td style="text-align:left;color:var(--text-soft)">${p.r}</td>
        <td>${status}</td>
        <td>${p.alloc?'<span class="dash">$0</span>':usd(p.s)}</td>
        <td>${p.alloc?'<span class="dash">&mdash;</span>':pct(p.s/denom)}</td></tr>`;
    });
    if(hasGroups){
      html+=`<tr class="total"><td>${g.name} total</td><td></td>
        <td>${g.positions.filter(p=>p.open).length?`<span class="neg">${g.positions.filter(p=>p.open).length} open</span>`:''}</td>
        <td>${usd(gt)}</td><td>100%</td></tr>`;
    }
  });

  html+=`<tr class="grand"><td>${d.name} total</td><td></td>
      <td>${divOpen(d)?`<span class="neg">${divOpen(d)} open</span>`:''}</td>
      <td>${usd(t)}</td><td>${pct(t/GRAND)} <span class="sub-pct">of BT</span></td></tr>`;
  html+=`</tbody></table></div></div>`;

  el.innerHTML = html;
  // sort handler
  const th = el.querySelector('th[data-sort]');
  if(th){ let asc=false;
    th.addEventListener('click',()=>{
      asc=!asc;
      el.querySelectorAll('tbody').forEach(tb=>{});
      const tbody = el.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr[data-salary]'));
      rows.sort((a,b)=>(+a.dataset.salary-+b.dataset.salary)*(asc?1:-1));
      // re-render flat (drop group rows) when sorting
      tbody.querySelectorAll('.grouphdr,.total,.grand').forEach(r=>r.style.display='none');
      rows.forEach(r=>tbody.appendChild(r));
      th.querySelector('.arr').innerHTML = asc?'&#9650;':'&#9660;';
    });
  }
}

/* ============================ OUTLET EFFICIENCY ============================ */
function renderOutlets(){
  const el = document.getElementById('view-outlets');
  const fb = DIVISIONS.find(d=>d.id==='fb');
  const revOutlets = fb.groups.filter(g=>g.revenue);
  const overhead = fb.groups.filter(g=>!g.revenue);
  const directCost = revOutlets.reduce((a,g)=>a+groupTotal(g),0);
  const directRev  = revOutlets.reduce((a,g)=>a+g.revenue,0);
  const blended = directCost/directRev;       // benchmark
  const overheadCost = overhead.reduce((a,g)=>a+groupTotal(g),0);

  // map outlet -> YoY where available
  const yoyFor = name => {
    if(name==='Le Supreme / Bar Rotunda') return FB_REVENUE['Le Supreme / Bar Rotunda'].yoy;
    if(name==='Hiroki-San') return FB_REVENUE['Hiroki-San'].yoy;
    if(name==='Kampers / Anthology') return null; // blended 7.2 / 3.4
    return null;
  };

  let html = `
  <div class="breadcrumb">Intel &nbsp;&#8250;&nbsp; Management Cost &nbsp;&#8250;&nbsp; <b>Outlet efficiency</b></div>
  <h1 class="pagetitle serif">F&amp;B Outlet Efficiency<span class="sub">Management cost against revenue &middot; fiscal 2026</span></h1>

  <div class="kpis">
    <div class="kpi"><div class="lab">Outlet Mgmt Cost</div><div class="val">${usd(directCost)}</div>
      <div class="meta">direct, revenue-bearing outlets</div></div>
    <div class="kpi"><div class="lab">Blended Cost Ratio</div><div class="val">${pct(blended)}</div>
      <div class="meta">benchmark across outlets</div></div>
    <div class="kpi"><div class="lab">F&amp;B Overhead</div><div class="val">${usd(overheadCost)}</div>
      <div class="meta">Leadership + Pastry, not outlet-attributed</div></div>
    <div class="kpi"><div class="lab">F&amp;B Revenue</div><div class="val">$${(fb.revenue/1e6).toFixed(1)}M</div>
      <div class="meta"><span class="pos">+0.8%</span> vs prior year</div></div>
  </div>

  <div class="block"><div class="head"><h3 class="serif">Revenue-bearing outlets</h3>
    <span class="note">Variance vs blended ${pct(blended)} benchmark &middot; green = leaner</span></div>
    <div class="pad"><table><thead class="navy"><tr>
      <th>Outlet</th><th>Headcount</th><th>Mgmt Cost</th><th>Revenue</th>
      <th>Cost % Rev</th><th>Var vs Bmk</th><th>Rev YoY</th></tr></thead><tbody>`;

  revOutlets.forEach(g=>{
    const c=groupTotal(g), cpr=c/g.revenue, varr=cpr-blended;
    const lean = varr<=0;
    const yoy = yoyFor(g.name);
    html+=`<tr>
      <td><span class="nm">${g.name}</span></td>
      <td>${g.positions.filter(p=>!p.alloc).length}</td>
      <td>${usd(c)}</td>
      <td>${usd(g.revenue)}</td>
      <td>${pct(cpr)}</td>
      <td class="${lean?'pos':'neg'}">${(lean?'\u2212':'+')}${Math.abs(varr*100).toFixed(1)} pts</td>
      <td>${yoy!=null?`<span class="${yoy>=0?'pos':'neg'}">${signedPct(yoy)}</span>`
        :`<span class="sub-pct">blended +5.8%</span>`}</td></tr>`;
  });
  html+=`<tr class="grand">
      <td>Outlet blended</td>
      <td>${revOutlets.reduce((a,g)=>a+g.positions.filter(p=>!p.alloc).length,0)}</td>
      <td>${usd(directCost)}</td>
      <td>${usd(directRev)}</td>
      <td>${pct(blended)}</td>
      <td>&mdash;</td>
      <td><span class="pos">+0.8%</span></td></tr>`;
  html+=`</tbody></table></div></div>`;

  // overhead
  html += `<div class="block"><div class="head"><h3 class="serif">F&amp;B overhead</h3>
    <span class="note">Support layers without directly attributed revenue</span></div>
    <div class="pad"><table><thead class="navy"><tr>
      <th>Group</th><th>Headcount</th><th>Mgmt Cost</th><th>Share of F&amp;B Cost</th></tr></thead><tbody>`;
  overhead.forEach(g=>{
    const c=groupTotal(g);
    html+=`<tr><td><span class="nm">${g.name}</span></td>
      <td>${g.positions.filter(p=>!p.alloc).length}</td>
      <td>${usd(c)}</td><td>${pct(c/divTotal(fb))}</td></tr>`;
  });
  html+=`<tr class="total"><td>Overhead total</td>
      <td>${overhead.reduce((a,g)=>a+g.positions.length,0)}</td>
      <td>${usd(overheadCost)}</td><td>${pct(overheadCost/divTotal(fb))}</td></tr>`;
  html+=`</tbody></table></div></div>`;

  html += `<div class="insights">
    <div class="insight"><div class="top"><span class="chip">Efficiency</span><span class="oid">O1</span>
      <span class="conf high"><span class="dot"></span>High confidence</span></div>
      <h4>Kampers / Anthology is the leanest revenue outlet on management cost</h4>
      <p>At <b>${pct(groupTotal(fb.groups.find(g=>g.name==='Kampers / Anthology'))/KAMP_REV)}</b> of revenue, Kampers / Anthology
      runs well under the <b>${pct(blended)}</b> blended benchmark, helped by its combined $6.78M top line. Hiroki-San and
      Le Supreme / Bar Rotunda each carry heavier oversight ratios near 9&ndash;9.5%, where a larger chef-and-manager bench
      meets thinner per-outlet revenue.</p></div>
    <div class="insight"><div class="top"><span class="chip">Risk</span><span class="oid">O2</span>
      <span class="conf med"><span class="dot"></span>Medium confidence</span></div>
      <h4>Le Supreme is the only outlet with declining revenue and an open GM seat</h4>
      <p>Le Supreme / Bar Rotunda is down <b>7.5%</b> year over year while its General Manager role sits open at $95,000.
      The combination &mdash; the largest single revenue line, a leadership gap, and a negative trend &mdash; makes this the
      first place to prioritize a hire and watch cost ratio drift.</p></div>
  </div>`;

  el.innerHTML = html;
}

/* ============================ ORG & COST MAP ============================ */
const ORG = {
  n:'John Lenchen', r:'VP of Sales', s:180000, lab:'Book Tower',
  k:[
    { lab:'F&B', n:'David Massoni', r:'Director of Operations', s:160000, k:[
      { n:'Nyle Flynn', r:'Executive Chef', s:45000 },
      { n:'Patrick Jobst', r:'Director of Beverage', s:125000, k:[
        { lab:'Kampers / Anthology', n:'Stephanie Jordan', r:'General Manager', s:100000, k:[
          { n:'TBD', r:'Banquet Manager', s:90000, open:true },
          { n:'Joseph McMann', r:'Asst GM', s:75000, k:[ {n:'Shiana', r:'Restaurant Manager', s:65000} ]},
          { n:'Mohammed', r:'Executive Chef', s:88000, k:[ {n:'Dylan Clement', r:'Sous Chef', s:59200} ]},
        ]},
        { lab:'Pastry', n:'Hailey Enszer', r:'EC – Pastry', s:99000, k:[ {n:'Neal Murakami', r:'Sous – Pastry', s:57200} ]},
        { lab:'Le Supreme / Bar Rotunda', n:'OPEN', r:'General Manager', s:95000, open:true, k:[
          { n:'Jono Tacconilli', r:'Asst GM', s:88000, k:[
            {n:'Dominic Fosmore', r:'Restaurant Manager', s:62500},
            {n:'Briana Swayze', r:'Restaurant Manager', s:67500},
          ]},
          { n:'Nyle Flynn', r:'Executive Chef', s:100000, k:[
            {n:'Dylan Trippe Edwards', r:'Sous Chef', s:68000},
            {n:'Mitchell Driesenga', r:'Sous Chef', s:65000},
            {n:'Nino Toigo', r:'Sous Chef', s:64000},
          ]},
        ]},
        { lab:'Hiroki-San', n:'Naomi Scott', r:'General Manager', s:88000, k:[
          { n:'Petr Balcarovsky', r:'Restaurant Manager', s:70000 },
          { n:'Christian Vasquez', r:'Executive Chef', s:95000, k:[
            {n:'Louis Placido', r:'Sushi Chef', s:75000},
            {n:'Aiden Toby', r:'Sous Chef', s:64000},
          ]},
        ]},
      ]},
    ]},
    { lab:'Sales', n:'John Lenchen', r:'VP of Sales', s:0, alloc:true, k:[
      { n:'Tamika Nixon', r:'Senior Sales – Corp', s:95000, k:[ {n:'YooRim Kim', r:'Group Sales Manager', s:75000} ]},
      { n:'Lyndsay Zelenak', r:'Senior Sales – Events', s:83000, k:[
        {n:'Lee-Ann Platt', r:'Event Sales Manager', s:70000},
        {n:'Keeley Najor', r:'Conference Services Mgr', s:60000},
      ]},
    ]},
    { lab:'ROOST', n:'Chris Cavanough', r:'ROOST GM (57%)', s:80000, k:[
      { n:'Jo-Nathan Gross', r:'Assistant GM', s:90000, k:[
        { n:'Karla Robinson-Sims', r:'Housekeeping Mgr', s:63000, k:[ {n:'MaShall Devine', r:'Asst Housekeeping', s:48000} ]},
        { n:'Rachelle Douro', r:'Director, Front Office', s:75000, k:[ {n:'Dominic Marchese', r:'Asst, Front Office', s:50000} ]},
      ]},
    ]},
    { lab:'Shared Services', n:'Craig Zerbe', r:'Facilities Manager', s:75000, k:[
      { n:'Jenna Chimenti', r:'HR Coordinator', s:60000 },
      { n:'Olivia Brazer', r:'Marketing / Comm', s:60000 },
    ]},
  ]
};

function nodeHtml(node, depth){
  const hasK = node.k && node.k.length;
  const cls = 'node'+(node.open?' open':'')+(hasK?' has-children':'');
  const sal = node.alloc ? '$0 &middot; alloc' : usd(node.s);
  const lab = node.lab ? `<div class="nlab">${node.lab}</div>` : '';
  let h = `<li data-depth="${depth}"${hasK && depth>=3?' class="collapsed"':''}>`;
  h += `<div class="${cls}" ${hasK?'tabindex="0" role="button"':''}>${lab}
        <div class="nn">${node.n}</div><div class="nr">${node.r}</div><div class="ns">${sal}</div></div>`;
  if(hasK){
    h += '<ul>'+node.k.map(c=>nodeHtml(c,depth+1)).join('')+'</ul>';
  }
  h += '</li>';
  return h;
}

function renderOrg(){
  const el = document.getElementById('view-org');
  el.innerHTML = `
  <div class="breadcrumb">Intel &nbsp;&#8250;&nbsp; Management Cost &nbsp;&#8250;&nbsp; <b>Org &amp; cost map</b></div>
  <h1 class="pagetitle serif">Org &amp; Cost Map<span class="sub">Reporting lines with mapped salary &middot; click a node to expand</span></h1>
  <div class="orgbar">
    <button class="pill" id="expandAll">Expand all</button>
    <button class="pill" id="collapseAll">Collapse to divisions</button>
  </div>
  <div class="orgscroll"><div class="tree"><ul>${nodeHtml(ORG,0)}</ul></div></div>
  <div class="legend">
    <span><i class="f"></i> Filled seat</span>
    <span><i class="o"></i> Open / to recruit</span>
    <span style="margin-left:auto;color:var(--muted)">Lower levels start collapsed for readability</span>
  </div>`;

  // toggle on node click
  el.querySelectorAll('.node.has-children').forEach(nd=>{
    const toggle = ()=> nd.parentElement.classList.toggle('collapsed');
    nd.addEventListener('click', toggle);
    nd.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
  });
  el.querySelector('#expandAll').addEventListener('click',()=>{
    el.querySelectorAll('.tree li').forEach(li=>li.classList.remove('collapsed'));
  });
  el.querySelector('#collapseAll').addEventListener('click',()=>{
    el.querySelectorAll('.tree li').forEach(li=>{
      const hasUl = li.querySelector(':scope > ul');
      li.classList.toggle('collapsed', !!hasUl && +li.dataset.depth>=1);
    });
    centerOnRoot();
  });

  // center the horizontal scroll on the apex node so the top of the hierarchy is the focal point
  function centerOnRoot(){
    const scroll = el.querySelector('.orgscroll');
    const root = el.querySelector('.tree > ul > li > .node');
    if(scroll && root){
      const r = root.getBoundingClientRect(), s = scroll.getBoundingClientRect();
      scroll.scrollLeft += (r.left - s.left) - (s.width/2) + (r.width/2);
    }
  }
  requestAnimationFrame(centerOnRoot);
}

/* ==================== ALLOCATION DRIVERS ==================== */
const OUTLETS = [
  {k:'roost', label:'ROOST',     full:'ROOST (rooms)'},
  {k:'lsd',   label:'Le Supreme', full:'Le Supreme / Bar Rotunda'},
  {k:'hs',    label:'Hiroki-San', full:'Hiroki-San'},
  {k:'kamp',  label:'Kampers',   full:"Kamper's"},
  {k:'anth',  label:'Anthology', full:'Anthology'},
];
const DEFAULT_REV = {roost:8965850, lsd:6637901, hs:4156492, kamp:2520779, anth:4256000};

// Source of truth: salary, allocation % (whole numbers), labor category, and entity (home, for grouping).
// catByOutlet (optional) overrides a person's base category for specific outlets; none are split at present.
const DEFAULT_PEOPLE = [
  {id:'john',     n:'John Lerchin',       home:'Book Tower',     role:'VP Sales',             cat:'Sales', salary:185000, a:{roost:55,lsd:5,hs:5,kamp:5,anth:30}},
  {id:'chris',    n:'Chris Cavanaugh',    home:'ROOST',          role:'General Manager',       cat:'FOH', salary:80000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'sadoff',   n:'Scott Sadoff',       home:'F&B Leadership', role:'VP Food &amp; Beverage', cat:'FOH', salary:250000, a:{roost:0,lsd:40,hs:30,kamp:15,anth:15}},
  {id:'jobst',    n:'Patrick Jobst',      home:'F&B Leadership', role:'F&B Director - Bev',    cat:'FOH', salary:125000, a:{roost:0,lsd:40,hs:30,kamp:15,anth:15}},
  {id:'nyle',     n:'Nyle Flynn',         home:'F&B Leadership', role:'Culinary Director',     cat:'BOH', salary:145000, a:{roost:0,lsd:55,hs:5,kamp:10,anth:30}},
  {id:'tbdgm',    n:'TBD GM',             home:'Le Supreme',             role:'General Manager', open:true, cat:'FOH', salary:90000, a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'jono',     n:'Jono Tacconilli',    home:'Le Supreme',             role:'Assistant GM',          cat:'FOH', salary:88000,  a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'fosmore',  n:'Dominic Fosmore',    home:'Le Supreme',             role:'Rest Manager',          cat:'FOH', salary:62500,  a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'swayze',   n:'Briana Swayze',      home:'Le Supreme',             role:'Rest Manager',          cat:'FOH', salary:67500,  a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'dedwards', n:'Dylan Edwards',      home:'Le Supreme',             role:'Sous Chef',             cat:'BOH', salary:68000,  a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'mitchell', n:'Mitchell Drisenga',  home:'Le Supreme',             role:'Sous Chef',             cat:'BOH', salary:65000,  a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'nini',     n:'Nini Toigo',         home:'Le Supreme',             role:'Sous Chef',             cat:'BOH', salary:64000,  a:{roost:0,lsd:100,hs:0,kamp:0,anth:0}},
  {id:'hailey',   n:'Hailey Enszer',      home:'Pastry',         role:'Pastry Chef',           cat:'BOH', salary:99000,  a:{roost:0,lsd:65,hs:5,kamp:5,anth:25}},
  {id:'neal',     n:'Neal Murakami',      home:'Pastry',         role:'Pastry Sous',           cat:'BOH', salary:57200,  a:{roost:0,lsd:65,hs:5,kamp:5,anth:25}},
  {id:'naomi',    n:'Naomi Scott',        home:'Hiroki-San',             role:'General Manager',       cat:'FOH', salary:88000,  a:{roost:0,lsd:0,hs:100,kamp:0,anth:0}},
  {id:'petr',     n:'Petr Balcarovsky',   home:'Hiroki-San',             role:'Rest Manager',          cat:'FOH', salary:70000,  a:{roost:0,lsd:0,hs:100,kamp:0,anth:0}},
  {id:'christian',n:'Christian Vasquez',  home:'Hiroki-San',             role:'Exec Chef',             cat:'BOH', salary:95000,  a:{roost:0,lsd:0,hs:100,kamp:0,anth:0}},
  {id:'louis',    n:'Louis Placido',      home:'Hiroki-San',             role:'Sous Chef',             cat:'BOH', salary:75000,  a:{roost:0,lsd:0,hs:100,kamp:0,anth:0}},
  {id:'aiden',    n:'Aiden Toby',         home:'Hiroki-San',             role:'Sous Chef',             cat:'BOH', salary:64000,  a:{roost:0,lsd:0,hs:100,kamp:0,anth:0}},
  {id:'stephani', n:'Stephani Jordan',    home:'Kamp/Anth',      role:'General Manager',       cat:'FOH', salary:100000, a:{roost:0,lsd:0,hs:0,kamp:50,anth:50}},
  {id:'mcmann',   n:'Joseph McMann',      home:'Kamp/Anth',      role:'Assistant GM',          cat:'FOH', salary:75000,  a:{roost:0,lsd:10,hs:10,kamp:70,anth:10}},
  {id:'mohamad',  n:'Mohamad',            home:'Kamp/Anth',      role:'CDC',                   cat:'BOH', salary:88000,  a:{roost:0,lsd:0,hs:0,kamp:50,anth:50}},
  {id:'tbdbanq',  n:'TBD Banquet',        home:'Kamp/Anth',      role:'Rest Manager', open:true, cat:'FOH', salary:80000,  a:{roost:0,lsd:0,hs:0,kamp:0,anth:100}},
  {id:'shina',    n:'Shina',              home:'Kamp/Anth',      role:'Rest Manager',          cat:'FOH', salary:65000,  a:{roost:0,lsd:10,hs:10,kamp:70,anth:10}},
  {id:'dclement', n:'Dylan Clement',      home:'Kamp/Anth',      role:'Sous Chef',             cat:'BOH', salary:59200,  a:{roost:0,lsd:0,hs:0,kamp:50,anth:50}},
  {id:'tamika',   n:'Tamika Nixon',       home:'Sales - Rooms',  role:'Senior Sales - Corp',   cat:'Sales', salary:95000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'yoorim',   n:'YooRim Kim',         home:'Sales - Rooms',  role:'Group Sales Mgr',       cat:'Sales', salary:75000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'lindsay',  n:'Lindsay Zelenak',    home:'Sales F&B',      role:'Senior Sales - Events', cat:'Sales', salary:83000,  a:{roost:0,lsd:0,hs:0,kamp:0,anth:100}},
  {id:'leeann',   n:'Lee-Ann Platt',      home:'Sales F&B',      role:'Event Sales Mgmt',      cat:'Sales', salary:70000,  a:{roost:0,lsd:0,hs:0,kamp:0,anth:100}},
  {id:'keeley',   n:'Keeley Najor',       home:'Sales F&B',      role:'Conf Ser Sales',        cat:'Sales', salary:60000,  a:{roost:0,lsd:30,hs:25,kamp:35,anth:10}},
  {id:'gross',    n:'Jo-Nathan Gross',    home:'ROOST Ops',      role:'Assistant GM',          cat:'FOH', salary:90000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'karla',    n:'Karla Robinson-Sims',home:'ROOST Ops',      role:'Housekeeping Mgr',      cat:'BOH', salary:63000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'rachelle', n:'Rachelle Douro',     home:'ROOST Ops',      role:'Dir Front Office',      cat:'FOH', salary:75000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'mashall',  n:'MaShall Devine',     home:'ROOST Ops',      role:'Assistant Hsk',         cat:'BOH', salary:48000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'dmarchese',n:'Dominic Marcheese',  home:'ROOST Ops',      role:'Assistant FOM',         cat:'FOH', salary:50000,  a:{roost:100,lsd:0,hs:0,kamp:0,anth:0}},
  {id:'craig',    n:'Craig Zerbe',        home:'Shared Service', role:'Maintenance', shared:true, cat:'Other', salary:75000, a:{roost:40,lsd:20,hs:15,kamp:10,anth:15}},
  {id:'jenna',    n:'Jenna Chimenti',     home:'Shared Service', role:'HR', shared:true,           cat:'Other', salary:60000, a:{roost:40,lsd:20,hs:15,kamp:10,anth:15}},
  {id:'olivia',   n:'Olivia Brazer',      home:'Shared Service', role:'Marketing', shared:true,     cat:'Other', salary:60000, a:{roost:40,lsd:20,hs:15,kamp:10,anth:15}},
];

const ALLOC_KEY = 'bt_alloc_v2';
const clone = o => JSON.parse(JSON.stringify(o));
let STATE = { rev:clone(DEFAULT_REV), people:clone(DEFAULT_PEOPLE) };
let savedSnapshot = null;     // serialize() of last saved state
let lastSavedAt   = null;
let allocView     = 'both';   // 'both' | 'pct' | 'dol'

function serialize(){
  return JSON.stringify({ v:2, rev:STATE.rev, people:STATE.people.map(p=>({id:p.id, salary:p.salary, a:p.a})) });
}
function applySaved(obj){
  if(!obj) return;
  if(obj.rev) Object.keys(STATE.rev).forEach(k=>{ if(typeof obj.rev[k]==='number') STATE.rev[k]=obj.rev[k]; });
  if(Array.isArray(obj.people)){
    const byId={}; obj.people.forEach(p=>byId[p.id]=p);
    STATE.people.forEach(p=>{ const s=byId[p.id]; if(s){
      if(typeof s.salary==='number') p.salary=s.salary;
      if(s.a) p.a=Object.assign({}, p.a, s.a);
    }});
  }
}

const CAT_LABEL = {FOH:'FOH', BOH:'BOH', Other:'Other', Sales:'Sales'};
const catOf = (p,k) => (p.catByOutlet && p.catByOutlet[k]) || p.cat;
function rowDollars(p){ const o={}; OUTLETS.forEach(x=> o[x.k]= p.salary*(p.a[x.k]||0)/100); return o; }
const rowSumPct   = p => OUTLETS.reduce((a,x)=>a+(+p.a[x.k]||0),0);
const salaryGrand = () => STATE.people.reduce((a,p)=>a+(+p.salary||0),0);
const fbRev = () => STATE.rev.lsd+STATE.rev.hs+STATE.rev.kamp+STATE.rev.anth;
const btRev = () => fbRev()+STATE.rev.roost;
const revOf = k => k==='fb'?fbRev() : k==='bt'?btRev() : STATE.rev[k];

function categoryTotals(){
  const Z=()=>({roost:0,lsd:0,hs:0,kamp:0,anth:0});
  const out={foh:Z(),boh:Z(),other:Z(),sales:Z(),total:Z()};
  STATE.people.forEach(p=>{ const d=rowDollars(p);
    OUTLETS.forEach(o=>{ const key=catOf(p,o.k).toLowerCase(); if(out[key]) out[key][o.k]+=d[o.k]; out.total[o.k]+=d[o.k]; });
  });
  out.comb=Z(); OUTLETS.forEach(o=>out.comb[o.k]=out.foh[o.k]+out.boh[o.k]);
  Object.values(out).forEach(r=>{ r.fb=r.lsd+r.hs+r.kamp+r.anth; r.bt=r.roost+r.fb; });
  return out;
}
const CATROWS = [
  {k:'foh',  label:'FOH · front of house'},
  {k:'boh',  label:'BOH · back of house'},
  {k:'comb', label:'FOH + BOH · salaried F&B labor'},
  {k:'other',label:'Other · shared / overhead'},
  {k:'sales',label:'Sales'},
  {k:'total',label:'Total mapped labor'},
];
const CSCOLS = [
  {k:'roost',label:'ROOST'},{k:'lsd',label:'Le Supreme'},{k:'hs',label:'Hiroki-San'},
  {k:'kamp',label:'Kampers'},{k:'anth',label:'Anthology'},
  {k:'fb',label:'Total F&B',cls:'fbcol'},{k:'bt',label:'Total BT',cls:'btcol'},
];
const fmtMoney = n => Math.round(n).toLocaleString('en-US');
const parseNum = s => { const v=parseFloat(String(s).replace(/[^0-9.\-]/g,'')); return isNaN(v)?0:v; };
const pidOf = id => STATE.people.find(p=>p.id===id);

/* ---------- render ---------- */
function renderAlloc(){
  const el=document.getElementById('view-alloc');
  const noStore = !(window.storage && window.storage.set);
  el.innerHTML = `
    <div class="breadcrumb">Intel <span>&rsaquo;</span> Management Cost <span>&rsaquo;</span> <b>Allocation drivers</b></div>
    <h1 class="pagetitle serif">Allocation Drivers<span class="sub">Salaried cost allocated across entities &middot; FOH / BOH labor view</span></h1>
    <div class="kpis">
      <div class="kpi"><div class="lab">Total Mapped Salary</div><div class="val" id="kpiSalary"></div><div class="meta" id="kpiSalaryMeta"></div></div>
      <div class="kpi"><div class="lab">F&amp;B FOH Salaried</div><div class="val" id="kpiFoh"></div><div class="meta" id="kpiFohMeta"></div></div>
      <div class="kpi"><div class="lab">F&amp;B BOH Salaried</div><div class="val" id="kpiBoh"></div><div class="meta" id="kpiBohMeta"></div></div>
      <div class="kpi"><div class="lab">F&amp;B FOH + BOH</div><div class="val" id="kpiComb"></div><div class="meta" id="kpiCombMeta"></div></div>
    </div>
    <div class="block revblock">
      <div class="head"><h3 class="serif">Outlet revenue</h3><span class="note">editable &middot; drives the cost ratios</span></div>
      <div class="pad revgrid">
        ${OUTLETS.map(o=>`<div class="revcell"><div class="rl">${o.label}<span>${o.full}</span></div>
          <div class="amt-wrap"><span class="sym">$</span><input class="amt-in rev-in" data-k="${o.k}" value="${fmtMoney(STATE.rev[o.k])}" inputmode="numeric" aria-label="${o.full} revenue"/></div></div>`).join('')}
        <div class="revcell tot"><div class="rl">Total Book Tower</div><div class="rv" id="revtotal"></div></div>
      </div>
    </div>

    <div class="csumhead"><h3 class="serif">F&amp;B labor — FOH vs BOH</h3><span class="note">salaried management cost by category &middot; $ and % of revenue</span></div>
    ${csumHtml()}

    <div class="alloc-toolbar">
      <div class="segmented" id="allocSeg">
        <button data-mode="both" class="${allocView==='both'?'on':''}">Percent + dollars</button>
        <button data-mode="pct"  class="${allocView==='pct'?'on':''}">Percent</button>
        <button data-mode="dol"  class="${allocView==='dol'?'on':''}">Dollars</button>
      </div>
      <div class="grow"></div>
      <div class="savestate" id="saveState"><span class="dot"></span><span id="saveStateTxt">No changes</span></div>
      <button class="btn" id="btnRevert" title="Discard edits and reload the last saved model">Revert</button>
      <button class="btn" id="btnReset" title="Reset every value to the original worksheet">Reset to defaults</button>
      <button class="btn primary" id="btnSave"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h11l3 3v13H5z"/><path d="M8 4v5h7M8 20v-6h8v6"/></svg>Save</button>
    </div>
    ${noStore?'<div class="alloc-banner">Heads up: persistent cross-session saving works when this report is open inside Claude. In a plain browser preview, edits are kept for this session only.</div>':''}
    <div class="allocwrap">${allocTableHtml()}</div>
    <div class="foot">
      <b>How it computes:</b> each outlet dollar = salary &times; that outlet's %; outlet <b>cost ratio</b> = allocated cost &divide; outlet revenue.
      Each role carries a labor category (<span class="catchip foh">FOH</span> <span class="catchip boh">BOH</span> <span class="catchip other">Other</span> <span class="catchip sales">Sales</span>) that rolls into the summary above. A role's category can be overridden for a specific outlet (marked <b>*</b>) when its work differs by venue; none are split at present.
      <b>Save</b> stores this model to the report so your edits persist after you close and reopen Claude.
    </div>`;
  wireAlloc();
  recomputeDerived();
  updateSaveState();
}

function csumHtml(){
  let h='<thead><tr><th>Labor category</th>'+CSCOLS.map(c=>`<th class="${c.cls||''}">${c.label}</th>`).join('')+'</tr></thead><tbody>';
  CATROWS.forEach(cat=>{
    const cls = cat.k==='comb'?'comb':cat.k==='total'?'total':'';
    h+=`<tr class="${cls}"><td>${cat.label}</td>`;
    CSCOLS.forEach(c=> h+=`<td class="${c.cls||''}"><div class="cs-d" id="cs-${cat.k}-${c.k}-d"></div><div class="cs-p" id="cs-${cat.k}-${c.k}-p"></div></td>`);
    h+='</tr>';
  });
  h+='</tbody>';
  return `<div class="csum-wrap"><table class="csum">${h}</table></div>`;
}

function allocTableHtml(){
  const showPct = allocView!=='dol', showDol = allocView!=='pct';
  let head = '<thead><tr><th>Name</th><th>Salary</th>';
  if(showPct){ OUTLETS.forEach((o,i)=> head+=`<th class="grp-pct${i===0?' col-sep':''}">${o.label} %</th>`); head+='<th class="grp-pct">&Sigma;</th>'; }
  if(showDol){ OUTLETS.forEach((o,i)=> head+=`<th class="grp-dol${i===0?' col-sep':''}">${o.label} $</th>`); head+='<th class="grp-dol">Allocated</th>'; }
  head+='</tr></thead>';

  let body='<tbody>'; let lastHome=null;
  const ncols = 2 + (showPct?OUTLETS.length+1:0) + (showDol?OUTLETS.length+1:0);
  STATE.people.forEach(p=>{
    if(p.home!==lastHome){ body+=`<tr class="grp"><td colspan="${ncols}"><span class="grplab">${p.home}</span></td></tr>`; lastHome=p.home; }
    const cc=p.cat.toLowerCase(); const star = p.catByOutlet ? ' *' : '';
    body+=`<tr><td><div class="nmrow"><span class="nm2">${p.n}${p.open?'<span class="openpill">Open</span>':''}</span><span class="catchip ${cc}">${CAT_LABEL[p.cat]}${star}</span></div><div class="home">${p.role}</div></td>`;
    body+=`<td><div class="amt-wrap"><span class="sym">$</span><input class="amt-in" data-id="${p.id}" data-f="salary" value="${fmtMoney(p.salary)}" inputmode="numeric" aria-label="${p.n} salary"/></div></td>`;
    if(showPct){
      OUTLETS.forEach((o,i)=> body+=`<td class="${i===0?'col-sep':''}"><span class="pct-wrap"><input class="pct-in" data-id="${p.id}" data-k="${o.k}" value="${p.a[o.k]||0}" inputmode="numeric" aria-label="${p.n} ${o.label} percent"/><span class="sym">%</span></span></td>`);
      body+=`<td><span class="rowsum" id="sum-${p.id}"></span></td>`;
    }
    if(showDol){
      OUTLETS.forEach((o,i)=> body+=`<td class="dollarcell${i===0?' col-sep':''}" id="dol-${p.id}-${o.k}"></td>`);
      body+=`<td class="dollarcell" id="tot-${p.id}"></td>`;
    }
    body+='</tr>';
  });
  body+='<tr class="foot"><td>Total</td><td id="ftsal"></td>';
  if(showPct){ OUTLETS.forEach(()=> body+='<td></td>'); body+='<td></td>'; }
  if(showDol){ OUTLETS.forEach(o=> body+=`<td id="ftcol-${o.k}"></td>`); body+='<td id="ftalloc"></td>'; }
  body+='</tr>';
  if(showDol){
    body+='<tr class="ratio"><td>Cost % of revenue</td><td></td>';
    if(showPct){ OUTLETS.forEach(()=> body+='<td></td>'); body+='<td></td>'; }
    OUTLETS.forEach(o=> body+=`<td id="rat-${o.k}"></td>`); body+='<td id="ratbt"></td>';
    body+='</tr>';
  }
  body+='</tbody>';
  return `<table class="alloc">${head}${body}</table>`;
}

const setTxt = (id,v)=>{ const e=document.getElementById(id); if(e) e.textContent=v; };
const setHtml= (id,v)=>{ const e=document.getElementById(id); if(e) e.innerHTML=v; };

function recomputeDerived(){
  const totals={roost:0,lsd:0,hs:0,kamp:0,anth:0};
  STATE.people.forEach(p=>{
    const d=rowDollars(p); let rowTot=0;
    OUTLETS.forEach(o=>{
      totals[o.k]+=d[o.k]; rowTot+=d[o.k];
      const c=document.getElementById(`dol-${p.id}-${o.k}`);
      if(c){ c.textContent=d[o.k]?usd(d[o.k]):'—'; c.classList.toggle('zero',!d[o.k]); }
    });
    const tot=document.getElementById(`tot-${p.id}`);
    if(tot){ tot.textContent=rowTot?usd(rowTot):'—'; tot.classList.toggle('zero',!rowTot); }
    const sum=document.getElementById(`sum-${p.id}`);
    if(sum){ const sp=rowSumPct(p); sum.textContent=Math.round(sp*100)/100+'%'; sum.className='rowsum '+(sp===100?'ok':'bad');
      sum.title=sp===100?'Allocations total 100%':'Allocations total '+sp+'% (should be 100%)'; }
  });
  const salG=salaryGrand(), allocG=totals.roost+totals.lsd+totals.hs+totals.kamp+totals.anth, rev=btRev();
  setTxt('ftsal', usd(salG));
  OUTLETS.forEach(o=>{ setTxt(`ftcol-${o.k}`, usd(totals[o.k])); setTxt(`rat-${o.k}`, STATE.rev[o.k]?pct(totals[o.k]/STATE.rev[o.k]):'—'); });
  setTxt('ftalloc', usd(allocG));
  setTxt('ratbt', rev?pct(allocG/rev):'—');
  setTxt('revtotal', usd(rev));

  // category summary
  const ct=categoryTotals();
  CATROWS.forEach(cat=>{
    const row = ct[cat.k];
    CSCOLS.forEach(c=>{ setTxt(`cs-${cat.k}-${c.k}-d`, usd(row[c.k])); const r=revOf(c.k); setTxt(`cs-${cat.k}-${c.k}-p`, r?pct(row[c.k]/r):'—'); });
  });

  // KPIs
  const fb=fbRev();
  setTxt('kpiSalary', usd(salG)); setHtml('kpiSalaryMeta', `${STATE.people.length} mapped roles · ${usd(allocG)} allocated`);
  setTxt('kpiFoh', usd(ct.foh.fb)); setHtml('kpiFohMeta', `${fb?pct(ct.foh.fb/fb):'—'} of F&amp;B revenue`);
  setTxt('kpiBoh', usd(ct.boh.fb)); setHtml('kpiBohMeta', `${fb?pct(ct.boh.fb/fb):'—'} of F&amp;B revenue`);
  setTxt('kpiComb', usd(ct.comb.fb)); setHtml('kpiCombMeta', `${fb?pct(ct.comb.fb/fb):'—'} of F&amp;B revenue`);
  updateSaveState();
}

function updateSaveState(mode){
  const wrap=document.getElementById('saveState'), txt=document.getElementById('saveStateTxt');
  if(!wrap||!txt) return;
  const dirty = savedSnapshot===null ? false : (serialize()!==savedSnapshot);
  wrap.className='savestate';
  if(mode==='saving'){ txt.textContent='Saving…'; return; }
  if(mode==='error'){ wrap.classList.add('warn'); txt.textContent='Save failed — try again'; return; }
  if(mode==='session'){ wrap.classList.add('saved'); txt.textContent='Saved for this session'; return; }
  if(mode==='saved' || (!dirty && lastSavedAt)){ wrap.classList.add('saved');
    txt.textContent='Saved'+(lastSavedAt?' · '+lastSavedAt.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}):''); return; }
  if(dirty){ wrap.classList.add('dirty'); txt.textContent='Unsaved changes'; return; }
  txt.textContent='No changes';
}

function wireAlloc(){
  const root=document.getElementById('view-alloc');
  root.querySelector('#allocSeg').addEventListener('click', e=>{ const b=e.target.closest('button'); if(!b) return; allocView=b.dataset.mode; renderAlloc(); });
  root.querySelector('#btnSave').addEventListener('click', doSave);
  root.querySelector('#btnRevert').addEventListener('click', doRevert);
  root.querySelector('#btnReset').addEventListener('click', ()=>{ if(confirm('Reset every salary, allocation %, and revenue back to the original worksheet values? Unsaved edits will be lost.')) doReset(); });
  root.addEventListener('input', e=>{
    const t=e.target;
    if(t.classList.contains('rev-in')){ STATE.rev[t.dataset.k]=parseNum(t.value); recomputeDerived(); }
    else if(t.classList.contains('amt-in') && t.dataset.f==='salary'){ const p=pidOf(t.dataset.id); if(p) p.salary=parseNum(t.value); recomputeDerived(); }
    else if(t.classList.contains('pct-in')){ const p=pidOf(t.dataset.id); if(p) p.a[t.dataset.k]=parseNum(t.value); recomputeDerived(); }
  });
  root.addEventListener('blur', e=>{
    const t=e.target;
    if(t.classList.contains('amt-in')) t.value=fmtMoney(parseNum(t.value));
    else if(t.classList.contains('pct-in')){ let v=parseNum(t.value); if(v<0) v=0; t.value=String(Math.round(v*100)/100); }
  }, true);
}

async function doSave(){
  if(!(window.storage && window.storage.set)){ savedSnapshot=serialize(); lastSavedAt=new Date(); updateSaveState('session'); return; }
  updateSaveState('saving');
  try{ await window.storage.set(ALLOC_KEY, serialize()); savedSnapshot=serialize(); lastSavedAt=new Date(); updateSaveState('saved'); }
  catch(e){ updateSaveState('error'); }
}
async function doRevert(){
  let stored=null;
  if(window.storage && window.storage.get){ try{ const r=await window.storage.get(ALLOC_KEY); if(r&&r.value) stored=JSON.parse(r.value); }catch(e){} }
  STATE={rev:clone(DEFAULT_REV), people:clone(DEFAULT_PEOPLE)};
  if(stored) applySaved(stored); else if(savedSnapshot) applySaved(JSON.parse(savedSnapshot));
  savedSnapshot=serialize();
  renderAlloc();
}
function doReset(){
  STATE={rev:clone(DEFAULT_REV), people:clone(DEFAULT_PEOPLE)};
  renderAlloc();
}
async function initAllocStorage(){
  let stored=null;
  if(window.storage && window.storage.get){ try{ const r=await window.storage.get(ALLOC_KEY); if(r&&r.value) stored=JSON.parse(r.value); }catch(e){ stored=null; } }
  if(stored){ applySaved(stored); lastSavedAt=null; }
  savedSnapshot=serialize();
  if(document.getElementById('view-alloc').classList.contains('show')) renderAlloc();
}

/* ==================== BOOK TOWER F&B SUMMARY ==================== */
let fbZoom = 1;
let fbShowNames = true;
let fbShowSales = true;
const fbExpand = {FOH:true, BOH:true, Sales:false};
const FB_COLS = [
  {k:'lsd',   label:'Le Supreme'},
  {k:'hs',    label:'Hiroki-San'},
  {k:'kamp',  label:'Kampers'},
  {k:'anth',  label:'Anthology'},
  {k:'fb',    label:'Total F&B', cls:'grand'},
];
const FB_GROUPS_TOP = [
  {cat:'FOH', label:'front of house', chip:'foh'},
  {cat:'BOH', label:'back of house',  chip:'boh'},
];
const FB_GROUPS_BOT = [
  {cat:'Sales', label:'sales', chip:'sales'},
];

const FB_OUTLET_KEYS = FB_COLS.map(c=>c.k).filter(k=>OUTLETS.some(o=>o.k===k));

// Approximate management/salaried-labor benchmarks (% of outlet revenue) split FOH / BOH by venue type. Directional — tune to market.
const FB_BENCH = {
  lsd:  {foh:6.0, boh:6.0, sales:0.5},   // full-service restaurant
  hs:   {foh:6.0, boh:6.0, sales:0.5},   // full-service restaurant
  kamp: {foh:5.5, boh:2.5, sales:1.0},   // rooftop bar / lounge
  anth: {foh:6.0, boh:4.0, sales:5.0},   // event venue — sales is core, ~5% is normal
};
const FB_VENUE = {lsd:'Full-service restaurant', hs:'Full-service restaurant', kamp:'Rooftop bar / lounge', anth:'Event venue'};

function benchPctOf(catKey, outletKey){
  const bp=FB_BENCH[outletKey]; if(!bp) return 0;
  return catKey==='comb' ? (bp.foh||0)+(bp.boh||0) : (bp[catKey]||0);
}
function actOf(ct, catKey, k){ return catKey==='comb' ? ct.foh[k]+ct.boh[k] : ct[catKey][k]; }

function fbBenchPair(catKey, label, extra, neutral){
  const ct=categoryTotals();
  let tgtFb=0, actFb=0, benchCells='', varyCells='';
  const vcl = dv => neutral ? 'vneutral' : (dv>0?'over':'under');
  FB_COLS.forEach(c=>{
    if(c.k==='fb'){
      const rev=fbRev(), bpct=rev?tgtFb/rev*100:0, dv=actFb-tgtFb, pv=rev?dv/rev*100:0, vc=vcl(dv);
      benchCells += `<td class="d grand">${usd(tgtFb)}</td><td class="p grand">${bpct.toFixed(1)}%</td>`;
      varyCells  += `<td class="d grand ${vc}">${signedUsd(dv)}</td><td class="p grand ${vc}">${signedPct(pv)}</td>`;
      return;
    }
    const rev=STATE.rev[c.k]||0, bp=benchPctOf(catKey,c.k), tgt=bp/100*rev, act=actOf(ct,catKey,c.k);
    tgtFb+=tgt; actFb+=act;
    const dv=act-tgt, pv=rev?dv/rev*100:0, vc=vcl(dv);
    benchCells += `<td class="d">${usd(tgt)}</td><td class="p">${bp.toFixed(1)}%</td>`;
    varyCells  += `<td class="d ${vc}">${signedUsd(dv)}</td><td class="p ${vc}">${signedPct(pv)}</td>`;
  });
  const x = extra?' '+extra:'';
  return `<tr class="benchrow${x}"><td class="lab"><span class="catchip ${catKey==='comb'?'foh':catKey}">${label}</span> benchmark</td>${benchCells}</tr>`
       + `<tr class="varyrow${x}"><td class="lab">${label} variance</td>${varyCells}</tr>`;
}
function fbBenchBlock(){
  const colspan = 1 + FB_COLS.length*2;
  let h = `<tr class="benchsection"><td class="lab" colspan="${colspan}"><div class="notecap">Industry benchmarks &middot; management labor by venue type<span class="bnote">FOH &amp; BOH targets as a share of each outlet's revenue &middot; approximate, tune to market</span></div></td></tr>`
    + fbBenchPair('foh','FOH')
    + fbBenchPair('boh','BOH')
    + fbBenchPair('comb','FOH + BOH','combbench');
  if(fbShowSales){
    h += `<tr class="benchsubnote"><td class="lab" colspan="${colspan}"><div class="notecap"><b>Sales &amp; event-booking labor</b> is tracked <b>separately</b> from operating labor — not inside FOH or BOH. Per hospitality accounting (USALI), Sales &amp; Marketing is an undistributed/overhead function, judged as a cost-of-sale against booked revenue rather than an operating-efficiency metric. A ~5% load is normal for an event venue like <b>Anthology</b>, versus well under 1% for the dining rooms.</div></td></tr>`
      + fbBenchPair('sales','Sales','salesbench', true);
  }
  return h;
}

// Generalized benchmark/variance pair — act & bench are {lsd,hs,kamp,anth} maps ($ actual, % benchmark).
function fbBenchPairG(o){
  let tgtFb=0, actFb=0, benchCells='', varyCells='';
  const vcl = dv => o.neutral ? 'vneutral' : (dv>0?'over':'under');
  FB_COLS.forEach(c=>{
    if(c.k==='fb'){
      const rev=fbRev(), bpct=rev?tgtFb/rev*100:0, dv=actFb-tgtFb, pv=rev?dv/rev*100:0, vc=vcl(dv);
      benchCells += `<td class="d grand">${usd(tgtFb)}</td><td class="p grand">${bpct.toFixed(1)}%</td>`;
      varyCells  += `<td class="d grand ${vc}">${signedUsd(dv)}</td><td class="p grand ${vc}">${signedPct(pv)}</td>`;
      return;
    }
    const rev=STATE.rev[c.k]||0, bp=(o.bench[c.k]||0), tgt=bp/100*rev, act=(o.act[c.k]||0);
    tgtFb+=tgt; actFb+=act;
    const dv=act-tgt, pv=rev?dv/rev*100:0, vc=vcl(dv);
    benchCells += `<td class="d">${usd(tgt)}</td><td class="p">${bp.toFixed(1)}%</td>`;
    varyCells  += `<td class="d ${vc}">${signedUsd(dv)}</td><td class="p ${vc}">${signedPct(pv)}</td>`;
  });
  const x = o.extra?' '+o.extra:'';
  const head = o.chip ? `<span class="catchip ${o.chip}">${o.label}</span> benchmark` : `${o.label} benchmark`;
  return `<tr class="benchrow${x}"><td class="lab">${head}</td>${benchCells}</tr>`
       + `<tr class="varyrow${x}"><td class="lab">${o.label} variance</td>${varyCells}</tr>`;
}

function fbGroupPeople(catKey){
  const rows=[];
  STATE.people.forEach(p=>{
    const d=rowDollars(p);
    const cell={roost:0,lsd:0,hs:0,kamp:0,anth:0}; let any=false;
    OUTLETS.forEach(o=>{ if(catOf(p,o.k)===catKey){ cell[o.k]=d[o.k]; if(d[o.k]>0 && FB_OUTLET_KEYS.includes(o.k)) any=true; } });
    if(any){ cell.fb=cell.lsd+cell.hs+cell.kamp+cell.anth; cell.bt=cell.roost+cell.fb; rows.push({p,cell}); }
  });
  return rows;
}
function fbCells(cell){
  return FB_COLS.map(c=>{
    const v=cell[c.k]||0, rev=revOf(c.k), x=c.cls?' '+c.cls:'';
    return `<td class="d${x}">${v?usd(v):'—'}</td><td class="p${x}">${(v&&rev)?pct(v/rev):'—'}</td>`;
  }).join('');
}
function renderFbSum(){
  const ct=categoryTotals();
  const el=document.getElementById('view-fbsum');
  const headOutlets = FB_COLS.map(c=>`<th class="outcol ${c.cls||''}" colspan="2">${c.label}</th>`).join('');
  const headUnits = FB_COLS.map(c=>`<th class="d ${c.cls||''}">$</th><th class="p ${c.cls||''}">% rev</th>`).join('');

  function groupBlock(g){
    const sub=ct[g.cat.toLowerCase()], exp=fbExpand[g.cat];
    let h=`<tr class="grouprow ${exp?'open':''}" data-cat="${g.cat}">`
        + `<td class="lab"><span class="chev">&#9656;</span><span class="catchip ${g.chip}">${CAT_LABEL[g.cat]}</span><span class="glab">${g.label}</span></td>`
        + fbCells(sub) + `</tr>`;
    if(exp){
      fbGroupPeople(g.cat).forEach(({p,cell})=>{
        const star = p.catByOutlet ? '<span class="splitmark" title="Category varies by outlet">*</span>' : '';
        h+=`<tr class="personrow"><td class="lab" title="${p.home}"><span class="pos">${p.role}</span><span class="pn">${p.n}${star}</span></td>`+fbCells(cell)+`</tr>`;
      });
    }
    return h;
  }
  const fohboh={}; FB_COLS.forEach(c=>fohboh[c.k]=ct.foh[c.k]+ct.boh[c.k]);

  let body='';
  body += `<tr class="revrow"><td class="lab">Assumed revenue<span class="bnote">basis for % of revenue</span></td>`
    + FB_COLS.map(c=>{ const x=c.cls?' '+c.cls:''; return `<td class="d${x}">${usd(revOf(c.k))}</td><td class="p${x}">—</td>`; }).join('') + `</tr>`;
  FB_GROUPS_TOP.forEach(g=> body+=groupBlock(g));
  body += `<tr class="comb"><td class="lab"><span class="chev hidden">&#9656;</span>FOH + BOH &middot; salaried F&amp;B labor</td>`+fbCells(fohboh)+`</tr>`;
  if(fbShowSales) FB_GROUPS_BOT.forEach(g=> body+=groupBlock(g));
  if(fbShowSales){
    const totDisp={}; FB_COLS.forEach(c=>totDisp[c.k]=ct.foh[c.k]+ct.boh[c.k]+ct.sales[c.k]);
    body += `<tr class="grand"><td class="lab">Total F&amp;B labor<span class="bnote">FOH + BOH + Sales &middot; excl. shared overhead</span></td>`+fbCells(totDisp)+`</tr>`;
  }
  body += fbBenchBlock();

  el.innerHTML = `
    <div class="breadcrumb">Intel <span>&rsaquo;</span> Reports <span>&rsaquo;</span> F&amp;B Labor <span>&rsaquo;</span> <b>F&amp;B Management</b></div>
    <h1 class="pagetitle serif">Book Tower — F&amp;B Management<span class="sub">Salaried management labor &middot; F&amp;B outlets only &middot; expand a category to see individuals</span></h1>
    <div class="fbsum-toolbar">
      <div class="expandctl">
        <button class="btn" id="fbExpandAll">Expand all</button>
        <button class="btn" id="fbCollapseAll">Collapse all</button>
        <button class="btn" id="fbToggleNames">Hide names</button>
        <button class="btn ${fbShowSales?'':'on'}" id="fbToggleSales">${fbShowSales?'Hide sales':'Show sales'}</button>
      </div>
      <div class="grow"></div>
      <span class="zlab">Zoom</span>
      <div class="zoomctl">
        <button id="fbZoomOut" title="Zoom out" aria-label="Zoom out">&minus;</button>
        <span class="zlevel" id="fbZoomLvl">100%</span>
        <button id="fbZoomIn" title="Zoom in" aria-label="Zoom in">+</button>
        <button id="fbZoomReset" class="reset" title="Reset zoom">Reset</button>
      </div>
    </div>
    <div class="benchlegend">
      <b>Management-labor benchmarks</b> — salaried management as a share of revenue, split <b>FOH / BOH</b> by venue type (approximate):
      <span><b>Le Supreme</b> &amp; <b>Hiroki-San</b> full-service 6% / 6%</span> &middot;
      <span><b>Kampers</b> rooftop bar/lounge 5.5% / 2.5%</span> &middot;
      <span><b>Anthology</b> event venue 6% / 4%</span>
      <br><b>Sales &amp; event-booking</b> (separate overhead — not FOH/BOH): full-service ~0.5% &middot; rooftop ~1% &middot; <b>Anthology event venue ~5%</b>
    </div>
    <div class="fbsum-scroll">
      <div class="fbsum-zoom" id="fbZoomWrap">
        <table class="fbsum">
          <thead>
            <tr class="outlets"><th class="lab" rowspan="2">Category / person</th>${headOutlets}</tr>
            <tr class="units">${headUnits}</tr>
          </thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>
    <div id="fbChartHost"></div>
    <div class="foot">
      <b>On the benchmarks:</b> these reflect typical <b>salaried-management</b> labor as a share of revenue for each venue type, split into <b>FOH</b> and <b>BOH</b>, and are directional rather than a single published standard — industry surveys quote <b>total</b> labor (incl. hourly) at roughly 30–35% of sales for full-service, of which salaried management is a portion. Each block compares the outlet's actual FOH, BOH, and combined salaried labor to its target: <span class="under">green = at or under</span>, <span class="over">red = over</span>. Tune the targets to your market.
      <br><b>On Sales:</b> sales &amp; event-booking salaries are deliberately kept out of FOH and BOH — in hospitality accounting they sit in Sales &amp; Marketing (an undistributed overhead), not operating labor. Read Anthology's ~5% sales load as a cost-of-sale on booked events, not an operating-efficiency problem; for the dining rooms sales is a rounding error (~0.3–0.4%).
    </div>`;
  wireFbSum();
  applyFbZoom();
  applyFbNames();
  buildChart(fbChartMgmt);
}
function applyFbZoom(){
  const w=document.getElementById('fbZoomWrap'); if(w) w.style.zoom=fbZoom;
  const l=document.getElementById('fbZoomLvl'); if(l) l.textContent=Math.round(fbZoom*100)+'%';
}
function applyFbNames(){
  const t=document.querySelector('#view-fbsum table.fbsum'); if(t) t.classList.toggle('names-off', !fbShowNames);
  const btn=document.getElementById('fbToggleNames'); if(btn){ btn.textContent=fbShowNames?'Hide names':'Show names'; btn.classList.toggle('on', !fbShowNames); }
}

/* ---------- F&B bar charts (generalized) ---------- */
const FB_CHART_OUTLETS = [
  {k:'lsd', label:'Le Supreme'},
  {k:'hs',  label:'Hiroki-San'},
  {k:'kamp',label:'Kampers'},
  {k:'anth',label:'Anthology'},
];
const fbNiceMax = v => { if(v<=0) return 1; const e=Math.pow(10,Math.floor(Math.log10(v))); for(const c of [1,1.25,1.5,2,2.5,3,4,5,6,8,10]){ if(c*e>=v) return c*e; } return 10*e; };
const fbAxisFmt  = (v,pct) => pct ? (Math.round(v*10)/10)+'%' : (v>=1e6?'$'+(v/1e6).toFixed(v>=1e7?0:1)+'M':v>=1e3?'$'+Math.round(v/1e3)+'K':'$'+Math.round(v));
const fbShortFmt = (v,pct) => pct ? v.toFixed(1)+'%' : (v>=1e6?'$'+(v/1e6).toFixed(2)+'M':v>=1e3?'$'+Math.round(v/1e3)+'K':'$'+Math.round(v));
const fbFullFmt  = (v,pct) => pct ? v.toFixed(1)+'%' : usd(v);
const fbDolK = v => v>=1e6?'$'+(v/1e6).toFixed(2)+'M':v>=1e3?'$'+Math.round(v/1e3)+'K':'$'+Math.round(v);

function fbChartControls(cfg){
  const st=cfg.state;
  const chips = cfg.cats.map(c=>`<button class="chartchip ${st.cats[c.key]?'on':''}" data-cat="${c.key}" style="--cc:${c.color}">${c.label||c.key}</button>`).join('');
  return `<div class="chart-toolbar">
    <div class="segmented sm" data-ctl="metric"><button data-v="dollars" class="${st.metric==='dollars'?'on':''}">$</button><button data-v="pct" class="${st.metric==='pct'?'on':''}">% of revenue</button></div>
    <div class="segmented sm" data-ctl="layout"><button data-v="grouped" class="${st.layout==='grouped'?'on':''}">Grouped</button><button data-v="stacked" class="${st.layout==='stacked'?'on':''}">Stacked</button></div>
    <div class="chartcats">${chips}</div>
    <div class="grow"></div>
    <button class="btn ${st.bench?'on':''}" data-ctl="bench">Benchmark</button>
    <button class="btn ${st.labels?'on':''}" data-ctl="labels">Values</button>
  </div>`;
}
function fbChartSvgG(cfg){
  const st=cfg.state;
  const cats=cfg.cats.filter(c=>st.cats[c.key]);
  if(!cats.length) return `<div class="chart-empty">Select at least one category to chart.</div>`;
  const pct=st.metric==='pct', stacked=st.layout==='stacked';
  const data=FB_CHART_OUTLETS.map(o=>{
    const rev=STATE.rev[o.k]||1;
    const vals=cats.map(c=>{ const raw=cfg.actual(c.ck,o.k)||0; const v=pct?raw/rev*100:raw; const bp=cfg.benchPct(c.ck,o.k)||0; const bdol=bp/100*rev; const bb=pct?bp:bdol; return {cat:c, v, b:bb, bp, bdol}; });
    return {label:o.label, k:o.k, rev, vals};
  });
  const stackBench=d=>{ if(cfg.totalBenchPct){ const tp=cfg.totalBenchPct(d.k); return {tdol:tp/100*d.rev, tpct:tp}; } return {tdol:d.vals.reduce((a,x)=>a+x.bdol,0), tpct:d.vals.reduce((a,x)=>a+x.bp,0)}; };
  let maxV=0;
  data.forEach(d=>{ if(stacked){ const sb=stackBench(d); maxV=Math.max(maxV, d.vals.reduce((a,x)=>a+x.v,0), st.bench?(pct?sb.tpct:sb.tdol):0); } else d.vals.forEach(x=>maxV=Math.max(maxV,x.v,st.bench?x.b:0)); });
  maxV=fbNiceMax(maxV);
  const W=880,H=362,mL=58,mR=14,mT=34,mB=38, plotW=W-mL-mR, plotH=H-mT-mB, y0=mT+plotH;
  const sy=v=> y0-(v/maxV)*plotH;
  let grid='';
  for(let i=0;i<=4;i++){ const v=maxV*i/4, y=sy(v); grid+=`<line x1="${mL}" y1="${y.toFixed(1)}" x2="${mL+plotW}" y2="${y.toFixed(1)}" class="cgrid"/><text x="${mL-8}" y="${(y+3).toFixed(1)}" class="cytick">${fbAxisFmt(v,pct)}</text>`; }
  const gW=plotW/data.length; let bars='', xlabels='';
  data.forEach((d,gi)=>{
    const gx=mL+gi*gW; xlabels+=`<text x="${(gx+gW/2).toFixed(1)}" y="${y0+22}" class="cxlabel">${d.label}</text>`;
    if(stacked){
      const bw=Math.min(64,gW*0.5), bx=gx+(gW-bw)/2; let acc=0;
      d.vals.forEach(x=>{ const h=(x.v/maxV)*plotH, y=y0-acc-h; bars+=`<rect x="${bx.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" fill="${x.cat.color}"><title>${(x.cat.label||x.cat.key)} · ${d.label}: ${fbFullFmt(x.v,pct)}</title></rect>`; acc+=h; });
      const cx=bx+bw/2;
      if(st.bench){ const sb=stackBench(d), yb=sy(pct?sb.tpct:sb.tdol); bars+=`<line x1="${(bx-6).toFixed(1)}" y1="${yb.toFixed(1)}" x2="${(bx+bw+6).toFixed(1)}" y2="${yb.toFixed(1)}" class="cbench"/>`; }
      let topY=y0-acc;
      if(st.labels){ const total=d.vals.reduce((a,x)=>a+x.v,0); bars+=`<text x="${cx.toFixed(1)}" y="${(topY-6).toFixed(1)}" class="cvtot">${fbShortFmt(total,pct)}</text>`; topY-=16; }
      if(st.bench){ const sb=stackBench(d); bars+=`<text x="${cx.toFixed(1)}" y="${(topY-6).toFixed(1)}" class="cbenchlabel">${pct?sb.tpct.toFixed(1)+'%':fbDolK(sb.tdol)}</text>`; }
    } else {
      const inner=gW*0.78, bw=inner/d.vals.length, startx=gx+(gW-inner)/2;
      d.vals.forEach((x,bi)=>{ const cellx=startx+bi*bw, w=Math.min(bw*0.82,54), rx=cellx+(bw-w)/2, h=(x.v/maxV)*plotH, y=y0-h, cx=rx+w/2;
        bars+=`<rect x="${rx.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${Math.max(0,h).toFixed(1)}" rx="1.5" fill="${x.cat.color}"><title>${(x.cat.label||x.cat.key)} · ${d.label}: ${fbFullFmt(x.v,pct)}</title></rect>`;
        if(st.bench && x.b>0){ const yb=sy(x.b); bars+=`<line x1="${(rx-1).toFixed(1)}" y1="${yb.toFixed(1)}" x2="${(rx+w+1).toFixed(1)}" y2="${yb.toFixed(1)}" class="cbench"/>`; }
        let topY=y;
        if(st.labels && x.v>0){ bars+=`<text x="${cx.toFixed(1)}" y="${(topY-4).toFixed(1)}" class="cvlabel">${fbShortFmt(x.v,pct)}</text>`; topY-=11; }
        if(st.bench && x.b>0){ bars+=`<text x="${cx.toFixed(1)}" y="${(topY-4).toFixed(1)}" class="cbenchlabel">${pct?x.bp.toFixed(1)+'%':fbDolK(x.bdol)}</text>`; }
      });
    }
  });
  const legend = cats.map(c=>`<span class="clegitem"><i style="background:${c.color}"></i>${c.label||c.key}</span>`).join('') + (st.bench?`<span class="clegitem"><i class="benchmark"></i>Benchmark target</span>`:'');
  return `<div class="chart-svgwrap"><svg viewBox="0 0 ${W} ${H}" class="fbchart" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Outlet labor bar chart">${grid}<line x1="${mL}" y1="${y0}" x2="${mL+plotW}" y2="${y0}" class="caxis"/>${bars}${xlabels}</svg></div><div class="chart-legend">${legend}</div>`;
}
function buildChart(cfg){
  const host=document.getElementById(cfg.id); if(!host) return;
  host.innerHTML = `<div class="chart-head"><h3 class="serif">${cfg.title||'Outlet labor — visual'}</h3><span class="note">${cfg.subtitle||'same figures as the table, charted by outlet'}</span></div>` + fbChartControls(cfg) + fbChartSvgG(cfg);
  host.onclick = (e)=>{
    const btn=e.target.closest('button'); if(!btn||!host.contains(btn)) return;
    const st=cfg.state, p=btn.parentElement;
    if(btn.dataset.cat){ st.cats[btn.dataset.cat]=!st.cats[btn.dataset.cat]; }
    else if(p && p.dataset.ctl==='metric'){ st.metric=btn.dataset.v; }
    else if(p && p.dataset.ctl==='layout'){ st.layout=btn.dataset.v; }
    else if(btn.dataset.ctl==='bench'){ st.bench=!st.bench; }
    else if(btn.dataset.ctl==='labels'){ st.labels=!st.labels; }
    else return;
    buildChart(cfg);
  };
}

const fbChartMgmt = {
  id:'fbChartHost', title:'Outlet labor — visual', subtitle:'same figures as the table, charted by outlet',
  state:{ metric:'dollars', layout:'grouped', cats:{FOH:true,BOH:true,Sales:true}, bench:false, labels:true },
  cats:[{key:'FOH',ck:'foh',color:'#27406A'},{key:'BOH',ck:'boh',color:'#4F86C6'},{key:'Sales',ck:'sales',color:'#A6CBEC'}],
  actual:(ck,k)=>categoryTotals()[ck][k],
  benchPct:(ck,k)=>(FB_BENCH[k]||{})[ck]||0,
};
const fbChartHourly = {
  id:'fbChartHostHourly', title:'Outlet hourly labor — visual', subtitle:'FOH & BOH hourly vs benchmark, by outlet',
  state:{ metric:'dollars', layout:'grouped', cats:{FOH:true,BOH:true}, bench:true, labels:true },
  cats:[{key:'FOH',ck:'foh',color:'#27406A'},{key:'BOH',ck:'boh',color:'#4F86C6'}],
  actual:(ck,k)=>FB_HOURLY[k][ck],
  benchPct:(ck,k)=>(FB_BENCH_HOURLY[k]||{})[ck]||0,
};
const fbChartTotal = {
  id:'fbChartHostTotal', title:'Outlet total labor — visual', subtitle:'all-in labor vs benchmark, by outlet',
  state:{ metric:'dollars', layout:'stacked', cats:{FOH:true,BOH:true,Sales:true,PTB:true,Bonus:true}, bench:true, labels:true },
  cats:[{key:'FOH',ck:'foh',color:'#1E365A'},{key:'BOH',ck:'boh',color:'#3D6398'},{key:'Sales',ck:'sales',color:'#5A82B5'},{key:'PTB',ck:'ptb',label:'PT&amp;B',color:'#8FB0D6'},{key:'Bonus',ck:'bonus',color:'#C2D8EF'}],
  actual:(ck,k)=>{ const ct=categoryTotals(); if(ck==='foh')return ct.foh[k]+FB_HOURLY[k].foh; if(ck==='boh')return ct.boh[k]+FB_HOURLY[k].boh; if(ck==='sales')return ct.sales[k]; if(ck==='ptb')return FB_PTB[k]; if(ck==='bonus')return FB_BONUS[k]; return 0; },
  benchPct:(ck,k)=>{ if(ck==='foh')return totFohBenchPct(k); if(ck==='boh')return totBohBenchPct(k); if(ck==='sales')return totSalesBenchPct(k); if(ck==='ptb')return totPtbBenchPct(k); if(ck==='bonus')return totBonusBenchPct(k); return 0; },
  totalBenchPct:(k)=>totTotalBenchPct(k),
};
function wireFbSum(){
  const root=document.getElementById('view-fbsum');
  root.querySelectorAll('.grouprow').forEach(r=> r.addEventListener('click', ()=>{ const c=r.dataset.cat; fbExpand[c]=!fbExpand[c]; renderFbSum(); }));
  root.querySelector('#fbExpandAll').addEventListener('click', ()=>{ Object.keys(fbExpand).forEach(k=>fbExpand[k]=true); renderFbSum(); });
  root.querySelector('#fbCollapseAll').addEventListener('click', ()=>{ Object.keys(fbExpand).forEach(k=>fbExpand[k]=false); renderFbSum(); });
  root.querySelector('#fbToggleNames').addEventListener('click', ()=>{ fbShowNames=!fbShowNames; applyFbNames(); });
  root.querySelector('#fbToggleSales').addEventListener('click', ()=>{ fbShowSales=!fbShowSales; renderFbSum(); });
  root.querySelector('#fbZoomIn').addEventListener('click', ()=>{ fbZoom=Math.min(1.6, Math.round((fbZoom+0.1)*10)/10); applyFbZoom(); });
  root.querySelector('#fbZoomOut').addEventListener('click', ()=>{ fbZoom=Math.max(0.5, Math.round((fbZoom-0.1)*10)/10); applyFbZoom(); });
  root.querySelector('#fbZoomReset').addEventListener('click', ()=>{ fbZoom=1; applyFbZoom(); });
}

/* ==================== F&B HOURLY + TOTAL LABOR ==================== */
// Actual hourly (non-salaried) labor $ per outlet — FOH & BOH from provided figures.
const FB_HOURLY = {
  lsd:  {foh: 382825, boh: 843646},  // FOH = sum of role detail (P&L total row rounds to 382,826)
  hs:   {foh: 230953, boh: 492828},
  kamp: {foh: 251159, boh: 123500},
  anth: {foh: 380714, boh: 214594},
};
const fbHourlyMap = key => ({lsd:FB_HOURLY.lsd[key], hs:FB_HOURLY.hs[key], kamp:FB_HOURLY.kamp[key], anth:FB_HOURLY.anth[key]});

// Job-level hourly detail by outlet (2026, $, from each outlet's P&L detail).
// Outlets present here get an expandable FOH/BOH breakdown; any outlet absent
// falls back to the FB_HOURLY category totals.
const FB_HOURLY_DETAIL = {
  lsd: {
    foh: {'Bartenders':107409, 'Support':14658, 'Baristas':47223, 'Host':77984, 'Servers':127153, 'Training':8398},
    boh: {'Line Cooks':481563, 'Prep Cooks':143651, 'Pastry Cooks':75053, 'Dishwashers':143379},
  },
  hs: {
    foh: {'Bartenders':82529, 'Support':1948, 'Baristas':0, 'Host':58686, 'Servers':77047, 'Training':10743},
    boh: {'Line Cooks':342603, 'Prep Cooks':65727, 'Pastry Cooks':34912, 'Dishwashers':49586},
  },
  kamp: {
    foh: {'Bartenders':61970, 'Support':6160, 'Baristas':0, 'Host':133742, 'Servers':35536, 'Training':13751},
    boh: {'Line Cooks':79964, 'Prep Cooks':0, 'Pastry Cooks':30335, 'Dishwashers':13201},
  },
  anth: {
    foh: {'Bartenders':49194, 'Support':0, 'Baristas':0, 'Host':829, 'Servers':330691, 'Training':0},
    boh: {'Line Cooks':115370, 'Prep Cooks':0, 'Pastry Cooks':39352, 'Dishwashers':59872},
  },
};
// Stable display order for roles; any extra role found in detail is appended.
const FB_HOURLY_ROLE_ORDER = {
  foh: ['Bartenders','Support','Baristas','Host','Servers','Training'],
  boh: ['Line Cooks','Prep Cooks','Pastry Cooks','Dishwashers'],
};
// Job-level hourly benchmarks (% of outlet revenue). Per category these sum to
// FB_BENCH_HOURLY (the FOH/BOH venue-type targets), so the collapsed category
// benchmark and the expanded per-role benchmarks reconcile. Each role's share
// tracks that outlet's staffing mix. Directional — tune to market.
const FB_BENCH_HOURLY_DETAIL = {
  lsd: {
    foh: {'Bartenders':2.0, 'Support':0.3, 'Baristas':0.9, 'Host':1.4, 'Servers':2.2, 'Training':0.2},
    boh: {'Line Cooks':6.9, 'Prep Cooks':2.0, 'Pastry Cooks':1.1, 'Dishwashers':2.0},
  },
  hs: {
    foh: {'Bartenders':2.1, 'Support':0.1, 'Baristas':0.0, 'Host':1.5, 'Servers':2.0, 'Training':0.3},
    boh: {'Line Cooks':7.6, 'Prep Cooks':1.5, 'Pastry Cooks':0.8, 'Dishwashers':1.1},
  },
  kamp: {
    foh: {'Bartenders':2.6, 'Support':0.3, 'Baristas':0.0, 'Host':5.5, 'Servers':1.5, 'Training':0.6},
    boh: {'Line Cooks':3.9, 'Prep Cooks':0.0, 'Pastry Cooks':1.5, 'Dishwashers':0.6},
  },
  anth: {
    foh: {'Bartenders':1.0, 'Support':0.0, 'Baristas':0.0, 'Host':0.0, 'Servers':7.0, 'Training':0.0},
    boh: {'Line Cooks':3.2, 'Prep Cooks':0.0, 'Pastry Cooks':1.1, 'Dishwashers':1.7},
  },
};
const fbHourlyExpand = {foh:false, boh:false};
const fbTotalExpand  = {foh:false, boh:false};
// Any outlet supplies job-level detail for this category?
function fbHourlyHasDetail(catKey){ return Object.keys(FB_HOURLY_DETAIL).some(k=>FB_HOURLY_DETAIL[k] && FB_HOURLY_DETAIL[k][catKey]); }
// Union of role names across outlets with detail, in display order.
function fbHourlyRoles(catKey){
  const seen=new Set();
  Object.keys(FB_HOURLY_DETAIL).forEach(k=>{ const d=FB_HOURLY_DETAIL[k] && FB_HOURLY_DETAIL[k][catKey]; if(d) Object.keys(d).forEach(r=>seen.add(r)); });
  const ordered=(FB_HOURLY_ROLE_ORDER[catKey]||[]).filter(r=>seen.has(r));
  seen.forEach(r=>{ if(!ordered.includes(r)) ordered.push(r); });
  return ordered;
}
// One role's $ across outlets (0 where an outlet has no detail yet).
function fbHourlyRoleDollars(catKey, role){
  const cell={lsd:0,hs:0,kamp:0,anth:0};
  FB_KEYS.forEach(k=>{ const d=FB_HOURLY_DETAIL[k] && FB_HOURLY_DETAIL[k][catKey]; if(d && d[role]!=null) cell[k]=d[role]; });
  return cell;
}
// One role's benchmark % across outlets.
function fbHourlyRoleBenchPct(catKey, role){
  const out={lsd:0,hs:0,kamp:0,anth:0};
  FB_KEYS.forEach(k=>{ const d=FB_BENCH_HOURLY_DETAIL[k] && FB_BENCH_HOURLY_DETAIL[k][catKey]; if(d && d[role]!=null) out[k]=d[role]; });
  return out;
}

// Payroll tax & benefits and Bonus by outlet (from provided figures).
const FB_PTB   = {lsd:498686, hs:268070, kamp:155000, anth:228445};
const FB_BONUS = {lsd:38481,  hs:20952,  kamp:12459,  anth:129416};

// Hourly labor benchmarks (% of revenue) by venue type — directional, tune to market.
const FB_BENCH_HOURLY = {
  lsd:  {foh:7.0, boh:12.0},  // full-service restaurant
  hs:   {foh:6.0, boh:11.0},  // Hiroki-San — Japanese izakaya: smaller kitchen, faster tickets, high bev mix
  kamp: {foh:10.5, boh:6.0}, // Kampers — rooftop bar: elevators, hosts, security, event/weather complexity
  anth: {foh:8.0, boh:6.0},   // event venue
};
// Bonus benchmark (% of revenue) and PT&B load rate (share of benchmark wages) — directional.
const FB_BENCH_BONUS = {lsd:0.5, hs:0.5, kamp:0.5, anth:2.5};
const FB_BENCH_PTB   = {hs:7.0, kamp:6.0}; // per-outlet PT&B override (% of revenue); outlets not listed use the load rate
const FB_PTB_LOAD = 0.24; // PT&B (payroll tax & benefits) benchmarked at 24% of benchmark wages
// Total-view component benchmarks (% of revenue). Total = sum of parts, so it reconciles.
const totFohBenchPct   = k => (FB_BENCH[k].foh||0)+(FB_BENCH_HOURLY[k].foh||0);
const totBohBenchPct   = k => (FB_BENCH[k].boh||0)+(FB_BENCH_HOURLY[k].boh||0);
const totSalesBenchPct = k => FB_BENCH[k].sales||0;
const totWagesBenchPct = k => totFohBenchPct(k)+totBohBenchPct(k)+totSalesBenchPct(k);
const totPtbBenchPct   = k => (FB_BENCH_PTB[k]!=null) ? FB_BENCH_PTB[k] : FB_PTB_LOAD*totWagesBenchPct(k);
const totBonusBenchPct = k => FB_BENCH_BONUS[k]||0;
const totTotalBenchPct = k => totWagesBenchPct(k)+totPtbBenchPct(k)+totBonusBenchPct(k);

function fbBenchBlockHourly(){
  const colspan=1+FB_COLS.length*2;
  const foh=fbHourlyMap('foh'), boh=fbHourlyMap('boh'), comb={}; FB_KEYS.forEach(k=>comb[k]=foh[k]+boh[k]);
  const bF={},bB={},bC={}; FB_KEYS.forEach(k=>{ bF[k]=FB_BENCH_HOURLY[k].foh; bB[k]=FB_BENCH_HOURLY[k].boh; bC[k]=FB_BENCH_HOURLY[k].foh+FB_BENCH_HOURLY[k].boh; });
  // When a category is expanded, show each role's benchmark/variance (rolls up
  // to the category target), then the category total; otherwise just the total.
  const catBench = (catKey, label, actMap, benchMap) => {
    let h='';
    if(fbHourlyExpand[catKey] && fbHourlyHasDetail(catKey)){
      fbHourlyRoles(catKey).forEach(role=>{
        h += fbBenchPairG({label:role, chip:null, act:fbHourlyRoleDollars(catKey,role), bench:fbHourlyRoleBenchPct(catKey,role)});
      });
    }
    return h + fbBenchPairG({label, chip:catKey, act:actMap, bench:benchMap});
  };
  return `<tr class="benchsection"><td class="lab" colspan="${colspan}"><div class="notecap">Industry benchmarks &middot; hourly labor by venue type<span class="bnote">FOH &amp; BOH hourly targets as a share of each outlet's revenue &middot; expand a category for role-level targets &middot; approximate, tune to market</span></div></td></tr>`
    + catBench('foh','FOH', foh, bF)
    + catBench('boh','BOH', boh, bB)
    + fbBenchPairG({label:'FOH + BOH', chip:'foh', extra:'combbench', act:comb, bench:bC});
}
function fbBenchBlockTotal(){
  const colspan=1+FB_COLS.length*2;
  const ct=categoryTotals(), fohH=fbHourlyMap('foh'), bohH=fbHourlyMap('boh');
  const fohA={},bohA={},salesA={},ptbA={},bonusA={},grand={},bF={},bB={},bS={},bP={},bN={},bT={};
  FB_KEYS.forEach(k=>{
    fohA[k]=ct.foh[k]+fohH[k]; bohA[k]=ct.boh[k]+bohH[k]; salesA[k]=ct.sales[k]; ptbA[k]=FB_PTB[k]; bonusA[k]=FB_BONUS[k];
    grand[k]=fohA[k]+bohA[k]+salesA[k]+ptbA[k]+bonusA[k];
    bF[k]=totFohBenchPct(k); bB[k]=totBohBenchPct(k); bS[k]=totSalesBenchPct(k); bP[k]=totPtbBenchPct(k); bN[k]=totBonusBenchPct(k); bT[k]=totTotalBenchPct(k);
  });
  // When a category is expanded, break its benchmark into salaried-management
  // (category-level) + per-hourly-role targets, which sum to the category total.
  const catBenchTotal = (catKey, label, actMap, benchMap) => {
    let h='';
    if(fbTotalExpand[catKey]){
      const salAct={},salBench={}; FB_KEYS.forEach(k=>{ salAct[k]=ct[catKey][k]; salBench[k]=FB_BENCH[k][catKey]||0; });
      h += fbBenchPairG({label:'Salaried mgmt', chip:catKey, act:salAct, bench:salBench});
      fbHourlyRoles(catKey).forEach(role=>{
        h += fbBenchPairG({label:role, chip:null, act:fbHourlyRoleDollars(catKey,role), bench:fbHourlyRoleBenchPct(catKey,role)});
      });
    }
    return h + fbBenchPairG({label, chip:catKey, act:actMap, bench:benchMap});
  };
  return `<tr class="benchsection"><td class="lab" colspan="${colspan}"><div class="notecap">Industry benchmarks &middot; total labor by venue type<span class="bnote">each cost line targeted as a share of revenue; Total = sum of the parts &middot; expand FOH / BOH for role-level targets &middot; approximate, tune to market</span></div></td></tr>`
    + catBenchTotal('foh','FOH', fohA, bF)
    + catBenchTotal('boh','BOH', bohA, bB)
    + fbBenchPairG({label:'Sales', chip:'sales', act:salesA, bench:bS})
    + `<tr class="benchsubnote"><td class="lab" colspan="${colspan}"><div class="notecap"><b>PT&amp;B</b> is benchmarked as ~24% of target wages (payroll-tax &amp; benefits load); <b>Bonus</b> as a share of revenue. The <b>Total labor</b> variance therefore equals the sum of the five component variances above and below.</div></td></tr>`
    + fbBenchPairG({label:'PT&amp;B', chip:null, act:ptbA, bench:bP})
    + fbBenchPairG({label:'Bonus', chip:null, act:bonusA, bench:bN})
    + fbBenchPairG({label:'Total labor', chip:null, extra:'combbench', act:grand, bench:bT});
}

function fbHeadHtml(firstLabel){
  const ho=FB_COLS.map(c=>`<th class="outcol ${c.cls||''}" colspan="2">${c.label}</th>`).join('');
  const hu=FB_COLS.map(c=>`<th class="d ${c.cls||''}">$</th><th class="p ${c.cls||''}">% rev</th>`).join('');
  return `<thead><tr class="outlets"><th class="lab" rowspan="2">${firstLabel||'Category'}</th>${ho}</tr><tr class="units">${hu}</tr></thead>`;
}
function fbMapCells(map){ const cell={lsd:map.lsd||0,hs:map.hs||0,kamp:map.kamp||0,anth:map.anth||0}; cell.fb=cell.lsd+cell.hs+cell.kamp+cell.anth; return fbCells(cell); }
function fbRevRow(){ return `<tr class="revrow"><td class="lab">Assumed revenue<span class="bnote">basis for % of revenue</span></td>`+FB_COLS.map(c=>{ const x=c.cls?' '+c.cls:''; return `<td class="d${x}">${usd(revOf(c.k))}</td><td class="p${x}">—</td>`; }).join('')+`</tr>`; }
const FB_KEYS=['lsd','hs','kamp','anth'];

// One collapsible category (FOH/BOH) group row + its job-role rows when expanded.
function fbHourlyGroupBlock(catKey, label){
  const map=fbHourlyMap(catKey);              // official category totals (all outlets)
  const hasDetail=fbHourlyHasDetail(catKey);
  const exp=fbHourlyExpand[catKey] && hasDetail;
  const chev=`<span class="chev${hasDetail?'':' hidden'}">&#9656;</span>`;
  let h=`<tr class="grouprow ${exp?'open':''}" data-cat="${catKey}">`
      + `<td class="lab">${chev}<span class="catchip ${catKey}">${catKey.toUpperCase()}</span><span class="glab">${label} — hourly</span></td>`
      + fbMapCells(map) + `</tr>`;
  if(exp){
    fbHourlyRoles(catKey).forEach(role=>{
      h+=`<tr class="personrow"><td class="lab"><span class="pos">${role}</span></td>`+fbMapCells(fbHourlyRoleDollars(catKey,role))+`</tr>`;
    });
  }
  return h;
}
function renderFbHourly(){
  const el=document.getElementById('view-fbhourly');
  const foh=fbHourlyMap('foh'), boh=fbHourlyMap('boh'), tot={}; FB_KEYS.forEach(k=>tot[k]=foh[k]+boh[k]);
  let body=fbRevRow();
  body+=fbHourlyGroupBlock('foh','front of house');
  body+=fbHourlyGroupBlock('boh','back of house');
  body+=`<tr class="grand"><td class="lab">Total F&amp;B hourly<span class="bnote">FOH + BOH hourly</span></td>`+fbMapCells(tot)+`</tr>`;
  body+=fbBenchBlockHourly();
  el.innerHTML=`
    <div class="breadcrumb">Intel <span>&rsaquo;</span> Reports <span>&rsaquo;</span> F&amp;B Labor <span>&rsaquo;</span> <b>F&amp;B Hourly</b></div>
    <h1 class="pagetitle serif">Book Tower — F&amp;B Hourly<span class="sub">Hourly (non-salaried) labor by outlet &middot; expand FOH / BOH for job-level detail</span></h1>
    <div class="ph-banner"><b>FOH &amp; BOH hourly are actuals</b>, now with job-level detail for all four outlets. Click a category row (or use Expand all) to see the role split; collapse back to FOH / BOH totals.</div>
    <div class="fbsum-toolbar">
      <div class="expandctl">
        <button class="btn" id="fbhExpandAll">Expand all</button>
        <button class="btn" id="fbhCollapseAll">Collapse all</button>
      </div>
    </div>
    <div class="fbsum-scroll"><table class="fbsum">${fbHeadHtml('Category / role')}<tbody>${body}</tbody></table></div>
    <div id="fbChartHostHourly"></div>
    <div class="foot"><b>Hourly labor</b> covers non-salaried staff — bartenders, baristas, hosts, servers, support (FOH) and line cooks, prep cooks, pastry cooks, dishwashers (BOH). Expand a category for the job-level split; collapse to FOH / BOH totals. <b>Benchmarks</b> expand in step: per-role targets sum to each outlet's FOH / BOH venue-type benchmark, with each role's share tracking that outlet's staffing mix. Directional — tune to market.</div>`;
  wireFbHourly();
  buildChart(fbChartHourly);
}
function wireFbHourly(){
  const root=document.getElementById('view-fbhourly');
  root.querySelectorAll('.grouprow').forEach(r=> r.addEventListener('click', ()=>{ const c=r.dataset.cat; if(fbHourlyHasDetail(c)){ fbHourlyExpand[c]=!fbHourlyExpand[c]; renderFbHourly(); } }));
  root.querySelector('#fbhExpandAll').addEventListener('click', ()=>{ Object.keys(fbHourlyExpand).forEach(k=>fbHourlyExpand[k]=true); renderFbHourly(); });
  root.querySelector('#fbhCollapseAll').addEventListener('click', ()=>{ Object.keys(fbHourlyExpand).forEach(k=>fbHourlyExpand[k]=false); renderFbHourly(); });
}

// Total-labor FOH/BOH group row → "Salaried management" + hourly job roles when expanded.
function fbTotalGroupBlock(catKey, label, totalMap, ct){
  const exp=fbTotalExpand[catKey];
  let h=`<tr class="grouprow ${exp?'open':''}" data-cat="${catKey}">`
      + `<td class="lab"><span class="chev">&#9656;</span><span class="catchip ${catKey}">${catKey.toUpperCase()}</span><span class="glab">${label} — salaried + hourly</span></td>`
      + fbMapCells(totalMap)+`</tr>`;
  if(exp){
    const sal={}; FB_KEYS.forEach(k=>sal[k]=ct[catKey][k]);
    h+=`<tr class="personrow"><td class="lab"><span class="pos">Salaried management</span><span class="pn">from F&amp;B Management</span></td>`+fbMapCells(sal)+`</tr>`;
    fbHourlyRoles(catKey).forEach(role=>{
      h+=`<tr class="personrow"><td class="lab"><span class="pos">${role}</span><span class="pn">hourly</span></td>`+fbMapCells(fbHourlyRoleDollars(catKey,role))+`</tr>`;
    });
  }
  return h;
}
function renderFbTotal(){
  const el=document.getElementById('view-fbtotal');
  const ct=categoryTotals(), fohH=fbHourlyMap('foh'), bohH=fbHourlyMap('boh');
  const fohT={},bohT={},salesT={},mgmtT={},hourlyT={},ptbT={},bonusT={},grand={};
  FB_KEYS.forEach(k=>{ fohT[k]=ct.foh[k]+fohH[k]; bohT[k]=ct.boh[k]+bohH[k]; salesT[k]=ct.sales[k]; mgmtT[k]=ct.foh[k]+ct.boh[k]+ct.sales[k]; hourlyT[k]=fohH[k]+bohH[k]; ptbT[k]=FB_PTB[k]; bonusT[k]=FB_BONUS[k]; grand[k]=mgmtT[k]+hourlyT[k]+ptbT[k]+bonusT[k]; });
  const colspan=1+FB_COLS.length*2;
  let body=fbRevRow();
  body+=fbTotalGroupBlock('foh','FOH', fohT, ct);
  body+=fbTotalGroupBlock('boh','BOH', bohT, ct);
  body+=`<tr class="catrow"><td class="lab"><span class="catchip sales">Sales</span><span class="glab">salaried</span></td>`+fbMapCells(salesT)+`</tr>`;
  body+=`<tr class="catrow"><td class="lab">PT&amp;B<span class="glab">payroll tax &amp; benefits</span></td>`+fbMapCells(ptbT)+`</tr>`;
  body+=`<tr class="catrow"><td class="lab">Bonus</td>`+fbMapCells(bonusT)+`</tr>`;
  body+=`<tr class="grand"><td class="lab">Total F&amp;B labor<span class="bnote">all-in &middot; excl. shared overhead</span></td>`+fbMapCells(grand)+`</tr>`;
  body+=fbBenchBlockTotal();
  body+=`<tr class="benchsection"><td class="lab" colspan="${colspan}"><div class="notecap">Composition — by cost type</div></td></tr>`;
  body+=`<tr class="memorow"><td class="lab">Salaried management<span class="bnote">FOH + BOH + Sales</span></td>`+fbMapCells(mgmtT)+`</tr>`;
  body+=`<tr class="memorow"><td class="lab">Hourly wages<span class="bnote">FOH + BOH</span></td>`+fbMapCells(hourlyT)+`</tr>`;
  body+=`<tr class="memorow"><td class="lab">PT&amp;B<span class="bnote">payroll tax &amp; benefits</span></td>`+fbMapCells(ptbT)+`</tr>`;
  body+=`<tr class="memorow"><td class="lab">Bonus</td>`+fbMapCells(bonusT)+`</tr>`;
  el.innerHTML=`
    <div class="breadcrumb">Intel <span>&rsaquo;</span> Reports <span>&rsaquo;</span> F&amp;B Labor <span>&rsaquo;</span> <b>F&amp;B Total Labor</b></div>
    <h1 class="pagetitle serif">Book Tower — F&amp;B Total Labor<span class="sub">Salaried management + hourly + PT&amp;B + Bonus, by outlet &middot; expand FOH / BOH for the role split</span></h1>
    <div class="fbsum-toolbar">
      <div class="expandctl">
        <button class="btn" id="fbtExpandAll">Expand all</button>
        <button class="btn" id="fbtCollapseAll">Collapse all</button>
      </div>
    </div>
    <div class="fbsum-scroll"><table class="fbsum">${fbHeadHtml('Category / role')}<tbody>${body}</tbody></table></div>
    <div id="fbChartHostTotal"></div>
    <div class="foot"><b>Total labor</b> = salaried management (FOH + BOH + Sales, from F&amp;B Management) + hourly wages (FOH + BOH, from F&amp;B Hourly) + PT&amp;B + Bonus. Expand FOH / BOH to split each into its salaried-management total and hourly job roles; the benchmark expands in step. The composition rows restate the same total by cost type.</div>`;
  wireFbTotal();
  buildChart(fbChartTotal);
}
function wireFbTotal(){
  const root=document.getElementById('view-fbtotal');
  root.querySelectorAll('.grouprow').forEach(r=> r.addEventListener('click', ()=>{ const c=r.dataset.cat; fbTotalExpand[c]=!fbTotalExpand[c]; renderFbTotal(); }));
  root.querySelector('#fbtExpandAll').addEventListener('click', ()=>{ Object.keys(fbTotalExpand).forEach(k=>fbTotalExpand[k]=true); renderFbTotal(); });
  root.querySelector('#fbtCollapseAll').addEventListener('click', ()=>{ Object.keys(fbTotalExpand).forEach(k=>fbTotalExpand[k]=false); renderFbTotal(); });
}

/* ============================ ROUTING ============================ */
const VIEWS = {
  overview:{el:'view-overview', render:renderOverview, scope:'all'},
  org:{el:'view-org', render:renderOrg, scope:'all'},
  alloc:{el:'view-alloc', render:renderAlloc, scope:'all'},
  fbsum:{el:'view-fbsum', render:renderFbSum, scope:'all'},
  fbhourly:{el:'view-fbhourly', render:renderFbHourly, scope:'all'},
  fbtotal:{el:'view-fbtotal', render:renderFbTotal, scope:'all'},
  outlets:{el:'view-outlets', render:renderOutlets, scope:'fb'},
  'div-fb':{el:'view-division', render:()=>renderDivision('fb'), scope:'fb'},
  'div-sales':{el:'view-division', render:()=>renderDivision('sales'), scope:'sales'},
  'div-roost':{el:'view-division', render:()=>renderDivision('roost'), scope:'roost'},
  'div-shared':{el:'view-division', render:()=>renderDivision('shared'), scope:'shared'},
  'div-leadership':{el:'view-division', render:()=>renderDivision('leadership'), scope:'leadership'},
};

function show(view){
  const cfg = VIEWS[view]; if(!cfg) return;
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('show'));
  cfg.render();
  document.getElementById(cfg.el).classList.add('show');
  document.querySelectorAll('.navitem').forEach(n=>n.classList.toggle('active', n.dataset.view===view));
  // sync scope dropdown
  const sc=document.getElementById('scope');
  if(view.startsWith('div-')) sc.value=view;
  else if(view==='outlets') sc.value='outlets';
  else sc.value=view;
}

// build scope dropdown
(function(){
  const sc=document.getElementById('scope');
  const opts=[
    {v:'overview',t:'All divisions — Overview'},
    {v:'org',t:'All divisions — Org & cost map'},
    {v:'alloc',t:'All divisions — Allocation drivers'},
    {v:'fbsum',t:'All divisions — F&B management'},
    {v:'fbhourly',t:'All divisions — F&B hourly'},
    {v:'fbtotal',t:'All divisions — F&B total labor'},
    {v:'div-fb',t:'Food & Beverage'},
    {v:'outlets',t:'  ↳ F&B outlet efficiency'},
    {v:'div-sales',t:'Sales'},
    {v:'div-roost',t:'ROOST'},
    {v:'div-shared',t:'Shared Services'},
    {v:'div-leadership',t:'Executive Leadership'},
  ];
  sc.innerHTML=opts.map(o=>`<option value="${o.v}">${o.t}</option>`).join('');
  sc.addEventListener('change',()=>show(sc.value));
})();

document.querySelectorAll('.navitem').forEach(n=>{
  n.addEventListener('click',()=>show(n.dataset.view));
});

show('overview');
initAllocStorage();
