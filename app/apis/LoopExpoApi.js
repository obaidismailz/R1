import Axios from 'axios';
import { ShareData } from '@utils';
import {
	ACTIVE_BOOTHS,
	ACTIVE_HALLS,
	ALL_PRODUCTS,
	ALL_SPEAKERS,
	ALL_WEBINARS,
	ATTENDEES,
	CITY_LOCATIONS,
	COMMENT_REACTION,
	CONTACT_US,
	COUNTRIES_LIST,
	DELETE_COMMENT,
	DELETE_POST,
	DELETE_REPLY,
	EDIT_COMMENT,
	EDIT_POST,
	EDIT_REPLY,
	GET_ALL_Booths,
	GET_ALL_SPONSERS,
	GET_COMMENTS,
	GET_COMMENT_REPLIES,
	GET_EVENTS,
	GET_INCENTIVES_DATA,
	GET_LEADEROARD_RANKINGS,
	GET_LIVE_COUNTS,
	GET_LOBBY_ABOUT,
	GET_LOBBY_IMAGE,
	GET_MY_POINTS,
	GET_POSTS,
	GET_SCORE_CRITERION,
	GET_SPINNERWHEEL_DATA,
	GET_USER_PROFILE,
	GET_WEBINARS,
	GET_WEBINAR_BY_SPEAKERS,
	LIKES_DETAIL,
	LOGIN_SETTING,
	MY_QRCODE,
	POLLING_VOTE,
	POST_REACTION,
	REGISTER_COMMENTS,
	REGISTER_REPLY,
	REGISTER_USER,
	REPLY_REACTION,
	SIGNUP_INTERESTS,
	SIGNUP_SETTING,
	SUGGESTED_BOOTHS
} from '../utils/Constants';
import Navigation from '../lib/Navigation';

const qs = require('qs');

export async function loginPageSetting() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + LOGIN_SETTING
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function signupPageSetting() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + SIGNUP_SETTING
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}
export async function signupPageInterests() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + SIGNUP_INTERESTS
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function countriesList() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + COUNTRIES_LIST
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function registerUser(formdata) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().baseUrl + REGISTER_USER, {
			method: 'POST',
			body: formdata
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// lobby Api's

export async function getAllSponsers() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_ALL_SPONSERS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getLobbyImage() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_LOBBY_IMAGE,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getEventAgenda() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_EVENTS
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getSuggestedBooths() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + SUGGESTED_BOOTHS,
			params: { interest: ShareData.getInstance().interest },
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}
export async function getAllBooths() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_ALL_Booths,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getAllLocations() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + CITY_LOCATIONS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getAvailableSpeakers() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ALL_SPEAKERS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getAllProducts() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ALL_PRODUCTS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getAvailableWebinars() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ALL_WEBINARS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getLobbyAbout() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_LOBBY_ABOUT,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// hall Api's

export async function getActiveHalls() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ACTIVE_HALLS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getBoothListInHall(hallId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ACTIVE_BOOTHS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			params: { hall_id: hallId }
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
				console.log(JSON.stringify(e));
			});
	});
}

// Auditorium Api's

export async function getWebinarsInAuditorium(auditoriumId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + GET_WEBINARS}/${auditoriumId}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.error(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getLiveWebinarCount() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + GET_LIVE_COUNTS}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.error(JSON.stringify(e));
				reject(e);
			});
	});
}

// user profile Api's

export async function getLoopUserProfile(username) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + GET_USER_PROFILE}/${username}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getQRCode(id) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + MY_QRCODE,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			params: { id }
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.error(e);
				reject(e);
			});
	});
}

// Attendees Api's

export async function getAttendeesList(suggested) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ATTENDEES,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			params: { interest: suggested }
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
				console.log(JSON.stringify(e));
			});
	});
}

//	Webinar Api's
export async function getSpekaerWebinars(speakerId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + GET_WEBINAR_BY_SPEAKERS}/${speakerId}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

// Contact Us

export async function postContactUs(bodyFormData) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().baseUrl + CONTACT_US, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.error(JSON.stringify(e));
				reject(e);
			});
	});
}

// Gamification Api's
export async function getSpinnerWheelData() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_SPINNERWHEEL_DATA,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getRankings() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_LEADEROARD_RANKINGS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getScoreCriterion() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_SCORE_CRITERION,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getInCentives() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_INCENTIVES_DATA,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getMyPoints() {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_MY_POINTS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				reject(e);
			});
	});
}

//	Social Api's

