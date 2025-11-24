import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Platform,
    StyleSheet,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
    inactiveColor?: string;
    style?: ViewStyle;
}

export const Switch: React.FC<SwitchProps> = ({
    value,
    onValueChange,
    disabled = false,
    activeColor,
    inactiveColor,
    style,
}) => {
    const { theme } = useTheme();
    const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value, animatedValue]);

    const width = 51;
    const height = 31;
    const thumbSize = 27;
    const trackMargin = 2;

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [inactiveColor || theme.colors.border, activeColor || theme.colors.primary],
    });

    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [trackMargin, width - thumbSize - trackMargin],
    });

    return (
        <TouchableOpacity
            onPress={() => !disabled && onValueChange(!value)}
            disabled={disabled}
            activeOpacity={0.8}
            style={[styles.container, style]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
            <Animated.View
                style={[
                    styles.track,
                    {
                        width,
                        height,
                        borderRadius: height / 2,
                        backgroundColor,
                    },
                    disabled && { opacity: 0.5 },
                ]}
            >
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            width: thumbSize,
                            height: thumbSize,
                            borderRadius: thumbSize / 2,
                            transform: [{ translateX }],
                        },
                        Platform.OS === 'web' ? {} : theme.shadows.sm,
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    track: {
        justifyContent: 'center',
    },
    thumb: {
        backgroundColor: '#ffffff',
    },
});
