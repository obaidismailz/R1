import { put, takeLatest } from 'redux-saga/effects';
import * as types from '../../actions/actionsTypes';
import {
	commentEdited,
	commentRemoved,
	fetchCommentsError,
	saveComments
} from '../../actions/social/comments';
import {
	replyEdited,
	replyRemoved,
	saveReplies
} from '../../actions/social/reply';
import {
	deleteComment,
	deleteReplies,
	editComment,
	editReply,
	getCommentReplies,
	getComments
} from '../../apis/LoopExpoApi';
import Navigation from '../../lib/Navigation';
import { logEvent } from '../../utils/log';

// For Comments

const handleFetchComments = function* handleFetchComments({ postId }) {
	try {
		const response = yield getComments(postId);
		if (response._metadata.outcome == 'SUCCESS') {
			yield put(saveComments(response.records));
		} else {
			yield put(fetchCommentsError('error'));
		}
	} catch (e) {
		yield put(fetchCommentsError(e));
	}
};

const handleDeleteComment = function* handleDeleteComment({ commentId }) {
	try {
		const response = yield deleteComment(commentId);
		if (response.status == 200) {
			yield put(commentRemoved());
		}
	} catch (e) {
		logEvent(e);
	}
};

const handleEditComment = function* handleEditComment({ params }) {
	try {
		editComment(params);
		yield put(commentEdited(params.text));
	} catch (e) {
		logEvent(e);
	}
};

// For Replies

const handleFetchReplies = function* handleFetchReplies({ commentId }) {
	try {
		const response = yield getCommentReplies(commentId);
		if (response._metadata.outcome == 'SUCCESS') {
			yield put(saveReplies(response.records));
		} else {
			yield put(fetchRepliesError('error'));
		}
	} catch (e) {
		yield put(fetchRepliesError(e));
	}
};

const handleDeleteReply = function* handleDeleteReply({ commentId, replyId }) {
	try {
		const response = yield deleteReplies(replyId);
		if (response.api_status == 200) {
			yield put(replyRemoved(commentId, replyId));
		}
	} catch (e) {
		logEvent(e);
	}
};

const handleEditReply = function* handleEditReply({ params, replyText }) {
	try {
		editReply(params);
		yield put(replyEdited(replyText));
	} catch (e) {
		logEvent(e);
	}
};

const root = function* root() {
	yield takeLatest(types.COMMENTS.FETCHING_COMMENTS, handleFetchComments);
	yield takeLatest(types.COMMENTS.DELETE_COMMENTS, handleDeleteComment);
	yield takeLatest(types.COMMENTS.EDIT_COMMENTS, handleEditComment);
	// For replies
	yield takeLatest(types.REPLY.FETCHING_REPLY, handleFetchReplies);
	yield takeLatest(types.REPLY.DELETE_REPLY, handleDeleteReply);
	yield takeLatest(types.REPLY.EDIT_REPLY, handleEditReply);
};
export default root;
