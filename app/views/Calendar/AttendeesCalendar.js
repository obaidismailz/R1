import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo, useState, useEffect } from 'react';
import {
	View,
	Text,
	Pressable,
	Dimensions,
	FlatList,
	Modal,
	TextInput,
	SafeAreaView,
	KeyboardAvoidingView,
	TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, exStyles } from '@styles';
import { LoadingDialog } from '@components';
import axios from 'axios';
import { ShareData } from '@utils';
import { GET_CALENDAR_ATTENDEES } from '@utils/Constants';
import { noInternetAlert } from '@utils/Network';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import moment from 'moment';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const AttendeesCalendar = ({ navigation, route }) => {
	const [attendees, setAttendees] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getData();
	}, [useIsFocused()]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getAttendees().then((data) => {
				data.map(item => ({ ...item, selected: false }));
				setAttendees(data);
			});
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async() => {
					getData();
				}
			});
		}
	};

	const getAttendees = async() => new Promise((resolve, reject) => {
		setLoading(true);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_CALENDAR_ATTENDEES,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoading(false);
				// console.error(JSON.stringify(response.data));
				if (response.status === 200 || response.status === 600) {
					if (response.data._metadata.status === 'SUCCESS') {
						resolve(response.data.records.attendees);
					} else {
						reject(response.data._metadata.message);
					}
				} else {
					reject('Failed to get Attendees, Please try again later');
				}
			})
			.catch((error) => {
				setLoading(false);
				reject('Failed to get Attendees, Please try again later');
			});
	});

	const onSubmit = () => {
		route.params.selectAttendeeCallback(
			attendees.filter(item => item.selected)
		);
		navigation.goBack();
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
						navigation.goBack();
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
					Select Attendees
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
						// navigation.goBack();
					}}
				>
					<Feather name='check' size={24} color='#424242' />
				</Pressable>
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					<ModalHeader />
					<FlatList
						data={attendees}
						renderItem={d => (
							<ItemAttendee
								data={d.item}
								onPress={() => {
									setAttendees(
										attendees.map((item, index) => {
											if (d.index === index) { return { ...item, selected: !item.selected }; }
											return item;
										})
									);
								}}
							/>
						)}
					/>
				</View>
				{loading ? <LoadingDialog visible /> : null}
			</SafeAreaView>
		</>
	);
};

const ItemAttendee = props => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={styles.itemAttendeeContainer}
		onPress={props.onPress && props.onPress}
	>
		<View
			style={{ justifyContent: 'center', marginStart: RFValue(15), flex: 1 }}
		>
			<Text style={{ fontSize: RFValue(18), color: 'black' }}>
				{`${ props.data.fname } ${ props.data.lname }`}
			</Text>
			<Text style={{ color: 'grey', fontSize: RFValue(13) }}>
				{props.data.email}
			</Text>
		</View>
		{props.data.selected && (
			<Feather
				name='check'
				size={24}
				color={colors.primaryColor}
				style={{ marginEnd: RFValue(20) }}
			/>
		)}
	</TouchableOpacity>
);

const styles = {
	centeredView: {
		height: screenHeight,
		width: screenWidth,
		zindex: 0
	},
	modalView: {
		height: screenHeight,
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
	inputTitle: {
		marginHorizontal: RFValue(30),
		marginBottom: RFValue(30),
		paddingVertical: RFValue(5),
		borderBottomWidth: 1,
		borderColor: '#000'
	},
	itemAttendeeContainer: {
		width: screenWidth,
		backgroundColor: 'white',
		borderBottomWidth: 0.5,
		borderColor: '#cecece',
		paddingVertical: RFValue(20),
		paddingHorizontal: RFValue(10),
		flexDirection: 'row',
		alignItems: 'center'
	}
};

export default memo(AttendeesCalendar);
