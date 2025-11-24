import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Text } from '../atoms/Text';

export interface ListItemProps {
    title: string;
    subtitle?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onPress?: () => void;
    disabled?: boolean;
    style?: ViewStyle;
}

export const ListItem: React.FC<ListItemProps> = ({
    title,
    subtitle,
    leftIcon,
    rightIcon,
    onPress,
    disabled = false,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            onPress={onPress}
            disabled={disabled || !onPress}
            style={[
                styles.container,
                {
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.md,
                    minHeight: isMobile ? 56 : 48,
                },
                disabled && { opacity: 0.5 },
                style,
            ]}
            activeOpacity={0.7}
        >
            {leftIcon && <View style={[styles.iconLeft, { marginRight: theme.spacing.md }]}>{leftIcon}</View>}
            <View style={styles.content}>
                <Text size="md" semibold color={theme.colors.text} numberOfLines={1}>
                    {title}
                </Text>
                {subtitle && (
                    <Text
                        size="sm"
                        color={theme.colors.textSecondary}
                        numberOfLines={1}
                        style={{ marginTop: theme.spacing.xs }}
                    >
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightIcon && <View style={[styles.iconRight, { marginLeft: theme.spacing.md }]}>{rightIcon}</View>}
        </Component>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    content: {
        flex: 1,
    },
    iconLeft: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconRight: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
