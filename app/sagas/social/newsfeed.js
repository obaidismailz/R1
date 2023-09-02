import { put, takeLatest } from 'redux-saga/effects';
import * as types from '../../actions/actionsTypes';
import {
	fetchPostsError,
	postEdited,
	postRemoved,
	postsEnded,
	savePosts
} from '../../actions/social/newsfeed';
import { deletePost, editPost, getTimeLinePosts } from '../../apis/LoopExpoApi';
import Navigation from '../../lib/Navigation';
import { logEvent } from '../../utils/log';

const handleFetchPosts = function* handleFetchPosts({ postOffsetId }) {
	try {
		const response = yield getTimeLinePosts(15, postOffsetId);
		if (response._metadata.outcome === 'SUCCESS') {
			if (response.records.length == 0) {
				yield put(fetchPostsError(response._metadata.message));
				yield put(postsEnded());
			} else {
				const dataLength = parseInt(response.records.length) - 1;
				const lastPostid = response.records[dataLength].id;
				yield put(savePosts(response.records, lastPostid));
			}
		} else if (response._metadata.outcome === 'ERROR') {
			yield put(fetchPostsError(response._metadata.message));
		}
	} catch (e) {
		yield put(fetchPostsError(e));
	}
};

const handleDeletePost = function* handleDeletePost({ postId }) {
	try {
		const response = yield deletePost(postId);
		if (response.status == 200) {
			yield put(postRemoved());
		}
	} catch (e) {
		logEvent(e);
	}
};

const handleEditPost = function* handleEditPost({ params }) {
	try {
		const response = yield editPost(params);
		if (response.status == 200) {
			Navigation.back();
			yield put(postEdited(params.text, params.post_id));
		}
	} catch (e) {
		logEvent(e);
	}
};

const root = function* root() {
	yield takeLatest(types.POSTS.FETCHING_POST, handleFetchPosts);
	yield takeLatest(types.POSTS.DELETE_POST, handleDeletePost);
	yield takeLatest(types.POSTS.EDIT_POST, handleEditPost);
};
export default root;
