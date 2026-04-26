// ===== DASHBOARD FUNCTIONS =====

// Mock data
const mockVisitors = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', company: 'Tech Corp', visits: 5, lastVisit: '2024-04-20' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', company: 'Design Inc', visits: 3, lastVisit: '2024-04-19' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 9876543212', company: 'Consulting Ltd', visits: 8, lastVisit: '2024-04-18' },
];

const mockRequests = [
  { id: 1, visitorName: 'John Doe', email: 'john@example.com', purpose: 'Meeting', date: '2024-04-25', status: 'pending' },
  { id: 2, visitorName: 'Jane Smith', email: 'jane@example.com', purpose: 'Conference', date: '2024-04-26', status: 'approved' },
  { id: 3, visitorName: 'Mike Johnson', email: 'mike@example.com', purpose: 'Presentation', date: '2024-04-27', status: 'pending' },
];

const mockPasses = [
  { id: 'PASS001', visitorName: 'John Doe', date: '2024-04-25', purpose: 'Meeting', status: 'active', qrCode: 'QR001' },
  { id: 'PASS002', visitorName: 'Jane Smith', date: '2024-04-26', purpose: 'Conference', status: 'active', qrCode: 'QR002' },
  { id: 'PASS003', visitorName: 'Mike Johnson', date: '2024-04-27', purpose: 'Presentation', status: 'pending', qrCode: 'QR003' },
];

const mockTracking = [
  { id: 1, visitorName: 'John Doe', passId: 'PASS001', type: 'checkin', time: '2024-04-25 09:30', duration: '2 hours' },
  { id: 2, visitorName: 'Jane Smith', passId: 'PASS002', type: 'checkin', time: '2024-04-26 10:15', duration: '1.5 hours' },
  { id: 3, visitorName: 'Mike Johnson', passId: 'PASS003', type: 'checkout', time: '2024-04-27 15:45', duration: '3 hours' },
];

// ===== REQUESTS MANAGEMENT =====
function loadRequests() {
  const tbody = document.getElementById('requestsTableBody');
  tbody.innerHTML = '';
  
  mockRequests.forEach(request => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${request.visitorName}</td>
      <td>${request.email}</td>
      <td>${request.purpose}</td>
      <td>${formatDate(request.date)}</td>
      <td><span class="status-badge status-${request.status}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span></td>
      <td>
        <div class="action-buttons">
          ${request.status === 'pending' ? `
            <button class="btn btn-success btn-sm" onclick="approveRequest(${request.id})">Approve</button>
            <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">Reject</button>
          ` : `
            <button class="btn btn-secondary btn-sm" onclick="viewRequest(${request.id})">View</button>
          `}
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function approveRequest(requestId) {
  const request = mockRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'approved';
    const pass = {
      id: generatePassCode(),
      visitorName: request.visitorName,
      date: request.date,
      purpose: request.purpose,
      status: 'active',
      qrCode: 'QR' + Math.random().toString(36).substr(2, 5).toUpperCase()
    };
    mockPasses.push(pass);
    loadRequests();
    showNotification(`Request approved! Pass ID: ${pass.id}`, 'success');
  }
}

function rejectRequest(requestId) {
  const request = mockRequests.find(r => r.id === requestId);
  if (request) {
    request.status = 'rejected';
    loadRequests();
    showNotification('Request rejected', 'success');
  }
}

function viewRequest(requestId) {
  const request = mockRequests.find(r => r.id === requestId);
  if (request) {
    showNotification(`Viewing request from ${request.visitorName}`, 'info');
  }
}

function submitRequest(event) {
  event.preventDefault();
  
  const name = document.getElementById('requestName').value;
  const email = document.getElementById('requestEmail').value;
  const phone = document.getElementById('requestPhone').value;
  const company = document.getElementById('requestCompany').value;
  const purpose = document.getElementById('requestPurpose').value;
  const date = document.getElementById('requestDate').value;
  const department = document.getElementById('requestDepartment').value;
  
  if (!name || !email || !phone || !purpose || !date || !department) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  const newRequest = {
    id: mockRequests.length + 1,
    visitorName: name,
    email: email,
    phone: phone,
    company: company,
    purpose: purpose,
    date: date,
    department: department,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  
  mockRequests.push(newRequest);
  closeModal('requestModal');
  showNotification('Visit request submitted successfully!', 'success');
  
  // Clear form
  document.getElementById('requestName').value = '';
  document.getElementById('requestEmail').value = '';
  document.getElementById('requestPhone').value = '';
  document.getElementById('requestCompany').value = '';
  document.getElementById('requestPurpose').value = '';
  document.getElementById('requestDate').value = '';
  document.getElementById('requestDepartment').value = '';
}
