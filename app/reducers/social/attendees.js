import { ATTENDEES, SUGGESTEDATTENDEES } from '../../actions/actionsTypes';

const initialState = {
	loading: false,
	attendees: [],
	suggestedAttendees: [],
	bookmarked: [],
	errors: null
};

export default function attendees(state = initialState, action) {
	switch (action.type) {
		case ATTENDEES.FETCHING_ATTENDEES:
			return {
				...state,
				loading: true
			};
		case SUGGESTEDATTENDEES.FETCHING_SUGGESTEDATTENDEES:
			return {
				...state,
				loading: true
			};
		case ATTENDEES.SAVE_ATTENDEES_SUCCESS:
			return {
				...state,
				loading: false,
				attendees: action.attendees
			};
		case SUGGESTEDATTENDEES.SAVE_SUGGESTEDATTENDEES_SUCCESS:
			return {
				...state,
				loading: false,
				suggestedAttendees: action.suggestedAttendees
			};
		case ATTENDEES.FETCH_ATTENDEES_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case SUGGESTEDATTENDEES.FETCH_SUGGESTEDATTENDEES_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case ATTENDEES.BOOKMARKED_ATTENDEES:
			return {
				...state,
				bookmarked: action.att.filter(data => data.bookmark != '')
			};
		default:
			return state;
	}
}
