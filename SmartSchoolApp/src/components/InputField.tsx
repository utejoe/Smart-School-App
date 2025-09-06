import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { globalStyles } from '../theme/globalStyles';


export default function InputField(props: TextInputProps) {
return <TextInput {...props} style={[globalStyles.input, props.style]} />;
}