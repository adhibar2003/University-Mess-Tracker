const $ = (id) => document.getElementById(id);

const MS = [
  {id:'A',name:'Hostel A Mess',hostel:'Boys Hostel A',color:'#534AB7',bg:'#EEEDFE',cap:120,rates:{breakfast:40,lunch:70,dinner:65}},
  {id:'B',name:'Hostel B Mess',hostel:'Boys Hostel B',color:'#1D9E75',bg:'#E1F5EE',cap:90,rates:{breakfast:35,lunch:65,dinner:60}},
  {id:'C',name:'Girls Hostel Mess',hostel:'Girls Hostel C',color:'#D4537E',bg:'#FBEAF0',cap:80,rates:{breakfast:38,lunch:68,dinner:62}},
  {id:'D',name:'PG Block Mess',hostel:'PG Block D',color:'#BA7517',bg:'#FAEEDA',cap:60,rates:{breakfast:45,lunch:75,dinner:70}},
];

const US = {
  a1:{id:'a1',name:'Ravi Kumar',role:'admin',mess:'A',pass:'admin123'},
  a2:{id:'a2',name:'Sunita Devi',role:'admin',mess:'B',pass:'admin123'},
  a3:{id:'a3',name:'Priya Sharma',role:'admin',mess:'C',pass:'admin123'},
  a4:{id:'a4',name:'Mohan Das',role:'admin',mess:'D',pass:'admin123'},
  s1:{id:'s1',name:'Aarav Singh',role:'student',mess:'A',pass:'pass123',room:'A-204'},
  s2:{id:'s2',name:'Deepak Yadav',role:'student',mess:'A',pass:'pass123',room:'A-310'},
  s3:{id:'s3',name:'Kiran Patel',role:'student',mess:'B',pass:'pass123',room:'B-112'},
  s4:{id:'s4',name:'Sneha Gupta',role:'student',mess:'C',pass:'pass123',room:'C-205'},
  g1:{id:'g1',name:'Rahul Verma',role:'guest',pass:'guest123'},
  g2:{id:'g2',name:'Meera Joshi',role:'guest',pass:'guest123'},
};

const DT = {};
MS.forEach(m => {
  DT[m.id] = {
    menu:{b:'Poha, Chai, Banana',l:'Dal Tadka, Rice, Roti, Achar',d:'Paneer Curry, Rice, Roti, Salad'},
    timing:{l:'12:30',d:'20:00'},
    notices:[{t:'Welcome to '+m.name+'! Menu updated for the week.',ts:'Today, 9:00 AM'}],
    counts:{tot:m.cap,eat:Math.round(m.cap*.72),no:Math.round(m.cap*.15),abs:Math.round(m.cap*.13)},
    votes:{},
    greqs:[]
  };
});

let rctr = 1000;

const S = {
  sc:'land',
  user:null,
  mess:null,
  tab:0,
  lr:'student',
  sm:null,
  li:'',
  le:'',
  modal:null,
  rv:null,
  rm:null
};

const gm = () => S.mess ? MS.find(m => m.id === S.mess) : null;
const gd = () => S.mess ? DT[S.mess] : null;
const fmt = t => {
  if(!t) return '--';
  const [h,mn] = t.split(':');
  const hr = +h;
  return `${hr > 12 ? hr - 12 : hr}:${mn} ${hr >= 12 ? 'PM' : 'AM'}`;
};
const pct = (n,t) => t ? Math.round((n/t)*100) : 0;
const ini = n => n.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
const gid = () => 'R'+(++rctr);
const now2 = () => new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});

function render(){
  const m = gm();

  if ($('ld')) $('ld').style.background = m ? m.color : '#534AB7';
  if ($('ml')) $('ml').innerHTML = S.modal ? rModal() : '';

  if(S.sc === 'land'){ clr(); $('mc').innerHTML = rLand(); return; }
  if(S.sc === 'login'){ clr(); $('mc').innerHTML = rLogin(); return; }
  if(S.sc === 'glogin'){ clr(); $('mc').innerHTML = rGLogin(); return; }
  if(S.sc === 'receipt'){
    clr();
    $('tr').innerHTML = `<button class="btn" style="padding:4px 10px;font-size:12px" onclick="logout()">Sign out</button>`;
    $('mc').innerHTML = rReceipt();
    return;
  }

  if(S.user){
    const u = US[S.user];
    $('tr').innerHTML = `<div style="display:flex;align-items:center;gap:8px">`
      +(m ? `<div class="mi" style="margin:0;padding:3px 9px;background:${m.bg}">
              <div class="mi-d" style="background:${m.color}"></div>
              <span style="color:${m.color};font-weight:600;font-size:11px">${m.name}</span>
            </div>`
         : `<div class="mi" style="margin:0;padding:3px 9px"><span style="font-size:11px">🧳 Guest</span></div>`)
      +`<div class="av" style="background:${m?m.bg:'#EEEDFE'};color:${m?m.color:'#534AB7'}">${ini(u.name)}</div>`
      +`<button class="btn" style="padding:4px 10px;font-size:12px" onclick="logout()">Sign out</button></div>`;

    const tabs = u.role==='admin'
      ? ['Overview','Menu','Timings','Notices','Guest Requests']
      : u.role==='guest'
      ? ['Request Meal','My Requests']
      : ['Dashboard','My Status','Notices'];

    $('nb').innerHTML = '<div class="nav-wrap">'+tabs.map((t,i)=>`<button class="nb${S.tab===i?' on':''}" onclick="st(${i})">${t}</button>`).join('')+'</div>';
    $('mc').innerHTML = u.role==='admin' ? rAdmin() : u.role==='guest' ? rGuest() : rStudent();

    if (u.role === 'guest' && S.tab === 0) {
      setTimeout(updR, 0);
    }
  }
}

