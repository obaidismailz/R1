import React, { useState, useEffect, memo } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	Pressable,
	Dimensions,
	Keyboard,
	Platform,
	ScrollView,
	ToastAndroid
} from 'react-native';

import { ShareData } from '@utils';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, exStyles } from '@styles';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Spinner from 'react-native-loading-spinner-overlay';
import * as HeaderButton from '../../../../../containers/HeaderButton';
import { withTheme } from '../../../../../theme';
import { withDimensions } from '../../../../../dimensions';
import { themes } from '../../../../../constants/colors';
import { CREATE_POST } from '../../../../../utils/Constants';

const { width } = Dimensions.get('window');

const CreatePollsView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const [date, setDate] = useState(new Date());
	const [day, setDay] = useState(new Date().getDate());
	const [month, setMonth] = useState(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());

	const [question, setQuestion] = useState('');
	const [answer0, setAnswer0] = useState('');
	const [answer1, setAnswer1] = useState('');
	const [answer, setAnswer] = useState([]);

	const [allOptions, setallOptions] = useState([]);
	const [show, setShow] = useState(false);
	const [loading, setLoading] = useState(false);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === 'ios');
		setDate(currentDate);
		setDay(currentDate.getDate());
		setMonth(currentDate.getMonth());
		setYear(currentDate.getFullYear());
	};

	const setHeader = () => {
		navigation.setOptions({
			title: 'Poll',
			headerLeft: isMasterDetail ? undefined : () => <HeaderButton.CancelModal onPress={close} />,
			headerRight: () => <HeaderButton.Item title='Post' testID='status-view-submit' onPress={() => onPost()} />
		});
	};

	const onPost = async () => {
		setAnswer([...answer]);
		if (question == '') {
		} else if (answer0 == '' && answer1 == '') {
			ToastAndroid.show('All Fields Require', ToastAndroid.SHORT);
		} else if (date <= Date.now()) {
			ToastAndroid.show('Select date', ToastAndroid.SHORT);
		} else {
			setLoading(true);
			const bodyFormData = new FormData();
			bodyFormData.append('user_id', ShareData.getInstance().user_id);
			bodyFormData.append('s', ShareData.getInstance().timeline_token);
			bodyFormData.append('postText', question);
			bodyFormData.append('poll_last_date', new Date(date).getTime() / 1000);
			bodyFormData.append('answer[]', answer0);
			bodyFormData.append('answer[]', answer1);
			answer.forEach((element, i) => {
				bodyFormData.append('answer[]', answer[i]);
			});
			bodyFormData.append('postPrivacy', 0);
			await axios({
				method: 'POST',
				url: ShareData.getInstance().socialBaseUrl + CREATE_POST,
				data: bodyFormData
			})
				.then(response => {
					if (response.data.api_status === '200') {
						setLoading(false);
						ToastAndroid.show('Post Created', ToastAndroid.LONG);
						close();
					}
				})
				.catch(error => {
					alert(error);
					setLoading(false);
				});
		}
	};

	const close = () => {
		navigation.goBack();
	};

	function removeOptionClick(i) {
		allOptions.pop();
		answer.pop();
		setallOptions([...allOptions]);
		setAnswer([...answer]);
	}

	function addOptionClick() {
		if (allOptions.length < 2) {
			allOptions.push(1);
			setallOptions([...allOptions]);
		}
	}

	return (
		<ScrollView style={styles.view}>
			{setHeader()}
			<Pressable onPress={() => Keyboard.dismiss()}>
				<Text style={[exStyles.descriptionSmallText, styles.pollInfoText]}>
					Do not create polls for Political opinions, medical information or any other sensitive data!
				</Text>
				<View style={styles.addQuestion}>
					<Text style={[exStyles.infoLargeM16, styles.addQuestionHeading]}>Your Question *</Text>
					<TextInput
						style={[exStyles.infoDetailR16, styles.addQuestionInput]}
						multiline
						numberOfLines={3}
						autoFocus
						placeholder='Add question'
						placeholderTextColor='#707070'
						onSubmitEditing={() => Keyboard.dismiss()}
						onChangeText={text => {
							setQuestion(text);
						}}
					/>
				</View>

				<View style={[styles.addQuestion, { marginTop: 50 }]}>
					<Text style={[exStyles.infoLargeM16, styles.addQuestionHeading]}>{`Option ${1} * `}</Text>
					<TextInput
						style={[exStyles.infoDetailR16, styles.addOptionInput]}
						placeholder='Add option'
						placeholderTextColor='#707070'
						onChangeText={text => {
							setAnswer0(text);
						}}
					/>
				</View>

				<View style={[styles.addQuestion, { marginTop: 30 }]}>
					<Text style={[exStyles.infoLargeM16, styles.addQuestionHeading]}>Option 2 *</Text>
					<TextInput
						style={[exStyles.infoDetailR16, styles.addOptionInput]}
						placeholder='Add Option'
						placeholderTextColor='#707070'
						onChangeText={text => {
							setAnswer1(text);
						}}
					/>
				</View>

				{allOptions.map((item, i) => (
					<View style={[styles.addQuestion, { marginTop: 30 }]}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingRight: 16,
								alignItems: 'center'
							}}>
							<Text style={[exStyles.infoLargeM16, styles.addQuestionHeading]}>{`Option ${3 + i} *`}</Text>
							<Pressable
								onPress={() => {
									removeOptionClick(i);
								}}>
								<Text style={[exStyles.TopTabSM14, { color: colors.primaryColor }]}>REMOVE</Text>
							</Pressable>
						</View>
						<TextInput
							style={[exStyles.infoDetailR16, styles.addOptionInput]}
							placeholder='Add option'
							placeholderTextColor='#707070'
							onChangeText={text => {
								answer[i] = text;
							}}
						/>
					</View>
				))}
				{allOptions.length < 2 ? (
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.08)' : '#E5E5E5'
							},
							styles.addAnswerButton
						]}
						onPress={() => {
							addOptionClick();
						}}>
						<IonIcons name='add' size={18} color='white' />
						<Text style={styles.optionButtonText}>ADD OPTIONS</Text>
					</Pressable>
				) : null}

				<Spinner
					cancelable={false}
					animation='fade'
					visible={loading}
					textContent='Posting...'
					textStyle={styles.spinnerTextStyle}
				/>
				<View style={styles.setDate}>
					<Text style={styles.addOptionHeading}>Poll Duration</Text>
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.08)' : '#E5E5E5'
							},
							styles.dateAndIcon
						]}
						onPress={() => setShow(true)}>
						<Text style={styles.dateText}>
							{day}/{month + 1}/{year}
						</Text>

						<Icon name='calendar' size={20} />
					</Pressable>
				</View>
				{show && (
					<DateTimePicker testID='dateTimePicker' value={date} mode='date' is24Hour display='spinner' onChange={onChange} />
				)}
			</Pressable>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		width: '100%',
		backgroundColor: '#E5E5E5'
	},
	pollInfoText: {
		color: colors.secondaryText,
		paddingVertical: 16,
		paddingHorizontal: 16,
		textAlign: 'center'
	},
	addQuestion: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		marginHorizontal: 16,
		marginTop: 10
	},
	addQuestionHeading: {
		color: colors.primaryText,
		marginBottom: 8
	},
	addQuestionInput: {
		borderWidth: 0.5,
		borderColor: 'rgba(0,0,0,0.6)',
		borderRadius: 10,
		height: 100,
		paddingHorizontal: 16,
		textAlignVertical: 'top',
		color: colors.secondaryText
	},

	addOptionHeading: {
		color: colors.primaryText,
		fontSize: 16,
		fontWeight: '500',
		lineHeight: 24,
		letterSpacing: 0.75,
		marginBottom: 8
	},

	addOptionInput: {
		borderWidth: 0.5,
		borderColor: 'rgba(0,0,0,0.6)',
		borderRadius: 10,
		height: 40,
		paddingHorizontal: 16,
		color: colors.secondaryText
	},

	optionButtonText: {
		fontSize: 14,
		fontWeight: '500',
		lineHeight: 20,
		letterSpacing: 2,
		color: 'white'
	},

	addAnswerButton: {
		borderRadius: 16,
		backgroundColor: colors.primaryColor,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginHorizontal: 100,
		paddingVertical: 12,
		marginTop: 40
	},

	setDate: {
		marginTop: 30,
		marginHorizontal: 16
	},
	dateAndIcon: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		color: 'rgba(0, 0, 0, 0.6)',
		borderWidth: 0.5,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 10,
		marginBottom: 16
	},
	dateText: {
		fontSize: 16,
		fontWeight: '400',
		color: colors.dartText,
		marginRight: 10
	},
	// loading text
	spinnerTextStyle: {
		color: '#FFF',
		fontStyle: 'normal',
		fontSize: 15,
		fontWeight: '500'
	}
});

export default withDimensions(withTheme(memo(CreatePollsView)));
