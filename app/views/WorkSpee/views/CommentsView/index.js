import React, { useState, useEffect, memo } from 'react';
import {
	View,
	TextInput,
	Text,
	Keyboard,
	TouchableOpacity,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	SafeAreaView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { ShareData } from '@utils';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors } from '@styles';
import { ActionSheet } from 'react-native-cross-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { io } from 'socket.io-client';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import styles from './styles';
import { themes } from '../../../../constants/colors';
import { withTheme } from '../../../../theme';
import { withDimensions } from '../../../../dimensions';
import PostCommentSection from '../../components/PostCard/PostFooter/PostCommentSection';
import CommentOptions from './CommentOptions';
import StatusBar from '../../../../containers/StatusBar';
import {
	clearComments,
	commentReactionUpdate,
	deleteComment,
	editedComment,
	fetchComments,
	hideCommentOptions,
	registerNewComment,
	replyingInActive,
	setCommentFieldText
} from '../../../../actions/social/comments';
import { registerComment, registerReply } from '../../../../apis/LoopExpoApi';
import { clearReplies, editReply, registerNewReply } from '../../../../actions/social/reply';
import { SOCIAL_SOCKET } from '../../../../utils/Constants';
import { exStyles } from '../../../../styles';
import { updateCommentCount } from '../../../../actions/social/newsfeed';
import { updateMyCommentCount } from '../../../../actions/social/myTimeline';

const qs = require('qs');

