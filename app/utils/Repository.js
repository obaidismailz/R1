import Axios from 'axios';
import { ShareData } from '@utils';
import {
	DELETE_BRIEFCASE,
	DELET_BOOKMARK,
	SAVE_BOOKMARK,
	SAVE_BRIEFCASE
} from './Constants';

export function saveBookmark(type, type_id) {
	return new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + SAVE_BOOKMARK,
			data: {
				type,
				type_id
			},
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				console.log(JSON.stringify(response.data));
				resolve(response.data.records);
			})
			.catch((e) => {
				console.log(JSON.stringify(e));
			});
	});
}

export function deleteBookmark(type, type_id) {
	Axios({
		method: 'POST',
		url: ShareData.getInstance().baseUrl + DELET_BOOKMARK,
		data: {
			type,
			type_id
		},
		headers: {
			Authorization: `Bearer ${ ShareData.getInstance().access_token }`
		}
	})
		.then((response) => {
			console.log(JSON.stringify(response.data));
		})
		.catch((e) => {
			console.log(JSON.stringify(e));
		});
}

export function saveBriefcase(type, type_id) {
	return new Promise((resolve, reject) => {
		Axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + SAVE_BRIEFCASE,
			data: {
				type,
				type_id
			},
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				console.log(JSON.stringify(response.data));
				resolve(response.data.records);
			})
			.catch((e) => {
				console.log(JSON.stringify(e));
			});
	});
}

export function deleteBriefcase(type, type_id) {
	Axios({
		method: 'POST',
		url: ShareData.getInstance().baseUrl + DELETE_BRIEFCASE,
		data: {
			type,
			type_id
		},
		headers: {
			Authorization: `Bearer ${ ShareData.getInstance().access_token }`
		}
	})
		.then((response) => {
			console.log(JSON.stringify(response.data));
		})
		.catch((e) => {
			console.log(JSON.stringify(e));
		});
}
