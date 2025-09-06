import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { globalStyles } from '../theme/globalStyles';


export default function Card({ children }: PropsWithChildren) {
return <View style={[globalStyles.card, styles.card]}>{children}</View>;
}


const styles = StyleSheet.create({
card: {},
});