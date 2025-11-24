import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../atoms/Badge';
import { Text } from '../atoms/Text';

export interface NavItem {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    active?: boolean;
    badge?: string | number;
}

export interface NavBarProps {
    items: NavItem[];
    style?: ViewStyle;
}

export const NavBar: React.FC<NavBarProps> = ({ items, style }) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    // Bottom navigation on mobile, top on desktop/tablet
    const isBottom = isMobile;

    return (
        <View
            style={[
                styles.navbar,
                isBottom ? styles.navbarBottom : styles.navbarTop,
                {
                    backgroundColor: theme.colors.card,
                    paddingVertical: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.md,
                },
                isBottom
                    ? {
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.divider,
                    }
                    : {
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.divider,
                    },
                !isBottom && theme.shadows.sm,
                style,
            ]}
        >
            {items.map((item, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    style={[
                        styles.navItem,
                        {
                            paddingVertical: theme.spacing.sm,
                            paddingHorizontal: theme.spacing.md,
                            borderRadius: theme.radius.md,
                            backgroundColor: item.active ? `${theme.colors.primary}15` : 'transparent',
                        },
                        isBottom && styles.navItemBottom,
                    ]}
                    activeOpacity={0.7}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={item.icon}
                            size={isBottom ? 24 : 20}
                            color={item.active ? theme.colors.primary : theme.colors.textSecondary}
                        />
                        {item.badge && (
                            <View style={styles.badgeContainer}>
                                <Badge variant="error" value={item.badge} size="sm" />
                            </View>
                        )}
                    </View>
                    <Text
                        size={isBottom ? 'xs' : 'sm'}
                        semibold={item.active}
                        color={item.active ? theme.colors.primary : theme.colors.textSecondary}
                        style={isBottom ? { marginTop: 2 } : { marginLeft: theme.spacing.xs }}
                    >
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        width: '100%',
    },
    navbarBottom: {
        justifyContent: 'space-around',
    },
    navbarTop: {
        justifyContent: 'flex-start',
        gap: 8,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navItemBottom: {
        flexDirection: 'column',
        flex: 1,
    },
    iconContainer: {
        position: 'relative',
    },
    badgeContainer: {
        position: 'absolute',
        top: -4,
        right: -8,
    },
});
