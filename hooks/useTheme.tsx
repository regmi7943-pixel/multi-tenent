import React, { ReactNode, createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, darkTheme, lightTheme } from '../theme';

// Tenant configuration interface
export interface TenantConfig {
    id: string;
    name: string;
    logo?: string;
    colors?: Partial<Theme['colors']>;
    customTheme?: Partial<Theme>;
}

interface ThemeContextType {
    theme: Theme;
    isDark: boolean;
    toggleTheme: () => void;
    currentTenant: TenantConfig | null;
    setTenant: (tenant: TenantConfig | null) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTenant?: TenantConfig;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTenant = null
}) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
    const [currentTenant, setCurrentTenant] = useState<TenantConfig | null>(defaultTenant);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const setTenant = (tenant: TenantConfig | null) => {
        setCurrentTenant(tenant);
    };

    // Merge tenant theme with base theme
    const getTheme = (): Theme => {
        const baseTheme = isDark ? darkTheme : lightTheme;

        if (!currentTenant) return baseTheme;

        // Merge tenant colors
        if (currentTenant.colors) {
            return {
                ...baseTheme,
                colors: {
                    ...baseTheme.colors,
                    ...currentTenant.colors,
                },
            };
        }

        // Merge custom theme
        if (currentTenant.customTheme) {
            return {
                ...baseTheme,
                ...currentTenant.customTheme,
                colors: {
                    ...baseTheme.colors,
                    ...currentTenant.customTheme.colors,
                },
            };
        }

        return baseTheme;
    };

    const theme = getTheme();

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDark,
                toggleTheme,
                currentTenant,
                setTenant,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
