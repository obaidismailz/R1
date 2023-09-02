import React, { memo, useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '../styles';

const PasswordInput = ({ ...props }, ref) => {
	const [isFocused, setIsFocused] = useState(false);
	const [passwordHidden, setPasswordHidden] = useState(true);
	const child = props.children;
	return (
		<View style={props.marginStyle}>
			<View
				style={[
					styles.wrapperView,
					{ borderColor: isFocused ? colors.primaryColor : '#cecece' }
				]}
			>
				<TextInput
					ref={props.reff}
					autoCapitalize={props.autoCapitalize}
					secureTextEntry={passwordHidden}
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
				<TouchableOpacity
					activeOpacity={0.6}
					onPress={() => setPasswordHidden(!passwordHidden)}
				>
					<IonIcons
						name={passwordHidden ? 'md-eye-outline' : 'md-eye-off-outline'}
						size={24}
						color={colors.secondaryText}
					/>
				</TouchableOpacity>
			</View>
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

export default memo(PasswordInput);
