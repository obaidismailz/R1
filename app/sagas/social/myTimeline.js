import { put, takeLatest } from 'redux-saga/effects';
import { ShareData } from '@utils';
import * as types from '../../actions/actionsTypes';
import {
	fetchMyPostsError,
	myPostEdited,
	myPostRemoved,
	myPostsEnded,
	saveMyPosts
} from '../../actions/social/myTimeline';
import {
	deletePost,
	editPost,
	getUserSocialPosts
} from '../../apis/LoopExpoApi';
import Navigation from '../../lib/Navigation';
import { logEvent } from '../../utils/log';

const handleFetch = function* handleFetch({ postOffsetId }) {
	try {
		const response = yield getUserSocialPosts(
			15,
			postOffsetId,
			'',
			ShareData.getInstance().user_id
		);
		if (response._metadata.outcome === 'SUCCESS') {
			if (response.records.length == 0) {
				yield put(myPostsEnded());
			} else {
				const dataLength = parseInt(response.records.length) - 1;
				const lastPostid = response.records[dataLength].id;
				yield put(saveMyPosts(response.records, lastPostid));
			}
		} else if (response._metadata.outcome === 'ERROR') {
			yield put(fetchMyPostsError(response._metadata.message));
		}
	} catch (e) {
		yield put(fetchMyPostsError(e));
	}
};

const handleDelete = function* handleDelete({ postId }) {
	try {
		const response = yield deletePost(postId);
		if (response.status == 200) {
			yield put(myPostRemoved());
		}
	} catch (e) {
		logEvent(e);
	}
};

const handleEdit = function* handleEdit({ params }) {
	try {
		const response = yield editPost(params);
		if (response.status == 200) {
			Navigation.back();
			yield put(myPostEdited(params.text, params.post_id));
		}
	} catch (e) {
		logEvent(e);
	}
};

const root = function* root() {
	yield takeLatest(types.MYPOSTS.FETCHING_MY_POST, handleFetch);
	yield takeLatest(types.MYPOSTS.DELETE_MY_POST, handleDelete);
	yield takeLatest(types.MYPOSTS.EDIT_MY_POST, handleEdit);
};
export default root;
