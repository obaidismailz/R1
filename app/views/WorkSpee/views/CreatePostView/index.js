import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
	View,
	SafeAreaView as SafeAreaViewNative,
	Animated,
	Text,
	TouchableOpacity,
	Image,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	Easing,
	ToastAndroid,
	Platform,
	Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ActionSheet } from 'react-native-cross-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import { validRange } from 'semver';
import { colors, exStyles } from '@styles';
import { io } from 'socket.io-client';
import CreatePostOptions from './CreatePostOptions';
import { CustomHeaderButtons, Item, CancelModalButton } from '../../../../containers/HeaderButton';
import StatusBar from '../../../../containers/StatusBar';
import { CREATE_POST, SOCIAL_SOCKET } from '../../../../utils/Constants';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import { themes } from '../../../../constants/colors';
import { withTheme } from '../../../../theme';
import { withDimensions } from '../../../../dimensions';
import styles from './styles';
import MentionUsersAndLocation from '../../components/CreatePostPreview/MentionnUser';
import FeelingsAndActivites from '../../components/CreatePostPreview/FeelingsAndActivites';
import PostAudio from '../../components/PostCard/PostBody/PostAudio';
import PostVideo from '../../components/PostCard/PostBody/PostVideo';
import FIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import SafeAreaView from '../../../../containers/SafeAreaView';

