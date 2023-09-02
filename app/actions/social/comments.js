import * as types from '../actionsTypes';

export function fetchComments(postId) {
	return {
		type: types.COMMENTS.FETCHING_COMMENTS,
		postId
	};
}

export function saveComments(comments) {
	return {
		type: types.COMMENTS.SAVE_COMMENTS_SUCCESS,
		comments
	};
}

export function fetchCommentsError(err) {
	return {
		type: types.COMMENTS.FETCH_COMMENTS_ERROR,
		err
	};
}

export function registerNewComment(response) {
	return {
		type: types.COMMENTS.REGISTER_NEW_COMMENT,
		response
	};
}

export function clearComments() {
	return {
		type: types.COMMENTS.CLEAR_COMMENTS
	};
}

export function deleteComment(commentId) {
	return {
		type: types.COMMENTS.DELETE_COMMENTS,
		commentId
	};
}

export function commentRemoved() {
	return {
		type: types.COMMENTS.COMMENTS_REMOVED
	};
}

export function setCommentFieldText(text) {
	return {
		type: types.COMMENTS.COMMENT_FIELD_TEXT,
		text
	};
}

export function editedComment(params) {
	return {
		type: types.COMMENTS.EDIT_COMMENTS,
		params
	};
}
export function commentEdited(text) {
	return {
		type: types.COMMENTS.COMMENTS_EDITED,
		text
	};
}

export function showCommentOptions(commentIndex, comment) {
	return {
		type: types.COMMENTS.SHOW_COMMENT_OPTIONS_MODEL,
		commentIndex,
		comment
	};
}
export function hideCommentOptions() {
	return {
		type: types.COMMENTS.HIDE_COMMENT_OPTIONS_MODEL
	};
}

export function commentReactionUpdate(commentId, reaction) {
	return {
		type: types.COMMENTS.REACTIONS_UPDATE,
		commentId,
		reaction
	};
}

export function replyingActive(value, replyCommentId) {
	return {
		type: types.COMMENTS.REPLYING_ACTIVE,
		value,
		replyCommentId
	};
}

export function replyingInActive(value) {
	return {
		type: types.COMMENTS.REPLYING_INACTIVE,
		value
	};
}
