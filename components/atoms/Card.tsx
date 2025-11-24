import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface CardProps {
    children: React.ReactNode;
    elevated?: boolean;
    bordered?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({
    children,
    elevated = true,
    bordered = false,
    padding = 'md',
    style,
    onPress,
}) => {
    const { theme } = useTheme();

    const paddingConfig = {
        none: 0,
        sm: theme.spacing.sm,
        md: theme.spacing.md,
        lg: theme.spacing.lg,
    };

    const cardStyle = [
        styles.card,
        {
            backgroundColor: theme.colors.card,
            borderRadius: theme.radius.lg,
            padding: paddingConfig[padding],
        },
        elevated && theme.shadows.md,
        bordered && {
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        style,
    ];

    if (onPress) {
        return (
            <Pressable onPress={onPress} style={cardStyle}>
                {children}
            </Pressable>
        );
    }

    return (
        <View style={cardStyle}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
    },
});
