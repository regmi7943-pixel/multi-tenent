import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { api, Product } from '../../services/api';
import { Button } from '../atoms/Button';
import { Card } from '../atoms/Card';
import { Heading } from '../atoms/Heading';
import { Input } from '../atoms/Input';
import { Text } from '../atoms/Text';

export interface CreateOrderModalProps {
    visible: boolean;
    onClose: () => void;
    tableNumber: number;
    onSuccess?: () => void;
    style?: ViewStyle;
}

interface OrderItem {
    product: Product;
    quantity: number;
    remarks?: string;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
    visible,
    onClose,
    tableNumber,
    onSuccess,
    style,
}) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();

    const [products, setProducts] = useState<Product[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);

    useEffect(() => {
        if (visible) {
            fetchProducts();
        }
    }, [visible]);

    const fetchProducts = async () => {
        try {
            setProductsLoading(true);
            const data = await api.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            Alert.alert('Error', 'Failed to load products');
        } finally {
            setProductsLoading(false);
        }
    };

    const addItem = (product: Product) => {
        const existingItem = orderItems.find(item => item.product._id === product._id);
        if (existingItem) {
            setOrderItems(orderItems.map(item =>
                item.product._id === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setOrderItems([...orderItems, { product, quantity: 1 }]);
        }
    };

    const removeItem = (productId: string) => {
        const existingItem = orderItems.find(item => item.product._id === productId);
        if (existingItem && existingItem.quantity > 1) {
            setOrderItems(orderItems.map(item =>
                item.product._id === productId
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            ));
        } else {
            setOrderItems(orderItems.filter(item => item.product._id !== productId));
        }
    };

    const handleSubmit = async () => {
        if (orderItems.length === 0) {
            Alert.alert('Error', 'Please add at least one item to the order');
            return;
        }

        setLoading(true);
        try {
            // According to guide.txt, the waiter order endpoint is POST /api/orders/waiter
            const orderData = {
                tableNo: `Table ${tableNumber}`,
                remarks: remarks,
                items: orderItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                })),
            };

            const response = await fetch(`${api['baseUrl']}api/orders/waiter`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${api.getToken()}`,
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }

            Alert.alert('Success', `Order for Table ${tableNumber} has been placed!`);
            resetForm();
            onSuccess?.();
            onClose();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setOrderItems([]);
        setRemarks('');
    };

    const handleClose = () => {
        if (!loading) {
            resetForm();
            onClose();
        }
    };

    const getTotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Pressable
                style={[
                    styles.backdrop,
                    { backgroundColor: theme.colors.backdrop },
                ]}
                onPress={handleClose}
            >
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Card
                        style={[
                            styles.modal,
                            {
                                width: isMobile ? '95%' : 600,
                                maxWidth: '95%',
                                maxHeight: '90%',
                            },
                            style,
                        ]}
                    >
                        {/* Header */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: theme.spacing.md,
                        }}>
                            <View>
                                <Heading level="h4">Table {tableNumber}</Heading>
                                <Text size="sm" color={theme.colors.textSecondary}>
                                    Create new order
                                </Text>
                            </View>
                            <TouchableOpacity onPress={handleClose}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={{ maxHeight: 400 }}>
                            {/* Products List */}
                            <View style={{ marginBottom: theme.spacing.md }}>
                                <Text medium style={{ marginBottom: theme.spacing.md }}>
                                    Select Items
                                </Text>
                                {productsLoading ? (
                                    <Text color={theme.colors.textSecondary}>Loading products...</Text>
                                ) : (
                                    products.map((product) => {
                                        const itemInOrder = orderItems.find(item => item.product._id === product._id);
                                        const quantity = itemInOrder?.quantity || 0;

                                        return (
                                            <View
                                                key={product._id}
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    paddingVertical: theme.spacing.sm,
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: theme.colors.border + '30',
                                                }}
                                            >
                                                <View style={{ flex: 1 }}>
                                                    <Text medium>{product.name}</Text>
                                                    <Text size="sm" color={theme.colors.textSecondary}>
                                                        Rs. {product.price}
                                                    </Text>
                                                </View>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    gap: theme.spacing.sm,
                                                }}>
                                                    {quantity > 0 && (
                                                        <>
                                                            <TouchableOpacity
                                                                onPress={() => removeItem(product._id)}
                                                                style={{
                                                                    backgroundColor: theme.colors.surface,
                                                                    borderRadius: 20,
                                                                    width: 36,
                                                                    height: 36,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderWidth: 1,
                                                                    borderColor: theme.colors.border,
                                                                }}
                                                            >
                                                                <Ionicons name="remove" size={20} color={theme.colors.text} />
                                                            </TouchableOpacity>
                                                            <Text medium style={{ minWidth: 24, textAlign: 'center', fontSize: 16 }}>
                                                                {quantity}
                                                            </Text>
                                                        </>
                                                    )}
                                                    <TouchableOpacity
                                                        onPress={() => addItem(product)}
                                                        style={{
                                                            backgroundColor: theme.colors.primary,
                                                            borderRadius: 20,
                                                            width: 36,
                                                            height: 36,
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <Ionicons name="add" size={20} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        );
                                    })
                                )}
                            </View>

                            {/* Remarks */}
                            {orderItems.length > 0 && (
                                <View style={{ marginBottom: theme.spacing.md }}>
                                    <Text medium style={{ marginBottom: theme.spacing.sm }}>
                                        Special Instructions (Optional)
                                    </Text>
                                    <Input
                                        placeholder="e.g., Extra spicy, No onions..."
                                        value={remarks}
                                        onChangeText={setRemarks}
                                        multiline
                                        numberOfLines={2}
                                        editable={!loading}
                                    />
                                </View>
                            )}
                        </ScrollView>

                        {/* Total and Submit */}
                        <View style={{
                            borderTopWidth: 1,
                            borderTopColor: theme.colors.border,
                            paddingTop: theme.spacing.md,
                            marginTop: theme.spacing.sm,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: theme.spacing.md,
                            }}>
                                <Text medium>Total:</Text>
                                <Text medium style={{ fontSize: 18 }}>
                                    Rs. {getTotal()}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: isMobile ? 'column-reverse' : 'row',
                                gap: theme.spacing.sm,
                            }}>
                                <Button
                                    variant="outline"
                                    onPress={handleClose}
                                    style={isMobile ? { width: '100%' } : { flex: 1 }}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    onPress={handleSubmit}
                                    style={isMobile ? { width: '100%' } : { flex: 1 }}
                                    loading={loading}
                                    disabled={loading || orderItems.length === 0}
                                >
                                    Place Order ({orderItems.length} items)
                                </Button>
                            </View>
                        </View>
                    </Card>
                </Pressable>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        alignSelf: 'center',
    },
});
