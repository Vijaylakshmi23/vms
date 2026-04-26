// ===== QR CODE SCANNING =====

function startCamera() {
  const placeholder = document.getElementById('cameraPlaceholder');
  placeholder.innerHTML = `
    <div class="camera-placeholder">
      <div class="camera-icon">📷</div>
      <p>Camera is running</p>
      <button class="btn btn-secondary" onclick="stopCamera()">Stop Camera</button>
    </div>
  `;
  showNotification('Camera started', 'success');
}

function stopCamera() {
  const placeholder = document.getElementById('cameraPlaceholder');
  placeholder.innerHTML = `
    <div class="camera-placeholder">
      <div class="camera-icon">📷</div>
      <p>Camera feed will appear here</p>
      <button class="btn btn-primary" onclick="startCamera()">Start Camera</button>
    </div>
  `;
  showNotification('Camera stopped', 'info');
}

function verifyPassCode() {
  const passCode = document.getElementById('manualPassCode').value;
  
  if (!passCode) {
    showNotification('Please enter a pass code or scan a QR code', 'error');
    return;
  }
  
  // Simulate pass verification
  const pass = mockPasses.find(p => p.id === passCode || p.qrCode === passCode);
  const verificationResult = document.getElementById('verificationResult');
  
  if (pass) {
    verificationResult.className = 'verification-box verification-success';
    verificationResult.innerHTML = `
      <div>
        <h3 style="color: var(--success-color); margin-bottom: 1rem;">✓ Valid Pass</h3>
        <div class="detail-row" style="justify-content: flex-start; gap: 1rem;">
          <div>
            <p style="color: var(--light-text); margin-bottom: 0.5rem;">Visitor:</p>
            <p style="color: var(--primary-color); font-weight: 600;">${pass.visitorName}</p>
          </div>
          <div>
            <p style="color: var(--light-text); margin-bottom: 0.5rem;">Purpose:</p>
            <p style="color: var(--primary-color); font-weight: 600;">${pass.purpose}</p>
          </div>
        </div>
        <div style="margin-top: 1rem;">
          <button class="btn btn-success" onclick="checkInVisitor('${pass.id}')">Check-in</button>
          <button class="btn btn-secondary" onclick="checkOutVisitor('${pass.id}')">Check-out</button>
        </div>
      </div>
    `;
    showNotification('Pass verified successfully', 'success');
  } else {
    verificationResult.className = 'verification-box verification-error';
    verificationResult.innerHTML = `
      <div>
        <h3 style="color: var(--danger-color); margin-bottom: 1rem;">✗ Invalid Pass</h3>
        <p style="color: var(--light-text);">No matching visit request found for this code.</p>
        <p style="color: var(--light-text); margin-top: 1rem; font-size: 0.9rem;">Pass Code: ${passCode}</p>
      </div>
    `;
    showNotification('Invalid pass code', 'error');
  }
  
  // Clear input
  document.getElementById('manualPassCode').value = '';
}

function checkInVisitor(passId) {
  const pass = mockPasses.find(p => p.id === passId);
  if (pass) {
    const trackingRecord = {
      id: mockTracking.length + 1,
      visitorName: pass.visitorName,
      passId: pass.id,
      type: 'checkin',
      time: new Date().toLocaleString('en-US'),
      duration: '0 minutes'
    };
    mockTracking.push(trackingRecord);
    showNotification(`${pass.visitorName} checked in successfully`, 'success');
  }
}

function checkOutVisitor(passId) {
  const pass = mockPasses.find(p => p.id === passId);
  if (pass) {
    const trackingRecord = {
      id: mockTracking.length + 1,
      visitorName: pass.visitorName,
      passId: pass.id,
      type: 'checkout',
      time: new Date().toLocaleString('en-US'),
      duration: '2 hours 30 minutes'
    };
    mockTracking.push(trackingRecord);
    showNotification(`${pass.visitorName} checked out successfully`, 'success');
  }
}
