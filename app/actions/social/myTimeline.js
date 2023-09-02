import * as types from '../actionsTypes';

export function fetchMyPosts(postOffsetId) {
	return {
		type: types.MYPOSTS.FETCHING_MY_POST,
		postOffsetId
	};
}

export function saveMyPosts(posts, lastPostId) {
	return {
		type: types.MYPOSTS.SAVE_MY_POST_SUCCESS,
		posts,
		lastPostId
	};
}

export function fetchMyPostsError(err) {
	return {
		type: types.MYPOSTS.FETCH_MY_POST_ERROR,
		err
	};
}

export function clearData() {
	return {
		type: types.MYPOSTS.CLEAR_STATES
	};
}

export function deleteMyPost(postId) {
	return {
		type: types.MYPOSTS.DELETE_MY_POST,
		postId
	};
}

export function myPostRemoved() {
	return {
		type: types.MYPOSTS.MY_POST_REMOVED
	};
}

export function editMyPost(params) {
	return {
		type: types.MYPOSTS.EDIT_MY_POST,
		params
	};
}
export function myPostEdited(text, postid) {
	return {
		type: types.MYPOSTS.MY_POST_EDITED,
		text,
		postid
	};
}

export function updateMyCommentCount(postId, count) {
	return {
		type: types.MYPOSTS.UPDATE_COMMENT_COUNT,
		postId,
		count
	};
}

export function showMyPostOption(postIndex, post) {
	return {
		type: types.MYPOSTS.SHOW_MY_POST_OPTIONS_MODEL,
		postIndex,
		post
	};
}

export function hideMyPostOption() {
	return {
		type: types.MYPOSTS.HIDE_MY_POST_OPTIONS_MODEL
	};
}

export function myPostsEnded() {
	return {
		type: types.MYPOSTS.MY_POST_ENDED
	};
}
