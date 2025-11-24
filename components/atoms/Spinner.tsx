import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type SpinnerSize = 'small' | 'large';

export interface SpinnerProps {
    size?: SpinnerSize;
    color?: string;
    text?: string;
    fullScreen?: boolean;
    style?: ViewStyle;
}

export const Spinner: React.FC<SpinnerProps> = ({
    size = 'small',
    color,
    text,
    fullScreen = false,
    style,
}) => {
    const { theme } = useTheme();

    const spinnerColor = color || theme.colors.primary;

    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, { backgroundColor: theme.colors.backdrop }]}>
                <View
                    style={[
                        styles.fullScreenContent,
                        {
                            backgroundColor: theme.colors.card,
                            borderRadius: theme.radius.lg,
                            padding: theme.spacing.xl,
                        },
                    ]}
                >
                    <ActivityIndicator size={size} color={spinnerColor} />
                    {text && (
                        <Text size="md" style={{ marginTop: theme.spacing.md }}>
                            {text}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={spinnerColor} />
            {text && (
                <Text size="sm" color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.sm }}>
                    {text}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    fullScreenContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
