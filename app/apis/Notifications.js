import axios from 'axios';
import { ShareData } from '@utils';
import { POST_FCM_TOKEN, GET_NOTIFICATIONS } from '../utils/Constants';

const qs = require('qs');

export async function postFcmToken() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + POST_FCM_TOKEN,
			data: {
				fcm_token: ShareData.getInstance().fcmToken,
				device_type: 'android',
				user_id: ShareData.getInstance().user.id
			},
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				// console.error('=======> fcm post done\n' + JSON.stringify({ fcm_token: ShareData.getInstance().fcmToken, device_type: "mobile", user_id: ShareData.getInstance().user_id }) + '\n' + JSON.stringify(response))
				resolve(response.data);
			})
			.catch(e => {
				console.error(JSON.stringify(e));
				reject(e);
			});
	});
}

export async function getNotifications() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_NOTIFICATIONS,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				if (response.status === 200 || response.status === 600) {
					if (response.data._metadata.status === 'SUCCESS') {
						resolve(response.data.records);
					} else {
						reject(response.data._metadata.message);
					}
				} else {
					reject('Failed to get Notifications, Please try again ');
				}
			})
			.catch(error => {
				reject();
			});
	});
}
