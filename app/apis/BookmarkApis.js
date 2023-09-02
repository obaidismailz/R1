import axios from 'axios';
import { ShareData } from '@utils';
import {
	GET_BOOKMARKS,
	DELETE_BOOKMARKS,
	SAVE_BOOKMARK
} from '../utils/Constants';

const qs = require('qs');

export async function getBookmarks() {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_BOOKMARKS,
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

export async function deleteBookmark(params) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + DELETE_BOOKMARKS,
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

export async function saveBookmark(params) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + SAVE_BOOKMARK,
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
