import React, { memo } from 'react';
import { FlatList } from 'react-native';
import { withDimensions } from '../../../../../dimensions';
import { withTheme } from '../../../../../theme';
import CommentItem from './CommentItem';

const PostCommentSection = ({ ...props }) => {
	const { theme } = props;
	return (
		<FlatList
			data={props.commentData}
			renderItem={({ item, index }) => (
				<CommentItem item={item} index={index} />
			)}
		/>
	);
};

export default withDimensions(withTheme(memo(PostCommentSection)));
