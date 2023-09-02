import axios from 'axios';
import { ShareData } from '@utils';
import { GET_MY_PROFILE, GET_USER_PROFILE } from '../utils/Constants';

const qs = require('qs');

export const getProfile = () => new Promise((resolve, reject) => {
	axios({
		method: 'GET',
		url: ShareData.getInstance().baseUrl + GET_USER_PROFILE,
		headers: {
			Authorization: `Bearer ${ ShareData.getInstance().access_token }`
		}
	})
		.then(async(response) => {
			resolve(response);
		})
		.catch((e) => {
			console.error(e);
			reject(e);
		});
});

export const getMyProfile = () => new Promise((resolve, reject) => {
	axios({
		method: 'GET',
		url: ShareData.getInstance().baseUrl + GET_MY_PROFILE,
		headers: {
			Authorization: `Bearer ${ ShareData.getInstance().access_token }`
		}
	})
		.then(async(response) => {
			resolve(response);
		})
		.catch((e) => {
			console.error(e);
			reject(e);
		});
});
