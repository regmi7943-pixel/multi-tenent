import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, Switch, TextInput, TouchableOpacity, View } from 'react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useTheme } from '../../hooks/useTheme';
import { api, CreateProductData, Product } from '../../services/api';
import { pickAndUploadImage } from '../../services/cloudinary';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

interface AddProductModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
    product?: Product | null;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ visible, onClose, onSuccess, product }) => {
    const { theme } = useTheme();
    const { isMobile } = useResponsive();
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState<CreateProductData>({
        name: '',
        price: 0,
        stock: 0,
        category: '',
        requiresStock: true,
        lowStockThreshold: 5,
        images: [],
    });

    useEffect(() => {
        if (visible) {
            if (product) {
                setFormData({
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    category: product.category,
                    requiresStock: product.requiresStock,
                    lowStockThreshold: product.lowStockThreshold,
                    images: product.images || [],
                });
            } else {
                setFormData({
                    name: '',
                    price: 0,
                    stock: 0,
                    category: '',
                    requiresStock: true,
                    lowStockThreshold: 5,
                    images: [],
                });
            }
        }
    }, [visible, product]);

    const handleImageUpload = async () => {
        setUploadingImage(true);
        try {
            const result = await pickAndUploadImage();
            if (result.success && result.url) {
                setFormData({ ...formData, images: [result.url] });
            } else {
                alert(result.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploadingImage(false);
        }
    };

    const removeImage = () => {
        setFormData({ ...formData, images: [] });
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.category || formData.price <= 0) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            if (product) {
                await api.updateProduct(product._id, formData);
            } else {
                await api.createProduct(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: isMobile ? 'flex-end' : 'center',
                alignItems: isMobile ? 'stretch' : 'center',
                padding: isMobile ? 0 : 20,
            }}>
                <View style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: isMobile ? 0 : 16,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    height: isMobile ? '90%' : 'auto',
                    maxHeight: isMobile ? '90%' : '80%',
                    width: isMobile ? '100%' : 500,
                    maxWidth: '100%',
                    padding: 20,
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <Heading level="h2">{product ? 'Edit Product' : 'Add New Product'}</Heading>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Name */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8, fontWeight: '600' }}>Product Name *</Text>
                            <TextInput
                                style={{
                                    backgroundColor: theme.colors.background,
                                    padding: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }}
                                placeholder="e.g. Chicken Burger"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                            />
                        </View>

                        {/* Category */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8, fontWeight: '600' }}>Category *</Text>
                            <TextInput
                                style={{
                                    backgroundColor: theme.colors.background,
                                    padding: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }}
                                placeholder="e.g. Fast Food"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={formData.category}
                                onChangeText={(text) => setFormData({ ...formData, category: text })}
                            />
                        </View>

                        {/* Image Upload */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8, fontWeight: '600' }}>Product Image</Text>
                            {formData.images.length > 0 ? (
                                <View>
                                    <Image
                                        source={{ uri: formData.images[0] }}
                                        style={{
                                            width: '100%',
                                            height: 200,
                                            borderRadius: 8,
                                            marginBottom: 8
                                        }}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity
                                        onPress={removeImage}
                                        style={{
                                            backgroundColor: theme.colors.error,
                                            padding: 12,
                                            borderRadius: 8,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ color: '#fff', fontWeight: '600' }}>Remove Image</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={handleImageUpload}
                                    disabled={uploadingImage}
                                    style={{
                                        backgroundColor: theme.colors.background,
                                        padding: 40,
                                        borderRadius: 8,
                                        borderWidth: 2,
                                        borderColor: theme.colors.border,
                                        borderStyle: 'dashed',
                                        alignItems: 'center',
                                    }}
                                >
                                    {uploadingImage ? (
                                        <>
                                            <ActivityIndicator color={theme.colors.primary} />
                                            <Text style={{ color: theme.colors.textSecondary, marginTop: 8 }}>
                                                Uploading...
                                            </Text>
                                        </>
                                    ) : (
                                        <>
                                            <Ionicons name="cloud-upload-outline" size={40} color={theme.colors.textSecondary} />
                                            <Text style={{ color: theme.colors.text, marginTop: 8, fontWeight: '600' }}>
                                                Tap to upload an image
                                            </Text>
                                            <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 }}>
                                                Optional
                                            </Text>
                                        </>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Price */}
                        <View style={{ marginBottom: 16 }}>
                            <Text style={{ marginBottom: 8, fontWeight: '600' }}>Price (Rs.) *</Text>
                            <TextInput
                                style={{
                                    backgroundColor: theme.colors.background,
                                    padding: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: theme.colors.border,
                                    color: theme.colors.text
                                }}
                                placeholder="0.00"
                                placeholderTextColor={theme.colors.textSecondary}
                                keyboardType="numeric"
                                value={formData.price.toString()}
                                onChangeText={(text) => setFormData({ ...formData, price: parseFloat(text) || 0 })}
                            />
                        </View>

                        {/* Stock Management Switch */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <Text style={{ fontWeight: '600' }}>Track Stock?</Text>
                            <Switch
                                value={formData.requiresStock}
                                onValueChange={(value) => setFormData({ ...formData, requiresStock: value })}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                thumbColor="#fff"
                            />
                        </View>

                        {/* Stock Fields (Conditional) */}
                        {formData.requiresStock && (
                            <View style={{ flexDirection: 'row', gap: 16 }}>
                                <View style={{ flex: 1, marginBottom: 16 }}>
                                    <Text style={{ marginBottom: 8, fontWeight: '600' }}>Initial Stock</Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.text
                                        }}
                                        placeholder="0"
                                        placeholderTextColor={theme.colors.textSecondary}
                                        keyboardType="numeric"
                                        value={formData.stock.toString()}
                                        onChangeText={(text) => setFormData({ ...formData, stock: parseInt(text) || 0 })}
                                    />
                                </View>
                                <View style={{ flex: 1, marginBottom: 16 }}>
                                    <Text style={{ marginBottom: 8, fontWeight: '600' }}>Low Stock Alert</Text>
                                    <TextInput
                                        style={{
                                            backgroundColor: theme.colors.background,
                                            padding: 12,
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: theme.colors.border,
                                            color: theme.colors.text
                                        }}
                                        placeholder="5"
                                        placeholderTextColor={theme.colors.textSecondary}
                                        keyboardType="numeric"
                                        value={formData.lowStockThreshold.toString()}
                                        onChangeText={(text) => setFormData({ ...formData, lowStockThreshold: parseInt(text) || 0 })}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Submit Button */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: theme.colors.primary,
                                padding: 16,
                                borderRadius: 8,
                                alignItems: 'center',
                                marginTop: 20,
                                marginBottom: 40
                            }}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                                    {product ? 'Update Product' : 'Add Product'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default AddProductModal;