const CommentsView = ({ navigation, isMasterDetail, user, route, ...props }) => {
	const { theme } = props;

	const item = route.params.postItem;
	const dispatch = useDispatch();
	const state = useSelector(state => state.comments);
	const reply = useSelector(state => state.reply);

	const [commentId, setCommentId] = useState('');
	// const [commentFieldText, setCommentFieldText] = useState('');

	const [editComment, setEditComment] = useState(false);
	const [sendButton, setSendButton] = useState(false);

	const [commentType, setCommentType] = useState(0);
	const [imagePath, setImagePath] = useState(null);
	const [imageFile, setImageFile] = useState(null);

	const socket = io(SOCIAL_SOCKET, {
		transports: ['websocket'],
		rejectUnauthorized: false,
		autoConnect: true
	});

	const Header = () => (
		<View style={styles.headerContaier}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					{ borderRadius: RFValue(24) / 2 }
				]}
				onPress={() => navigation.goBack()}>
				<IonIcons name='close' size={RFValue(24)} color='white' />
			</Pressable>
			{state.loading ? null : (
				<Text style={styles.headerName}>{state.comments.length == 0 ? 'No comments yet' : 'Comments'}</Text>
			)}
			<View />
		</View>
	);

	useEffect(() => {
		dispatch(fetchComments(item.post_id));

		socket.on('new_comment_added', data => {
			console.error('resss' + ' ' + JSON.stringify(data));
			dispatch(registerNewComment(data.comment_data));
		});

		socket.on('new_comment_reaction_added', data => {
			dispatch(commentReactionUpdate(data.comment_id, data.reactions));
		});
		return () => {
			dispatch(clearComments());
			dispatch(clearReplies());
			socket.removeAllListeners('new_comment_added');
			socket.removeAllListeners('new_comment_reaction_added');
		};
	}, []);

	const postEditedComment = async text => {
		const params = {
			process: 'React_Edit_Comment',
			comment_id: commentId,
			text,
			user_id: ShareData.getInstance().user_id
		};
		setEditComment(false);
		dispatch(editedComment(params));
	};

	const postNewComment = text => {
		const bodyFormData = new FormData();
		bodyFormData.append('user_id', ShareData.getInstance().user_id);
		bodyFormData.append('post_id', item.id);
		bodyFormData.append('text', text);
		if (commentType == 1) {
			const androidFileName = imageFile.path.split('/').pop();
			bodyFormData.append('image', {
				uri: imageFile.path,
				type: imageFile.mime,
				name: Platform.OS == 'ios' ? imageFile.filename : androidFileName
			});
		}
		registerComment(bodyFormData).then(response => {
			if (response._metadata.outcome === 'SUCCESS') {
				socket.emit('new_comment', {
					comment_id: response.records[0].id
				});
				dispatch(updateCommentCount(response.records[0].post_id, response.records[0].comment_count));
				dispatch(updateMyCommentCount(response.records[0].post_id, response.records[0].comment_count));
			}
		});
	};

	const submitComment = () => {
		if (editComment == true) {
			postEditedComment(state.commentFieldText);
		} else {
			postNewComment(state.commentFieldText);
		}
		resetValues();
	};

	const postReply = () => {
		const bodyFormData = new FormData();
		bodyFormData.append('user_id', ShareData.getInstance().user_id);
		bodyFormData.append('comment_id', state.replyingCommentId);
		bodyFormData.append('text', state.commentFieldText);
		if (commentType == 1) {
			const androidFileName = imageFile.path.split('/').pop();
			bodyFormData.append('image', {
				uri: imageFile.path,
				type: imageFile.mime,
				name: Platform.OS == 'ios' ? imageFile.filename : androidFileName
			});
		}
		registerReply(bodyFormData).then(response => {
			console.error(response);
			dispatch(registerNewReply(response.records, response.records[0].comment_id));
		});
	};

	const postEditedReply = () => {
		const bodyFormData = new FormData();
		bodyFormData.append('reply_id', reply.editReplyId);
		bodyFormData.append('text', state.commentFieldText);
		dispatch(editReply(bodyFormData, state.commentFieldText));
	};

	const submitReply = () => {
		reply.editingReply ? postEditedReply() : postReply();
		resetValues();
	};

	function resetValues() {
		dispatch(setCommentFieldText(''));
		setCommentType(0);
		setImageFile(null);
		setImagePath(null);
		Keyboard.dismiss();
		dispatch(replyingInActive(false));
	}

	const CommetField = () => (
		<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} keyboardVerticalOffset={state.replying ? 48 : 44}>
			<View style={styles.showCommentFieldBottom}>
				<FastImage source={{ uri: ShareData.getInstance().image }} style={styles.imageStyle} />
				<View style={[styles.replyContainer, { height: state.replying ? 68 : 40 }]}>
					{state.replying ? (
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								marginHorizontal: 16,
								marginBottom: 6
							}}>
							<Text
								style={[
									exStyles.infoLink14Med,
									{
										color: colors.primaryText
									}
								]}>
								Replying...
							</Text>

							<Icon name='times' size={18} color={colors.primaryText} onPress={() => dispatch(replyingInActive(false))} />
						</View>
					) : null}
					<View style={styles.commentfieldAndSmilyIcon}>
						<TouchableOpacity activeOpacity={0.7} style={styles.addIcon} onPress={() => onImagePick()}>
							<IonIcons name='add-circle' size={24} color='#7E8389' />
						</TouchableOpacity>
						<TextInput
							style={styles.inputfieldStyle}
							autoFocus
							placeholder='Add comment...'
							placeholderTextColor='rgba(0,0,0,0.3)'
							onSubmitEditing={() => Keyboard.dismiss()}
							onChangeText={text => {
								dispatch(setCommentFieldText(text));
								setSendButton(true);
							}}
							value={state.commentFieldText}
						/>
					</View>
				</View>
				{(sendButton == true && state.commentFieldText != '') || commentType == 1 ? (
					<TouchableOpacity
						style={styles.sendButton}
						onPress={() => {
							state.replying ? submitReply() : submitComment();
						}}>
						<Icon style={styles.smilyIconStyle} name='location-arrow' color='#127BF1' size={22} />
					</TouchableOpacity>
				) : null}
			</View>

			{commentType == 1 ? (
				<View style={styles.imagePreviewContainer}>
					<FastImage
						style={styles.previewCommentImageStyle}
						source={{
							uri: imagePath
						}}>
						<TouchableOpacity
							onPress={() => {
								setImagePath(null);
								setCommentType(0);
							}}
							style={styles.fileCancelButton}>
							<Icon name='times' size={12} color='#ffffff' />
						</TouchableOpacity>
					</FastImage>
				</View>
			) : null}
		</KeyboardAvoidingView>
	);

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
		ImagePicker.openCamera({
			width: 300,
			height: 400,
			cropping: true,
			mediaType: 'photo'
		}).then(image => {
			setImageFile(image);
			setImagePath(image.path);
			setCommentType(1);
		});
	};
	const chooseFromGallery = () => {
		ImagePicker.openPicker({
			width: 300,
			height: 400,
			cropping: true
		}).then(image => {
			setImageFile(image);
			setImagePath(image.path);
			setCommentType(1);
		});
	};

	const onEditComment = (commentId, commentText) => {
		setEditComment(true);
		dispatch(setCommentFieldText(commentText));
		setCommentId(commentId);
		dispatch(hideCommentOptions());
	};

	const onDeleteComment = async commentId => {
		dispatch(deleteComment(commentId));
		dispatch(hideCommentOptions());
	};

	return (
		<>
			<SafeAreaView theme={theme} style={{ flex: 0, backgroundColor: themes[theme].headerBackground }} />

			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<Header />
			<SafeAreaView
				theme={theme}
				style={{
					flex: 1,
					backgroundColor: themes[theme].backgroundColor
				}}>
				<ScrollView style={styles.scrollViewContainer}>
					{item.comments_status === 1 ? (
						state.loading == true ? (
							<ActivityIndicator theme={theme} />
						) : state.comments.length == 0 ? (
							<View style={{ marginTop: 32, alignItems: 'center' }}>
								<IonIcons name='md-chatbox-ellipses-outline' size={150} color='rgba(0,0,0,0.05)' />
								<Text style={styles.emptyCommetText}>Be first to comment</Text>
								<Text style={styles.emptyCommetText}>here!</Text>
							</View>
						) : (
							<PostCommentSection commentData={state.comments} />
						)
					) : (
						<Text style={{ alignSelf: 'center', fontWeight: '500' }}>Comments are Disabled</Text>
					)}
				</ScrollView>
				{item.comments_status === 1 ? CommetField() : null}
				<CommentOptions
					visible={state.commentOptionVisibility}
					data={state.comment}
					onClose={() => {
						dispatch(hideCommentOptions());
					}}
					onDeleteComment={onDeleteComment}
					onEditComment={onEditComment}
				/>
				<Spinner
					cancelable={false}
					animation='fade'
					visible={state.isDeleting}
					textContent='Deleting...'
					textStyle={styles.spinnerTextStyle}
				/>
			</SafeAreaView>
		</>
	);
};

export default withDimensions(withTheme(memo(CommentsView)));
