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
	FormButton
} from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { GET_WEBINAR, DELETE_BRIEFCASE } from '@utils/Constants';
import { ShareData } from '@utils';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '../../styles';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const CartDetails = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const cartIndex = route.params.index;
	const [data, setData] = useState(ShareData.getInstance().cart[cartIndex]);
	let totalAmount = 0;
	data.products.forEach((element) => {
		totalAmount += element.price * element.quantity;
	});
	// alert(route.params.index)

	const updateQuantity = (id, isIncrement = true) => {
		const tempCart = ShareData.getInstance().cart;
		tempCart[cartIndex] = {
			...data,
			products: tempCart[cartIndex].products.map((item) => {
				if (item.id === id) {
					return {
						...item,
						quantity: isIncrement ? item.quantity + 1 : item.quantity - 1
					};
				} else {
					return item;
				}
			})
		};
		ShareData.getInstance().setCart(tempCart);

		setData(ShareData.getInstance().cart[cartIndex]);
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
						style={{ padding: RFValue(10), paddingEnd: RFValue(20) }}
						onPress={() => {
							navigation.goBack();
						}}
					>
						<MaterialIcons name='close' size={RFValue(25)} color='#fff' />
					</TouchableOpacity>
				</Header>

				<View
					style={{
						paddingVertical: RFValue(20),
						paddingVertical: RFValue(20),
						backgroundColor: '#2775EE',
						flexDirection: 'row',
						paddingHorizontal: RFValue(10),
						paddingVertical: RFValue(20),
						borderColor: '#ececec',
						borderBottomRightRadius: RFValue(20),
						borderBottomLeftRadius: RFValue(20)
					}}
				>
					<FastImage style={styles.productImage} source={{ uri: data.image }} />
					<View
						style={{
							alignSelf: 'center'
						}}
					>
						<Text
							style={{
								marginStart: RFValue(10),

								color: '#fff',
								fontSize: RFValue(22)
							}}
						>
							{data.name}
						</Text>
						<Text
							style={{
								color: '#fff',
								marginStart: RFValue(10),
								fontSize: RFValue(12)
							}}
						>
							{`(${ data.products.length } Items added)`}
						</Text>
					</View>
				</View>

				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{ flex: 1 }}
						data={data.products}
						renderItem={({ item }) => (
							<CartItem
								data={item}
								onDecrement={() => {
									updateQuantity(item.id, false);
								}}
								onIncrement={() => {
									updateQuantity(item.id);
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
								style={{ flex: 1, color: '#424242', fontSize: RFValue(16) }}
							>
								Total Amount
							</Text>
							<Text
								style={{
									flex: 1,
									color: '#424242',
									fontSize: RFValue(16),
									textAlign: 'right'
								}}
							>
								{`USD ${ totalAmount.toFixed(2) }`}
							</Text>
						</View>

						<FormButton
							title='Place This Order'
							extraStyle={styles.formBtnExtraStyle}
							onPress={() => {
								if (ShareData.getInstance().deliveryAddress === undefined) {
									navigation.navigate('AddAddress', {
										data: data.products,
										cartIndex
									});
								} else {
									navigation.navigate('MyAddress', {
										data: data.products,
										cartIndex
									});
								}
							}}
						/>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const CartItem = props => (
	<TouchableOpacity
		activeOpacity={1}
		style={{
			flexDirection: 'row',
			paddingHorizontal: RFValue(10),
			paddingVertical: RFValue(20),
			borderBottomWidth: 1,
			borderColor: '#ececec'
		}}
	>
		<FastImage
			style={styles.productImage}
			source={{ uri: '' }}
			source={{ uri: props.data.image }}
		/>
		<View
			style={{
				flex: 1
			}}
		>
			<Text
				numberOfLines={2}
				style={{
					marginStart: RFValue(10),

					color: 'black',
					fontSize: RFValue(14)
				}}
			>
				{props.data.name}
			</Text>
			<Text
				style={{
					marginStart: RFValue(10),
					fontSize: RFValue(11)
				}}
			>
				Unit Price
			</Text>
			<Text
				style={{
					marginStart: RFValue(10),
					fontSize: RFValue(14)
				}}
			>
				{'$'}
				{props.data.price}
			</Text>
		</View>

		<View>
			<View style={styles.barInContainer}>
				<Pressable
					style={styles.btnAddSub}
					onPress={() => {
						props.onDecrement();
					}}
				>
					<AntDesign name='minus' size={12} color={colors.white} />
				</Pressable>
				<Text style={styles.txtQuantity}>{props.data.quantity}</Text>
				<Pressable
					style={styles.btnAddSub}
					onPress={() => {
						props.onIncrement();
					}}
				>
					<AntDesign name='plus' size={12} color={colors.white} />
				</Pressable>
			</View>
			<View
				style={{
					paddingVertical: RFValue(5),
					paddingHorizontal: RFValue(10),
					backgroundColor: '#F2F2F2',
					marginTop: RFValue(10),
					marginHorizontal: RFValue(15),
					borderRadius: RFValue(5)
				}}
			>
				<Text
					style={[
						styles.txtQuantity,
						{ fontWeight: undefined, textAlign: 'center' }
					]}
				>
					{(props.data.price * props.data.quantity).toFixed(2)}
				</Text>
			</View>
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	title: {
		fontSize: RFValue(14),
		// fontWeight: "bold",
		color: '#fff',
		marginStart: RFValue(20)
	},
	productImage: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(5),
		resizeMode: 'stretch',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#cecece'
	},
	barInContainer: {
		// flex: 1,
		justifyContent: 'center',
		flexDirection: 'row',
		justifyContent: 'center'
	},
	btnAddSub: {
		justifyContent: 'center',
		alignItems: 'center',
		height: RFValue(24),
		width: RFValue(24),
		borderRadius: RFValue(6),
		marginHorizontal: RFValue(15),
		backgroundColor: colors.primaryColor
	},
	txtQuantity: {
		fontSize: RFValue(16),
		color: '#000000',
		fontWeight: 'bold'
	},
	formBtnExtraStyle: {
		width: RFValue(150),
		marginTop: RFValue(25),
		alignSelf: 'center'
	}
});

export default withDimensions(withTheme(memo(CartDetails)));
