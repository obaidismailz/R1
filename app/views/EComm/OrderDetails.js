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
import { isValidURL, validateUriOrPlaceholder } from '../../utils/url';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const OrderDetails = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { orderData } = route.params;
	const [products, setProducts] = useState(orderData.order_details);
	const [totalCartProducts, setTotalCartProducts] = useState(0);

	const isInalidData =		orderData.order_details === undefined
		|| orderData.order_details === null
		|| orderData.order_details === '';

	const isFocused = useIsFocused();
	useEffect(() => {}, [isFocused]);

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
					title='My Order'
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
				/>

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
					<FastImage
						style={[styles.productImage, { borderRadius: RFValue(60) }]}
						source={validateUriOrPlaceholder(
							orderData.order_details[0].product.booth.logo
						)}
					/>
					<View
						style={{
							alignSelf: 'center'
						}}
					>
						<Text
							style={[
								exStyles.largeTitleR28,
								{ color: '#fff', marginStart: RFValue(10) }
							]}
						>
							{orderData.order_details[0].product.booth.name}
						</Text>
						<Text
							style={{
								color: '#fff',
								marginStart: RFValue(10),
								fontSize: RFValue(12)
							}}
						>
							{`Order-${ orderData.id }\n${ orderData.order_details.length } Items Ordered`}
						</Text>
					</View>
				</View>

				<ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
					<FlatList
						style={{ flex: 1 }}
						contentContainerStyle={{ flex: 1 }}
						data={products}
						renderItem={({ item, index }) => <ProductItem data={item} />}
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
								style={[{ flex: 1, color: '#424242' }, exStyles.infoLargeM16]}
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
								{`USD ${ route.params.totalAmount.toFixed(2) }`}
							</Text>
						</View>
					</View>
				</ScrollView>
			</View>
		</SafeAreaView>
	);
};

const ProductItem = props => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={styles.itemProductContainer}
		onPress={props.onPress}
	>
		<FastImage
			style={styles.productImage}
			source={validateUriOrPlaceholder(props.data.product.image)}
			// source={{ uri: props.data.image }}
		/>
		<View
			style={{
				alignSelf: 'center',
				flex: 1
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
				{props.data.product.name}
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
				{props.data.amount}
			</Text>
		</View>
		<View
			style={{
				width: RFValue(100),
				justifyContent: 'space-between',
				alignItems: 'center'
			}}
		>
			<Text
				style={{
					fontSize: 18,
					fontWeight: 'bold',
					textAlign: 'center',
					color: 'black'
				}}
			>
				{props.data.quantity}
				<Text style={{ fontWeight: 'normal' }}>{' items'}</Text>
			</Text>
			<Text style={[styles.txtTotalProdPrice, exStyles.infoDetailR16]}>
				{`$${ props.data.amount * props.data.quantity }`}
			</Text>
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
	txtTotalProdPrice: {
		backgroundColor: '#F2F2F2',
		width: '100%',
		textAlign: 'center',
		textAlignVertical: 'center',
		borderRadius: RFValue(10),
		height: RFValue(30),
		color: 'black'
	},
	itemProductContainer: {
		flexDirection: 'row',
		paddingHorizontal: RFValue(10),
		paddingVertical: RFValue(20),
		borderBottomWidth: 1,
		borderColor: '#ececec'
	}
});

export default withDimensions(withTheme(memo(OrderDetails)));
