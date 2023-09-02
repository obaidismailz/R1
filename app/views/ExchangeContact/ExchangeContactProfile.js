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
	KeyboardAvoidingView,
	Alert,
	TextInput,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Linking,
	ImageBackground
} from 'react-native';

import { FormButton, LoadingDialog } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';

import { getMyProfile as getMyProfileApi } from '@apis/UserApis';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import ModalExchangeContact from '../LoopUserProfile/components/ModalExchangeContact';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ExchangeContactProfile = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const myData = route.params.data.user;
	const userData = route.params.data.exchanged_with_user;
	const exchangedDataArr = route.params.data.exchange_contact_details;
	// const status = route.params.data.approved_status === "true" ? "exchanged" :
	//   route.params.data.request_status === "true" ? "requested" : "pending"
	const { status } = route.params.data;

	const exchangeNote =		exchangedDataArr === undefined
		? ''
		: exchangedDataArr.length === 0
			? ''
			: exchangedDataArr.find(item => item.key === 'custom_message')
			  === undefined
				? ''
				: exchangedDataArr.find(item => item.key === 'custom_message')
			  === undefined;

	const [loading, setLoading] = useState(true);
	const [contactPopupVisible, setContactPopupVisible] = useState(false);
	const [profile, setProfile] = useState({
		...myData,
		instagram_link: ''
	});

	useEffect(() => {
		getMyProfile();
	}, []);

	function getMyProfile() {
		setLoading(true);
		getMyProfileApi().then((response) => {
			if (response.data._metadata.status === 'SUCCESS') {
				console.error(JSON.stringify(response.data));
				setProfile(response.data.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
		// .catch((e)=> alert(e))
	}

	function getHeadngText() {
		return status === 'exchanged'
			? `You have exchanged your contact with
   this user. You can save this contact to your
   phone or export as Pdf.`
			: status === 'pending'
				? `This User has not shared cotact with you.
   You can remind them via chat.`
				: `This user has requested to Exchange contact
   with you.  You can save this contact to
   your phone or export as Pdf.`;
	}

	return (
		<SafeAreaView
			theme={theme}
			style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}
		>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<View style={styles.mainContainer}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingTop: RFValue(20),
						marginBottom: RFValue(10)
					}}
				>
					<TouchableOpacity
						style={{
							position: 'absolute',
							paddingEnd: RFValue(28),
							alignSelf: 'flex-end',
							marginStart: RFValue(30),
							bottom: RFValue(5),
							zIndex: 100
						}}
						onPress={() => {
							navigation.goBack();
						}}
					>
						{/* <Image
              style={{
                height: RFValue(13),
                width: RFValue(20),
                resizeMode: "contain",
              }}
              source={require("@assets/close.png")}
            /> */}
					</TouchableOpacity>
					<Text
						style={{
							flex: 1,
							fontSize: RFValue(20),
							color: 'black',
							textAlign: 'center'
						}}
					>
						{status === 'exchanged'
							? 'Contact Exchangeed'
							: status === 'pending'
								? 'Request Pending'
								: 'Exchange Request'}
					</Text>
				</View>

				<ScrollView
					style={{
						flex: 1,
						backgroundColor: colors.white,
						borderTopRightRadius: RFValue(40),
						borderTopLeftRadius: RFValue(40)
					}}
					contentContainerStyle={styles.scrollViewContentContainer}
				>
					<View
						style={{
							backgroundColor: colors.secondaryColor,
							borderBottomRightRadius: 40,
							borderBottomLeftRadius: 40
						}}
					>
						<View style={styles.profileCardContainer}>
							<Text style={{ ...styles.txtHeading, ...exStyles.infoLink14Med }}>
								{getHeadngText()}
							</Text>

							<View
								style={{ backgroundColor: '#f2f2f2', paddingTop: RFValue(10) }}
							>
								<ImageBackground
									style={styles.imgTicker}
									resizeMode='stretch'
									source={require('@assets/userRoleBackground.png')}
								>
									<Text
										style={{
											color: 'white',
											fontSize: RFValue(16),
											marginStart: RFValue(10)
										}}
									>
										Booth Staff
									</Text>
								</ImageBackground>
								<Image
									style={styles.imgProfilePic}
									source={{ uri: userData.image }}
								/>
								<Text
									style={[
										exStyles.mediumTitleMed20,
										{ color: '#000', alignSelf: 'center' }
									]}
								>
									{`${ userData.fname } ${ userData.lname }`}
								</Text>
								{status === 'pending' ? (
									<View style={{ height: RFValue(10) }} />
								) : (
									<>
										<Text
											style={[
												exStyles.infoDetailR16,
												{ alignSelf: 'center', color: '#424242' }
											]}
										>
											{`${ userData.job_title } @ ${ userData.company_name }`}
										</Text>

										<View
											style={{ flexDirection: 'row', ...exStyles.justAlign }}
										>
											{userData.facebook_link !== undefined
												&& userData.facebook_link !== null && (
												<TouchableOpacity style={{ padding: 10 }}>
													<Image
														style={styles.imgSocialIcon}
														source={require('@assets/fb.png')}
													/>
												</TouchableOpacity>
											)}
											{userData.linkedin_link !== undefined
												&& userData.linkedin_link !== null && (
												<TouchableOpacity style={{ padding: 10 }}>
													<Image
														style={styles.imgSocialIcon}
														source={require('@assets/linkedin.png')}
													/>
												</TouchableOpacity>
											)}
											{userData.twitter_link !== undefined
												&& userData.twitter_link !== null && (
												<TouchableOpacity style={{ padding: 10 }}>
													<Image
														style={styles.imgSocialIcon}
														source={require('@assets/twitter.png')}
													/>
												</TouchableOpacity>
											)}
										</View>
									</>
								)}
							</View>
						</View>
					</View>

					{status === 'pending' ? null : (
						<>
							<Text
								style={{
									...styles.txtExchangeNote,
									...exStyles.infoDetailR16
								}}
							>
								{exchangeNote}
							</Text>

							<ItemProfileInfo
								value={userData.profile.address}
								// image={require('@assets/location.png')}
							/>
							<ItemProfileInfo
								value={userData.email}
								// image={require('@assets/mail.png')}
							/>
							<ItemProfileInfo
								value={userData.profile.phone_number}
								// image={require('@assets/phone.png')}
							/>
							<ItemProfileInfo
								value={userData.profile.website}
								// image={require('@assets/website.png')}
							/>
						</>
					)}

					<View style={styles.formBtnContainer}>
						<FormButton
							isDisabled={status !== 'requested'}
							title={'EXCHANGE\n CONTACT'}
							extraStyle={{ paddingHorizontal: 20, marginEnd: 10 }}
							onPress={() => {
								setContactPopupVisible(true);
							}}
						/>
						<FormButton
							isDisabled={status === 'pending'}
							title={'SAVE THIS\n CONTACT'}
							extraStyle={{ paddingHorizontal: 20, marginStart: 10 }}
						/>
					</View>
				</ScrollView>
				<ModalExchangeContact
					getData={route.params.getData}
					visible={contactPopupVisible}
					data={profile}
					userId={userData.id}
					onClose={() => {
						setContactPopupVisible(false);
					}}
				/>
				{loading ? <LoadingDialog absolute size='large' theme={theme} /> : null}
			</View>
		</SafeAreaView>
	);
};

