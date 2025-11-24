import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type DividerOrientation = 'horizontal' | 'vertical';

export interface DividerProps {
    orientation?: DividerOrientation;
    color?: string;
    thickness?: number;
    spacing?: number;
    style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
    orientation = 'horizontal',
    color,
    thickness = 1,
    spacing,
    style,
}) => {
    const { theme } = useTheme();

    const defaultSpacing = spacing || theme.spacing.md;

    return (
        <View
            style={[
                orientation === 'horizontal' ? styles.horizontal : styles.vertical,
                {
                    backgroundColor: color || theme.colors.divider,
                    [orientation === 'horizontal' ? 'height' : 'width']: thickness,
                    [orientation === 'horizontal' ? 'marginVertical' : 'marginHorizontal']: defaultSpacing,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    horizontal: {
        width: '100%',
    },
    vertical: {
        height: '100%',
    },
});
