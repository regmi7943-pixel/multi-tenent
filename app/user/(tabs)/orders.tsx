import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
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
    status?: string;
    remarks?: string;
}

export default function OngoingOrdersScreen() {
    const { theme } = useTheme();
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
            // Filter for ongoing (not completed/paid)
            // Assuming "ongoing" means open orders. If we don't have a status field, we might assume paymentStatus !== 'paid'
            // For now, let's filter orders that are NOT paid.
            const ongoing = data.filter((order: any) =>
                order.paymentStatus !== 'paid' && order.status !== 'completed'
            );

            // Sort by date (newest first)
            const sortedOrders = ongoing.sort((a: any, b: any) =>
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

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
                    Ongoing Orders
                </Text>
                <Text style={{
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                    fontSize: 14,
                }}>
                    Active orders needing attention
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: theme.spacing.lg, paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {loading ? (
                    <Text color={theme.colors.textSecondary}>Loading orders...</Text>
                ) : orders.length === 0 ? (
                    <Card style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
                        <Ionicons name="checkmark-circle-outline" size={48} color={theme.colors.success} />
                        <Text style={{ marginTop: theme.spacing.md, color: theme.colors.textSecondary }}>
                            No active orders
                        </Text>
                        <Text size="sm" style={{ marginTop: theme.spacing.xs, color: theme.colors.textSecondary }}>
                            All your orders are completed!
                        </Text>
                    </Card>
                ) : (
                    orders.map((order) => (
                        <Card key={order._id} style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.spacing.sm }}>
                                <View>
                                    <Heading level="h4">{order.tableNo}</Heading>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                        <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 4 }} />
                                        <Text size="sm" color={theme.colors.textSecondary}>
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                    <Text medium style={{ fontSize: 16 }}>Rs. {order.total}</Text>
                                    <Badge
                                        variant="warning"
                                        value={order.paymentStatus || 'Pending'}
                                        style={{ marginTop: 4 }}
                                    />
                                </View>
                            </View>

                            <View style={{
                                borderTopWidth: 1,
                                borderTopColor: theme.colors.border,
                                paddingTop: theme.spacing.sm,
                                marginTop: theme.spacing.sm
                            }}>
                                {/* Order Note */}
                                {order.remarks && (
                                    <View style={{ marginBottom: theme.spacing.sm, padding: 8, backgroundColor: theme.colors.warning + '15', borderRadius: 4 }}>
                                        <Text size="sm" style={{ fontStyle: 'italic', color: theme.colors.text }}>
                                            Note: "{order.remarks}"
                                        </Text>
                                    </View>
                                )}

                                <Text size="sm" color={theme.colors.textSecondary} style={{ marginBottom: 4 }}>
                                    {order.items.length} items
                                </Text>
                                {order.items.slice(0, 5).map((item: any, idx: number) => {
                                    const productName = typeof item.product === 'object' && item.product?.name
                                        ? item.product.name
                                        : 'Product'; // Fallback if just ID

                                    return (
                                        <View key={idx} style={{ marginBottom: 4 }}>
                                            <Text size="sm">
                                                • {item.quantity}x {productName}
                                            </Text>
                                            {item.remarks && (
                                                <Text size="xs" color={theme.colors.textSecondary} style={{ marginLeft: 16, fontStyle: 'italic' }}>
                                                    - {item.remarks}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                                {order.items.length > 5 && (
                                    <Text size="sm" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                                        + {order.items.length - 5} more...
                                    </Text>
                                )}
                            </View>
                        </Card>
                    ))
                )}
            </ScrollView>
        </View>
    );
}
