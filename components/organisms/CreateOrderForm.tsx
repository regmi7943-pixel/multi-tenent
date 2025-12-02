import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Input } from '../../components/atoms/Input';
import { Text } from '../../components/atoms/Text';

export function CreateOrderForm({ products, customers = [], onSubmit, theme }: { products: any[], customers?: any[], onSubmit: (data: any) => void, theme: any }) {
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [selectedItems, setSelectedItems] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [existingCustomer, setExistingCustomer] = useState<any>(null);

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
            setSelectedItems([...selectedItems, { product: product._id, quantity: 1, name: product.name, price: product.price }]);
        }
    };

    const removeItem = (productId: string) => {
        setSelectedItems(selectedItems.filter(i => i.product !== productId));
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

    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleSubmit = () => {
        if (!customerName || !customerPhone || selectedItems.length === 0) {
            alert('Please fill all fields');
            return;
        }
        onSubmit({
            customerName,
            customerPhone,
            items: selectedItems.map(({ product, quantity }) => ({ product, quantity })),
            total,
            paymentMethod
        });
    };

    return (
        <ScrollView style={{ flex: 1 }}>
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
                <View style={{ marginBottom: 16, padding: 10, backgroundColor: theme.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border }}>
                    <Text variant="caption" style={{ color: theme.colors.primary }}>Existing Customer Found</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                        <Text semibold>Credit Balance:</Text>
                        <Text semibold color={existingCustomer.creditBalance > 0 ? theme.colors.error : theme.colors.success}>
                            Rs. {existingCustomer.creditBalance || 0}
                        </Text>
                    </View>
                </View>
            )}

            <Text variant="label" style={{ marginBottom: 8 }}>Select Products</Text>
            <ScrollView horizontal style={{ marginBottom: 16 }} showsHorizontalScrollIndicator={false}>
                {products.map(product => (
                    <Card
                        key={product._id}
                        onPress={() => addItem(product)}
                        bordered
                        style={{
                            marginRight: 10,
                            width: 120,
                        }}
                        padding="sm"
                    >
                        <Text semibold numberOfLines={1}>{product.name}</Text>
                        <Text variant="caption" size="sm">Rs. {product.price}</Text>
                    </Card>
                ))}
            </ScrollView>

            <Text variant="label" style={{ marginBottom: 8 }}>Selected Items</Text>
            {selectedItems.map(item => (
                <View key={item.product} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ flex: 1 }}>{item.name} (x{item.quantity})</Text>
                    <Text style={{ marginRight: 10 }}>Rs. {item.price * item.quantity}</Text>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <Button variant="outline" size="sm" onPress={() => updateQuantity(item.product, item.quantity - 1)}>-</Button>
                        <Button variant="outline" size="sm" onPress={() => updateQuantity(item.product, item.quantity + 1)}>+</Button>
                    </View>
                </View>
            ))}

            <Divider style={{ marginVertical: 16 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text size="lg" bold>Total</Text>
                <Text size="lg" bold>Rs. {total}</Text>
            </View>

            <Button onPress={handleSubmit}>Create Order</Button>
        </ScrollView>
    );
}
