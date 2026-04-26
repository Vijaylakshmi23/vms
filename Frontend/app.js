/* ═══════════════════════════════════════════════════════════════
   VAULTPASS · VISITOR MANAGEMENT SYSTEM
   app.js — Full Frontend Logic
════════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   STATE
───────────────────────────────────────── */
const S = {
  user: null,
  visitors: [],
  requests: [],
  logs: [],
  loginRole: 'ADMIN',
  regRole: 'VISITOR',
};

const API = 'http://localhost:8080/api';

/* ─────────────────────────────────────────
   UTILITIES
───────────────────────────────────────── */
function toast(msg, type = 'info') {
  const el  = document.getElementById('toast');
  const ico = document.getElementById('toastIcon');
  const txt = document.getElementById('toastMsg');
  const icons = { success: '✓', error: '✕', info: '◆' };
  ico.textContent = icons[type] || '◆';
  txt.textContent = msg;
  el.className = `toast show t-${type}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.className = 'toast'; }, 3400);
}

function $(id) { return document.getElementById(id); }

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    + ' ' + dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function fmtDateShort(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function genPassId() {
  return 'VP-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

function duration(start, end) {
  if (!start || !end) return '—';
  const ms = new Date(end) - new Date(start);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function openModal(title, html) {
  $('modalTitle').textContent = title;
  $('modalBody').innerHTML = html;
  $('modal').classList.add('open');
}

function closeModal(e) {
  if (!e || e.target === $('modal')) $('modal').classList.remove('open');
}

function activePage() {
  const a = document.querySelector('.nav-btn.active');
  return a ? a.dataset.page : '';
}

function reRender() { navigateTo(activePage()); }

/* ─────────────────────────────────────────
   CLOCK
───────────────────────────────────────── */
function tickClock() {
  const el = $('topbarTime');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(tickClock, 1000);

/* ─────────────────────────────────────────
   AUTH
───────────────────────────────────────── */
function switchTab(tab) {
  $('tabLogin').classList.toggle('active', tab === 'login');
  $('tabRegister').classList.toggle('active', tab === 'register');
  $('formLogin').classList.toggle('active', tab === 'login');
  $('formRegister').classList.toggle('active', tab === 'register');
  $('tabIndicator').style.left = tab === 'login' ? '4px' : 'calc(50% + 0px)';
}

function selectLoginRole(role, btn) {
  S.loginRole = role;
  $('loginRole').value = role;
  $('loginRolePills').querySelectorAll('.rpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectRegRole(role, btn) {
  S.regRole = role;
  $('regRole').value = role;
  $('regRolePills').querySelectorAll('.rpill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function togglePwd(id, btn) {
  const inp = $(id);
  if (inp.type === 'password') { inp.type = 'text'; btn.textContent = 'Hide'; }
  else                          { inp.type = 'password'; btn.textContent = 'Show'; }
}

async function handleLogin() {
  const email = $('loginEmail').value.trim();
  const pw    = $('loginPassword').value;
  const role  = S.loginRole;
  if (!email || !pw) { toast('Enter email and password', 'error'); return; }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pw }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) {
      const d = await res.json();
      S.user = { name: d.name || email.split('@')[0], email, role: d.role || role, token: d.token };
    } else throw 0;
  } catch {
    // Demo mode
    S.user = { name: email.split('@')[0], email, role, token: 'demo' };
    seedDemoData();
  }

  launchApp();
}

async function handleRegister() {
  const name = $('regName').value.trim();
  const email = $('regEmail').value.trim();
  const pw    = $('regPassword').value;
  const role  = S.regRole;
  if (!name || !email || !pw) { toast('Fill all fields', 'error'); return; }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pw, role }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) { toast('Account created — sign in!', 'success'); switchTab('login'); return; }
  } catch {}

  toast('Registered (demo) — sign in now', 'success');
  switchTab('login');
}

function logout() {
  Object.assign(S, { user: null, visitors: [], requests: [], logs: [] });
  document.querySelector('.screen.active')?.classList.remove('active');
  $('authScreen').classList.add('active');
}

/* ─────────────────────────────────────────
   DEMO DATA
───────────────────────────────────────── */
function seedDemoData() {
  S.visitors = [
    { id:1, name:'Arjun Mehta',   phone:'9876543210', company:'TechCorp Ltd',     blacklisted:false },
    { id:2, name:'Priya Sharma',  phone:'9123456789', company:'Design Studio',    blacklisted:false },
    { id:3, name:'Vikram Singh',  phone:'9000112233', company:'Finance Partners', blacklisted:false },
    { id:4, name:'Sneha Patil',   phone:'9988776655', company:'StartupXYZ',       blacklisted:true  },
    { id:5, name:'Rohit Verma',   phone:'8877665544', company:'Consultancy Inc',  blacklisted:false },
    { id:6, name:'Kavya Nair',    phone:'7766554433', company:'MediaHouse',       blacklisted:false },
  ];
  const now = Date.now();
  const day = 86400000;
  S.requests = [
    { id:1, visitor:S.visitors[0], purpose:'Project Meeting',    host:'Admin Office', visitDate:new Date(now-day*2).toISOString(),  status:'APPROVED',  passId:genPassId(), checkIn:new Date(now-day*2+9*3600000).toISOString(), checkOut:new Date(now-day*2+11*3600000).toISOString() },
    { id:2, visitor:S.visitors[1], purpose:'HR Interview',       host:'HR Dept',      visitDate:new Date(now-day).toISOString(),    status:'APPROVED',  passId:genPassId(), checkIn:new Date(now-day+10*3600000).toISOString(),  checkOut:null },
    { id:3, visitor:S.visitors[2], purpose:'Client Presentation',host:'Boardroom',    visitDate:new Date(now).toISOString(),        status:'PENDING',   passId:null, checkIn:null, checkOut:null },
    { id:4, visitor:S.visitors[3], purpose:'Delivery',           host:'Reception',    visitDate:new Date(now).toISOString(),        status:'REJECTED',  passId:null, checkIn:null, checkOut:null },
    { id:5, visitor:S.visitors[4], purpose:'Audit Review',       host:'Finance Dept', visitDate:new Date(now+day).toISOString(),   status:'PENDING',   passId:null, checkIn:null, checkOut:null },
    { id:6, visitor:S.visitors[5], purpose:'Training Session',   host:'IT Dept',      visitDate:new Date(now+day*2).toISOString(), status:'APPROVED',  passId:genPassId(), checkIn:null, checkOut:null },
  ];
  S.logs = [
    { id:1, requestId:1, visitorName:'Arjun Mehta',  purpose:'Project Meeting',    checkIn:new Date(now-day*2+9*3600000).toISOString(),  checkOut:new Date(now-day*2+11*3600000).toISOString(), status:'CHECKED_OUT' },
    { id:2, requestId:2, visitorName:'Priya Sharma', purpose:'HR Interview',       checkIn:new Date(now-day+10*3600000).toISOString(),   checkOut:null, status:'CHECKED_IN' },
  ];
}

/* ─────────────────────────────────────────
   APP LAUNCH
───────────────────────────────────────── */
function launchApp() {
  const u = S.user;
  $('sbName').textContent  = u.name;
  $('sbRole').textContent  = u.role;
  $('sbAvatar').textContent = u.name[0].toUpperCase();
  buildSidebar();
  $('authScreen').classList.remove('active');
  $('appShell').classList.add('active');
  tickClock();
  navigateTo(defaultPage());
}

function defaultPage() {
  return { ADMIN:'adminDash', SECURITY:'secDash', VISITOR:'visDash' }[S.user.role] || 'adminDash';
}

/* ─────────────────────────────────────────
   SIDEBAR NAV CONFIG
───────────────────────────────────────── */
const NAV_CONFIG = {
  ADMIN: [
    { section: 'Overview' },
    { page:'adminDash',   icon:'◈', label:'Dashboard' },
    { section: 'Management' },
    { page:'requests',    icon:'📋', label:'Visit Requests',  badge: () => S.requests.filter(r=>r.status==='PENDING').length },
    { page:'passes',      icon:'🪪', label:'Pass Management' },
    { page:'visitors',    icon:'👥', label:'Visitors' },
    { section: 'Reports' },
    { page:'logs',        icon:'📊', label:'Entry/Exit Logs' },
  ],
  SECURITY: [
    { section: 'Overview' },
    { page:'secDash',     icon:'◈', label:'Dashboard' },
    { section: 'Operations' },
    { page:'scanner',     icon:'⬡', label:'QR Scanner' },
    { page:'active',      icon:'🟢', label:'Active Visitors' },
    { page:'entryLogs',   icon:'📋', label:'Entry Logs' },
  ],
  VISITOR: [
    { section: 'Overview' },
    { page:'visDash',     icon:'◈', label:'My Dashboard' },
    { section: 'Passes' },
    { page:'reqVisit',    icon:'✚', label:'Request Visit' },
    { page:'myPasses',    icon:'🪪', label:'My Passes' },
    { page:'myHistory',   icon:'🕓', label:'Visit History' },
  ],
};

function buildSidebar() {
  const nav   = $('sbNav');
  const items = NAV_CONFIG[S.user.role] || [];
  nav.innerHTML = items.map(item => {
    if (item.section) return `<div class="sb-section-label">${item.section}</div>`;
    const cnt = item.badge ? item.badge() : 0;
    return `
      <button class="nav-btn" data-page="${item.page}" onclick="navigateTo('${item.page}')">
        <div class="nav-btn-icon">${item.icon}</div>
        ${item.label}
        ${cnt > 0 ? `<span class="nav-badge">${cnt}</span>` : ''}
      </button>
    `;
  }).join('');
}

function navigateTo(page) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (btn) btn.classList.add('active');
  const label = btn ? btn.querySelector(':not(.nav-btn-icon):not(.nav-badge)')?.textContent?.trim() : page;
  $('pageTitle').textContent = label || page;
  renderPage(page);
  // Refresh badge counts
  buildSidebar();
  // Re-highlight after rebuild
  const btn2 = document.querySelector(`.nav-btn[data-page="${page}"]`);
  if (btn2) btn2.classList.add('active');
}

function toggleSidebar() {
  $('sidebar').classList.toggle('sb-open');
  $('sidebarOverlay').classList.toggle('sb-open');
}
function closeSidebar() {
  $('sidebar').classList.remove('sb-open');
  $('sidebarOverlay').classList.remove('sb-open');
}

/* ─────────────────────────────────────────
   PAGE ROUTER
───────────────────────────────────────── */
function renderPage(page) {
  const c = $('content');
  const renders = {
    adminDash:  renderAdminDash,
    requests:   renderRequests,
    passes:     renderPasses,
    visitors:   renderVisitors,
    logs:       renderLogs,
    secDash:    renderSecDash,
    scanner:    renderScanner,
    active:     renderActive,
    entryLogs:  renderEntryLogs,
    visDash:    renderVisDash,
    reqVisit:   renderReqVisit,
    myPasses:   renderMyPasses,
    myHistory:  renderMyHistory,
  };
  if (renders[page]) c.innerHTML = renders[page]();
  else c.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><p>Page not found</p></div>`;
  if (page === 'scanner') attachScanner();
}

