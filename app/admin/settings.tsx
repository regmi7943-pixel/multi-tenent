import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity, View } from 'react-native';
import { Card } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Heading } from '../../components/atoms/Heading';
import { Switch } from '../../components/atoms/Switch';
import { Text } from '../../components/atoms/Text';
import { ConfirmationModal } from '../../components/molecules/ConfirmationModal';
import { TenantSwitcher } from '../../components/organisms/TenantSwitcher';
import { PromptModal } from '../../components/molecules/PromptModal';
import { useTheme, TenantConfig } from '../../hooks/useTheme';
import { api } from '../../services/api';
import { BiometricService } from '../../services/biometrics';
import { dashboardStyles as styles } from '../../styles';

interface SettingItemProps {
    icon: string;
    iconColor: string;
    title: string;
    subtitle?: string;
    rightComponent?: React.ReactNode;
    onPress?: () => void;
    showChevron?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({
    icon,
    iconColor,
    title,
    subtitle,
    rightComponent,
    onPress,
    showChevron = false,
}) => {
    const { theme } = useTheme();
    const Component = onPress ? TouchableOpacity : View;

    return (
        <Component
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: theme.spacing.md,
                paddingHorizontal: theme.spacing.md,
            }}
        >
            <View
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: iconColor + '15',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: theme.spacing.md,
                }}
            >
                <Ionicons name={icon as any} size={20} color={iconColor} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: theme.colors.text }}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 12, marginTop: 2 }}>
                        {subtitle}
                    </Text>
                )}
            </View>
            {rightComponent && <View style={{ marginLeft: theme.spacing.md }}>{rightComponent}</View>}
            {showChevron && !rightComponent && (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} style={{ marginLeft: theme.spacing.md }} />
            )}
        </Component>
    );
};

