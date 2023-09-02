import * as React from 'react';
import { memo, useState, useEffect, createRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	FlatList,
	ImageBackground,
	Share,
	Linking
} from 'react-native';
import { Header, LoadingDialog, FastImageComponent } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { UPDATE_PROFILE } from '@utils/Constants';
import ActionSheet from 'react-native-actionsheet';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/FontAwesome5';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import { GET_MY_PROFILE } from '../../utils/Constants';
import { AboutText } from '../../components';
import { getQRCode } from '../../apis/LoopExpoApi';
import AsyncStorage from '@react-native-community/async-storage';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const EditProfile = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({
		fname: '',
		lname: '',
		image: '',
		user_interest: [],
		linkedin_link: '',
		facebook_link: '',
		twitter_link: '',
		job_title: '',
		company_name: '',
		profile: {
			address: '',
			about_me: '',
			phone_number: '',
			website: '',
			gender: '',
			resume: ''
		}
	});
	// const [qrImage, setQrImage] = useState('');

	const actionSheetRef = createRef();

	useFocusEffect(
		React.useCallback(() => {
			getData();
		}, [])
	);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getProfile();
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async () => {
					getData();
				}
			});
		}
	};

	const onShare = async () => {
		try {
			const result = await Share.share({
				message: user.share_url
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const getProfile = () => {
		setLoading(true);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_MY_PROFILE,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(async response => {
				setLoading(false);
				console.error(JSON.stringify(response.data));
				if (response.data._metadata.status === 'SUCCESS') {
					// get user data and update with new data in async storage
					const userData = await AsyncStorage.getItem('user');
					const parseData = JSON.parse(userData);
					parseData.fname = response.data.records.fname;
					parseData.lname = response.data.records.lname;
					parseData.image = response.data.records.image;
					parseData.email = response.data.records.email;

					ShareData.getInstance().name = `${parseData.fname} ${parseData.lname}`;
					ShareData.getInstance().image = parseData.image;
					ShareData.getInstance().email = parseData.email;

					await AsyncStorage.setItem('user', JSON.stringify(parseData));
					setUser(response.data.records);
				}
			})
			.catch(e => {
				setLoading(false);
				console.error(JSON.stringify(e));
			});
	};

	const privacyCallback = async isPrivate => {
		// setLoading(true);

		const formData = new FormData();

		formData.append('first_name', user.fname);
		formData.append('last_name', user.lname);
		formData.append('website', user.profile.website);
		formData.append('about_me', user.profile.about_me);
		formData.append('gender', user.profile.gender);
		formData.append('designation', user.job_title);
		formData.append('company', user.company_name);
		formData.append('address', user.profile.address);
		formData.append('linkedin_link', user.linkedin_link);
		formData.append('facebook_link', user.facebook_link);
		formData.append('twitter_link', user.twitter_link);
		formData.append('phone_number', user.profile.phone_number);
		formData.append('is_private', isPrivate);
		formData.append('intrest', user.user_interest.map(item => item.categories.name).join(','));

		console.error(`data= ${JSON.stringify(formData)}`);
		fetch(ShareData.getInstance().baseUrl + UPDATE_PROFILE, {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(res => res.json())
			.then(response => {
				// setLoading(false);
				// getData();
				// console.error(JSON.stringify(response));
			})
			.catch(error => {
				alert(error);
				setLoading(false);
			});
	};

	const MyInterest = () => (
		<View>
			<FlatList
				scrollEnabled={false}
				horizontal={false}
				numColumns={4}
				showsHorizontalScrollIndicator={false}
				style={styles.interestFlatlist}
				contentContainerStyle={[
					styles.justAlign,
					{
						alignSelf: 'center'
					}
				]}
				data={user.user_interest}
				renderItem={({ item }) => (
					<View style={styles.itemUserInterest}>
						<Text style={[exStyles.infoSmallM11, { color: 'white' }]}>{item.categories.name}</Text>
					</View>
				)}
			/>
		</View>
	);

	const Resume = () =>
		user.profile.resume == '' || user.profile.resume == null ? null : (
			<TouchableOpacity
				activeOpacity={0.6}
				style={{
					paddingHorizontal: 16,
					paddingVertical: 4,
					alignSelf: 'center',
					borderWidth: 1,
					borderRadius: 16,
					borderColor: colors.primaryColor,
					marginBottom: 24
				}}
				onPress={() => {
					Linking.openURL(user.profile.resume);
				}}>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryColor }]}>
					{`${user.fname + user.lname}_CV.${user.profile.resume.substring(user.profile.resume.lastIndexOf('.') + 1)}`}
				</Text>
			</TouchableOpacity>
		);

	const ProfileVisibility = () => (
		<TouchableOpacity
			activeOpacity={0.7}
			style={styles.btnTile}
			onPress={() =>
				navigation.navigate('Privacy', {
					user
				})
			}>
			<Text style={[exStyles.infoLargeM18, { color: colors.primaryText, flex: 1 }]}>Set Profile Visibilty</Text>
			<Text style={[exStyles.infoDetailR16, styles.txtPrivate]}>{user.profile.is_private === 1 ? 'Private' : 'Public'}</Text>

			<MaterialIcons name='keyboard-arrow-right' size={32} color={colors.secondaryText} />
		</TouchableOpacity>
	);

	const InfoTile = props => (
		<View style={styles.infoTileContainer}>
			<View style={styles.infoTileIcon}>{props.IconComponent}</View>
			{props.value !== '' && props.value !== undefined && props.value !== null ? (
				<Text style={[exStyles.infoDetailR16, { color: colors.primaryText }]}>{props.value}</Text>
			) : (
				<Text style={{ color: colors.secondaryText }}>{props.placeholder}</Text>
			)}
		</View>
	);

	const PersonalInfo = () => (
		<>
			<Text style={[exStyles.infoLargeM16, styles.txtTicker]}>Public/Private Info</Text>
			<Text style={[exStyles.infoSmallM11, styles.txtNote11]}>
				Set your profile visibility to private, If you want to hide all the following information.
			</Text>

			<InfoTile
				value={user.profile.gender.charAt(0).toUpperCase() + user.profile.gender.slice(1)}
				placeholder=''
				IconComponent={<FIcons name='transgender' size={24} color={colors.secondaryText} />}
			/>
			<InfoTile
				value={`${user.job_title} \n@${user.company_name}`}
				IconComponent={<MCIcons name='account-details' size={24} color={colors.secondaryText} />}
			/>
			<InfoTile
				placeholder='Edit profile to Add address'
				value={user.profile.address}
				IconComponent={<Entypo name='location-pin' size={24} color={colors.secondaryText} />}
			/>
			<InfoTile
				placeholder='Edit profile to Email'
				value={user.email}
				IconComponent={<Entypo name='mail' size={24} color={colors.secondaryText} />}
			/>
			<InfoTile
				placeholder='Edit profile to Add Phone'
				value={user.profile.phone_number}
				IconComponent={<Entypo name='phone' size={24} color={colors.secondaryText} />}
			/>
			<InfoTile
				placeholder='Edit profile to share Facebook Profile'
				value={user.facebook_link}
				IconComponent={<Entypo name='facebook-with-circle' size={24} color={colors.secondaryText} />}
			/>
			<InfoTile
				placeholder='Edit profile to share Linkedin Profile'
				value={user.linkedin_link}
				IconComponent={<Entypo name='linkedin' size={24} color={colors.secondaryText} />}
			/>

			<InfoTile
				placeholder='Edit profile to Twitter Profile'
				value={user.twitter_link}
				IconComponent={<Entypo name='twitter' size={24} color={colors.secondaryText} />}
			/>
		</>
	);

	return (
		<>
			<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground }} />
			<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
				<View style={{ flex: 1 }}>
					<Header
						title='My Profile'
						theme={theme}
						onBackPress={() => {
							navigation.goBack();
						}}
						onQRPress={() => {
							navigation.navigate('QRCodeView');
						}}
						onEditPress={() => {
							navigation.navigate('EditProfile', { user });
						}}
					/>
					<ScrollView style={{ flex: 1, backgroundColor: themes[theme].headerBackground }}>
						<View style={{ flex: 1, backgroundColor: 'white', paddingBottom: 32 }}>
							<View style={styles.profilePicContainer}>
								<View
									style={{
										alignSelf: 'center',
										backgroundColor: colors.secondaryColor
									}}>
									<FastImageComponent
										style={styles.profilePicImage}
										source={{
											uri: user.image
										}}
									/>
									<TouchableOpacity style={styles.fabCameraButton} onPress={() => navigation.navigate('EditProfile', { user })}>
										<ImageBackground style={styles.fabCameraIcon} source={require('@assets/cameraImage.png')}>
											<Image style={styles.fabAddIcon} source={require('@assets/addCircle.png')} />
										</ImageBackground>
									</TouchableOpacity>
								</View>
								<Text style={[exStyles.largeTitleR28, styles.txtUsername]}>{`${user.fname} ${user.lname}`}</Text>
								<Text style={[exStyles.infoLargeM16, styles.txtEmail]}>{user.email}</Text>
								<MyInterest />
							</View>

							<View style={{ justifyContent: 'center' }}>
								<View style={{ margin: 24 }}>
									<AboutText about=' Me' text={user.profile.about_me} justify />
								</View>
								<Resume />
								<ProfileVisibility />
								<PersonalInfo />
							</View>
						</View>
					</ScrollView>
				</View>

				<ActionSheet
					ref={actionSheetRef}
					title=''
					options={['Change Password', 'Share My Profile', 'Edit Profile', 'Help', 'Logout']}
					cancelButtonIndex={4}
					onPress={index => {
						if (index === 0) {
							navigation.navigate('ChangePassword');
						}
						if (index === 1) {
							onShare();
						}
					}}
				/>

				{loading ? <LoadingDialog absolute size='large' theme={theme} /> : null}
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	justAlign: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	containerRowCenter: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	itemUserInterest: {
		paddingHorizontal: 12,
		paddingVertical: 2,
		borderWidth: 1,
		borderRadius: 12,
		borderColor: 'white',
		marginHorizontal: 4,
		alignSelf: 'center',
		marginVertical: 4
	},
	infoTileContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginStart: 24,
		borderTopWidth: 0.5,
		borderColor: 'rgba(	126, 131, 137, 0.2)',
		paddingVertical: 16
	},
	infoTileIcon: {
		marginEnd: 20
	},
	profilePicContainer: {
		paddingTop: 12,
		paddingBottom: 32,
		backgroundColor: colors.secondaryColor,
		borderBottomRightRadius: RFValue(40),
		borderBottomLeftRadius: RFValue(40)
	},
	profilePicImage: {
		height: 144,
		width: 144,
		borderRadius: 144 / 2,
		resizeMode: 'stretch',
		overflow: 'hidden',
		backgroundColor: colors.secondaryColor,
		backgroundColor: '#a6a6a6'
	},
	fabCameraButton: {
		position: 'absolute',
		resizeMode: 'stretch',
		bottom: RFValue(10),
		right: 0
	},
	fabAddIcon: {
		position: 'absolute',
		height: RFValue(15),
		width: RFValue(15),
		resizeMode: 'stretch',
		bottom: RFValue(-3),
		right: RFValue(-1)
	},
	fabCameraIcon: {
		height: RFValue(24),
		width: RFValue(26)
	},
	txtUsername: {
		color: '#fff',
		alignSelf: 'center',
		marginTop: 24
	},
	txtEmail: {
		color: '#fff',
		alignSelf: 'center',
		marginTop: 8
	},
	interestListContainer: {
		overflow: 'hidden',
		minHeight: RFValue(27),
		justifyContent: 'center'
	},
	interestFlatlist: {
		marginTop: 10,
		marginHorizontal: RFValue(24),
		flex: 0,
		flexGrow: 0,
		alignSelf: 'center'
	},
	txtAboutMe: {
		color: 'black',
		fontSize: RFValue(16),
		textAlign: 'center',
		marginTop: RFValue(20),
		marginHorizontal: RFValue(10)
	},
	btnEditProfile: {
		alignSelf: 'center',
		width: RFValue(192),
		borderRadius: RFValue(20),
		marginTop: RFValue(20)
	},
	btnTile: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		backgroundColor: colors.unSelected,
		paddingHorizontal: 16
	},
	iconBtnTile: {
		height: RFValue(25),
		width: RFValue(25),
		resizeMode: 'contain'
	},
	txtPrivate: {
		color: colors.secondaryText,
		marginEnd: 10
	},
	txtTicker: {
		paddingHorizontal: 24,
		color: colors.secondaryText,
		backgroundColor: colors.unSelected,
		paddingVertical: 8,
		marginTop: 24
	},
	txtNote11: {
		paddingHorizontal: RFValue(20),
		fontSize: RFValue(11),
		color: 'grey',
		paddingVertical: RFValue(10),
		textAlign: 'center',
		marginBottom: RFValue(20)
	}
});

export default withDimensions(withTheme(memo(EditProfile)));
