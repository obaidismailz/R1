import { POSTS } from '../../actions/actionsTypes';

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

export default function posts(state = initialState, action) {
	switch (action.type) {
		case POSTS.FETCHING_POST:
			return {
				...state,
				loading: true
			};
		case POSTS.SAVE_POST_SUCCESS:
			return {
				...state,
				loading: false,
				postOffsetId: action.lastPostId,
				posts: [...state.posts, ...action.posts]
			};
		case POSTS.FETCH_POST_ERROR:
			return {
				...state,
				loading: false,
				error: action.err
			};
		case POSTS.CLEAR_POSTS:
			return {
				...state,
				...initialState
			};
		case POSTS.DELETE_POST:
			return {
				...state,
				postId: action.postId,
				isDeleting: true
			};
		case POSTS.POST_REMOVED:
			return {
				...state,
				posts: state.posts.filter(post => post.post_id !== state.postId),
				isDeleting: false
			};
		case POSTS.EDIT_POST:
			return {
				...state,
				loading: true
			};
		case POSTS.POST_EDITED:
			const arr = [...state.posts];
			arr[state.postIndex] = { ...arr[state.postIndex] };
			arr[state.postIndex].postText = action.text;
			return {
				...state,
				loading: false,
				posts: arr
			};
		case POSTS.UPDATE_COMMENT_COUNT:
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
		case POSTS.SHOW_POST_OPTIONS_MODEL:
			return {
				...state,
				postIndex: action.postIndex,
				post: action.post,
				postOptionVisibility: true
			};
		case POSTS.HIDE_POST_OPTIONS_MODEL:
			return {
				...state,
				postOptionVisibility: false
			};
		case POSTS.POSTS_ENDED: {
			return {
				...state,
				isPostEnd: true
			};
		}
		case POSTS.GET_LATEST_POST: {
			return {
				posts: [...action.post, ...state.posts]
			};
		}
		case POSTS.REACTIONS_UPDATE: {
			const save_posts = [...state.posts];
			let current_index = -1;
			save_posts.map((post, index) => {
				if (post.post_id == action.postId) {
					current_index = index;
				}
			});
			save_posts[current_index] = { ...save_posts[current_index] };
			save_posts[current_index].reactions = action.reaction;
			return {
				...state,
				posts: save_posts
			};
		}
		default:
			return state;
	}
}
