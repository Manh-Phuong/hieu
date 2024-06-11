import React, { createContext } from 'react';
import { useMediaQuery } from 'react-responsive';

export const ResponsiveContext = createContext({});

export const ResponsiveContextProvider = ({ children }) => {
    const isPC = useMediaQuery({ query: '(min-width: 64em)' });
    const isTablet = useMediaQuery({ query: '(max-width: 63.9375em) and (min-width: 46.25em)' });
    const isMobile = useMediaQuery({ query: '(max-width: 46.1875em)' });

    const value = {
        isPC,
        isTablet,
        isMobile,
    };

    return <ResponsiveContext.Provider value={value}>{children}</ResponsiveContext.Provider>;
};
