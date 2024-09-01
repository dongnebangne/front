import React, { createContext, useState } from 'react';

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [clickedAddress, setClickedAddress] = useState('');

    return (
        <AddressContext.Provider value={{ clickedAddress, setClickedAddress }}>
            {children}
        </AddressContext.Provider>
    );
};
