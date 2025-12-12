import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../components/atoms/Avatar';
import { Badge } from '../../components/atoms/Badge';
import { Card } from '../../components/atoms/Card';
import { Heading } from '../../components/atoms/Heading';
import { Switch } from '../../components/atoms/Switch';
import { Text } from '../../components/atoms/Text';
import { CreateWaiterModal } from '../../components/molecules/CreateWaiterModal';
import { useTheme } from '../../hooks/useTheme';
import { api, Product } from '../../services/api';

export default function ProfileScreen() {
    const { theme, isDark, toggleTheme } = useTheme();
    const router = useRouter();
    const user = api.getUser();

    const [products, setProducts] = useState<Product[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);
    const [showWaiterModal, setShowWaiterModal] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const lowStockCount = products.filter(
        p => p.requiresStock && p.stock <= p.lowStockThreshold
    ).length;

    const handleLogout = () => {
        api.setToken(null);
        router.replace('/');
    };

    // Get user initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const stats = [
        {
            icon: 'receipt-outline',
            label: 'Total Orders',
            value: 'Coming Soon',
            color: theme.colors.primary,
            bgColor: theme.colors.primary + '15',
        },
        {
            icon: 'cash-outline',
            label: 'Total Sales',
            value: 'Coming Soon',
            color: theme.colors.success,
            bgColor: theme.colors.success + '15',
        },
        {
            icon: 'cube-outline',
            label: 'Active Products',
            value: statsLoading ? '...' : products.length.toString(),
            color: theme.colors.info,
            bgColor: theme.colors.info + '15',
        },
        {
            icon: 'alert-circle-outline',
            label: 'Low Stock Items',
            value: statsLoading ? '...' : lowStockCount.toString(),
            color: lowStockCount > 0 ? theme.colors.error : theme.colors.success,
            bgColor: lowStockCount > 0 ? theme.colors.error + '15' : theme.colors.success + '15',
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.md }}>
                    <Text style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: theme.colors.text,
                        letterSpacing: -0.5,
                    }}>
                        Profile
                    </Text>
                    <Text style={{
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                        fontSize: 14,
                    }}>
                        Manage your account and preferences
                    </Text>
                </View>

                {/* User Info Card */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Card style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
                        <Avatar
                            size="xl"
                            initials={user ? getInitials(user.name) : 'U'}
                            backgroundColor={theme.colors.primary}
                        />
                        <Heading level="h2" style={{ marginTop: theme.spacing.md }}>
                            {user?.name || 'User'}
                        </Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>
                            {user?.email || 'user@example.com'}
                        </Text>
                        <Badge
                            variant="info"
                            value={user?.role || 'Admin'}
                            style={{ marginTop: theme.spacing.sm }}
                        />
                        <Text style={{
                            color: theme.colors.textSecondary,
                            fontSize: 12,
                            marginTop: theme.spacing.md
                        }}>
                            Member since November 2025
                        </Text>
                    </Card>
                </View>

                {/* Statistics Grid */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md }}>
                        Statistics
                    </Heading>
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginHorizontal: -theme.spacing.xs
                    }}>
                        {stats.map((stat, index) => (
                            <View
                                key={index}
                                style={{
                                    width: '50%',
                                    padding: theme.spacing.xs,
                                }}
                            >
                                <Card style={{ alignItems: 'center', paddingVertical: theme.spacing.lg }}>
                                    <View style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 24,
                                        backgroundColor: stat.bgColor,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginBottom: theme.spacing.sm,
                                    }}>
                                        <Ionicons name={stat.icon as any} size={24} color={stat.color} />
                                    </View>
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: '700',
                                        color: theme.colors.text,
                                        marginBottom: theme.spacing.xs,
                                    }}>
                                        {stat.value}
                                    </Text>
                                    <Text style={{
                                        color: theme.colors.textSecondary,
                                        fontSize: 12,
                                        textAlign: 'center',
                                    }}>
                                        {stat.label}
                                    </Text>
                                </Card>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Quick Settings */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md }}>
                        Quick Settings
                    </Heading>

                    {/* Theme Toggle */}
                    <Card style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: theme.spacing.sm,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: theme.colors.warning + '15',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: theme.spacing.md,
                            }}>
                                <Ionicons
                                    name={isDark ? 'moon' : 'sunny'}
                                    size={20}
                                    color={theme.colors.warning}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: '600', color: theme.colors.text }}>
                                    Dark Mode
                                </Text>
                                <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                                    {isDark ? 'Enabled' : 'Disabled'}
                                </Text>
                            </View>
                        </View>
                        <Switch value={isDark} onValueChange={toggleTheme} />
                    </Card>

                    {/* Make New Waiter */}
                    <TouchableOpacity onPress={() => setShowWaiterModal(true)}>
                        <Card style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: theme.spacing.sm,
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: theme.colors.success + '15',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: theme.spacing.md,
                                }}>
                                    <Ionicons name="person-add-outline" size={20} color={theme.colors.success} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: '600', color: theme.colors.text }}>
                                        Make New Waiter
                                    </Text>
                                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                                        Create a new waiter account
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </Card>
                    </TouchableOpacity>

                    {/* Account Settings */}
                    <TouchableOpacity onPress={() => router.push('/admin/settings')}>
                        <Card style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: theme.colors.primary + '15',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: theme.spacing.md,
                                }}>
                                    <Ionicons name="settings-outline" size={20} color={theme.colors.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontWeight: '600', color: theme.colors.text }}>
                                        Account Settings
                                    </Text>
                                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                                        Manage your account preferences
                                    </Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
                        </Card>
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <View style={{ paddingHorizontal: theme.spacing.lg }}>
                    <TouchableOpacity
                        onPress={handleLogout}
                        style={{
                            backgroundColor: theme.colors.error + '20',
                            borderColor: theme.colors.error,
                            borderWidth: 1,
                            padding: theme.spacing.md,
                            borderRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                        <Text style={{ color: theme.colors.error, marginLeft: theme.spacing.sm, fontWeight: '600' }}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Create Waiter Modal */}
            <CreateWaiterModal
                visible={showWaiterModal}
                onClose={() => setShowWaiterModal(false)}
                onSuccess={() => {
                    // Optional: refresh stats or show additional feedback
                }}
            />
        </View>
    );
}
