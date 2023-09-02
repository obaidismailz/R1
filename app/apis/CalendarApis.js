import { ShareData } from '@utils';
import Axios from 'axios';
// import FormData from 'form-data';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import vExpoFetch from '../utils/vexpo/vExpoFetch';
import {
	ADD_CALENDAR_EVENTS,
	GET_AVAILABLE_TIME_SLOTS,
	GET_MEETINGS_BY_USER,
	SAVE_MEETING_BOOTH,
	SAVE_MEETING_PERSONAL
} from '../utils/Constants';
const qs = require('qs');

export async function addWebinarToCalendar(webinar) {
	return new Promise((resolve, reject) => {
		const formdata = new FormData();
		formdata.append('model_name', 'webinar');
		formdata.append('data[topic]', webinar.topic);
		formdata.append('data[start_time]', moment(webinar.start_time).format('YYYY-MM-DD hh:mm:ss'));
		formdata.append('data[join_url]', webinar.join_url);
		formdata.append('data[id]', webinar.id);
		formdata.append('data[description]', webinar.description);
		// vExpoFetch(SAVE_MEETING_PERSONAL, {
		// 	method: 'POST',
		// 	headers: {
		// 		Authorization: `Bearer ${ShareData.getInstance().access_token}`
		// 	},
		// 	// signal: AbortSignal().signal,
		// 	body: formdata
		// })
		// 	.then(res => res.json())
		// 	.then(response => alert(JSON.stringify(response)))
		// 	.catch(e => alert(e));
		fetch(ShareData.getInstance().baseUrl + SAVE_MEETING_PERSONAL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			body: formdata
		})
			.then(res => res.json())
			.then(response => {
				resolve(response);
			})
			.catch(error => {
				alert(error);
				reject(`Failed to add event, Please try again ${error}`);
			});
	});
}

export async function getAvailableTimeSlots(userId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_AVAILABLE_TIME_SLOTS + userId,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
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

export async function getUsersMeeting(userId) {
	return await new Promise((resolve, reject) => {
		Axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_MEETINGS_BY_USER + userId,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
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

export async function saveMeetingForBooth(formData) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().baseUrl + SAVE_MEETING_BOOTH, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			body: formData
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

export async function savePersonalMeeting(formData) {
	return await new Promise((resolve, reject) => {
		fetch(ShareData.getInstance().baseUrl + SAVE_MEETING_PERSONAL, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			},
			body: formData
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
