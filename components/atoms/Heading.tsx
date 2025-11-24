import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface HeadingProps extends RNTextProps {
    level?: HeadingLevel;
    color?: string;
    center?: boolean;
    style?: TextStyle | TextStyle[];
}

export const Heading: React.FC<HeadingProps> = ({
    level = 'h1',
    color,
    center = false,
    style,
    ...props
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const headingStyles: Record<HeadingLevel, TextStyle> = {
        h1: {
            fontSize: isMobile ? theme.fontSize.xxxl * 0.85 : theme.fontSize.xxxl,
            fontWeight: theme.fontWeight.bold,
            lineHeight: isMobile ? 38 : 44,
        },
        h2: {
            fontSize: isMobile ? theme.fontSize.xxl * 0.9 : theme.fontSize.xxl,
            fontWeight: theme.fontWeight.bold,
            lineHeight: isMobile ? 30 : 34,
        },
        h3: {
            fontSize: isMobile ? theme.fontSize.xl : theme.fontSize.xl,
            fontWeight: theme.fontWeight.semibold,
            lineHeight: isMobile ? 26 : 28,
        },
        h4: {
            fontSize: theme.fontSize.lg,
            fontWeight: theme.fontWeight.semibold,
            lineHeight: 24,
        },
        h5: {
            fontSize: theme.fontSize.md,
            fontWeight: theme.fontWeight.semibold,
            lineHeight: 22,
        },
        h6: {
            fontSize: theme.fontSize.sm,
            fontWeight: theme.fontWeight.semibold,
            lineHeight: 20,
        },
    };

    return (
        <RNText
            {...props}
            accessibilityRole="header"
            style={[
                {
                    color: color || theme.colors.text,
                },
                headingStyles[level],
                center && { textAlign: 'center' },
                style,
            ]}
        />
    );
};
