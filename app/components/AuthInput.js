import React, { memo, useState, useImperativeHandle } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '../styles';

const AuthInput = ({ ...props }, ref) => {
	const [isFocused, setIsFocused] = useState(false);
	return (
		<View style={props.marginStyle}>
			<View style={[styles.wrapperView, { borderColor: isFocused ? colors.primaryColor : '#cecece' }]}>
				<TextInput
					ref={props.reff}
					autoCapitalize={props.autoCapitalize}
					onBlur={() => setIsFocused(false)}
					onFocus={() => {
						setIsFocused(true);
					}}
					style={[exStyles.textInputStyle, props.extraStyle]}
					placeholder={props.placeholder && props.placeholder}
					placeholderTextColor={colors.placeholderColor}
					onSubmitEditing={props.onSubmitEditing}
					onChangeText={props.onChangeText}
					value={props.value}
				/>
			</View>
			{props.errorText != '' && props.errorText != undefined && (
				<Text
					style={[
						{
							alignSelf: 'flex-end',
							fontSize: RFValue(12),
							marginTop: RFValue(2),
							color: 'red'
						},
						props.extraTextStyle
					]}>
					{props.errorText}
				</Text>
			)}
		</View>
	);
};

const styles = {
	wrapperView: {
		paddingHorizontal: 0,
		borderBottomWidth: 1,
		// borderColor: colors.blue,
		flexDirection: 'row',
		height: RFValue(40),
		alignItems: 'center'
	}
};

export default memo(AuthInput);
