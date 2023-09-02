import * as types from '../actionsTypes';

export function fetchLiveWebinars() {
	return {
		type: types.WEBINARS.FETCHING_LIVE_WEBINARS
	};
}

export function saveLiveWebinars(data) {
	return {
		type: types.WEBINARS.SAVE_LIVE_WEBINARS_SUCCESS,
		data
	};
}

export function fetchLiveWebinarsError(err) {
	return {
		type: types.WEBINARS.FETCH_LIVE_WEBINARS_ERROR,
		err
	};
}

export function clearData() {
	return {
		type: types.WEBINARS.CLEAR_STATES
	};
}
