import React, { memo, useRef, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView,
	Pressable,
	Text,
	Dimensions,
	TouchableOpacity,
	Animated,
	Easing,
	ActivityIndicator
} from 'react-native';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors, exStyles } from '@styles';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';
import CameraRoll from '@react-native-community/cameraroll';
import Toast from 'react-native-toast-message';
import Axios from 'axios';
import { ShareData } from '@utils';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { GET_MY_PROFILE } from '../../utils/Constants';
import { getQRCode } from '../../apis/LoopExpoApi';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const QRCodeView = ({ navigation, route, ...props }) => {
	const viewRef = useRef();
	const [screenShotUri, setscreenShotUri] = useState('');
	const [loading, setLoading] = useState(true);

	const [userData, setUserData] = useState('');
	const [qrData, setQrData] = useState('');
	const { theme } = props;

	useEffect(() => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_MY_PROFILE,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(async response => {
				if (response.data._metadata.status === 'SUCCESS') {
					setUserData(response.data.records);
					getQRCode(response.data.records.id).then(response => {
						if (response._metadata.status == 'SUCCESS') {
							setQrData(response.records.qr_img);
						}
					});
				}
				setLoading(false);
			})
			.catch(e => {
				setLoading(false);
				console.error(JSON.stringify(e));
			});
	}, []);

	const Header = () => (
		<View style={styles.header}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
					},
					styles.closeButton
				]}
				onPress={() => {
					navigation.goBack();
				}}>
				<MCIcons name='window-close' size={24} color={colors.white} />
			</Pressable>
			{/* <Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
					},
					styles.closeButton
				]}
				onPress={() => {}}>
				<MCIcons name='share-variant' size={24} color={colors.white} />
			</Pressable> */}
		</View>
	);

	const UserInfo = () => (
		<View style={{ alignItems: 'center', marginTop: RFValue(16) }}>
			<FastImage
				source={{ uri: userData.image }}
				style={{
					height: RFValue(120),
					width: RFValue(120),
					borderRadius: RFValue(120)
				}}
			/>
			<Text style={[exStyles.largeTitleR28, { color: colors.white, marginTop: 8 }]}>{`${userData.fname} ${userData.lname}`}</Text>
			<Text style={[exStyles.infoLargeM16, { color: colors.white, marginTop: 4 }]}>
				{`${userData.job_title}  ${userData.company_name == '' ? '' : `@${userData.company_name}`}`}
			</Text>
			{userData.profile === '' ? null : (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-around',
						alignItems: 'center',
						marginVertical: 4
					}}>
					<IonIcons name='location-sharp' size={24} color={colors.white} />
					<Text style={[exStyles.infoDetailR16, { color: colors.white }]}>{userData.profile.address}</Text>
				</View>
			)}
		</View>
	);

	const QRCode = () => {
		const base64 = `data:image/png;base64,${qrData}`;
		return (
			<View style={styles.qrCode}>
				<FastImage
					source={{ uri: base64 }}
					style={{
						width: screenHeight * 0.25,
						height: screenHeight * 0.25
					}}
				/>
			</View>
		);
	};

	const Buttons = () => (
		<View style={{ alignItems: 'center', marginBottom: 32 }}>
			<TouchableOpacity
				activeOpacity={0.7}
				style={styles.button}
				onPress={() => {
					onCapture();
				}}>
				<Feather name='download' size={24} color={colors.secondaryColor} />
				<Text style={[exStyles.ButtonSM20, { color: colors.secondaryColor }]}>Save to Gallery</Text>
			</TouchableOpacity>
			<TouchableOpacity
				activeOpacity={0.7}
				style={styles.button2}
				onPress={() => {
					navigation.navigate('QRScanView');
				}}>
				<AntDesign name='scan1' size={24} color={colors.white} />
				<Text style={[exStyles.ButtonSM20, { color: colors.white }]}>Scan QR Code</Text>
			</TouchableOpacity>
		</View>
	);

	const onCapture = () => {
		viewRef.current.capture().then(uri => {
			saveImage(uri);
		});
	};

	const saveImage = async uri => {
		setscreenShotUri(uri);
		CameraRoll.saveToCameraRoll(uri)
			.then(() => {
				Toast.show({
					type: 'success',
					text1: 'Success',
					text2: 'Image Save Successfully'
				});
			})
			.catch(err => console.log('err:', err));
	};

	const SkeletonLoader = () => (
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
			{/* <SkeletonPlaceholder
				highlightColor='rgba(0, 0, 0, 0.14)'
				backgroundColor='lightgrey'
				speed={1000}
			>
				<View
					style={{
						width: 120,
						height: 120,
						borderRadius: 120 / 2,
						justifyContent: 'center',
						alignSelf: 'center',
						marginTop: 12,
						marginBottom: 8
					}}
				/>

				<View
					style={{
						width: screenWidth * 0.7,
						height: screenWidth * 0.7,
						borderRadius: 24,
						justifyContent: 'center',
						alignSelf: 'center',
						marginTop: 32
					}}
				/>

				<View
					style={{
						width: screenWidth * 0.55,
						height: 48,
						borderRadius: 24,
						justifyContent: 'center',
						alignSelf: 'center',
						marginTop: 32
					}}
				/>
				<View
					style={{
						width: screenWidth * 0.55,
						height: 48,
						borderRadius: 24,
						justifyContent: 'center',
						alignSelf: 'center',
						marginTop: 16
					}}
				/>
			</SkeletonPlaceholder> */}
		</View>
	);

	const customToast = {
		success: ({ text1, ...props }) => (
			<View
				style={{
					paddingVertical: 4,
					paddingHorizontal: 12,
					backgroundColor: '#fff',
					borderRadius: 12,
					flexDirection: 'row',
					alignItems: 'center'
				}}>
				<FastImage
					source={{ uri: screenShotUri }}
					style={{
						height: 32,
						width: 32,
						borderRadius: 6,
						marginEnd: 16
					}}
				/>
				<View>
					<Text style={[exStyles.infoLargeM16, { color: 'green' }]}>{text1}</Text>
					<Text style={[exStyles.infoDetailR16, { color: colors.primaryText }]}>{props.text2}</Text>
				</View>
			</View>
		)
	};

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<Header />

			{loading ? (
				<SkeletonLoader />
			) : (
				<ScrollView>
					<ViewShot ref={viewRef} style={{ backgroundColor: themes[theme].headerBackground }}>
						<UserInfo />
						<QRCode />
					</ViewShot>
					<Buttons />
				</ScrollView>
			)}
			<Toast config={customToast} position='top' topOffset={48} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	closeButton: {
		borderRadius: 16,
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		height: RFValue(32),
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginHorizontal: 24,
		alignItems: 'center'
	},
	qrCode: {
		alignItems: 'center',
		alignSelf: 'center',
		padding: 48,
		backgroundColor: colors.white,
		borderRadius: 24,
		marginVertical: 24
	},
	button: {
		width: screenWidth * 0.6,
		backgroundColor: 'white',
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		borderRadius: 32,
		alignItems: 'center'
	},
	button2: {
		marginTop: 16,
		width: screenWidth * 0.6,
		backgroundColor: 'rgba(225,225,225, 0.1)',
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		borderRadius: 32,
		borderWidth: 1,
		borderColor: 'white',
		alignItems: 'center'
	}
});

export default withDimensions(withTheme(memo(QRCodeView)));
