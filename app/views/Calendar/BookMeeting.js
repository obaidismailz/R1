import React, { memo, useState, useEffect } from 'react';
import {
	View,
	Text,
	Dimensions,
	SafeAreaView as SafeAreaViewNative,
	TextInput,
	KeyboardAvoidingView,
	ScrollView,
	TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, exStyles } from '@styles';
import { LoadingDialog } from '@components';
import axios from 'axios';
import { ShareData } from '@utils';
import { ADD_CALENDAR_EVENTS } from '@utils/Constants';
import { noInternetAlert } from '@utils/Network';
import { useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import { BoothOwnerCard, TimeCard, UserInfoCard } from './components/UserCards';
import ModalHeader from './components/ModalHeader';
import { saveMeetingForBooth, savePersonalMeeting } from '../../apis/CalendarApis';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const CreateMeeting = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const { user, boothOwner } = route.params;
	const [datePopup, setDatePopup] = useState(false);
	const [loading, setLoading] = useState(false);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [isStartDate, setIsStartDate] = useState(true);
	const [attendees, setAttendees] = useState([]);
	const [dateMode, setDateMode] = useState('date');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');

	const [selectedDateSlots, setSelectedDateSlots] = useState(null);
	const [selectedTimeSlots, setSelectedTimeSlots] = useState(null);

	useEffect(() => {}, []);

	const onSubmit = () => {
		if (user !== undefined && (user.user_roles.name == 'Attendee' || user.user_roles.name == 'Speaker')) {
			if (title == '' || description == '') {
				alert('Complete all fields');
			} else {
				saveMeetingWithUser();
			}
		} else if (title == '' || description == '' || selectedDateSlots == null) {
			alert('Complete all fields');
		} else {
			saveMeeting(selectedDateSlots, selectedTimeSlots, 'booth');
		}

		// if (ShareData.getInstance().internetConnected) {
		// 	addEvent()
		// 		.then((data) => {
		// 			navigation.goBack();
		// 			if (
		// 				route.params !== undefined
		// 				&& route.params.addEventCallback !== undefined
		// 			) {
		// 				route.params.addEventCallback();
		// 			}
		// 		})
		// 		.catch((e) => {
		// 			// console.error(e);
		// 		});
		// } else {
		// 	noInternetAlert({
		// 		onPress: async() => {
		// 			onSubmit();
		// 		}
		// 	});
		// }
	};

	const onClose = () => {
		navigation.goBack();

		// Toast.show({
		// 	type: 'success',
		// 	text1: 'Success',
		// 	text2: 'Image Save Successfully'
		// });
	};

	const selectAttendeeCallback = arr => {
		setAttendees(arr);
	};

	const gotoTimeSlots = userId => {
		navigation.navigate('AvailableTimeSlots', {
			userId,
			selectedSlot: (date, time) => {
				setSelectedDateSlots(date);
				setSelectedTimeSlots(time);
			}
		});
	};

	const saveMeeting = (date, time, type) => {
		setLoading(true);
		const formdata = new FormData();
		formdata.append('data[user_id]', user == undefined ? boothOwner.id : user.id);
		formdata.append('data[event_title]', title);
		formdata.append('data[description]', description);
		formdata.append('data[date]', date);
		formdata.append('data[time]', time);
		formdata.append('data[type]', type);
		saveMeetingForBooth(formdata).then(response => {
			if (response._metadata.status == 'SUCCESS') {
				console.error(response);
				setLoading(false);
				navigation.goBack();
			}
		});
	};

	const saveMeetingWithUser = () => {
		setLoading(true);

		const formdata = new FormData();
		formdata.append('data[user_id]', user.id);
		formdata.append('data[event_title]', title);
		formdata.append('data[description]', description);
		formdata.append('data[start_date_time]', moment(startDate).format('YYYY-MM-DD hh:mm'));
		formdata.append('data[end_date_time]', moment(endDate).format('YYYY-MM-DD hh:mm'));
		// formdata.append('data[attendees][]', 11);
		savePersonalMeeting(formdata).then(response => {
			setLoading(false);
			navigation.goBack();
		});
	};

	const addEvent = async () =>
		new Promise((resolve, reject) => {
			setLoading(true);

			const formdata = new FormData();
			if (user.id) {
				formdata.append('user_id', user.id);
			}
			formdata.append('data[event_title]', title);
			formdata.append('data[start_date_time]', moment(startDate).format('YYYY-MM-DD hh:mm:ss'));
			formdata.append('data[end_date_time]', moment(endDate).format('YYYY-MM-DD hh:mm:ss'));
			formdata.append('data[description]', description);
			attendees.forEach(element => {
				formdata.append('data[attendees][]', element.id);
			});

			axios({
				method: 'POST',
				url: ShareData.getInstance().baseUrl + ADD_CALENDAR_EVENTS,
				data: formdata,
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${ShareData.getInstance().access_token}`,
					'Content-Type': 'multipart/form-data'
				}
			})
				.then(response => {
					setLoading(false);
					// console.error(JSON.stringify(response.data));
					if (response === undefined || response.data === undefined) {
						reject();
					}
					if (response.status === 200 || response.status === 600) {
						if (response.data._metadata.status === 'SUCCESS') {
							resolve(response.data.records);
						} else {
							reject(response.data._metadata.message);
						}
					} else {
						reject('Failed to get Notifications, Please try again ');
					}
				})
				.catch(error => {
					setLoading(false);
					reject(`Failed to get Notifications, Please try again ${error}`);
				});
		});

	const datePickerResponse = date => {
		setDatePopup(false);
		if (isStartDate) {
			if (dateMode === 'date') {
				date.setHours(startDate.getHours());
				date.setMinutes(startDate.getMinutes());
			} else {
				date.setDate(startDate.getDate());
				date.setMonth(startDate.getMonth());
				date.setFullYear(startDate.getFullYear());
			}

			setStartDate(date);
		} else {
			setEndDate(date);
		}
	};

	const Separator = () => (
		<View
			style={{
				height: 1,
				backgroundColor: colors.secondaryText,
				opacity: 0.2,
				width: screenWidth
			}}
		/>
	);

	const UserView = () => (
		<>
			<TimeCard title='Starts'>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						justifyContent: 'flex-end'
					}}>
					<TouchableOpacity
						style={{ marginEnd: RFValue(10) }}
						onPress={() => {
							setDateMode('date');
							setIsStartDate(true);
							setDatePopup(true);
						}}>
						<Text style={[exStyles.infoLargeM16, styles.txtDate]}>{moment(startDate).format('MMM DD, YYYY')}</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							setDateMode('time');
							setIsStartDate(true);
							setDatePopup(true);
						}}>
						<Text style={[exStyles.infoLargeM16, styles.txtDate]}>{moment(startDate).format('hh:mm A')}</Text>
					</TouchableOpacity>
				</View>
			</TimeCard>
			<Separator />
			<TimeCard title='Ends'>
				<View
					style={{
						flexDirection: 'row',
						flex: 1,
						justifyContent: 'flex-end'
					}}>
					<TouchableOpacity
						onPress={() => {
							setDateMode('time');
							setIsStartDate(false);
							setDatePopup(true);
						}}>
						<Text style={[exStyles.infoLargeM16, styles.txtDate]}>{moment(endDate).format('hh:mm A')}</Text>
					</TouchableOpacity>
				</View>
			</TimeCard>
		</>
	);

	const BoothUserView = () => (
		<TimeCard title='Select Time'>
			<View
				style={{
					flexDirection: 'row',
					flex: 1,
					justifyContent: 'flex-end'
				}}>
				<TouchableOpacity
					onPress={() => {
						boothOwner == undefined
							? user.user_roles.name == 'Booth Rep'
								? gotoTimeSlots(user.id)
								: null
							: gotoTimeSlots(boothOwner.id);
					}}
					style={{ flexDirection: 'row' }}>
					<Text
						style={[
							exStyles.infoLargeM16,
							{
								color: colors.primaryColor,
								textDecorationLine: selectedDateSlots == null ? 'none' : 'underline',
								marginEnd: RFValue(12)
							}
						]}>
						{selectedDateSlots == null ? '------------' : selectedDateSlots}
					</Text>
					{selectedTimeSlots == null ? (
						<Text style={[exStyles.infoLargeM16, { color: colors.primaryColor, textDecorationLine: 'none' }]}>
							---------------------
						</Text>
					) : (
						<Text style={[exStyles.infoLargeM16, styles.txtDate]}>{selectedTimeSlots}</Text>
					)}
				</TouchableOpacity>
			</View>
		</TimeCard>
	);

	const customToast = {
		success: ({ text1, ...props }) => (
			<ErrorToast
				text1Style={{
					fontSize: 15,
					fontWeight: '400'
				}}>
				<View
					style={{
						paddingVertical: 4,
						paddingHorizontal: 12,
						backgroundColor: 'green',
						flexDirection: 'row',
						alignItems: 'center'
					}}>
					<View>
						<Text style={[exStyles.infoLargeM16, { color: 'white' }]}>{text1}</Text>
						<Text style={[exStyles.infoDetailR16, { color: colors.primaryText }]}>{props.text2}</Text>
					</View>
				</View>
			</ErrorToast>
		)
	};

	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground
				}}
			/>

			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<SafeAreaView
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground,
					flex: 1
				}}>
				<ScrollView style={styles.scrollContainer}>
					<KeyboardAvoidingView style={styles.modalView} behavior='padding'>
						<ModalHeader onClose={onClose} title='Add Meeting Details' onSubmit={() => onSubmit()} />
						{user == undefined ? <BoothOwnerCard boothOwner={boothOwner} /> : <UserInfoCard user={user} />}
						<TextInput
							style={[exStyles.infoDetailR16, styles.inputTitle]}
							placeholder='Add Meeting Title'
							value={title}
							onChangeText={txt => setTitle(txt)}
						/>
						<Separator />
						{user !== undefined && (user.user_roles.name == 'Attendee' || user.user_roles.name == 'Speaker') ? (
							<UserView />
						) : (
							<BoothUserView />
						)}
						{/* <Separator />
						<TimeCard
							title='Add Additional Attendees'
							onPress={() => {
								navigation.navigate('AttendeesCalendar', {
									selectAttendeeCallback
								});
							}}
						/> */}
						<Separator />
						<TextInput
							style={[exStyles.infoLargeM16, { marginVertical: 24, marginHorizontal: RFValue(20) }]}
							placeholder='Add Meeting Description'
							multiline
							value={description}
							onChangeText={txt => setDescription(txt)}
						/>
						<Separator />
					</KeyboardAvoidingView>
				</ScrollView>
				{datePopup && (
					<DateTimePicker
						style={styles.picker}
						testID='dateTimePicker'
						themeVariant='light'
						value={new Date()}
						mode={dateMode}
						is24Hour
						display='spinner'
						onChange={(event, selectedDate) => {
							datePickerResponse(selectedDate);
						}}
					/>
				)}
				{loading ? <LoadingDialog visible /> : null}
				<Toast config={customToast} position='bottom' />
			</SafeAreaView>
		</>
	);
};

const styles = {
	scrollContainer: {
		flex: 1,
		backgroundColor: '#fff',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		overflow: 'hidden'
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
	image: {
		resizeMode: 'cover',
		height: RFValue(44),
		width: RFValue(44),
		borderRadius: RFValue(100)
	},
	txtDate: {
		color: colors.primaryColor,
		textDecorationLine: 'underline'
	},
	inputTitle: {
		marginHorizontal: RFValue(36),
		marginBottom: 40,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderBottomWidth: 1,
		borderColor: colors.primaryText
	},
	picker: {
		flex: 0.2,
		backgroundColor: 'white',
		paddingTop: 10,
		width: screenWidth
	}
};

export default withDimensions(withTheme(memo(CreateMeeting)));
