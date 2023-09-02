import React, { memo, useEffect, useState } from 'react';
import { FlatList, View, Text, Pressable, Dimensions, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, exStyles } from '@styles';
import { getEventAgenda } from '../../../apis/LoopExpoApi';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const EventAgendaModal = ({ ...props }, ref) => {
	const [days, setDays] = useState([]);
	const [schedules, setSchedules] = useState([]);
	const [agenda, setAgenda] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		getEventAgenda().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				setDays(response.records.days);
				setSchedules(response.records.schedules);
				setAgenda(response.records.schedules.filter(item => item.days.id == response.records.days[0].id));
			}
		});
	}, []);

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
					<MaterialCommunityIcons name='window-close' size={24} color={colors.secondaryText} />
				</Pressable>
				<Text
					style={[
						exStyles.mediumTitleMed20,
						{
							color: colors.primaryText
						}
					]}>
					Event Agenda
				</Text>
				<View />
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	const Day = ({ day, onPress, index }) => (
		<TouchableOpacity
			activeOpacity={0.7}
			onPress={onPress}
			style={[
				styles.dateContainer,
				{
					backgroundColor: selectedIndex == index ? colors.primaryColor : colors.unSelected
				}
			]}>
			<Text style={[exStyles.infoDetailR16, { color: selectedIndex == index ? 'white' : colors.primaryText }]}>{day}</Text>
		</TouchableOpacity>
	);

	const OptionsWithTime = ({ time, title, textColor, color }) => (
		<View
			style={{
				alignItems: 'flex-start',
				marginVertical: 16,
				marginLeft: 32
			}}>
			<View
				style={{
					borderRadius: 10,
					backgroundColor: colors.secondaryColor,
					paddingHorizontal: 8,
					paddingVertical: 2,
					marginEnd: RFValue(8)
				}}>
				<Text style={[exStyles.infoLink14Med, { color: 'white', fontSize: 14 }]}>{time}</Text>
			</View>
			<Text style={[exStyles.infoDetailR16, { color: textColor, marginTop: 10 }]}>{title}</Text>
		</View>
	);

	const filterList = (day, index) => {
		setSelectedIndex(index);
		setAgenda(schedules.filter(item => item.days.name == day));
	};

	const ModalBody = () => (
		<FlatList
			data={agenda}
			ListEmptyComponent={
				<View style={{ alignItems: 'center' }}>
					<Text>No Agenda Available</Text>
				</View>
			}
			ListHeaderComponent={
				<>
					<FlatList
						data={days}
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{
							marginTop: 8,
							marginStart: 24,
							marginBottom: 16
						}}
						renderItem={({ item, index }) => (
							<Day
								backgroundColor={colors.unSelected}
								day={item.name}
								index={index}
								onPress={() => filterList(item.name, index)}
							/>
						)}
					/>
				</>
			}
			renderItem={({ item, index }) => <OptionsWithTime textColor={colors.primaryText} time={item.time} title={item.title} />}
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
			}}>
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

const styles = {
	centeredView: {
		flex: 1
	},
	modalView: {
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderTopWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(24),
		paddingBottom: RFValue(40),
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
	dateContainer: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: 'flex-start',
		marginEnd: 16
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

export default memo(EventAgendaModal);
