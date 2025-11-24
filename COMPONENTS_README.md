# Multi-Tenant Component Library

A comprehensive, production-ready component library for React Native + Expo applications with built-in multi-tenant support, responsive design, and dark mode.

## 🎯 Features

- ✅ **28 Production-Ready Components**
  - 14 Atomic components (Button, Input, Text, etc.)
  - 8 Molecular components (FormField, SearchBar, etc.)
  - 8 Organism components (Header, NavBar, DataTable, etc.)

- 📱 **Fully Responsive**
  - Mobile (< 600px)
  - Tablet (600-1000px)
  - Desktop (> 1000px)

- 🎨 **Multi-Tenant Theming**
  - Per-tenant color customization
  - Custom themes per tenant
  - Easy tenant switching

- 🌓 **Dark Mode Support**
  - Built-in light and dark themes
  - Automatic system theme detection
  - Manual theme toggle

- ♿ **Accessibility First**
  - Proper touch targets (minimum 48px on mobile)
  - Semantic accessibility roles
  - Screen reader support

## 📦 Installation

The components are already in your project. Just import them:

```typescript
import { Button, Input, Card } from './components';
import { ThemeProvider, useTheme } from './hooks';
```

## 🚀 Quick Start

### 1. Wrap your app with ThemeProvider

```typescript
import { ThemeProvider } from './hooks';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use components

```typescript
import { Button, Card, Heading, Text } from './components';

function MyScreen() {
  return (
    <Card>
      <Heading level="h2">Welcome</Heading>
      <Text>This is a responsive card component</Text>
      <Button variant="primary" onPress={() => console.log('Pressed')}>
        Click Me
      </Button>
    </Card>
  );
}
```

### 3. Enable multi-tenant support

```typescript
import { ThemeProvider, TenantConfig } from './hooks';

const tenant: TenantConfig = {
  id: 'tenant-1',
  name: 'Acme Corp',
  colors: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
  },
};

export default function App() {
  return (
    <ThemeProvider defaultTenant={tenant}>
      <YourApp />
    </ThemeProvider>
  );
}
```

## 📚 Component Categories

### Atoms (Building Blocks)

| Component | Description | Responsive |
|-----------|-------------|------------|
| `Avatar` | User/tenant avatar with initials support | ✅ |
| `Badge` | Status badges and notifications | ✅ |
| `Button` | Primary, secondary, outline, ghost variants | ✅ |
| `Card` | Container with elevation and borders | ✅ |
| `Checkbox` | Controlled checkbox input | ✅ |
| `Divider` | Horizontal/vertical divider | ✅ |
| `Heading` | H1-H6 headings with responsive sizing | ✅ |
| `Input` | Text input with icons and error states | ✅ |
| `Radio` | Radio button input | ✅ |
| `Spinner` | Loading spinner with optional text | ✅ |
| `Switch` | Animated toggle switch | ✅ |
| `Tag` | Labels and tags with removable option | ✅ |
| `Text` | Typography with variants | ✅ |
| `Toast` | Notification toasts | ✅ |

### Molecules (Composite Components)

| Component | Description | Responsive |
|-----------|-------------|------------|
| `BottomSheet` | Slide-up sheet (swipeable on mobile) | ✅ |
| `ConfirmationModal` | Confirmation dialog | ✅ |
| `FormField` | Input with label, error, helper text | ✅ |
| `ListItem` | List item with icons and subtitle | ✅ |
| `SearchBar` | Search input with clear button | ✅ |
| `Stepper` | Multi-step progress indicator | ✅ |
| `TenantTile` | Tenant selector tile | ✅ |
| `UserTile` | User profile tile | ✅ |

### Organisms (Complex Components)

| Component | Description | Responsive Behavior |
|-----------|-------------|---------------------|
| `DataTable` | Data table | Cards on mobile, table on desktop |
| `Footer` | Page footer | Centered on mobile, left-aligned on desktop |
| `Header` | Page header | Menu icon on mobile, full nav on desktop |
| `InteractiveList` | List with pull-to-refresh | Full featured |
| `NavBar` | Navigation bar | Bottom on mobile, top on desktop |
| `Sidebar` | Side navigation | Hidden on mobile, docked on desktop |
| `TenantSwitcher` | Tenant switching UI | Full screen modal |
| `UserMenu` | User dropdown menu | Modal on mobile, dropdown on desktop |

## 🎨 Theming

### Using the built-in theme

```typescript
import { useTheme } from './hooks';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Button onPress={toggleTheme}>
        Toggle Theme
      </Button>
    </View>
  );
}
```

### Multi-tenant theming

```typescript
import { useTheme, TenantConfig } from './hooks';

function TenantExample() {
  const { currentTenant, setTenant } = useTheme();

  const switchToTenant = () => {
    const newTenant: TenantConfig = {
      id: 'tenant-2',
      name: 'TechCo',
      colors: {
        primary: '#6c5ce7',
        secondary: '#a29bfe',
      },
    };
    setTenant(newTenant);
  };

  return (
    <Button onPress={switchToTenant}>
      Switch Tenant
    </Button>
  );
}
```

## 📱 Responsive Design

### Using responsive hooks

```typescript
import { useResponsive, useResponsiveValue } from './hooks';

function ResponsiveComponent() {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  const padding = useResponsiveValue({
    mobile: 16,
    tablet: 24,
    desktop: 32,
    default: 16,
  });

  return (
    <View style={{ padding }}>
      {isMobile && <Text>Mobile View</Text>}
      {isTablet && <Text>Tablet View</Text>}
      {isDesktop && <Text>Desktop View</Text>}
    </View>
  );
}
```

## 🎯 Component Examples

### Complete Form Example

```typescript
import {
  FormField,
  Button,
  Card,
  Heading,
  Checkbox,
  Switch,
} from './components';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  return (
    <Card>
      <Heading level="h3">Login</Heading>

      <FormField
        label="Email"
        required
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <FormField
        label="Password"
        required
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Checkbox checked={remember} onChange={setRemember} />
        <Text style={{ marginLeft: 8 }}>Remember me</Text>
      </View>

      <Button variant="primary" fullWidth>
        Sign In
      </Button>
    </Card>
  );
}
```

### DataTable Example

```typescript
import { DataTable } from './components';

function UsersTable() {
  const columns = [
    { key: 'name', label: 'Name', width: 200 },
    { key: 'email', label: 'Email', width: 250 },
    {
      key: 'status',
      label: 'Status',
      render: (user) => <Badge variant="success" value={user.status} />,
    },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      onRowPress={(user) => console.log('Selected:', user)}
    />
  );
}
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── atoms/           # 14 atomic components
│   ├── molecules/       # 8 molecular components
│   ├── organisms/       # 8 organism components
│   └── index.ts         # Main export
├── theme/
│   └── index.ts         # Theme configuration
└── hooks/
    ├── useTheme.tsx     # Theme and tenant management
    ├── useResponsive.ts # Responsive utilities
    └── index.ts         # Hooks export
```

## 🎨 Customization

All components accept `style` props for custom styling:

```typescript
<Button
  variant="primary"
  style={{ marginTop: 20, borderRadius: 20 }}
  textStyle={{ fontSize: 18 }}
>
  Custom Styled Button
</Button>
```

## 📄 License

This component library is part of your project.

## 🤝 Contributing

Feel free to extend and customize these components for your specific needs!
