import { put, takeLatest } from 'redux-saga/effects';
import { ShareData } from '@utils';
import * as types from '../../actions/actionsTypes';
import { fetchEventInformationError, saveEventInformation, saveMainImage } from '../../actions/expo/eventInfo';
import { getEventAgenda } from '../../apis/LoopExpoApi';
import Navigation from '../../lib/Navigation';

const handleFetchEventData = function* handleFetchEventData({ instances }) {
	try {
		const response = yield getEventAgenda();
		if (response._metadata.status == 'SUCCESS') {
			yield put(saveEventInformation(response.records));
			yield put(saveMainImage(response.records.exhibition.main_image));
			ShareData.getInstance().setEventData(response.records);
		} else {
			yield put(fetchEventInformationError('error'));
		}
	} catch (e) {
		yield put(fetchEventInformationError(e));
		Navigation.navigate('ErrorPage404', {
			errorText: 'Instance Not Available'
		});
	}
	instances.forEach(instance => {
		if (instance.endpoint_key === 'loopchat') {
			ShareData.getInstance().setRCUrl(instance.endpoint);
		} else if (instance.endpoint_key === 'social') {
			ShareData.getInstance().setSocialUrl(instance.endpoint);
		}
	});
};

const root = function* root() {
	yield takeLatest(types.EVENT.FETCHING_EVENT_INFO, handleFetchEventData);
};
export default root;
