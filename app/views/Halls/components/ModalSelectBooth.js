import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo } from 'react';
import { View, Text, Pressable, Dimensions, FlatList, Modal, SafeAreaView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BoothModalListItem from './BoothModalListItem';
import Navigation from '../../../lib/Navigation';
import { colors, exStyles } from '../../../styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ModalSelectBooth = ({ ...props }, ref) => {
	const { booths, picker } = props;

	const itemSeparator = () => (
		<View
			style={{
				height: 0.5,
				borderWidth: 0.5,
				borderColor: '#000000',
				opacity: 0.2,
				marginLeft: 24
			}}
		/>
	);
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
					}}>
					<MaterialCommunityIcons name='window-close' size={24} color={colors.primaryText} />
				</Pressable>
				<Text
					style={[
						exStyles.mediumTitleMed20,
						{
							color: colors.primaryText
						}
					]}>
					Select Offices
				</Text>
				<View />
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	return (
		<Modal
			animationType='slide'
			transparent
			statusBarTranslucent={false}
			visible={props.visible}
			onRequestClose={() => {
				props.onClose();
			}}>
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					<ModalHeader />
					<FlatList
						data={booths}
						keyExtractor={(item, index) => index.toString()}
						ListFooterComponent={<View style={{ height: 48 }} />}
						ItemSeparatorComponent={itemSeparator}
						renderItem={({ item }) => (
							<BoothModalListItem
								item={item}
								onPress={() => {
									if (!picker) {
										props.onClose();
										Navigation.navigate('BoothDetails', {
											booth: item
										});
									} else {
										props.onPick(item);
										props.onClose();
									}
								}}
							/>
						)}
					/>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = {
	centeredView: {
		flex: 1
	},
	modalView: {
		height: screenHeight,
		width: screenWidth,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(24)
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
	itemContainer: {
		flexDirection: 'row',
		paddingHorizontal: RFValue(20),
		alignItems: 'center',
		paddingVertical: RFValue(16)
	},
	image: {
		resizeMode: 'cover',
		height: RFValue(44),
		width: RFValue(44),
		borderRadius: RFValue(100)
	},
	bookmarkIcon: {
		paddingVertical: 3,
		paddingHorizontal: 5,
		marginEnd: -5
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		flex: 1,
		marginStart: 10
	}
};

export default memo(ModalSelectBooth);
