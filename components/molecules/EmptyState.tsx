import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Button } from '../atoms/Button';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'file-tray-outline',
    title,
    description,
    actionLabel,
    onAction,
    style,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { padding: theme.spacing.xl }, style]}>
            <Ionicons
                name={icon}
                size={64}
                color={theme.colors.textSecondary}
                style={{ marginBottom: theme.spacing.md }}
            />
            <Heading level="h3" style={{ textAlign: 'center', marginBottom: theme.spacing.sm }}>
                {title}
            </Heading>
            {description && (
                <Text
                    style={{
                        textAlign: 'center',
                        color: theme.colors.textSecondary,
                        marginBottom: theme.spacing.lg,
                        maxWidth: 400,
                    }}
                >
                    {description}
                </Text>
            )}
            {actionLabel && onAction && (
                <Button variant="primary" onPress={onAction}>
                    {actionLabel}
                </Button>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
});
