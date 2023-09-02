import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo } from 'react';
import {
	ScrollView,
	View,
	Text,
	Pressable,
	Dimensions,
	FlatList,
	Modal,
	SafeAreaView
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Navigation from '../../../lib/Navigation';
import { colors } from '../../../styles';
import { ItemWebinarList } from '../../Auditorium/components';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ViewAllWebinarsModel = ({ ...props }, ref) => {
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
						color='#424242'
					/>
				</Pressable>
				<Text
					style={{
						fontSize: RFValue(20),
						color: 'black'
					}}
				>
					{`${ 'Live Webinars' + ' (' }${ props.webinars.length })`}
				</Text>
				<View />
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	const webinarSeparator = () => (
		<View
			style={{
				marginVertical: 24,
				height: 0.5,
				backgroundColor: 'black',
				opacity: 0.2,
				marginStart: RFValue(24)
			}}
		/>
	);

	const ModalBody = () => (
		<FlatList
			data={props.webinars}
			ItemSeparatorComponent={webinarSeparator}
			ListFooterComponent={<View style={{ height: 88 }} />}
			renderItem={({ item }) => (
				<ItemWebinarList
					data={item}
					onPress={() => {
						props.onClose();
						Navigation.navigate('WebinarDetails', {
							webinar: item,
							briefcaseCallback: null
						});
					}}
				/>
			)}
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
		</Modal>
	);
};

const styles = {
	centeredView: {
		height: screenHeight,
		width: screenWidth
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
	dateContainer: {
		paddingHorizontal: 16,
		paddingVertical: 2,
		borderRadius: 14
	},
	dateText: {
		fontSize: 16,
		fontWeight: '500',
		lineHeight: 24,
		letterSpacing: 0.6
	},
	timeText: {
		fontSize: 16,
		fontWeight: '500',
		color: colors.secondaryText,
		TextAlign: 'center',
		lineHeight: 24,
		letterSpacing: 0.6
	},
	titleText: {}
};

export default memo(ViewAllWebinarsModel);