/* ═══════════════════════════════════════════
   ADMIN: DASHBOARD
════════════════════════════════════════════ */
function renderAdminDash() {
  const total    = S.requests.length;
  const pending  = S.requests.filter(r => r.status === 'PENDING').length;
  const approved = S.requests.filter(r => r.status === 'APPROVED').length;
  const inside   = S.logs.filter(l => l.status === 'CHECKED_IN').length;
  const recent   = [...S.requests].reverse().slice(0, 5);

  return `
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      ${statCard('Total Requests', total, 'amber', '📋', '↑ All time')}
      ${statCard('Pending Review', pending, 'rose', '⏳', 'Needs action')}
      ${statCard('Approved Passes', approved, 'green', '✓', 'Ready to visit')}
      ${statCard('Currently Inside', inside, 'teal', '◉', 'Live count')}
    </div>

    <div class="grid2" style="margin-bottom:20px">
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title"><div class="panel-title-dot"></div>Pending Approvals</div>
          <button class="btn btn-ghost btn-sm" onclick="navigateTo('requests')">View all</button>
        </div>
        <div class="panel-body" style="padding:0">
          ${pending === 0
            ? `<div class="empty-state" style="padding:32px"><div class="empty-icon">✅</div><p>All caught up!</p></div>`
            : `<div class="tbl-wrap"><table>
                <thead><tr><th>Visitor</th><th>Purpose</th><th>Date</th><th>Action</th></tr></thead>
                <tbody>
                  ${S.requests.filter(r=>r.status==='PENDING').map(r=>`
                    <tr>
                      <td><strong>${r.visitor.name}</strong><br><span style="font-size:.75rem;color:var(--text3)">${r.visitor.company}</span></td>
                      <td>${r.purpose}</td>
                      <td style="font-size:.8rem;color:var(--text3);white-space:nowrap">${fmtDateShort(r.visitDate)}</td>
                      <td>
                        <div style="display:flex;gap:6px">
                          <button class="btn btn-green btn-sm" onclick="approveReq(${r.id})">✓</button>
                          <button class="btn btn-rose btn-sm" onclick="rejectReq(${r.id})">✕</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table></div>`
          }
        </div>
      </div>

      <div class="panel">
        <div class="panel-head">
          <div class="panel-title"><div class="panel-title-dot"></div>Recent Activity</div>
        </div>
        <div class="panel-body">
          <div class="timeline">
            ${recent.map((r, i) => `
              <div class="tl-row">
                <div class="tl-spine">
                  <div class="tl-dot-outer" style="${
                    r.status==='APPROVED'?'border-color:var(--green)':
                    r.status==='REJECTED'?'border-color:var(--rose)':''}">
                    <div class="tl-dot-inner" style="${
                      r.status==='APPROVED'?'background:var(--green)':
                      r.status==='REJECTED'?'background:var(--rose)':''}"></div>
                  </div>
                  ${i < recent.length-1 ? '<div class="tl-line"></div>' : ''}
                </div>
                <div class="tl-content">
                  <div class="tl-label">${r.visitor.name} — ${r.purpose}</div>
                  <div class="tl-meta">${fmtDateShort(r.visitDate)} &nbsp; <span class="badge ${r.status}">${r.status}</span></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head">
        <div class="panel-title"><div class="panel-title-dot"></div>Visitor Overview</div>
        <button class="btn btn-amber btn-sm" onclick="navigateTo('visitors')">Manage</button>
      </div>
      <div class="panel-body" style="padding:0">
        <div class="tbl-wrap">
          <table>
            <thead><tr><th>Visitor</th><th>Company</th><th>Phone</th><th>Visits</th><th>Status</th></tr></thead>
            <tbody>
              ${S.visitors.map(v => {
                const vc = S.requests.filter(r => r.visitor.id === v.id).length;
                return `<tr>
                  <td><strong>${v.name}</strong></td>
                  <td style="color:var(--text2)">${v.company}</td>
                  <td style="font-family:'JetBrains Mono',monospace;font-size:.8rem">${v.phone}</td>
                  <td style="color:var(--amber);font-weight:700">${vc}</td>
                  <td><span class="badge ${v.blacklisted?'BLACKLISTED':'ACTIVE'}">${v.blacklisted?'Blacklisted':'Active'}</span></td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function statCard(label, value, color, icon, trend) {
  return `
    <div class="stat-card ${color}">
      <div class="stat-icon ${color}">${icon}</div>
      <div class="stat-value ${color}">${value}</div>
      <div class="stat-label">${label}</div>
      <div class="stat-trend">${trend}</div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   ADMIN: VISIT REQUESTS
════════════════════════════════════════════ */
function renderRequests() {
  return `
    <div class="sec-head">
      <div class="sec-title">Visit Requests <span style="color:var(--text3);font-size:.82rem;font-weight:400">(${S.requests.length} total)</span></div>
      <button class="btn btn-amber" onclick="modalNewRequest()">+ New Request</button>
    </div>
    <div class="search-row">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="reqSearch" placeholder="Search visitor, purpose…" oninput="filterReqs()"/>
      </div>
      <select id="reqFilter" class="btn btn-ghost" onchange="filterReqs()" style="border:1px solid var(--line);outline:none;cursor:pointer">
        <option value="">All Status</option>
        <option value="PENDING">Pending</option>
        <option value="APPROVED">Approved</option>
        <option value="REJECTED">Rejected</option>
      </select>
    </div>
    <div class="panel">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Visitor</th><th>Company</th><th>Purpose</th><th>Host</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="reqTbody">${buildReqRows(S.requests)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function buildReqRows(arr) {
  if (!arr.length) return `<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text3)">No requests found</td></tr>`;
  return arr.map(r => `
    <tr>
      <td style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text3)">#${r.id}</td>
      <td><div style="font-weight:600">${r.visitor.name}</div><div style="font-size:.74rem;color:var(--text3)">${r.visitor.phone}</div></td>
      <td style="color:var(--text2);font-size:.82rem">${r.visitor.company}</td>
      <td>${r.purpose}</td>
      <td style="color:var(--text2)">${r.host}</td>
      <td style="font-size:.8rem;color:var(--text3);white-space:nowrap">${fmtDateShort(r.visitDate)}</td>
      <td><span class="badge ${r.status}">${r.status}</span></td>
      <td>
        <div style="display:flex;gap:6px;align-items:center">
          ${r.status==='PENDING' ? `
            <button class="btn btn-green btn-sm" onclick="approveReq(${r.id})">✓ Approve</button>
            <button class="btn btn-rose btn-sm" onclick="rejectReq(${r.id})">✕ Reject</button>
          ` : r.status==='APPROVED' ? `
            <button class="btn btn-teal btn-sm" onclick="viewPassModal(${r.id})">View Pass</button>
          ` : '—'}
        </div>
      </td>
    </tr>
  `).join('');
}

function filterReqs() {
  const q  = $('reqSearch').value.toLowerCase();
  const st = $('reqFilter').value;
  const f  = S.requests.filter(r =>
    (!st || r.status === st) &&
    (!q || r.visitor.name.toLowerCase().includes(q) || r.purpose.toLowerCase().includes(q))
  );
  $('reqTbody').innerHTML = buildReqRows(f);
}

function approveReq(id) {
  const r = S.requests.find(r => r.id === id);
  if (!r) return;
  r.status = 'APPROVED';
  r.passId = genPassId();
  toast(`Approved — Pass generated for ${r.visitor.name}`, 'success');
  reRender();
  fetch(`${API}/visit-requests/approve/${id}`, { method:'PUT', headers:ah() }).catch(()=>{});
}

function rejectReq(id) {
  const r = S.requests.find(r => r.id === id);
  if (!r) return;
  r.status = 'REJECTED';
  toast(`Request rejected for ${r.visitor.name}`, 'error');
  reRender();
  fetch(`${API}/visit-requests/reject/${id}`, { method:'PUT', headers:ah() }).catch(()=>{});
}

function modalNewRequest() {
  openModal('New Visit Request', `
    <div class="form2">
      <div class="igroup full">
        <label>Visitor</label>
        <select id="nrVisitor">
          ${S.visitors.map(v=>`<option value="${v.id}">${v.name} — ${v.company}</option>`).join('')}
        </select>
      </div>
      <div class="igroup">
        <label>Purpose of Visit</label>
        <input type="text" id="nrPurpose" placeholder="e.g. Project Meeting"/>
      </div>
      <div class="igroup">
        <label>Host / Department</label>
        <input type="text" id="nrHost" placeholder="e.g. HR Department"/>
      </div>
      <div class="igroup full">
        <label>Visit Date & Time</label>
        <input type="datetime-local" id="nrDate"/>
      </div>
      <div class="full" style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-amber" onclick="submitNewReq()">Create Request</button>
      </div>
    </div>
  `);
}

function submitNewReq() {
  const vId     = parseInt($('nrVisitor').value);
  const purpose = $('nrPurpose').value.trim();
  const host    = $('nrHost').value.trim();
  const date    = $('nrDate').value;
  if (!purpose || !host || !date) { toast('Fill all fields', 'error'); return; }
  const visitor = S.visitors.find(v => v.id === vId);
  S.requests.push({ id: S.requests.length+1, visitor, purpose, host, visitDate:date, status:'PENDING', passId:null, checkIn:null, checkOut:null });
  toast('Request created', 'success');
  closeModal();
  reRender();
}

/* ═══════════════════════════════════════════
   ADMIN: PASS MANAGEMENT
════════════════════════════════════════════ */
function renderPasses() {
  const passes = S.requests.filter(r => r.status === 'APPROVED');
  return `
    <div class="sec-head">
      <div class="sec-title">Security Passes <span style="color:var(--text3);font-size:.82rem;font-weight:400">(${passes.length} active)</span></div>
    </div>
    ${passes.length === 0
      ? `<div class="empty-state"><div class="empty-icon">🪪</div><p>No approved passes yet</p></div>`
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px">
          ${passes.map(r => `
            <div class="qr-card">
              <div class="qr-card-top">
                <div class="pass-stripe"></div>
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-top:8px">
                  <div>
                    <div style="font-size:1.1rem;font-weight:800">${r.visitor.name}</div>
                    <div style="font-size:.8rem;color:var(--text2);margin-top:3px">${r.visitor.company}</div>
                    <div style="font-size:.8rem;color:var(--text2);margin-top:2px">📍 ${r.host}</div>
                  </div>
                  <span class="badge APPROVED">Valid</span>
                </div>
                <div style="margin-top:14px;font-size:.82rem;color:var(--text2)">
                  <strong>Purpose:</strong> ${r.purpose} &nbsp;·&nbsp; <strong>Date:</strong> ${fmtDateShort(r.visitDate)}
                </div>
              </div>
              <div class="qr-card-bottom">
                <div>
                  <div style="font-size:.65rem;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;font-weight:600;margin-bottom:4px">Pass ID</div>
                  <div class="pass-code">${r.passId}</div>
                </div>
                <button class="btn btn-amber btn-sm" onclick="viewPassModal(${r.id})">View QR</button>
              </div>
            </div>
          `).join('')}
        </div>`
    }
  `;
}

function viewPassModal(id) {
  const r = S.requests.find(r => r.id === id);
  if (!r) return;
  openModal('Security Pass', `
    <div class="pass-card">
      <div class="pass-stripe"></div>
      <div style="font-size:.7rem;color:var(--text3);text-transform:uppercase;letter-spacing:.12em;font-weight:600">Visitor Security Pass</div>
      <div class="pass-card-name">${r.visitor.name}</div>
      <div class="pass-card-purpose">${r.purpose} · ${r.visitor.company}</div>
      <div class="pass-fields">
        <div class="pass-field"><label>Pass ID</label><p class="pass-code">${r.passId}</p></div>
        <div class="pass-field"><label>Visit Date</label><p>${fmtDateShort(r.visitDate)}</p></div>
        <div class="pass-field"><label>Host</label><p>${r.host}</p></div>
      </div>
    </div>
    <div style="display:flex;justify-content:center;margin:4px 0">
      <div class="qr-canvas-wrap" id="qrOut" style="width:180px;height:180px"></div>
    </div>
    <p style="text-align:center;font-size:.78rem;color:var(--text3)">Present this QR code at the entry gate</p>
    <div style="display:flex;gap:10px;justify-content:center">
      <button class="btn btn-amber" onclick="dlPass('${r.passId}','${r.visitor.name}')">⬇ Download Pass</button>
      <button class="btn btn-ghost" onclick="closeModal()">Close</button>
    </div>
  `);
  setTimeout(() => drawQR('qrOut', r.passId), 50);
}

/* ═══════════════════════════════════════════
   ADMIN: VISITORS
════════════════════════════════════════════ */
function renderVisitors() {
  return `
    <div class="sec-head">
      <div class="sec-title">Visitors Directory</div>
      <button class="btn btn-amber" onclick="modalAddVisitor()">+ Add Visitor</button>
    </div>
    <div class="search-row">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="visSearch" placeholder="Search by name or company…" oninput="filterVis()"/>
      </div>
    </div>
    <div class="panel">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Name</th><th>Company</th><th>Phone</th><th>Visits</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody id="visTbody">${buildVisRows(S.visitors)}</tbody>
        </table>
      </div>
    </div>
  `;
}

function buildVisRows(arr) {
  if (!arr.length) return `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text3)">No visitors found</td></tr>`;
  return arr.map(v => {
    const vc = S.requests.filter(r => r.visitor.id === v.id).length;
    return `
      <tr>
        <td style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text3)">#${v.id}</td>
        <td><div style="font-weight:600">${v.name}</div></td>
        <td style="color:var(--text2)">${v.company}</td>
        <td style="font-family:'JetBrains Mono',monospace;font-size:.82rem">${v.phone}</td>
        <td style="color:var(--amber);font-weight:700;font-family:'JetBrains Mono',monospace">${vc}</td>
        <td><span class="badge ${v.blacklisted?'BLACKLISTED':'ACTIVE'}">${v.blacklisted?'Blacklisted':'Active'}</span></td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-ghost btn-sm" onclick="viewVisitorModal(${v.id})">Profile</button>
            <button class="btn ${v.blacklisted?'btn-green':'btn-rose'} btn-sm" onclick="toggleBlacklist(${v.id})">${v.blacklisted?'Unblock':'Block'}</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function filterVis() {
  const q = $('visSearch').value.toLowerCase();
  $('visTbody').innerHTML = buildVisRows(S.visitors.filter(v =>
    v.name.toLowerCase().includes(q) || v.company.toLowerCase().includes(q)
  ));
}

function toggleBlacklist(id) {
  const v = S.visitors.find(v => v.id === id);
  if (!v) return;
  v.blacklisted = !v.blacklisted;
  toast(v.blacklisted ? `${v.name} has been blocked` : `${v.name} has been unblocked`, v.blacklisted ? 'error' : 'success');
  reRender();
}

function viewVisitorModal(id) {
  const v = S.visitors.find(v => v.id === id);
  if (!v) return;
  const visits = S.requests.filter(r => r.visitor.id === id);
  openModal(`Visitor Profile`, `
    <div class="pass-card" style="margin-bottom:16px">
      <div class="pass-stripe"></div>
      <div style="display:flex;align-items:center;gap:16px;margin-top:10px">
        <div style="width:52px;height:52px;border-radius:14px;background:linear-gradient(135deg,var(--amber),var(--rose));display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.4rem;color:var(--ink)">${v.name[0]}</div>
        <div>
          <div class="pass-card-name" style="font-size:1.2rem">${v.name}</div>
          <div class="pass-card-purpose">${v.company} · ${v.phone}</div>
        </div>
      </div>
      <div class="pass-fields" style="margin-top:16px">
        <div class="pass-field"><label>Total Visits</label><p style="color:var(--amber)">${visits.length}</p></div>
        <div class="pass-field"><label>Status</label><p>${v.blacklisted?'🔴 Blocked':'🟢 Active'}</p></div>
      </div>
    </div>
    <div style="font-weight:700;font-size:.88rem;margin-bottom:12px;color:var(--text2)">VISIT HISTORY</div>
    ${visits.length === 0 ? '<p style="color:var(--text3)">No visits recorded</p>' :
      visits.map(r=>`
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--line2)">
          <div>
            <div style="font-weight:600;font-size:.88rem">${r.purpose}</div>
            <div style="font-size:.75rem;color:var(--text3)">${fmtDateShort(r.visitDate)} · ${r.host}</div>
          </div>
          <span class="badge ${r.status}">${r.status}</span>
        </div>
      `).join('')}
  `);
}

function modalAddVisitor() {
  openModal('Add Visitor', `
    <div class="form2">
      <div class="igroup">
        <label>Full Name</label>
        <input type="text" id="avName" placeholder="Visitor full name"/>
      </div>
      <div class="igroup">
        <label>Company</label>
        <input type="text" id="avCompany" placeholder="Organisation"/>
      </div>
      <div class="igroup">
        <label>Phone</label>
        <input type="text" id="avPhone" placeholder="10-digit number"/>
      </div>
      <div class="full" style="display:flex;justify-content:flex-end;gap:10px;margin-top:8px">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-amber" onclick="submitAddVisitor()">Add Visitor</button>
      </div>
    </div>
  `);
}

function submitAddVisitor() {
  const name    = $('avName').value.trim();
  const company = $('avCompany').value.trim();
  const phone   = $('avPhone').value.trim();
  if (!name) { toast('Name is required', 'error'); return; }
  S.visitors.push({ id:S.visitors.length+1, name, company:company||'—', phone:phone||'—', blacklisted:false });
  toast(`${name} added`, 'success');
  closeModal();
  reRender();
}

/* ═══════════════════════════════════════════
   ADMIN: LOGS
════════════════════════════════════════════ */
function renderLogs() {
  return `
    <div class="sec-head">
      <div class="sec-title">Entry / Exit Logs</div>
    </div>
    <div class="panel">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>#</th><th>Visitor</th><th>Purpose</th><th>Check-In</th><th>Check-Out</th><th>Duration</th><th>Status</th></tr></thead>
          <tbody>
            ${S.logs.length === 0
              ? `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--text3)">No log entries yet</td></tr>`
              : S.logs.map(l=>`
                <tr>
                  <td style="font-family:'JetBrains Mono',monospace;font-size:.75rem;color:var(--text3)">#${l.id}</td>
                  <td style="font-weight:600">${l.visitorName}</td>
                  <td>${l.purpose}</td>
                  <td style="font-size:.8rem;font-family:'JetBrains Mono',monospace">${fmtDate(l.checkIn)}</td>
                  <td style="font-size:.8rem;font-family:'JetBrains Mono',monospace">${l.checkOut?fmtDate(l.checkOut):'—'}</td>
                  <td style="color:var(--amber);font-family:'JetBrains Mono',monospace">${duration(l.checkIn,l.checkOut)}</td>
                  <td><span class="badge ${l.status}">${l.status}</span></td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   SECURITY: DASHBOARD
════════════════════════════════════════════ */
function renderSecDash() {
  const inside  = S.logs.filter(l=>l.status==='CHECKED_IN').length;
  const today   = S.logs.filter(l=>new Date(l.checkIn).toDateString()===new Date().toDateString()).length;
  const pending = S.requests.filter(r=>r.status==='PENDING').length;
  const approved= S.requests.filter(r=>r.status==='APPROVED').length;

  return `
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      ${statCard('Currently Inside', inside, 'teal', '◉', 'Live')}
      ${statCard('Check-ins Today', today, 'green', '↑', 'Today')}
      ${statCard('Valid Passes', approved, 'amber', '🪪', 'Ready')}
      ${statCard('Awaiting Approval', pending, 'rose', '⏳', 'Pending')}
    </div>
    <div class="grid2">
      <div class="panel" style="cursor:pointer" onclick="navigateTo('scanner')">
        <div class="panel-body" style="text-align:center;padding:40px">
          <div style="font-size:4rem;margin-bottom:16px">⬡</div>
          <div style="font-size:1.1rem;font-weight:800">QR Scanner</div>
          <div style="font-size:.83rem;color:var(--text2);margin-top:6px">Scan & verify visitor passes</div>
          <div style="margin-top:18px">
            <span class="btn btn-teal">Open Scanner →</span>
          </div>
        </div>
      </div>
      <div class="panel" onclick="navigateTo('active')" style="cursor:pointer">
        <div class="panel-body" style="text-align:center;padding:40px">
          <div style="font-size:4rem;margin-bottom:16px">🟢</div>
          <div style="font-size:1.1rem;font-weight:800">Active Visitors</div>
          <div style="font-size:.83rem;color:var(--text2);margin-top:6px">${inside} visitor${inside!==1?'s':''} currently on premises</div>
          <div style="margin-top:18px">
            <span class="btn btn-green">Monitor →</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   SECURITY: QR SCANNER
════════════════════════════════════════════ */
function renderScanner() {
  return `
    <div style="max-width:560px;margin:0 auto">
      <div class="panel" style="margin-bottom:20px">
        <div class="panel-head"><div class="panel-title"><div class="panel-title-dot" style="background:var(--teal);box-shadow:0 0 8px var(--teal)"></div>QR Code Verifier</div></div>
        <div class="panel-body">
          <div style="display:flex;flex-direction:column;align-items:center;gap:20px">
            <div class="scan-zone" id="scanZone" onclick="simulateScan()">
              <div class="scan-beam"></div>
              <div class="scan-icon">⬡</div>
              <div class="scan-label">Click to Simulate Scan</div>
              <div class="scan-sub">or enter pass ID below</div>
            </div>
            <div style="width:100%;display:flex;gap:10px">
              <div style="flex:1;display:flex;align-items:center;gap:0;background:var(--ink3);border:1.5px solid var(--line);border-radius:11px;overflow:hidden">
                <input type="text" id="scanInput" placeholder="Enter Pass ID (VP-XXXXXXXX)" style="flex:1;padding:12px 14px;background:none;border:none;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:.88rem;outline:none"/>
              </div>
              <button class="btn btn-teal" onclick="verifyPass($('scanInput').value)">Verify</button>
            </div>
          </div>
          <div id="verifyOut"></div>
        </div>
      </div>
    </div>
  `;
}

function attachScanner() {}

function simulateScan() {
  const valid = S.requests.filter(r=>r.status==='APPROVED' && r.passId);
  if (!valid.length) { toast('No valid passes in demo data', 'error'); return; }
  const r = valid[Math.floor(Math.random()*valid.length)];
  $('scanInput').value = r.passId;
  verifyPass(r.passId);
}

function verifyPass(code) {
  const el = $('verifyOut');
  if (!el) return;
  if (!code || !code.trim()) { toast('Enter a pass ID', 'error'); return; }
  const r = S.requests.find(r=>r.passId===code.trim().toUpperCase());

  if (!r) {
    el.innerHTML = `
      <div class="verify-result deny">
        <div class="verify-icon">❌</div>
        <div class="verify-title" style="color:var(--rose)">INVALID PASS</div>
        <div style="font-size:.85rem;color:var(--text2)">No matching pass found in system</div>
      </div>`;
    return;
  }
  if (r.visitor.blacklisted) {
    el.innerHTML = `
      <div class="verify-result deny">
        <div class="verify-icon">🚫</div>
        <div class="verify-title" style="color:var(--rose)">ACCESS DENIED</div>
        <div style="font-size:.85rem;color:var(--text2)">${r.visitor.name} is on the blocked list</div>
      </div>`;
    return;
  }
  if (r.status !== 'APPROVED') {
    el.innerHTML = `
      <div class="verify-result warn">
        <div class="verify-icon">⚠️</div>
        <div class="verify-title" style="color:var(--amber)">PASS NOT VALID</div>
        <div style="font-size:.85rem;color:var(--text2)">Request status: <strong>${r.status}</strong></div>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="verify-result allow">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:4px">
        <div class="verify-icon">✅</div>
        <div>
          <div class="verify-title" style="color:var(--green)">ACCESS GRANTED</div>
          <div style="font-size:.82rem;color:var(--text2)">Identity verified — allow entry</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:rgba(0,0,0,0.2);border-radius:12px;padding:16px;font-size:.85rem">
        <div><div style="color:var(--text3);font-size:.72rem;text-transform:uppercase;font-weight:600">Visitor</div><div style="font-weight:600;margin-top:3px">${r.visitor.name}</div></div>
        <div><div style="color:var(--text3);font-size:.72rem;text-transform:uppercase;font-weight:600">Company</div><div style="font-weight:600;margin-top:3px">${r.visitor.company}</div></div>
        <div><div style="color:var(--text3);font-size:.72rem;text-transform:uppercase;font-weight:600">Purpose</div><div style="font-weight:600;margin-top:3px">${r.purpose}</div></div>
        <div><div style="color:var(--text3);font-size:.72rem;text-transform:uppercase;font-weight:600">Host</div><div style="font-weight:600;margin-top:3px">${r.host}</div></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:4px">
        <button class="btn btn-green" onclick="doCheckIn(${r.id})">✓ Check In</button>
        <button class="btn btn-rose" onclick="doCheckOut(${r.id})">Deny Entry</button>
      </div>
    </div>`;
}

function doCheckIn(reqId) {
  const r = S.requests.find(r=>r.id===reqId);
  if (!r) return;
  r.checkIn = new Date().toISOString();
  const exists = S.logs.find(l=>l.requestId===reqId);
  if (!exists) {
    S.logs.push({ id:S.logs.length+1, requestId:reqId, visitorName:r.visitor.name, purpose:r.purpose, checkIn:r.checkIn, checkOut:null, status:'CHECKED_IN' });
  }
  toast(`${r.visitor.name} checked in ✓`, 'success');
  $('verifyOut').innerHTML = `
    <div class="verify-result allow" style="text-align:center">
      <div class="verify-icon">🟢</div>
      <div class="verify-title" style="color:var(--green)">CHECKED IN</div>
      <div style="font-size:.85rem;color:var(--text2)">${r.visitor.name} · ${fmtDate(r.checkIn)}</div>
    </div>`;
  fetch(`${API}/visit-logs/checkin/${reqId}`,{method:'POST',headers:ah()}).catch(()=>{});
}

function doCheckOut(reqId) {
  toast('Entry denied for this visit', 'error');
  $('verifyOut').innerHTML = '';
}

/* ═══════════════════════════════════════════
   SECURITY: ACTIVE VISITORS
════════════════════════════════════════════ */
function renderActive() {
  const active = S.logs.filter(l=>l.status==='CHECKED_IN');
  return `
    <div class="sec-head">
      <div class="sec-title">On Premises Now <span style="color:var(--teal);font-family:'JetBrains Mono',monospace;font-size:.9rem">${active.length} inside</span></div>
    </div>
    ${active.length === 0
      ? `<div class="empty-state"><div class="empty-icon">🏢</div><p>No active visitors on premises</p></div>`
      : `<div class="monitor-grid">
          ${active.map(l=>`
            <div class="monitor-card">
              <div class="monitor-dot"></div>
              <span class="badge CHECKED_IN">Live</span>
              <div class="monitor-card-name">${l.visitorName}</div>
              <div class="monitor-card-sub">${l.purpose}</div>
              <div class="monitor-card-time">In since ${fmtDate(l.checkIn)}</div>
              <div style="margin-top:14px;display:flex;gap:8px">
                <button class="btn btn-ghost btn-sm" onclick="checkOutLog(${l.id})">Check Out</button>
              </div>
            </div>
          `).join('')}
        </div>`
    }
  `;
}

function renderEntryLogs() {
  return renderLogs();
}

function checkOutLog(logId) {
  const l = S.logs.find(l=>l.id===logId);
  if (!l) return;
  l.checkOut = new Date().toISOString();
  l.status = 'CHECKED_OUT';
  toast(`${l.visitorName} checked out`, 'success');
  reRender();
  fetch(`${API}/visit-logs/checkout/${logId}`,{method:'PUT',headers:ah()}).catch(()=>{});
}

/* ═══════════════════════════════════════════
   VISITOR: DASHBOARD
════════════════════════════════════════════ */
function renderVisDash() {
  const myName = S.user.name.toLowerCase();
  const myR = S.requests.filter(r=>r.visitor.name.toLowerCase()===myName);
  const pending  = myR.filter(r=>r.status==='PENDING').length;
  const approved = myR.filter(r=>r.status==='APPROVED').length;
  const rejected = myR.filter(r=>r.status==='REJECTED').length;

  return `
    <div style="margin-bottom:24px">
      <h2 style="font-size:1.5rem;font-weight:800;letter-spacing:-0.02em">Welcome back, ${S.user.name} 👋</h2>
      <p style="color:var(--text2);font-size:.9rem;margin-top:4px">Here's your visit status at a glance</p>
    </div>
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      ${statCard('Total Requests', myR.length, 'amber', '📋', 'All time')}
      ${statCard('Pending', pending, 'rose', '⏳', 'Awaiting')}
      ${statCard('Approved', approved, 'green', '✓', 'Valid')}
      ${statCard('Rejected', rejected, 'blue', '—', 'Declined')}
    </div>
    <div class="grid2">
      <div class="panel">
        <div class="panel-head"><div class="panel-title"><div class="panel-title-dot"></div>My Requests</div><button class="btn btn-amber btn-sm" onclick="navigateTo('reqVisit')">+ New</button></div>
        <div class="panel-body" style="padding:0">
          ${myR.length===0
            ? `<div class="empty-state" style="padding:32px"><div class="empty-icon">📋</div><p>No requests yet. <span style="color:var(--amber);cursor:pointer" onclick="navigateTo('reqVisit')">Request a visit!</span></p></div>`
            : `<div class="tbl-wrap"><table>
                <thead><tr><th>Purpose</th><th>Date</th><th>Status</th><th>Pass</th></tr></thead>
                <tbody>
                  ${myR.map(r=>`
                    <tr>
                      <td style="font-weight:600">${r.purpose}</td>
                      <td style="font-size:.8rem;color:var(--text3)">${fmtDateShort(r.visitDate)}</td>
                      <td><span class="badge ${r.status}">${r.status}</span></td>
                      <td>${r.status==='APPROVED'?`<button class="btn btn-teal btn-sm" onclick="viewPassModal(${r.id})">View QR</button>`:'—'}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table></div>`
          }
        </div>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="panel-title"><div class="panel-title-dot"></div>Quick Actions</div></div>
        <div class="panel-body" style="display:flex;flex-direction:column;gap:10px">
          ${[
            ['✚ Request a Visit',    'btn-amber', "navigateTo('reqVisit')"],
            ['🪪 View My Passes',    'btn-ghost', "navigateTo('myPasses')"],
            ['🕓 Visit History',     'btn-ghost', "navigateTo('myHistory')"],
          ].map(([label,cls,fn])=>`<button class="btn ${cls} btn-lg" style="justify-content:flex-start" onclick="${fn}">${label}</button>`).join('')}
        </div>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   VISITOR: REQUEST VISIT
════════════════════════════════════════════ */
function renderReqVisit() {
  const tmr = new Date(Date.now()+86400000).toISOString().slice(0,16);
  return `
    <div style="max-width:580px">
      <div class="panel">
        <div class="panel-head"><div class="panel-title"><div class="panel-title-dot"></div>Request a Visit Pass</div></div>
        <div class="panel-body">
          <div class="form2">
            <div class="igroup">
              <label>Your Name</label>
              <input type="text" id="rvName" value="${S.user.name}" placeholder="As on ID proof"/>
            </div>
            <div class="igroup">
              <label>Phone Number</label>
              <input type="text" id="rvPhone" placeholder="10-digit mobile"/>
            </div>
            <div class="igroup">
              <label>Company / Organisation</label>
              <input type="text" id="rvCompany" placeholder="Your company name"/>
            </div>
            <div class="igroup">
              <label>Purpose of Visit</label>
              <input type="text" id="rvPurpose" placeholder="e.g. Meeting, Interview…"/>
            </div>
            <div class="igroup">
              <label>Host / Department to Visit</label>
              <input type="text" id="rvHost" placeholder="Person or department you're visiting"/>
            </div>
            <div class="igroup">
              <label>Visit Date & Time</label>
              <input type="datetime-local" id="rvDate" value="${tmr}"/>
            </div>
            <div class="igroup full">
              <label>Additional Notes</label>
              <textarea id="rvNotes" placeholder="Any special requirements or notes…"></textarea>
            </div>
          </div>
          <div style="margin-top:20px;display:flex;gap:10px;justify-content:flex-end">
            <button class="btn btn-ghost" onclick="navigateTo('visDash')">Cancel</button>
            <button class="btn btn-amber btn-lg" onclick="submitVisitReq()">Submit Request →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function submitVisitReq() {
  const name    = $('rvName').value.trim();
  const phone   = $('rvPhone').value.trim();
  const company = $('rvCompany').value.trim();
  const purpose = $('rvPurpose').value.trim();
  const host    = $('rvHost').value.trim();
  const date    = $('rvDate').value;
  if (!name||!purpose||!host||!date) { toast('Fill all required fields', 'error'); return; }
  let visitor = S.visitors.find(v=>v.name.toLowerCase()===name.toLowerCase());
  if (!visitor) {
    visitor = { id:S.visitors.length+1, name, phone:phone||'—', company:company||'—', blacklisted:false };
    S.visitors.push(visitor);
  }
  S.requests.push({ id:S.requests.length+1, visitor, purpose, host, visitDate:date, status:'PENDING', passId:null, checkIn:null, checkOut:null });
  toast('Visit request submitted — awaiting admin approval!', 'success');
  navigateTo('visDash');
}

/* ═══════════════════════════════════════════
   VISITOR: MY PASSES
════════════════════════════════════════════ */
function renderMyPasses() {
  const myName = S.user.name.toLowerCase();
  const passes = S.requests.filter(r=>r.status==='APPROVED'&&r.visitor.name.toLowerCase()===myName);
  return `
    <div class="sec-head"><div class="sec-title">My Valid Passes</div></div>
    ${passes.length===0
      ? `<div class="empty-state"><div class="empty-icon">🪪</div><p>No approved passes yet.<br>Request a visit and wait for admin approval.</p></div>`
      : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px">
          ${passes.map(r=>`
            <div class="qr-card">
              <div class="qr-card-top">
                <div class="pass-stripe"></div>
                <div style="margin-top:8px">
                  <div style="font-size:1rem;font-weight:800">${r.purpose}</div>
                  <div style="font-size:.8rem;color:var(--text2);margin-top:3px">Host: ${r.host}</div>
                  <div style="font-size:.8rem;color:var(--text3);margin-top:2px">${fmtDateShort(r.visitDate)}</div>
                </div>
              </div>
              <div class="qr-card-bottom">
                <div>
                  <div style="font-size:.65rem;color:var(--text3);text-transform:uppercase;letter-spacing:.1em;font-weight:600;margin-bottom:4px">Pass ID</div>
                  <div class="pass-code">${r.passId}</div>
                </div>
                <button class="btn btn-amber btn-sm" onclick="viewPassModal(${r.id})">View QR</button>
              </div>
            </div>
          `).join('')}
        </div>`
    }
  `;
}

/* ═══════════════════════════════════════════
   VISITOR: HISTORY
════════════════════════════════════════════ */
function renderMyHistory() {
  const myName = S.user.name.toLowerCase();
  const hist   = S.requests.filter(r=>r.visitor.name.toLowerCase()===myName);
  return `
    <div class="sec-head"><div class="sec-title">Visit History</div></div>
    <div class="panel">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Purpose</th><th>Host</th><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Status</th></tr></thead>
          <tbody>
            ${hist.length===0
              ? `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--text3)">No visit history</td></tr>`
              : hist.map(r=>`
                <tr>
                  <td style="font-weight:600">${r.purpose}</td>
                  <td style="color:var(--text2)">${r.host}</td>
                  <td style="font-size:.8rem;color:var(--text3)">${fmtDateShort(r.visitDate)}</td>
                  <td style="font-size:.8rem;font-family:'JetBrains Mono',monospace">${r.checkIn?fmtDate(r.checkIn):'—'}</td>
                  <td style="font-size:.8rem;font-family:'JetBrains Mono',monospace">${r.checkOut?fmtDate(r.checkOut):'—'}</td>
                  <td><span class="badge ${r.status}">${r.status}</span></td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ═══════════════════════════════════════════
   QR CANVAS GENERATOR
════════════════════════════════════════════ */
function drawQR(containerId, code) {
  const wrap = $(containerId);
  if (!wrap) return;
  const canvas = document.createElement('canvas');
  const SIZE   = 200;
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx    = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, SIZE, SIZE);

  const CELLS  = 21;
  const CELL   = SIZE / CELLS;
  const seed   = code.split('').reduce((a, c) => a + c.charCodeAt(0) * 31, 0);

  function shouldFill(row, col) {
    if (row < 8 && col < 8) return false;
    if (row < 8 && col >= CELLS - 7) return false;
    if (row >= CELLS - 7 && col < 8) return false;
    return ((row * 37 + col * 13 + seed * (row+1)) % 2) === 0;
  }

  ctx.fillStyle = '#111111';
  for (let r = 0; r < CELLS; r++) {
    for (let c = 0; c < CELLS; c++) {
      if (shouldFill(r, c)) {
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      }
    }
  }

  // Corner finder patterns
  [[0,0],[0,CELLS-7],[CELLS-7,0]].forEach(([r,c]) => {
    ctx.fillStyle = '#111111';
    ctx.fillRect(c*CELL, r*CELL, 7*CELL, 7*CELL);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect((c+1)*CELL, (r+1)*CELL, 5*CELL, 5*CELL);
    ctx.fillStyle = '#111111';
    ctx.fillRect((c+2)*CELL, (r+2)*CELL, 3*CELL, 3*CELL);
  });

  wrap.innerHTML = '';
  wrap.style.background = '#fff';
  wrap.style.borderRadius = '10px';
  wrap.style.padding = '10px';
  wrap.appendChild(canvas);
}

function dlPass(passId, name) {
  const wrap = $('qrOut');
  if (!wrap) return;
  const canvas = wrap.querySelector('canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = `VAULTPASS_${name.replace(/\s+/g,'_')}_${passId}.png`;
  a.href = canvas.toDataURL('image/png');
  a.click();
  toast('Pass downloaded!', 'success');
}

/* ─── API HELPERS ─── */
function ah() { return { 'Authorization': `Bearer ${S.user?.token||''}` }; }

/* ─── INIT ─── */
$('authScreen').classList.add('active');
// Set tab indicator initial position
setTimeout(() => { if($('tabIndicator')) $('tabIndicator').style.left = '4px'; }, 10);