import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Image as RNImage, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/atoms/Card';
import { Heading } from '../../components/atoms/Heading';
import { Text } from '../../components/atoms/Text';
import { ConfirmationModal } from '../../components/molecules/ConfirmationModal';
import { AddProductModal } from '../../components/organisms/AddProductModal';
import { useTheme } from '../../hooks/useTheme';
import { api, Product } from '../../services/api';

export default function InventoryScreen() {
    const { theme } = useTheme();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data);

            // Extract unique categories
            const uniqueCategories = [...new Set(data.map(product => product.category))];
            setCategories(uniqueCategories);
            setFilteredProducts(data);

            console.log('Available Categories:', uniqueCategories);
            console.log('Total Products:', data.length);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedCategory === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selectedCategory));
        }
    }, [selectedCategory, products]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchProducts();
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowAddModal(true);
    };

    const handleDelete = (id: string) => {
        setProductToDelete(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = async () => {
        if (!productToDelete) return;

        console.log('Delete confirmed for ID:', productToDelete);
        try {
            await api.deleteProduct(productToDelete);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        } finally {
            setDeleteModalVisible(false);
            setProductToDelete(null);
        }
    };

    const renderProductItem = ({ item }: { item: Product }) => (
        <Card style={{ marginBottom: theme.spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Product Image */}
            {item.images && item.images.length > 0 ? (
                <RNImage
                    source={{ uri: item.images[0] }}
                    style={{
                        width: 80,
                        height: 80,
                        borderRadius: 8,
                    }}
                    resizeMode="cover"
                />
            ) : (
                <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    backgroundColor: theme.colors.border,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Ionicons name="image-outline" size={32} color={theme.colors.textSecondary} />
                </View>
            )}

            {/* Product Info */}
            <View style={{ flex: 1 }}>
                <Heading level="h3">{item.name}</Heading>
                <Text style={{ color: theme.colors.textSecondary, marginTop: 4 }}>
                    {item.category}
                </Text>
                <Text style={{ color: theme.colors.primary, fontWeight: 'bold', marginTop: 4 }}>
                    Rs. {item.price}
                </Text>
            </View>

            {/* Actions & Stock Badge */}
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
                <View style={{
                    backgroundColor: item.requiresStock && item.stock <= item.lowStockThreshold ? theme.colors.error + '20' : theme.colors.success + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                }}>
                    <Text style={{
                        color: item.requiresStock && item.stock <= item.lowStockThreshold ? theme.colors.error : theme.colors.success,
                        fontSize: 12,
                        fontWeight: '600'
                    }}>
                        {item.requiresStock ? `Stock: ${item.stock}` : 'Unlimited'}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                        onPress={() => handleEdit(item)}
                        style={{
                            padding: 8,
                            backgroundColor: theme.colors.surface,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: theme.colors.border,
                        }}
                    >
                        <Ionicons name="pencil" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            console.log('Delete button pressed for item:', item._id);
                            handleDelete(item._id);
                        }}
                        style={{
                            padding: 8,
                            backgroundColor: theme.colors.error + '10',
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: theme.colors.error + '30',
                        }}
                    >
                        <Ionicons name="trash" size={16} color={theme.colors.error} />
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.md }}>
                <Text style={{
                    fontSize: 28,
                    fontWeight: '700',
                    color: theme.colors.text,
                    letterSpacing: -0.5,
                }}>
                    Inventory
                </Text>
                <Text style={{
                    color: theme.colors.textSecondary,
                    marginTop: 4,
                    fontSize: 14,
                }}>
                    Manage your products and stock
                </Text>
            </View>

            {/* Category Filters */}
            <View style={{ paddingLeft: theme.spacing.lg, marginBottom: theme.spacing.md }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 8, paddingRight: theme.spacing.lg }}
                >
                    <TouchableOpacity
                        onPress={() => setSelectedCategory('All')}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            backgroundColor: selectedCategory === 'All' ? theme.colors.primary : theme.colors.surface,
                            borderWidth: 1,
                            borderColor: selectedCategory === 'All' ? theme.colors.primary : theme.colors.border,
                        }}
                    >
                        <Text style={{
                            color: selectedCategory === 'All' ? '#fff' : theme.colors.text,
                            fontWeight: '600',
                            fontSize: 14,
                        }}>
                            All ({products.length})
                        </Text>
                    </TouchableOpacity>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            onPress={() => setSelectedCategory(category)}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                borderRadius: 20,
                                backgroundColor: selectedCategory === category ? theme.colors.primary : theme.colors.surface,
                                borderWidth: 1,
                                borderColor: selectedCategory === category ? theme.colors.primary : theme.colors.border,
                            }}
                        >
                            <Text style={{
                                color: selectedCategory === category ? '#fff' : theme.colors.text,
                                fontWeight: '600',
                                fontSize: 14,
                            }}>
                                {category} ({products.filter(p => p.category === category).length})
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 100 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                    }
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 50 }}>
                            <Text style={{ color: theme.colors.textSecondary }}>No products found in this category</Text>
                        </View>
                    }
                />
            )}

            {/* Floating Action Button */}
            <View style={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                left: 0,
                alignItems: 'flex-end',
                pointerEvents: 'box-none',
            }}>
                <TouchableOpacity
                    style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: theme.colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        elevation: 6,
                        shadowColor: theme.colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4,
                    }}
                    onPress={() => {
                        setEditingProduct(null);
                        setShowAddModal(true);
                    }}
                >
                    <Ionicons name="add" size={30} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <AddProductModal
                visible={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                }}
                onSuccess={fetchProducts}
                product={editingProduct}
            />

            <ConfirmationModal
                visible={deleteModalVisible}
                onClose={() => {
                    setDeleteModalVisible(false);
                    setProductToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
            />
        </View>
    );
}
