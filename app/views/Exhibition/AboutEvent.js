import React, { createRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FastImage from '@rocket.chat/react-native-fast-image';
import {
	View,
	Text,
	Share,
	SafeAreaView as SafeAreaViewNative,
	StyleSheet,
	StatusBar,
	ScrollView,
	TouchableOpacity,
	FlatList,
	ActivityIndicator,
	Dimensions
} from 'react-native';
import { colors, exStyles } from '@styles';
import { LoadingDialog, Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { ShareData } from '@utils';
import { SvgUri } from 'react-native-svg';
import { selectServerRequest, serverRequest } from '../../actions/server';
import { inviteLinksClear as inviteLinksClearAction } from '../../actions/inviteLinks';
import sharedStyles from '../Styles';
import { themes } from '../../constants/colors';
import { withTheme } from '../../theme';
import { CloseModalButton } from '../../containers/HeaderButton';
import { AboutText } from '../../components';
import ImageCarousel from './components/ImageCarousel';
import Sponsers from './Sponsers';
import SafeAreaView from '../../containers/SafeAreaView';

const qs = require('qs');

const styles = StyleSheet.create({
	title: {
		...sharedStyles.textBold,
		fontSize: 22
	},
	certificatePicker: {
		marginBottom: 32,
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	chooseCertificateTitle: {
		fontSize: 13,
		...sharedStyles.textRegular
	},
	chooseCertificate: {
		fontSize: 13,
		...sharedStyles.textSemibold
	},
	description: {
		...sharedStyles.textRegular,
		fontSize: 14,
		textAlign: 'left',
		marginBottom: 24
	},
	connectButton: {
		marginBottom: 0,
		borderRadius: 24
	},
	images: {
		height: RFValue(60),
		width: RFValue(294),
		alignSelf: 'center',
		resizeMode: 'stretch'
	},
	txtDate: {
		color: 'gray',
		marginTop: RFValue(5),
		marginHorizontal: RFValue(10)
	},
	absolutePlay: {
		height: RFValue(60),
		width: RFValue(60),
		resizeMode: 'contain',
		tintColor: 'white'
	},
	imglogo: {
		width: 80,
		height: 80,
		borderRadius: 40,
		borderWidth: 1,
		position: 'absolute',
		bottom: 16,
		left: 16,
		borderColor: 'rgba(0,0,0,0.5)',
		backgroundColor: 'white'
	},
	txtTitle: {
		fontSize: RFValue(16),
		fontWeight: 'bold',
		color: '#424242',
		marginTop: RFValue(10),
		marginHorizontal: RFValue(10)
	},
	txtHeading: {
		marginTop: RFValue(10),
		paddingStart: RFValue(10),
		fontSize: RFValue(16),
		color: 'grey',
		backgroundColor: '#F2F2F2',
		paddingVertical: RFValue(5)
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
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

class AboutEvent extends React.Component {
	static navigationOptions = () => ({
		// title: I18n.t('Workspaces')
		title: 'Sub Domain',
		headerShown: false
	});

	static propTypes = {
		navigation: PropTypes.object,
		theme: PropTypes.string,
		connecting: PropTypes.bool.isRequired,
		connectServer: PropTypes.func.isRequired,
		selectServer: PropTypes.func.isRequired,
		adding: PropTypes.bool,
		previousServer: PropTypes.string,
		currentServer: PropTypes.object,
		inviteLinksClear: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.setHeader();

		this.state = {
			event: [],
			text: '',
			connectingOpen: false,
			loading: false,
			certificate: null,
			serversHistory: [],
			viewIndex: 0,
			currentEventIndex: 0,
			eventCategories: [
				{ value: 'All Events', selected: true, key: 'All Events' },
				{ value: 'Upcoming', selected: false, key: 'Upcoming' },
				{ value: 'Ongoing', selected: false, key: 'Ongoing' }
			],
			images: []
		};
		mainImage = {
			id: 1,
			booth_id: 0,
			title: 'Image 01',
			description: '',
			file: ShareData.getInstance().event.exhibition.main_image,
			file_extension: 'jpg',
			mime_type: 'image/jpeg',
			slug: 'image_01',
			status: 1,
			admin_user_id: 1,
			deleted_at: null,
			created_at: '',
			updated_at: ''
		};
	}

	componentDidMount() {
		// this.getData();
		this.setState({
			images: [mainImage, ...ShareData.getInstance().event.images]
		});
	}

	setHeader = () => {
		const { adding, navigation } = this.props;
		if (adding) {
			navigation.setOptions({
				headerLeft: () => (
					<CloseModalButton navigation={navigation} onPress={() => navigation.goBack()} testID='new-server-view-close' />
				)
			});
		}
	};

	onShare = async () => {
		try {
			const result = await Share.share({
				message: `${ShareData.getInstance().baseUrl}/visitor`
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

	renderEventInfo = connectingLoading => {
		const theme = 'light';
		const actionSheetRef = createRef();
		const loading = false;
		const speakers = [];

		const currentEventDetails = ShareData.getInstance().event;
		const type = currentEventDetails.exhibition.logo.substring(currentEventDetails.exhibition.logo.lastIndexOf('.') + 1);
		const ItemAuditoriumStaff = props => (
			<TouchableOpacity
				activeOpacity={0.8}
				onPress={props.onPress && props.onPress}
				style={{
					flexDirection: 'row',
					marginHorizontal: RFValue(24),
					paddingVertical: RFValue(10),
					borderColor: '#cecece',
					alignItems: 'center'
				}}>
				<FastImage
					style={{
						height: RFValue(60),
						width: RFValue(60),
						borderWidth: 1,
						borderColor: colors.black20,
						borderRadius: RFValue(60)
					}}
					source={{
						uri: props.data.image,
						priority: FastImage.priority.low
					}}
				/>
				<View style={{ flex: 1, marginStart: RFValue(10) }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center'
						}}>
						<View
							style={{
								paddingHorizontal: RFValue(10),
								borderRadius: RFValue(10),
								marginEnd: RFValue(5),
								backgroundColor: colors.secondaryColor,
								color: 'white',
								height: RFValue(24),
								justifyContent: 'center'
							}}>
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
						<Text
							numberOfLines={2}
							lineBreakMode='tail'
							style={[
								exStyles.infoLargeM16,
								{
									flex: 1,
									color: colors.primaryText
								}
							]}>
							{`${props.data.fname} ${props.data.lname}`}
						</Text>
					</View>
					<Text
						style={[
							exStyles.customStatus,
							{
								color: colors.secondaryText,
								marginTop: RFValue(2)
							}
						]}>
						{props.data.job_title === null
							? ''
							: props.data.job_title + props.data.company_name === null
							? ''
							: +'\n' + props.data.company_name}
					</Text>
				</View>
			</TouchableOpacity>
		);

		const ItemContactUs = props => (
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
									textAlign: 'justify',
									width: '35%',
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
		);
		return (
			<>
				<SafeAreaViewNative theme={theme} style={{ backgroundColor: themes[theme].headerBackground }} />

				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle='light-content' />
				<Header
					title='Event Information'
					theme={theme}
					onBackPress={() => {
						this.props.navigation.goBack();
					}}
					onSharePress={() => {
						this.onShare();
					}}
				/>
				<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
					<View style={{ flex: 1, backgroundColor: colors.white }}>
						<ScrollView style={{ flex: 1 }} contentContainerStyle={{}}>
							<View>
								<ImageCarousel images={this.state.images} />
								{type == 'svg' ? (
									<TouchableOpacity style={[styles.imglogo, { backgroundColor: 'white' }]}>
										<SvgUri
											height={72}
											width={72}
											style={{ backgroundColor: 'white' }}
											uri={currentEventDetails.exhibition.logo}
										/>
									</TouchableOpacity>
								) : (
									<TouchableOpacity
										onPress={() =>
											this.props.navigation.navigate('WebviewScreen', {
												title: '',
												link: currentEventDetails.exhibition.logo_url
											})
										}
										activeOpacity={0.9}>
										<FastImage style={styles.imglogo} source={{ uri: currentEventDetails.exhibition.logo }} />
									</TouchableOpacity>
								)}
							</View>
							<Text style={[exStyles.ButtonSM20, styles.txtTitle]}>{currentEventDetails.exhibition.name}</Text>

							<Text style={[exStyles.infoLink14Med, styles.txtDate]}>
								{`${moment(currentEventDetails.exhibition.start_date).format('MMM DD')} - ${moment(
									currentEventDetails.exhibition.end_date
								).format('MMM DD, YYYY')}`}
							</Text>

							{/* <View
								style={{
									flexDirection: 'row',
									paddingHorizontal: 16,
									marginTop: 14
								}}
							>
								<View
									style={{
										paddingHorizontal: 12,
										borderRadius: 10,
										marginEnd: 8,
										backgroundColor: colors.secondaryColor,
										paddingVertical: 2,
										justifyContent: 'center'
									}}
								>
									<Text
										style={[
											exStyles.infoLink14Med,
											{
												color: 'white'
											}
										]}
									>
										Job Fair
									</Text>
								</View>
								<View
									style={{
										paddingHorizontal: 12,
										borderRadius: 10,
										marginEnd: 8,
										backgroundColor: colors.secondaryColor,
										paddingVertical: 2,
										justifyContent: 'center'
									}}
								>
									<Text
										style={[
											exStyles.infoLink14Med,
											{
												color: 'white'
											}
										]}
									>
										Virtual Event
									</Text>
								</View>
							</View> */}
							<View style={styles.txtHeading}>
								<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Summary</Text>
							</View>

							<View
								style={{
									marginHorizontal: 16,
									marginTop: 16
								}}>
								<AboutText about='' text={currentEventDetails.content[7].description} justify />
							</View>

							<View
								style={{
									marginHorizontal: 16,
									marginTop: 16
								}}>
								<Sponsers videos={currentEventDetails.videos} isVideos isLogin />
							</View>

							<View style={styles.txtHeading}>
								<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Speakers</Text>
							</View>

							<FlatList
								data={currentEventDetails.speakers}
								renderItem={({ item }) => (
									<ItemAuditoriumStaff
										data={item}
										onPress={() => {
											this.props.navigation.navigate('LoopUserProfile', {
												username: item.username
											});
										}}
									/>
								)}
							/>

							<View style={styles.txtHeading}>
								<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Contact Us</Text>
							</View>

							<ItemContactUs data={currentEventDetails.contact} />
						</ScrollView>
					</View>
					{loading ? <ActivityIndicator absolute size='large' theme={theme} /> : null}
				</SafeAreaView>
			</>
		);
	};

	render() {
		const { connecting, theme } = this.props;
		const { text, connectingOpen, serversHistory, loading } = this.state;
		return (
			<>
				{this.renderEventInfo()}
				{this.state.loading ? <LoadingDialog visible /> : null}
			</>
		);
	}
}

const mapStateToProps = state => ({
	connecting: state.server.connecting,
	adding: state.server.adding,
	currentServer: state
});

const mapDispatchToProps = dispatch => ({
	connectServer: (server, certificate, username, fromServerHistory) =>
		dispatch(serverRequest(server, certificate, username, fromServerHistory)),
	selectServer: server => dispatch(selectServerRequest(server)),
	inviteLinksClear: () => dispatch(inviteLinksClearAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(AboutEvent));
