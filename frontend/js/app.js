// ===== APP STATE =====
const appState = {
  currentUser: null,
  currentRole: null,
  isAuthenticated: false,
  dashboardData: {},
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  const savedUser = localStorage.getItem('currentUser');
  const savedRole = localStorage.getItem('userRole');
  
  if (savedUser && savedRole) {
    try {
      appState.currentUser = JSON.parse(savedUser);
      appState.currentRole = savedRole;
      appState.isAuthenticated = true;
      showDashboard();
    } catch (error) {
      console.error('Error loading saved user:', error);
      showRoleSelection();
    }
  } else {
    showRoleSelection();
  }
}

// ===== ROLE SELECTION =====
function selectRole(role) {
  appState.currentRole = role;
  localStorage.setItem('userRole', role);
  closeModal('roleModal');
  showAuthContainer();
}

function showRoleSelection() {
  document.getElementById('authContainer').classList.add('hidden');
  document.getElementById('dashboardContainer').classList.add('hidden');
  document.getElementById('roleModal').classList.remove('hidden');
}

// ===== AUTHENTICATION FLOW =====
function showAuthContainer() {
  document.getElementById('roleModal').classList.add('hidden');
  document.getElementById('authContainer').classList.remove('hidden');
  document.getElementById('dashboardContainer').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('roleModal').classList.add('hidden');
  document.getElementById('authContainer').classList.add('hidden');
  document.getElementById('dashboardContainer').classList.remove('hidden');
  
  // Update navbar greeting
  updateNavbar();
  
  // Update sidebar based on role
  updateSidebar();
  
  // Load dashboard data
  loadDashboardData();
  
  // Show appropriate dashboard view
  navigateTo('dashboard');
}

// ===== NAVBAR & SIDEBAR MANAGEMENT =====
function updateNavbar() {
  const userGreeting = document.getElementById('userGreeting');
  if (appState.currentUser) {
    userGreeting.textContent = `Welcome, ${appState.currentUser.name}`;
  }
}

function updateSidebar() {
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    const role = item.getAttribute('data-role');
    if (role === 'all' || role === appState.currentRole) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Update nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.textContent.includes('Scan QR')) {
      link.style.display = appState.currentRole === 'security' ? 'block' : 'none';
    } else if (link.textContent.includes('Visitors') || link.textContent.includes('Passes') || link.textContent.includes('Requests') || link.textContent.includes('Tracking')) {
      link.style.display = appState.currentRole === 'admin' ? 'block' : 'none';
    }
  });
}

// ===== NAVIGATION =====
function navigateTo(view) {
  // Hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  
  // Show selected view
  const viewElement = document.getElementById(view + 'View');
  if (viewElement) {
    viewElement.classList.add('active');
  }
  
  // Update active menu item
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });
  document.querySelectorAll('.menu-item').forEach(item => {
    if (item.onclick && item.onclick.toString().includes(view)) {
      item.classList.add('active');
    }
  });
  
  // Update nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Load view-specific data
  if (view === 'requests') {
    loadRequests();
  } else if (view === 'visitors') {
    loadVisitors();
  } else if (view === 'passes') {
    loadPasses();
  } else if (view === 'tracking') {
    loadTracking();
  } else if (view === 'history') {
    loadVisitHistory();
  }
}

// ===== MODAL MANAGEMENT =====
function openNewRequestModal() {
  const modal = document.getElementById('requestModal');
  modal.classList.add('active');
  modal.classList.remove('hidden');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  modal.classList.add('hidden');
}

document.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
    event.target.classList.add('hidden');
  }
});

// ===== LOGOUT =====
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    appState.currentUser = null;
    appState.currentRole = null;
    appState.isAuthenticated = false;
    showRoleSelection();
    showNotification('Logged out successfully', 'success');
  }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

function generatePassCode() {
  return 'PASS' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function generateQRCode(text) {
  // In a real app, you would use a QR code library like qrcode.js
  // For now, we'll create a placeholder
  return `<div style="width:150px;height:150px;background:#333;border:1px solid #666;display:flex;align-items:center;justify-content:center;font-size:12px;">${text}</div>`;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// ===== DASHBOARD DATA =====
function loadDashboardData() {
  if (appState.currentRole === 'admin') {
    document.getElementById('adminDashboard').classList.remove('hidden');
    document.getElementById('securityDashboard').classList.add('hidden');
    document.getElementById('visitorDashboard').classList.add('hidden');
    document.getElementById('btnNewRequest').style.display = 'inline-block';
    document.getElementById('actionApproveRequest').style.display = 'inline-block';
    document.getElementById('actionNewVisitor').style.display = 'none';
    document.getElementById('actionScanQR').style.display = 'none';
    
    // Load admin stats
    updateAdminStats();
  } else if (appState.currentRole === 'security') {
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('securityDashboard').classList.remove('hidden');
    document.getElementById('visitorDashboard').classList.add('hidden');
    document.getElementById('btnNewRequest').style.display = 'none';
    document.getElementById('actionApproveRequest').style.display = 'none';
    document.getElementById('actionNewVisitor').style.display = 'none';
    document.getElementById('actionScanQR').style.display = 'inline-block';
    
    // Load security stats
    updateSecurityStats();
  } else if (appState.currentRole === 'visitor') {
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('securityDashboard').classList.add('hidden');
    document.getElementById('visitorDashboard').classList.remove('hidden');
    document.getElementById('btnNewRequest').style.display = 'none';
    document.getElementById('actionApproveRequest').style.display = 'none';
    document.getElementById('actionNewVisitor').style.display = 'inline-block';
    document.getElementById('actionScanQR').style.display = 'none';
    
    // Load visitor stats
    updateVisitorStats();
  }
}

function updateAdminStats() {
  // Simulate data fetch
  document.getElementById('totalVisitors').textContent = Math.floor(Math.random() * 1000) + 100;
  document.getElementById('pendingRequests').textContent = Math.floor(Math.random() * 50) + 5;
  document.getElementById('activePasses').textContent = Math.floor(Math.random() * 100) + 20;
  document.getElementById('todayCheckIns').textContent = Math.floor(Math.random() * 30) + 5;
}

function updateSecurityStats() {
  document.getElementById('checkedInToday').textContent = Math.floor(Math.random() * 50) + 10;
  document.getElementById('pendingVerifications').textContent = Math.floor(Math.random() * 10) + 2;
  document.getElementById('activePremises').textContent = Math.floor(Math.random() * 20) + 5;
}

function updateVisitorStats() {
  document.getElementById('myRequests').textContent = Math.floor(Math.random() * 10) + 1;
  document.getElementById('myApprovedPasses').textContent = Math.floor(Math.random() * 5) + 1;
  document.getElementById('totalVisits').textContent = Math.floor(Math.random() * 20) + 2;
}
