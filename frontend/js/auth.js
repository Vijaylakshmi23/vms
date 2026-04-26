// ===== AUTHENTICATION FUNCTIONS =====

function toggleAuthForm(formName) {
  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  
  document.getElementById(formName + 'Form').classList.add('active');
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  // Validate inputs
  if (!email || !password) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Simulate API call
  try {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      role: appState.currentRole,
      phone: '+91 XXXXXXXXXX',
      loginTime: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', appState.currentRole);
    
    appState.currentUser = user;
    appState.isAuthenticated = true;
    
    showNotification('Login successful!', 'success');
    
    // Clear form
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    
    // Show dashboard
    setTimeout(() => {
      showDashboard();
    }, 500);
    
  } catch (error) {
    console.error('Login error:', error);
    showNotification('Login failed. Please try again.', 'error');
  }
}

function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const phone = document.getElementById('signupPhone').value;
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  
  // Validate inputs
  if (!name || !email || !phone || !password || !confirmPassword) {
    showNotification('Please fill in all fields', 'error');
    return;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }
  
  // Validate phone format
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    showNotification('Please enter a valid phone number', 'error');
    return;
  }
  
  // Validate password length
  if (password.length < 6) {
    showNotification('Password must be at least 6 characters long', 'error');
    return;
  }
  
  // Validate password match
  if (password !== confirmPassword) {
    showNotification('Passwords do not match', 'error');
    return;
  }
  
  try {
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      phone: phone,
      role: appState.currentRole,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userRole', appState.currentRole);
    
    appState.currentUser = user;
    appState.isAuthenticated = true;
    
    showNotification('Account created successfully!', 'success');
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupEmail').value = '';
    document.getElementById('signupPhone').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
    
    // Show dashboard
    setTimeout(() => {
      showDashboard();
    }, 500);
    
  } catch (error) {
    console.error('Signup error:', error);
    showNotification('Signup failed. Please try again.', 'error');
  }
}
