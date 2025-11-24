import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type ProgressBarVariant = 'primary' | 'success' | 'error' | 'warning' | 'info';

export interface ProgressBarProps {
    progress: number; // 0-100
    variant?: ProgressBarVariant;
    showLabel?: boolean;
    height?: number;
    style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    variant = 'primary',
    showLabel = false,
    height = 8,
    style,
}) => {
    const { theme } = useTheme();

    const variantColors: Record<ProgressBarVariant, string> = {
        primary: theme.colors.primary,
        success: theme.colors.success,
        error: theme.colors.error,
        warning: theme.colors.warning,
        info: theme.colors.info,
    };

    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={[styles.container, style]}>
            <View
                style={[
                    styles.track,
                    {
                        height,
                        backgroundColor: theme.colors.border,
                        borderRadius: height / 2,
                    },
                ]}
            >
                <View
                    style={[
                        styles.fill,
                        {
                            width: `${clampedProgress}%`,
                            height,
                            backgroundColor: variantColors[variant],
                            borderRadius: height / 2,
                        },
                    ]}
                />
            </View>
            {showLabel && (
                <Text
                    size="sm"
                    style={{
                        marginTop: theme.spacing.xs,
                        color: theme.colors.textSecondary,
                    }}
                >
                    {clampedProgress}%
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    track: {
        width: '100%',
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
    },
});