function clr(){
  if ($('tr')) $('tr').innerHTML = '';
  if ($('nb')) $('nb').innerHTML = '';
}

/* ---------------- LANDING ---------------- */
function rLand(){
  return `<div style="text-align:center;padding:20px 0 14px">
    <div style="font-size:30px;margin-bottom:6px">🍛</div>
    <h2 style="font-size:20px;font-weight:700;margin-bottom:4px;color:#1a1a1a">MessTrack</h2>
    <p style="font-size:13px;color:#888;margin-bottom:20px">Select your hostel mess to continue</p>
  </div>
  <p style="font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#999;margin-bottom:10px">Hostel Messes</p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
    ${MS.map(m=>`<div class="mc" onclick="selMess('${m.id}')">
      <div class="mc-ic" style="background:${m.bg}">🍽️</div>
      <div class="mc-nm">${m.name}</div>
      <div class="mc-sb">${m.hostel}</div>
      <div class="mc-bx" style="background:${m.bg};color:${m.color}">
        ${m.cap} seats · Breakfast ₹${m.rates.breakfast} / Lunch ₹${m.rates.lunch}
      </div>
    </div>`).join('')}
  </div>
  <div class="card" style="border:1.5px dashed rgba(0,0,0,.12);background:#fafafa">
    <div style="display:flex;align-items:center;gap:12px">
      <div style="width:42px;height:42px;border-radius:12px;background:#EEEDFE;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">🧳</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;margin-bottom:2px;color:#1a1a1a">Out-of-Campus / Guest?</div>
        <div style="font-size:11px;color:#888">Request a paid meal from any hostel mess</div>
      </div>
      <button class="btn bp" style="font-size:12px;padding:7px 13px;flex-shrink:0" onclick="S.sc='glogin';render()">Guest Login</button>
    </div>
  </div>
  <p style="font-size:11px;color:#bbb;text-align:center;margin-top:10px">Each mess is isolated — login with your hostel credentials</p>`;
}

/* ---------------- LOGIN ---------------- */
function rLogin(){
  const m = MS.find(x=>x.id===S.sm);
  const ia = S.lr==='admin';
  const dmap = {admin:{A:'a1',B:'a2',C:'a3',D:'a4'},student:{A:'s1',B:'s2',C:'s3',D:'s4'}};
  const du = US[dmap[S.lr][m.id]];

  return `<div style="max-width:360px;margin:0 auto">
    <button class="btn" style="margin-bottom:14px;font-size:12px" onclick="S.sc='land';render()">← Back to messes</button>
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:0.5px solid rgba(0,0,0,.08)">
        <div style="width:44px;height:44px;border-radius:12px;background:${m.bg};display:flex;align-items:center;justify-content:center;font-size:20px">🍽️</div>
        <div>
          <div style="font-size:14px;font-weight:600;color:#1a1a1a">${m.name}</div>
          <div style="font-size:11px;color:#888">${m.hostel}</div>
        </div>
      </div>
      <div style="display:flex;gap:7px;margin-bottom:16px">
        <button class="btn${!ia?' bp':''}" style="flex:1;justify-content:center;font-size:12px" onclick="S.lr='student';S.le='';render()">Student</button>
        <button class="btn${ia?' bp':''}" style="flex:1;justify-content:center;font-size:12px" onclick="S.lr='admin';S.le='';render()">Mess Manager</button>
      </div>
      ${S.le?`<div class="err">${S.le}</div>`:''}
      ${du?`<div class="suc" style="font-size:11px">Demo — ID: <b>${du.id}</b> · Pass: <b>${ia?'admin123':'pass123'}</b></div>`:''}
      <div class="ig"><label class="il">${ia?'Manager':'Student'} ID</label><input type="text" id="lid" placeholder="${ia?'e.g. a1':'e.g. s1'}" value="${S.li}"></div>
      <div class="ig"><label class="il">Password</label><input type="password" id="lpw" placeholder="Enter password" onkeydown="if(event.key==='Enter')dLogin()"></div>
      <button class="btn bp bw" onclick="dLogin()">Sign in to ${m.name}</button>
    </div>
  </div>`;
}

