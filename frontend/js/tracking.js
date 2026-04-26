// ===== ENTRY/EXIT TRACKING =====

function loadTracking() {
  displayTracking(mockTracking);
}

function displayTracking(tracking) {
  const tbody = document.getElementById('trackingTableBody');
  tbody.innerHTML = '';
  
  tracking.forEach(record => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.visitorName}</td>
      <td>${record.passId}</td>
      <td><span class="status-badge ${record.type === 'checkin' ? 'status-approved' : 'status-pending'}">${record.type === 'checkin' ? 'Check-in' : 'Check-out'}</span></td>
      <td>${record.time}</td>
      <td>${record.duration}</td>
    `;
    tbody.appendChild(row);
  });
}

function filterTracking() {
  const date = document.getElementById('trackingDate').value;
  const filter = document.getElementById('trackingFilter').value;
  
  let filtered = [...mockTracking];
  
  if (date) {
    filtered = filtered.filter(record => record.time.includes(date));
  }
  
  if (filter !== 'all') {
    filtered = filtered.filter(record => record.type === filter);
  }
  
  displayTracking(filtered);
}

function loadVisitHistory() {
  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '';
  
  mockTracking.forEach((record, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.time.split(' ')[0]}</td>
      <td>-</td>
      <td>${record.time.split(' ')[1]}</td>
      <td>-</td>
      <td>${record.duration}</td>
    `;
    tbody.appendChild(row);
  });
}
