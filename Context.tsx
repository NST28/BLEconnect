import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataContextProvider = ({ children}) => {
    const [liveData, setLiveData] = useState([]);

    return (
        <DataContext.Provider value={{ liveData, setLiveData }}>
          {children}
        </DataContext.Provider>
      );
}