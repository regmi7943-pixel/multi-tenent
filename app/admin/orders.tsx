import React, { useState } from 'react';
import { Alert, Modal, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Text } from '../../components/atoms/Text';
import { EmptyState } from '../../components/molecules/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { dashboardStyles } from '../../styles';

import { useFocusEffect } from 'expo-router';
import { CreateOrderForm } from '../../components/organisms/CreateOrderForm';
import { api } from '../../services/api';

export default function OrdersScreen() {
  const { theme } = useTheme();

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [createOrderModalVisible, setCreateOrderModalVisible] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersData, productsData, customersData] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getCustomers()
      ]);

      if (Array.isArray(ordersData)) {
        setOrders(ordersData);
      } else if (ordersData && (ordersData as any).orders) {
        setOrders((ordersData as any).orders);
      }

      if (Array.isArray(productsData)) {
        setProducts(productsData);
      }

      if (customersData && customersData.customers) {
        setCustomers(customersData.customers);
      }
    } catch (error: any) {
      console.error('Failed to fetch data:', error);
      const errorMsg = error?.message || 'Failed to fetch data';
      setError(errorMsg);

      // Show user-friendly alert
      if (errorMsg.includes('Too many requests')) {
        Alert.alert(
          'Too Many Requests',
          'The server is receiving too many requests. Please wait a moment and try again.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          `Failed to load orders: ${errorMsg}`,
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await fetchData();
    } catch (error) {
      // Error is already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  };

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  // Get unique customer names from customers list
  const users = Array.from(new Set(customers.map(c => c.name))).sort();

  const filteredOrders = selectedFilter
    ? orders.filter(o => o.customerName?.toLowerCase() === selectedFilter.toLowerCase())
    : orders;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.contentContainer}>

          {/* Header Actions */}
          <View style={{ flexDirection: 'row', gap: 10, marginVertical: 10 }}>
            <Button
              onPress={() => setFilterModalVisible(true)}
              style={{ flex: 1, elevation: 0, shadowOpacity: 0 }}
              variant="outline"
            >
              Filter Orders
            </Button>
            <Button
              onPress={() => setCreateOrderModalVisible(true)}
              style={{ flex: 1, elevation: 0, shadowOpacity: 0 }}
            >
              Create Order
            </Button>
          </View>

          {/* Active Filter Indicator */}
          {selectedFilter && (
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: theme.colors.primary + '20',
              padding: 12,
              borderRadius: 8,
              marginBottom: 10
            }}>
              <Text style={{ color: theme.colors.primary, fontWeight: '500' }}>
                Filtered by: {selectedFilter}
              </Text>
              <Button
                variant="ghost"
                onPress={() => setSelectedFilter(null)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  elevation: 0,
                  shadowOpacity: 0
                }}
                textStyle={{ color: theme.colors.primary, fontSize: 14 }}
              >
                Clear Filter
              </Button>
            </View>
          )}

          {/* Orders List */}
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading orders...</Text>
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders found"
              description="There are no orders matching your criteria."
              icon="search"
            />
          ) : (
            filteredOrders.map((order, index) => (
              <Card key={order._id} style={{ marginTop: index > 0 ? 16 : 0 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                    Order #{order._id.slice(-6)}
                  </Text>
                  <Text style={{
                    color: order.paymentStatus === 'paid' ? theme.colors.success : theme.colors.warning,
                    fontWeight: '500'
                  }}>
                    {order.paymentStatus?.toUpperCase() || 'PENDING'}
                  </Text>
                </View>
                <Divider style={{ marginVertical: 8 }} />
                <Text>Customer: {order.customerName}</Text>
                <Text style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                  Items: {order.items?.map((item: any) => `${item.product?.name || 'Item'} x${item.quantity}`).join(', ')}
                </Text>
                <Text style={{ marginTop: 4, fontWeight: 'bold' }}>
                  Total: Rs. {order.total}
                </Text>

                <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                  <Button
                    variant="outline"
                    style={{
                      flex: 1,
                      elevation: 0,
                      shadowOpacity: 0
                    }}
                    onPress={() => {
                      setSelectedOrder(order);
                      setStatusModalVisible(true);
                    }}
                  >
                    Update Payment
                  </Button>
                  <Button
                    variant="danger"
                    style={{ flex: 1, elevation: 0, shadowOpacity: 0 }}
                    onPress={() => console.log('Delete', order._id)}
                  >
                    Delete
                  </Button>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderWidth: 0
          }]}>
            <View style={styles.modalHeader}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.colors.text
              }}>
                Filter by User
              </Text>
              <Button
                variant="ghost"
                onPress={() => setFilterModalVisible(false)}
                style={{
                  marginLeft: 'auto',
                  paddingHorizontal: 8,
                  elevation: 0,
                  shadowOpacity: 0
                }}
                textStyle={{ color: theme.colors.primary }}
              >
                Close
              </Button>
            </View>



            <ScrollView style={{ maxHeight: 300 }}>
              {users
                .filter(u => u.toLowerCase().includes(searchName.toLowerCase()))
                .map((name, index) => (
                  <React.Fragment key={name}>
                    <Button
                      variant="ghost"
                      onPress={() => {
                        setSelectedFilter(name);
                        setFilterModalVisible(false);
                      }}
                      style={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        paddingVertical: 12,
                        paddingHorizontal: 8,
                        borderWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0
                      }}
                      textStyle={{
                        color: theme.colors.text,
                        textAlign: 'left',
                        fontWeight: '400'
                      }}
                    >
                      {name}
                    </Button>
                  </React.Fragment>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Create Order Modal */}
      <Modal
        visible={createOrderModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCreateOrderModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, {
            backgroundColor: theme.colors.background,
            height: '90%',
            width: '95%',
            maxWidth: 600,
          }]}>
            <View style={styles.modalHeader}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.text }}>
                Create POS Order
              </Text>
              <Button
                variant="ghost"
                onPress={() => setCreateOrderModalVisible(false)}
                style={{ elevation: 0, shadowOpacity: 0 }}
                textStyle={{ color: theme.colors.primary }}
              >
                Close
              </Button>
            </View>

            <CreateOrderForm
              products={products}
              customers={customers}
              onSubmit={async (data: any) => {
                try {
                  await api.createPOSOrder(data);
                  setCreateOrderModalVisible(false);
                  fetchData();
                } catch (error) {
                  console.error('Failed to create order:', error);
                  alert('Failed to create order');
                }
              }}
              theme={theme}
            />
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        visible={statusModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setStatusModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderWidth: 0,
            padding: 20,
            width: '90%',
            maxWidth: 400,
          }]}>
            <View style={styles.modalHeader}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: theme.colors.text
              }}>
                Update Payment
              </Text>
              <Button
                variant="ghost"
                onPress={() => setStatusModalVisible(false)}
                style={{
                  marginLeft: 'auto',
                  paddingHorizontal: 8,
                  elevation: 0,
                  shadowOpacity: 0
                }}
                textStyle={{ color: theme.colors.primary }}
              >
                Close
              </Button>
            </View>

            <View style={{ marginTop: 16, gap: 10 }}>
              <Button
                onPress={async () => {
                  try {
                    await api.updatePayment(selectedOrder._id, { paymentMethod: 'cash', amountPaid: selectedOrder.total });
                    setStatusModalVisible(false);
                    fetchData();
                  } catch (error) {
                    console.error('Failed to update payment:', error);
                    alert('Failed to update payment');
                  }
                }}
                style={{ elevation: 0, shadowOpacity: 0 }}
              >
                Mark as Paid (Cash)
              </Button>
              <Button
                variant="outline"
                onPress={async () => {
                  try {
                    await api.updatePayment(selectedOrder._id, { paymentMethod: 'credit' });
                    setStatusModalVisible(false);
                    fetchData();
                  } catch (error) {
                    console.error('Failed to update payment:', error);
                    alert('Failed to update payment');
                  }
                }}
                style={{ elevation: 0, shadowOpacity: 0 }}
              >
                Mark as Credit
              </Button>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  ...dashboardStyles,
  modalContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    padding: 20,
  },
  modalContent: {
    padding: 16,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center' as const,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
});
