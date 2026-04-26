// ===== VISITORS MANAGEMENT =====

function loadVisitors() {
  displayVisitors(mockVisitors);
}

function displayVisitors(visitors) {
  const tbody = document.getElementById('visitorsTableBody');
  tbody.innerHTML = '';
  
  visitors.forEach(visitor => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${visitor.name}</td>
      <td>${visitor.email}</td>
      <td>${visitor.phone}</td>
      <td>${visitor.company}</td>
      <td>${visitor.visits}</td>
      <td>${formatDate(visitor.lastVisit)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-primary btn-sm" onclick="viewVisitorDetails(${visitor.id})">View</button>
          <button class="btn btn-secondary btn-sm" onclick="sendMessage(${visitor.id})">Message</button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function filterVisitors() {
  const searchTerm = document.getElementById('visitorSearch').value.toLowerCase();
  
  const filtered = mockVisitors.filter(visitor => 
    visitor.name.toLowerCase().includes(searchTerm) ||
    visitor.email.toLowerCase().includes(searchTerm) ||
    visitor.company.toLowerCase().includes(searchTerm)
  );
  
  displayVisitors(filtered);
}

function viewVisitorDetails(visitorId) {
  const visitor = mockVisitors.find(v => v.id === visitorId);
  if (visitor) {
    showNotification(`Viewing details for ${visitor.name}`, 'info');
    // In a real app, open a detailed view modal
  }
}

function sendMessage(visitorId) {
  const visitor = mockVisitors.find(v => v.id === visitorId);
  if (visitor) {
    showNotification(`Message sent to ${visitor.name}`, 'success');
  }
}
