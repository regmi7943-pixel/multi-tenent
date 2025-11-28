import React, { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Text } from '../../components/atoms/Text';
import { EmptyState } from '../../components/molecules/EmptyState';
import { useTheme } from '../../hooks/useTheme';
import { dashboardStyles } from '../../styles';

export default function OrdersScreen() {
  const { theme } = useTheme();

  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const statusOptions = ['Pending', 'In Progress', 'Completed', 'Cancelled'];

  // Dummy user list (replace with API data)
  const users = ['Test', 'Ram', 'Shyam', 'Hari', 'Customer'];

  // Dummy order list (replace with API)
  const orders = [
    {
      id: 1,
      table: 1,
      username: 'Test',
      items: 'Fries x2 | Extra Spice',
      status: 'Pending'
    },
    {
      id: 2,
      table: 4,
      username: 'Ram',
      items: 'Momo x1 | Coke x1',
      status: 'Preparing'
    }
  ];

  const filteredOrders = selectedFilter
    ? orders.filter(o => o.username.toLowerCase() === selectedFilter.toLowerCase())
    : orders;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background, flex: 1 }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.contentContainer}>

          {/* Filter Button */}
          <Button 
            onPress={() => setFilterModalVisible(true)}
            style={{ marginVertical: 10 }}
          >
            Filter Orders
          </Button>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <EmptyState 
              title="No orders found"
              description="There are no orders matching your criteria."
              icon="search"
            />
          ) : (
            filteredOrders.map((order, index) => (
              <Card key={order.id} style={{ marginTop: index > 0 ? 16 : 0 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                  Table: {order.table}
                </Text>
                <Divider style={{ marginVertical: 8 }} />
                <Text>Username: {order.username}</Text>
                <Text style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                  Items: {order.items}
                </Text>
                <Text style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                  Status: {order.status}
                </Text>

                <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
                  <Button 
                    variant="outline" 
                    style={{ 
                      flex: 1,
                      elevation: 0, // Removes shadow on Android
                      shadowOpacity: 0, // Removes shadow on iOS
                      shadowRadius: 0, // Removes shadow on iOS
                      shadowOffset: { width: 0, height: 0 }, // Removes shadow on iOS
                    }}
                    onPress={() => {
                      setSelectedOrder(order);
                      setStatusModalVisible(true);
                    }}
                  >
                    Update Status
                  </Button>
                  <Button 
                    variant="danger" 
                    style={{ flex: 1 }}
                    onPress={() => console.log('Delete', order.id)}
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
                Update Order Status
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
            
            <View style={{ marginTop: 16 }}>
              {statusOptions.map((status) => (
                <React.Fragment key={status}>
                  <Button
                    variant="ghost"
                    onPress={() => {
                      // Here you would typically update the order status in your state/API
                      console.log(`Updating order ${selectedOrder?.id} to status: ${status}`);
                      // Update the order status in your state here
                      setStatusModalVisible(false);
                    }}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      paddingVertical: 16,
                      paddingHorizontal: 8,
                      borderWidth: 0,
                      elevation: 0,
                      shadowOpacity: 0,
                      backgroundColor: 'transparent'
                    }}
                    textStyle={{ 
                      color: status === 'Cancelled' ? '#FF3B30' : theme.colors.text,
                      textAlign: 'left',
                      fontSize: 16
                    }}
                  >
                    {status}
                  </Button>
                </React.Fragment>
              ))}
              
              <Button
                variant="ghost"
                onPress={() => setStatusModalVisible(false)}
                style={{
                  marginTop: 8,
                  elevation: 0,
                  shadowOpacity: 0,
                  borderWidth: 0,
                  backgroundColor: 'transparent'
                }}
                textStyle={{ 
                  color: '#FF3B30',
                  fontWeight: '500',
                  fontSize: 16
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      
    </View>
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
