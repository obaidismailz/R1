import { COMMENTS } from '../../actions/actionsTypes';

const initialState = {
	loading: false,
	comments: [],
	commentId: null,
	isDeleting: false,
	errors: null,
	commentOptionVisibility: false,
	commentIndex: null,
	comment: '',
	replying: false,
	replyingCommentId: null,
	commentFieldText: ''
};

export default function comments(state = initialState, action) {
	switch (action.type) {
		case COMMENTS.FETCHING_COMMENTS:
			return {
				...state,
				loading: true
			};
		case COMMENTS.SAVE_COMMENTS_SUCCESS:
			return {
				...state,
				loading: false,
				comments: action.comments
			};
		case COMMENTS.FETCH_COMMENTS_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case COMMENTS.CLEAR_COMMENTS:
			return {
				...state,
				...initialState
			};
		case COMMENTS.REGISTER_NEW_COMMENT:
			return {
				...state,
				comments: [...state.comments, ...action.response]
			};
		case COMMENTS.DELETE_COMMENTS:
			return {
				...state,
				commentId: action.commentId,
				isDeleting: true
			};
		case COMMENTS.COMMENTS_REMOVED:
			return {
				...state,
				comments: state.comments.filter(
					comment => comment.id !== state.commentId
				),
				isDeleting: false
			};
		case COMMENTS.COMMENT_FIELD_TEXT: {
			return {
				...state,
				commentFieldText: action.text
			};
		}
		case COMMENTS.EDIT_COMMENTS:
			return {
				...state
			};
		case COMMENTS.COMMENTS_EDITED:
			const arr = [...state.comments];
			arr[state.commentIndex] = { ...arr[state.commentIndex] };
			arr[state.commentIndex].text = action.text;
			return {
				...state,
				comments: arr
			};
		case COMMENTS.SHOW_COMMENT_OPTIONS_MODEL:
			return {
				...state,
				commentIndex: action.commentIndex,
				comment: action.comment,
				commentOptionVisibility: true
			};
		case COMMENTS.HIDE_COMMENT_OPTIONS_MODEL:
			return {
				...state,
				commentOptionVisibility: false
			};
		case COMMENTS.REACTIONS_UPDATE:
			const save_comments = [...state.comments];
			let current_index = -1;
			save_comments.map((comment, index) => {
				if (comment.id == action.commentId) {
					current_index = index;
				}
			});
			save_comments[current_index] = { ...save_comments[current_index] };
			save_comments[current_index].reactions = action.reaction;
			return {
				...state,
				comments: save_comments
			};
		case COMMENTS.REPLYING_ACTIVE:
			return {
				...state,
				replying: action.value,
				replyingCommentId: action.replyCommentId
			};
		case COMMENTS.REPLYING_INACTIVE:
			return {
				...state,
				replying: action.value
			};
		default:
			return state;
	}
}
