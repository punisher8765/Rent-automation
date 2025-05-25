// Simulate password hashing (in a real app, use a library like bcrypt)
const simulatePasswordHash = (password) => `hashed_${password}`;

// --- User Management ---
const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// --- Auth Service ---

export const signup = async (userData) => {
  const users = getUsers();
  const existingUser = users.find(user => user.email === userData.email);

  if (existingUser) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = simulatePasswordHash(userData.password);
  const newUser = {
    id: Date.now().toString(), // Simple ID generation
    name: userData.name,
    email: userData.email,
    password: hashedPassword, // Store hashed password
    userType: userData.userType,
  };

  users.push(newUser);
  saveUsers(users);

  // Simulate JWT token generation
  const dummyToken = `dummy_jwt_token_for_${newUser.id}`;
  localStorage.setItem('authToken', dummyToken);
  localStorage.setItem('currentUser', JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email, userType: newUser.userType }));


  return {
    user: { id: newUser.id, name: newUser.name, email: newUser.email, userType: newUser.userType },
    token: dummyToken,
  };
};

export const login = async (credentials) => {
  const users = getUsers();
  const user = users.find(u => u.email === credentials.email);

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  // Simulate password verification
  const isPasswordValid = user.password === simulatePasswordHash(credentials.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password.');
  }

  // Simulate JWT token generation/retrieval
  const dummyToken = `dummy_jwt_token_for_${user.id}`; // Or retrieve an existing one if implementing token expiry
  localStorage.setItem('authToken', dummyToken);
  localStorage.setItem('currentUser', JSON.stringify({ id: user.id, name: user.name, email: user.email, userType: user.userType }));


  return {
    user: { id: user.id, name: user.name, email: user.email, userType: user.userType },
    token: dummyToken,
  };
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  // In a real app, you might also want to call a backend endpoint to invalidate the token
};

export const getCurrentUser = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }
  const userString = localStorage.getItem('currentUser');
  return userString ? JSON.parse(userString) : null;
};
