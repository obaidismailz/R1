import * as types from '../actionsTypes';

export function fetchAttendees() {
	return {
		type: types.ATTENDEES.FETCHING_ATTENDEES
	};
}

export function fetchSuggestedAttendees(suggested) {
	return {
		type: types.SUGGESTEDATTENDEES.FETCHING_SUGGESTEDATTENDEES,
		suggested
	};
}

export function saveAttendees(attendees) {
	return {
		type: types.ATTENDEES.SAVE_ATTENDEES_SUCCESS,
		attendees
	};
}

export function saveSuggestedAttendees(suggestedAttendees) {
	return {
		type: types.SUGGESTEDATTENDEES.SAVE_SUGGESTEDATTENDEES_SUCCESS,
		suggestedAttendees
	};
}

export function fetchAttendeesError(err) {
	return {
		type: types.ATTENDEES.FETCH_ATTENDEES_ERROR,
		err
	};
}
export function fetchSuggestedAttendeesError(err) {
	return {
		type: types.SUGGESTEDATTENDEES.FETCH_SUGGESTEDATTENDEES_ERROR,
		err
	};
}

export function bookMarkedAttendees(att) {
	return {
		type: types.ATTENDEES.BOOKMARKED_ATTENDEES,
		att
	};
}
