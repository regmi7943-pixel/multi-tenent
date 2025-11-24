import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { Header } from '../organisms/Header';
import { NavBar, NavItem } from '../organisms/NavBar';
import { Sidebar, SidebarItem } from '../organisms/Sidebar';

export interface ResponsiveShellProps {
    children: React.ReactNode;
    navItems?: NavItem[];
    sidebarItems: SidebarItem[];
    title?: string;
    headerRight?: React.ReactNode;
    onMenuPress?: () => void;
    style?: ViewStyle;
}

export const ResponsiveShell: React.FC<ResponsiveShellProps> = ({
    children,
    navItems,
    sidebarItems,
    title = 'App',
    headerRight,
    onMenuPress,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile, isDesktop } = useResponsive();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    if (isMobile) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }, style]}>
                <Header title={title} rightAction={headerRight} onMenuPress={onMenuPress} />
                <ScrollView style={styles.content}>
                    {children}
                </ScrollView>
                {navItems && navItems.length > 0 && <NavBar items={navItems} />}
            </View>
        );
    }

    return (
        <View style={[styles.container, styles.desktopContainer, { backgroundColor: theme.colors.background }, style]}>
            <Sidebar
                items={sidebarItems}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                header={
                    !sidebarCollapsed && (
                        <View style={{ padding: theme.spacing.md }}>
                            {/* Placeholder for App Logo/Name in Sidebar */}
                        </View>
                    )
                }
            />
            <View style={styles.mainContent}>
                <Header
                    title={title}
                    rightAction={headerRight}
                    style={{ borderBottomWidth: 1, borderBottomColor: theme.colors.divider }}
                />
                <ScrollView style={styles.content}>
                    <View style={styles.desktopContentWrapper}>
                        {children}
                    </View>
                </ScrollView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    desktopContainer: {
        flexDirection: 'row',
    },
    mainContent: {
        flex: 1,
        height: '100%',
    },
    content: {
        flex: 1,
    },
    desktopContentWrapper: {
        padding: 24,
        maxWidth: 1200,
        width: '100%',
        alignSelf: 'center',
    },
});
