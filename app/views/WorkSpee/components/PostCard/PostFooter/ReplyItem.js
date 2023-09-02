import React, { memo, useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	TouchableOpacity,
	Pressable
} from 'react-native';
import moment from 'moment';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import ActivityIndicator from '../../../../../containers/ActivityIndicator';
import PostReactions from './PostReactions';
import { withDimensions } from '../../../../../dimensions';
import { withTheme } from '../../../../../theme';
import Navigation from '../../../../../lib/Navigation';
import LikesDetailModal from '../../LikesDetailModal';
import {
	deleteReply,
	editReply,
	editReplyValues,
	hideReplyOptions,
	showReplyOptions
} from '../../../../../actions/social/reply';
import CommentOptions from '../../../views/CommentsView/CommentOptions';
import {
	replyingActive,
	setCommentFieldText
} from '../../../../../actions/social/comments';

const deviceWidth = Dimensions.get('window').width;

const ReplyItem = ({ ...props }) => {
	const { reactions } = props.item;
	const [visible, setVisible] = useState(false);
	const dispatch = useDispatch();
	const state = useSelector(state => state.reply);

	const navigateToUserProfile = () => {
		props.item.user_id == ShareData.getInstance().user_id
			? Navigation.navigate('ProfileStackNavigator')
			: Navigation.navigate('LoopUserProfile', {
				username: props.item.user.username
			  });
	};

	const onEditComment = (replyId, replyText) => {
		dispatch(replyingActive(true));
		dispatch(setCommentFieldText(replyText));
		dispatch(editReplyValues(replyId, replyText, props.commentId));
		dispatch(hideReplyOptions());
	};

	const onDeleteComment = async(replyId) => {
		dispatch(deleteReply(props.commentId, replyId));
		dispatch(hideReplyOptions());
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => navigateToUserProfile()}>
				<FastImage
					source={{
						uri: props.item.user.avatar
					}}
					style={styles.imageStyle}
				/>
			</TouchableOpacity>
			<View style={styles.commentContainer}>
				<TouchableOpacity
					onLongPress={() => dispatch(showReplyOptions(props.index, props.item, props.commentId))
					}
				>
					<TouchableOpacity onPress={() => navigateToUserProfile()}>
						<Text style={[exStyles.infoLink14Med, { color: colors.darkText }]}>
							{props.item.user.username}
						</Text>
					</TouchableOpacity>
					<Text
						style={[exStyles.descriptionSmallText, styles.commentTextStyle]}
					>
						{props.item.text}
					</Text>
					{props.item.c_file == '' || props.item.c_file == null ? null : (
						<FastImage
							style={{ height: 100, width: 100 }}
							source={{
								uri: props.item.c_file
							}}
						/>
					)}
				</TouchableOpacity>

				{/* comment like and share button */}
				<View style={styles.commentsButton}>
					<View style={styles.commentLikeAndreplyButtonContainer}>
						<Text style={[exStyles.infoLink14Med, styles.buttonsTextStyle]}>
							{moment
								.unix(props.item.time)
								.local()
								.startOf('seconds')
								.toNow(true)}
						</Text>
						<PostReactions
							reactiontype='reply'
							item={props.item}
							iconVisible={false}
						/>
					</View>
					<Pressable
						style={styles.commentLike}
						onPress={() => setVisible(true)}
					>
						<Text
							style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
						>
							{reactions.count == 0 ? '' : reactions.count}
						</Text>
						{reactions.count > 0 ? (
							<View style={styles.reactions}>
								{reactions.like ? (
									<FastImage
										source={require('../../../../../assets/Images/reactions/thumbsupfill.png')}
										style={styles.reactionImages}
									/>
								) : null}
								{reactions.love ? (
									<FastImage
										source={require('../../../../../assets/Images/reactions/love2.png')}
										style={styles.reactionImages}
									/>
								) : null}
								{reactions.haha ? (
									<FastImage
										source={require('../../../../../assets/Images/reactions/haha2.png')}
										style={styles.reactionImages}
									/>
								) : null}

								{reactions.wow ? (
									<FastImage
										source={require('../../../../../assets/Images/reactions/wow2.png')}
										style={styles.reactionImages}
									/>
								) : null}
								{reactions.sad ? (
									<FastImage
										source={require('../../../../../assets/Images/reactions/sad2.png')}
										style={styles.reactionImages}
									/>
								) : null}
								{reactions.angry ? (
									<FastImage
										source={require('../../../../../assets/Images/reactions/angry2.png')}
										style={styles.reactionImages}
									/>
								) : null}
							</View>
						) : null}
					</Pressable>
				</View>
				{/* Comment end  */}
			</View>

			{visible ? (
				<LikesDetailModal
					visible={visible}
					type='reply'
					data={props.item.id}
					onClose={() => setVisible(false)}
				/>
			) : null}
			<CommentOptions
				visible={state.replyOptionVisibility}
				data={state.reply}
				onClose={() => {
					dispatch(hideReplyOptions());
				}}
				onDeleteComment={onDeleteComment}
				onEditComment={onEditComment}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	// comments and reply
	container: {
		marginTop: 22,
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginHorizontal: 16,
		paddingRight: RFValue(30)
	},

	imageStyle: {
		height: 40,
		width: 40,
		alignItems: 'center',
		borderRadius: 40 / 2
	},

	commentContainer: {
		width: '100%',
		paddingHorizontal: 12,
		paddingVertical: 2
	},

	// commenter name, time and comment text style

	commentTextStyle: {
		paddingRight: RFValue(16),
		color: colors.darkText
	},

	//   //comment like and reply button
	commentsButton: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 8
	},
	commentLikeAndreplyButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center'
	},

	buttonsTextStyle: {
		color: colors.secondaryText,
		marginRight: 8
	},
	repliesCountText: {
		color: colors.primaryText,
		fontStyle: 'normal',
		fontSize: 16,
		fontWeight: '700',
		lineHeight: 24,
		letterSpacing: 0.75
	},

	reactions: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginLeft: 5
	},

	commentLike: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginRight: 8
	},

	reactionImages: {
		height: 20,
		width: 20
	}
});

export default memo(ReplyItem);
