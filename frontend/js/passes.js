// ===== SECURITY PASSES MANAGEMENT =====

function loadPasses() {
  displayPasses(mockPasses);
}

function displayPasses(passes) {
  const grid = document.getElementById('passesGrid');
  grid.innerHTML = '';
  
  passes.forEach(pass => {
    const card = document.createElement('div');
    card.className = 'pass-card';
    card.innerHTML = `
      <div class="pass-header">
        <h3>${pass.visitorName}</h3>
        <span class="pass-status status-${pass.status}">${pass.status}</span>
      </div>
      <div class="pass-details">
        <div class="detail-row">
          <span class="detail-label">Pass ID:</span>
          <span class="detail-value">${pass.id}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date:</span>
          <span class="detail-value">${formatDate(pass.date)}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Purpose:</span>
          <span class="detail-value">${pass.purpose}</span>
        </div>
      </div>
      <div class="pass-qr">
        <div class="qr-placeholder">${pass.qrCode}</div>
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button class="btn btn-primary btn-sm" onclick="downloadPass('${pass.id}')">Download</button>
        <button class="btn btn-secondary btn-sm" onclick="revokePass('${pass.id}')">Revoke</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterPasses() {
  const searchTerm = document.getElementById('passSearch').value.toLowerCase();
  
  const filtered = mockPasses.filter(pass => 
    pass.visitorName.toLowerCase().includes(searchTerm) ||
    pass.id.toLowerCase().includes(searchTerm) ||
    pass.purpose.toLowerCase().includes(searchTerm)
  );
  
  displayPasses(filtered);
}

function downloadPass(passId) {
  const pass = mockPasses.find(p => p.id === passId);
  if (pass) {
    showNotification(`Pass ${passId} downloaded successfully`, 'success');
    // In a real app, this would generate a PDF
  }
}

function revokePass(passId) {
  const pass = mockPasses.find(p => p.id === passId);
  if (pass) {
    pass.status = 'revoked';
    displayPasses(mockPasses);
    showNotification(`Pass ${passId} has been revoked`, 'success');
  }
}
