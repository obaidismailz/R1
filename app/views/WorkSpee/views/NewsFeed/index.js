import React, { memo, useEffect, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import styles from './styles';
import { withDimensions } from '../../../../dimensions';
import { withTheme } from '../../../../theme';
import { themes } from '../../../../constants/colors';
import GreetingMessage from './ListHeader/GreetingMessage';
import CreatePostContainer from './ListHeader/CreatePostContainer';
import PostPlaceholder from './PostPlaceholder';
import Post from './Post';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import PostOptionModal from './PostOptionModal';
import { showConfirmationAlert } from '../../../../utils/info';
import I18n from '../../../../i18n';
import Navigation from '../../../../lib/Navigation';
import {
	clearPosts,
	deletePost,
	fetchPosts,
	hidePostOption,
	postReactionUpdate,
	showPostOption,
	updateLatestPost
} from '../../../../actions/social/newsfeed';
import { deleteMyPost } from '../../../../actions/social/myTimeline';
import { SOCIAL_SOCKET } from '../../../../utils/Constants';

const qs = require('qs');

const TimeLineScreen = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;
	const [ref, isRef] = useState(false);
	const socket = io(SOCIAL_SOCKET, {
		transports: ['websocket'],
		rejectUnauthorized: false,
		autoConnect: true
	});
	const dispatch = useDispatch();
	const state = useSelector(state => state.posts);

	useEffect(() => {
		socket.on('new_post_added', data => {
			dispatch(updateLatestPost(data.post_data));
		});

		socket.on('new_reaction_added', data => {
			dispatch(postReactionUpdate(data.post_id, data.reactions));
		});

		if (state.posts.length == 0) {
			dispatch(fetchPosts());
		}
		return () => {
			socket.removeAllListeners('new_post_added');
			socket.removeAllListeners('new_reaction_added');
		};
	}, []);

	const onDeletePost = id => {
		showConfirmationAlert({
			title: I18n.t('Delete'),
			message: 'Are you sure you want to Delete this post',
			confirmationText: I18n.t('Delete'),
			dismissText: I18n.t('Cancel'),
			onPress: () => {
				dispatch(deletePost(id));
				dispatch(deleteMyPost(id));
				dispatch(hidePostOption());
			},
			onCancel: () => {}
		});
	};

	const onEditPost = postItem => {
		Navigation.navigate('EditPostView', { postItem, myPost: false });
		dispatch(hidePostOption());
	};

	return (
		<View>
			<FlatList
				initialNumToRender={6}
				data={state.posts}
				windowSize={21}
				contentContainerStyle={styles.postContainer}
				ListHeaderComponent={
					<>
						<CreatePostContainer />
						<GreetingMessage />
					</>
				}
				ListEmptyComponent={
					state.loading ? (
						<PostPlaceholder />
					) : (
						<View style={styles.emptyList}>
							<Text style={styles.emptyText}>No posts available</Text>
						</View>
					)
				}
				ListFooterComponent={
					state.posts.length == 0 ? null : state.isPostEnd ? (
						<View style={styles.noPostContainerText}>
							<Text style={styles.noMorePosts}>No More Posts</Text>
						</View>
					) : (
						<>
							<PostPlaceholder />
							<ActivityIndicator />
						</>
					)
				}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => (
					<Post item={item} index={index} onOptionPress={(index, item) => dispatch(showPostOption(index, item))} />
				)}
				extraData={state.posts}
				onEndReached={() => dispatch(fetchPosts(state.postOffsetId))}
				onEndReachedThreshold={0.5}
				onRefresh={() => {
					dispatch(clearPosts());
					dispatch(fetchPosts());
				}}
				refreshing={ref}
			/>
			<Spinner
				cancelable={false}
				animation='fade'
				visible={state.isDeleting}
				textContent='Deleting...'
				textStyle={styles.spinnerTextStyle}
			/>
			<PostOptionModal
				visible={state.postOptionVisibility}
				data={state.post}
				onClose={() => dispatch(hidePostOption())}
				onDeletePost={onDeletePost}
				onEditPost={onEditPost}
			/>
		</View>
	);
};

export default withDimensions(withTheme(memo(TimeLineScreen)));
