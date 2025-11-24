# Snowfox Multi-Tenant App

A robust, responsive, and multi-tenant React Native application built with Expo for Web, iOS, and Android.

## 🚀 Features

- **Multi-Tenancy**: Built-in support for multiple tenants with distinct themes and configurations.
- **Responsive Design**: Adaptive layout that works seamlessly on Mobile, Tablet, and Desktop.
- **Component Library**: A comprehensive set of atomic components (Atoms, Molecules, Organisms).
- **Data Visualization**: Integrated charts (Bar, Line, Pie, Area) using `react-native-svg`.
- **Navigation**: Responsive navigation with Sidebar for desktop and Hamburger menu for mobile.

## 🛠 Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/)
- **Web Support**: [React Native Web](https://necolas.github.io/react-native-web/)
- **Styling**: Custom theming system with responsive hooks.
- **Icons**: [Ionicons](https://ionic.io/ionicons)
- **Charts**: [react-native-svg](https://github.com/software-mansion/react-native-svg)

## 📦 Components

The project follows an Atomic Design methodology:

### Atoms
- `Button`, `Input`, `Text`, `Badge`, `Avatar`, `Spinner`, `ProgressBar`, `Toast`

### Molecules
- `FormField`, `SearchBar`, `Card`, `Modal`, `Tabs`, `Accordion`, `EmptyState`

### Organisms
- `Header`, `Sidebar`, `NavBar`, `DataTable`, `UserMenu`
- **Charts**: `BarChart`, `LineChart`, `PieChart`, `AreaChart`

### Templates
- `ResponsiveShell`: The main layout wrapper handling responsiveness and navigation.

## 🏃‍♂️ Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Start the App**
    ```bash
    npx expo start
    ```

3.  **Run on Web**
    Press `w` in the terminal or open the provided localhost link.

4.  **Run on Mobile**
    Scan the QR code with the Expo Go app (Android) or Camera app (iOS).

## 📊 Chart Configuration

The project uses `react-native-svg` for high-performance, scalable charts.
- **PieChart**: Supports donut mode and custom colors.
- **AreaChart**: Features smooth cubic bezier curves and gradient fills.
- **LineChart**: Includes grid lines and data points.
- **BarChart**: Responsive vertical bars.

## 🎨 Theming

The app uses a `ThemeContext` to provide colors, spacing, and typography.
To customize the theme, edit `theme/theme.ts`.

## 📱 Responsiveness

Use the `useResponsive` hook to adapt layouts:
```typescript
const { isMobile, isTablet, isDesktop } = useResponsive();
```

## 📄 License

MIT
