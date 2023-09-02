import { WEBINARS } from '../../actions/actionsTypes';

const initialState = {
	loading: false,
	liveWebinars: [],
	errors: null
};

export default function webinars(state = initialState, action) {
	switch (action.type) {
		case WEBINARS.FETCHING_LIVE_WEBINARS:
			return {
				...state,
				loading: true
			};
		case WEBINARS.SAVE_LIVE_WEBINARS_SUCCESS:
			return {
				...state,
				loading: false,
				liveWebinars: action.data
			};
		case WEBINARS.FETCH_EVENT_INFO_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case WEBINARS.CLEAR_STATES:
			return {
				...state,
				...initialState
			};
		default:
			return state;
	}
}
