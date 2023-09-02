import * as React from 'react';
import { memo, useState, createRef } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TextInput,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Header, LoadingDialog } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { UPDATE_PROFILE } from '@utils/Constants';
import { ShareData } from '@utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from '@rocket.chat/react-native-fast-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DocumentPicker from 'react-native-document-picker';
import base64 from 'react-native-base64';
import FontAwosome from 'react-native-vector-icons/FontAwesome';
import { setUser as setUserFun } from '../../actions/login';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { colors, exStyles } from '../../styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const EditProfile = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { user } = route.params;
	const [loading, setLoading] = useState(false);
	const [pickedNewImage, setPickedNewImage] = useState(false);
	const [pickedCVFile, setPickedCVFile] = useState(false);
	const [first_name, set_first_name] = useState(user.fname);
	const [last_name, set_last_name] = useState(user.lname);
	const [website, set_website] = useState(user.profile.website == null ? '' : user.profile.website);
	const [intrest, set_intrest] = useState(
		user.user_interest.length > 0 ? user.user_interest.map(item => item.categories.name).join(',') : ''
	);
	const [about_me, set_about_me] = useState(user.profile.about_me);
	const [gender, set_gender] = useState(user.profile.gender);
	const [designation, set_designation] = useState(user.job_title);
	const [company, set_company] = useState(user.company_name);
	const [address, set_address] = useState(user.address);
	const [linkedin_link, set_linkedin_link] = useState(user.linkedin_link);
	const [facebook_link, set_facebook_link] = useState(user.facebook_link);
	const [twitter_link, set_twitter_link] = useState(user.twitter_link);
	const [phone_number, set_phone_number] = useState(user.profile.phone_number);
	const [is_private, set_is_private] = useState(user.profile.is_private);
	const [image, set_image] = useState(user.image);
	const [resume, setResume] = useState(user.profile.resume);
	const [pickDoc, setPickDoc] = useState('');

	const actionSheetRef = createRef();
	const privacyActionSheetRef = createRef();
	const pickImageActionSheetRef = createRef();

	propTypes = {
		setUser: PropTypes.func
	};

	const submit = async () =>
		new Promise((resolve, reject) => {
			if (about_me === '') {
				alert('Bio field required');
				reject('');
			} else {
				setLoading(true);
				const formData = new FormData();
				formData.append('first_name', first_name);
				formData.append('last_name', last_name);
				formData.append('website', website);
				formData.append('about_me', about_me);
				formData.append('gender', gender);
				formData.append('designation', designation);
				formData.append('company', company);
				formData.append('address', address == undefined ? '' : address);
				formData.append('linkedin_link', linkedin_link);
				formData.append('facebook_link', facebook_link);
				formData.append('twitter_link', twitter_link);
				formData.append('phone_number', phone_number == undefined ? '' : phone_number);
				formData.append('is_private', is_private);
				formData.append('intrest', intrest);
				if (pickedNewImage) {
					const androidFileName = image.path.split('/').pop();
					formData.append('image', {
						uri: image.path,
						type: image.mime,
						name: androidFileName
					});

					console.error(image);
				} else if (pickedCVFile) {
					formData.append('resume', {
						uri: pickDoc.uri,
						type: pickDoc.type,
						name: pickDoc.name
					});
				}
				fetch(ShareData.getInstance().baseUrl + UPDATE_PROFILE, {
					method: 'POST',
					body: formData,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${ShareData.getInstance().access_token}`,
						rcUserId: `${ShareData.getInstance().user.rcUserId}`,
						rcToken: `${ShareData.getInstance().user.rcToken}`,
						workspeeToken: `${ShareData.getInstance().user.workspeeToken}`,
						rcBaseUrl: `${base64.encode(ShareData.getInstance().user.rcBaseUrl)}`
					}
				})
					.then(res => res.json())
					.then(response => {
						console.error(response);
						setLoading(false);
						if (response.status === 200) {
							if (response._metadata.status === 'SUCCESS') {
								resolve(response._metadata.message);
							} else {
								reject(response._metadata.message);
							}
						} else {
							reject('Failed to reset password, Please try again later');
						}
					})
					.catch(error => {
						setLoading(false);
						reject('Failed to reset password, Please try again later');
					});
			}
		});

	const PrivacyOption = () => (
		<View
			activeOpacity={0.7}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				borderTopWidth: 0.5,
				borderColor: 'rgba(	126, 131, 137, 0.2)',
				marginHorizontal: 24,
				paddingVertical: 16
			}}>
			<Text style={[exStyles.infoDetailR16, { width: 88, color: colors.secondaryText }]}>Privacy</Text>
			<TouchableOpacity
				style={{
					flexDirection: 'row',
					flex: 1,
					alignItems: 'center',
					marginStart: 8
				}}
				onPress={() => {
					privacyActionSheetRef.current.show();
				}}>
				<MaterialIcons name='arrow-drop-down' size={RFValue(24)} color={colors.primaryText} />
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							marginStart: 16,
							color: colors.primaryText
						}
					]}>
					{is_private == 1 ? 'Private' : 'Public'}
				</Text>
			</TouchableOpacity>
		</View>
	);

	const GenderOption = () => (
		<View
			activeOpacity={0.7}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				borderTopWidth: 0.5,
				borderColor: 'rgba(	126, 131, 137, 0.2)',
				marginHorizontal: 24,
				paddingVertical: 16
			}}>
			<Text
				style={[
					exStyles.infoDetailR16,
					{
						width: 88,
						color: colors.secondaryText
					}
				]}>
				Gender
			</Text>
			<TouchableOpacity
				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					marginStart: 8
				}}
				onPress={() => {
					actionSheetRef.current.show();
				}}>
				<MaterialIcons name='arrow-drop-down' size={RFValue(24)} color={colors.primaryText} />
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							marginStart: 16,
							color: colors.primaryText
						}
					]}>
					{gender.charAt(0).toUpperCase() + gender.slice(1)}
				</Text>
			</TouchableOpacity>
		</View>
	);

	const pickResume = async () => {
		try {
			const res = await DocumentPicker.pick({
				type: [DocumentPicker.types.pdf]
			});
			console.log(`res : ${JSON.stringify(res)}`);
			console.log(`URI : ${res.uri}`);
			console.log(`Type : ${res.type}`);
			console.log(`File Name : ${res.name}`);
			console.log(`File Size : ${res.size}`);
			setPickedCVFile(true);
			setResume(res.name);
			setPickDoc(res);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				console.log('Canceled from single doc picker');
			} else {
				console.log(`Unknown Error: ${JSON.stringify(err)}`);
				throw err;
			}
		}
	};

	const ResumeField = () => (
		<View
			activeOpacity={0.7}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				borderTopWidth: 0.5,
				borderColor: 'rgba(	126, 131, 137, 0.2)',
				marginHorizontal: 24,
				paddingVertical: 16
			}}>
			<Text style={[exStyles.infoDetailR16, { width: 88, color: colors.secondaryText }]}>My CV</Text>
			{resume == '' ? (
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							marginStart: 16,
							color: colors.primaryColor
						}
					]}
					onPress={() => pickResume()}>
					None Added, Tap to Add
				</Text>
			) : (
				<TouchableOpacity activeOpacity={0.6} style={styles.cv} onPress={() => {}}>
					{pickedCVFile ? (
						<Text style={[exStyles.infoLargeM16, { color: colors.primaryColor }]}>{pickDoc.name}</Text>
					) : (
						<Text style={[exStyles.infoLargeM16, { color: colors.primaryColor }]}>
							{`${first_name + last_name} _CV.${resume.substring(resume.lastIndexOf('.') + 1)} `}
						</Text>
					)}

					<TouchableOpacity activeOpacity={0.5} style={styles.deleteButton} onPress={() => pickResume()}>
						<Feather name='arrow-up-circle' size={24} color={colors.primaryColor} />
					</TouchableOpacity>
				</TouchableOpacity>
			)}
		</View>
	);

	return (
		<>
			<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground }} />
			<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					style={{ flex: 1, backgroundColor: colors.white }}>
					<Header
						title='Edit Profile'
						theme={theme}
						onCrossPress={() => {
							navigation.goBack();
						}}
						onCheckPress={() => {
							submit()
								.then(() => {
									navigation.goBack();
								})
								.catch(e => {});
						}}
					/>
					<ScrollView style={{ flex: 1 }} contentContainerStyle={{}}>
						<View style={{ flex: 1, paddingBottom: 32 }}>
							<FastImage style={styles.imgProfilePic} source={{ uri: image.path == undefined ? image : image.path }} />
							<TouchableOpacity
								style={{ alignSelf: 'center', marginVertical: 12 }}
								onPress={() => {
									pickImageActionSheetRef.current.show();
								}}>
								<Text style={[exStyles.TabAllCapsMed14, styles.txtChangeProfile]}>CHANGE YOUR PROFILE PHOTO</Text>
							</TouchableOpacity>

							<InputFeild
								onChangeText={txt => {
									set_first_name(txt);
								}}
								title='First Name'
								value={first_name}
							/>
							<InputFeild
								onChangeText={txt => {
									set_last_name(txt);
								}}
								title='Last Name'
								value={last_name}
							/>
							<InputFeild
								onChangeText={txt => {
									set_website(txt);
								}}
								title='Website'
								value={website}
							/>
							<InputFeild
								onChangeText={txt => {
									set_intrest(txt);
								}}
								multiline
								numberOfLines={2}
								title='Interests'
								value={intrest}
							/>
							<InputFeild
								onChangeText={txt => {
									set_about_me(txt);
								}}
								multiline
								numberOfLines={2}
								title='Bio'
								value={about_me}
							/>
							<PrivacyOption />
							<ResumeField />
							<Text
								style={[
									exStyles.infoLargeM16,
									{
										paddingStart: 24,
										color: colors.secondaryText,
										backgroundColor: colors.unSelected,
										paddingVertical: 4,
										marginTop: 12
									}
								]}>
								Additional Information
							</Text>

							<Text
								style={[
									exStyles.descriptionSmallText,
									{
										paddingHorizontal: 28,
										color: colors.secondaryText,
										paddingVertical: RFValue(10),
										textAlign: 'center',
										marginBottom: RFValue(20)
									}
								]}>
								You can control this information i.e. whether to show it to others or hide it from all.
							</Text>

							<GenderOption />
							<InputFeild
								onChangeText={txt => {
									set_designation(txt);
								}}
								title='Job Title'
								value={designation}
							/>
							<InputFeild
								onChangeText={txt => {
									set_company(txt);
								}}
								title='Company'
								value={company}
							/>
							<InputFeild
								onChangeText={txt => {
									set_address(txt);
								}}
								title='Address'
								value={address}
							/>

							<InputFeild
								onChangeText={txt => {
									set_phone_number(txt);
								}}
								title='Phone'
								value={phone_number}>
								<TouchableOpacity
									style={{
										alignSelf: 'center'
									}}
									onPress={() => set_phone_number('')}>
									<FontAwosome name='minus-circle' size={24} color={colors.primaryColor} />
								</TouchableOpacity>
							</InputFeild>
							<InputFeild
								onChangeText={txt => {
									set_twitter_link(txt);
								}}
								title='Twitter'
								value={twitter_link}
							/>
							<InputFeild
								onChangeText={txt => {
									set_linkedin_link(txt);
								}}
								title='Linkedin'
								value={linkedin_link}
							/>
							<InputFeild
								onChangeText={txt => {
									set_facebook_link(txt);
								}}
								title='Facebook'
								value={facebook_link}
							/>
						</View>
					</ScrollView>

					<LoadingDialog visible={loading} />
				</KeyboardAvoidingView>

				<ActionSheet
					ref={actionSheetRef}
					title=''
					options={['Male', 'Female', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={2}
					onPress={index => {
						if (index === 0) {
							set_gender('male');
						}
						if (index === 1) {
							set_gender('female');
						}
					}}
				/>
				<ActionSheet
					ref={privacyActionSheetRef}
					title=''
					options={['Public', 'Private', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={2}
					onPress={index => {
						if (index === 0) {
							set_is_private(false);
						}
						if (index === 1) {
							set_is_private(true);
						}
					}}
				/>
				<ActionSheet
					ref={pickImageActionSheetRef}
					title=''
					options={['Photos', 'Camera', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={2}
					onPress={index => {
						if (index === 0) {
							ImagePicker.openPicker({
								width: 250,
								height: 250,
								cropping: true
							}).then(image => {
								console.error(image);
								setPickedNewImage(true);
								set_image(image);
							});
						}
						if (index === 1) {
							ImagePicker.openCamera({
								width: 250,
								height: 250,
								cropping: true
							}).then(image => {
								setPickedNewImage(true);
								set_image(image);
							});
						}
					}}
				/>
			</SafeAreaView>
		</>
	);
};

const InputFeild = memo(props => (
	<View
		style={[
			styles.containerInputFeild,
			{
				borderTopWidth: props.textBorder ? 0 : 0.5
			}
		]}>
		<Text style={[exStyles.infoDetailR16, styles.txtFeildTitle]}>{props.title}</Text>
		<TextInput
			maxLength={500}
			style={[
				styles.txtinputFeild,
				{
					borderTopWidth: props.textBorder ? 0.5 : 0
				},
				props.inputStyle
			]}
			multiline={props.multiline}
			numberOfLines={props.numberOfLines}
			onChangeText={t => {
				props.onChangeText(t);
			}}
			value={props.value}
		/>
		{props.children}
	</View>
));

const styles = StyleSheet.create({
	containerInputFeild: {
		flexDirection: 'row',
		alignItems: 'center',
		borderColor: 'rgba(	126, 131, 137, 0.2)',
		marginHorizontal: 24,
		paddingVertical: 18
	},
	txtFeildTitle: {
		width: 88,
		color: colors.secondaryText
	},
	txtinputFeild: {
		flex: 1,
		borderColor: 'rgba(	126, 131, 137, 0.2)',
		marginStart: 16,
		fontSize: 16,
		fontWeight: '400',
		color: colors.primaryText,
		letterSpacing: 0.3
	},
	imgProfilePic: {
		height: 88,
		width: 88,
		borderRadius: 88 / 2,
		resizeMode: 'stretch',
		alignSelf: 'center',
		marginTop: 30,
		borderWidth: 0.5,
		borderColor: 'rgba(	126, 131, 137, 0.2)'
	},
	txtChangeProfile: {
		color: colors.primaryColor,
		textDecorationLine: 'underline',
		marginBottom: 20
	},
	deleteButton: {
		marginStart: 24
	},
	cv: {
		paddingStart: 16,
		paddingEnd: 2,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 2,
		borderWidth: 1,
		borderRadius: 16,
		borderColor: colors.primaryColor,
		marginStart: 16,
		backgroundColor: colors.unSelected
	}
});

const mapDispatchToProps = dispatch => ({
	setUser: params => dispatch(setUserFun(params))
});

export default connect(null, mapDispatchToProps)(withDimensions(withTheme(EditProfile)));
