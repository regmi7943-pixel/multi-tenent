import React from 'react';
import { Text as RNText, TextProps as RNTextProps, TextStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type TextVariant = 'body' | 'caption' | 'label' | 'link';
export type TextSize = 'xs' | 'sm' | 'md' | 'lg';

export interface TextProps extends RNTextProps {
    variant?: TextVariant;
    size?: TextSize;
    color?: string;
    bold?: boolean;
    semibold?: boolean;
    medium?: boolean;
    light?: boolean;
    center?: boolean;
    style?: TextStyle | TextStyle[];
}

export const Text: React.FC<TextProps> = ({
    variant = 'body',
    size = 'md',
    color,
    bold = false,
    semibold = false,
    medium = false,
    light = false,
    center = false,
    style,
    ...props
}) => {
    const { theme } = useTheme();

    const variantStyles: Record<TextVariant, TextStyle> = {
        body: {
            color: theme.colors.text,
        },
        caption: {
            color: theme.colors.textSecondary,
        },
        label: {
            color: theme.colors.text,
            fontWeight: theme.fontWeight.medium,
        },
        link: {
            color: theme.colors.primary,
            textDecorationLine: 'underline',
        },
    };

    const getFontWeight = (): TextStyle['fontWeight'] => {
        if (bold) return theme.fontWeight.bold;
        if (semibold) return theme.fontWeight.semibold;
        if (medium) return theme.fontWeight.medium;
        if (light) return theme.fontWeight.light;
        return theme.fontWeight.regular;
    };

    return (
        <RNText
            {...props}
            style={[
                {
                    fontSize: theme.fontSize[size],
                    fontWeight: getFontWeight(),
                },
                variantStyles[variant],
                color && { color },
                center && { textAlign: 'center' },
                style,
            ]}
        />
    );
};
