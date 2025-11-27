import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface EyeIconProps {
    visible: boolean;
    onPress: () => void;
    size?: number;
}

export const EyeIcon: React.FC<EyeIconProps> = ({ visible, onPress, size = 20 }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
            <Ionicons
                name={visible ? 'eye-outline' : 'eye-off-outline'}
                size={size}
                color={theme.colors.textSecondary}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 4,
    },
});
