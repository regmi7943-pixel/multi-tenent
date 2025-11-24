import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Input, InputProps } from '../atoms/Input';
import { Text } from '../atoms/Text';

export interface FormFieldProps extends Omit<InputProps, 'error'> {
    label?: string;
    error?: string;
    required?: boolean;
    helperText?: string;
    containerStyle?: ViewStyle;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    error,
    required = false,
    helperText,
    containerStyle,
    ...inputProps
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            {label && (
                <View style={[styles.labelContainer, { marginBottom: theme.spacing.xs }]}>
                    <Text size="sm" semibold color={theme.colors.text}>
                        {label}
                    </Text>
                    {required && (
                        <Text size="sm" color={theme.colors.error} style={{ marginLeft: 4 }}>
                            *
                        </Text>
                    )}
                </View>
            )}
            <Input {...inputProps} error={!!error} />
            {error && (
                <Text size="xs" color={theme.colors.error} style={{ marginTop: theme.spacing.xs }}>
                    {error}
                </Text>
            )}
            {helperText && !error && (
                <Text
                    size="xs"
                    color={theme.colors.textSecondary}
                    style={{ marginTop: theme.spacing.xs }}
                >
                    {helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
