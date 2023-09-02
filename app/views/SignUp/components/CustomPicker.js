import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const CustomPicker = ({ ...props }) =>
	props.visibility == 1 ? (
		<>
			<TouchableOpacity
				style={[
					{
						paddingVertical: 12,
						marginTop: 10,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						borderBottomColor: '#cecece',
						borderBottomWidth: 1,
						width: props.width
					},
					props.extraStyles
				]}
				onPress={props.onPress}>
				<Text
					style={[
						exStyles.textInputStyle,
						{
							color: colors.secondaryText
						}
					]}>
					{props.options == undefined ? props.option : props.options.length == 0 ? props.option : props.options.join(', ')}
				</Text>

				<MaterialIcons name='arrow-drop-down' size={RFValue(24)} color={colors.secondaryText} />
			</TouchableOpacity>
			{props.text == '' ? null : <Text style={{ color: colors.primaryColor }}>This field is required</Text>}
		</>
	) : null;

const styles = StyleSheet.create({});

export default memo(CustomPicker);
