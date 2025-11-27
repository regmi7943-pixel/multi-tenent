import { StyleSheet } from 'react-native';

/**
 * Dashboard Styles (Admin & User)
 */
export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },

    contentContainer: {
        width: '100%',
        alignSelf: 'center',
    },

    header: {
        marginBottom: 32,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },

    menuCard: {
        width: 180,
        padding: 24,
        alignItems: 'center',
    },

    menuCardMobile: {
        width: '100%',
    },

    menuIcon: {
        fontSize: 48,
    },
});
