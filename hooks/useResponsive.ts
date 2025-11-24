import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { breakpoints } from '../theme';

export type ScreenSize = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveValues {
    width: number;
    height: number;
    screenSize: ScreenSize;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

export const useResponsive = (): ResponsiveValues => {
    const [dimensions, setDimensions] = useState(() => {
        const { width, height } = Dimensions.get('window');
        return { width, height };
    });

    useEffect(() => {
        const onChange = ({ window }: { window: ScaledSize }) => {
            setDimensions({ width: window.width, height: window.height });
        };

        const subscription = Dimensions.addEventListener('change', onChange);

        return () => subscription?.remove();
    }, []);

    const getScreenSize = (width: number): ScreenSize => {
        if (width < breakpoints.mobile) return 'mobile';
        if (width < breakpoints.tablet) return 'tablet';
        return 'desktop';
    };

    const screenSize = getScreenSize(dimensions.width);

    return {
        ...dimensions,
        screenSize,
        isMobile: screenSize === 'mobile',
        isTablet: screenSize === 'tablet',
        isDesktop: screenSize === 'desktop',
    };
};

// Hook for responsive values based on screen size
export const useResponsiveValue = <T,>(values: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    default: T;
}): T => {
    const { screenSize } = useResponsive();

    if (screenSize === 'desktop' && values.desktop !== undefined) {
        return values.desktop;
    }
    if (screenSize === 'tablet' && values.tablet !== undefined) {
        return values.tablet;
    }
    if (screenSize === 'mobile' && values.mobile !== undefined) {
        return values.mobile;
    }
    return values.default;
};
