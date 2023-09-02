import * as React from 'react';
import { memo, useState, useEffect, createRef } from 'react';
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
	Share,
	Linking
} from 'react-native';
import { Header, ActivityIndicator, FormButton, ProgressDialog } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { GET_WEBINAR_BY_ID } from '../../utils/Constants';
import { ShareData } from '@utils';
import FastImage from '@rocket.chat/react-native-fast-image';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';
import ActionSheet from 'react-native-actionsheet';
import HTML from 'react-native-render-html';
import moment from 'moment';
import { noInternetAlert } from '@utils/Network';
import { deleteBriefcase as deleteBriefcaseApi, addToBriefcase as addToBriefcaseApi } from '@apis/BriefcaseApis';
import { addWebinarToCalendar } from '@apis/CalendarApis';
import RNFetchBlob from 'rn-fetch-blob';
import { colors, exStyles } from '@styles';
import ItemAuditoriumResource from './components/ItemAuditoriumResource';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { AboutText } from '../../components';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const WebinarDetails = ({ navigation, route, ...props }) => {
	const { theme } = props;

	let downloading;
	// alert(route.params.webinar.briefcase)
	const [loading, setLoading] = useState(false);
	const [webinar, setWebinar] = useState(route.params.webinar);
	const [progressVisible, setProgressVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const actionSheetRef = createRef();
	useEffect(() => {
		getData();

		return () => {
			FastImage.clearMemoryCache();
		};
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getWebinarById();
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

	const addToCalendar = () => {
		setLoading(true);
		addWebinarToCalendar(webinar)
			.then(response => {
				if (response._metadata.status === 'SUCCESS') {
					setWebinar({ ...webinar, calendar: response.records });
					setLoading(false);
				} else {
					alert('Something went wrong! Please try again.');
					setLoading(false);
				}
			})
			.catch(e => {
				setLoading(false);
			});
	};

	const onShare = async () => {
		try {
			const result = await Share.share({
				message: webinar.status == 'recorded' ? webinar.recorded_url : webinar.join_url
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
				} else {
				}
			} else if (result.action === Share.dismissedAction) {
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const getWebinarById = () => {
		setLoading(true);
		axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + GET_WEBINAR_BY_ID}/${webinar.id}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setWebinar(response.data.records);
				}
				console.error(JSON.stringify(response.data));
			})
			.catch(e => {
				setLoading(false);
				console.error(JSON.stringify(e));
			});
	};

	const addToBriefcase = (data, type) => {
		setLoading(true);
		const params = {
			type,
			type_id: data.id
		};

		addToBriefcaseApi(params)
			.then(response => {
				setLoading(false);
				console.error(JSON.stringify(response.data));
				if (response.data._metadata.status === 'SUCCESS') {
					setWebinar({ ...webinar, briefcase: response.data.records });

					if (route.params.briefcaseCallback !== undefined) {
						route.params.briefcaseCallback(response.data.records);
					}
				}
			})
			.catch(e => {
				setLoading(false);
				console.error(JSON.stringify(e));
			});
	};

	const removeFromBriefcase = (data, type) => {
		setLoading(true);
		const params = {
			type,
			type_id: data.id
		};
		deleteBriefcaseApi(params)
			.then(response => {
				console.error(JSON.stringify(response.data));
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setWebinar({ ...webinar, briefcase: '' });
					if (route.params.briefcaseCallback !== undefined) {
						route.params.briefcaseCallback('');
					}
				}
			})
			.catch(e => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const downloadDocument = file => {
		setProgressVisible(true);
		const fileName = file.substring(file.lastIndexOf('/') + 1);
		downloading = RNFetchBlob.config({
			addAndroidDownloads: {
				useDownloadManager: true, // <-- this is the only thing required
				notification: true,
				// mime : 'text/plain',
				description: 'Downloading Handout'
			},
			fileCache: true
		}).fetch('GET', file, {});

		downloading
			.progress({ count: 1, interval: 1 }, () => {})
			.then(() => {
				alert(`file downloaded:\n${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`);
				setProgressVisible(false);
				setProgress(0);
			});
	};

	const stopDownloading = () => {
		setProgressVisible(false);
		setProgress(0); // %age
		downloading
			.then(() => {})
			.catch(err => {
				console.log(err);
			});
		// handle request cancelled rejection
		// cancel the request, the callback function is optional
		downloading.cancel(err => {});
		// if (downloading !== undefined && downloading.cancel !== undefined) {
	};

	const ItemAuditoriumStaff = props => (
		<TouchableOpacity activeOpacity={0.8} style={styles.containerStaffItem} onPress={props.onPress}>
			<FastImage
				style={styles.imgStaffItem}
				source={{
					uri: props.data.user.image,
					headers: RocketChatSettings.customHeaders,
					priority: FastImage.priority.low
				}}
			/>
			<View style={{ flex: 1, marginStart: RFValue(10) }}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginBottom: RFValue(5)
					}}>
					<View style={styles.containerStaffDetail}>
						<Text
							style={[
								exStyles.infoLink14Med,
								{
									color: 'white'
								}
							]}>
							Speaker
						</Text>
					</View>
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
						{`${props.data.user.fname} ${props.data.user.lname}`}
					</Text>
				</View>
				<Text style={[exStyles.customStatus, { color: colors.secondaryText }]}>
					{`${props.data.user.job_title}${props.data.user.company_name == '' ? '' : `\n@${props.data.user.company_name}`}`}
				</Text>
			</View>
		</TouchableOpacity>
	);

	const ItemShedule = props => (
		<View
			style={{
				flexDirection: 'row',
				paddingHorizontal: RFValue(16),
				marginVertical: RFValue(10)
			}}>
			<View style={styles.itemScheduleContainer}>
				<Text style={[exStyles.infoLink14Med, styles.txtItemSchedule]}>
					{props.data.start_time == '' ? 'N/A' : moment(props.data.start_time).format('hh:mm')}
				</Text>
			</View>
			<Text style={[exStyles.infoDetailR16, { color: colors.primaryText }]}>{props.data.title}</Text>
		</View>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />

			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<Header
					title={webinar.topic}
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
					onSharePress={() => {
						onShare();
					}}
					isBriefcased={webinar.briefcase !== ''}
					onBreifcasePress={
						webinar.status === 'recorded'
							? () => {
									if (webinar.briefcase === '') {
										addToBriefcase(webinar, 'webinar');
									} else {
										removeFromBriefcase(webinar, 'webinar');
									}
							  }
							: undefined
					}
				/>

				<ScrollView style={{ flex: 1 }}>
					<FastImage
						style={styles.imgBanner}
						source={
							webinar.image == ''
								? require('../../static/images/placeholder.jpg')
								: {
										uri: webinar.original_image,
										headers: RocketChatSettings.customHeaders,
										priority: FastImage.priority.high
								  }
						}>
						{webinar.status === 'live' ? (
							<FormButton
								opacity={1}
								title='JOIN NOW'
								extraStyle={styles.btnJoinNow}
								onPress={() => {
									console.error(webinar.status);
									console.error(webinar.join_url);
									if (Platform.OS === 'ios') {
										Linking.canOpenURL('zoomus://')
											.then(() => {
												Linking.openURL(webinar.join_url);
											})
											.catch(() => {
												Linking.openURL('https://apps.apple.com/us/app/zoom-cloud-meetings/id546505307');
											});
									} else {
										Linking.canOpenURL('zoomus://')
											.then(() => {
												Linking.openURL(webinar.join_url);
											})
											.catch(() => {
												Linking.openURL('http://play.google.com/store/apps/details?id=us.zoom.videomeetings');
											});
									}
								}}
							/>
						) : webinar.status === 'upcoming' ? (
							<FormButton
								opacity={0.7}
								isDisabled={webinar.calendar != ''}
								title='ADD TO CALENDAR'
								extraStyle={styles.btnJoinNow}
								onPress={() => {
									addToCalendar();
								}}
							/>
						) : (
							<TouchableOpacity
								style={{ position: 'absolute' }}
								onPress={() => {
									console.error(webinar.status);
									console.error(webinar.start_url);
									console.error(webinar.recorded_url);

									if (webinar.status === 'upcoming') {
										Linking.canOpenURL(webinar.start_url).then(supported => {
											if (supported) {
												Linking.openURL(webinar.start_url);
											} else {
												console.error(`Don't know how to open URI: ${webinar.start_url}`);
											}
										});
									} else if (webinar.status === 'recorded') {
										// navigation.navigate("VideoPlayer", {
										//   videoUrl: webinar.recorded_url,
										//   header: webinar.topic,
										// });
										navigation.navigate('LiveWebinar', {
											link: webinar.recorded_url,
											header: webinar.topic
										});
									} else {
										Linking.canOpenURL(webinar.start_url).then(supported => {
											if (supported) {
												Linking.openURL(webinar.start_url);
											} else {
												console.error(`Don't know how to open URI: ${webinar.start_url}`);
											}
										});
									}
								}}>
								<Image style={styles.floatingPlay} source={require('@assets/Play.png')} />
							</TouchableOpacity>
						)}
						{webinar.status === 'live' && (
							<View style={styles.containerLiveTag}>
								<Text
									style={{
										fontSize: RFValue(12),
										color: 'white'
									}}>
									LIVE
								</Text>
							</View>
						)}
					</FastImage>

					<Text style={[exStyles.infoLargeM18, styles.txtTitle]}>{webinar.topic}</Text>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: webinar.status === 'live' ? colors.primaryColor : colors.secondaryText,
								marginStart: 16
							}
						]}>
						{webinar.status === 'live'
							? 'Happening Now'
							: webinar.status === 'upcoming'
							? `Stream ${moment(webinar.start_time).fromNow()}`
							: `Streamed ${moment(webinar.created_at).fromNow()}`}
					</Text>

					<View style={styles.containerDescription}>
						<AboutText
							about=' Webinar'
							text={webinar.description == null || webinar.description == '' ? '' : webinar.description}
							justify
						/>
					</View>
					<FlatList
						data={webinar.speakers}
						renderItem={({ item }) => (
							<ItemAuditoriumStaff
								data={item}
								onPress={() => {
									navigation.navigate('LoopUserProfile', {
										username: item.user.username
									});
								}}
							/>
						)}
					/>
					{webinar.handout_image !== '' && webinar.handout_image !== undefined && webinar.handout_image !== null ? (
						<>
							<View style={styles.txtTicker}>
								<Text style={[exStyles.infoLargeM16, { color: colors.secondaryText }]}>Handouts</Text>
							</View>
							<ItemAuditoriumResource
								file_extension='pdf'
								detail='Document'
								image={webinar.handout_image}
								handout_title={webinar.handout_title}
								isBriefcased={webinar.briefcase !== '' && webinar.briefcase !== undefined}
								onBreifcase={() => {
									if (webinar.briefcase === '' || webinar.briefcase === undefined) {
										addToBriefcase(webinar, 'handout');
									} else {
										removeFromBriefcase(webinar, 'handout');
									}
								}}
								onPress={() => {
									if (Platform.OS === 'ios') {
										navigation.navigate('WebviewScreen', {
											link: webinar.handout_image
										});
									} else {
										downloadDocument(webinar.handout_image);
									}
								}}
							/>
						</>
					) : null}

					{webinar.agendas && webinar.agendas.length > 0 ? (
						<View style={styles.txtTicker}>
							<Text style={[exStyles.infoLargeM16, { color: colors.secondaryText }]}>Agenda</Text>
						</View>
					) : null}

					<FlatList
						contentContainerStyle={{ marginVertical: 20 }}
						data={webinar.agendas}
						renderItem={({ item }) => <ItemShedule time='03:00 PM' value={webinar.agenda} data={item} />}
					/>
				</ScrollView>
			</View>

			<ActionSheet
				ref={actionSheetRef}
				title=''
				options={['Contact Organizer', 'Report', 'Cancel']}
				cancelButtonIndex={2}
				destructiveButtonIndex={2}
				onPress={index => {
					if (index === 1) {
						navigation.navigate('Report');
					}
				}}
			/>
			{loading ? <ActivityIndicator absolute size='large' theme={theme} /> : null}

			{/* {progressVisible ? (
        <ProgressDialog
          progress={progress}
          visible
          onCancel={stopDownloading}
        />
      ) : null} */}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey',
		marginHorizontal: RFValue(10)
	},
	floatingPlay: {
		height: RFValue(60),
		width: RFValue(60),
		resizeMode: 'contain',
		tintColor: 'white'
	},
	containerStaffItem: {
		flexDirection: 'row',
		marginHorizontal: 24,
		paddingVertical: RFValue(10),
		borderColor: '#cecece',
		alignItems: 'center'
	},
	imgStaffItem: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(60)
	},
	containerStaffDetail: {
		paddingHorizontal: 12,
		paddingVertical: 2,
		borderRadius: 10,
		marginEnd: RFValue(8),
		backgroundColor: colors.secondaryColor,
		justifyContent: 'center'
	},
	txtStaffName: {
		fontSize: RFValue(12),
		color: '#424242',
		fontWeight: 'bold'
	},
	imgBanner: {
		height: screenWidth * 0.5,
		width: screenWidth,
		resizeMode: 'stretch',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btnJoinNow: {
		position: 'absolute',
		minWidth: RFValue(145),
		borderRadius: RFValue(15),
		bottom: RFValue(20),
		paddingHorizontal: RFValue(20)
	},
	containerLiveTag: {
		position: 'absolute',
		top: RFValue(10),
		left: RFValue(10),
		paddingHorizontal: RFValue(10),
		borderRadius: RFValue(10),
		marginEnd: RFValue(10),
		backgroundColor: '#2775EE',
		color: 'white',
		height: RFValue(24),
		justifyContent: 'center'
	},
	txtTitle: {
		color: colors.primaryText,
		marginTop: 16,
		marginHorizontal: 16
	},
	containerDescription: {
		marginHorizontal: 16,
		marginVertical: RFValue(10),
		flex: 0
	},
	txtTicker: {
		paddingStart: 24,
		paddingVertical: 8,
		marginTop: 32,
		backgroundColor: colors.unSelected
	},
	txtTckerAgenda: {
		paddingStart: RFValue(10),
		fontSize: RFValue(16),
		color: 'grey',
		backgroundColor: '#F2F2F2',
		paddingVertical: RFValue(5),
		marginVertical: RFValue(20),
		marginBottom: RFValue(10)
	},
	itemScheduleContainer: {
		paddingHorizontal: RFValue(10),
		borderRadius: RFValue(10),
		marginEnd: RFValue(10),
		backgroundColor: colors.secondaryColor,
		color: 'white',
		height: RFValue(24),
		justifyContent: 'center'
	},
	txtItemSchedule: {
		color: 'white',
		textAlignVertical: 'center'
	}
});

export default withDimensions(withTheme(memo(WebinarDetails)));
