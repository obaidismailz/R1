import AsyncStorage from '@react-native-community/async-storage';

export default class ShareData {
	static myInstance = null;

	user = null;

	access_token = '';

	timeline_token = '';

	user_id = '';

	name = '';

	image = '';

	email = '';

	image = '';

	userName = '';

	interest = '';

	recentSearches = [];

	event = undefined;

	deliveryAddress = undefined;

	fcmToken = undefined;

	cart = [];

	subDomain = '';

	baseUrl = '';

	rcBaseUrl = '';

	socialBaseUrl = '';

	shouldRefreshAuditoriums = false;

	internetConnected = true;

	static getInstance() {
		if (ShareData.myInstance === null) {
			ShareData.myInstance = new ShareData();
		}
		return this.myInstance;
	}

	setFcmToken = token => (this.fcmToken = token);

	setShouldRefreshAuditoriums = val => (this.shouldRefreshAuditoriums = val);

	setRecentSearches = dataArr => {
		this.recentSearches = dataArr;
		AsyncStorage.setItem('recentSearches', JSON.stringify(dataArr));
	};

	setInternetConnected = val => {
		this.internetConnected = val;
	};

	setUserData = data => {
		this.user = data;
		this.access_token = data.access_token;
		this.timeline_token = data.timeline_token;
		this.user_id = data.user_id;
		this.name = `${data.fname} ${data.lname}`;
		this.image = data.image;
		this.email = data.email;
		this.image = data.image;
		this.userName = data.userName;
		this.interest = data.interest.join(',');
		AsyncStorage.setItem('user', JSON.stringify(data));
	};

	setEventData = event => {
		this.event = event;
		AsyncStorage.setItem('event', JSON.stringify(event));
	};

	setBaseUrl = (domain, subDomain) => {
		this.baseUrl = domain;
		this.subDomain = subDomain;
		AsyncStorage.setItem('baseUrl', JSON.stringify(domain));
		AsyncStorage.setItem('subDomain', JSON.stringify(subDomain));
	};

	setRCUrl = chatUrl => {
		this.rcBaseUrl = `https://${chatUrl}`;
		AsyncStorage.setItem('rcBaseUrl', JSON.stringify(`https://${chatUrl}`));
	};

	setSocialUrl = socialUrl => {
		this.socialBaseUrl = `https://${socialUrl}`;
		AsyncStorage.setItem('socialBaseUrl', JSON.stringify(`https://${socialUrl}`));
	};

	setDeliveryAddress = address => {
		this.deliveryAddress = address;
		AsyncStorage.setItem('deliveryAddress', JSON.stringify(address));
	};

	setCart = cart => {
		this.cart = cart;
		AsyncStorage.setItem('cart', JSON.stringify(cart));
	};

	getEventData = () =>
		new Promise((resolve, reject) => {
			AsyncStorage.getItem('event').then(v => {
				if (v != '' && v != undefined) {
					resolve(JSON.parse(v));
				}
			});
		});

	loadShareData = () =>
		new Promise((resolve, reject) => {
			AsyncStorage.getItem('user').then(value => {
				if (this.access_token !== '') {
					resolve();
				}
				if (value != '' && value != undefined) {
					const data = JSON.parse(value);
					this.userData = data;
					this.user = data;
					this.access_token = data.access_token;
					this.timeline_token = data.timeline_token;
					this.user_id = data.user_id;
					this.name = `${data.fname} ${data.lname}`;
					this.image = data.image;
					this.email = data.email;
					this.userName = data.userName;
					this.interest = data.interest.join(',');

					AsyncStorage.getItem('event').then(v => {
						if (v != '' && v != undefined) {
							const eventData = JSON.parse(v);
							this.event = eventData;
						}
						AsyncStorage.getItem('cart').then(c => {
							if (c != '' && c != undefined) {
								const cartData = JSON.parse(c);
								this.cart = cartData;
							}
						});
						AsyncStorage.getItem('recentSearches').then(searches => {
							if (searches != '' && searches != undefined) {
								this.recentSearches = JSON.parse(searches);
							}
						});
						AsyncStorage.getItem('deliveryAddress').then(addres => {
							if (addres != '' && addres != undefined) {
								const address = JSON.parse(addres);
								this.deliveryAddress = address;
							}
							resolve(this.access_token);
						});
						AsyncStorage.getItem('subDomain').then(data => {
							if (data != '' && data != undefined) {
								const subDomain = JSON.parse(data);
								this.subDomain = subDomain;
							}
						});
						AsyncStorage.getItem('baseUrl').then(data => {
							if (data != '' && data != undefined) {
								const url = JSON.parse(data);
								this.baseUrl = url;
							}
						});
						AsyncStorage.getItem('rcBaseUrl').then(data => {
							if (data != '' && data != undefined) {
								const url = JSON.parse(data);
								this.rcBaseUrl = url;
							}
						});
						AsyncStorage.getItem('socialBaseUrl').then(data => {
							if (data != '' && data != undefined) {
								const url = JSON.parse(data);
								this.socialBaseUrl = url;
							}
						});
					});
				} else {
					reject();
					this.userData = null;
					this.user = null;
				}
			});
		});
}
