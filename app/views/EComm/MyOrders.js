import * as React from 'react';
import {
	memo, useRef, useState, useEffect, createRef
} from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	KeyboardAvoidingView,
	Alert,
	TextInput,
	Dimensions,
	TouchableOpacity,
	FlatList,
	Platform,
	Share,
	Linking
} from 'react-native';
import {
	Header,
	ActivityIndicator,
	LoadingDialog,
	FormButton,
	ProgressDialog
} from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { GET_ORDERS } from '@utils/Constants';
import { ShareData } from '@utils';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '../../styles';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const MyOrders = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);

		getOrders()
			.then((response) => {
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setOrders(response.data.records);
				}
			})
			.catch((e) => {
				alert(`err ${ e }`);
				setLoading(false);
			});
	}, []);

	const getOrders = () => new Promise((resolve, reject) => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_ORDERS,
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

	return (
		<SafeAreaView
			theme={theme}
			style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}
		>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>

			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<StatusBar
					theme={theme}
					backgroundColor={themes[theme].headerBackground}
				/>
				<Header
					title='My Orders'
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
				>
					<TouchableOpacity
						activeOpacity={0.7}
						style={{ padding: RFValue(10), paddingEnd: RFValue(20) }}
						onPress={() => {
							navigation.navigate('MyCart');
						}}
					>
						<Text style={styles.title}>My Cart</Text>
					</TouchableOpacity>
				</Header>

				<ScrollView style={{ flex: 1 }} contentContainerStyle={{}}>
					{loading === true ? (
						<ActivityIndicator absolute size='large' theme={theme} />
					) : null}
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{ flex: 1 }}
						ListHeaderComponent={() => (loading ? null : (
							<View>
								<Text
									style={{ textAlign: 'center', marginVertical: RFValue(5) }}
								>{`${ orders.reduce((a, b) => a + b.order_details.length, 0) } Items from ${
										orders.length
									} booths ordered \n(Tap to view/edit details)`}
								</Text>
							</View>
						))
						}
						data={orders}
						renderItem={({ item, index }) => (
							<CartItem
								data={item}
								onPress={totalAmount => navigation.navigate('OrderDetails', {
									orderData: item,
									totalAmount
								})
								}
							/>
						)}
					/>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const CartItem = (props) => {
	const isInalidData =		props.data.order_details === undefined
		|| props.data.order_details === null
		|| props.data.order_details === '';
	let totalAmount = 0;
	if (!isInalidData) {
		props.data.order_details.forEach((element) => {
			totalAmount += element.amount * element.quantity;
		});
	}

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={{
				flexDirection: 'row',
				paddingHorizontal: RFValue(10),
				paddingVertical: RFValue(20),
				borderBottomWidth: 1,
				borderColor: '#ececec'
			}}
			onPress={() => props.onPress(totalAmount)}
		>
			<Image
				style={styles.productImage}
				source={require('@assets/companyLogo.png')}
				source={{
					uri: isInalidData
						? ''
						: props.data.order_details[0].product.booth.logo
				}}
			/>
			<View
				style={{
					alignSelf: 'center'
				}}
			>
				<Text
					multiline
					numberOfLines={2}
					style={{
						marginStart: RFValue(10),

						color: 'black',
						fontSize: RFValue(16)
					}}
				>
					{isInalidData ? '' : props.data.order_details[0].product.booth.name}
				</Text>
				<Text
					style={{
						marginStart: RFValue(10)
					}}
				>
					{`(${ isInalidData ? '-' : props.data.order_details.length } Items)`}
				</Text>
			</View>
			<Text
				style={{
					position: 'absolute',
					right: RFValue(10),
					bottom: RFValue(10),
					color: 'black',
					fontSize: RFValue(16)
				}}
			>
				{`USD ${ totalAmount }`}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: RFValue(14),
		color: '#fff',
		marginStart: RFValue(20)
	},
	productImage: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(60),
		resizeMode: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#cecece'
	}
});

export default withDimensions(withTheme(memo(MyOrders)));
