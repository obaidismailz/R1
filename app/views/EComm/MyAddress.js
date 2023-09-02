import * as React from 'react';
import { memo, useRef, useState, useEffect, createRef } from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Alert,
	Platform,
	TextInput,
	Dimensions,
	TouchableOpacity,
	FlatList,
	AsyncStorage,
	ImageBackground
} from 'react-native';

import { Header, SearchInput, LoadingDialog, FormButton } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { SAVE_ORDER } from '@utils/Constants';
import { ShareData } from '@utils';

import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';
import FastImage from '@rocket.chat/react-native-fast-image';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import json from '@nozbe/watermelondb/decorators/json';
import { useIsFocused } from '@react-navigation/native';
import { setUser as setUserFun } from '../../actions/login';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { colors, exStyles } from '../../styles';

const qs = require('qs');

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const MyAddress = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const [loading, setLoading] = useState(false);

	const [first_name, setfirst_name] = useState('');
	const [last_name, setlast_name] = useState('');
	const [phone_number, setphone_number] = useState('');
	const [email, setemail] = useState('');
	const [country, setcountry] = useState('');
	const [city, setcity] = useState('');
	const [zipcode, setzipcode] = useState('');
	const [streetAddress, setstreetAddress] = useState('');
	const [streetAddress2, setstreetAddress2] = useState('');
	const [state, setstat] = useState('');

	const [cart, setCart] = useState(ShareData.getInstance().cart);
	const [totalCartProducts, setTotalCartProducts] = useState(0);
	const [totalCartAmount, setTotalCartAmount] = useState(0);

	const getAddress = () => {
		setfirst_name(ShareData.getInstance().deliveryAddress.first_name);
		setlast_name(ShareData.getInstance().deliveryAddress.last_name);
		setphone_number(ShareData.getInstance().deliveryAddress.phone_number);
		setemail(ShareData.getInstance().deliveryAddress.email);
		setcountry(ShareData.getInstance().deliveryAddress.country);
		setcity(ShareData.getInstance().deliveryAddress.city);
		setzipcode(ShareData.getInstance().deliveryAddress.zipcode);
		setstreetAddress(ShareData.getInstance().deliveryAddress.streetAddress);
		setstreetAddress2(ShareData.getInstance().deliveryAddress.streetAddress2);
		setstat(ShareData.getInstance().deliveryAddress.state);
	};

	useEffect(() => {
		getAddress();
	}, []);

	const isFocused = useIsFocused();
	useEffect(() => {
		refreshState();
	}, [isFocused]);

	const refreshState = () => {
		setCart(ShareData.getInstance().cart);

		let totalAmount = 0;
		let totalProducts = 0;
		ShareData.getInstance().cart.forEach(cartBooth => {
			let boothTotal = 0;
			totalProducts += cartBooth.products.length;
			cartBooth.products.forEach(element => {
				boothTotal += element.price * element.quantity;
			});
			totalAmount += boothTotal;
		});
		setTotalCartAmount(totalAmount);
		setTotalCartProducts(totalProducts);
	};

	const popBoothFromCart = i => {
		ShareData.getInstance().setCart(ShareData.getInstance().cart.filter((item, index) => index !== i));
	};

	const saveOrder = () => {
		const allProducts = [];

		route.params.data.forEach(product => {
			allProducts.push(product);
		});
		// console.error(JSON.stringify(allProducts))
		// return

		const formData = new FormData();
		formData.append('first_name', first_name);
		formData.append('last_name', last_name);
		formData.append('country_id', country);
		formData.append('city', city);
		formData.append('state', state);
		formData.append('postcode', zipcode);
		formData.append('street_address', streetAddress);
		formData.append('street_address2', streetAddress2);
		formData.append('email', email);
		formData.append('phone_no', phone_number);
		formData.append('cart_data', JSON.stringify(allProducts));

		setLoading(true);
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + SAVE_ORDER,
			data: formData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					if (route.params.cartIndex === undefined) {
						alert('Orders placed successfully');
						ShareData.getInstance().setCart([]);
					} else {
						alert('Order placed successfully');
						popBoothFromCart(route.params.cartIndex);
					}
					navigation.pop(2);
				} else {
					alert('An error occered');
					console.error(JSON.stringify(response.data));
				}
			})
			.catch(error => {
				setLoading(false);
				alert(error);
			});
	};

	return (
		<>
			<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground }} />
			<SafeAreaView theme={theme} style={{ backgroundColor: '#B6B6B6', flex: 1 }}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
				<Header
					title='Address'
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}>
					<TouchableOpacity
						style={{ paddingHorizontal: RFValue(20) }}
						onPress={() => {
							navigation.navigate('AddAddress', {
								isEdit: true,
								getAddress,
								data: route.params.data
							});
						}}>
						<Text style={{ color: '#fff', fontSize: RFValue(14) }}>Edit</Text>
					</TouchableOpacity>
				</Header>
				<ScrollView style={{ backgroundColor: 'white', flex: 1 }} contentContainerStyle={{}}>
					<Text style={[styles.txtAddressTitle, { alignSelf: 'center', marginTop: RFValue(5) }]}>Confirm your Address</Text>
					<View style={styles.addressContainer}>
						<Text style={styles.txtAddressDetails}>{`${first_name} ${last_name}`}</Text>
						<Text style={[styles.txtAddressDetails, { marginTop: RFValue(15) }]}>
							{`${streetAddress}
${city} ${state} ${country}`}
						</Text>
						<Text style={[styles.txtAddressTitle, { marginTop: RFValue(15) }]}>
							Phone: <Text style={[styles.txtAddressDetails, {}]}>{phone_number}</Text>
						</Text>
						<Text style={[styles.txtAddressTitle, {}]}>
							Email: <Text style={[styles.txtAddressDetails, {}]}>{email}</Text>
						</Text>
					</View>
				</ScrollView>

				<View
					style={{
						paddingVertical: RFValue(20),
						paddingHorizontal: RFValue(20)
					}}>
					<View
						style={{
							paddingHorizontal: RFValue(20),
							backgroundColor: '#F2F2F2',
							borderRadius: RFValue(10),
							paddingVertical: RFValue(5),
							flexDirection: 'row'
						}}>
						<Text style={[{ flex: 1, color: '#424242' }, exStyles.infoLargeM16]}>Total Amount</Text>
						<Text
							style={[
								{
									flex: 1,
									color: '#424242',
									textAlign: 'right'
								},
								exStyles.infoLargeM16
							]}>
							{`USD ${totalCartAmount.toFixed(2)}`}
						</Text>
					</View>

					<FormButton
						title='Proceed To Order'
						extraStyle={styles.formBtnExtraStyle}
						onPress={() => {
							saveOrder();
						}}
					/>
				</View>
				{loading ? <LoadingDialog absolute size='large' theme={theme} /> : null}
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	addressContainer: {
		backgroundColor: '#F2F2F2',
		paddingVertical: RFValue(15),
		paddingHorizontal: RFValue(10),
		marginHorizontal: RFValue(20),
		marginVertical: RFValue(30),
		borderRadius: RFValue(16),
		borderWidth: 1,
		borderStyle: 'dashed'
	},
	txtAddressDetails: {
		color: 'black',
		fontSize: RFValue(16)
	},
	txtAddressTitle: {
		color: 'grey',
		fontSize: RFValue(16)
	},
	footerContent: {
		paddingHorizontal: RFValue(20),
		backgroundColor: '#F2F2F2',
		borderRadius: RFValue(10),
		paddingVertical: RFValue(5),
		flexDirection: 'row',
		paddingVertical: RFValue(10)
	},
	productImage: {
		height: RFValue(40),
		width: RFValue(40),
		borderRadius: RFValue(60),
		resizeMode: 'stretch',
		justifyContent: 'center',
		alignItems: 'center'
	},
	formBtnExtraStyle: {
		width: RFValue(150),
		marginTop: RFValue(25),
		alignSelf: 'center'
	}
});

export default connect(null, null)(withDimensions(withTheme(MyAddress)));
