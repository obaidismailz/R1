import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSelector } from 'react-redux';
import ReplyItem from './ReplyItem';

const PostCommentReplies = ({ ...props }) => {
	const state = useSelector(state => state.reply);

	return (
		<View style={styles.showReplyCommentViewandAvatarContainer}>
			<FlatList
				data={state.replies[props.commentId]}
				ListEmptyComponent={state.loading ? <ActivityIndicator /> : null}
				renderItem={({ item, index }) => (
					<ReplyItem commentId={props.commentId} item={item} index={index} />
				)}
			/>
		</View>
	);
};

export default PostCommentReplies;

const styles = StyleSheet.create({
	showReplyCommentViewandAvatarContainer: {
		marginTop: 14,
		flexDirection: 'row',
		alignItems: 'flex-start',
		width: '100%'
	}
});
