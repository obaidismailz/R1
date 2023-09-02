import React, { memo, useState } from 'react';
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	Pressable,
	TouchableOpacity,
	FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { ShareData } from '@utils';
import PostCommentReplies from './PostCommentReplies';
import ActivityIndicator from '../../../../../containers/ActivityIndicator';
import PostReactions from './PostReactions';
import { withDimensions } from '../../../../../dimensions';
import { withTheme } from '../../../../../theme';
import { clearReplies, fetchReply } from '../../../../../actions/social/reply';
import {
	replyingActive,
	replyingInActive,
	showCommentOptions
} from '../../../../../actions/social/comments';
import Navigation from '../../../../../lib/Navigation';
import LikesDetailModal from '../../LikesDetailModal';
import ReplyItem from './ReplyItem';

const deviceWidth = Dimensions.get('window').width;

const CommentItem = ({ ...props }) => {
	const { reactions } = props.item;
	const [showReply, setShowReply] = useState(false);
	const dispatch = useDispatch();
	const state = useSelector(state => state.reply);
	const [visible, setVisible] = useState(false);

	const navigateToUserProfile = () => {
		props.item.user_id == ShareData.getInstance().user_id
			? Navigation.navigate('ProfileStackNavigator')
			: Navigation.navigate('LoopUserProfile', {
				username: props.item.user.username
			  });
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
					onLongPress={() => {
						dispatch(showCommentOptions(props.index, props.item));
						dispatch(replyingInActive(false));
					}}
				>
					<TouchableOpacity onPress={() => navigateToUserProfile()}>
						<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>
							{props.item.user.username}
						</Text>
					</TouchableOpacity>
					<Text style={[exStyles.infoDetailR16, { color: colors.darkText }]}>
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
							{moment.unix(props.item.time).local().startOf('s').toNow(true)}
						</Text>
						<View>
							<PostReactions
								reactiontype='comments'
								item={props.item}
								panPosition
								iconVisible={false}
							/>
						</View>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? 'rgba(0, 0, 0, 0.06)'
										: 'transparent'
								},
								{ marginLeft: 16 }
							]}
							onPress={() => dispatch(replyingActive(true, props.item.id))}
						>
							<Text style={[exStyles.infoLink14Med, styles.buttonsTextStyle]}>
								Reply
							</Text>
						</Pressable>
					</View>
					<Pressable
						style={styles.commentLike}
						onPress={() => setVisible(true)}
					>
						<Text
							style={[
								exStyles.descriptionSmallText,
								{ color: colors.secondaryText }
							]}
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

				{/* comment reply start */}
				{props.item.comment_reply_count > 0 ? (
					<Pressable
						style={{ marginTop: 8 }}
						onPress={() => {
							if (showReply) {
								dispatch(clearReplies());
								setShowReply(false);
							} else {
								dispatch(fetchReply(props.item.id));
								setShowReply(true);
							}
						}}
					>
						<Text style={[exStyles.infoLargeM16, { colors: colors.darkText }]}>
							{showReply
								? 'Hide replies'
								: `View ${ props.item.comment_reply_count } more replies...`}
						</Text>
					</Pressable>
				) : null}
				{showReply ? (
					<PostCommentReplies commentId={props.item.id} />
				) : (
					<FlatList
						data={state.tempReplies[props.item.id]}
						renderItem={({ item, index }) => (
							<ReplyItem commentId={props.item.id} item={item} index={index} />
						)}
					/>
				)}
			</View>
			{visible ? (
				<LikesDetailModal
					visible={visible}
					type='comment'
					data={props.item.id}
					onClose={() => setVisible(false)}
				/>
			) : null}
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
		color: colors.darkText,
		fontStyle: 'normal',
		fontSize: 16,
		fontWeight: '300',
		lineHeight: 24,
		letterSpacing: 0.4
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
	// repliesCountText: {
	// 	color: colors.primaryText,
	// 	fontStyle: 'normal',
	// 	fontSize: 16,
	// 	fontWeight: '700',
	// 	lineHeight: 24,
	// 	letterSpacing: 0.75
	// },

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

export default memo(CommentItem);
