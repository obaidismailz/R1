import { put, takeLatest } from 'redux-saga/effects';
import * as types from '../../actions/actionsTypes';
import { getLiveWebinarCount } from '../../apis/LoopExpoApi';
import { fetchLiveWebinarsError, saveLiveWebinars } from '../../actions/expo/webinars';

const fetchLiveWebinarData = function* fetchLiveWebinarData() {
	try {
		const response = yield getLiveWebinarCount();
		if (response._metadata.status == 'SUCCESS') {
			yield put(saveLiveWebinars(response.records));
		} else {
			yield put(fetchLiveWebinarsError('error'));
		}
	} catch (e) {
		yield put(fetchLiveWebinarsError(e));
	}
};

const root = function* root() {
	yield takeLatest(types.WEBINARS.FETCHING_LIVE_WEBINARS, fetchLiveWebinarData);
};
export default root;
