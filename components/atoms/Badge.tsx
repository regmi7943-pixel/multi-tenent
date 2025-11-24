import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
    variant?: BadgeVariant;
    size?: BadgeSize;
    value?: string | number;
    dot?: boolean;
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'primary',
    size = 'md',
    value,
    dot = false,
    style,
}) => {
    const { theme } = useTheme();

    const sizeConfig = {
        sm: { dimension: 6, padding: 4, fontSize: theme.fontSize.xs },
        md: { dimension: 8, padding: 6, fontSize: theme.fontSize.sm },
        lg: { dimension: 10, padding: 8, fontSize: theme.fontSize.md },
    };

    const variantColors: Record<BadgeVariant, string> = {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
        info: theme.colors.info,
    };

    const config = sizeConfig[size];
    const bgColor = variantColors[variant];

    if (dot) {
        return (
            <View
                style={[
                    styles.dot,
                    {
                        width: config.dimension,
                        height: config.dimension,
                        borderRadius: config.dimension / 2,
                        backgroundColor: bgColor,
                    },
                    style,
                ]}
            />
        );
    }

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: bgColor,
                    paddingHorizontal: config.padding,
                    paddingVertical: config.padding / 2,
                    borderRadius: theme.radius.full,
                },
                style,
            ]}
        >
            <Text
                size="xs"
                bold
                style={{
                    fontSize: config.fontSize,
                    color: '#ffffff',
                }}
            >
                {value}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 20,
    },
    dot: {},
});