function rGLogin(){
  return `<div style="max-width:360px;margin:0 auto">
    <button class="btn" style="margin-bottom:14px;font-size:12px" onclick="S.sc='land';render()">← Back</button>
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:0.5px solid rgba(0,0,0,.08)">
        <div style="width:44px;height:44px;border-radius:12px;background:#EEEDFE;display:flex;align-items:center;justify-content:center;font-size:20px">🧳</div>
        <div>
          <div style="font-size:14px;font-weight:600;color:#1a1a1a">Guest / Out-of-Campus Login</div>
          <div style="font-size:11px;color:#888">Request and pay for meals at any mess</div>
        </div>
      </div>
      ${S.le?`<div class="err">${S.le}</div>`:''}
      <div class="suc" style="font-size:11px">Demo — ID: <b>g1</b> · Pass: <b>guest123</b> · Also try <b>g2</b></div>
      <div class="ig"><label class="il">Guest ID</label><input type="text" id="lid" placeholder="e.g. g1" value="${S.li}"></div>
      <div class="ig"><label class="il">Password</label><input type="password" id="lpw" placeholder="Enter password" onkeydown="if(event.key==='Enter')dGLogin()"></div>
      <button class="btn bp bw" onclick="dGLogin()">Continue as Guest</button>
    </div>
  </div>`;
}

/* ---------------- KEEP ALL YOUR OTHER UI FUNCTIONS ---------------- */
/* Paste ALL remaining functions exactly from your original code:
   rGuest, rGReq, rGMyReqs, rAdmin, rAOv, rAMenu, rATime, rANot, rAGReqs,
   rStudent, rSDash, rSStat, rSNot, rModal, rPayMdl, rRejMdl, rReceipt
*/

function rGuest(){return S.tab===0?rGReq():rGMyReqs()}
function rGReq(){ /* paste from your code */ return `<div class="card">Guest Request UI</div>`; }
function rGMyReqs(){ /* paste from your code */ return `<div class="card">My Requests UI</div>`; }
function rAdmin(){ return S.tab===0?rAOv():S.tab===1?rAMenu():S.tab===2?rATime():S.tab===3?rANot():rAGReqs(); }
function rAOv(){ return `<div class="card">Admin Overview</div>`; }
function rAMenu(){ return `<div class="card">Admin Menu</div>`; }
function rATime(){ return `<div class="card">Admin Timing</div>`; }
function rANot(){ return `<div class="card">Admin Notices</div>`; }
function rAGReqs(){ return `<div class="card">Guest Requests</div>`; }
function rStudent(){ return S.tab===0?rSDash():S.tab===1?rSStat():rSNot(); }
function rSDash(){ return `<div class="card">Student Dashboard</div>`; }
function rSStat(){ return `<div class="card">Student Status</div>`; }
function rSNot(){ return `<div class="card">Student Notices</div>`; }
function rModal(){ return ''; }
function rReceipt(){ return `<div class="card">Receipt</div>`; }

/* ---------------- ACTIONS ---------------- */
function selMess(id){ S.sm=id; S.le=''; S.li=''; S.sc='login'; render(); }
function st(i){ S.tab=i; render(); }
function logout(){ S.user=null; S.mess=null; S.sc='land'; S.tab=0; render(); }
function backRec(){ S.sc='app'; S.tab=S.user&&US[S.user].role==='guest'?1:0; render(); }

function updR(){
  const el = $('grate');
  const messSelect = $('gms');
  const mealSelect = $('gml');

  if(!el || !messSelect || !mealSelect) return;

  const mid = messSelect.value;
  const ml = mealSelect.value;
  const m = MS.find(x => x.id === mid);

  if(m && m.rates[ml]){
    el.innerHTML = `Estimated charge for <b>${ml}</b> at ${m.name}: <span style="font-size:16px;font-weight:700;color:#534AB7">₹${m.rates[ml]}</span>`;
  }
}

function dLogin(){
  const id = $('lid')?.value.trim();
  const pw = $('lpw')?.value.trim();
  const u = US[id];

  if(!u){ S.le='User ID not found.'; render(); return; }
  if(u.pass!==pw){ S.le='Incorrect password.'; render(); return; }
  if(u.mess!==S.sm){ S.le='This account belongs to '+MS.find(m=>m.id===u.mess).name+'. Please log in from that mess.'; render(); return; }
  if(u.role!==S.lr){ S.le='This ID is for a '+u.role+', not '+S.lr+'.'; render(); return; }

  S.user=id; S.mess=u.mess; S.tab=0; S.sc='app'; S.le=''; render();
}

function dGLogin(){
  const id = $('lid')?.value.trim();
  const pw = $('lpw')?.value.trim();
  const u = US[id];

  if(!u || u.role!=='guest'){ S.le='Guest ID not found.'; render(); return; }
  if(u.pass!==pw){ S.le='Incorrect password.'; render(); return; }

  S.user=id; S.mess=null; S.tab=0; S.sc='app'; S.le=''; render();
}

document.addEventListener('DOMContentLoaded', render);