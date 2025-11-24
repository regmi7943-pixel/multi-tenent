import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Text } from './Text';

export type TagVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral';

export interface TagProps {
    variant?: TagVariant;
    label: string;
    onPress?: () => void;
    onRemove?: () => void;
    style?: ViewStyle;
}

export const Tag: React.FC<TagProps> = ({
    variant = 'neutral',
    label,
    onPress,
    onRemove,
    style,
}) => {
    const { theme } = useTheme();

    const variantColors: Record<TagVariant, { bg: string; text: string }> = {
        primary: { bg: `${theme.colors.primary}20`, text: theme.colors.primary },
        secondary: { bg: `${theme.colors.secondary}20`, text: theme.colors.secondary },
        success: { bg: `${theme.colors.success}20`, text: theme.colors.success },
        warning: { bg: `${theme.colors.warning}20`, text: theme.colors.warning },
        error: { bg: `${theme.colors.error}20`, text: theme.colors.error },
        neutral: { bg: theme.colors.surface, text: theme.colors.text },
    };

    const colors = variantColors[variant];

    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            onPress={onPress}
            style={[
                styles.tag,
                {
                    backgroundColor: colors.bg,
                    borderRadius: theme.radius.full,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.xs,
                },
                style,
            ]}
        >
            <Text
                size="sm"
                medium
                style={{
                    color: colors.text,
                }}
            >
                {label}
            </Text>
            {onRemove && (
                <TouchableOpacity
                    onPress={onRemove}
                    style={[styles.removeButton, { marginLeft: theme.spacing.xs }]}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text
                        size="sm"
                        bold
                        style={{
                            color: colors.text,
                        }}
                    >
                        ×
                    </Text>
                </TouchableOpacity>
            )}
        </Component>
    );
};

const styles = StyleSheet.create({
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    removeButton: {
        marginLeft: 4,
    },
});
