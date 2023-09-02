import React, { memo, useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Dimensions,
	Pressable,
	Platform,
	SafeAreaView,
	Modal
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';

const SelectInterestsModal = ({ ...props }) => {
	const [selectedInterestsId, setSelectedInterestsId] = useState(
		props.selectedInterestsId
	);
	const [selectedInterests, setSelectedInterests] = useState(
		props.selectedInterests
	);

	const onSubmit = () => {
		if (selectedInterests.length != 0) {
			props.onSelectedInterests(selectedInterests, selectedInterestsId);
			props.onClose();
		}
	};

	const ModalHeader = () => (
		<View>
			<View style={styles.modalHeader}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
						},
						styles.closeButton
					]}
					onPress={() => {
						props.onClose();
					}}
				>
					<MaterialCommunityIcons
						name='window-close'
						size={24}
						color={colors.secondaryText}
					/>
				</Pressable>
				<Text
					style={[
						exStyles.mediumTitleMed20,
						{
							color: colors.primaryText
						}
					]}
				>
					Interests
				</Text>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
						},
						styles.closeButton
					]}
					onPress={() => {
						onSubmit();
					}}
				>
					<MaterialCommunityIcons
						name='check'
						size={24}
						color={colors.secondaryText}
					/>
				</Pressable>
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	Interests = ({ item, index }) => (item.name == '' ? null : (
		<TouchableOpacity
			activeOpacity={0.7}
			style={{
				backgroundColor: selectedInterestsId.includes(item.id)
					? colors.primaryColor
					: colors.black20,
				marginHorizontal: 6,
				marginVertical: 8,
				paddingHorizontal: 16,
				paddingVertical: 6,
				borderRadius: 16,
				alignItems: 'center'
			}}
			onPress={() => {
				if (
					selectedInterestsId.includes(item.id)
						&& selectedInterests.includes(item.name)
				) {
					setSelectedInterests(
						selectedInterests.filter(e => e !== item.name)
					);
					setSelectedInterestsId(
						selectedInterestsId.filter(e => e !== item.id)
					);
				} else {
					setSelectedInterests([...selectedInterests, item.name]);
					setSelectedInterestsId([...selectedInterestsId, item.id]);
				}
			}}
		>
			<Text
				style={[
					exStyles.infoLargeM16,
					{
						color: selectedInterestsId.includes(item.id)
							? 'white'
							: colors.primaryText
					}
				]}
			>
				{item.name}
			</Text>
		</TouchableOpacity>
	));

	const ModalBody = () => (
		<FlatList
			showsVerticalScrollIndicator={false}
			data={props.data}
			contentContainerStyle={{ alignItems: 'center' }}
			numColumns={3}
			renderItem={Interests}
		/>
	);
	return (
		<Modal
			animationType='slide'
			transparent
			statusBarTranslucent={false}
			visible={props.visible}
			onRequestClose={() => {
				props.onClose();
			}}
		>
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					<ModalHeader />
					<ModalBody />
				</View>
			</SafeAreaView>
			<SafeAreaView style={{ backgroundColor: 'white' }} />
		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1
	},
	modalView: {
		paddingHorizontal: 16,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderTopWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(24),
		flex: 1
	},
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

export default withDimensions(withTheme(memo(SelectInterestsModal)));
