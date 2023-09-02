import React, { memo, useState, useImperativeHandle } from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Pressable,
	Modal,
	Linking,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	TextInput,
	KeyboardAvoidingView
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { SAVE_EXCHNGE_CONTACTS } from '@utils/Constants';
import axios from 'axios';
import { ShareData } from '@utils';
import { LoadingDialog, FastImageComponent } from '@components';
import { colors, exStyles } from '@styles';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ModalExchangeContact = ({ ...props }, ref) => {
	const [loading, setLoading] = useState(false);
	const [isSocialSelected, setIsSocialSelected] = useState(true);
	const [isFbSelected, setIsFbSelected] = useState(true);
	const [isLinkedinSelected, setIsLinkedinSelected] = useState(true);
	const [isInstaSelected, setIsInstaSelected] = useState(true);
	const [isTwitterSelected, setIsTwitterSelected] = useState(true);
	const [isWhatsappSelected, setIsWhatsappSelected] = useState(true);
	const [isEmailSelected, setIsEmailSelected] = useState(true);
	const [isPhoneSelected, setIsPhoneSelected] = useState(true);
	const [isAddressSelected, setIsAddressSelected] = useState(true);
	const [isWebsiteSelected, setIsWebsiteSelected] = useState(true);

	const [email, setEmail] = useState(props.data.email);
	const [phone, setPhone] = useState(props.data.profile.phone_number);
	const [address, setAddress] = useState(props.data.profile.address);
	const [website, setWebsite] = useState(props.data.profile.website);

	const submitPress = () => {
		postExchangeContact()
			.then(data => {
				alert('Contact Exchanged');
				if (props.getData !== undefined) {
					props.getData();
				}
				props.onClose();
			})
			.catch(e => {
				alert(e);
			});
	};

	const postExchangeContact = () =>
		new Promise((resolve, reject) => {
			setLoading(true);

			const formdata = new FormData();
			if (props.getData !== undefined) {
				formdata.append('is_exchanged', true);
			}
			formdata.append('exchange_with_user', props.userId);
			if (isSocialSelected && isFbSelected) {
				formdata.append('data[facebook]', props.data.facebook_link);
			}
			if (isSocialSelected && isLinkedinSelected) {
				formdata.append('data[linkedin]', props.data.linkedin_link);
			}
			if (isSocialSelected && isTwitterSelected) {
				formdata.append('data[twitter]', props.data.twitter_link);
			}
			if (isSocialSelected && isWhatsappSelected) {
				formdata.append('data[whatsapp]', props.data.profile.phone_number);
			}
			if (isEmailSelected) {
				formdata.append('data[email1]', email);
			}
			if (isPhoneSelected) {
				formdata.append('data[mobile]', phone);
			}
			if (isAddressSelected) {
				formdata.append('data[address1]', address);
			}
			if (isWebsiteSelected) {
				formdata.append('data[website]', website);
			}
			// if (isSocialSelected && isInstaSelected) {
			//   formdata.append("data[instagram]", props.data.instagram_link);
			// }

			axios({
				method: 'POST',
				url: ShareData.getInstance().baseUrl + SAVE_EXCHNGE_CONTACTS,
				data: formdata,
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${ShareData.getInstance().access_token}`,
					'Content-Type': 'multipart/form-data'
				}
			})
				.then(response => {
					setLoading(false);
					if (response.data._metadata.status === 'SUCCESS') {
						resolve(response.data.records);
					} else {
						reject(`${response.data._metadata.message}\n${response.data._metadata.errors.join('\n')}`);
					}
				})
				.catch(error => {
					setLoading(false);
					reject(`Failed to  Exchange Contact, Please try again ${error} `);
				});
		});

	const renderHeader = () => (
		<View>
			<Text style={[exStyles.mediumTitleMed20, { color: colors.primaryText, textAlign: 'center' }]}>Exchange Contact</Text>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.headerCloseIcon,
					{
						left: RFValue(28),
						width: RFValue(30)
					}
				]}
				onPress={() => {
					props.onClose();
				}}>
				<MaterialIcons name='close' size={RFValue(24)} color={colors.primaryText} />
			</Pressable>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.headerCloseIcon
				]}
				onPress={() => {
					submitPress();
				}}>
				<MaterialIcons name='check' size={RFValue(24)} color={colors.primaryText} />
			</Pressable>
		</View>
	);

	const renderBody = () => (
		<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={30}>
			<ScrollView style={{ flex: 1 }}>
				{/* socials */}
				<View style={styles.itemHeadingContainer}>
					<Feather name='users' size={RFValue(20)} style={styles.iconStyle} />
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, flex: 1 }]}>Social</Text>
					<AddSubButon
						isAdd
						size={20}
						style={{ marginEnd: RFValue(20) }}
						isAdd={isSocialSelected}
						onPress={() => {
							setIsSocialSelected(!isSocialSelected);
						}}
					/>
				</View>
				<View style={styles.socialIconContainer}>
					{props.data.facebook_link === null ? null : (
						<View style={{ padding: 10 }}>
							<Image style={styles.socialIconStyle} source={require('@assets/fb.png')} />
							<AddSubButon
								isAdd
								size={10}
								style={styles.floatingAddBtn}
								isAdd={isFbSelected}
								onPress={() => {
									setIsFbSelected(!isFbSelected);
								}}
							/>
						</View>
					)}
					{props.data.linkedin === null ? null : (
						<View style={{ padding: 10 }}>
							<Image style={styles.socialIconStyle} source={require('@assets/linkedin.png')} />
							<AddSubButon
								isAdd
								size={10}
								style={styles.floatingAddBtn}
								isAdd={isLinkedinSelected}
								onPress={() => {
									setIsLinkedinSelected(!isLinkedinSelected);
								}}
							/>
						</View>
					)}
					{props.data.instagram_link === null ? null : (
						<View style={{ padding: 10 }}>
							<Image style={styles.socialIconStyle} source={require('@assets/instagram.png')} />
							<AddSubButon
								isAdd
								size={10}
								style={styles.floatingAddBtn}
								isAdd={isInstaSelected}
								onPress={() => {
									setIsInstaSelected(isInstaSelected);
								}}
							/>
						</View>
					)}

					{props.data.twitter_link === null ? null : (
						<View style={{ padding: 10 }}>
							<Image style={styles.socialIconStyle} source={require('@assets/twitter.png')} />
							<AddSubButon
								isAdd
								size={10}
								style={styles.floatingAddBtn}
								isAdd={isTwitterSelected}
								onPress={() => {
									setIsTwitterSelected(!isTwitterSelected);
								}}
							/>
						</View>
					)}
					{props.data.linkedin_link === null ? null : (
						<View style={{ padding: 10 }}>
							<Image style={styles.socialIconStyle} source={require('@assets/whatsapp.png')} />
							<AddSubButon
								isAdd
								size={10}
								style={styles.floatingAddBtn}
								isAdd={isWhatsappSelected}
								onPress={() => {
									setIsWhatsappSelected(!isWhatsappSelected);
								}}
							/>
						</View>
					)}
				</View>
				<View style={styles.separator} />
				{/* email */}
				<View style={styles.itemHeadingContainer}>
					<MaterialIcons name='email-outline' size={RFValue(20)} style={styles.iconStyle} />
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, flex: 1 }]}>Email</Text>
					<AddSubButon
						size={20}
						style={{ marginEnd: RFValue(20) }}
						isAdd={isEmailSelected}
						onPress={() => {
							setIsEmailSelected(!isEmailSelected);
						}}
					/>
				</View>
				<TextInput style={[styles.txtInput, {}]} value={email} onChangeText={txt => setEmail(txt)} />

				<View style={styles.separator} />
				{/* Phone */}
				<View style={styles.itemHeadingContainer}>
					<MaterialIcons name='phone' size={RFValue(20)} style={styles.iconStyle} />
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, flex: 1 }]}>Phone</Text>
					<AddSubButon
						size={20}
						style={{ marginEnd: RFValue(20) }}
						isAdd={isPhoneSelected}
						onPress={() => {
							setIsPhoneSelected(!isPhoneSelected);
						}}
					/>
				</View>
				<View style={[styles.landlineAndMobile, { width: screenWidth, marginStart: screenWidth / 3 }]}>
					<Text
						style={[
							exStyles.infoLargeM16,
							{
								color: colors.secondaryText,
								textAlign: 'center',
								marginEnd: 32
							}
						]}>
						Mobile
					</Text>
					<TextInput
						keyboardType='phone-pad'
						style={[styles.txtInput, { alignSelf: 'flex-start' }]}
						value={phone}
						onChangeText={txt => setPhone(txt)}
					/>
				</View>
				<View style={styles.separator} />

				{/* Address */}
				<View style={styles.itemHeadingContainer}>
					<Icon name='location-on' size={RFValue(22)} style={styles.iconStyle} />
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, flex: 1 }]}>Address</Text>
					<AddSubButon
						size={20}
						style={{ marginEnd: RFValue(20) }}
						isAdd={isAddressSelected}
						onPress={() => {
							setIsAddressSelected(!isAddressSelected);
						}}
					/>
				</View>
				<TextInput
					style={[styles.txtInput, { textDecorationLine: undefined }]}
					value={address}
					onChangeText={txt => setAddress(txt)}
				/>
				<View style={styles.separator} />
				{/* website */}
				<View style={styles.itemHeadingContainer}>
					<MaterialIcons name='web' size={RFValue(22)} style={styles.iconStyle} />
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, flex: 1 }]}>Website</Text>
					<AddSubButon
						size={20}
						style={{ marginEnd: RFValue(20) }}
						isAdd={isWebsiteSelected}
						onPress={() => {
							setIsWebsiteSelected(!isWebsiteSelected);
						}}
					/>
				</View>
				<TextInput style={styles.txtInput} value={website} onChangeText={txt => setWebsite(txt)} />
				<Text style={[exStyles.infoDetailR16, styles.address]}>{props.data.profile.website}</Text>
			</ScrollView>
		</KeyboardAvoidingView>
	);

	return (
		<Modal
			animationType='slide'
			transparent
			visible={props.visible}
			onRequestClose={() => {
				props.onClose();
			}}>
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					{renderHeader()}
					{renderBody()}
				</View>
			</SafeAreaView>
			{loading ? <LoadingDialog absolute size='large' /> : null}
		</Modal>
	);
};

const AddSubButon = props => (
	<TouchableOpacity style={[{ padding: RFValue(3) }, props.style]} onPress={props.onPress}>
		{/* <Image
			style={{ height: RFValue(props.size), width: RFValue(props.size) }}
			source={
				props.isAdd
					? require('@assets/addCircleFill.png')
					: require('@assets/minusCircle.png')
			}
		/> */}
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	centeredView: {
		height: screenHeight,
		width: screenWidth
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

	separator: {
		height: 1,
		backgroundColor: '#000000',
		opacity: 0.2,
		marginTop: 14,
		marginLeft: 24
	},

	// Header

	headerCloseIcon: {
		position: 'absolute',
		right: RFValue(28),
		alignSelf: 'flex-end'
	},

	// body
	itemHeadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		marginTop: 30
	},

	// social
	iconStyle: {
		marginStart: 30,
		marginEnd: 20,
		color: colors.secondaryText
	},
	socialIconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	socialIconStyle: {
		height: RFValue(24),
		width: RFValue(24),
		resizeMode: 'contain'
	},

	// phone
	landlineAndMobile: {
		flexDirection: 'row',
		// justifyContent: 'center',
		width: screenWidth * 0.5,
		alignSelf: 'center',
		alignItems: 'center'
	},
	landlineAndMobileText: { color: 'grey', fontSize: 16, alignSelf: 'center' },
	numberText: {
		color: colors.secondaryText,
		textDecorationLine: 'underline',
		textAlign: 'right',
		marginBottom: 10
	},

	// Address
	address: {
		color: colors.secondaryText,
		alignSelf: 'center',
		width: screenWidth * 0.6
	},
	floatingAddBtn: {
		position: 'absolute',
		top: RFValue(3),
		right: RFValue(3)
	},
	txtInput: {
		...exStyles.infoDetailR16,
		color: colors.secondaryText,
		alignSelf: 'center',
		width: screenWidth * 0.6,
		textDecorationLine: 'underline'
	}
});

export default memo(ModalExchangeContact);
