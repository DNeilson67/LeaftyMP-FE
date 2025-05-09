import Cookies from 'js-cookie';
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../App';

// ✅ Define the context
const AuthContext = createContext({
  user: {
    UserID: '',
    RoleID: '',
    Username: '',
    Email: '',
  },
  setUser: () => { },
  updateUserField: () => { },
});

// ✅ Provider component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    UserID: '',
    RoleID: '',
    Username: '',
    Email: '',
  });

  const [loading, setLoading] = useState(true);

  const handleWhoAmI = async () => {
    try {
      const response = await axios.get(API_URL + "/whoami");
      if (response.data) {
        setUser(response.data);
        // console.log("✅ User loaded");
        // console.log(response.data)
      } else {
        // console.warn("⚠️ No user data found");
        setUser(null);
      }
    } catch (error) {
      // console.error("❌ Failed to fetch user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  async function handleLogout() {
    setLoading(true);
    try {
      await axios.delete(API_URL + "/delete_session")
      setUser(null);
      setLoading(false);
    } catch (error) {
      setUser(null);
      setLoading(false);
    }
  }

  useEffect(() => {
    handleWhoAmI();
  }, []);

  const updateUserField = (key, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [key]: value,
    }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, updateUserField, handleWhoAmI, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider };
