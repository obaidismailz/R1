import React from 'react';
import {
	View, StyleSheet, Pressable, Text
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { colors, exStyles } from '@styles';

const ModalHeader = ({ ...props }) => (
	<View style={styles.modalHeader}>
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
				},
				styles.closeButton
			]}
			onPress={() => props.onClose()}
		>
			<MaterialCommunityIcons name='window-close' size={24} color='#424242' />
		</Pressable>
		<Text style={[exStyles.mediumTitleMed20, { color: colors.primaryText }]}>
			{props.title}
		</Text>
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
				},
				styles.closeButton
			]}
			onPress={() => props.onSubmit()}
		>
			<Feather name='check' size={24} color='#424242' />
		</Pressable>
	</View>
);

const styles = StyleSheet.create({
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginStart: 28,
		marginEnd: 28,
		alignItems: 'center'
	},
	closeButton: {
		borderRadius: 16,
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default ModalHeader;
