import React, { createContext, useState, useContext } from 'react';

// ✅ Define the context with default values
const AuthRegisterContext = createContext({
  user: {
    Username: '',
    EmailAddress: '',
    PhoneNumber: '',
    Password: '',
    AddressDetails: '',
    Latitude: null,
    Longitude: null,
  },
  setUser: () => {},
  updateUserField: () => {},
  otp: false,
  setOtp: () => {},
  reg: false,
  setReg: () => {},
});

// ✅ Provider component
const AuthRegisterProvider = ({ children }) => {
  const [user, setUser] = useState({
    Username: '',
    Email: '',
    PhoneNumber: '',
    Password: '',
    AddressDetails: '',
    Latitude: null,
    Longitude: null,
  });

  const [otpAllowed, setOtpAllowed] = useState(false);
  const [regAllowed, setRegAllowed] = useState(false);

  const updateUserField = (key, value) => {
    setUser((prevUser) => ({
      ...prevUser,
      [key]: value,
    }));
  };

  return (
    <AuthRegisterContext.Provider value={{ user, setUser, updateUserField, otpAllowed, setOtpAllowed, regAllowed, setRegAllowed }}>
      {children}
    </AuthRegisterContext.Provider>
  );
};

// ✅ Custom hook to use the context
export function useAuthRegister() {
  return useContext(AuthRegisterContext);
}

export { AuthRegisterContext, AuthRegisterProvider };