const CreatePostView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const animatedValue = new Animated.Value(0);

	const [postPrivacy, setPostPrivacy] = useState(0);
	const [postText, setPostText] = useState('');
	const [postType, setPostType] = useState(0);

	const [imagePath, setImagePath] = useState(null);
	const [imageFile, setImageFile] = useState(null);
	const [postGifUrl, setPostGifUrl] = useState(null);
	const [videoPath, setVideoPath] = useState(null);
	const [videoFile, setVideoFile] = useState(null);
	const [mentionUsers, setMentionUsers] = useState([]);
	const [file, setFile] = useState(null);
	const [fileType, setFileType] = useState('');
	const [postMap, setPostMap] = useState('');

	const [loading, setLoading] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState('');

	const [createPostModalVisibility, setCreatePostModalVisibility] = useState(true);

	const [activityType, setActivityType] = useState('');
	const [activityName, setActivityName] = useState('');
	const [smily, setSmily] = useState('');
	const [activityId, setActivityId] = useState('');

	const socket = io(SOCIAL_SOCKET, {
		query: { domain: ShareData.getInstance().subDomain },
		transports: ['websocket'],
		rejectUnauthorized: false,
		autoConnect: true
	});

	// const setHeader = () => {
	// 	navigation.setOptions({
	// 		title: 'Add Posts',

	// 		headerRight: () => (
	// 			<CustomHeaderButtons>
	// 				<Item title='Post' onPress={() => post()} testID='status-view-submit' />
	// 			</CustomHeaderButtons>
	// 		)
	// 	});
	// };

	const Header = () => (
		<View style={[styles.headerContaier, { backgroundColor: themes[theme].headerBackground }]}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					{ borderRadius: RFValue(12) }
				]}
				onPress={() => navigation.goBack()}>
				<IonIcons name='ios-chevron-back-sharp' size={RFValue(24)} color='white' />
			</Pressable>
			<View style={styles.headerRightIconsContainer}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
						},
						{ borderRadius: RFValue(2) }
					]}
					onPress={() => !loading && post()}>
					<Text style={[exStyles.ButtonSM20, { color: 'white' }]}>Post</Text>
				</Pressable>
			</View>
		</View>
	);

	useEffect(() => {}, []);

	const BottomContainer = () => (
		<View style={styles.postInputFieldBottomContainer}>
			<TouchableOpacity onPress={onImagePick}>
				<Image style={{ marginRight: 15, height: 20, width: 20.83 }} source={require('../../../../static/icons/gallery.png')} />
			</TouchableOpacity>
			<TouchableOpacity onPress={onVideoPick}>
				<Image style={{ marginRight: 15, height: 17, width: 22 }} source={require('../../../../static/icons/video.png')} />
			</TouchableOpacity>
			<TouchableOpacity onPress={onFeelingPick}>
				<Image style={{ marginRight: 15, height: 20, width: 20 }} source={require('../../../../static/icons/smilewink.png')} />
			</TouchableOpacity>
			<TouchableOpacity onPress={checkIn}>
				<Image
					style={{ marginRight: 15, height: 19.79, width: 16.67 }}
					source={require('../../../../static/icons/location.png')}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					height: 12
				}}
				onPress={() => setCreatePostModalVisibility(true)}>
				<FAIcons style={{ marginRight: 15 }} name='chevron-up' size={16} color='#3695FF' />
				<FAIcons style={{ marginRight: 15, opacity: 0.5 }} name='ellipsis-h' size={15} color='#3695FF' />
			</TouchableOpacity>
		</View>
	);

	function bottomPostPrivacyButton() {
		if (postPrivacy == 0) {
			return (
				<View style={styles.bottomPrivacyButton}>
					<FAIcons name='globe' size={14} color='#737474' />
					<Text style={styles.bottomPrivacyButtonText}>EveryOne</Text>
				</View>
			);
		} else if (postPrivacy == 1) {
			return (
				<View style={styles.bottomPrivacyButton}>
					<FAIcons name='users' size={14} color='#737474' />
					<Text style={styles.bottomPrivacyButtonText}>Colleaguse Follow me</Text>
				</View>
			);
		} else if (postPrivacy == 2) {
			return (
				<View style={styles.bottomPrivacyButton}>
					<FAIcons name='user-alt' size={14} color='#737474' />
					<Text style={styles.bottomPrivacyButtonText}>Colleaguse I Follow</Text>
				</View>
			);
		} else if (postPrivacy == 3) {
			return (
				<View style={styles.bottomPrivacyButton}>
					<FAIcons name='lock' size={14} color='#737474' />
					<Text style={styles.bottomPrivacyButtonText}>Only me</Text>
				</View>
			);
		}
	}

	const topPostPrivacyButton = () => {
		if (postPrivacy == 0) {
			return <Text style={styles.privacyText}>EveryOne</Text>;
		} else if (postPrivacy == 1) {
			return <Text style={styles.privacyText}>Colleaguse Follow me</Text>;
		} else if (postPrivacy == 2) {
			return <Text style={styles.privacyText}>Colleaguse I Follow </Text>;
		} else if (postPrivacy == 3) {
			return <Text style={styles.privacyText}>Only me</Text>;
		}
	};

	const navigateToEditPrivacyView = () => {
		navigation.navigate('EditPrivacyView', {
			navigationScreen: 1,
			createPostPrivacy: postPrivacy,
			selectedPostPrivacy: value => {
				setPostPrivacy(value);
			}
		});
	};

	const post = async () => {
		if (
			(postText == '' || postText == null) &&
			imageFile == null &&
			videoFile == null &&
			postGifUrl == null &&
			file == null &&
			mentionUsers.length == 0 &&
			postMap == '' &&
			activityType == ''
		) {
		} else {
			setLoading(true);
			const bodyFormData = new FormData();
			bodyFormData.append('user_id', ShareData.getInstance().user_id);
			bodyFormData.append('s', ShareData.getInstance().timeline_token);
			bodyFormData.append('postText', postType == 3 ? `${postText} ${mentionUsers.join(' ')}` : postText);
			bodyFormData.append('postPrivacy', 0);
			if (postType == 1) {
				const androidFileName = imageFile.path.split('/').pop();
				bodyFormData.append('postPhotos', {
					uri: imageFile.path,
					type: imageFile.mime,
					name: androidFileName
				});
			} else if (postType == 2) {
				const androidFileName = videoFile.path.split('/').pop();
				bodyFormData.append('postVideo', {
					uri: videoFile.path,
					type: videoFile.mime,
					name: androidFileName
				});
			} else if (postType == 4) {
				bodyFormData.append('postSticker', postGifUrl);
			} else if (postType == 5) {
				bodyFormData.append('feeling_type', activityType);
				bodyFormData.append('feeling', activityId);
			} else if (postType == 7) {
				bodyFormData.append('postFile', {
					uri: file.uri,
					type: file.type,
					name: file.name
				});
			} else if (postType == 9) {
				bodyFormData.append('postMap', postMap);
			} else if (postType == 10) {
				bodyFormData.append('postMusic', {
					uri: file.uri,
					type: file.type,
					name: file.name
				});
			}
			await fetch(ShareData.getInstance().socialBaseUrl + CREATE_POST, {
				method: 'POST',
				body: bodyFormData,
				headers: { 'Content-Type': 'multipart/form-data' }
			})
				.then(res => res.json())
				.then(response => {
					response.api_status === '200' ? reset(response.post_data) : setConfirmationMessage('Failed');
					showMessage(response.api_status);
				})
				.catch(error => {
					console.error(error);
					setLoading(false);
				});
		}
	};

	const reset = postResponse => {
		socket.emit('new_post', { post_id: postResponse.post_id });
		setPostText('');
		setImagePath(null);
		setImageFile(null);
		setVideoPath(null);
		setVideoFile(null);
		setPostGifUrl(null);
		setPostMap('');
		setLoading(false);
		setConfirmationMessage('Post Created');
	};

	const showMessage = message => {
		ToastAndroid.show('Post Created', ToastAndroid.LONG);
		Animated.timing(animatedValue, {
			toValue: 1,
			duration: 200,
			easing: Easing.inOut(Easing.quad),
			useNativeDriver: true
		}).start();

		setTimeout(() => {
			hideMessage();
			if (message == '200') {
				navigation.goBack();
			}
		}, 1000);
	};

	const hideMessage = () => {
		Animated.timing(animatedValue, {
			toValue: 0,
			duration: 200,
			easing: Easing.inOut(Easing.quad),
			useNativeDriver: true
		}).start();
	};

	const createPostConfirmationMessage = () => {
		const translateY = animatedValue.interpolate({
			inputRange: [0, 1],
			outputRange: [-326, 100]
		});
		return (
			<Animated.View
				style={[
					styles.dropdownContainer,
					{
						transform: [{ translateY }],
						backgroundColor: '#ffffff'
					}
				]}>
				<LinearGradient
					style={styles.confirmationMessageView}
					start={{ x: 0.0, y: 0.25 }}
					end={{ x: 0.5, y: 1.0 }}
					colors={['#8C7EBB', '#34B1C5']}>
					<Text style={styles.confirmationMessageText}>{confirmationMessage}</Text>
				</LinearGradient>
			</Animated.View>
		);
	};

	// pick Image
	const onImagePick = () => {
		ActionSheet.options({
			options: [
				{ text: 'Take from Camera ', onPress: takeFromCamera },
				{
					text: 'Choose from Gallery',
					onPress: chooseFromGallery
				}
			],
			cancel: { onPress: () => console.log('cancel') }
		});
	};
	const takeFromCamera = () => {
		setVideoPath(null);
		setPostGifUrl(null);
		ImagePicker.openCamera({
			mediaType: 'photo',
			compressImageQuality: 1,
			forceJpg: Platform.OS == 'ios'
		}).then(image => {
			setImageFile(image);
			setImagePath(image.path);
			setPostType(1);
			// setCreatePostModalVisibility(false);
		});
	};
	const chooseFromGallery = () => {
		setVideoPath(null);
		setPostGifUrl(null);
		ImagePicker.openPicker({
			compressImageQuality: 1
		}).then(image => {
			setImageFile(image);
			setImagePath(image.path);
			setPostType(1);
			// setCreatePostModalVisibility(false);
		});
	};

	// pick Video
	const onVideoPick = () => {
		ActionSheet.options({
			options: [
				{
					text: 'Take from Camera ',
					onPress: () => takeVideoFromCamera()
				},
				{
					text: 'Choose from Gallery',
					onPress: () => chooseVideoFromCamera()
				}
			],
			cancel: { onPress: () => console.log('cancel') }
		});
	};
	const takeVideoFromCamera = () => {
		ImagePicker.openCamera({
			mediaType: 'video'
		}).then(video => {
			setVideoFile(video);
			setVideoPath(video.path);
			setPostType(2);
			setCreatePostModalVisibility(false);
		});
	};
	const chooseVideoFromCamera = () => {
		ImagePicker.openPicker({
			mediaType: 'video'
		}).then(video => {
			setVideoFile(video);
			setVideoPath(video.path);
			setPostType(2);
			setCreatePostModalVisibility(false);
		});
	};

	// mention users
	const onMentionUser = () => {
		navigation.navigate('MentionUser', {
			selectedUser: users => {
				setMentionUsers(users);
				setPostType(3);
			}
		});
		setCreatePostModalVisibility(false);
	};

	// Gif Pick
	const onGifPick = () => {
		setVideoPath(null);
		navigation.navigate('GifView', {
			gifUrl: url => {
				setPostGifUrl(url);
				setPostType(4);
			}
		});
		setCreatePostModalVisibility(false);
	};

	// Feelings and Activities Pick

	const onFeelingPick = () => {
		navigation.navigate('FeelingActivitesView', {
			feeling: (type, name, smily, id) => {
				setActivityType(type);
				setActivityName(name);
				setActivityId(id);
				setSmily(smily);
				setPostType(5);
			}
		});
		setCreatePostModalVisibility(false);
	};

	// file pick
	const onFilePick = async () => {
		// Pick a single file
		try {
			const file = await DocumentPicker.pick({
				type: [DocumentPicker.types.pdf]
			});
			setFile(file);
			setPostType(7);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};

	// create polls
	const onCreatePoll = () => {
		navigation.navigate('CreatePollsView');
		setCreatePostModalVisibility(false);
	};

	// check in
	const checkIn = () => {
		navigation.navigate('CheckInView', {
			selectedPlace: val => {
				setPostType(9);
				setPostMap(val);
			}
		});
		setCreatePostModalVisibility(false);
	};

	// music pick
	const onMusicPick = async () => {
		// Pick a single file
		try {
			const file = await DocumentPicker.pick({
				type: [DocumentPicker.types.audio]
			});
			setFile(file);
			setPostType(10);
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};

	// contents preview

	ContentPreview = () =>
		imagePath == null && postGifUrl == null ? null : (
			<View style={styles.filePreviewContainer}>
				<FastImage
					style={styles.previewImageStyle}
					source={{
						uri: imagePath == null ? postGifUrl : imagePath
					}}
				/>

				<TouchableOpacity
					onPress={() => {
						setImagePath(null);
						setPostGifUrl(null);
					}}
					style={styles.fileCancelButton}>
					<Icon name='times' size={12} color='#ffffff' />
				</TouchableOpacity>
			</View>
		);

	ContentPreviewVideo = () =>
		videoPath == null ? null : (
			<View style={styles.filePreviewContainer}>
				<PostVideo videoUrl={videoPath} />
				<TouchableOpacity onPress={() => setVideoPath(null)} style={styles.fileCancelButton}>
					<Icon name='times' size={12} color='#ffffff' />
				</TouchableOpacity>
			</View>
		);

	ContentPreviewFile = () =>
		file == null ? null : postType == 7 ? (
			<View style={styles.pdfContainer}>
				<Pdf
					source={{
						uri: file.uri,
						cache: true
					}}
					page={1}
					singlePage
					onLoadComplete={(numberOfPages, filePath) => {
						console.log(`number of pages: ${numberOfPages}`);
					}}
					onPageChanged={(page, numberOfPages) => {
						console.log(`current page: ${page}`);
					}}
					onError={error => {
						console.log(error);
					}}
					onPressLink={uri => {
						console.log(`Link presse: ${uri}`);
					}}
					style={styles.pdf}
				/>
				<TouchableOpacity
					onPress={() => setFile(null)}
					style={[styles.fileCancelButton, { top: 20, right: Platform.OS == 'ios' ? 60 : 90 }]}>
					<Icon name='times' size={12} color='#ffffff' />
				</TouchableOpacity>
			</View>
		) : (
			<View
				style={{
					flexDirection: 'row'
				}}>
				<View style={{ width: '90%' }}>
					<PostAudio type={1} url={this.state.file.uri} />
				</View>
				<TouchableOpacity onPress={() => this.setState({ file: null })} style={[styles.fileCancelButton, { top: 40 }]}>
					<Icon name='times' size={12} color='#ffffff' />
				</TouchableOpacity>
			</View>
		);

	ContentMapPreview = () =>
		postMap == '' ? null : (
			<View style={styles.filePreviewContainer}>
				<FastImage
					style={styles.previewImageStyle}
					source={{
						uri: `https://maps.googleapis.com/maps/api/staticmap?center=${postMap}&zoom=13&size=600x250&maptype=roadmap&markers=color:red%7C${postMap}&key= AIzaSyBpb3cDLn6K6bqrO3j-uraVfyCrLQmaJ-g`
					}}
				/>

				<TouchableOpacity onPress={() => setPostMap('')} style={styles.fileCancelButton}>
					<Icon name='times' size={12} color='#ffffff' />
				</TouchableOpacity>
			</View>
		);

	return (
		<>
			<SafeAreaViewNative theme={theme} style={{ backgroundColor: themes[theme].headerBackground }} />
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<Header />
			<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
				<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
					<View style={styles.roundedView}>
						<View style={styles.profileItemContainer}>
							<View style={styles.avtarContainerInDropDown}>
								<FastImage style={styles.imageAvtar} resizeMode='cover' source={{ uri: ShareData.getInstance().image }} />
							</View>
							{activityName == '' ? (
								<View style={styles.mentionUsersAndPoilicyContainer}>
									<MentionUsersAndLocation mentionUsers={mentionUsers} postMap={postMap} />
								</View>
							) : (
								<FeelingsAndActivites activityType={activityType} activityName={activityName} smily={smily} />
							)}
						</View>
						<View style={styles.textInputContainer}>
							<TextInput
								multiline
								numberOfLines={4}
								placeholder="What's going ?"
								placeholderTextColor='rgba(0,0,0,0.3)'
								style={[exStyles.largeTitleR28, { marginTop: 8, color: colors.primaryText }]}
								onChangeText={txt => setPostText(txt)}
								value={postText}
							/>
							{loading ? <ActivityIndicator size='large' /> : null}
							{/* <Spinner
								cancelable={false}
								animation='fade'
								visible={loading}
								textContent='Posting...'
								textStyle={styles.spinnerTextStyle}
							/> */}
						</View>
						{createPostConfirmationMessage()}
						<ContentPreview />
						<ContentPreviewVideo />
						<ContentPreviewFile />
						<ContentMapPreview />
						<BottomContainer />
					</View>
				</TouchableWithoutFeedback>
				<CreatePostOptions
					visible={createPostModalVisibility}
					onClose={() => {
						setCreatePostModalVisibility(false);
					}}
					onImagePick={onImagePick}
					onVideoPick={onVideoPick}
					onMentionUser={onMentionUser}
					onGifPick={onGifPick}
					onFeelingPick={onFeelingPick}
					onFilePick={onFilePick}
					onCreatePoll={onCreatePoll}
					checkIn={checkIn}
					onMusicPick={onMusicPick}
					postType={postType}
					image={imagePath}
					video={videoPath}
					gif={postGifUrl}
					file={file}
					postMap={postMap}
				/>
			</SafeAreaView>
		</>
	);
};

export default withDimensions(withTheme(memo(CreatePostView)));
