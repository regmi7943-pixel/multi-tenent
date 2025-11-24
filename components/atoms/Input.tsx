import React, { useState } from 'react';
import {
    Platform,
    StyleSheet,
    TextInput,
    TextInputProps,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';

export interface InputProps extends TextInputProps {
    error?: boolean;
    disabled?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
    error = false,
    disabled = false,
    leftIcon,
    rightIcon,
    containerStyle,
    inputStyle,
    ...props
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const [isFocused, setIsFocused] = useState(false);

    const getBorderColor = () => {
        if (error) return theme.colors.error;
        if (isFocused) return theme.colors.primary;
        return theme.colors.border;
    };

    return (
        <View
            style={[
                styles.container,
                {
                    borderWidth: 1,
                    borderColor: getBorderColor(),
                    borderRadius: theme.radius.md,
                    backgroundColor: disabled ? theme.colors.disabled : theme.colors.surface,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: isMobile ? theme.spacing.sm : theme.spacing.xs,
                    minHeight: isMobile ? 48 : 40, // Better touch target on mobile
                },
                disabled && { opacity: 0.6 },
                containerStyle,
            ]}
        >
            {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}
            <TextInput
                {...props}
                editable={!disabled}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                style={[
                    styles.input,
                    {
                        fontSize: theme.fontSize.md,
                        color: theme.colors.text,
                    },
                    inputStyle,
                ]}
                placeholderTextColor={theme.colors.textSecondary}
            />
            {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    input: {
        flex: 1,
        paddingVertical: 0,
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            } as any,
        }),
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});
