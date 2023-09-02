import React, { memo, useEffect, useState } from 'react';
import {
	FlatList,
	View,
	Text,
	Pressable,
	Dimensions,
	SafeAreaView as SafeAreaViewNative,
	TouchableOpacity
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import { colors, exStyles } from '@styles';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import {
	getAvailableTimeSlots,
	getUsersMeeting
} from '../../apis/CalendarApis';
import SafeAreaView from '../../containers/SafeAreaView';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import { ActivityIndicator } from '../../components';
import ModalHeader from './components/ModalHeader';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const AvailableSlots = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { userId } = route.params;
	const [numberOfDays, setNumberOfDays] = useState(null);
	const [index, setIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [value, setValue] = useState('');
	const [timeSlots, setTimeSlots] = useState([]);
	const [meetingRecord, setMeetingRecord] = useState([]);

	const [selectedIndex, setSelectedIndex] = useState(null);
	const [selectedTime, setSelectedTime] = useState('');
	const [selectedDate, setSelectedDate] = useState('');

	useEffect(() => {
		getTimeSlots();
	}, []);

	const getTimeSlots = () => {
		getAvailableTimeSlots(userId).then((response) => {
			if (response._metadata.status === 'SUCCESS') {
				setTimeSlots(response.records.days);
				setNumberOfDays(response.records.days.length);
				setValue(Object.values(response.records.days[index]));
				getUsersMeeting(userId).then((response) => {
					if (response._metadata.status == 'SUCCESS') {
						setMeetingRecord(response.records);
						setLoading(false);
					} else {
						setLoading(false);
					}
				});
			} else {
				setLoading(false);
			}
		});
	};

	const onSubmit = () => {
		if (selectedDate != '' && selectedDate !== null) {
			route.params.selectedSlot(selectedDate, selectedTime);
			navigation.goBack();
		}
	};

	const onClose = () => {
		navigation.goBack();
	};

	const ListHeader = () => (
		<View style={styles.listHeader}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.chevronButton
				]}
				onPress={() => {
					if (index > 0) {
						setIndex(index - 1);
						const i = index - 1;
						setValue(Object.values(timeSlots[i]));
					}
				}}
			>
				<Feather name='chevron-left' size={24} color={colors.darkText} />
			</Pressable>

			<Text style={[exStyles.ButtonSM20, { color: colors.darkText }]}>
				{value[0].date}
			</Text>

			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.chevronButton
				]}
				onPress={() => {
					if (index < numberOfDays - 1) {
						setIndex(1 + index);
						const i = 1 + index;
						setValue(Object.values(timeSlots[i]));
					}
				}}
			>
				<Feather name='chevron-right' size={24} color={colors.darkText} />
			</Pressable>
		</View>
	);

	const ModalBody = () => {
		function isSlotBooked(item) {
			const result = meetingRecord.some(
				meeting => meeting.date === value[0].date && meeting.time === item
			);
			return result;
		}

		return (
			<FlatList
				ListHeaderComponent={<ListHeader />}
				data={value[0].time}
				style={{ marginTop: 32 }}
				renderItem={({ item, index }) => (
					<View
						style={{
							borderTopWidth: 1,
							borderTopColor: colors.separatorColor,
							paddingVertical: 20,
							marginHorizontal: 24
						}}
					>
						<TouchableOpacity
							activeOpacity={0.6}
							style={[
								styles.slots,
								{
									backgroundColor: isSlotBooked(item)
										? colors.black40
										: selectedIndex == index
											? colors.secondaryColor
											: 'transparent'
								}
							]}
							onPress={() => {
								if (!isSlotBooked(item)) {
									setSelectedIndex(index);
									setSelectedTime(item);
									setSelectedDate(value[0].date);
								}
							}}
						>
							<Text
								style={[
									exStyles.infoLargeM16,
									{
										color:
											selectedIndex == index ? colors.white : colors.primaryText
									}
								]}
							>
								{item}
							</Text>
						</TouchableOpacity>
					</View>
				)}
			/>
		);
	};

	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground
				}}
			/>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground,
					flex: 1
				}}
			>
				<View style={styles.modalView}>
					<ModalHeader
						onClose={onClose}
						title='Select a time slot'
						onSubmit={onSubmit}
					/>
					{loading ? (
						<ActivityIndicator size='large' theme={theme} />
					) : timeSlots.length > 0 ? (
						<ModalBody />
					) : (
						<View
							style={{ alignItems: 'center', marginTop: screenHeight * 0.35 }}
						>
							<Text
								style={[
									exStyles.ButtonSM20,
									{
										color: colors.secondaryText
									}
								]}
							>
								Time Slots are not avaiable
							</Text>
						</View>
					)}
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = {
	modalView: {
		flex: 1,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(24)
	},
	chevronButton: {
		borderRadius: 16,
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	},
	listHeader: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		marginBottom: 32
	},
	slots: {
		alignItems: 'center',
		paddingVertical: 8,
		marginHorizontal: 24,
		borderRadius: 16
	}
};

export default withDimensions(withTheme(memo(AvailableSlots)));
