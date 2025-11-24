import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Heading } from '../atoms/Heading';

export interface HeaderProps {
    title: string;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    onMenuPress?: () => void;
    style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    leftAction,
    rightAction,
    onMenuPress,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile, isTablet } = useResponsive();

    const showMenuIcon = (isMobile || isTablet) && onMenuPress;

    return (
        <View
            style={[
                styles.header,
                {
                    backgroundColor: theme.colors.card,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.divider,
                    minHeight: isMobile ? 56 : 64,
                },
                theme.shadows.sm,
                { zIndex: 100 }, // Ensure header stays on top for dropdowns
                style,
            ]}
        >
            <View style={styles.leftSection}>
                {showMenuIcon ? (
                    <TouchableOpacity
                        onPress={onMenuPress}
                        style={{ marginRight: theme.spacing.md }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons name="menu" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                ) : (
                    leftAction && <View style={{ marginRight: theme.spacing.md }}>{leftAction}</View>
                )}
                <Heading level={isMobile ? 'h5' : 'h4'}>{title}</Heading>
            </View>
            {rightAction && <View style={styles.rightSection}>{rightAction}</View>}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
