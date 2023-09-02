import React, { memo } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { colors, exStyles } from '@styles';

const FormField = props => (
	<TextInput
		keyboardType='decimal-pad'
		style={[exStyles.textInputStyle, props.extraStyle]}
		placeholder={props.placeholder && props.placeholder}
		placeholderTextColor={colors.placeholderColor}
		onChange={props.onChangeText()}
		value={props.value}
	/>
);

const styles = StyleSheet.create({});

export default memo(FormField);
