import { StyleSheet } from 'react-native';

/**
 * Login Screen Styles
 */
export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    contentContainer: {
        width: '100%',
        alignItems: 'stretch' as any,
    },

    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },

    foodIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF6B35',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },

    foodIconText: {
        fontSize: 40,
    },

    header: {
        marginBottom: 32,
    },

    formCard: {
        padding: 24,
    },

    inputGroup: {
        marginBottom: 20,
    },

    label: {
        fontWeight: '500' as any,
    },

    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },
});
