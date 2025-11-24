import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    color?: string;
    size?: number;
    style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    checked,
    onChange,
    disabled = false,
    color,
    size = 24,
    style,
}) => {
    const { theme } = useTheme();

    const checkColor = color || theme.colors.primary;

    return (
        <TouchableOpacity
            onPress={() => !disabled && onChange(!checked)}
            disabled={disabled}
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: theme.radius.sm,
                    borderWidth: 2,
                    borderColor: checked ? checkColor : theme.colors.border,
                    backgroundColor: checked ? checkColor : 'transparent',
                },
                disabled && { opacity: 0.5 },
                style,
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            {checked && (
                <View style={styles.checkmark}>
                    <View
                        style={[
                            styles.checkmarkLine,
                            {
                                width: size * 0.2,
                                height: size * 0.4,
                                borderColor: '#ffffff',
                                borderRightWidth: 2,
                                borderBottomWidth: 2,
                            },
                        ]}
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmark: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkLine: {
        transform: [{ rotate: '45deg' }, { translateY: -1 }],
    },
});
