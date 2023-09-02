import React, { memo } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '../styles';

const FormButton = ({ ...props }) => (
	<TouchableOpacity
		activeOpacity={props.isDisabled ? 1 : props.opacity ? props.opacity : 0.8}
		underlayColor='#000'
		style={[
			styles.createButton,
			props.isWhite && {
				backgroundColor: '#fff',
				borderWidth: 2,
				borderColor: colors.primaryColor
			},
			props.isDisabled && {
				backgroundColor: '#CCCCCC',
				elevation: 0,
				borderColor: '#CCCCCC'
			},
			props.extraStyle
		]}
		onPress={props.isDisabled ? undefined : props.onPress}
	>
		<Text
			style={[
				exStyles.TabAllCapsMed14,
				{
					color: '#fff',
					textAlign: 'center'
				},
				props.isWhite && {
					color: colors.primaryColor
				},
				props.textStyle
			]}
		>
			{props.title}
		</Text>
	</TouchableOpacity>
);

const styles = {
	createButton: {
		marginTop: RFValue(10),
		paddingVertical: RFValue(10),
		backgroundColor: colors.primaryColor,
		elevation: 3,
		borderRadius: RFValue(16),
		borderColor: colors.primaryColor,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2
	},
	androw: {
		shadowColor: '#468ad4',
		shadowOffset: {
			width: 0,
			height: RFValue(10)
		},
		shadowOpacity: 0.1,
		shadowRadius: 0.9
	}
};

export default memo(FormButton);