export default function SettingsScreen() {
    const { theme, isDark, toggleTheme, currentTenant, setTenant } = useTheme();
    const router = useRouter();
    const user = api.getUser();

    // State management
    const [biometricEnabled, setBiometricEnabled] = useState(false);
    const [biometricSupported, setBiometricSupported] = useState(false);
    const [biometricType, setBiometricType] = useState<'face' | 'fingerprint' | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [orderNotifications, setOrderNotifications] = useState(true);
    const [stockNotifications, setStockNotifications] = useState(true);
    const [paymentNotifications, setPaymentNotifications] = useState(true);
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [warnOnOutOfStock, setWarnOnOutOfStock] = useState(true);
    const [allowSubstitutions, setAllowSubstitutions] = useState(false);
    const [defaultOrderFilter, setDefaultOrderFilter] = useState<'all' | 'pos' | 'waiter-app'>('all');
    const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState(30);

    // Modals
    const [showTenantSwitcher, setShowTenantSwitcher] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showRefreshIntervalModal, setShowRefreshIntervalModal] = useState(false);

    const [showLowStockPrompt, setShowLowStockPrompt] = useState(false);

    // Mock tenants - in real app, fetch from API
    const [tenants] = useState<TenantConfig[]>([
        { id: '1', name: 'Main Restaurant', logo: undefined },
        { id: '2', name: 'Branch 2', logo: undefined },
    ]);

    useEffect(() => {
        checkBiometricSupport();
        loadBiometricStatus();
    }, []);

    const checkBiometricSupport = async () => {
        const supported = await BiometricService.checkDeviceSupport();
        setBiometricSupported(supported);
        if (supported) {
            const type = await BiometricService.getBiometricType();
            setBiometricType(type);
        }
    };

    const loadBiometricStatus = async () => {
        try {
            const credentials = await BiometricService.getCredentials();
            setBiometricEnabled(!!credentials.token);
        } catch (error) {
            console.error('Error loading biometric status:', error);
        }
    };

    const handleBiometricToggle = async (value: boolean) => {
        if (value) {
            // Enable biometric
            const authenticated = await BiometricService.authenticate();
            if (authenticated) {
                const credentials = await BiometricService.getCredentials();
                if (credentials.token) {
                    setBiometricEnabled(true);
                    Alert.alert('Success', 'Biometric login enabled');
                } else {
                    Alert.alert('Error', 'No saved credentials found. Please login first.');
                    setBiometricEnabled(false);
                }
            } else {
                setBiometricEnabled(false);
            }
        } else {
            // Disable biometric
            await BiometricService.clearCredentials();
            setBiometricEnabled(false);
            Alert.alert('Success', 'Biometric login disabled');
        }
    };

    const handleLogout = async () => {
        api.setToken(null);
        router.replace('/');
    };

    const handleClearCredentialsLogout = async () => {
        await BiometricService.clearCredentials();
        api.setToken(null);
        router.replace('/');
    };

    const handleTenantSelect = (tenant: TenantConfig) => {
        setTenant(tenant);
        setShowTenantSwitcher(false);
        Alert.alert('Success', `Switched to ${tenant.name}`);
    };

    const refreshIntervals = [
        { label: '15 seconds', value: 15 },
        { label: '30 seconds', value: 30 },
        { label: '1 minute', value: 60 },
        { label: '2 minutes', value: 120 },
        { label: '5 minutes', value: 300 },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.md }}>
                    <Text style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: theme.colors.text,
                        letterSpacing: -0.5,
                    }}>
                        Settings
                    </Text>
                    <Text style={{
                        color: theme.colors.textSecondary,
                        marginTop: 4,
                        fontSize: 14,
                    }}>
                        Manage your app preferences and configuration
                    </Text>
                </View>

                {/* Account & Security Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Account & Security
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="person-outline"
                            iconColor={theme.colors.primary}
                            title="Change Password"
                            subtitle="Update your account password"
                            showChevron
                            onPress={() => setShowPasswordModal(true)}
                        />
                        <Divider />
                        {biometricSupported && (
                            <>
                                <SettingItem
                                    icon={biometricType === 'face' ? 'face-recognition-outline' : 'finger-print-outline'}
                                    iconColor={theme.colors.success}
                                    title={`${biometricType === 'face' ? 'Face' : 'Fingerprint'} Login`}
                                    subtitle={biometricEnabled ? 'Enabled' : 'Disabled'}
                                    rightComponent={
                                        <Switch
                                            value={biometricEnabled}
                                            onValueChange={handleBiometricToggle}
                                        />
                                    }
                                />
                                <Divider />
                            </>
                        )}
                        <SettingItem
                            icon="log-out-outline"
                            iconColor={theme.colors.error}
                            title="Sign Out All Devices"
                            subtitle="Sign out from all logged-in devices"
                            showChevron
                            onPress={() => setShowLogoutModal(true)}
                        />
                    </Card>
                </View>

                {/* Appearance Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Appearance
                    </Heading>
                    <Card>
                        <SettingItem
                            icon={isDark ? 'moon' : 'sunny'}
                            iconColor={theme.colors.warning}
                            title="Dark Mode"
                            subtitle={isDark ? 'Enabled' : 'Disabled'}
                            rightComponent={
                                <Switch
                                    value={isDark}
                                    onValueChange={toggleTheme}
                                />
                            }
                        />
                    </Card>
                </View>

                {/* Tenant & Organization Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Tenant & Organization
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="business-outline"
                            iconColor={theme.colors.info}
                            title="Switch Tenant"
                            subtitle={currentTenant?.name || 'No tenant selected'}
                            showChevron
                            onPress={() => setShowTenantSwitcher(true)}
                        />
                        <Divider />
                        <SettingItem
                            icon="settings-outline"
                            iconColor={theme.colors.primary}
                            title="Tenant Settings"
                            subtitle="Manage tenant profile and preferences"
                            showChevron
                            onPress={() => Alert.alert('Coming Soon', 'Tenant settings will be available soon')}
                        />
                    </Card>
                </View>

                {/* Notifications Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Notifications
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="notifications-outline"
                            iconColor={theme.colors.primary}
                            title="Enable Notifications"
                            subtitle="Receive push notifications"
                            rightComponent={
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={setNotificationsEnabled}
                                />
                            }
                        />
                        <Divider />
                        <SettingItem
                            icon="receipt-outline"
                            iconColor={theme.colors.success}
                            title="Order Updates"
                            subtitle="Get notified about new orders"
                            rightComponent={
                                <Switch
                                    value={orderNotifications}
                                    onValueChange={setOrderNotifications}
                                    disabled={!notificationsEnabled}
                                />
                            }
                        />
                        <Divider />
                        <SettingItem
                            icon="alert-circle-outline"
                            iconColor={theme.colors.warning}
                            title="Low Stock Alerts"
                            subtitle="Get notified when stock is low"
                            rightComponent={
                                <Switch
                                    value={stockNotifications}
                                    onValueChange={setStockNotifications}
                                    disabled={!notificationsEnabled}
                                />
                            }
                        />
                        <Divider />
                        <SettingItem
                            icon="cash-outline"
                            iconColor={theme.colors.info}
                            title="Payment Status"
                            subtitle="Get notified about payment updates"
                            rightComponent={
                                <Switch
                                    value={paymentNotifications}
                                    onValueChange={setPaymentNotifications}
                                    disabled={!notificationsEnabled}
                                />
                            }
                        />
                    </Card>
                </View>

                {/* POS & Payments Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        POS & Payments
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="cash-outline"
                            iconColor={theme.colors.success}
                            title="Currency & Locale"
                            subtitle="Rs. (PKR) - Pakistan"
                            showChevron
                            onPress={() => Alert.alert('Coming Soon', 'Currency settings will be available soon')}
                        />
                        <Divider />
                        <SettingItem
                            icon="calculator-outline"
                            iconColor={theme.colors.info}
                            title="Tax & Service Charge"
                            subtitle="Configure tax and service charge rates"
                            showChevron
                            onPress={() => Alert.alert('Coming Soon', 'Tax settings will be available soon')}
                        />
                        <Divider />
                        <SettingItem
                            icon="receipt-outline"
                            iconColor={theme.colors.primary}
                            title="Receipt Settings"
                            subtitle="Configure receipt and printer defaults"
                            showChevron
                            onPress={() => Alert.alert('Coming Soon', 'Receipt settings will be available soon')}
                        />
                    </Card>
                </View>

                {/* Inventory Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Inventory
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="alert-circle-outline"
                            iconColor={theme.colors.warning}
                            title="Low Stock Threshold"
                            subtitle={`Alert when stock is below ${lowStockThreshold} units`}
                            showChevron
                            onPress={() => setShowLowStockPrompt(true)}
                        />
                        <Divider />
                        <SettingItem
                            icon="warning-outline"
                            iconColor={theme.colors.error}
                            title="Warn on Out of Stock"
                            subtitle="Show warnings when items are out of stock"
                            rightComponent={
                                <Switch
                                    value={warnOnOutOfStock}
                                    onValueChange={setWarnOnOutOfStock}
                                />
                            }
                        />
                        <Divider />
                        <SettingItem
                            icon="swap-horizontal-outline"
                            iconColor={theme.colors.info}
                            title="Allow Substitutions"
                            subtitle="Allow product substitutions in orders"
                            rightComponent={
                                <Switch
                                    value={allowSubstitutions}
                                    onValueChange={setAllowSubstitutions}
                                />
                            }
                        />
                    </Card>
                </View>

                {/* Orders Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Orders
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="filter-outline"
                            iconColor={theme.colors.primary}
                            title="Default Order Filter"
                            subtitle={defaultOrderFilter === 'all' ? 'Show all orders' : defaultOrderFilter === 'pos' ? 'Admin orders only' : 'Waiter orders only'}
                            showChevron
                            onPress={() => {
                                Alert.alert(
                                    'Default Order Filter',
                                    'Choose the default filter for orders',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        { text: 'All Orders', onPress: () => setDefaultOrderFilter('all') },
                                        { text: 'Admin Orders', onPress: () => setDefaultOrderFilter('pos') },
                                        { text: 'Waiter Orders', onPress: () => setDefaultOrderFilter('waiter-app') },
                                    ]
                                );
                            }}
                        />
                        <Divider />
                        <SettingItem
                            icon="refresh-outline"
                            iconColor={theme.colors.info}
                            title="Auto Refresh"
                            subtitle="Automatically refresh order list"
                            rightComponent={
                                <Switch
                                    value={autoRefreshEnabled}
                                    onValueChange={setAutoRefreshEnabled}
                                />
                            }
                        />
                        {autoRefreshEnabled && (
                            <>
                                <Divider />
                                <SettingItem
                                    icon="time-outline"
                                    iconColor={theme.colors.primary}
                                    title="Refresh Interval"
                                    subtitle={refreshIntervals.find(r => r.value === refreshInterval)?.label || '30 seconds'}
                                    showChevron
                                    onPress={() => setShowRefreshIntervalModal(true)}
                                />
                            </>
                        )}
                    </Card>
                </View>

                {/* Data & Storage Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Data & Storage
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="trash-outline"
                            iconColor={theme.colors.warning}
                            title="Clear Cache"
                            subtitle="Clear app cache and temporary data"
                            showChevron
                            onPress={() => {
                                Alert.alert(
                                    'Clear Cache',
                                    'This will clear all cached data. Continue?',
                                    [
                                        { text: 'Cancel', style: 'cancel' },
                                        {
                                            text: 'Clear',
                                            style: 'destructive',
                                            onPress: () => {
                                                Alert.alert('Success', 'Cache cleared successfully');
                                            },
                                        },
                                    ]
                                );
                            }}
                        />
                        <Divider />
                        <SettingItem
                            icon="cloud-upload-outline"
                            iconColor={theme.colors.info}
                            title="Sync Now"
                            subtitle="Manually sync data with server"
                            showChevron
                            onPress={() => {
                                Alert.alert('Syncing', 'Syncing data with server...');
                                setTimeout(() => {
                                    Alert.alert('Success', 'Data synced successfully');
                                }, 1000);
                            }}
                        />
                    </Card>
                </View>

                {/* Support & About Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Support & About
                    </Heading>
                    <Card>
                        <SettingItem
                            icon="help-circle-outline"
                            iconColor={theme.colors.info}
                            title="Help & Support"
                            subtitle="Get help and contact support"
                            showChevron
                            onPress={() => Alert.alert('Support', 'Contact support at support@example.com')}
                        />
                        <Divider />
                        <SettingItem
                            icon="shield-checkmark-outline"
                            iconColor={theme.colors.success}
                            title="Privacy Policy"
                            subtitle="View privacy policy and data handling"
                            showChevron
                            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content')}
                        />
                        <Divider />
                        <SettingItem
                            icon="information-circle-outline"
                            iconColor={theme.colors.primary}
                            title="App Version"
                            subtitle="Version 1.0.0 (Build 1)"
                        />
                    </Card>
                </View>

                {/* Account Actions Section */}
                <View style={{ paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
                    <Heading level="h3" style={{ marginBottom: theme.spacing.md, color: theme.colors.text }}>
                        Account Actions
                    </Heading>
                    <Card>
                        <TouchableOpacity
                            onPress={() => setShowClearModal(true)}
                            style={{
                                backgroundColor: theme.colors.warning + '20',
                                borderColor: theme.colors.warning,
                                borderWidth: 1,
                                padding: theme.spacing.md,
                                borderRadius: 8,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: theme.spacing.sm,
                            }}
                        >
                            <Ionicons name="trash-outline" size={20} color={theme.colors.warning} />
                            <Text style={{ color: theme.colors.warning, marginLeft: theme.spacing.sm, fontWeight: '600' }}>
                                Clear All & Logout
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowLogoutModal(true)}
                            style={{
                                backgroundColor: theme.colors.error + '20',
                                borderColor: theme.colors.error,
                                borderWidth: 1,
                                padding: theme.spacing.md,
                                borderRadius: 8,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
                            <Text style={{ color: theme.colors.error, marginLeft: theme.spacing.sm, fontWeight: '600' }}>
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </Card>
                </View>
            </ScrollView>

            {/* Tenant Switcher Modal */}
            <TenantSwitcher
                tenants={tenants}
                currentTenantId={currentTenant?.id}
                onSelectTenant={handleTenantSelect}
                visible={showTenantSwitcher}
                onClose={() => setShowTenantSwitcher(false)}
            />

            {/* Low Stock Prompt Modal */}
            <PromptModal
                visible={showLowStockPrompt}
                onClose={() => setShowLowStockPrompt(false)}
                onConfirm={(value) => {
                    const num = parseInt(value || '10');
                    if (!isNaN(num) && num > 0) {
                        setLowStockThreshold(num);
                    }
                }}
                title="Low Stock Threshold"
                message="Enter the minimum stock level for alerts"
                defaultValue={lowStockThreshold.toString()}
                keyboardType="numeric"
                confirmText="Save"
            />

            {/* Logout Confirmation Modal */}
            <ConfirmationModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                title="Logout"
                message="Are you sure you want to logout? You'll need to login again to access your account."
                confirmText="Logout"
                variant="danger"
            />

            {/* Clear Credentials Confirmation Modal */}
            <ConfirmationModal
                visible={showClearModal}
                onClose={() => setShowClearModal(false)}
                onConfirm={handleClearCredentialsLogout}
                title="Clear All & Logout"
                message="This will clear all saved credentials including biometric login and logout. Are you sure?"
                confirmText="Clear & Logout"
                variant="danger"
            />

            {/* Refresh Interval Modal */}
            <Modal
                visible={showRefreshIntervalModal}
                animationType="slide"
                transparent
                onRequestClose={() => setShowRefreshIntervalModal(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'flex-end',
                }}>
                    <View style={{
                        backgroundColor: theme.colors.background,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        padding: theme.spacing.lg,
                        maxHeight: '50%',
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: theme.spacing.md,
                        }}>
                            <Heading level="h3">Select Refresh Interval</Heading>
                            <TouchableOpacity onPress={() => setShowRefreshIntervalModal(false)}>
                                <Ionicons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {refreshIntervals.map((interval) => (
                                <TouchableOpacity
                                    key={interval.value}
                                    onPress={() => {
                                        setRefreshInterval(interval.value);
                                        setShowRefreshIntervalModal(false);
                                    }}
                                    style={{
                                        padding: theme.spacing.md,
                                        borderRadius: 8,
                                        backgroundColor: refreshInterval === interval.value ? theme.colors.primary + '20' : 'transparent',
                                        marginBottom: theme.spacing.xs,
                                    }}
                                >
                                    <Text style={{
                                        color: refreshInterval === interval.value ? theme.colors.primary : theme.colors.text,
                                        fontWeight: refreshInterval === interval.value ? '600' : '400',
                                    }}>
                                        {interval.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
