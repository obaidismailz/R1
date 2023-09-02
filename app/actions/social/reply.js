import * as types from '../actionsTypes';

export function fetchReply(commentId) {
	return {
		type: types.REPLY.FETCHING_REPLY,
		commentId
	};
}

export function saveReplies(replies) {
	return {
		type: types.REPLY.SAVE_REPLY_SUCCESS,
		replies
	};
}

export function fetchRepliesError(err) {
	return {
		type: types.REPLY.FETCH_REPLY_ERROR,
		err
	};
}

export function isReplying() {
	return {
		type: types.REPLY.IS_REPLYING
	};
}

export function closeReplying() {
	return {
		type: types.REPLY.CLOSE_REPLYING
	};
}

export function registerNewReply(response, comment) {
	return {
		type: types.REPLY.REGISTER_NEW_REPLY,
		response,
		comment
	};
}

export function clearReplies() {
	return {
		type: types.REPLY.CLEAR_REPLY
	};
}

export function deleteReply(commentId, replyId) {
	return {
		type: types.REPLY.DELETE_REPLY,
		commentId,
		replyId
	};
}

export function replyRemoved(commentId, replyId) {
	return {
		type: types.REPLY.REPLY_REMOVED,
		commentId,
		replyId
	};
}

export function editReplyValues(replyId, replyText, replyCommentId) {
	return {
		type: types.REPLY.EDIT_REPLY_VALUES,
		replyId,
		replyText,
		replyCommentId
	};
}

export function editReply(params, replyText) {
	return {
		type: types.REPLY.EDIT_REPLY,
		params,
		replyText
	};
}
export function replyEdited(replyText) {
	return {
		type: types.REPLY.REPLY_EDITED,
		replyText
	};
}

export function replyReactionUpdate(replyId, commentId, reaction) {
	return {
		type: types.REPLY.REACTIONS_UPDATE,
		replyId,
		commentId,
		reaction
	};
}

export function showReplyOptions(replyIndex, reply, commentId) {
	return {
		type: types.REPLY.SHOW_REPLY_OPTIONS_MODEL,
		replyIndex,
		reply,
		commentId
	};
}
export function hideReplyOptions() {
	return {
		type: types.REPLY.HIDE_REPLY_OPTIONS_MODEL
	};
}
