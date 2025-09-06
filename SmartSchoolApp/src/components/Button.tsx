import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../theme/globalStyles';


type Props = {
title: string;
onPress: () => void;
style?: ViewStyle;
};


export default function Button({ title, onPress, style }: Props) {
return (
<TouchableOpacity style={[styles.btn, style]} onPress={onPress}>
<Text style={styles.text}>{title}</Text>
</TouchableOpacity>
);
}


const styles = StyleSheet.create({
btn: {
backgroundColor: colors.primary,
paddingVertical: 12,
paddingHorizontal: 20,
borderRadius: 10,
},
text: {
color: 'white',
fontWeight: '700',
textAlign: 'center',
},
});