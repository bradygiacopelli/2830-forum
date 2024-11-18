export const loginUser = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token); // Store the JWT token
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
};