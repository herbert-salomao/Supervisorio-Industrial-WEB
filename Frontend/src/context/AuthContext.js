import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuth(token);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/login`, { username, password });
      localStorage.setItem('token', response.data.token);
      setAuth(response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth(null);
    navigate('/login');
  };

  const isAuthenticated = () => !!auth;

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};


AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };


export default AuthContext;
