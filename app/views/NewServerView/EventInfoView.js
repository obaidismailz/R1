import FastImage from '@rocket.chat/react-native-fast-image';
import moment from 'moment';
import React, { memo, useEffect, useState } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView as SafeAreaViewNative,
	Text,
	ScrollView,
	TouchableOpacity,
	FlatList,
	Dimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { AboutText, ActivityIndicator, Header, FormButton, LoadingDialog } from '@components';
import { ShareData } from '@utils';
import { themes } from '../../constants/colors';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import { withDimensions } from '../../dimensions';
import { colors, exStyles } from '../../styles';
import { withTheme } from '../../theme';
import ImageCarousel from '../Exhibition/components/ImageCarousel';
import { VISITORS } from '../../utils/Constants';
import Itemauditoriumstaff from './components/ItemAuditoriumStaff';
import Sponsers from '../Exhibition/Sponsers';
import { loginPageSetting, signupPageInterests, signupPageSetting } from '../../apis/LoopExpoApi';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const EventInfoView = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const event = useSelector(state => state.eventInfo);
	const type = '';
	const [loginSetting, setLoginSetting] = useState([]);
	const [loading, setLoading] = useState(false);
	const [comingSoonStatus, setComingSoonStatus] = useState('');
	const [activityLoader, setactivityLoader] = useState(false);
	// type = event.eventData.exhibition.logo.substring(
	// 	event.eventData.exhibition.logo.lastIndexOf('.') + 1
	// );

	useEffect(() => {
		setting();
	}, []);

	setting = () => {
		setLoading(true);
		loginPageSetting().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				setLoginSetting(response.records);
				response.records.map(data => {
					if (data.key == 'coming_soon') {
						setComingSoonStatus(data.value);
					}
				});
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const signupSettings = () => {
		if (ShareData.getInstance().internetConnected) {
			setactivityLoader(true);
			signupPageSetting().then(response => {
				if (response._metadata.status === 'SUCCESS') {
					navigation.navigate('Signup', {
						fields: response.records
					});
					setactivityLoader(false);
				} else {
					setactivityLoader(false);
					alert('Something went wrong. Please try again.');
				}
			});
		} else {
			alert('Please Check your Internet');
		}
		// signupPageInterests().then((response) => {
		// 	if (response._metadata.status === 'SUCCESS') {
		// 	}
		// });
	};

	const ItemContactUs = props => (
		<>
			<View style={styles.txtHeading}>
				<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Contact Us</Text>
			</View>
			<View style={{ marginHorizontal: 16 }}>
				<View
					style={{
						flexDirection: 'row',
						marginTop: RFValue(10),
						alignItems: 'center'
					}}>
					<Text
						style={[
							exStyles.infoDetailR16,
							{
								width: 70,
								color: colors.secondaryText,
								textAlign: 'right',
								marginRight: 6
							}
						]}>
						{'Phone' + ': '}
					</Text>
					<TouchableOpacity activeOpacity={1}>
						<Text
							style={[
								exStyles.TabAllCapsMed14,
								{
									color: colors.secondaryColor
								}
							]}>
							{props.data.phone_no}
						</Text>
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: 'row',
						marginTop: RFValue(10),
						alignItems: 'flex-start'
					}}>
					<Text
						style={[
							exStyles.infoDetailR16,
							{
								width: 70,
								color: colors.secondaryText,
								textAlign: 'right',
								marginRight: 6
							}
						]}>
						{'Address' + ': '}
					</Text>
					<TouchableOpacity activeOpacity={1}>
						<Text
							style={[
								exStyles.TabAllCapsMed14,
								{
									width: '75%',
									color: colors.secondaryColor
								}
							]}>
							{props.data.address}
						</Text>
					</TouchableOpacity>
				</View>

				<View
					style={{
						flexDirection: 'row',
						marginTop: RFValue(10),
						alignItems: 'center',
						marginBottom: RFValue(80)
					}}>
					<Text
						style={[
							exStyles.infoDetailR16,
							{
								width: 70,
								color: colors.secondaryText,
								textAlign: 'right',
								marginRight: 6
							}
						]}>
						{'Email' + ': '}
					</Text>
					<TouchableOpacity activeOpacity={1}>
						<Text
							style={[
								exStyles.TabAllCapsMed14,
								{
									color: colors.secondaryColor
								}
							]}>
							{props.data.contact_email}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);

	const FloatButtons = () => (
		<View style={styles.absoluteAuthBtns}>
			<FormButton
				opacity={1}
				title='Sign up'
				extraStyle={{ width: RFValue(100), marginEnd: RFValue(10) }}
				onPress={() => {
					// navigation.navigate('Signup', {
					// 	header: 'Sign up',
					// 	url: VISITORS
					// });
					signupSettings();
				}}
			/>
			<FormButton
				opacity={1}
				title='Log in'
				isDisabled={loading}
				extraStyle={{ width: RFValue(100), marginStart: RFValue(10) }}
				onPress={() => {
					if (comingSoonStatus == 'show') {
						navigation.navigate('ComingSoonView', {
							exhibition: event.eventData.exhibition,
							contact: event.eventData.contact
						});
					} else {
						navigation.navigate('LoginView');
					}
				}}
			/>
		</View>
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
				title='Event Information'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					flex: 1
				}}>
				{event.loading ? (
					<ActivityIndicator size='large' />
				) : event.error !== null ? (
					<FlatList
						ListHeaderComponent={
							<>
								<View>
									{event.eventData.images.length > 0 ? <ImageCarousel images={event.eventData.images} /> : null}
									{type == 'svg' ? (
										<TouchableOpacity activeOpacity={0.9} style={[styles.imgLogo, { backgroundColor: 'white' }]}>
											<SvgUri height={68} width={68} uri={event.eventData.exhibition.logo} />
										</TouchableOpacity>
									) : (
										<TouchableOpacity
											onPress={() =>
												navigation.navigate('OutSideWebviewScreen', {
													title: '',
													link: event.eventData.exhibition.logo_url
												})
											}
											activeOpacity={0.9}>
											<FastImage style={styles.imgLogo} resizeMode='contain' source={{ uri: event.eventData.exhibition.logo }} />
										</TouchableOpacity>
									)}
								</View>
								<Text style={[exStyles.ButtonSM20, styles.txtTitle]}>{event.eventData.exhibition.name}</Text>
								<Text style={[exStyles.infoLink14Med, styles.txtDate]}>
									{`${moment(event.eventData.exhibition.start_date).format('MMM DD')} - ${moment(
										event.eventData.exhibition.end_date
									).format('MMM DD, YYYY')}`}
								</Text>
								<View style={styles.txtHeading}>
									<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Summary</Text>
								</View>
								<View
									style={{
										marginHorizontal: 16,
										marginVertical: 16
									}}>
									<AboutText about='' text={event.eventData.content[event.eventData.content.length - 1].description} justify />
								</View>
								{event.eventData.videos.length > 0 ? <Sponsers videos={event.eventData.videos} isVideos /> : null}
								{event.eventData.speakers.length > 0 ? (
									<View style={styles.txtHeading}>
										<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Speakers</Text>
									</View>
								) : null}
							</>
						}
						ListFooterComponent={
							<>
								<ItemContactUs data={event.eventData.contact} />
							</>
						}
						style={styles.container}
						data={event.eventData.speakers}
						showsVerticalScrollIndicator={false}
						renderItem={({ item }) => (
							<Itemauditoriumstaff
								data={item}
								onPress={() => {
									alert('Please Sign in to view profile');
								}}
							/>
						)}
					/>
				) : null}
				<FloatButtons />
			</SafeAreaView>
			{activityLoader ? <LoadingDialog visible /> : null}
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	imgLogo: {
		backgroundColor: '#ffffff',
		height: RFValue(70),
		width: RFValue(70),
		borderRadius: RFValue(80),
		overflow: 'hidden',
		marginEnd: RFValue(10),
		padding: RFValue(8),
		bottom: RFValue(10),
		start: RFValue(10),
		position: 'absolute',
		borderWidth: 1,
		borderColor: colors.black20
	},
	txtTitle: {
		color: colors.primaryText,
		marginTop: 24,
		marginHorizontal: 16
	},
	txtDate: {
		color: colors.secondaryText,
		marginTop: 8,
		marginHorizontal: 16
	},
	txtHeading: {
		marginTop: 24,
		paddingStart: 32,
		backgroundColor: colors.unSelected,
		paddingVertical: 4
	},
	absoluteAuthBtns: {
		position: 'absolute',
		width: RFValue(200),
		alignSelf: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		borderRadius: RFValue(15),
		bottom: RFValue(20),
		fontWeight: 'bold'
	}
});

export default withDimensions(withTheme(memo(EventInfoView)));
