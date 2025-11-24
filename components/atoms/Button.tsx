import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled = false,
    children,
    style,
    textStyle,
    ...props
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const sizeConfig = {
        sm: {
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            fontSize: theme.fontSize.sm,
        },
        md: {
            paddingVertical: theme.spacing.md,
            paddingHorizontal: theme.spacing.lg,
            fontSize: theme.fontSize.md,
        },
        lg: {
            paddingVertical: theme.spacing.lg,
            paddingHorizontal: theme.spacing.xl,
            fontSize: theme.fontSize.lg,
        },
    };

    const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle }> = {
        primary: {
            container: {
                backgroundColor: theme.colors.primary,
            },
            text: {
                color: '#ffffff',
            },
        },
        secondary: {
            container: {
                backgroundColor: theme.colors.secondary,
            },
            text: {
                color: '#ffffff',
            },
        },
        outline: {
            container: {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: theme.colors.primary,
            },
            text: {
                color: theme.colors.primary,
            },
        },
        ghost: {
            container: {
                backgroundColor: 'transparent',
            },
            text: {
                color: theme.colors.primary,
            },
        },
        danger: {
            container: {
                backgroundColor: theme.colors.error,
            },
            text: {
                color: '#ffffff',
            },
        },
    };

    const config = sizeConfig[size];
    const variantStyle = variantStyles[variant];
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            {...props}
            disabled={isDisabled}
            style={[
                styles.base,
                {
                    paddingVertical: config.paddingVertical,
                    paddingHorizontal: config.paddingHorizontal,
                    borderRadius: theme.radius.md,
                    ...theme.shadows.sm,
                },
                variantStyle.container,
                fullWidth && styles.fullWidth,
                isDisabled && {
                    backgroundColor: theme.colors.disabled,
                    opacity: 0.6,
                },
                isMobile && { minHeight: 48 }, // Better touch target on mobile
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variantStyle.text.color} size="small" />
            ) : (
                <Text
                    style={[
                        {
                            fontSize: config.fontSize,
                            fontWeight: theme.fontWeight.semibold,
                            textAlign: 'center',
                        },
                        variantStyle.text,
                        textStyle,
                    ]}
                >
                    {children}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    fullWidth: {
        width: '100%',
    },
});
