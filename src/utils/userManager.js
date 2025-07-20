// Initial users from the system
const initialUsers = [
  { username: 'user1', password: 'pass1', name: 'Student 1', role: 'student' },
  { username: 'user2', password: 'pass2', name: 'Student 2', role: 'student' },
  { username: 'demo', password: 'demo123', name: 'Demo User', role: 'student' },
  { username: 'admin', password: 'admin123', name: 'Administrator', role: 'admin' }
];

// Webhook URL for notifications
const WEBHOOK_URL = 'https://hook.integrator.boost.space/y1pnl7h8d11o357junp7vabkohkjfo35';

// Function to send webhook notifications
const sendWebhookNotification = (payload) => {
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).catch(error => {
    console.error("Webhook notification failed:", error);
  });
};

// Initialize users from localStorage or use initial set
const initializeUsers = () => {
  const storedUsers = localStorage.getItem('mathUsers');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  } else {
    localStorage.setItem('mathUsers', JSON.stringify(initialUsers));
    return initialUsers;
  }
};

// Get all users
export const getUsers = () => {
  return initializeUsers();
};

// Validate user credentials
export const validateUser = (username, password) => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return { username: user.username, name: user.name, role: user.role };
  }
  return null;
};

// Add a new user
export const addUser = (username, password, name, role = 'student') => {
  const users = getUsers();
  
  // Check if username already exists
  if (users.some(u => u.username === username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  const newUser = { username, password, name: name || username, role };
  const updatedUsers = [...users, newUser];
  localStorage.setItem('mathUsers', JSON.stringify(updatedUsers));
  
  // Send webhook notification
  sendWebhookNotification({
    action: "add",
    username,
    password,
    displayName: name || username,
    role
  });
  
  return { success: true, message: 'User added successfully' };
};

// Remove a user
export const removeUser = (username) => {
  const users = getUsers();
  const updatedUsers = users.filter(u => u.username !== username);
  
  // Don't allow removing all admin users
  const adminCount = updatedUsers.filter(u => u.role === 'admin').length;
  if (adminCount === 0) {
    return { success: false, message: 'Cannot remove the last admin user' };
  }
  
  localStorage.setItem('mathUsers', JSON.stringify(updatedUsers));
  
  // Send webhook notification
  sendWebhookNotification({
    action: "delete",
    username
  });
  
  return { success: true, message: 'User removed successfully' };
};

// Update user details
export const updateUser = (username, updates) => {
  const users = getUsers();
  const index = users.findIndex(u => u.username === username);
  
  if (index === -1) {
    return { success: false, message: 'User not found' };
  }
  
  // Don't allow changing username to one that already exists
  if (updates.username && updates.username !== username && users.some(u => u.username === updates.username)) {
    return { success: false, message: 'Username already exists' };
  }
  
  // Update user
  const updatedUser = { ...users[index], ...updates };
  users[index] = updatedUser;
  localStorage.setItem('mathUsers', JSON.stringify(users));
  
  // Send webhook notification
  sendWebhookNotification({
    action: "edit",
    username: updatedUser.username,
    password: updatedUser.password,
    displayName: updatedUser.name,
    role: updatedUser.role
  });
  
  return { success: true, message: 'User updated successfully' };
};

// Export users to CSV
export const exportUsersToCSV = () => {
  const users = getUsers();
  const csvRows = [];
  
  // Add header row
  csvRows.push(['Username', 'Password', 'Name', 'Role'].join(','));
  
  // Add data rows
  users.forEach(user => {
    csvRows.push([
      user.username,
      user.password,
      user.name,
      user.role
    ].join(','));
  });
  
  return csvRows.join('\n');
};

// Import users from CSV
export const importUsersFromCSV = (csvContent) => {
  try {
    const rows = csvContent.split('\n');
    if (rows.length < 2) {
      return { success: false, message: 'CSV file is empty or invalid' };
    }
    
    // Skip header row and process data
    const newUsers = [];
    for (let i = 1; i < rows.length; i++) {
      if (!rows[i].trim()) continue; // Skip empty rows
      
      const [username, password, name, role] = rows[i].split(',');
      if (username && password) {
        newUsers.push({
          username: username.trim(),
          password: password.trim(),
          name: name ? name.trim() : username.trim(),
          role: role && (role.trim() === 'admin' || role.trim() === 'student') ? role.trim() : 'student'
        });
      }
    }
    
    if (newUsers.length === 0) {
      return { success: false, message: 'No valid users found in CSV' };
    }
    
    // Ensure at least one admin exists
    const hasAdmin = newUsers.some(u => u.role === 'admin');
    if (!hasAdmin) {
      return { success: false, message: 'CSV must include at least one admin user' };
    }
    
    // Get current users for webhook notifications
    const currentUsers = getUsers();
    const usernamesToDelete = currentUsers.map(u => u.username).filter(username => 
      !newUsers.some(newUser => newUser.username === username)
    );
    
    // Store new users
    localStorage.setItem('mathUsers', JSON.stringify(newUsers));
    
    // Send webhook notifications for deleted users
    usernamesToDelete.forEach(username => {
      sendWebhookNotification({
        action: "delete",
        username
      });
    });
    
    // Send webhook notifications for new/updated users
    newUsers.forEach(user => {
      const existingUser = currentUsers.find(u => u.username === user.username);
      if (!existingUser) {
        // New user
        sendWebhookNotification({
          action: "add",
          username: user.username,
          password: user.password,
          displayName: user.name,
          role: user.role
        });
      } else if (
        existingUser.password !== user.password ||
        existingUser.name !== user.name ||
        existingUser.role !== user.role
      ) {
        // Updated user
        sendWebhookNotification({
          action: "edit",
          username: user.username,
          password: user.password,
          displayName: user.name,
          role: user.role
        });
      }
    });
    
    return { success: true, message: `Imported ${newUsers.length} users successfully` };
  } catch (error) {
    return { success: false, message: 'Error importing users: ' + error.message };
  }
};

// Reset to default users
export const resetUsers = () => {
  // Get current users for webhook notifications
  const currentUsers = getUsers();
  
  // Send webhook notifications for all changes
  currentUsers.forEach(user => {
    // Delete all current users that aren't in default set
    if (!initialUsers.some(u => u.username === user.username)) {
      sendWebhookNotification({
        action: "delete",
        username: user.username
      });
    }
  });
  
  // Add or update initial users
  initialUsers.forEach(user => {
    const existingUser = currentUsers.find(u => u.username === user.username);
    if (!existingUser) {
      // New user
      sendWebhookNotification({
        action: "add",
        username: user.username,
        password: user.password,
        displayName: user.name,
        role: user.role
      });
    } else if (
      existingUser.password !== user.password ||
      existingUser.name !== user.name ||
      existingUser.role !== user.role
    ) {
      // Updated user
      sendWebhookNotification({
        action: "edit",
        username: user.username,
        password: user.password,
        displayName: user.name,
        role: user.role
      });
    }
  });
  
  localStorage.setItem('mathUsers', JSON.stringify(initialUsers));
  return { success: true, message: 'Users reset to default' };
};