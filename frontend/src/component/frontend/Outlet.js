import React, { useContext } from "react";

const OutletContext = React.createContext();

export const OutletProvider = ({ children }) => {
  const outlet = useContext(OutletContext);
  return outlet || null;
};

export const Outlet = ({ children }) => {
  const outlet = useContext(OutletContext);
  return outlet ? <OutletProvider>{outlet}</OutletProvider> : children;
};