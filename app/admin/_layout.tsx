import { Ionicons } from '@expo/vector-icons';
import { Slot, Tabs, usePathname, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar, SidebarItem } from '../../components/organisms/Sidebar';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
export default function AdminLayout() {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    // If mobile, use the Tab layout
    if (isMobile) {
        return (
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right','bottom']}>
                         <Tabs
                screenOptions={{
                    tabBarActiveTintColor: theme.colors.primary,
                    tabBarInactiveTintColor: theme.colors.textSecondary,
                    tabBarStyle: {
                        backgroundColor: theme.colors.surface,
                        height: 70,
                        borderTopWidth: 0,
                        paddingBottom: 10,
                        paddingTop: 10,
                        elevation: 0, // Remove elevation
                        shadowOpacity: 0, // Remove shadow
                    },
                    tabBarItemStyle: {
                        height: 50,
                        padding: 5,
                    },
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                        marginTop: 2,
                    },
                    headerShown: false,
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View style={focused ? {
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                elevation: 5,
                            } : undefined}>
                                <Ionicons name="home-outline" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="orders"
                    options={{
                        title: 'Orders',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View style={focused ? {
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                elevation: 5,
                            } : undefined}>
                                <Ionicons name="cart-outline" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="inventory"
                    options={{
                        title: 'Inventory',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View style={focused ? {
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                elevation: 5,
                            } : undefined}>
                                <Ionicons name="cube-outline" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View style={focused ? {
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                elevation: 5,
                            } : undefined}>
                                <Ionicons name="person-outline" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color, size, focused }) => (
                            <View style={focused ? {
                                shadowColor: theme.colors.primary,
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.8,
                                shadowRadius: 8,
                                elevation: 5,
                            } : undefined}>
                                <Ionicons name="settings-outline" size={size} color={color} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
            </SafeAreaView>
           
        );
    }

    // Desktop/Tablet Sidebar Layout
    const sidebarItems: SidebarItem[] = [
        {
            label: 'Home',
            icon: 'home-outline',
            onPress: () => router.push('/admin'),
            active: pathname === '/admin' || pathname === '/admin/',
        },
        {
            label: 'Orders',
            icon: 'cart-outline',
            onPress: () => router.push('/admin/orders'),
            active: pathname.includes('/admin/orders'),
        },
        {
            label: 'Inventory',
            icon: 'cube-outline',
            onPress: () => router.push('/admin/inventory'),
            active: pathname.includes('/admin/inventory'),
        },
        {
            label: 'Profile',
            icon: 'person-outline',
            onPress: () => router.push('/admin/profile'),
            active: pathname.includes('/admin/profile'),
        },
        {
            label: 'Settings',
            icon: 'settings-outline',
            onPress: () => router.push('/admin/settings'),
            active: pathname.includes('/admin/settings'),
        },
    ];

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background }}>
            <Sidebar
                items={sidebarItems}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
                header={
                    !collapsed ? (
                        <View style={{ paddingVertical: theme.spacing.sm }}>
                            {/* You can add a logo here */}
                            <Ionicons name="restaurant" size={32} color={theme.colors.primary} />
                        </View>
                    ) : (
                        <View style={{ paddingVertical: theme.spacing.sm, alignItems: 'center' }}>
                            <Ionicons name="restaurant" size={24} color={theme.colors.primary} />
                        </View>
                    )
                }
            />
            <View style={{ flex: 1 }}>
                <Slot />
            </View>
        </View>
    );
}
