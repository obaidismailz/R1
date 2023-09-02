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
	Linking,
	Pressable
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
import { GET_WEBINAR, DELETE_BRIEFCASE } from '@utils/Constants';
import { ShareData } from '@utils';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { useIsFocused } from '@react-navigation/native';
import { l } from 'i18n-js';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import { colors, exStyles } from '../../styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const MyCart = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const [cart, setCart] = useState(ShareData.getInstance().cart);
	const [totalCartProducts, setTotalCartProducts] = useState(0);
	const [totalCartAmount, setTotalCartAmount] = useState(0);

	const isFocused = useIsFocused();
	useEffect(() => {
		refreshState();
	}, [isFocused]);

	const refreshState = () => {
		setCart(ShareData.getInstance().cart);

		let totalAmount = 0;
		let totalProducts = 0;
		ShareData.getInstance().cart.forEach((cartBooth) => {
			let boothTotal = 0;
			totalProducts += cartBooth.products.length;
			cartBooth.products.forEach((element) => {
				boothTotal += element.price * element.quantity;
			});
			totalAmount += boothTotal;
		});
		setTotalCartAmount(totalAmount);
		setTotalCartProducts(totalProducts);
	};

	const popBoothFromCart = (i) => {
		ShareData.getInstance().setCart(
			ShareData.getInstance().cart.filter((item, index) => index !== i)
		);

		refreshState();
	};

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
					title='My Cart'
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
				>
					<TouchableOpacity
						activeOpacity={0.7}
						style={{ padding: RFValue(10) }}
						onPress={() => {
							navigation.navigate('MyOrders', { cart });
						}}
					>
						<Text style={styles.title}>My Orders</Text>
					</TouchableOpacity>
				</Header>

				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
					{cart.length > 0 ? (
						<>
							<FlatList
								style={{ flex: 1 }}
								contentContainerStyle={{ flex: 1 }}
								ListHeaderComponent={() => (
									<View>
										<Text
											style={{
												textAlign: 'center',
												marginVertical: RFValue(5)
											}}
										>
											{`${ cart.length } booths ${ totalCartProducts } Items \n(Tap to view/edit details)`}
										</Text>
									</View>
								)}
								data={cart}
								renderItem={({ item, index }) => (
									<CartItem
										data={item}
										onPress={() => navigation.navigate('CartDetails', { index })
										}
										onCross={() => {
											Alert.alert(
												'',
												'Are you sure you want to delete this booth from cart?',
												[
													{
														text: 'Cancel',
														onPress: () => {},
														style: 'cancel'
													},
													{
														text: 'OK',
														onPress: () => popBoothFromCart(index)
													}
												]
											);
										}}
									/>
								)}
							/>
							<View
								style={{
									backgroundColor: 'rgba(182, 182, 182, 0.6)',
									paddingVertical: RFValue(20),
									paddingHorizontal: RFValue(20)
								}}
							>
								<View
									style={{
										paddingHorizontal: RFValue(20),
										backgroundColor: '#F2F2F2',
										borderRadius: RFValue(10),
										paddingVertical: RFValue(5),
										flexDirection: 'row'
									}}
								>
									<Text
										style={[
											{ flex: 1, color: '#424242' },
											exStyles.infoLargeM16
										]}
									>
										Total Amount
									</Text>
									<Text
										style={[
											{
												flex: 1,
												color: '#424242',
												textAlign: 'right'
											},
											exStyles.infoLargeM16
										]}
									>
										{`USD ${ totalCartAmount.toFixed(2) }`}
									</Text>
								</View>

								<FormButton
									title='Place All Orders'
									extraStyle={styles.formBtnExtraStyle}
									onPress={() => {
										const allProducts = [];
										cart.forEach((booth) => {
											booth.products.forEach((product) => {
												allProducts.push(product);
											});
										});
										if (ShareData.getInstance().deliveryAddress === undefined) {
											navigation.navigate('AddAddress', { data: allProducts });
										} else {
											navigation.navigate('MyAddress', { data: allProducts });
										}
									}}
								/>
							</View>
						</>
					) : (
						<View style={styles.placeholderContainer}>
							<Text style={[exStyles.infoLink14Med, styles.placeholderText]}>
								{`You don’t have any items added to cart
Go to a booth and select a product to order.`}
							</Text>
							<Image
								style={styles.imgPlaceholder}
								source={require('@assets/addCartIcon.png')}
							/>
						</View>
					)}
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const CartItem = (props) => {
	let totalAmount = 0;
	props.data.products.forEach((element) => {
		totalAmount += element.price * element.quantity;
	});
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.cartItemContainer}
			onPress={props.onPress}
		>
			<FastImage
				style={styles.productImage}
				source={require('@assets/companyLogo.png')}
				source={{ uri: props.data.image }}
			/>
			<View
				style={{
					alignSelf: 'center'
				}}
			>
				<Text
					multiline
					numberOfLines={2}
					style={[
						{
							marginStart: RFValue(10),
							color: 'black'
						},
						exStyles.infoLargeM16
					]}
				>
					{props.data.name}
				</Text>
				<Text
					style={{
						marginStart: RFValue(10)
					}}
				>
					{`(${ props.data.products.length } Items)`}
				</Text>
			</View>
			<Text style={[styles.floatigPriceText, exStyles.infoLargeM16]}>
				{`USD ${ totalAmount.toFixed(2) }`}
			</Text>

			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.floatingBtnCard
				]}
				onPress={props.onCross}
			>
				<MaterialIcons name='close' size={RFValue(15)} color='#B3B3B3' />
			</Pressable>
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
	},
	imgPlaceholder: {
		height: RFValue(100),
		width: RFValue(100),
		tintColor: '#cecece',
		resizeMode: 'contain'
	},
	placeholderContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	placeholderText: {
		marginVertical: RFValue(50)
	},
	floatingBtnCard: {
		position: 'absolute',
		right: RFValue(10),
		top: RFValue(15),
		padding: RFValue(5),
		borderRadius: RFValue(20)
	},
	cartItemContainer: {
		flexDirection: 'row',
		paddingHorizontal: RFValue(10),
		paddingVertical: RFValue(20),
		borderBottomWidth: 1,
		borderColor: '#ececec'
	},
	floatigPriceText: {
		position: 'absolute',
		right: RFValue(10),
		bottom: RFValue(10),
		color: 'black'
	},
	formBtnExtraStyle: {
		width: RFValue(150),
		marginTop: RFValue(25),
		alignSelf: 'center'
	}
});

export default withDimensions(withTheme(memo(MyCart)));
