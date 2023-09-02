import update from 'react-addons-update';
import { REPLY } from '../../actions/actionsTypes';

const initialState = {
	loading: false,
	commentId: null,
	isReplying: false,
	replies: [],
	tempReplies: [],
	replyId: null,
	isDeleting: false,
	errors: null,
	replyOptionVisibility: false,
	replyIndex: null,
	reply: '',
	editReplyId: null,
	editingReply: false,
	replyCommentId: null
};

export default function reply(state = initialState, action) {
	switch (action.type) {
		case REPLY.FETCHING_REPLY:
			return {
				...state,
				commentId: action.commentId,
				loading: true
			};
		case REPLY.SAVE_REPLY_SUCCESS:
			const res = { ...state.replies };
			res[state.commentId] = action.replies;
			return {
				...state,
				loading: false,
				replies: res
			};
		case REPLY.FETCH_REPLY_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case REPLY.CLEAR_REPLY:
			return {
				...state,
				...initialState
			};
		case REPLY.IS_REPLYING:
			return {
				...state,
				isReplying: true
			};
		case REPLY.CLOSE_REPLYING:
			return {
				...state,
				isReplying: false
			};
		case REPLY.REGISTER_NEW_REPLY:
			const response = { ...state.tempReplies };
			response[action.comment] = action.response;
			return {
				...state,
				tempReplies: response,
				isReplying: false
			};
		case REPLY.DELETE_REPLY:
			return {
				...state,
				isDeleting: true
			};
		case REPLY.REPLY_REMOVED:
			return {
				...state,
				replies: {
					...state.replies[action.commentId].filter(
						reply => reply.id !== action.replyId
					)
				},
				isDeleting: false
			};
		case REPLY.EDIT_REPLY_VALUES: {
			return {
				...state,
				editReplyId: action.replyId,
				replyCommentId: action.replyCommentId,
				editingReply: true
			};
		}
		case REPLY.REPLY_EDITED:
			const replyArray = { ...state.replies };
			let current_index = -1;
			replyArray[state.replyCommentId].map((reply, index) => {
				if (reply.id == state.editReplyId) {
					current_index = index;
				}
			});
			return {
				...state,
				replies: update(state.replies, {
					[state.replyCommentId]: {
						[current_index]: {
							text: { $set: action.replyText }
						}
					}
				}),
				editingReply: false
			};
		case REPLY.REACTIONS_UPDATE:
			const reply_array = { ...state.replies };
			console.error(reply_array[action.commentId]);
			let _index = -1;
			reply_array[action.commentId].map((reply, index) => {
				if (reply.id == action.replyId) {
					console.error('true');
					_index = index;
				}
			});
			return {
				...state,
				replies: update(state.replies, {
					[action.commentId]: {
						[_index]: {
							reactions: { $set: action.reaction }
						}
					}
				})
			};
		case REPLY.SHOW_REPLY_OPTIONS_MODEL:
			return {
				...state,
				replyIndex: action.replyIndex,
				reply: action.reply,
				replyOptionVisibility: true
			};
		case REPLY.HIDE_REPLY_OPTIONS_MODEL:
			return {
				...state,
				replyOptionVisibility: false
			};
		default:
			return state;
	}
}
