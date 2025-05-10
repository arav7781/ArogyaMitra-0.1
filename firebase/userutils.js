export const initializeUsers = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.length === 0) {
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'patient@example.com', role: 'patient' },
        { _id: '2', name: 'Dr. Brown', email: 'doctor@example.com', role: 'doctor' },
      ];
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  };
  
  export const getUsers = () => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  };
  
  export const findUserByRole = (role) => {
    return getUsers().find(u => u.role === role);
  };