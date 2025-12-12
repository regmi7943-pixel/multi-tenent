import React, { useRef, useState } from 'react';
import { Alert, Modal, RefreshControl, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Input } from '../../components/atoms/Input';
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
  // const [searchName, setSearchName] = useState(''); // Removed
  // const [selectedFilter, setSelectedFilter] = useState<string | null>(null); // Removed
  const [sourceFilter, setSourceFilter] = useState<'all' | 'pos' | 'waiter-app'>('all');
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [createOrderModalVisible, setCreateOrderModalVisible] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent duplicate requests
  const isFetchingRef = useRef(false);
  const lastFetchTimeRef = useRef(0);
  const hasInitiallyLoadedRef = useRef(false);

  const fetchData = async (force: boolean = false, filter: 'all' | 'pos' | 'waiter-app' = sourceFilter) => {
    // Prevent duplicate simultaneous requests
    if (isFetchingRef.current) {
      console.log('Fetch already in progress, skipping...');
      return;
    }

    // Prevent fetching too frequently (minimum 30 seconds between auto-fetches)
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTimeRef.current;
    if (!force && timeSinceLastFetch < 30000 && lastFetchTimeRef.current > 0) {
      console.log(`Last fetch was ${Math.round(timeSinceLastFetch / 1000)}s ago, skipping...`);
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      // Choose endpoint based on filter
      const ordersPromise = filter === 'waiter-app'
        ? api.getMyOrders()
        : api.getOrders();

      const [ordersData, productsData, customersData] = await Promise.all([
        ordersPromise,
        api.getProducts(),
        api.getCustomers()
      ]);

      lastFetchTimeRef.current = Date.now();

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
      isFetchingRef.current = false;
    }
  };

  // Only fetch on initial mount, not on every focus
  useFocusEffect(
    React.useCallback(() => {
      if (!hasInitiallyLoadedRef.current) {
        hasInitiallyLoadedRef.current = true;
        fetchData(true);
      }
    }, [])
  );

  // Refetch when source filter changes
  React.useEffect(() => {
    if (hasInitiallyLoadedRef.current) {
      fetchData(true, sourceFilter);
    }
  }, [sourceFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    setError(null);
    try {
      await fetchData(true); // Force fetch on manual refresh
    } catch (error) {
      // Error is already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  };

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  // Removed users calculation

  const filteredOrders = orders.filter(o => {
    // If we fetched waiter orders, no need to filter
    if (sourceFilter === 'waiter-app') return true;

    // If showing all, show everything
    if (sourceFilter === 'all') return true;

    // If showing POS only, filter by source
    return o.source === sourceFilter;
  });

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
          {(sourceFilter !== 'all') && (
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
                Filtered by: {sourceFilter === 'pos' ? 'Admin' : 'Waiter'}
              </Text>
              <Button
                variant="ghost"
                onPress={() => {
                  setSourceFilter('all');
                }}
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
            filteredOrders.map((order, index) => {
              // Debug: Log first order to see structure
              if (index === 0) {
                console.log('First order structure:', JSON.stringify(order, null, 2));
              }
              return (
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
                  {/* Display table number for waiter orders, customer name for admin orders */}
                  {order.source === 'waiter-app' ? (
                    <Text>Table: {order.tableNo || 'N/A'}</Text>
                  ) : (
                    <Text>Customer: {order.customerName || 'N/A'}</Text>
                  )}
                  <Text style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                    Items: {order.items?.map((item: any) => {
                      const itemText = `${item.product?.name || 'Item'} x${item.quantity}`;
                      return item.remarks ? `${itemText} (${item.remarks})` : itemText;
                    }).join(', ')}
                  </Text>
                  {order.remarks && (
                    <Text style={{ marginTop: 4, color: theme.colors.textSecondary, fontStyle: 'italic' }}>
                      Note: {order.remarks}
                    </Text>
                  )}
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
              );
            })
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
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', paddingTop: 60 }]}>
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
                Filter by Source
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



            <View style={{ marginBottom: 20 }}>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  variant={sourceFilter === 'all' ? 'primary' : 'outline'}
                  onPress={() => setSourceFilter('all')}
                  style={{ flex: 1, paddingVertical: 8 }}
                  textStyle={{ fontSize: 12 }}
                >
                  All
                </Button>
                <Button
                  variant={sourceFilter === 'pos' ? 'primary' : 'outline'}
                  onPress={() => setSourceFilter('pos')}
                  style={{ flex: 1, paddingVertical: 8 }}
                  textStyle={{ fontSize: 12 }}
                >
                  Admin
                </Button>
                <Button
                  variant={sourceFilter === 'waiter-app' ? 'primary' : 'outline'}
                  onPress={() => setSourceFilter('waiter-app')}
                  style={{ flex: 1, paddingVertical: 8 }}
                  textStyle={{ fontSize: 12 }}
                >
                  Waiter
                </Button>
              </View>
            </View>


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
                  fetchData(true); // Force refresh after creating new order
                } catch (error) {
                  console.error('Failed to create order:', error);
                  alert('Failed to create order');
                }
              }}
              theme={theme}
              userRole={api.getUser()?.role}
            />
          </View>
        </View>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        visible={statusModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => {
          setStatusModalVisible(false);
          setPaymentAmount('');
        }}
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
                onPress={() => {
                  setStatusModalVisible(false);
                  setPaymentAmount('');
                }}
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

            {selectedOrder && (
              <>
                {/* Order Summary */}
                <View style={{
                  backgroundColor: theme.colors.surface,
                  padding: 12,
                  borderRadius: 8,
                  marginBottom: 16
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: theme.colors.textSecondary }}>Order Total:</Text>
                    <Text style={{ fontWeight: '600' }}>Rs. {selectedOrder.total}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ color: theme.colors.textSecondary }}>Amount Paid:</Text>
                    <Text style={{ fontWeight: '600' }}>Rs. {selectedOrder.amountPaid || 0}</Text>
                  </View>
                  <Divider style={{ marginVertical: 8 }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold' }}>Remaining:</Text>
                    <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>
                      Rs. {selectedOrder.total - (selectedOrder.amountPaid || 0)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={{ color: theme.colors.textSecondary }}>Status:</Text>
                    <Text style={{
                      fontWeight: '600',
                      color: selectedOrder.paymentStatus === 'paid' ? theme.colors.success :
                        selectedOrder.paymentStatus === 'partial' ? theme.colors.warning :
                          theme.colors.error
                    }}>
                      {selectedOrder.paymentStatus?.toUpperCase() || 'PENDING'}
                    </Text>
                  </View>
                </View>

                {/* Only show payment options for admin orders with customers */}
                {selectedOrder.source === 'pos' && (
                  <>
                    {/* Cash Payment Section */}
                    <Text variant="label" style={{ marginBottom: 8 }}>Cash Payment</Text>
                    <Input
                      value={paymentAmount}
                      onChangeText={setPaymentAmount}
                      placeholder={`Enter amount (Max: Rs. ${selectedOrder.total - (selectedOrder.amountPaid || 0)})`}
                      keyboardType="numeric"
                      containerStyle={{ marginBottom: 12 }}
                    />

                    <View style={{ gap: 10 }}>
                      {/* Pay Custom Amount */}
                      <Button
                        onPress={async () => {
                          const amount = parseFloat(paymentAmount);
                          if (!amount || amount <= 0) {
                            Alert.alert('Error', 'Please enter a valid amount');
                            return;
                          }
                          const remaining = selectedOrder.total - (selectedOrder.amountPaid || 0);
                          if (amount > remaining) {
                            Alert.alert('Error', `Amount cannot exceed remaining balance of Rs. ${remaining}`);
                            return;
                          }
                          try {
                            await api.updatePayment(selectedOrder._id, {
                              paymentMethod: 'cash',
                              amountPaid: amount
                            });
                            setStatusModalVisible(false);
                            setPaymentAmount('');
                            Alert.alert('Success', 'Payment updated successfully. Pull down to refresh the list.');
                          } catch (error) {
                            console.error('Failed to update payment:', error);
                            Alert.alert('Error', 'Failed to update payment');
                          }
                        }}
                        style={{ elevation: 0, shadowOpacity: 0 }}
                      >
                        Pay Partial Amount
                      </Button>

                      {/* Pay Full Amount (Cash) */}
                      {(selectedOrder.amountPaid || 0) < selectedOrder.total && (
                        <Button
                          variant="outline"
                          onPress={async () => {
                            const remaining = selectedOrder.total - (selectedOrder.amountPaid || 0);
                            try {
                              await api.updatePayment(selectedOrder._id, {
                                paymentMethod: 'cash',
                                amountPaid: remaining
                              });
                              setStatusModalVisible(false);
                              setPaymentAmount('');
                              Alert.alert('Success', 'Payment updated successfully. Pull down to refresh the list.');
                            } catch (error) {
                              console.error('Failed to update payment:', error);
                              Alert.alert('Error', 'Failed to update payment');
                            }
                          }}
                          style={{ elevation: 0, shadowOpacity: 0 }}
                        >
                          Pay Full Amount (Rs. {selectedOrder.total - (selectedOrder.amountPaid || 0)})
                        </Button>
                      )}

                      <Divider style={{ marginVertical: 8 }} />

                      {/* Add to Credit */}
                      <Button
                        variant="outline"
                        onPress={async () => {
                          try {
                            await api.updatePayment(selectedOrder._id, { paymentMethod: 'credit' });
                            setStatusModalVisible(false);
                            setPaymentAmount('');
                            Alert.alert('Success', 'Order added to customer credit. Pull down to refresh the list.');
                          } catch (error) {
                            console.error('Failed to update payment:', error);
                            Alert.alert('Error', 'Failed to update payment');
                          }
                        }}
                        style={{ elevation: 0, shadowOpacity: 0 }}
                        textStyle={{ color: theme.colors.warning }}
                      >
                        Add Remaining to Credit
                      </Button>
                    </View>
                  </>
                )}

                {/* Waiter orders - simpler payment options */}
                {selectedOrder.source === 'waiter-app' && (
                  <View style={{ gap: 10 }}>
                    <Text variant="caption" style={{ color: theme.colors.textSecondary, marginBottom: 8 }}>
                      This is a waiter order. Payment tracking is limited.
                    </Text>
                    <Button
                      onPress={async () => {
                        try {
                          await api.updatePayment(selectedOrder._id, {
                            paymentMethod: 'cash',
                            amountPaid: selectedOrder.total
                          });
                          setStatusModalVisible(false);
                          Alert.alert('Success', 'Payment updated successfully. Pull down to refresh the list.');
                        } catch (error) {
                          console.error('Failed to update payment:', error);
                          Alert.alert('Error', 'Failed to update payment');
                        }
                      }}
                      style={{ elevation: 0, shadowOpacity: 0 }}
                    >
                      Mark as Paid (Cash)
                    </Button>
                  </View>
                )}
              </>
            )}
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
