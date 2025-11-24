import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../atoms/Input';

export interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    onSubmit?: () => void;
    containerStyle?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Search...',
    onClear,
    onSubmit,
    containerStyle,
}) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, containerStyle]}>
            <Input
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
                leftIcon={<Ionicons name="search" size={20} color={theme.colors.textSecondary} />}
                rightIcon={
                    value ? (
                        <Ionicons
                            name="close-circle"
                            size={20}
                            color={theme.colors.textSecondary}
                            onPress={onClear || (() => onChangeText(''))}
                        />
                    ) : undefined
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
