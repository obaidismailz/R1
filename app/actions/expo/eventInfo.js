import * as types from '../actionsTypes';

export function fetchEventInformation(instances) {
	return {
		type: types.EVENT.FETCHING_EVENT_INFO,
		instances
	};
}

export function saveEventInformation(eventData) {
	return {
		type: types.EVENT.SAVE_EVENT_INFO_SUCCESS,
		eventData
	};
}

export function saveMainImage(image) {
	return {
		type: types.EVENT.SAVE_MAIN_IMAGE,
		image
	};
}

export function fetchEventInformationError(err) {
	return {
		type: types.EVENT.FETCH_EVENT_INFO_ERROR,
		err
	};
}
