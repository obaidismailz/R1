import axios from 'axios';
import { ShareData } from '@utils';
import {
	GET_BRIEFCASE,
	DELETE_BRIEFCASE,
	ADD_TO_BRIEFCASE
} from '../utils/Constants';

const qs = require('qs');

export async function getBriefcases() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_BRIEFCASE,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export async function deleteBriefcase(params) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + DELETE_BRIEFCASE,
			data: params,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}

export async function addToBriefcase(params) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + ADD_TO_BRIEFCASE,
			data: params,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				resolve(response);
			})
			.catch((e) => {
				reject(e);
			});
	});
}
