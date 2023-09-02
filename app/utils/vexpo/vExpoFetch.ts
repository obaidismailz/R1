import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';
import { vExpoSettings as ExpoSettings } from '@vexpo';
import { ShareData } from '@utils';

// import RocketChat from '../lib/rocketchat';

interface CustomHeaders {
	'User-Agent': string;
    Authorization?: string;
    Accept: string;
}


// this form is required by Rocket.Chat's parser in "app/statistics/server/lib/UAParserCustom.js"
export const expoHeaders: CustomHeaders = {
	'User-Agent': `Mobile; ${
		Platform.OS
        } ${DeviceInfo.getSystemVersion()}; v${DeviceInfo.getVersion()} (${DeviceInfo.getBuildNumber()})`,
    Accept: 'application/json'
};

let _basicAuth;

export const setExpoAuth = (basicAuth: string): void => {
	_basicAuth = basicAuth;
	if (basicAuth) {
		ExpoSettings.expoCustomHeaders = { ...expoHeaders, Authorization: `Bearer ${_basicAuth}` };
	} else {
		ExpoSettings.expoCustomHeaders = expoHeaders;
	}
};

// export const BASIC_AUTH_KEY = 'BASIC_AUTH_KEY';

ExpoSettings.expoCustomHeaders = expoHeaders;

export default (url: string, options: { headers?: Headers; signal?: AbortSignal, data: any } = {}): Promise<Response> => {
	
	let customOptions = { ...options, headers: ExpoSettings.expoCustomHeaders };
	
	if (options && options.headers) {
		customOptions = { ...customOptions, headers: { ...options.headers, ...customOptions.headers } };
	}
	
	// customOptions = { ...customOptions, signal, data };  //creating problem in fetch api call 

	return fetch(ShareData.getInstance().baseUrl + url, customOptions);
};
