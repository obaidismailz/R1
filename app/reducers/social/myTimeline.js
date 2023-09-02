import { MYPOSTS } from '../../actions/actionsTypes';

const initialState = {
	loading: false,
	postOffsetId: null,
	posts: [],
	postId: null,
	isDeleting: false,
	errors: null,
	postOptionVisibility: false,
	postIndex: null,
	post: '',
	isPostEnd: false
};

export default function myPosts(state = initialState, action) {
	switch (action.type) {
		case MYPOSTS.FETCHING_MY_POST:
			return {
				...state,
				loading: true
			};
		case MYPOSTS.SAVE_MY_POST_SUCCESS:
			return {
				...state,
				loading: false,
				postOffsetId: action.lastPostId,
				posts: [...state.posts, ...action.posts]
			};
		case MYPOSTS.FETCH_MY_POST_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case MYPOSTS.CLEAR_STATES:
			return {
				...state,
				...initialState
			};
		case MYPOSTS.DELETE_MY_POST:
			return {
				...state,
				postId: action.postId,
				isDeleting: true
			};
		case MYPOSTS.MY_POST_REMOVED:
			return {
				...state,
				posts: state.posts.filter(post => post.post_id !== state.postId),
				isDeleting: false
			};
		case MYPOSTS.EDIT_MY_POST:
			return {
				...state,
				loading: true
			};
		case MYPOSTS.MY_POST_EDITED:
			const arr = [...state.posts];
			arr[state.postIndex] = { ...arr[state.postIndex] };
			arr[state.postIndex].postText = action.text;
			return {
				...state,
				loading: false,
				posts: arr
			};
		case MYPOSTS.UPDATE_COMMENT_COUNT:
			const postArray = [...state.posts];
			let current_index = -1;
			postArray.map((post, index) => {
				if (post.post_id == action.postId) {
					current_index = index;
				}
			});
			postArray[current_index] = { ...postArray[current_index] };
			postArray[current_index].comment_count = action.count;
			return {
				...state,
				posts: postArray
			};
		case MYPOSTS.SHOW_MY_POST_OPTIONS_MODEL:
			return {
				...state,
				postIndex: action.postIndex,
				post: action.post,
				postOptionVisibility: true
			};
		case MYPOSTS.HIDE_MY_POST_OPTIONS_MODEL:
			return {
				...state,
				postOptionVisibility: false
			};
		case MYPOSTS.MY_POST_ENDED: {
			return {
				...state,
				isPostEnd: true,
				loading: false
			};
		}
		default:
			return state;
	}
}
