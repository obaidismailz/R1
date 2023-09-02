import { put, takeLatest } from 'redux-saga/effects';
import * as types from '../../actions/actionsTypes';
import {
	fetchAttendeesError,
	fetchSuggestedAttendeesError,
	saveAttendees,
	saveSuggestedAttendees
} from '../../actions/social/attendees';
import { getAttendeesList } from '../../apis/LoopExpoApi';
import { logEvent } from '../../utils/log';

const handleFetchAttendees = function* handleFetchAttendees() {
	try {
		const response = yield getAttendeesList();
		if (response._metadata.status === 'SUCCESS') {
			yield put(saveAttendees(response.records));
		} else if (response._metadata.status === 'ERROR') {
			yield put(fetchAttendeesError(response._metadata.message));
		}
	} catch (e) {
		yield put(fetchAttendeesError(e));
	}
};

const handleFetchSuggestedAttendees = function* handleFetchSuggestedAttendees({
	suggested
}) {
	try {
		const response = yield getAttendeesList(suggested);
		if (response._metadata.status === 'SUCCESS') {
			yield put(saveSuggestedAttendees(response.records));
		} else if (response._metadata.status === 'ERROR') {
			yield put(fetchSuggestedAttendeesError(response._metadata.message));
		}
	} catch (e) {
		yield put(fetchSuggestedAttendeesError(e));
	}
};

const root = function* root() {
	yield takeLatest(types.ATTENDEES.FETCHING_ATTENDEES, handleFetchAttendees);
	yield takeLatest(
		types.SUGGESTEDATTENDEES.FETCHING_SUGGESTEDATTENDEES,
		handleFetchSuggestedAttendees
	);
};
export default root;
