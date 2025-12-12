import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, TouchableOpacity, View } from 'react-native';
import { Avatar } from '../../../components/atoms/Avatar';
import { Badge } from '../../../components/atoms/Badge';
import { Card } from '../../../components/atoms/Card';
import { Heading } from '../../../components/atoms/Heading';
import { Text } from '../../../components/atoms/Text';
import { useTheme } from '../../../hooks/useTheme';
import { api } from '../../../services/api';

interface Order {
    _id: string;
    tableNo: string;
    total: number;
    items: any[];
    createdAt: string;
    paymentStatus: string;
    remarks?: string;
}

export default function WaiterProfileScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const user = api.getUser();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [])
    );

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await api.getWaiterOrders();
            // Sort by date (newest first)
            const sortedOrders = data.sort((a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };

    const handleLogout = () => {
        api.setToken(null);
        router.replace('/');
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
    });

    const totalToday = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={{
                    paddingHorizontal: theme.spacing.lg,
                    paddingTop: theme.spacing.xl,
                    paddingBottom: theme.spacing.md
                }}>
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
                        Your account and activity
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
                            {user?.name || 'Waiter'}
                        </Heading>
                        <Text style={{ color: theme.colors.textSecondary, marginTop: theme.spacing.xs }}>
                            {user?.email || 'waiter@example.com'}
                        </Text>
                        <Badge
                            variant="success"
                            value={user?.role || 'Waiter'}
                            style={{ marginTop: theme.spacing.sm }}
                        />
                    </Card>
                </View>

                {/* Today's Statistics */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md }}>
                        Today's Activity
                    </Heading>
                    <View style={{
                        flexDirection: 'row',
                        gap: theme.spacing.sm,
                    }}>
                        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: theme.spacing.lg }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: theme.colors.primary + '15',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: theme.spacing.sm,
                            }}>
                                <Ionicons name="receipt-outline" size={24} color={theme.colors.primary} />
                            </View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: theme.spacing.xs,
                            }}>
                                {todayOrders.length}
                            </Text>
                            <Text style={{
                                color: theme.colors.textSecondary,
                                fontSize: 12,
                                textAlign: 'center',
                            }}>
                                Orders
                            </Text>
                        </Card>

                        <Card style={{ flex: 1, alignItems: 'center', paddingVertical: theme.spacing.lg }}>
                            <View style={{
                                width: 48,
                                height: 48,
                                borderRadius: 24,
                                backgroundColor: theme.colors.success + '15',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: theme.spacing.sm,
                            }}>
                                <Ionicons name="cash-outline" size={24} color={theme.colors.success} />
                            </View>
                            <Text style={{
                                fontSize: 20,
                                fontWeight: '700',
                                color: theme.colors.text,
                                marginBottom: theme.spacing.xs,
                            }}>
                                Rs. {totalToday}
                            </Text>
                            <Text style={{
                                color: theme.colors.textSecondary,
                                fontSize: 12,
                                textAlign: 'center',
                            }}>
                                Total Sales
                            </Text>
                        </Card>
                    </View>
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
        </View>
    );
}
