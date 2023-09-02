import * as types from '../actionsTypes';

export function fetchPosts(postOffsetId) {
	return {
		type: types.POSTS.FETCHING_POST,
		postOffsetId
	};
}

export function savePosts(posts, lastPostId) {
	return {
		type: types.POSTS.SAVE_POST_SUCCESS,
		posts,
		lastPostId
	};
}

export function fetchPostsError(err) {
	return {
		type: types.POSTS.FETCH_POST_ERROR,
		err
	};
}

export function clearPosts() {
	return {
		type: types.POSTS.CLEAR_POSTS
	};
}

export function deletePost(postId) {
	return {
		type: types.POSTS.DELETE_POST,
		postId
	};
}

export function postRemoved() {
	return {
		type: types.POSTS.POST_REMOVED
	};
}
export function updateCommentCount(postId, count) {
	return {
		type: types.POSTS.UPDATE_COMMENT_COUNT,
		postId,
		count
	};
}

export function editPost(params) {
	return {
		type: types.POSTS.EDIT_POST,
		params
	};
}
export function postEdited(text, postid) {
	return {
		type: types.POSTS.POST_EDITED,
		text,
		postid
	};
}

export function showPostOption(postIndex, post) {
	return {
		type: types.POSTS.SHOW_POST_OPTIONS_MODEL,
		postIndex,
		post
	};
}

export function hidePostOption() {
	return {
		type: types.POSTS.HIDE_POST_OPTIONS_MODEL
	};
}

export function postsEnded() {
	return {
		type: types.POSTS.POSTS_ENDED
	};
}

export function updateLatestPost(post) {
	return {
		type: types.POSTS.GET_LATEST_POST,
		post
	};
}

export function postReactionUpdate(postId, reaction) {
	return {
		type: types.POSTS.REACTIONS_UPDATE,
		postId,
		reaction
	};
}
