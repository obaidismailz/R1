import React, { memo } from 'react';
import { View, Share } from 'react-native';
import { useDispatch } from 'react-redux';
import { withDimensions } from '../../../../dimensions';
import { themes } from '../../../../constants/colors';
import { withTheme } from '../../../../theme';
import PostCardHeader from '../../components/PostCard/PostHeader/PostCardHeader';
import PostText from '../../components/PostCard/PostBody/PostText';
import {
	PostContentImage,
	PostContentMap,
	PostContentFile
} from '../../components/PostCard/PostBody/PostContent';
import PostLikeCommentShareButton from '../../components/PostCard/PostFooter/PostLikeCommentShareButtons';
import PostPolls from '../../components/PostCard/PostBody/PostPolll';
import PostAudio from '../../components/PostCard/PostBody/PostAudio';
import PostVideo from '../../components/PostCard/PostBody/PostVideo';
import { showPostOption } from '../../../../actions/social/newsfeed';
import PostAlbum from '../../components/PostCard/PostBody/PostAlbum';

const Post = ({ ...props }) => {
	const { theme } = props;
	const dispatch = useDispatch();

	const onShare = async() => {
		try {
			const result = await Share.share({
				message: props.item.shareURL
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

	const renderPostContent = (item, index) => {
		if (item.postMap !== '') {
			return <PostContentMap postMap={item.postMap} />;
		}
		if (item.poll.length > 0) {
			return (
				<PostPolls
					pollData={item.poll}
					pollVote={item.votes}
					pollLastDate={item.poll_last_date}
				/>
			);
		}
		if (item.postFile.media_type === 'mp4') {
			return <PostVideo videoUrl={item.postFile.url} />;
		}
		if (item.album.length > 0) {
			return <PostAlbum albumData={item.album} />;
		} else if (
			item.postFile.media_type === 'mp3'
			|| item.postFile.media_type === 'wav'
		) {
			return <PostAudio item={item} />;
		} else if (
			item.postFile.media_type === 'jpg'
			|| item.postFile.media_type === 'gif'
			|| item.postFile.media_type === 'png'
			|| item.postFile.media_type === 'jpeg'
		) {
			return <PostContentImage item={item} showFullPostView={() => {}} />;
		} else if (item.postFile.media_type === 'pdf') {
			return <PostContentFile item={item} showFullPostView={() => {}} />;
		} else {
			return <View />;
		}
	};

	return (
		<>
			<View style={{ marginTop: 16 }}>
				<PostCardHeader
					item={props.item}
					onPress={() => props.onOptionPress(props.index, props.item)}
				/>
				<PostText
					postText={props.item.postText}
					mentions={props.item.mentions}
				/>
				{renderPostContent(props.item, props.postIndex)}
				<PostLikeCommentShareButton
					item={props.item}
					onClickShare={() => onShare()}
				/>
			</View>
		</>
	);
};

export default withDimensions(withTheme(memo(Post)));
