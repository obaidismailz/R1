import * as React from 'react';
import { memo, useState, useEffect, createRef } from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	Pressable,
	Share,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Linking,
	ImageBackground
} from 'react-native';

import { ShareData } from '@utils';
import { FormButton, LoadingDialog, FastImageComponent } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ActionSheet } from 'react-native-cross-actionsheet';
import { saveBookmark as saveBookmarkApi, deleteBookmark as deleteBookmarkApi } from '@apis/BookmarkApis';
import { getMyProfile as getMyProfileApi } from '@apis/UserApis';
import ModalExchangeContact from './components/ModalExchangeContact';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import AboutText from '../../components/AboutText';
import { getLoopUserProfile, getSpekaerWebinars, getUserSocialPosts } from '../../apis/LoopExpoApi';
import Post from '../WorkSpee/views/NewsFeed/Post';
import PostPlaceholder from '../WorkSpee/views/NewsFeed/PostPlaceholder';
import { ActivityIndicator } from '../../components';
import PostOptionModal from '../WorkSpee/views/NewsFeed/PostOptionModal';
import { ItemWebinarList } from '../Auditorium/components';
import { goRoom } from '../../utils/goRoom';
import AlertModal from '../../components/AlertModal';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const LoopUserProfile = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;
	const username = route.params === undefined ? undefined : route.params.username;
	const [loading, setLoading] = useState(true);
	const [contactPopupVisible, setContactPopupVisible] = useState(false);
	const [user, setUser] = useState({
		user_interest: [],
		profile: {
			address: '',
			about_me: '',
			resume: ''
		}
	});
	const [profile, setProfile] = useState(profileSchema);
	const [postData, setPostData] = useState([]);
	const [webinars, setWebinars] = useState([]);
	const [afterPostId, setAfterPostId] = useState('');
	const [postOptionVisibility, setPostOptionVisibility] = useState(false);
	const [post, setPost] = useState('');
	const [postEnded, setPostEnded] = useState(false);
	const [alertVisibility, setAlertVisibility] = useState(false);

	useEffect(() => {
		getUserProfile();
		getUserPosts();
		getMyProfile();
	}, []);

	function getUserProfile() {
		getLoopUserProfile(username).then(response => {
			if (response._metadata.status === 'SUCCESS') {
				setUser(response.records);
				if (response.records.user_roles.name === 'Speaker') {
					getWebinar(response.records.id);
				}
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	}

	function getMyProfile() {
		setLoading(true);
		getMyProfileApi().then(response => {
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

	function getUserPosts() {
		getUserSocialPosts(5, afterPostId, username, '').then(response => {
			if (response._metadata.outcome === 'SUCCESS') {
				if (response.records.length == 0) {
					setPostEnded(true);
				} else {
					const dataLength = parseInt(response.records.length) - 1;
					const lastPostid = response.records[dataLength].id;
					setPostData([...postData, ...response.records]);
					setAfterPostId(lastPostid);
				}
			} else {
			}
		});
	}

	function getWebinar(userId) {
		getSpekaerWebinars(userId).then(response => {
			if (response._metadata.status === 'SUCCESS') {
				setWebinars(response.records);
			}
		});
	}

	const deleteBookMark = () => {
		const params = {
			type: 'user',
			type_id: user.id
		};
		deleteBookmarkApi(params).then(response => {
			if (response.data._metadata.status === 'SUCCESS') {
				setUser({ ...user, bookmark: '' });
			}
		});
		setLoading(false);
		setAlertVisibility(false);
	};

	function saveBookmark() {
		saveBookmarkApi({
			type: 'user',
			type_id: user.id
		}).then(response => {
			setUser({ ...user, bookmark: response.data.records });
		});
		setLoading(false);
	}

	const onShare = async () => {
		try {
			const result = await Share.share({
				message: user.share_url
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

	const Header = () => (
		<View style={styles.headerContaier}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: 32 / 2 }
				]}
				onPress={() => navigation.goBack()}>
				<IonIcons name='ios-chevron-back-sharp' size={32} color={colors.secondaryText} />
			</Pressable>

			<View style={styles.headerRightIconsContainer}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						{ borderRadius: RFValue(10), marginRight: RFValue(20) }
					]}
					onPress={() => {
						if (user.bookmark === undefined || user.bookmark === null || user.bookmark === '') {
							saveBookmark();
						} else {
							setAlertVisibility(true);
						}
					}}>
					<FIcon
						name={user.bookmark === undefined || user.bookmark === null || user.bookmark === '' ? 'bookmark-o' : 'bookmark'}
						size={24}
						color={
							user.bookmark === undefined || user.bookmark === null || user.bookmark === ''
								? colors.secondaryText
								: colors.primaryColor
						}
					/>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						{ borderRadius: RFValue(2) }
					]}
					onPress={() => {
						onPressOptions();
					}}>
					<FeatherIcon name='more-vertical' size={24} color={colors.secondaryText} />
				</Pressable>
			</View>
		</View>
	);

	const onPressOptions = () => {
		ActionSheet.options({
			options: [
				{
					text: 'share',
					onPress: () => {
						onShare();
					}
				}
			],
			cancel: { onPress: () => console.log('cancel') }
		});
	};

	const goToChatRoom = item => {
		if (isMasterDetail) {
			navigation.pop();
		}
		goRoom({ item, isMasterDetail });
	};

	const SocialIcons = () => (
		<View style={[styles.containerRowCenter, { justifyContent: 'center' }]}>
			{user.facebook_link == null || user.facebook_link == '' ? null : (
				<TouchableOpacity
					style={{ padding: RFValue(10) }}
					onPress={() => {
						Linking.openURL(user.facebook_link);
					}}>
					<Image style={styles.iconSocialBtn} source={require('@assets/fb.png')} />
				</TouchableOpacity>
			)}
			{user.linkedin_link == null || user.linkedin_link == '' ? null : (
				<TouchableOpacity
					style={{ padding: RFValue(10) }}
					onPress={() => {
						Linking.openURL(user.linkedin_link);
					}}>
					<Image style={styles.iconSocialBtn} source={require('@assets/linkedin.png')} />
				</TouchableOpacity>
			)}
			{user.twitter_link == null || user.twitter_link == '' ? null : (
				<TouchableOpacity
					style={{ padding: RFValue(10) }}
					onPress={() => {
						Linking.openURL(user.twitter_link);
					}}>
					<Image style={styles.iconSocialBtn} source={require('@assets/twitter.png')} />
				</TouchableOpacity>
			)}
		</View>
	);

	const UserInterest = () => (
		<View style={styles.userInterestContainer}>
			<FlatList
				numColumns={5}
				style={{
					marginHorizontal: RFValue(16),
					alignItems: 'center',
					justifyContent: 'center'
				}}
				data={user.user_interest}
				renderItem={({ item }) => (
					<View style={styles.itemUserInterest}>
						<Text style={[exStyles.infoSmallM11, { color: colors.secondaryText }]}>{item.categories.name}</Text>
					</View>
				)}
			/>
		</View>
	);

	const UserContact = () => (
		<View style={styles.containerContact}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					{ borderRadius: 15 }
				]}
				onPress={() => {
					const item = {
						_id: user.rc_user_id,
						status: 'offline',
						name: user.fname,
						username: user.username,
						outside: 'true',
						rid: user.username,
						t: 'd',
						search: true
					};
					goToChatRoom(item);
				}}>
				<IonIcons name='ios-chatbubbles-outline' size={28} color='white' />
			</Pressable>
			{user.profile.is_private == 1 ? null : (
				<>
					<View style={styles.contactSeparator} />
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
							},
							{ borderRadius: 5 }
						]}
						onPress={() => {
							Linking.openURL(`mailto:${user.email}`);
						}}>
						<MaterialCommunityIcons name='email-outline' size={28} color='white' />
					</Pressable>
					<View style={styles.contactSeparator} />
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
							},
							{ borderRadius: 5 }
						]}
						onPress={() => {
							Linking.openURL(`tel:${user.phone_number}`);
						}}>
						<MaterialCommunityIcons name='phone' size={28} color='white' />
					</Pressable>
				</>
			)}
		</View>
	);

	const AboutMe = () =>
		loading ? null : (
			<View style={{ paddingHorizontal: RFValue(20), marginTop: 24 }}>
				{user.profile.about_me == '' ? null : <AboutText about=' ' text={user.profile.about_me} justify={false} />}
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
					marginVertical: 16
				}}
				onPress={() => {
					Linking.openURL(user.profile.resume);
				}}>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryColor }]}>
					{`${user.fname + user.lname}_CV.${user.profile.resume.substring(user.profile.resume.lastIndexOf('.') + 1)}`}
				</Text>
			</TouchableOpacity>
		);

	const Buttons = () => (
		<>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					marginTop: 16
				}}>
				<FormButton
					title={'EXCHANGE\n CONTACT'}
					extraStyle={{
						paddingHorizontal: RFValue(20),
						marginEnd: RFValue(10)
					}}
					isDisabled={
						user.user_with_exchanged !== '' && user.user_with_exchanged !== null && user.user_with_exchanged !== undefined
					}
					onPress={() => {
						setContactPopupVisible(true);
					}}
				/>
				<FormButton
					title={'BOOK A\n MEETING'}
					extraStyle={{
						paddingHorizontal: RFValue(20),
						marginStart: RFValue(10)
					}}
					onPress={() => {
						navigation.navigate('CreateMeeting', { user });
					}}
				/>
			</View>
			{user.user_with_exchanged !== '' && user.user_with_exchanged !== null && user.user_with_exchanged !== undefined ? (
				<View style={{ alignItems: 'center', marginTop: 16 }}>
					<Text style={exStyles.infoLink14Med}>
						{user.user_with_exchanged.status === 'pending'
							? 'Contact exchange request sent'
							: 'Contact exchanged with this person'}
					</Text>
				</View>
			) : null}
		</>
	);

	const renderPostSeparator = () => (
		<View
			style={{
				height: RFValue(24)
			}}
		/>
	);

	const showPostOptionModal = (index, item) => {
		setPost(item);
		setPostOptionVisibility(true);
	};

	const SpeakerWebinars = () => (
		<>
			{webinars.length > 0 ? (
				<View style={styles.postSeparator}>
					<Text style={[exStyles.infoLargeM18, { color: colors.secondaryText }]}>Webinars</Text>
					<MaterialIcons name='arrow-drop-down' size={RFValue(24)} color={colors.secondaryText} />
				</View>
			) : null}
			<FlatList
				data={webinars}
				horizontal
				contentContainerStyle={{ marginTop: 24 }}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item }) => (
					<ItemWebinarList
						data={item.webinar}
						width={screenWidth * 0.75}
						onPress={() => {
							navigation.navigate('WebinarDetails', {
								webinar: item.webinar,
								briefcaseCallback: null
							});
						}}
					/>
				)}
			/>
		</>
	);

	return (
		<SafeAreaView style={{ backgroundColor: colors.white, flex: 1 }}>
			<StatusBar theme='light' backgroundColor='white' barStyle='dark-content' />
			<Header />
			<FlatList
				initialNumToRender={2}
				data={postData}
				windowSize={9}
				ListHeaderComponent={
					<>
						<View style={styles.profileContainerRoundBottom}>
							<View style={styles.roundedSubContainer}>
								<ImageBackground style={styles.userRole} resizeMode='contain' source={require('@assets/userRoleBackground.png')}>
									<Text style={[exStyles.infoLargeM16, { color: 'white' }]}>
										{user.user_roles === undefined || user.user_roles == null ? '' : user.user_roles.name}
									</Text>
								</ImageBackground>
								<FastImage style={styles.profilePhoto} source={{ uri: user.image }} />
								{loading ? null : (
									<>
										<Text style={[exStyles.largeTitleR28, styles.txt28]}>{`${user.fname} ${user.lname}`}</Text>
										{user.profile.is_private == 1 ? null : (
											<>
												{user.company_name == '' ? null : (
													<View style={styles.jobCompanyTest}>
														<Text style={[exStyles.infoDetailR16, styles.jobTitle]}>{user.job_title}</Text>
														<Text style={[exStyles.infoLargeM16, styles.jobTitle]}>{`  @${user.company_name}`}</Text>
													</View>
												)}
												{user.profile.address === '' ? null : (
													<View style={[styles.jobCompanyTest, { alignItems: 'center', marginBottom: 4 }]}>
														<IonIcons name='location-sharp' size={18} color={colors.secondaryText} />
														<Text style={[exStyles.infoDetailR16, styles.jobTitle]}>{user.profile.address}</Text>
													</View>
												)}
												<Text style={[exStyles.infoLargeM16, styles.jobTitle]}>{user.email}</Text>
											</>
										)}
										{user.profile.is_private == 1 ? null : <SocialIcons />}
										{user.user_interest.length > 0 ? <UserInterest /> : null}
									</>
								)}
							</View>
							{loading ? null : <UserContact />}
						</View>
						<AboutMe />
						<Resume />
						<Buttons />
						<SpeakerWebinars />
						<View style={styles.postSeparator}>
							<Text style={[exStyles.infoLargeM18, { color: colors.secondaryText }]}>User Post</Text>
						</View>
					</>
				}
				ListEmptyComponent={
					loading ? (
						<PostPlaceholder />
					) : (
						<View style={styles.noPostContainerText}>
							<Text style={styles.noMorePosts}>No Posts available</Text>
						</View>
					)
				}
				ListFooterComponent={<>{postEnded ? null : <PostPlaceholder />}</>}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item }) => <Post item={item} onOptionPress={showPostOptionModal} />}
				extraData={postData}
				onEndReached={getUserPosts}
				onEndReachedThreshold={0.5}
			/>
			<PostOptionModal
				visible={postOptionVisibility}
				data={post}
				onClose={() => setPostOptionVisibility(false)}
				onDeletePost={() => {}}
				onEditPost={() => {}}
			/>
			<ModalExchangeContact
				visible={contactPopupVisible}
				data={profile}
				userId={user.id}
				onClose={() => {
					setContactPopupVisible(false);
				}}
			/>
			<AlertModal
				visible={alertVisibility}
				type=''
				text='Bookmark'
				typeId=''
				onYes={deleteBookMark}
				onClose={() => {
					setAlertVisibility(false);
				}}
			/>
			{loading ? <LoadingDialog absolute size='large' theme={theme} /> : null}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	headerContaier: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		height: RFValue(40)
	},
	headerRightIconsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},

	userRole: {
		position: 'relative',
		width: RFValue(144),
		height: RFValue(24),
		paddingLeft: RFValue(8),
		justifyContent: 'center'
	},

	txtBlogTitle: {
		fontSize: RFValue(16),
		color: 'black',
		flex: 1,
		marginStart: RFValue(10)
	},
	icon: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	txtDetails: {
		fontSize: RFValue(12),
		color: 'grey',
		marginStart: RFValue(5)
	},
	profileContainerRoundBottom: {
		backgroundColor: colors.secondaryColor,
		borderBottomRightRadius: RFValue(40),
		borderBottomLeftRadius: RFValue(40)
	},
	roundedSubContainer: {
		backgroundColor: colors.white,
		paddingBottom: RFValue(8),
		borderBottomRightRadius: RFValue(40),
		borderBottomLeftRadius: RFValue(40)
	},
	pressableWrapper: {
		paddingVertical: RFValue(3),
		paddingHorizontal: RFValue(5)
	},
	iconBackBtn: {
		height: RFValue(40),
		width: RFValue(40),
		resizeMode: 'contain',
		transform: [{ rotate: '180deg' }]
	},
	iconHeaderBtn: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	profilePhoto: {
		height: 144,
		width: 144,
		borderRadius: 144 / 2,
		alignSelf: 'center',
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},
	jobCompanyTest: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 8
	},
	txt28: {
		marginTop: 16,
		alignSelf: 'center',
		color: '#424242'
	},
	jobTitle: {
		alignSelf: 'center',
		color: colors.primaryText
	},

	iconLocationPin: {
		height: RFValue(20),
		width: RFValue(14),
		alignSelf: 'center'
	},
	containerRowCenter: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		marginVertical: 4
	},
	iconSocialBtn: {
		height: RFValue(24),
		width: RFValue(24),
		resizeMode: 'contain'
	},
	contactSeparator: {
		backgroundColor: 'white',
		height: 30,
		width: 1,
		alignSelf: 'center'
	},
	userInterestContainer: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		overflow: 'hidden',
		minHeight: RFValue(27),
		justifyContent: 'center'
	},
	itemUserInterest: {
		padding: RFValue(5),
		paddingVertical: RFValue(3),
		marginVertical: RFValue(2),
		borderWidth: RFValue(1),
		borderRadius: RFValue(15),
		borderColor: 'grey',
		marginHorizontal: RFValue(3),
		alignSelf: 'center'
	},
	containerContact: {
		height: 56,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingHorizontal: 60
	},
	txtAboutMe: {
		marginHorizontal: 28,
		color: colors.primaryText,
		fontSize: 16,
		marginTop: RFValue(16),
		textAlign: 'center',
		letterSpacing: 0.6,
		lineHeight: 24,
		flex: 1,
		fontWeight: '400'
	},
	pressableRibben: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: RFValue(10),
		backgroundColor: '#ececec',
		paddingHorizontal: RFValue(20),
		paddingVertical: RFValue(5),
		borderRadius: RFValue(3)
	},
	postSeparator: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		alignItems: 'center',
		backgroundColor: colors.unSelected,
		marginTop: 40
	},

	noPostContainerText: {
		alignItems: 'center',
		paddingVertical: 32,
		backgroundColor: '#F7F7F7'
	},
	noMorePosts: {
		fontSize: RFValue(16),
		fontWeight: '500',
		color: colors.secondaryText
	},
	underLinePrimary: {
		color: colors.primaryColor,
		textDecorationLine: 'underline',
		marginTop: 5
	}
});

const profileSchema = {
	facebook_link: '',
	linkedin: '',
	instagram_link: '',
	twitter_link: '',
	profile: {
		phone_number: '',
		address: '',
		website: ''
	},
	email: ''
};

// export default memo(Lobby);
export default withDimensions(withTheme(memo(LoopUserProfile)));
