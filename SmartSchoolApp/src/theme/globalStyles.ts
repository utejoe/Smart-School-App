import { StyleSheet } from 'react-native';


export const colors = {
primary: '#1E3A8A',
secondary: '#2563EB',
accent: '#FBBF24',
background: '#F3F4F6',
card: '#FFFFFF',
textPrimary: '#111827',
textSecondary: '#6B7280',
success: '#10B981',
error: '#EF4444',
};


export const globalStyles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: colors.background,
padding: 16,
},
button: {
backgroundColor: colors.primary,
paddingVertical: 12,
paddingHorizontal: 20,
borderRadius: 8,
alignItems: 'center',
},
buttonText: {
color: '#FFFFFF',
fontWeight: 'bold',
fontSize: 16,
},
card: {
backgroundColor: colors.card,
borderRadius: 12,
padding: 16,
shadowColor: '#000',
shadowOpacity: 0.1,
shadowOffset: { width: 0, height: 2 },
shadowRadius: 8,
elevation: 3,
marginBottom: 16,
},
input: {
borderWidth: 1,
borderColor: '#D1D5DB',
borderRadius: 6,
paddingVertical: 8,
paddingHorizontal: 12,
marginBottom: 12,
color: colors.textPrimary,
backgroundColor: '#fff',
},
textPrimary: {
color: colors.textPrimary,
fontSize: 16,
},
textSecondary: {
color: colors.textSecondary,
fontSize: 14,
},
chip: {
alignSelf: 'flex-start',
backgroundColor: colors.accent,
paddingHorizontal: 10,
paddingVertical: 4,
borderRadius: 999,
},
});