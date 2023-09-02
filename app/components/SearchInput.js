import React, { memo, useState } from 'react';
import { View, TextInput } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '../styles';

const SearchInput = ({ ...props }, ref) => {
	const [isFocused, setIsFocused] = useState(false);
	return (
		<View
			style={[
				{
					flexDirection: 'row',
					backgroundColor: '#ececec',
					paddingVertical: RFValue(5),
					borderRadius: RFValue(5),
					alignItems: 'center'
				},
				props.style
			]}
		>
			<AntDesign
				name='search1'
				size={24}
				color={colors.white}
				style={{ marginStart: 10 }}
			/>
			<TextInput
				style={{
					flex: 1,
					paddingVertical: 0,
					fontSize: RFValue(14),
					color: 'black'
				}}
				placeholder='Search'
				placeholderTextColor='grey'
				value={props.value && props.value}
				onChangeText={props.onChangeText && props.onChangeText}
			/>
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

export default memo(SearchInput);
