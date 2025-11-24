import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface RadioProps {
    selected: boolean;
    onSelect: () => void;
    disabled?: boolean;
    color?: string;
    size?: number;
    style?: ViewStyle;
}

export const Radio: React.FC<RadioProps> = ({
    selected,
    onSelect,
    disabled = false,
    color,
    size = 24,
    style,
}) => {
    const { theme } = useTheme();

    const radioColor = color || theme.colors.primary;

    return (
        <TouchableOpacity
            onPress={() => !disabled && onSelect()}
            disabled={disabled}
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 2,
                    borderColor: selected ? radioColor : theme.colors.border,
                },
                disabled && { opacity: 0.5 },
                style,
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            {selected && (
                <View
                    style={[
                        styles.dot,
                        {
                            width: size * 0.5,
                            height: size * 0.5,
                            borderRadius: size / 4,
                            backgroundColor: radioColor,
                        },
                    ]}
                />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {},
});
