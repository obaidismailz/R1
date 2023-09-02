import React, { memo } from 'react';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	Pressable,
	SafeAreaView,
	Modal,
	TextInput,
	Dimensions
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const SelectCountryModal = ({ ...props }) => {
	const onSelect = (name, id) => {
		props.onSelect(name, id);
		props.onClose();
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
					Countries
				</Text>
				<View />
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	const Countries = ({ item, index }) => (item.name == '' ? null : (
		<TouchableOpacity
			activeOpacity={0.7}
			style={{
				backgroundColor: colors.black20,
				marginHorizontal: 6,
				marginVertical: 8,
				paddingHorizontal: 16,
				paddingVertical: 6,
				borderRadius: 16,
				alignItems: 'center'
			}}
			onPress={() => {
				onSelect(item.name, item.id);
			}}
		>
			<Text
				style={[
					exStyles.infoLargeM16,
					{
						color: colors.primaryText
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
			renderItem={Countries}
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
	},
	searchFieldContainer: {
		height: 50,
		backgroundColor: colors.unSelected,
		opacity: 0.6,
		marginBottom: 10,
		marginTop: 10,
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 25,

		width: screenWidth * 0.9
	},
	textInput: {
		marginHorizontal: 10,
		height: 50,
		color: '#000000'
	}
});

export default withDimensions(withTheme(memo(SelectCountryModal)));