const ItemProfileInfo = props => (
	<View
		style={{
			flexDirection: 'row',
			marginStart: RFValue(10),
			borderTopWidth: 0.5,
			borderColor: '#cecece',
			paddingVertical: RFValue(10)
		}}
	>
		{/* <Image
			style={{
				width: RFValue(18),
				height: RFValue(24),
				resizeMode: 'contain',
				marginEnd: RFValue(20)
			}}
			source={props.image}
		/> */}
		<Text style={{ color: 'black' }}>{props.value}</Text>
	</View>
);

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: colors.white,
		width: screenWidth,
		height: screenHeight - RFValue(26),
		height: screenHeight,
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		overflow: 'hidden'
	},
	scrollViewContentContainer: {
		paddingBottom: 10,
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		overflow: 'hidden',
		backgroundColor: 'white',
		flex: 1
	},
	profileCardContainer: {
		backgroundColor: colors.white,
		paddingBottom: 20,
		borderBottomRightRadius: 40,
		borderBottomLeftRadius: 40
	},
	txtHeading: {
		fontSize: RFValue(14),
		color: '#7E8389',
		textAlign: 'center',
		paddingHorizontal: RFValue(30),
		marginBottom: RFValue(10)
	},
	imgTicker: {
		height: RFValue(24),
		width: RFValue(140),
		position: 'absolute',
		justifyContent: 'center'
	},
	imgProfilePic: {
		height: RFValue(90),
		width: RFValue(90),
		borderRadius: RFValue(90),
		alignSelf: 'center'
	},
	imgSocialIcon: {
		height: RFValue(24),
		width: RFValue(24),
		resizeMode: 'contain'
	},
	txtExchangeNote: {
		marginHorizontal: RFValue(20),
		marginBottom: RFValue(20),
		color: 'black',
		fontSize: RFValue(16),
		marginTop: RFValue(10)
	},
	formBtnContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 10,
		flex: 1,
		paddingBottom: RFValue(80),
		alignItems: 'flex-end'
	}
});

export default withDimensions(withTheme(memo(ExchangeContactProfile)));
