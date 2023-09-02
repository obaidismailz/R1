import React, { memo, useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { colors, exStyles } from '@styles';

const CustomTextField = ({ ...props }) => {
	const [isFocused, setIsFocused] = useState(false);
	const [passwordHidden, setPasswordHidden] = useState(true);
	return props.isVisible == 1 ? (
		<>
			<View
				style={[
					styles.wrapperView,
					{
						borderColor: isFocused ? colors.primaryColor : '#cecece',
						width: props.width,
						marginTop: 16
					},
					props.borderExtraStyle
				]}>
				<TextInput
					ref={props.reff}
					autoCapitalize={props.autoCapitalize}
					onBlur={() => setIsFocused(false)}
					onFocus={() => {
						setIsFocused(true);
					}}
					secureTextEntry={props.isPassword ? passwordHidden : props.secureTextEntry}
					style={[exStyles.textInputStyle, props.extraStyle]}
					placeholder={props.placeholder && props.placeholder}
					placeholderTextColor={colors.placeholderColor}
					onChangeText={props.onChangeText}
					onSubmitEditing={props.onSubmitEditing}
					// value={props.value}
				/>
				{props.isPassword ? (
					<TouchableOpacity activeOpacity={0.6} onPress={() => setPasswordHidden(!passwordHidden)}>
						<IonIcons name={passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'} size={24} color={colors.secondaryText} />
					</TouchableOpacity>
				) : null}
			</View>
			{props.text == '' ? null : <Text style={{ color: colors.primaryColor }}>This field is required</Text>}
		</>
	) : null;
};

const styles = StyleSheet.create({
	wrapperView: {
		marginVertical: 8,
		paddingHorizontal: 0,
		borderBottomWidth: 1,
		// borderColor: colors.blue,
		flexDirection: 'row',
		height: RFValue(40),
		alignItems: 'center'
	}
});

export default memo(CustomTextField);
