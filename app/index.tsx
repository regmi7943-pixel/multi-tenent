/**
 * Component Library Demo
 * 
 * This file demonstrates all components in the library
 * Copy these examples into your app to get started quickly
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
    Accordion,
    AreaChart,
    Avatar,
    Badge,
    BarChart,
    // Atoms
    Button,
    Card,
    Checkbox,
    ConfirmationModal,
    DataTable,
    EmptyState,
    // Molecules
    FormField,
    // Organisms
    Header,
    Heading,
    Input,
    LineChart,
    NavBar,
    PieChart,
    ProgressBar,
    Radio,
    ResponsiveShell,
    Sidebar,
    SidebarItem,
    Switch,
    Tabs,
    Tag,
    TenantSwitcher,
    TenantTile,
    Text
} from '../components';
import { TenantConfig, useResponsive, useTheme } from '../hooks';

// ============================================
// EXAMPLE 1: Basic Components
// ============================================
export function BasicComponentsExample() {
    const { theme } = useTheme();
    const { isDesktop } = useResponsive();
    const [checkboxChecked, setCheckboxChecked] = useState(true);
    const [radioSelected, setRadioSelected] = useState(true);
    const [switchValue, setSwitchValue] = useState(true);

    const containerStyle = isDesktop ? { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 16 } : { gap: 16 };
    const cardStyle = isDesktop ? { flex: 1, minWidth: 300 } : {};

    return (
        <View style={containerStyle}>
            <Card style={cardStyle}>
                <Heading level="h4">Buttons</Heading>
                <Button variant="primary" style={{ marginTop: 8 }}>Primary Button</Button>
                <Button variant="secondary" style={{ marginTop: 8 }}>Secondary Button</Button>
                <Button variant="outline" style={{ marginTop: 8 }}>Outline Button</Button>
                <Button variant="ghost" style={{ marginTop: 8 }}>Ghost Button</Button>
                <Button variant="danger" style={{ marginTop: 8 }}>Danger Button</Button>
                <Button variant="primary" loading style={{ marginTop: 8 }}>Loading...</Button>
            </Card>

            <Card style={[cardStyle, !isDesktop && { marginTop: 16 }]}>
                <Heading level="h4">Inputs</Heading>
                <Input placeholder="Basic input" style={{ marginTop: 8 }} />
                <Input
                    placeholder="With icon"
                    leftIcon={<Ionicons name="mail" size={20} color={theme.colors.textSecondary} />}
                    style={{ marginTop: 8 }}
                />
                <Input placeholder="Error state" error style={{ marginTop: 8 }} />
            </Card>

            <Card style={[cardStyle, !isDesktop && { marginTop: 16 }]}>
                <Heading level="h1">Heading 1</Heading>
                <Heading level="h2">Heading 2</Heading>
                <Heading level="h3">Heading 3</Heading>
                <Text>Body text</Text>
                <Text variant="caption">Caption text</Text>
                <Text variant="link">Link text</Text>
            </Card>

            <Card style={[cardStyle, !isDesktop && { marginTop: 16 }]}>
                <Heading level="h4">Avatars & Badges</Heading>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                    <Avatar size="xs" initials="XS" />
                    <Avatar size="sm" initials="SM" />
                    <Avatar size="md" initials="MD" />
                    <Avatar size="lg" initials="LG" />
                    <Avatar size="xl" initials="XL" />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <Badge variant="primary" value="5" />
                    <Badge variant="success" value="New" />
                    <Badge variant="error" value="!" />
                    <Badge variant="warning" dot />
                </View>
            </Card>

            <Card style={[cardStyle, !isDesktop && { marginTop: 16 }]}>
                <Heading level="h4">Tags</Heading>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                    <Tag variant="primary" label="Primary" />
                    <Tag variant="success" label="Success" />
                    <Tag variant="error" label="Error" onRemove={() => { }} />
                    <Tag variant="warning" label="Warning" />
                </View>
            </Card>

            <Card style={[cardStyle, !isDesktop && { marginTop: 16 }]}>
                <Heading level="h4">Form Controls</Heading>
                <View style={{ marginTop: 8 }}>
                    <Checkbox checked={checkboxChecked} onChange={setCheckboxChecked} />
                    <Radio
                        selected={radioSelected}
                        onSelect={() => setRadioSelected(!radioSelected)}
                        style={{ marginTop: 8 }}
                    />
                    <Switch
                        value={switchValue}
                        onValueChange={setSwitchValue}
                        style={{ marginTop: 8 }}
                    />
                </View>
            </Card>
        </View>
    );
}

// ============================================
// EXAMPLE 2: Form Example
// ============================================
export function FormExample() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        agree: false,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    return (
        <View style={{ flex: 1 }}>
            <Card>
                <Heading level="h2">Sign Up</Heading>

                <FormField
                    label="Full Name"
                    required
                    value={formData.name}
                    onChangeText={(name) => setFormData({ ...formData, name })}
                    placeholder="Enter your full name"
                    error={errors.name}
                    style={{ marginTop: 16 }}
                />

                <FormField
                    label="Email"
                    required
                    value={formData.email}
                    onChangeText={(email) => setFormData({ ...formData, email })}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    error={errors.email}

                    style={{ marginTop: 16 }}
                />

                <FormField
                    label="Password"
                    required
                    value={formData.password}
                    onChangeText={(password) => setFormData({ ...formData, password })}
                    placeholder="Enter your password"
                    secureTextEntry
                    error={errors.password}
                    style={{ marginTop: 16 }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                    <Checkbox
                        checked={formData.agree}
                        onChange={(agree) => setFormData({ ...formData, agree })}
                    />
                    <Text style={{ marginLeft: 8 }}>I agree to the terms and conditions</Text>
                </View>

                <Button variant="primary" fullWidth style={{ marginTop: 24 }}>
                    Create Account
                </Button>
            </Card>
        </View>
    );
}

// ============================================
// EXAMPLE 3: Multi-Tenant Example
// ============================================
export function MultiTenantExample() {
    const { currentTenant, setTenant } = useTheme();
    const [switcherVisible, setSwitcherVisible] = useState(false);

    const tenants: TenantConfig[] = [
        {
            id: 'tenant-1',
            name: 'Acme Corporation',
            colors: { primary: '#ff6b6b', secondary: '#ee5a6f' },
        },
        {
            id: 'tenant-2',
            name: 'TechCo Solutions',
            colors: { primary: '#6c5ce7', secondary: '#a29bfe' },
        },
        {
            id: 'tenant-3',
            name: 'GlobalServe Inc',
            colors: { primary: '#00b894', secondary: '#00cec9' },
        },
    ];

    return (
        <View style={{ flex: 1 }}>
            <Header
                title="Multi-Tenant App"
                rightAction={
                    <Button variant="outline" onPress={() => setSwitcherVisible(true)}>
                        Switch Tenant
                    </Button>
                }
            />

            <View style={{ padding: 16 }}>
                <Card>
                    <Heading level="h3">Current Tenant</Heading>
                    {currentTenant ? (
                        <TenantTile name={currentTenant.name} isActive style={{ marginTop: 16 }} />
                    ) : (
                        <Text style={{ marginTop: 16 }}>No tenant selected</Text>
                    )}
                </Card>
            </View>

            <TenantSwitcher
                visible={switcherVisible}
                onClose={() => setSwitcherVisible(false)}
                tenants={tenants}
                currentTenantId={currentTenant?.id}
                onSelectTenant={(tenant) => setTenant(tenant)}
            />
        </View>
    );
}

// ============================================
// EXAMPLE 4: Responsive Layout Example
// ============================================
export function ResponsiveLayoutExample() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [selectedNav, setSelectedNav] = useState('home');

    const sidebarItems = [
        { label: 'Dashboard', icon: 'home' as const, onPress: () => { }, active: selectedNav === 'home' },
        { label: 'Users', icon: 'people' as const, onPress: () => { }, active: selectedNav === 'users' },
        { label: 'Settings', icon: 'settings' as const, onPress: () => { }, active: selectedNav === 'settings' },
    ];

    const navItems = [
        { label: 'Home', icon: 'home' as const, onPress: () => setSelectedNav('home'), active: selectedNav === 'home' },
        { label: 'Search', icon: 'search' as const, onPress: () => setSelectedNav('search'), active: selectedNav === 'search', badge: '3' },
        { label: 'Profile', icon: 'person' as const, onPress: () => setSelectedNav('profile'), active: selectedNav === 'profile' },
    ];

    return (
        <View style={{ flex: 1, flexDirection: 'row', height: 500 }}>
            <Sidebar
                items={sidebarItems}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <View style={{ flex: 1 }}>
                <Header title="My App" />

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ padding: 16 }}>
                        <Heading level="h2">Responsive Layout</Heading>
                        <Text style={{ marginTop: 8 }}>
                            Sidebar is hidden on mobile, visible on tablet/desktop.
                            NavBar is at the bottom on mobile, top on tablet/desktop.
                        </Text>
                    </View>
                </ScrollView>

                <NavBar items={navItems} />
            </View>
        </View>
    );
}

// ============================================
// EXAMPLE 5: Data Table Example
// ============================================
export function DataTableExample() {
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    ];

    const columns = [
        { key: 'name', label: 'Name', width: 200 },
        { key: 'email', label: 'Email', width: 250 },
        { key: 'role', label: 'Role', width: 150 },
        {
            key: 'status',
            label: 'Status',
            width: 120,
            render: (user: any) => (
                <Badge
                    variant={user.status === 'Active' ? 'success' : 'error'}
                    value={user.status}
                />
            ),
        },
    ];

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Heading level="h2">Users</Heading>
            <DataTable
                columns={columns}
                data={users}
                keyExtractor={(item) => item.id.toString()}
                onRowPress={(user) => console.log('Selected user:', user)}
                style={{ marginTop: 16 }}
            />
        </View>
    );
}

// ============================================
// EXAMPLE 6: Complete App Example
// ============================================
export function CompleteAppExample() {
    const [toastVisible, setToastVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Heading level="h2">App Actions</Heading>
            <View style={{ gap: 16, marginTop: 16 }}>
                <Button variant="primary" onPress={() => setModalVisible(true)}>
                    Show Confirmation Modal
                </Button>

                <Button variant="outline" onPress={() => {
                    setToastVisible(true);
                    setTimeout(() => setToastVisible(false), 3000);
                }}>
                    Show Toast Notification
                </Button>

                <Button variant="secondary" onPress={toggleTheme}>
                    Toggle Theme ({isDark ? 'Dark' : 'Light'})
                </Button>
            </View>

            <ConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={() => console.log('Confirmed!')}
                title="Confirm Action"
                message="Are you sure you want to perform this action? This cannot be undone."
                confirmText="Yes, Proceed"
                cancelText="No, Cancel"
            />

            {toastVisible && (
                <View style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: '#333',
                    padding: 16,
                    borderRadius: 8,
                    alignItems: 'center'
                }}>
                    <Text style={{ color: 'white' }}>Action completed successfully!</Text>
                </View>
            )}
        </View>
    );
}

// ============================================
// EXAMPLE 7: New Components Example
// ============================================
export function NewComponentsExample() {
    const { theme } = useTheme();
    const [activeTab, setActiveTab] = useState('tab1');
    const [showEmpty, setShowEmpty] = useState(false);

    const tabs = [
        { key: 'tab1', label: 'Overview' },
        { key: 'tab2', label: 'Details' },
        { key: 'tab3', label: 'Settings' },
    ];

    const accordionItems = [
        {
            title: 'What is this component library?',
            content: (
                <Text>
                    This is a comprehensive React Native component library designed for multi-tenant applications with responsive design support.
                </Text>
            ),
            icon: 'help-circle' as const,
        },
        {
            title: 'How do I use these components?',
            content: (
                <Text>
                    Simply import the components you need from the library and use them in your application. All components are fully typed with TypeScript.
                </Text>
            ),
            icon: 'code' as const,
        },
        {
            title: 'Are these components customizable?',
            content: (
                <Text>
                    Yes! All components support theming and can be customized through props and the theme system.
                </Text>
            ),
            icon: 'color-palette' as const,
        },
    ];

    return (
        <View style={{ flex: 1, padding: 16, gap: 24 }}>
            {/* Tabs */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Tabs Component</Heading>
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                <View style={{ padding: 16, marginTop: 8 }}>
                    <Text>Content for {tabs.find(t => t.key === activeTab)?.label}</Text>
                </View>
            </Card>

            {/* Progress Bars */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Progress Bars</Heading>
                <View style={{ gap: 16 }}>
                    <View>
                        <Text size="sm" style={{ marginBottom: 8 }}>Primary (75%)</Text>
                        <ProgressBar progress={75} variant="primary" showLabel />
                    </View>
                    <View>
                        <Text size="sm" style={{ marginBottom: 8 }}>Success (100%)</Text>
                        <ProgressBar progress={100} variant="success" showLabel />
                    </View>
                    <View>
                        <Text size="sm" style={{ marginBottom: 8 }}>Warning (50%)</Text>
                        <ProgressBar progress={50} variant="warning" showLabel />
                    </View>
                    <View>
                        <Text size="sm" style={{ marginBottom: 8 }}>Error (25%)</Text>
                        <ProgressBar progress={25} variant="error" showLabel />
                    </View>
                </View>
            </Card>

            {/* Accordion */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Accordion Component</Heading>
                <Accordion items={accordionItems} allowMultiple defaultExpanded={[0]} />
            </Card>

            {/* Empty State */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Empty State Component</Heading>
                <Button variant="outline" onPress={() => setShowEmpty(!showEmpty)} style={{ marginBottom: 16 }}>
                    {showEmpty ? 'Hide' : 'Show'} Empty State
                </Button>
                {showEmpty && (
                    <EmptyState
                        icon="folder-open-outline"
                        title="No Items Found"
                        description="There are no items to display at the moment. Try adding some items to get started."
                        actionLabel="Add Item"
                        onAction={() => console.log('Add item clicked')}
                    />
                )}
            </Card>
        </View>
    );
}

// ============================================
// EXAMPLE 8: Charts Example
// ============================================
export function ChartsExample() {
    const { theme } = useTheme();

    const barData = [
        { label: 'Jan', value: 45, color: theme.colors.primary },
        { label: 'Feb', value: 62, color: theme.colors.success },
        { label: 'Mar', value: 38, color: theme.colors.warning },
        { label: 'Apr', value: 75, color: theme.colors.error },
        { label: 'May', value: 58, color: theme.colors.info },
    ];

    const lineData = [
        { label: 'Mon', value: 30 },
        { label: 'Tue', value: 45 },
        { label: 'Wed', value: 35 },
        { label: 'Thu', value: 60 },
        { label: 'Fri', value: 50 },
        { label: 'Sat', value: 70 },
        { label: 'Sun', value: 55 },
    ];

    const pieData = [
        { label: 'Product A', value: 35, color: theme.colors.primary },
        { label: 'Product B', value: 25, color: theme.colors.success },
        { label: 'Product C', value: 20, color: theme.colors.warning },
        { label: 'Product D', value: 15, color: theme.colors.error },
        { label: 'Others', value: 5, color: theme.colors.info },
    ];

    return (
        <View style={{ flex: 1, padding: 16, gap: 24 }}>
            {/* Bar Chart */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Bar Chart</Heading>
                <Text size="sm" style={{ marginBottom: 16, color: theme.colors.textSecondary }}>
                    Monthly sales data
                </Text>
                <BarChart data={barData} height={250} showValues />
            </Card>

            {/* Line Chart */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Line Chart</Heading>
                <Text size="sm" style={{ marginBottom: 16, color: theme.colors.textSecondary }}>
                    Weekly activity trend
                </Text>
                <LineChart data={lineData} height={200} showDots />
            </Card>

            {/* Pie Chart */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Pie Chart</Heading>
                <Text size="sm" style={{ marginBottom: 16, color: theme.colors.textSecondary }}>
                    Product distribution
                </Text>
                <PieChart data={pieData} size={180} showLegend />
            </Card>

            {/* Area Chart */}
            <Card>
                <Heading level="h3" style={{ marginBottom: 16 }}>Area Chart</Heading>
                <Text size="sm" style={{ marginBottom: 16, color: theme.colors.textSecondary }}>
                    Weekly activity with filled area
                </Text>
                <AreaChart data={lineData} height={200} showDots />
            </Card>
        </View>
    );
}

export default function MainDemo() {


    const { theme } = useTheme();
    const [selectedNav, setSelectedNav] = useState('home');
    const [activeSection, setActiveSection] = useState('basic');

    const sidebarItems: SidebarItem[] = [
        { label: 'Basic Components', icon: 'cube', onPress: () => setActiveSection('basic'), active: activeSection === 'basic' },
        { label: 'Forms', icon: 'create', onPress: () => setActiveSection('forms'), active: activeSection === 'forms' },
        { label: 'Multi-Tenant', icon: 'business', onPress: () => setActiveSection('multi-tenant'), active: activeSection === 'multi-tenant' },
        { label: 'Layouts', icon: 'grid', onPress: () => setActiveSection('layouts'), active: activeSection === 'layouts' },
        { label: 'Data', icon: 'list', onPress: () => setActiveSection('data'), active: activeSection === 'data' },
        { label: 'New Components', icon: 'sparkles', onPress: () => setActiveSection('new'), active: activeSection === 'new' },
        { label: 'Charts', icon: 'bar-chart', onPress: () => setActiveSection('charts'), active: activeSection === 'charts' },
        { label: 'Complete App', icon: 'phone-portrait', onPress: () => setActiveSection('app'), active: activeSection === 'app' },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'basic':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Basic Components</Heading>
                        <BasicComponentsExample />
                    </View>
                );
            case 'forms':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Form Example</Heading>
                        <View style={{ maxWidth: 600 }}>
                            <FormExample />
                        </View>
                    </View>
                );
            case 'multi-tenant':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Multi-Tenant Example</Heading>
                        <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, overflow: 'hidden', height: 400 }}>
                            <MultiTenantExample />
                        </View>
                    </View>
                );
            case 'layouts':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Responsive Layout</Heading>
                        <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, overflow: 'hidden', height: 400 }}>
                            <ResponsiveLayoutExample />
                        </View>
                    </View>
                );
            case 'data':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Data Table</Heading>
                        <DataTableExample />
                    </View>
                );
            case 'app':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Complete App</Heading>
                        <View style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.md, overflow: 'hidden', maxWidth: 600 }}>
                            <CompleteAppExample />
                        </View>
                    </View>
                );
            case 'new':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>New Components</Heading>
                        <NewComponentsExample />
                    </View>
                );
            case 'charts':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Charts</Heading>
                        <ChartsExample />
                    </View>
                );
            case 'menu':
                return (
                    <View>
                        <Heading level="h2" style={{ marginBottom: 16 }}>Menu</Heading>
                        <View style={{ gap: 8 }}>
                            {sidebarItems.map((item, index) => (
                                <Card
                                    key={index}
                                    onPress={() => {
                                        item.onPress();
                                        // No need to update selectedNav anymore as we don't have bottom bar
                                    }}
                                    style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
                                >
                                    <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} style={{ marginRight: 16 }} />
                                    <Text style={{ fontSize: 16, fontWeight: '500' }}>{item.label}</Text>
                                    <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} style={{ marginLeft: 'auto' }} />
                                </Card>
                            ))}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <ResponsiveShell
            title="Component Library Demo"
            sidebarItems={sidebarItems}
            onMenuPress={() => setActiveSection(activeSection === 'menu' ? 'basic' : 'menu')}
        >
            <View style={{ paddingBottom: 32 }}>
                {renderContent()}
            </View>
        </ResponsiveShell>
    );
}
