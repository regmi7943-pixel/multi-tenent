import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    Pressable,
    StyleSheet,
    View,
    ViewStyle,
} from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';

export interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    height?: number | string;
    style?: ViewStyle;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    visible,
    onClose,
    children,
    height = '50%',
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const translateY = useRef(new Animated.Value(Dimensions.get('window').height)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: Dimensions.get('window').height,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, translateY]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100) {
                    onClose();
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable
                style={[styles.backdrop, { backgroundColor: theme.colors.backdrop }]}
                onPress={onClose}
            >
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Animated.View
                        style={[
                            styles.sheet,
                            {
                                backgroundColor: theme.colors.card,
                                borderTopLeftRadius: theme.radius.xl,
                                borderTopRightRadius: theme.radius.xl,
                                height: height as any,
                                transform: [{ translateY }],
                            },
                            style,
                        ]}
                        {...(isMobile ? panResponder.panHandlers : {})}
                    >
                        {isMobile && (
                            <View
                                style={[
                                    styles.handle,
                                    {
                                        backgroundColor: theme.colors.divider,
                                        borderRadius: theme.radius.full,
                                        marginTop: theme.spacing.md,
                                        marginBottom: theme.spacing.sm,
                                    },
                                ]}
                            />
                        )}
                        <View style={[styles.content, { padding: theme.spacing.lg }]}>
                            {children}
                        </View>
                    </Animated.View>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        width: '100%',
    },
    handle: {
        width: 40,
        height: 4,
        alignSelf: 'center',
    },
    content: {
        flex: 1,
    },
});
