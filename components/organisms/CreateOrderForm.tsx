import React, { useState } from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Input } from '../../components/atoms/Input';
import { Text } from '../../components/atoms/Text';

export function CreateOrderForm({
    products,
    customers = [],
    onSubmit,
    theme,
    userRole
}: {
    products: any[],
    customers?: any[],
    onSubmit: (data: any) => void,
    theme: any,
    userRole?: string
}) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [existingCustomer, setExistingCustomer] = useState<any>(null);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [itemRemarks, setItemRemarks] = useState<Record<string, string>>({});

    const handlePhoneChange = (text: string) => {
        setCustomerPhone(text);
        const customer = customers.find(c => c.phone === text);
        if (customer) {
            setExistingCustomer(customer);
            setCustomerName(customer.name);
        } else {
            setExistingCustomer(null);
        }
    };

    const addItem = (product: any) => {
        const existing = selectedItems.find(i => i.product === product._id);
        if (existing) {
            setSelectedItems(selectedItems.map(i =>
                i.product === product._id ? { ...i, quantity: i.quantity + 1 } : i
            ));
        } else {
            setSelectedItems([...selectedItems, {
                product: product._id,
                quantity: 1,
                name: product.name.trim(),
                price: product.price
            }]);
        }
    };

    const removeItem = (productId: string) => {
        setSelectedItems(selectedItems.filter(i => i.product !== productId));
        const newExpanded = new Set(expandedItems);
        newExpanded.delete(productId);
        setExpandedItems(newExpanded);
        const newRemarks = { ...itemRemarks };
        delete newRemarks[productId];
        setItemRemarks(newRemarks);
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId);
        } else {
            setSelectedItems(selectedItems.map(i =>
                i.product === productId ? { ...i, quantity } : i
            ));
        }
    };

    const toggleExpanded = (productId: string) => {
        const newExpanded = new Set(expandedItems);
        if (newExpanded.has(productId)) {
            newExpanded.delete(productId);
        } else {
            newExpanded.add(productId);
        }
        setExpandedItems(newExpanded);
    };

    const updateRemarks = (productId: string, remarks: string) => {
        setItemRemarks({
            ...itemRemarks,
            [productId]: remarks
        });
    };

    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const screenWidth = Dimensions.get('window').width;
    const horizontalPadding = 32; // 16px on each side
    const cardGap = 8; // gap between cards
    const productCardWidth = (screenWidth - horizontalPadding - cardGap) / 2;

    const handleSubmit = () => {
        if (!customerName || !customerPhone || selectedItems.length === 0) {
            alert('Please fill all fields');
            return;
        }
        onSubmit({
            customerName,
            customerPhone,
            items: selectedItems.map(({ product, quantity }) => ({
                product,
                quantity,
                remarks: itemRemarks[product] || ''
            })),
            total,
            paymentMethod,
            placedBy: userRole
        });
    };

    return (
        <ScrollView style={{ flex: 1, padding: 16 }}>
            {/* Customer Info */}
            <Text variant="label" style={{ marginBottom: 8 }}>Customer Name</Text>
            <Input
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Enter customer name"
                containerStyle={{ marginBottom: 16 }}
            />

            <Text variant="label" style={{ marginBottom: 8 }}>Customer Phone</Text>
            <Input
                value={customerPhone}
                onChangeText={handlePhoneChange}
                placeholder="Enter customer phone"
                keyboardType="phone-pad"
                containerStyle={{ marginBottom: 8 }}
            />

            {existingCustomer && (
                <View style={{
                    marginBottom: 16,
                    padding: 10,
                    backgroundColor: theme.colors.surface,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: theme.colors.border
                }}>
                    <Text variant="caption" style={{ color: theme.colors.primary }}>Existing Customer Found</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                        <Text semibold>Credit Balance:</Text>
                        <Text semibold color={existingCustomer.creditBalance > 0 ? theme.colors.error : theme.colors.success}>
                            Rs. {existingCustomer.creditBalance || 0}
                        </Text>
                    </View>
                </View>
            )}

            {/* Select Products (2 per row grid) */}
            <Text variant="label" style={{ marginBottom: 8 }}>Select Products</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 }}>
                {products.map((product, index) => (
                    <View
                        key={product._id}
                        style={{
                            width: '48%', // Using percentage for reliable 2-column layout
                            marginBottom: 8,
                        }}
                    >
                        <Card
                            onPress={() => addItem(product)}
                            bordered
                            padding="none"
                            style={{
                                paddingVertical: 8,
                                paddingHorizontal: 8,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Text semibold numberOfLines={1} style={{ textAlign: 'center', fontSize: 13 }}>
                                {product.name.trim()}
                            </Text>
                        </Card>
                    </View>
                ))}
            </View>

            {/* Selected Items */}
            <Text variant="label" style={{ marginBottom: 8 }}>Selected Items</Text>
            {selectedItems.map(item => {
                const isExpanded = expandedItems.has(item.product);
                const hasRemarks = itemRemarks[item.product]?.length > 0;

                return (
                    <View key={item.product} style={{ marginBottom: 12 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: 12,
                            backgroundColor: hasRemarks ? theme.colors.surface : 'transparent',
                            borderRadius: 8,
                            borderWidth: hasRemarks ? 1 : 0,
                            borderColor: theme.colors.border
                        }}>
                            <TouchableOpacity
                                onPress={() => toggleExpanded(item.product)}
                                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                            >
                                <Text style={{ marginRight: 8, fontSize: 16 }}>
                                    {isExpanded ? '▼' : '▶'}
                                </Text>
                                <View style={{ flex: 1 }}>
                                    <Text semibold>{item.name} (x{item.quantity})</Text>
                                    {hasRemarks && (
                                        <Text variant="caption" size="sm" style={{ color: theme.colors.textSecondary, marginTop: 2 }}>
                                            📝 Has remarks
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>

                            <Text style={{ marginRight: 10, fontWeight: '600' }}>Rs. {item.price * item.quantity}</Text>

                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <Button variant="outline" size="sm" onPress={() => updateQuantity(item.product, item.quantity - 1)}>-</Button>
                                <Button variant="outline" size="sm" onPress={() => updateQuantity(item.product, item.quantity + 1)}>+</Button>
                            </View>
                        </View>

                        {isExpanded && (
                            <View style={{ marginTop: 8, paddingLeft: 32, paddingRight: 8 }}>
                                <Text variant="caption" style={{ marginBottom: 4, color: theme.colors.textSecondary }}>
                                    Remarks for {item.name}:
                                </Text>
                                <Input
                                    value={itemRemarks[item.product] || ''}
                                    onChangeText={(text) => updateRemarks(item.product, text)}
                                    placeholder="Add special instructions or notes..."
                                    multiline
                                    numberOfLines={3}
                                    containerStyle={{
                                        backgroundColor: theme.colors.background,
                                        borderColor: theme.colors.border,
                                        borderWidth: 1,
                                        borderRadius: 8,
                                        padding: 8
                                    }}
                                />
                            </View>
                        )}
                    </View>
                );
            })}

            <Divider style={{ marginVertical: 16 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text size="lg" bold>Total</Text>
                <Text size="lg" bold>Rs. {total}</Text>
            </View>

            <Button onPress={handleSubmit}>Create Order</Button>
        </ScrollView>
    );
}
