import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Heading } from '../../components/atoms/Heading';
import { Input } from '../../components/atoms/Input';
import { Text } from '../../components/atoms/Text';
import { ConfirmationModal } from '../../components/molecules/ConfirmationModal';
import { SuccessModal } from '../../components/molecules/SuccessModal';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { api, Product } from '../../services/api';

interface OrderItem {
    product: Product;
    quantity: number;
    remarks?: string;
}

export default function OrderScreen() {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const router = useRouter();
    const params = useLocalSearchParams<{ table: string }>();
    const tableNumber = params.table || '1';

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [overallRemarks, setOverallRemarks] = useState('');
    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ y: 0, animated: true });
        }
    }, [selectedCategory, searchQuery]);

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
            setOrderItems([...orderItems, { product, quantity: 1, remarks: '' }]);
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
            if (expandedItemId === productId) {
                setExpandedItemId(null);
            }
        }
    };

    const updateItemRemarks = (productId: string, remarks: string) => {
        setOrderItems(orderItems.map(item =>
            item.product._id === productId
                ? { ...item, remarks }
                : item
        ));
    };

    const handleSubmit = async () => {
        if (orderItems.length === 0) {
            Alert.alert('Error', 'Please add at least one item to the order');
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmOrder = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        try {
            const orderData = {
                tableNo: `Table ${tableNumber}`,
                remarks: overallRemarks,
                items: orderItems.map(item => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    remarks: item.remarks || undefined,
                })),
            };

            const data = await api.createWaiterOrder(orderData);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Order submission error:', error);
            Alert.alert('Error', error.message || 'Failed to create order');
        } finally {
            setLoading(false);
        }
    };

    const getTotal = () => {
        return orderItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: theme.spacing.lg,
                paddingTop: theme.spacing.lg,
                paddingBottom: theme.spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: theme.spacing.md }}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Heading level="h3">Table {tableNumber}</Heading>
                    <Text size="sm" color={theme.colors.textSecondary}>
                        Create new order
                    </Text>
                </View>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingBottom: 180, flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Product Headers & Filters */}
                    <View style={{
                        paddingHorizontal: theme.spacing.lg,
                        paddingTop: theme.spacing.lg,
                        backgroundColor: theme.colors.background,
                        paddingBottom: theme.spacing.sm,
                        zIndex: 10
                    }}>
                        <Text medium style={{ fontSize: 16, marginBottom: theme.spacing.md }}>
                            Select Items
                        </Text>

                        {/* Search Input */}
                        <View style={{ marginBottom: theme.spacing.md }}>
                            <Input
                                placeholder="Search items..."
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                leftIcon={<Ionicons name="search" size={20} color={theme.colors.textSecondary} />}
                                containerStyle={{ backgroundColor: theme.colors.surface }}
                            />
                        </View>

                        {/* Category Filter */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={{ marginBottom: theme.spacing.lg }}
                            contentContainerStyle={{ gap: theme.spacing.sm }}
                        >
                            {['All', ...Array.from(new Set(products.map(p => p.category || 'Other')))].map((category) => (
                                <TouchableOpacity
                                    key={category}
                                    onPress={() => setSelectedCategory(category)}
                                    style={{
                                        paddingHorizontal: theme.spacing.md,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: selectedCategory === category ? theme.colors.primary : theme.colors.surface,
                                        borderWidth: 1,
                                        borderColor: selectedCategory === category ? theme.colors.primary : theme.colors.border,
                                    }}
                                >
                                    <Text
                                        size="sm"
                                        style={{
                                            color: selectedCategory === category ? '#fff' : theme.colors.text,
                                            fontWeight: selectedCategory === category ? '600' : '400'
                                        }}
                                    >
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Products List */}
                    <View style={{ paddingHorizontal: theme.spacing.lg }}>
                        {productsLoading ? (
                            <Text color={theme.colors.textSecondary}>Loading products...</Text>
                        ) : products.length === 0 ? (
                            <View style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
                                <Ionicons name="fast-food-outline" size={48} color={theme.colors.disabled} />
                                <Text color={theme.colors.textSecondary} style={{ marginTop: theme.spacing.md }}>
                                    No items found
                                </Text>
                            </View>
                        ) : (
                            products
                                .filter(p => {
                                    const matchesCategory = selectedCategory === 'All' || (p.category || 'Other') === selectedCategory;
                                    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
                                    return matchesCategory && matchesSearch;
                                })
                                .map((product) => {
                                    const itemInOrder = orderItems.find(item => item.product._id === product._id);
                                    const quantity = itemInOrder?.quantity || 0;
                                    const isExpanded = expandedItemId === product._id;

                                    return (
                                        <View key={product._id} style={{
                                            marginBottom: theme.spacing.md,
                                            backgroundColor: theme.colors.surface,
                                            borderRadius: 12,
                                            padding: theme.spacing.sm,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border + '50',
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.05,
                                            shadowRadius: 2,
                                            elevation: 1
                                        }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                {/* Product Image */}
                                                <View style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 8,
                                                    backgroundColor: theme.colors.background,
                                                    marginRight: theme.spacing.md,
                                                    overflow: 'hidden',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    {product.images && product.images.length > 0 ? (
                                                        <Image
                                                            source={{ uri: product.images[0] }}
                                                            style={{ width: '100%', height: '100%' }}
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <Ionicons name="fast-food-outline" size={24} color={theme.colors.textSecondary + '50'} />
                                                    )}
                                                </View>

                                                {/* Product Info */}
                                                <View style={{ flex: 1 }}>
                                                    <Text medium style={{ fontSize: 16 }}>{product.name}</Text>
                                                    <Text size="sm" color={theme.colors.textSecondary} style={{ marginTop: 2 }}>
                                                        Rs. {product.price}
                                                    </Text>
                                                </View>

                                                {/* Controls */}
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                    {quantity > 0 ? (
                                                        <>
                                                            <TouchableOpacity
                                                                onPress={() => removeItem(product._id)}
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: 16,
                                                                    backgroundColor: theme.colors.background,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderWidth: 1,
                                                                    borderColor: theme.colors.border
                                                                }}
                                                            >
                                                                <Ionicons name="remove" size={18} color={theme.colors.text} />
                                                            </TouchableOpacity>

                                                            <Text medium style={{ minWidth: 20, textAlign: 'center', fontSize: 16 }}>
                                                                {quantity}
                                                            </Text>

                                                            <TouchableOpacity
                                                                onPress={() => addItem(product)}
                                                                style={{
                                                                    width: 32,
                                                                    height: 32,
                                                                    borderRadius: 16,
                                                                    backgroundColor: theme.colors.primary,
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                            >
                                                                <Ionicons name="add" size={18} color="#fff" />
                                                            </TouchableOpacity>
                                                        </>
                                                    ) : (
                                                        <TouchableOpacity
                                                            onPress={() => addItem(product)}
                                                            style={{
                                                                backgroundColor: theme.colors.primary + '15',
                                                                paddingHorizontal: 12,
                                                                paddingVertical: 6,
                                                                borderRadius: 8,
                                                            }}
                                                        >
                                                            <Text size="sm" style={{ color: theme.colors.primary, fontWeight: '600' }}>ADD</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>

                                            {/* Expanded: Remarks */}
                                            {quantity > 0 && (
                                                <View style={{ marginTop: theme.spacing.sm }}>
                                                    <TouchableOpacity
                                                        onPress={() => setExpandedItemId(isExpanded ? null : product._id)}
                                                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: isExpanded ? 8 : 0 }}
                                                    >
                                                        <Text size="xs" color={theme.colors.primary}>
                                                            {isExpanded ? 'Hide Note' : (itemInOrder?.remarks ? 'Edit Note' : '+ Add Note')}
                                                        </Text>
                                                        {itemInOrder?.remarks && !isExpanded && (
                                                            <Text size="xs" color={theme.colors.textSecondary} style={{ marginLeft: 8, fontStyle: 'italic' }} numberOfLines={1}>
                                                                - {itemInOrder.remarks}
                                                            </Text>
                                                        )}
                                                    </TouchableOpacity>

                                                    {isExpanded && (
                                                        <Input
                                                            placeholder="e.g., No onions, Extra sauce..."
                                                            value={itemInOrder?.remarks || ''}
                                                            onChangeText={(text) => updateItemRemarks(product._id, text)}
                                                            style={{ height: 40, fontSize: 14 }}
                                                        />
                                                    )}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })
                        )}
                    </View>

                    {/* Overall Order Description */}
                    {orderItems.length > 0 && (
                        <View style={{ paddingHorizontal: theme.spacing.lg, marginTop: theme.spacing.xl }}>
                            <Text medium style={{ marginBottom: theme.spacing.sm, fontSize: 15 }}>
                                Overall Order Notes (Optional)
                            </Text>
                            <Input
                                placeholder="e.g., Rush order, Serve together..."
                                value={overallRemarks}
                                onChangeText={setOverallRemarks}
                                multiline
                                numberOfLines={2}
                                editable={!loading}
                            />
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Bar with Total and Submit */}
            {orderItems.length > 0 && (
                <View style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.border,
                    padding: theme.spacing.lg,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: theme.spacing.md,
                    }}>
                        <View>
                            <Text size="sm" color={theme.colors.textSecondary}>Total Amount</Text>
                            <Text medium style={{ fontSize: 24, marginTop: 4 }}>
                                Rs. {getTotal()}
                            </Text>
                        </View>
                        <Text medium color={theme.colors.textSecondary}>
                            {orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}
                        </Text>
                    </View>

                    <Button
                        variant="primary"
                        onPress={handleSubmit}
                        loading={loading}
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        Place Order
                    </Button>
                </View>
            )}

            {/* Confirmation Modal */}
            <ConfirmationModal
                visible={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmOrder}
                title="Confirm Order"
                message="Do you want to place a order?"
                confirmText="Place Order"
                cancelText="Cancel"
            />

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    router.back();
                }}
                title="Success"
                message="Order placed successfully"
                buttonText="OK"
            />
        </View>
    );
}
