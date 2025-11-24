import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Divider } from '../atoms/Divider';
import { Text } from '../atoms/Text';

export interface SidebarItem {
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    active?: boolean;
}

export interface SidebarProps {
    items: SidebarItem[];
    header?: React.ReactNode;
    footer?: React.ReactNode;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    style?: ViewStyle;
}

export const Sidebar: React.FC<SidebarProps> = ({
    items,
    header,
    footer,
    collapsed = false,
    onToggleCollapse,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile, isTablet, isDesktop } = useResponsive();

    // Sidebar is hidden on mobile
    if (isMobile) return null;

    const sidebarWidth = collapsed ? 72 : 240;

    return (
        <View
            style={[
                styles.sidebar,
                {
                    width: sidebarWidth,
                    backgroundColor: theme.colors.surface,
                    borderRightWidth: 1,
                    borderRightColor: theme.colors.divider,
                },
                style,
            ]}
        >
            {header && (
                <>
                    <View style={{ padding: theme.spacing.md }}>
                        {header}
                    </View>
                    <Divider spacing={0} />
                </>
            )}

            <ScrollView style={styles.content}>
                {items.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={item.onPress}
                        style={[
                            styles.item,
                            {
                                paddingHorizontal: theme.spacing.md,
                                paddingVertical: theme.spacing.md,
                                backgroundColor: item.active ? `${theme.colors.primary}20` : 'transparent',
                                borderLeftWidth: item.active ? 3 : 0,
                                borderLeftColor: theme.colors.primary,
                            },
                        ]}
                        activeOpacity={0.7}
                    >
                        {item.icon && (
                            <Ionicons
                                name={item.icon}
                                size={24}
                                color={item.active ? theme.colors.primary : theme.colors.text}
                                style={{ marginRight: collapsed ? 0 : theme.spacing.md }}
                            />
                        )}
                        {!collapsed && (
                            <Text
                                size="md"
                                semibold={item.active}
                                color={item.active ? theme.colors.primary : theme.colors.text}
                            >
                                {item.label}
                            </Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {footer && (
                <>
                    <Divider spacing={0} />
                    <View style={{ padding: theme.spacing.md }}>
                        {footer}
                    </View>
                </>
            )}

            {isDesktop && onToggleCollapse && (
                <TouchableOpacity
                    onPress={onToggleCollapse}
                    style={[
                        styles.collapseButton,
                        {
                            padding: theme.spacing.md,
                            borderTopWidth: 1,
                            borderTopColor: theme.colors.divider,
                        },
                    ]}
                >
                    <Ionicons
                        name={collapsed ? 'chevron-forward' : 'chevron-back'}
                        size={20}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        height: '100%',
    },
    content: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    collapseButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
