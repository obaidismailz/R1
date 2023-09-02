import axios from 'axios';
import { ShareData } from '@utils';
import { GET_SEARCH_RESULT, SEARCH_PROPERTIES } from '../utils/Constants';

const qs = require('qs');

export async function getSearchResults(params) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_SEARCH_RESULT,
			params,
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

export async function getPropertyResults(params) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + SEARCH_PROPERTIES,
			params,
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

export async function getPropertyDetails(id) {
	return new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + `/api/property/${id}`,

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
