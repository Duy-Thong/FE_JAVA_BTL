import jwtDecode from 'jwt-decode';

export const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        return { 
          isAuthenticated: true, 
          role: decodedToken.role,
          userId: userData.id 
        };
      } catch (error) {
        return { isAuthenticated: false, role: null, userId: null };
      }
    }
  }
  return { isAuthenticated: false, role: null, userId: null };
};

export const requireAuth = (allowedRoles: string[]) => {
  const { isAuthenticated } = checkAuth();
  return isAuthenticated;
};
