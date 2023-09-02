import React, { memo, useEffect } from 'react';
import {
	View, FlatList, Text, StyleSheet
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Spinner from 'react-native-loading-spinner-overlay';
import { colors, exStyles } from '@styles';
import { useDispatch, useSelector } from 'react-redux';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { themes } from '../../constants/colors';
import { showConfirmationAlert } from '../../utils/info';
import I18n from '../../i18n';
import Post from '../WorkSpee/views/NewsFeed/Post';
import PostPlaceholder from '../WorkSpee/views/NewsFeed/PostPlaceholder';
import PostOptionModal from '../WorkSpee/views/NewsFeed/PostOptionModal';
import {
	clearData,
	deleteMyPost,
	fetchMyPosts,
	hideMyPostOption,
	showMyPostOption
} from '../../actions/social/myTimeline';
import { deletePost } from '../../actions/social/newsfeed';

const MyTimeLine = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const dispatch = useDispatch();
	const myPost = useSelector(state => state.myPosts);

	useEffect(() => {
		dispatch(fetchMyPosts());
		return () => {
			dispatch(clearData());
		};
	}, []);

	const onDeletePost = (id) => {
		showConfirmationAlert({
			title: I18n.t('Delete'),
			message: 'Are you sure you want to Delete this post',
			confirmationText: I18n.t('Delete'),
			dismissText: I18n.t('Cancel'),
			onPress: () => {
				dispatch(deleteMyPost(id));
				dispatch(deletePost(id));
				dispatch(hideMyPostOption());
			},
			onCancel: () => {}
		});
	};

	const onEditPost = (postItem) => {
		navigation.navigate('EditPostView', { postItem, myPost: true });
		dispatch(hideMyPostOption());
	};

	return (
		<>
			<FlatList
				initialNumToRender={2}
				data={myPost.posts}
				windowSize={9}
				ListEmptyComponent={
					myPost.loading ? (
						<>
							<PostPlaceholder />
							<PostPlaceholder />
						</>
					) : (
						<View style={styles.noPostContainerText}>
							<Text style={styles.noMorePosts}>No posts available</Text>
						</View>
					)
				}
				ListFooterComponent={(
					<>
						{myPost.posts.length > 0 ? (
							myPost.isPostEnd ? (
								<View style={styles.noPostContainerText}>
									<Text style={styles.noMorePosts}>
										No More Posts available
									</Text>
								</View>
							) : (
								<PostPlaceholder />
							)
						) : null}
					</>
				)}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item, index }) => (
					<Post
						item={item}
						index={index}
						onOptionPress={(index, item) => {
							dispatch(showMyPostOption(index, item));
						}}
					/>
				)}
				extraData={myPost.posts}
				onEndReached={() => dispatch(fetchMyPosts(myPost.postOffsetId))}
				onEndReachedThreshold={0.5}
			/>
			<PostOptionModal
				visible={myPost.postOptionVisibility}
				data={myPost.post}
				onClose={() => dispatch(hideMyPostOption())}
				onDeletePost={onDeletePost}
				onEditPost={onEditPost}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	noPostContainerText: {
		alignItems: 'center',
		paddingVertical: 32,
		backgroundColor: '#F7F7F7'
	},
	noMorePosts: {
		fontSize: RFValue(16),
		fontWeight: '500',
		color: colors.secondaryText
	}
});

export default withDimensions(withTheme(memo(MyTimeLine)));