export async function getTimeLinePosts(postLimit, afterPostId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().socialBaseUrl + GET_POSTS,
			headers: { token: ShareData.getInstance().timeline_token },
			params: {
				limit: postLimit,
				after_post_id: afterPostId
			}
		})
			.then(response => {
				response.status == 200
					? resolve(response.data)
					: Navigation.navigate('ErrorPage404', {
							errorText: 'Server Error'
					  });
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function deletePost(postId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().socialBaseUrl + DELETE_POST + ShareData.getInstance().timeline_token,
			data: qs.stringify({ process: 'React_Delete_Post', post_id: postId })
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function getUserSocialPosts(postlimit, afterPostId, username, id) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().socialBaseUrl + GET_POSTS,
			headers: { token: ShareData.getInstance().timeline_token },
			params: {
				limit: postlimit,
				user_id: id,
				username,
				after_post_id: afterPostId
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.error(`${domain}get_posts ${error}\n${userToken}`);
				reject(e);
			});
	});
}

export async function postPollingVote(pollOptionId) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + POLLING_VOTE + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: qs.stringify({
				id: pollOptionId
			})
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.error(`${domain}get_posts ${error}\n${userToken}`);
				reject(e);
			});
	});
}

export async function editPost(params) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().socialBaseUrl + EDIT_POST + ShareData.getInstance().timeline_token,
			data: qs.stringify(params)
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(error => {
				reject(error);
			});
	});
}

// social comment Api's

export async function getComments(postId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().socialBaseUrl + GET_COMMENTS,
			headers: { token: ShareData.getInstance().timeline_token },
			params: {
				post_id: postId,
				limit: 50
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.error(error);
				reject(e);
			});
	});
}

export async function deleteComment(commentId) {
	const params = {
		process: 'React_Delete_Comment',
		comment_id: commentId,
		user_id: ShareData.getInstance().user_id
	};
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().socialBaseUrl + DELETE_COMMENT + ShareData.getInstance().timeline_token,
			data: qs.stringify(params)
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function registerComment(bodyFormData) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + REGISTER_COMMENTS + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				console.error(response);
				resolve(response);
			})
			.catch(error => {
				reject(error);
			});
	});
}

export async function editComment(params) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().socialBaseUrl + EDIT_COMMENT + ShareData.getInstance().timeline_token,
			data: qs.stringify(params)
		})
			.then(response => {})
			.catch(error => {
				alert(error);
			});
	});
}

export async function getCommentReplies(commentId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().socialBaseUrl + GET_COMMENT_REPLIES,
			headers: { token: ShareData.getInstance().timeline_token },
			params: {
				comment_id: commentId,
				limit: 50
			}
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				console.error(`${domain}get_posts ${error}\n${userToken}`);
				reject(e);
			});
	});
}

export async function registerReply(bodyFormData) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + REGISTER_REPLY + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				console.error(`${domain}get_posts ${error}\n${userToken}`);
				reject(e);
			});
	});
}

export async function deleteReplies(replyId) {
	const params = {
		reply_id: replyId,
		type: 'delete_reply'
	};
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().socialBaseUrl + DELETE_REPLY + ShareData.getInstance().timeline_token,
			data: qs.stringify(params)
		})
			.then(response => {
				resolve(response.data);
			})
			.catch(e => {
				reject(e);
			});
	});
}

export async function editReply(bodyFormData) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + EDIT_REPLY + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(e => {
				reject(e);
			});
	});
}

// social like Api's
export async function likePost(postId, reactionType) {
	const bodyFormData = new FormData();
	bodyFormData.append('post_id', postId);
	bodyFormData.append('reaction', reactionType);
	bodyFormData.append('user_id', ShareData.getInstance().user_id);
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + POST_REACTION, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(e);
			});
	});
}

export async function likeComment(commentId, reactionType) {
	const bodyFormData = new FormData();
	bodyFormData.append('comment_id', commentId);
	bodyFormData.append('reaction', reactionType);
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + COMMENT_REACTION + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(e);
			});
	});
}

export async function likeReply(replyCommentId, reactionType) {
	const bodyFormData = new FormData();
	bodyFormData.append('reply_id', replyCommentId);
	bodyFormData.append('reaction', reactionType);
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + REPLY_REACTION + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(e);
			});
	});
}

export async function likeDetail(type, postId, reactions) {
	const bodyFormData = new FormData();
	bodyFormData.append('type', type);
	bodyFormData.append('id', postId);
	bodyFormData.append('reaction', reactions);
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().socialBaseUrl + LIKES_DETAIL + ShareData.getInstance().timeline_token, {
			method: 'POST',
			body: bodyFormData
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				reject(e);
			});
	});
}
