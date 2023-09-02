import React, { useState, useEffect, memo } from 'react';
import { View, TextInput, ScrollView } from 'react-native';
import { ShareData } from '@utils';
import { useDispatch, useSelector } from 'react-redux';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import styles from './styles';
// import {
// 	CancelModalButton,
// 	CustomHeaderButtons,
// 	Item
// } from '../../../../containers/HeaderButton';
import * as HeaderButton from '../../../../containers/HeaderButton';

import SafeAreaView from '../../../../containers/SafeAreaView';
import PostCardHeader from '../../components/PostCard/PostHeader/PostCardHeader';
import { PostContentImage, PostContentMap, PostContentFile } from '../../components/PostCard/PostBody/PostContent';

import { withTheme } from '../../../../theme';
import { withDimensions } from '../../../../dimensions';
import { themes } from '../../../../constants/colors';
import StatusBar from '../../../../containers/StatusBar';
import PostAudio from '../../components/PostCard/PostBody/PostAudio';
import PostVideo from '../../components/PostCard/PostBody/PostVideo';
import PostPolls from '../../components/PostCard/PostBody/PostPolll';
import { editPost } from '../../../../actions/social/newsfeed';
import PostAlbum from '../../components/PostCard/PostBody/PostAlbum';
import { editMyPost } from '../../../../actions/social/myTimeline';

const qs = require('qs');

const EditPostView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const [item, setItem] = useState(route.params.postItem);
	const [postText, setPostText] = useState('');
	const dispatch = useDispatch();
	const state = useSelector(state => state.posts);

	const setHeader = () => {
		navigation.setOptions({
			title: 'Edit Post',
			headerLeft: isMasterDetail
				? undefined
				: () => <HeaderButton.CloseModal navigation={navigation} testID='settings-view-close' onPress={() => close()} />,
			headerRight: () => <HeaderButton.Item title='Save' onPress={() => onSavePost()} />
		});
	};

	const close = () => {
		navigation.goBack();
	};

	useEffect(() => {
		setPostText(item.postText.replace(/(<([^>]+)>)/gi, ''));
	}, []);

	const onSavePost = async () => {
		const params = {
			process: 'React_Edit_Post',
			post_id: item.post_id,
			text: postText,
			user_id: ShareData.getInstance().user_id
		};
		route.params.myPost ? dispatch(editMyPost(params)) : dispatch(editPost(params));
	};

	const renderPostContent = item => {
		if (item.postMap !== '') {
			return <PostContentMap postMap={item.postMap} />;
		}
		if (item.poll.length > 0) {
			return <PostPolls pollData={item.poll} pollVote={item.votes} pollLastDate={item.poll_last_date} />;
		}
		if (item.album.length > 0) {
			return <PostAlbum albumData={item.album} />;
		}
		if (item.postFile.media_type === 'mp4') {
			return <PostVideo item={item} />;
		} else if (item.postFile.media_type === 'mp3' || item.postFile.media_type === 'wav') {
			return <PostAudio item={item} />;
		} else if (
			item.postFile.media_type === 'jpg' ||
			item.postFile.media_type === 'gif' ||
			item.postFile.media_type === 'png' ||
			item.postFile.media_type === 'jpeg'
		) {
			return <PostContentImage item={item} showFullPostView={() => {}} />;
		} else if (item.postFile.media_type === 'pdf') {
			return <PostContentFile item={item} showFullPostView={() => {}} />;
		} else {
			return <View />;
		}
	};

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].backgroundColor }}>
			{setHeader()}
			<ScrollView>
				<View>
					{state.loading ? <ActivityIndicator /> : null}
					<PostCardHeader item={item} bottomOption={false} bottomSheetOnClick={() => {}} />
					<View>
						<TextInput
							style={styles.inputfieldStyle}
							placeholder='Say Somthing about this post...'
							placeholderTextColor='#707070'
							value={postText}
							autoFocus
							multiline
							onChangeText={setPostText}
						/>
					</View>
					<View style={{ marginTop: 10 }}>{renderPostContent(item)}</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default withDimensions(withTheme(memo(EditPostView)));
