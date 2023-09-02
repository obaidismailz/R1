import * as React from 'react';
import {
	Text, Pressable, TouchableOpacity, StyleSheet
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, exStyles } from '@styles';

export default SectionHeader = ({ title, ...props }) => (
	<TouchableOpacity
		style={styles.sortItemContainer}
		activeOpacity={0.75}
		onPress={props.onPress && props.onPress}
	>
		<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
			{title}
		</Text>
		{props.pressable ? (
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : colors.unSelected
					},
					styles.onPressSortStyle
				]}
				onPress={props.onPress && props.onPress}
			>
				<MaterialIcons
					name='keyboard-arrow-right'
					size={32}
					color={colors.secondaryText}
				/>
			</Pressable>
		) : null}
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	sortItemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 28,
		backgroundColor: colors.unSelected,
		paddingHorizontal: 16,
		paddingVertical: 4
	},
	onPressSortStyle: {
		borderRadius: 30 / 2,
		alignItems: 'center',
		justifyContent: 'center'
	}
});
