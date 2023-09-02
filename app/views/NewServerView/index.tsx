import { Q } from '@nozbe/watermelondb';
import { Base64 } from 'js-base64';
import React from 'react';
import { BackHandler, Image, Keyboard, StyleSheet, Text, View, Linking, SafeAreaView as SafeAreaViewNative, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { connect } from 'react-redux';
import parse from 'url-parse';
import { RFValue } from 'react-native-responsive-fontsize';
import { FormButton, LoadingDialog, AboutText, ActivityIndicator } from '@components';
import { ShareData } from '@utils';

import { inviteLinksClear } from '../../actions/inviteLinks';
import { selectServerRequest, serverFinishAdd, serverRequest } from '../../actions/server';
import { themes } from '../../constants/colors';
import GradientButton from '../../components/GradientButton';
import Button from '../../containers/Button';
import FormContainer, { FormContainerInner } from '../../containers/FormContainer';
import * as HeaderButton from '../../containers/HeaderButton';
import { IBaseScreen, TServerHistoryModel } from '../../definitions';
import { withDimensions } from '../../dimensions';
import I18n from '../../i18n';
import database from '../../lib/database';
import { sanitizeLikeString } from '../../lib/database/utils';
import RocketChat from '../../lib/rocketchat';
import UserPreferences from '../../lib/userPreferences';
import { OutsideParamList } from '../../stacks/types';
import { withTheme } from '../../theme';
import { isTablet } from '../../utils/deviceInfo';
import EventEmitter from '../../utils/events';
import { BASIC_AUTH_KEY, setBasicAuth } from '../../utils/fetch';
import { showConfirmationAlert } from '../../utils/info';
import { events, logEvent } from '../../utils/log';
import { moderateScale, verticalScale } from '../../utils/scaling';
import SSLPinning from '../../utils/sslPinning';
import sharedStyles from '../Styles';
import { getSaasToken } from '../../apis/saas';
import GradientText from '../../components/GradientText';
import ImageCarousel from '../Exhibition/components/ImageCarousel';
import Itemauditoriumstaff from './components/ItemAuditoriumStaff';
import Sponsers from '../Exhibition/Sponsers';
import {
	loginPageSetting,
	signupPageInterests,
	signupPageSetting
} from '../../apis/LoopExpoApi';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import Speakers from './components/speakers';
import ItemContactUs from './components/ItemContactUs';
import { fetchEventInformation } from '../../actions/expo/eventInfo';
import { QA_INSTANCE } from '../../constants/constantData';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '@styles';
import moment from 'moment';


const styles = StyleSheet.create({
	onboardingImage: {
		alignSelf: 'center',
		resizeMode: 'contain'
	},
	certificatePicker: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	chooseCertificateTitle: {
		...sharedStyles.textRegular
	},
	chooseCertificate: {
		...sharedStyles.textSemibold
	},
	connectButton: {
		marginBottom: 0
	},
	imgLogo: {
		height: RFValue(70),
		width: RFValue(70),
		borderRadius: RFValue(80),
		overflow: 'hidden',
		marginEnd: RFValue(10),
		padding: RFValue(8),
		bottom: RFValue(10),
		start: RFValue(10),
		position: 'absolute',
		resizeMode: 'cover',
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

interface INewServerViewProps extends IBaseScreen<OutsideParamList, 'NewServerView'> {
	connecting: boolean;
	previousServer: string;
	width: number;
	height: number;
	eventInfo: Function;
}

interface INewServerViewState {
	text: string;
	connectingOpen: boolean;
	certificate: any;
	serversHistory: TServerHistoryModel[];
	loading: boolean;
	event: any;

	
}

interface ISubmitParams {
	fromServerHistory?: boolean;
	username?: string;
}

class NewServerView extends React.Component<INewServerViewProps, INewServerViewState> {
	constructor(props: INewServerViewProps) {
		super(props);
		if (!isTablet) {
			Orientation.lockToPortrait();
		}
		this.setHeader();

		this.state = {
			text: '',
			connectingOpen: false,
			certificate: null,
			serversHistory: [],
			loading: false,
			loginSetting: [],
			comingSoonStatus: '',
			activityLoader: false
		};
		ShareData.getInstance().setBaseUrl(
			QA_INSTANCE.domain,
			QA_INSTANCE.sub_domain
		);
		EventEmitter.addEventListener('NewServer', this.handleNewServerEvent);
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentDidMount() {
		this.props.eventInfo(QA_INSTANCE.instances);
		this.setting();
		this.queryServerHistory();
	}

	componentWillUnmount() {
		EventEmitter.removeListener('NewServer', this.handleNewServerEvent);
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
		const { previousServer, dispatch } = this.props;
		if (previousServer) {
			dispatch(serverFinishAdd());
		}
	}

	setHeader = () => {
		const { previousServer, navigation } = this.props;
		if (previousServer) {
			return navigation.setOptions({
				headerTitle: I18n.t('Workspaces'),
				headerLeft: () => <HeaderButton.CloseModal navigation={navigation} onPress={this.close} testID='new-server-view-close' />
			});
		}

		return navigation.setOptions({
			headerShown: false
		});
	};

	handleBackPress = () => {
		const { navigation, previousServer } = this.props;
		if (navigation.isFocused() && previousServer) {
			this.close();
			return true;
		}
		return false;
	};

	onChangeText = (text: string) => {
		this.setState({ text });
		this.queryServerHistory(text);
	};

	queryServerHistory = async (text?: string) => {
		const db = database.servers;
		try {
			const serversHistoryCollection = db.get('servers_history');
			let whereClause = [Q.where('username', Q.notEq(null)), Q.experimentalSortBy('updated_at', Q.desc), Q.experimentalTake(3)];
			if (text) {
				const likeString = sanitizeLikeString(text);
				whereClause = [...whereClause, Q.where('url', Q.like(`%${likeString}%`))];
			}
			const serversHistory = await serversHistoryCollection.query(...whereClause).fetch();
			this.setState({ serversHistory });
		} catch {
			// Do nothing
		}
	};

	close = () => {
		const { dispatch, previousServer } = this.props;
		dispatch(inviteLinksClear());
		dispatch(selectServerRequest(previousServer));
	};

	handleNewServerEvent = (event: { server: string }) => {
		let { server } = event;
		if (!server) {
			return;
		}
		const { dispatch } = this.props;
		this.setState({ text: server });
		server = this.completeUrl(server);
		dispatch(serverRequest(server));
	};

	onPressServerHistory = (serverHistory: TServerHistoryModel) => {
		this.setState({ text: serverHistory.url }, () => this.submit({ fromServerHistory: true, username: serverHistory?.username }));
	};

	submit = async ({ fromServerHistory = false, username }: ISubmitParams = {}) => {
		logEvent(events.NS_CONNECT_TO_WORKSPACE);
		const { text, certificate } = this.state;
		const { dispatch } = this.props;

		this.setState({ connectingOpen: false });

		if (text) {
			Keyboard.dismiss();
			const server = this.completeUrl(text);

			// Save info - SSL Pinning
			await UserPreferences.setStringAsync(`${RocketChat.CERTIFICATE_KEY}-${server}`, certificate);

			// Save info - HTTP Basic Authentication
			await this.basicAuth(server, text);

			if (fromServerHistory) {
				dispatch(serverRequest(server, username, true));
			} else {
				dispatch(serverRequest(server));
			}
		}
	};

	connectOpen = () => {
		logEvent(events.NS_JOIN_OPEN_WORKSPACE);
		this.setState({ connectingOpen: true });
		const { dispatch } = this.props;
		dispatch(serverRequest('https://open.rocket.chat'));
	};

	basicAuth = async (server: string, text: string) => {
		try {
			const parsedUrl = parse(text, true);
			if (parsedUrl.auth.length) {
				const credentials = Base64.encode(parsedUrl.auth);
				await UserPreferences.setStringAsync(`${BASIC_AUTH_KEY}-${server}`, credentials);
				setBasicAuth(credentials);
			}
		} catch {
			// do nothing
		}
	};

	chooseCertificate = async () => {
		try {
			const certificate = await SSLPinning?.pickCertificate();
			this.setState({ certificate });
		} catch {
			// Do nothing
		}
	};

	completeUrl = (url: string) => {
		const parsedUrl = parse(url, true);
		if (parsedUrl.auth.length) {
			url = parsedUrl.origin;
		}

		url = url && url.replace(/\s/g, '');

		if (/^(\w|[0-9-_]){3,}$/.test(url) && /^(htt(ps?)?)|(loca((l)?|(lh)?|(lho)?|(lhos)?|(lhost:?\d*)?)$)/.test(url) === false) {
			url = `${url}.rocket.chat`;
		}

		if (/^(https?:\/\/)?(((\w|[0-9-_])+(\.(\w|[0-9-_])+)+)|localhost)(:\d+)?$/.test(url)) {
			if (/^localhost(:\d+)?/.test(url)) {
				url = `http://${url}`;
			} else if (/^https?:\/\//.test(url) === false) {
				url = `https://${url}`;
			}
		}

		return url.replace(/\/+$/, '').replace(/\\/g, '/');
	};

	uriToPath = (uri: string) => uri.replace('file://', '');

	handleRemove = () => {
		showConfirmationAlert({
			message: I18n.t('You_will_unset_a_certificate_for_this_server'),
			confirmationText: I18n.t('Remove'),
			// @ts-ignore
			onPress: this.setState({ certificate: null }) // We not need delete file from DocumentPicker because it is a temp file
		});
	};

	deleteServerHistory = async (item: TServerHistoryModel) => {
		const db = database.servers;
		try {
			await db.write(async () => {
				await item.destroyPermanently();
			});
			this.setState((prevstate: INewServerViewState) => ({
				serversHistory: prevstate.serversHistory.filter(server => server.id !== item.id)
			}));
		} catch {
			// Nothing
		}
	};

	mailTo = () => {
		Linking.openURL('mailto:info@vexpo.pk');
	}

	saasToken = () => {		
		const { loading } = this.state;
		this.setState({loading: true})
		getSaasToken().then((response) => {
			this.props.navigation.navigate('EventListView', {
				token: response.success.data.access_token
			});
			this.setState({loading: false})
		}).catch( e => console.log(e))
	}

	renderFAQsText = () => {
		const { certificate } = this.state;
		const { theme, width, height, previousServer, navigation } = this.props;
		return (
			<View
				style={[
					styles.certificatePicker,
					{
						marginBottom: verticalScale({ size: previousServer && !isTablet ? 10 : 30, height })
					}
				]}>
				<Text
					style={[
						styles.chooseCertificateTitle,
						{ color: themes[theme].pTextColor, fontSize: moderateScale({ size: 16, width }) }
					]}>
					Need Any Help ? 
				</Text>
				<TouchableOpacity
					activeOpacity={0.6}
					style={{flexDirection: 'row'}}
					onPress={()=>{navigation.navigate('FAQ');}}
					testID='new-server-choose-certificate'>
					<Text
						style={[styles.chooseCertificate, { color: themes[theme].pTextColor, fontSize: moderateScale({ size: 16, width }) }]}>
						{" See"}
					</Text>
					<GradientText
						title={"FAQ's  "}
						fontSize={moderateScale({ size: 16, width })}
						styleText={[styles.chooseCertificate]}
						theme={theme}
					/>
					<Text style={[styles.chooseCertificate, { color: themes[theme].pTextColor, fontSize: moderateScale({ size: 16, width }) }]}>{'here'}</Text>
				</TouchableOpacity>
			</View>
		);
	};

	
	// loop components
	setting = () => {
		this.setState({ loading: true });
		loginPageSetting().then((response) => {
			if (response._metadata.status === 'SUCCESS') {
				this.setState({ loginSetting: response.records });
				// setLoginSetting(response.records);
				response.records.map((data) => {
					if (data.key == 'coming_soon') {
						this.setState({ comingSoonStatus: data.value });
					}
				});
				this.setState({ loading: false });
			} else {
				this.setState({ loading: false });
			}
		});
	};

	signupSettings = () => {
		if (ShareData.getInstance().internetConnected) {
			this.setState({ activityLoader: true });
			signupPageSetting().then((response) => {
				if (response._metadata.status === 'SUCCESS') {
					this.props.navigation.navigate('Signup', {
						fields: response.records
					});
					this.setState({ activityLoader: false });
				} else {
					this.setState({ activityLoader: false });
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

	FloatButtons = () => {
		const { navigation, event } = this.props;
		const { loading, comingSoonStatus } = this.state;
		return (
			<View style={styles.absoluteAuthBtns}>
				<FormButton
					opacity={1}
					title='Sign up'
					extraStyle={{ width: RFValue(100), marginEnd: RFValue(10) }}
					onPress={() => {
						this.signupSettings();
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
	};

	render() {
		const { connecting, theme, previousServer, height,  event, type } = this.props;
		const { text, connectingOpen, loading, activityLoader } = this.state;
		const marginTop = previousServer ? 0 : 35;

		return (
			
			<>
				<SafeAreaViewNative
					theme={theme}
					style={{
						backgroundColor: themes[theme].headerBackground
					}}
				/>

				<StatusBar
					theme={theme}
					backgroundColor={themes[theme].headerBackground}
					barStyle="light-content"
				/>
				{/* <Header
				title='Event Information'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
			/> */}
				<SafeAreaView
					theme={theme}
					style={{
						flex: 1
					}}
				>
					{event.loading ? (
						<ActivityIndicator size='large' />
					) : event.error !== null ? (
						<ScrollView
							showsVerticalScrollIndicator={false}
							style={styles.container}
						>
							<View>
								{event.eventData.images.length > 0 ? (
									<ImageCarousel images={event.eventData.images} />
								) : null}
								{type == 'svg' ? (
									<TouchableOpacity
										activeOpacity={0.9}
										style={[styles.imgLogo, { backgroundColor: 'white' }]}
									>
										<SvgUri
											height={68}
											width={68}
											uri={event.eventData.exhibition.logo}
										/>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={() => navigation.navigate('OutSideWebviewScreen', {
											title: '',
											link: event.eventData.exhibition.logo_url
										})
										}
										activeOpacity={0.9}
									>
										<FastImage
											style={styles.imgLogo}
											source={{ uri: event.eventData.exhibition.logo }}
										/>
									</TouchableOpacity>
								)}
							</View>
							<Text style={[exStyles.ButtonSM20, styles.txtTitle]}>
								{event.eventData.exhibition.name}
							</Text>
							<Text style={[exStyles.infoLink14Med, styles.txtDate]}>
								{`${ moment(event.eventData.exhibition.start_date).format(
									'MMM DD'
								) } - ${ moment(event.eventData.exhibition.end_date).format(
									'MMM DD, YYYY'
								) }`}
							</Text>
							{/* <View style={styles.txtHeading}>
								<Text
									style={[exStyles.infoLargeM16, { color: colors.darkText }]}
								>
									Summary
								</Text>
							</View> */}
							{/* <View
                style={{
                  marginHorizontal: 16,
                  marginVertical: 16,
                }}
              >
                <AboutText
                  about=""
                  text={
                    event.eventData.content[event.eventData.content.length - 1]
                      .description
                  }
                  justify
                />
              </View> */}
							{event.eventData.videos.length > 0 ? (
								<Sponsers videos={event.eventData.videos} isVideos />
							) : null}
							<Speakers data={event.eventData.speakers} />
							<ItemContactUs data={event.eventData.contact} />
						</ScrollView>
					) : null}
					{this.FloatButtons()}
				</SafeAreaView>
				{activityLoader ? <LoadingDialog visible /> : null}
			</>
			// <FormContainer theme={theme} testID='new-server-view' keyboardShouldPersistTaps='never'>
			// 	<FormContainerInner>
			// 		<Image
			// 			style={[
			// 				styles.onboardingImage,
			// 				{
			// 					marginBottom: verticalScale({ size: 10, height }),
			// 					marginTop: isTablet ? 0 : verticalScale({ size: marginTop, height }),
			// 					width: verticalScale({ size: 200, height }),
			// 					height: verticalScale({ size: 150, height })
			// 				}
			// 			]}
			// 			source={require('../../static/images/logo.png')}
			// 			fadeDuration={0}
			// 		/>
			// 		<FormButton
			// 				title='Events List'
			// 				extraStyle={{
			// 					marginTop: RFValue(46),
			// 					backgroundColor: '#F6A83B',
			// 					borderColor: '#F6A83B'
			// 				}}
			// 				onPress={() => {
			// 					this.setState({ loading: true });
			// 					ShareData.getInstance().internetConnected
			// 						? this.saasToken()
			// 						: alert('Please Connect Internet first');
			// 				}}
			// 			/>

			// 			<FormButton
			// 				title='Organize an Event'
			// 				isWhite
			// 				textStyle={{ color: '#F6A83B' }}
			// 				extraStyle={{ borderColor: '#F6A83B' }}
			// 				onPress={() => {
			// 					Linking.openURL('mailto:info@vexpo.pk');
			// 				}}
			// 			/>
			// 		{/* <GradientButton
			// 			title={"EVENT LIST"}
			// 			type='primary'
			// 			onPress={this.saasToken}
			// 			height= {52}
			// 			disabled={loading}
			// 			loading={loading}
			// 			style={[styles.connectButton, { marginTop: verticalScale({ size: 16, height }) }]}
			// 			theme={theme}
			// 			testID='new-server-view-button'
			// 		/>
			// 		<GradientButton
			// 			title={"ORGANIZE AN EVENT"}
			// 			type='secondary'
			// 			onPress={this.mailTo}
			// 			height= {51}
			// 			backgroundColor={themes[theme].chatComponentBackground}
			// 			disabled={false}
			// 			loading={!connectingOpen && connecting}
			// 			style={[styles.connectButton, { marginTop: verticalScale({ size: 16, height }) }]}
			// 			theme={theme}
			// 			testID='new-server-view-button'
			// 		/> */}
			// 	</FormContainerInner>
			// 	{this.renderFAQsText()}
			// 	{loading ? <LoadingDialog visible /> : null}
			// </FormContainer>
		);
	}
}

const mapStateToProps = (state: any) => ({
	connecting: state.server.connecting,
	previousServer: state.server.previousServer,
	event: state.eventInfo
});

const mapDispatchToProps = dispatch => ({
	eventInfo: () => dispatch(fetchEventInformation(QA_INSTANCE.instances))
});

export default connect(mapStateToProps, mapDispatchToProps)(withDimensions(withTheme(NewServerView)));
