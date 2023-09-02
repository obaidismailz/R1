import * as React from 'react';
import { useState, useEffect } from 'react';
import {
	View,
	Text,
	Pressable,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	FlatList,
	Dimensions,
	TouchableOpacity,
	Linking,
	Platform
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from '@rocket.chat/react-native-fast-image';
import SIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import PropTypes from 'prop-types';
import moment from 'moment';
import { SvgUri } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import StatusBar from '../../containers/StatusBar';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import store from '../../lib/createStore';
import { setUser as setUserFun } from '../../actions/login';
import ActivityIndicator from '../../containers/ActivityIndicator';
import { AboutText, FormButton } from '../../components';
import EventAgendaModal from './components/EventAgendaModal';
import ModalSelectBooth from '../Halls/components/ModalSelectBooth';
import ViewAllSpeakersModel from './components/ViewAllSpeakersModel';
import ViewAllWebinarsModel from './components/ViewAllWebinarsModel';
import {
	getAllProducts,
	getAllSponsers,
	getAvailableSpeakers,
	getAvailableWebinars,
	getLobbyAbout,
	getLobbyImage,
	getSuggestedBooths
} from '../../apis/LoopExpoApi';
import { getNotifications } from '../../apis/Notifications';
import { themes } from '../../constants/colors';
import SectionHeader from './components/SectionHeader';
import Sponsers from './Sponsers';
import GamificationSection from './components/GamificationSection';
import ImageBanners from './ImageBanners';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const Exhibition = ({ navigation, route, ...props }) => {
	const theme = 'light';

	const [lobby, setLobby] = useState('');
	const [lobbyDescription, setLobbyDescription] = useState('');
	const [lobbybanner, setLobbyBanner] = useState([]);
	const [hasImages, setHasImages] = useState(false);
	const [suggestedBooths, setSuggestedBooths] = useState([]);
	const [loading, setLoading] = useState(true);
	const [productData, setProductData] = useState([]);
	const [speakers, setSpeakers] = useState([]);
	const [webinars, setWebinars] = useState([]);
	const [boothModelVisibility, setBoothModelVisibility] = useState(false);
	const [speakerModelVisibility, setSpeakerModelVisibility] = useState(false);
	const [webinarModelVisibility, setWebinarModelVisibility] = useState(false);
	const [agendaModal, setAgendaModal] = useState(false);
	const [notificationBadge, setNotificationBadge] = useState('');
	const [currentEventDetails, setCurrentEventDetails] = useState(
		ShareData.getInstance().event === undefined
			? {
					exhibition: {
						logo: '',
						name: '',
						start_date: '',
						end_date: '',
						welcome_video: ''
					}
			  }
			: ShareData.getInstance().event
	);

	propTypes = {
		setUser: PropTypes.func
	};

	useEffect(() => {
		setTimeout(() => {
			store.dispatch(
				setUserFun({
					image: ShareData.getInstance().image
				})
			);
		}, 500);
		getEvent();
		getLobby();
		getAbout();
		getSpeakers();
		getProducts();
		return () => {
			FastImage.clearMemoryCache();
		};
	}, []);

	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			getNotifications()
				.then(resp => {
					setNotificationBadge(resp.notification_count);
				})
				.catch(() => {});
		}
	}, [isFocused]);

	const getEvent = async () => {
		ShareData.getInstance()
			.getEventData()
			.then(ev => setCurrentEventDetails(ev));
	};

	const getAbout = () => {
		getLobbyAbout().then(response => {
			setLobbyDescription(response.records.description);
		});
	};

	const getLobby = () => {
		getLobbyImage().then(response => {
			setLobby(response.records.lobby_template.mobile_image);
			getAllSponsers().then(response => {
				// setLobbyBanner()
			});
			setLobbyBanner(response.records.lobby_banners);
			// setLobbyDescription(response.records.description);
			response.records.lobby_banners.every(element => {
				if (element.mobile_image !== '') {
					setHasImages(true);
					return false;
				}
			});
		});
	};

	const getBooths = () => {
		getSuggestedBooths().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				console.log(response.records);
				setSuggestedBooths(response.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const getSpeakers = () => {
		getAvailableSpeakers().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				console.log(response.records);
				setSpeakers(response.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const getWeinars = () => {
		getAvailableWebinars().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				console.log(response.records);
				setWebinars(response.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const getProducts = () => {
		getAllProducts().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				console.log(response.records);
				setProductData(response.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const SuggestedBooths = () => (
		<View style={{ paddingTop: 24 }}>
			<FlatList
				data={suggestedBooths}
				horizontal
				showsHorizontalScrollIndicator={false}
				ListEmptyComponent={loading ? <ActivityIndicator theme={theme} /> : null}
				renderItem={({ item, index }) => (
					<Pressable
						style={{ marginLeft: RFValue(16), alignItems: 'center' }}
						onPress={() => {
							navigation.navigate('BoothDetails', {
								booth: item
							});
						}}>
						<FastImage style={styles.roundImageStyle} source={{ uri: item.logo }} />
						<View style={styles.textSpacing}>
							<Text numberOfLines={2} style={[exStyles.descriptionSmallText, styles.text]}>
								{item.name}
							</Text>
						</View>
					</Pressable>
				)}
			/>
		</View>
	);

	const Speakers = () => (
		<View>
			<FlatList
				data={speakers}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ marginTop: RFValue(24) }}
				renderItem={({ item, index }) => (
					<Pressable
						style={{
							marginLeft: RFValue(16),
							alignItems: 'center'
						}}
						activeOpacity={0.8}
						onPress={() =>
							navigation.navigate('LoopUserProfile', {
								username: item.username
							})
						}>
						<FastImage style={styles.roundImageStyle} source={{ uri: item.image }} />
						<View style={styles.textSpacing}>
							<Text numberOfLines={2} style={[exStyles.descriptionSmallText, styles.text]}>
								{`${item.fname} ${item.lname}`}
							</Text>
						</View>
					</Pressable>
				)}
			/>
		</View>
	);

	const Products = () => (
		<View>
			<FlatList
				horizontal
				contentContainerStyle={{ marginTop: RFValue(24) }}
				showsHorizontalScrollIndicator={false}
				data={productData}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						activeOpacity={0.8}
						style={{
							marginTop: 10,
							marginLeft: RFValue(16)
						}}
						onPress={() => {
							navigation.navigate('BoothProductDetails', {
								data: item,
								onCallBack: (res, type) => {
									type == 0
										? (productData[index].bookmark = {
												id: res.id,
												type_id: res.type_id
										  })
										: (productData[index].bookmark = '');
									setProductData(productData);
								}
							});
						}}>
						<FastImage style={styles.itemSimilarProductImage} source={{ uri: item.image }}>
							{/* { item.highlights ? <Text style={styles.itemSimilarProductOff}>30 % OFF</Text> :null}   */}
						</FastImage>
						<Text style={[exStyles.descriptionSmallText, styles.itemSimilarProductPrice]}>{`$ ${item.price} `}</Text>
					</TouchableOpacity>
				)}
			/>
		</View>
	);

	ExhibitionDetail = () => {
		const type = '.png';
		// const type = currentEventDetails.exhibition.logo.substring(
		// 	currentEventDetails.exhibition.logo.lastIndexOf('.') + 1
		// );
		return (
			<View style={{ paddingTop: 20, justifyContent: 'center' }}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
						},
						{
							paddingLeft: RFValue(16),
							paddingVertical: 4,
							alignItems: 'center',
							flexDirection: 'row'
						}
					]}
					onPress={() => {
						navigation.navigate('AboutEvent', {});
					}}>
					{type == 'svg' ? (
						<View style={styles.roundImageStyle}>
							<SvgUri height={76} width={76} uri={currentEventDetails.exhibition.logo} />
						</View>
					) : (
						<FastImage style={styles.roundImageStyle} source={{ uri: currentEventDetails.exhibition.logo }} />
					)}
					<View>
						<Text numberOfLines={1} style={[exStyles.ButtonSM20, { color: colors.primaryText, marginLeft: 12, width: '67%' }]}>
							{currentEventDetails.exhibition.name}
						</Text>
						<Text style={[exStyles.infoLink14Med, styles.txtDate]}>
							{`${moment(currentEventDetails.exhibition.start_date).format('MMM DD')} - ${moment(
								currentEventDetails.exhibition.end_date
							).format('MMM DD, YYYY')}`}
						</Text>
					</View>
					<MaterialIcons
						name='keyboard-arrow-right'
						size={32}
						style={{ position: 'absolute', top: RFValue(16), right: 16 }}
						color={colors.secondaryText}
					/>
				</Pressable>
			</View>
		);
	};

	openLink = url => {
		Linking.canOpenURL(url).then(supported => {
			if (supported) {
				Linking.openURL(url);
			} else {
				console.log(`Don't know how to open URI: ${url}`);
			}
		});
	};

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle={'light-content'} />
			<Header
				title='Exhibition'
				theme={theme}
				onMenuPress={() => {
					navigation.toggleDrawer();
				}}
				badgeCount={notificationBadge}
				onChangeSearch={txt => {}}
				// onCartPress={() => {
				// 	navigation.navigate('MyCart');
				// }}
				onSearchPress={txt => {
					navigation.navigate('GenericSearch');
				}}
				onNotificationPress={() => {
					navigation.navigate('Notifications');
				}}
			/>
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<ScrollView contentContainerStyle={{ paddingHorizontal: RFValue(0) }}>
					<FastImage
						style={{
							height: screenHeight * 0.3,
							width: screenWidth,
							resizeMode: 'stretch'
						}}
						source={{ uri: lobby, priority: FastImage.priority.high }}>
						<ActivityIndicator style={styles.activityIndicator} animating={loading} color='#000000AA' />
						<TouchableOpacity
							activeOpacity={0.75}
							style={{ alignItems: 'center' }}
							onPress={() => {
								navigation.navigate('WebviewScreen', {
									title: '',
									link: `https://www.youtube.com/watch?v=${currentEventDetails.exhibition.welcome_video}`
								});
							}}>
							<FastImage
								style={{
									width: screenWidth * 0.5,
									height: screenHeight * 0.12,
									marginTop: 24,
									borderRadius: 6,
									borderWidth: 1,
									borderColor: 'white',
									alignItems: 'center',
									justifyContent: 'center'
								}}
								source={{
									uri: `https://img.youtube.com/vi/${currentEventDetails.exhibition.welcome_video}/hqdefault.jpg`
								}}>
								<Icon name='play-circle-outline' size={RFValue(40)} color='#ffffff' />
							</FastImage>
						</TouchableOpacity>
					</FastImage>
					<ExhibitionDetail />
					{/* <GamificationSection navigation={navigation} /> */}
					{/* <Sponsers lobbybanner={lobbybanner} /> */}
					<ImageBanners navigation={navigation} lobbybanner={lobbybanner} hasImages={hasImages} />
					{speakers.length > 0 ? (
						<>
							<SectionHeader title='Our Speakers' pressable onPress={() => setSpeakerModelVisibility(true)} />
							<Speakers />
						</>
					) : null}
					{/* {productData.length > 0 ? (
						<>
							<SectionHeader
								title='Product & Promotions'
								pressable
								onPress={() => {
									navigation.navigate('AllProducts', {
										productsList: productData,
										productCategories: []
									});
								}}
							/>
							<Products />
						</>
					) : null} */}
					<SectionHeader
						title='About Event'
						pressable
						onPress={() => {
							navigation.navigate('AboutEvent', {});
						}}
					/>
					<View style={{ paddingHorizontal: 16, marginTop: 20 }}>
						<AboutText about='' text={lobbyDescription == null || lobbyDescription == '' ? '' : lobbyDescription} />
					</View>
					<View style={{ paddingVertical: 40 }}>
						<FormButton
							title='View Event Agenda'
							extraStyle={styles.jumpToBoothButton}
							onPress={() => {
								setAgendaModal(true);
							}}
						/>
					</View>
				</ScrollView>
			</View>
			<EventAgendaModal theme={theme} visible={agendaModal} onClose={() => setAgendaModal(false)} />
			<ModalSelectBooth
				visible={boothModelVisibility}
				booths={suggestedBooths}
				onClose={() => {
					setBoothModelVisibility(false);
				}}
			/>
			<ViewAllSpeakersModel
				visible={speakerModelVisibility}
				speakers={speakers}
				onClose={() => {
					setSpeakerModelVisibility(false);
				}}
			/>
			<ViewAllWebinarsModel
				visible={webinarModelVisibility}
				webinars={webinars}
				onClose={() => {
					setWebinarModelVisibility(false);
				}}
			/>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	sortItemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 28,
		backgroundColor: colors.unSelected,
		paddingHorizontal: 16,
		paddingVertical: 4
	},
	onPressSortStyle: {
		borderRadius: 30 / 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	jumpToBoothButton: {
		width: screenWidth * 0.8,
		height: 54,
		alignSelf: 'center',
		marginVertical: 15,
		borderRadius: 16
	},
	itemSimilarProductImage: {
		height: RFValue(88),
		width: RFValue(88),
		resizeMode: 'stretch',
		borderWidth: 0.5,
		borderColor: 'rgba(0,0,0,0.4)',
		borderRadius: 14,
		alignSelf: 'center',
		overflow: 'hidden'
	},
	liveText: {
		color: '#fff',
		paddingHorizontal: 10,
		paddingBottom: 2,
		borderRadius: 5,
		backgroundColor: colors.secondaryColor,
		position: 'absolute',
		bottom: 5,
		left: 5
	},
	itemSimilarProductOff: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		textAlign: 'center',
		backgroundColor: '#eb5757',
		textAlignVertical: 'center',
		paddingVertical: 4,
		color: '#fff',
		fontWeight: 'bold',
		fontSize: RFValue(11)
	},

	roundImageStyle: {
		height: 84,
		width: 84,
		borderRadius: 84 / 2,
		resizeMode: 'contain',
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},

	itemSimilarProductPrice: {
		color: colors.secondaryText,
		fontWeight: '600',
		marginTop: RFValue(10)
	},
	itemSimilarProductOldPrice: {
		color: 'grey',
		fontSize: RFValue(14),
		textDecorationLine: 'line-through'
	},
	textSpacing: {
		marginTop: RFValue(8),
		paddingHorizontal: 2
	},
	text: {
		width: 82,
		textAlign: 'center',
		color: colors.primaryText
	},
	lastNameTxt: {
		fontSize: RFValue(14),
		lineHeight: 20,
		letterSpacing: 0.2,
		fontWeight: '400',
		textAlign: 'center',
		color: colors.primaryText
	},
	txtBlogTitle: {
		fontSize: RFValue(20),
		color: 'black',
		marginTop: RFValue(10),
		flex: 1
	},
	activityIndicator: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0,
		top: 0
	},
	txtDate: {
		color: colors.secondaryText,
		marginTop: RFValue(5),
		marginHorizontal: RFValue(10)
	},
	bannerImage: {
		height: 72,
		width: 112
	},
	shadowBox: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 8,
		elevation: 4,
		borderWidth: Platform.OS == 'ios' ? 1 : 0.5,
		borderColor: 'white',
		shadowColor: colors.secondaryText,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.5,
		shadowRadius: 4
	}
});

// home tab whole, auditorim

// export default memo(Lobby);
const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
	setUser: params => dispatch(setUserFun(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(withDimensions(withTheme(React.memo(Exhibition))));
// )(withDimensions(withTheme(Exhibition)));

// export default withDimensions(withTheme(memo(Exhibition)));
