import * as React from 'react';
import { memo, useState, useEffect, createRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TextInput, ScrollView, Pressable, Dimensions } from 'react-native';
import { Header, ActivityIndicator } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import ActionSheet from 'react-native-actionsheet';
import Modal from 'react-native-modal';
import Spinner from 'react-native-loading-spinner-overlay';
import { FormButton } from '../components';
import { postContactUs } from '../apis/LoopExpoApi';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const ContactUs = ({ navigation, route }) => {
	const actionSheetRef = createRef();

	const [fName, setFName] = useState('');
	const [lName, setLName] = useState('');
	const [email, setEmail] = useState('');
	const [phNumber, setPhNumber] = useState('');
	const [description, setDescription] = useState('');

	const descriptionCount = 1000;
	const [descriptionLength, setDescriptionLength] = useState(0);

	const [status, setStatus] = useState('');
	const [message, setMessage] = useState('');
	const [modalAlert, setModalAlert] = useState(false);
	const [loader, setLoader] = useState(false);

	useEffect(() => {}, []);

	const submit = () => {
		if (fName == '' || lName == '' || email == '' || phNumber == '' || description == '') {
			alert('all fields requirre.');
		} else if (descriptionLength > 1000) {
			alert('description word should be less than 1000');
		} else {
			setLoader(true);
			const bodyFormData = new FormData();
			bodyFormData.append('fname', fName);
			bodyFormData.append('lname', lName);
			bodyFormData.append('email', email);
			bodyFormData.append('contact_to', 'event_organizer');
			bodyFormData.append('phone_no', phNumber);
			bodyFormData.append('message', description);
			postContactUs(bodyFormData).then(response => {
				console.error(JSON.stringify(response));
				if (response._metadata.status == 'SUCCESS') {
					setStatus(response._metadata.status);
					setMessage(response._metadata.message);
					reSet();
				} else if (response._metadata.status == 'ERROR') {
					setLoader(false);
					alert(response._metadata.errors[0]);
				}
			});
		}
	};

	function reSet() {
		setLoader(false);
		setModalAlert(true);
		setFName('');
		setLName('');
		setEmail('');
		setPhNumber('');
		setDescription('');
	}
	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<Header
				title='Contact Us'
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<ScrollView style={styles.mainContainer}>
					<Text style={[exStyles.infoDetailR16, styles.txtNote]}>
						{`Hi ${ShareData.getInstance().name}. Lets us know how can we help you`}
					</Text>

					<Text style={[exStyles.infoLargeM16, styles.txtBtnTitle]}>First Name*</Text>
					<TextInput
						multiline
						numberOfLines={2}
						style={[exStyles.infoDetailR16, styles.inputDescription]}
						placeholder='First Name'
						value={fName}
						autoCorrect={false}
						onChangeText={txt => {
							setFName(txt);
						}}
					/>
					<Text style={[exStyles.infoLargeM16, styles.txtBtnTitle]}>Last Name*</Text>
					<TextInput
						multiline
						numberOfLines={2}
						autoCorrect={false}
						style={[exStyles.infoDetailR16, styles.inputDescription]}
						placeholder='Last Name'
						value={lName}
						onChangeText={txt => {
							setLName(txt);
						}}
					/>

					<Text style={[exStyles.infoLargeM16, styles.txtBtnTitle]}>Email*</Text>
					<TextInput
						multiline
						numberOfLines={2}
						autoCorrect={false}
						style={[exStyles.infoDetailR16, styles.inputDescription]}
						placeholder='Email'
						value={email}
						onChangeText={txt => {
							setEmail(txt);
						}}
					/>

					<Text style={[exStyles.infoLargeM16, styles.txtBtnTitle]}>Phone Number*</Text>
					<TextInput
						multiline
						numberOfLines={2}
						autoCorrect={false}
						style={[exStyles.infoDetailR16, styles.inputDescription]}
						placeholder='Phone Number'
						value={phNumber}
						onChangeText={txt => {
							setPhNumber(txt);
						}}
					/>

					<Text style={[exStyles.infoDetailR16, styles.txtBtnTitle]}>Description*</Text>
					<TextInput
						multiline
						numberOfLines={5}
						style={[
							exStyles.infoDetailR16,
							styles.inputDescription,
							{
								borderColor: descriptionLength > 1000 ? colors.primaryColor : '#cecece'
							}
						]}
						placeholder='Describe your issue here.'
						value={description}
						autoCorrect={false}
						onChangeText={txt => {
							setDescription(txt);
							setDescriptionLength(txt.length);
						}}
					/>
					<Text
						style={[
							exStyles.descriptionSmallText,
							{
								color: descriptionLength > 1000 ? colors.primaryColor : colors.secondaryText,
								alignSelf: 'flex-end'
							}
						]}>
						{`${descriptionLength}/${descriptionCount}`}
					</Text>
					<View style={{ flex: 1 }} />
					<FormButton
						title='Submit'
						onPress={() => {
							submit();
						}}
						extraStyle={{ marginBottom: RFValue(20) }}
					/>
				</ScrollView>
				<ActivityIndicator visible={loader} size={'large'} />
				{/* <Spinner
					cancelable={false}
					animation='fade'
					visible={loader}
					textContent='Submitting...'
					textStyle={styles.spinnerTextStyle}
				/> */}
				<Modal
					isVisible={modalAlert}
					backdropColor='#000000'
					useNativeDriver
					backdropOpacity={0.4}
					animationIn='fadeInUpBig'
					animationOut='fadeOutDownBig'
					backdropTransitionInTiming={100}
					backdropTransitionOutTiming={Platform.OS == 'ios' ? 300 : 0}
					customBackdrop={null}
					hideModalContentWhileAnimating={false}
					deviceWidth={deviceWidth}
					deviceHeight={deviceHeight}
					style={{ margin: 0 }}>
					<View style={styles.contentContainer}>
						<Text style={exStyles.infoLargeM18}>{status}</Text>
						<Text style={[exStyles.infoLargeM16, { textAlign: 'center', color: colors.secondaryText }]}>{message}</Text>
						<Pressable
							style={{
								backgroundColor: colors.primaryColor,
								paddingHorizontal: 32,
								paddingVertical: 8,
								borderRadius: 16
							}}
							onPress={() => {
								setModalAlert(false);
								navigation.goBack();
							}}>
							<Text style={[exStyles.ButtonSM20, { textAlign: 'center', color: 'white' }]}>Ok</Text>
						</Pressable>
					</View>
				</Modal>
			</View>
		</>
	);
};

const REASON_ARRAY = [
	'Nudity',
	'Violence',
	'Harrassment',
	'Sucide or Self-Injury',
	'False Information',
	'Spam',
	'Unauthorized Sales',
	'Hate Speech',
	'Terrorism',
	'Gross Content',
	'Something else',
	'Cancel'
];

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: RFValue(10)
	},
	txtBtnTitle: {
		color: colors.primaryText,
		marginTop: RFValue(20),
		marginBottom: RFValue(10)
	},
	inputDescription: {
		padding: RFValue(10),
		borderWidth: 1,
		borderRadius: 5,
		borderColor: '#cecece',
		elevation: 3,
		backgroundColor: '#fff',
		textAlignVertical: 'top'
	},
	txtNote: {
		color: 'grey',
		textAlign: 'center'
	},
	spinnerTextStyle: {
		color: '#FFF',
		fontStyle: 'normal',
		fontSize: 15,
		fontWeight: '500'
	},

	contentContainer: {
		backgroundColor: '#ffffff',
		height: 200,
		marginHorizontal: RFValue(24),
		paddingHorizontal: RFValue(24),
		borderRadius: 32,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	}
});

export default memo(ContactUs);
