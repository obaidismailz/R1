import * as React from 'react';
import {
	memo, useRef, useState, useEffect, useImperativeHandle
} from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Dimensions,
	FlatList,
	TouchableOpacity
} from 'react-native';

import { noInternetAlert } from '@utils/Network';

import { Header, LoadingDialog } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import { GET_CALENDAR_EVENTS, ADD_CALENDAR_EVENTS } from '@utils/Constants';
import {
	Calendar as CalendarLib,
	CalendarList,
	Agenda
} from 'react-native-calendars';
import moment, { calendarFormat } from 'moment';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import ModalMeetingDetails from './ModalMeetingDetails';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Calendar = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [loading, setLoading] = useState(false);
	const [markedDates, setMarkedDates] = useState({});
	const [events, setEvents] = useState([]);
	const [currentItem, setCurrentItem] = useState({});
	const [detailPopup, setDetailPopup] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			getData();
		}
	}, [isFocused]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getEvents().then((data) => {
				setEvents(data);
				let tempObj = {};
				data.forEach((element) => {
					const obj = {};
					obj[element.start_date_time.split(' ')[0]] = defaultDateObj;
					tempObj = { ...tempObj, ...obj };
					setMarkedDates(tempObj);
				});
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

	const getEvents = async() => new Promise((resolve, reject) => {
		setLoading(true);
		axios({
			method: 'GET',
			url: `${ ShareData.getInstance().baseUrl }/api/get/personal/meetings/${
				ShareData.getInstance().user.id
			}`,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				console.error(response.data);
				setLoading(false);
				if (response.status == 200) {
					if (response.data._metadata.status === 'SUCCESS') {
						resolve(response.data.records);
					} else {
						reject(response.data._metadata.message);
					}
				} else {
					reject('Failed to reset password, Please try again later');
				}
			})
			.catch((error) => {
				setLoading(false);
				reject('Failed to reset password, Please try again later');
			});
	});

	const addEvent = async() => new Promise((resolve, reject) => {
		const formData = new FormData();
		setLoading(true);
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + ADD_CALENDAR_EVENTS,
			data: {},
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
						resolve(response.data.records);
					} else {
						reject(response.data._metadata.message);
					}
				} else {
					reject('Failed to reset password, Please try again later');
				}
			})
			.catch((error) => {
				setLoading(false);
				reject('Failed to reset password, Please try again later');
			});
	});

	const ItemEvent = props => (
		<View style={styles.itemEventContainer}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flexDirection: 'row', flex: 1 }}>
					<Text style={styles.txtEventTime}>{props.data.time}</Text>
					{/* <Text style={{ color: '#7E8389', fontSize: RFValue(11) }}> to </Text>
					<Text style={styles.txtEventTime}>
						{' '}
						{moment(props.data.end_date_time).format('h:mm a')}
					</Text>
					<Text style={{ color: 'black' }}> UK(GMT+1) </Text> */}
				</View>
				<TouchableOpacity onPress={props.onViewDetails}>
					<Text style={{ color: '#406553', fontSize: RFValue(11) }}>
						{' '}
						View details{' '}
					</Text>
				</TouchableOpacity>
			</View>
			<Text style={{ color: '#7E8389', fontSize: RFValue(11) }}>
				{' '}
				{props.data.date}{' '}
			</Text>
			<Text style={{ color: '#1A1A1A', fontSize: RFValue(16) }}>
				{props.data.title}
			</Text>
			<Text style={{ color: '#7E8389', fontSize: RFValue(14) }}>
				{props.data.description}
			</Text>
		</View>
	);

	return (
		<SafeAreaView
			theme={theme}
			style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}
		>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>

			<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
				<Header
					title='My Calendar'
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
					onAddPress={() => {
						// navigation.navigate('CreateMeeting', {
						// 	addEventCallback: () => {
						// 		getData();
						// 	}
						// });
					}}
				/>
				{/* <ScrollView
					style={{ flex: 1 }}
					contentContainerStyle={{ backgroundColor: '#fff', flex: 1 }}
				> */}

				<FlatList
					style={{ paddingTop: RFValue(10) }}
					data={events}
					ListHeaderComponent={(
						<CalendarLib
							theme={calendarTheme}
							current={moment().format('YYYY-MM-DD')}
							minDate='1900-01-01'
							maxDate='3012-01-01'
							onDayPress={(day) => {
								// var key = day.dateString;
								// var obj = {};
								// obj[key] = defaultDateObj;
								// if (markedDates[key] === undefined)
								//   setMarkedDates({ ...markedDates, ...obj });
								// // to mark date
								// else {
								//   var arr = markedDates;
								//   delete arr[day.dateString];
								//   console.error(JSON.stringify(arr));
								//   setMarkedDates({ ...arr }); // to unmark date
								// }
							}}
							onDayLongPress={(day) => {
								console.log('selected day', day);
							}}
							monthFormat='yyyy MM'
							onMonthChange={(month) => {
								console.log('month changed', month);
							}}
							hideArrows={false}
							renderArrow={direction => (
								<Text
									style={[
										styles.txtCalendarHeader,
										{ marginHorizontal: RFValue(30) }
									]}
								>
									{direction === 'left' ? '<' : '>'}
								</Text>
							)}
							hideExtraDays
							disableMonthChange={false}
							firstDay={1}
							hideDayNames={false}
							showWeekNumbers={false}
							onPressArrowLeft={subtractMonth => subtractMonth()}
							onPressArrowRight={addMonth => addMonth()}
							disableArrowLeft={false}
							disableArrowRight={false}
							disableAllTouchEventsForDisabledDays
							renderHeader={date => (
								<Text style={styles.txtCalendarHeader}>
									{`${ MonthStrings[date.getMonth()] } ${ date.getFullYear() }`}
								</Text>
							)}
							enableSwipeMonths
							markedDates={markedDates}
						/>
					)}
					renderItem={({ item, index }) => (
						<ItemEvent
							data={item}
							onViewDetails={() => {
								setCurrentItem(item);
								setDetailPopup(true);
							}}
						/>
					)}
				/>
				{/* </ScrollView> */}
			</View>
			{loading ? <LoadingDialog visible /> : null}

			<ModalMeetingDetails
				visible={detailPopup}
				data={currentItem}
				onClose={() => {
					setDetailPopup(false);
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10)
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey'
	},
	modalStyle: {
		backgroundColor: '#fff',
		alignSelf: 'center',
		margin: 0,
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
		width: '100%',
		height: '100%'
	},
	layoutStyle: {
		backgroundColor: '#fff',
		alignSelf: 'center',
		alignItems: 'center',
		margin: 0,
		justifyContent: 'center',
		width: '80%',
		borderRadius: RFValue(40),
		paddingHorizontal: RFValue(20),
		paddingVertical: RFValue(24),
		paddingTop: RFValue(54)
	},
	txtCalendarHeader: {
		marginVertical: RFValue(10),
		fontSize: RFValue(20),
		fontWeight: 'bold',
		color: '#424242'
	},
	txtEventTime: {
		color: '#424242',
		fontSize: RFValue(11),
		fontWeight: 'bold'
	},
	itemEventContainer: {
		borderWidth: RFValue(1),
		paddingVertical: RFValue(20),
		borderStyle: 'dashed',
		borderColor: '#43A047',
		borderWidth: RFValue(1),
		marginTop: -RFValue(1),
		// borderBottomWidth: RFValue(0),
		borderRadius: RFValue(2),
		width: screenWidth + RFValue(4),
		marginStart: -RFValue(2),
		paddingHorizontal: RFValue(12)
	}
});

const MonthStrings = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'July',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec'
];

const defaultDateObj = {
	selected: false,
	marked: true,
	selectedColor: colors.primaryColor
};

const calendarTheme = {
	backgroundColor: '#ffffff',
	calendarBackground: '#f2f2f2',
	textSectionTitleColor: '#666666',
	textDisabledColor: '#666666',
	selectedDayBackgroundColor: colors.primaryColor,
	dotColor: colors.primaryColor,
	textSectionTitleDisabledColor: 'green',
	selectedDayTextColor: '#ffffff',
	todayTextColor: '#00adf5',
	dayTextColor: '#2d4150',
	selectedDotColor: '#ffffff',
	arrowColor: 'orange',
	disabledArrowColor: 'grey',
	monthTextColor: 'blue',
	indicatorColor: 'blue',
	textDayFontFamily: 'monospace',
	textMonthFontFamily: 'monospace',
	textDayHeaderFontFamily: 'monospace',
	textDayFontWeight: '300',
	textMonthFontWeight: 'bold',
	textDayHeaderFontWeight: '300',
	textDayFontSize: 16,
	textMonthFontSize: 16,
	textDayHeaderFontSize: 16
};

export default withDimensions(withTheme(memo(Calendar)));
