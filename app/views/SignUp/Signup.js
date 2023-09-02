import * as React from 'react';
import { memo, useEffect, useState, createRef } from 'react';
import {
	SafeAreaView as SafeAreaViewNative,
	ScrollView,
	StyleSheet,
	View,
	TextInput,
	Text,
	Dimensions,
	TouchableOpacity,
	FlatList
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { FormButton, Header, LoadingDialog } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { themes } from '../../constants/colors';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import { countriesList, registerUser, signupPageInterests } from '../../apis/LoopExpoApi';
import SelectInterestsModal from './SelectInterestsModal';
import CustomTextField from './components/CustomTextField';
import CustomPicker from './components/CustomPicker';
import PersonalDetailForm from './components/personalDetailForm';
import SelectCountryModal from './SelectCountryModal';
import CustomAlert from '../../components/CustomAlert';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const Signup = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { fields } = route.params;

	const [interests, setInterests] = useState([]);
	const [interestModal, setInterestModal] = useState(false);
	const [loading, setLoading] = useState(true);
	const [selectedInterests, setSelectedInterests] = useState([]);
	const [selectedInterestsId, setSelectedInterestsId] = useState([]);

	const [countries, setCountries] = useState([]);
	const [countryId, setCountryId] = useState(1);
	const [country, setCountry] = useState('Country');
	const [countryModal, setCountryModal] = useState(false);

	// field variables
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const genderActionSheetRef = createRef();
	const [gender, setGender] = useState('Gender');

	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	const buyerActionSheetRef = createRef();
	const [buyer, setBuyer] = useState('yes');

	const attendeeTypeActionSheetRef = createRef();

	const [otherFields, setOtherFields] = useState([]);

	const [loader, setLoader] = useState(false);
	const [customAlert, setCustomAlert] = useState(false);
	const [responseMessage, setResponseMessage] = useState('');
	const [responseStatus, setResponseStatus] = useState('');

	const [fieldType, setFieldType] = useState(0);

	useEffect(() => {
		signupPageInterests().then(response => {
			if (response._metadata.status == 'SUCCESS') {
				setInterests(response.records);
			}
		});
		countriesList().then(response => {
			if (response._metadata.status == 'SUCCESS') {
				setCountries(response.records);
				setLoading(false);
			}
		});
	}, []);

	const submit = () => {
		if (firstName == '') {
			setFieldType(1);
		} else if (lastName == '') {
			setFieldType(2);
		} else if (phoneNumber == '') {
			setFieldType(3);
		} else if (userName == '') {
			setFieldType(4);
		} else if (email == '') {
			setFieldType(5);
		} else if (password.length < 8) {
			alert('Password length should be greater than 8');
			setFieldType(6);
		} else if (password.length < 8) {
			alert('Password length should be greater than 8');
			setFieldType(7);
		} else if (password != confirmPassword) {
			alert('Password does not match');
			setFieldType(7);
		} else if (gender == 'Gender') {
			setFieldType(8);
		} else {
			setLoader(true);
			const formData = new FormData();
			formData.append('fname', firstName.trim());
			formData.append('lname', lastName.trim());
			formData.append('gender', gender);
			formData.append('phone_number', phoneNumber.trim());
			formData.append('username', userName.trim());
			formData.append('email', email.trim());
			formData.append('password', password);
			formData.append('password_confirmation', confirmPassword);
			formData.append('captcha', 'no');
			registerUser(formData)
				.then(response => {
					if (response._metadata.status == 'SUCCESS') {
						setLoader(false);
						setResponseMessage(response._metadata.message);
						setResponseStatus(response._metadata.status);
						setCustomAlert(true);
						//	navigation.replace('LoginView');
					} else {
						setLoader(false);
						setCustomAlert(true);
						setResponseMessage(response._metadata.errors.join(', '));
						setResponseStatus(response._metadata.status);
					}
				})
				.catch(e => {
					setLoader(false);
				});
		}
	};

	const onSelectIntetests = (interests, interestsId) => {
		setSelectedInterests(interests);
		setSelectedInterestsId(interestsId);
	};

	const onSelectCountry = (country, id) => {
		setCountryId(id);
		setCountry(country);
		setCountryModal(false);
	};

	const SubHeading = ({ title }) => (
		<>
			<View
				style={{
					alignItems: 'center',
					marginTop: 24
				}}>
				<Text style={[exStyles.infoLargeM18, { color: colors.secondaryColor }]}>{title}</Text>
			</View>
		</>
	);

	renderFields = ({ item, index }) =>
		item.form_input_value == 'interests' ? (
			loading ? null : (
				<>
					<CustomPicker
						visibility={item.visibility}
						width={screenWidth * 0.9}
						onPress={() => {
							setInterestModal(true);
						}}
						option='Select Interests'
						options={selectedInterests}
					/>

					<SelectInterestsModal
						visible={interestModal}
						data={interests}
						selectedInterests={selectedInterests}
						selectedInterestsId={selectedInterestsId}
						onSelectedInterests={onSelectIntetests}
						onClose={() => setInterestModal(false)}
					/>
				</>
			)
		) : item.form_input_value == 'are_you_a_buyer' ? (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					marginTop: 6,
					marginBottom: 12
				}}>
				{item.visibility == 1 ? (
					<Text style={[exStyles.textInputStyle, { color: colors.secondaryText, alignSelf: 'flex-end' }]}>Are You a Buyer</Text>
				) : null}
				<CustomPicker
					visibility={item.visibility}
					width={screenWidth * 0.4}
					onPress={() => buyerActionSheetRef.current.show()}
					option={buyer}
				/>
			</View>
		) : item.form_input_value == 'attendee_type' ? (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					marginTop: 6,
					marginBottom: 12
				}}>
				{item.visibility == 1 ? (
					<Text style={[exStyles.textInputStyle, { color: colors.secondaryText, alignSelf: 'flex-end' }]}>Attenddee Type</Text>
				) : null}
				<CustomPicker
					visibility={item.visibility}
					width={screenWidth * 0.4}
					onPress={() => {
						attendeeTypeActionSheetRef.current.show();
					}}
					option='Virtual'
				/>
			</View>
		) : item.form_input_value == 'country_id' ? (
			loading ? null : (
				<>
					<CustomPicker
						visibility={item.visibility}
						width={screenWidth * 0.9}
						onPress={() => {
							setCountryModal(true);
						}}
						option={country}
					/>

					<SelectCountryModal
						visible={countryModal}
						data={countries}
						onSelect={onSelectCountry}
						onClose={() => setCountryModal(false)}
					/>
				</>
			)
		) : (
			<>
				<CustomTextField
					width={screenWidth * 0.9}
					isVisible={item.visibility}
					isRequired={item.is_required == 'required'}
					placeholder={`${item.form_input_value
						.replace('_', ' ')
						.toLowerCase()
						.replace(/\b[a-z]/g, letter => letter.toUpperCase())}   ${item.is_required == 'required' ? '*' : ''}`}
					autoCapitalize='none'
					keyboardType='url'
					onChangeText={text => {
						// setOtherFields([
						// 	...otherFieldsKey,
						// 	...{ key: item.form_input_value, value: text }
						// ]);
					}}
				/>
			</>
		);

	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground
				}}
			/>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle='light-content' />
			<Header
				title='Event Registration'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					backgroundColor: 'white',
					flex: 1
				}}>
				<KeyboardAwareScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{ marginHorizontal: 16, paaddingBottom: 24 }}>
					<SubHeading title='' />
					<PersonalDetailForm
						setFirstName={setFirstName}
						setLastName={setLastName}
						setPhoneNumber={setPhoneNumber}
						onClickPicker={() => {
							genderActionSheetRef.current.show();
						}}
						pickerOption={gender}
						setUserName={setUserName}
						setEmail={setEmail}
						setPassword={setPassword}
						setConfirmPassword={setConfirmPassword}
						fieldType={fieldType}
					/>
					{/* <SubHeading title='Other Details' /> */}
					{/* <FlatList
						contentContainerStyle={{ paddingBottom: 32 }}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={(
							<FormButton
								title='Register'
								extraStyle={{
									marginTop: RFValue(20),
									backgroundColor: '#F6A83B',
									borderColor: '#F6A83B'
								}}
								onPress={() => {
									submit();
								}}
							/>
						)}
						data={fields}
						renderItem={renderFields}
					/> */}
					<FormButton
						title='Register'
						extraStyle={{
							marginTop: RFValue(20),
							backgroundColor: '#F6A83B',
							borderColor: '#F6A83B'
						}}
						onPress={() => {
							submit();
						}}
					/>
					<View style={{ height: 32 }} />
				</KeyboardAwareScrollView>
				<ActionSheet
					ref={genderActionSheetRef}
					options={['Male', 'Female', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={2}
					onPress={index => {
						if (index === 0) {
							setGender('Male');
						}
						if (index === 1) {
							setGender('Female');
						}
					}}
				/>
				<ActionSheet
					ref={buyerActionSheetRef}
					options={['Yes', 'No', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={2}
					onPress={index => {
						if (index === 0) {
							setBuyer('Yes');
						}
						if (index === 1) {
							setBuyer('No');
						}
					}}
				/>
				<ActionSheet
					ref={attendeeTypeActionSheetRef}
					options={['Virtual', 'Cancel']}
					cancelButtonIndex={1}
					destructiveButtonIndex={1}
					onPress={index => {
						if (index === 0) {
						}
					}}
				/>
			</SafeAreaView>
			<LoadingDialog visible={loader} />
			<CustomAlert
				visible={customAlert}
				status={responseStatus}
				text={responseMessage}
				ok={() => {
					responseStatus == 'SUCCESS' ? navigation.replace('LoginView') : setCustomAlert(false);
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	wrapperView: {
		marginVertical: 8,
		paddingHorizontal: 0,
		borderBottomWidth: 1,
		// borderColor: colors.blue,
		flexDirection: 'row',
		height: RFValue(40),
		alignItems: 'center'
	}
});

export default withDimensions(withTheme(memo(Signup)));
