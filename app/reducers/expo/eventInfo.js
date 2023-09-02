import { EVENT } from '../../actions/actionsTypes';

const initialState = {
	loading: false,
	eventData: {
		exhibition: '',
		sponsors: [],
		speakers: [],
		contact: '',
		videos: [],
		images: [],
		content: [],
		schedules: [],
		days: ''
	},
	mainImage: {
		id: 1,
		booth_id: 0,
		title: 'Image 01',
		description: '',
		file: '',
		file_extension: 'jpg',
		mime_type: 'image/jpeg',
		slug: 'image_01',
		status: 1,
		admin_user_id: 1,
		deleted_at: null,
		created_at: '',
		updated_at: ''
	},
	errors: null
};

export default function eventInfo(state = initialState, action) {
	switch (action.type) {
		case EVENT.FETCHING_EVENT_INFO:
			return {
				...state,
				loading: true
			};
		case EVENT.SAVE_EVENT_INFO_SUCCESS:
			return {
				...state,
				loading: false,
				eventData: action.eventData
			};
		case EVENT.SAVE_MAIN_IMAGE:
			const image = { ...state.mainImage };
			image.file = action.image;

			const data = { ...state.eventData };
			data.images = [image, ...data.images];

			return {
				...state,
				eventData: data
			};
		case EVENT.FETCH_EVENT_INFO_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		default:
			return state;
	}
}
