import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo } from 'react';
import {
	View,
	Text,
	Pressable,
	Dimensions,
	FlatList,
	Modal,
	TextInput,
	SafeAreaView,
	TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import moment, { calendarFormat } from 'moment';
import { colors, exStyles } from '@styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ModalMeetingDetails = ({ ...props }, ref) => {
	const itemSeparator = () => (
		<View
			style={{
				height: 0.5,
				borderWidth: 0.5,
				borderColor: '#000000',
				opacity: 0.2
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
					Meeting Details
				</Text>
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
					<MaterialIcons name='edit' size={24} color='#424242' />
				</Pressable>
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	const Tile = props => (
		<TouchableOpacity
			style={[styles.containerTileSwitch, props.style]}
			activeOpacity={props.onPress === undefined ? 1 : 0}
			onPress={props.onPress && props.onPress}
		>
			<Text style={{ fontSize: RFValue(16), color: '#424242' }}>
				{props.title}
			</Text>
			{/* <Switch value={true} onValueChange={() => {}} color={"#27AE60"} /> */}
			{props.children}
		</TouchableOpacity>
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
					<View
						style={{
							backgroundColor: '#f2f2f2',
							paddingHorizontal: RFValue(30),
							paddingVertical: RFValue(10)
						}}
					>
						<Text style={{ color: '#1A1A1A', fontSize: RFValue(18) }}>
							{props.data.title}
						</Text>

						<View style={{ flexDirection: 'row' }}>
							<Text style={styles.txtEventTime}> {props.data.time}</Text>
						</View>
						<Text style={styles.txtEventTime}> {props.data.date}</Text>
					</View>

					<View
						style={{
							paddingHorizontal: RFValue(30),
							marginTop: RFValue(10)
						}}
					>
						<Text style={{ color: '#cecece', fontSize: RFValue(14) }}>
							Attendees:{'  '}
							<Text style={{ color: '#7E8389', fontSize: RFValue(14) }} />
						</Text>

						{/* <Text style={styles.txtTag}>Private</Text> */}

						<Text
							style={{
								color: '#1A1A1A',
								fontSize: RFValue(16),
								marginTop: RFValue(20)
							}}
						>
							Description
						</Text>
						<Text style={{ color: '#424242', fontSize: RFValue(16) }}>
							{props.data.description}
						</Text>
					</View>
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = {
	centeredView: {
		height: screenHeight,
		width: screenWidth,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.4)'
	},
	modalView: {
		height: screenHeight * 0.65,
		width: screenWidth,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(32)
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
	txtEventTime: {
		color: '#424242',
		fontSize: RFValue(14),
		fontWeight: 'bold'
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		flex: 1,
		marginStart: 10
	},
	containerTileSwitch: {
		width: screenWidth,
		backgroundColor: 'white',
		borderColor: '#cecece',
		paddingHorizontal: RFValue(20),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: RFValue(50)
	},
	txtDate: {
		color: colors.primaryColor,
		textDecorationLine: 'underline',
		fontSize: RFValue(16)
	},
	txtTag: {
		fontSize: RFValue(14),
		color: 'white',
		textAlignVertical: 'center',
		textAlign: 'center',
		paddingHorizontal: RFValue(10),
		borderRadius: RFValue(20),
		marginEnd: RFValue(10),
		backgroundColor: '#2775EE',
		color: 'white',
		height: RFValue(24),
		width: RFValue(80),
		marginTop: RFValue(10)
	}
};

export default memo(ModalMeetingDetails);
