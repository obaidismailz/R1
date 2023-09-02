import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	FlatList,
	TouchableOpacity,
	SafeAreaView,
	Share,
	Pressable,
	Alert
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import { FormButton } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import FIcon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HTML from 'react-native-render-html';
import { ShareData } from '@utils';
import { saveBookmark, deleteBookmark } from '../../utils/Repository';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import AlertModal from '../../components/AlertModal';
import AboutText from '../../components/AboutText';
import FullImageView from '../../components/FullImageView';
import ModalAddProductToCart from './components/ModalAddProductToCart';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const BoothProductDetails = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { data, booth } = route.params;
	const [alertVisibility, setAlertVisibility] = useState(false);
	const [bookMarked, setBookMarked] = useState(data.bookmark !== '');
	const [bookMarkType, setBookMarkType] = useState('');
	const [bookMarkTypeId, setBookMarkTypeId] = useState('');
	const [cartCount, setCartCount] = useState(0);
	const [fullImageVisible, setFullImageVisible] = useState(false);
	const [cartPopupVisible, setCartPopupVisible] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		setCartCount(ShareData.getInstance().cart.length);
	}, [isFocused]);

	function saveBookMark(type, id) {
		saveBookmark(type, id).then(res => {
			route.params.onCallBack(res, 0);
		});
		setBookMarked(true);
	}

	const showAlert = (type, id) => {
		setBookMarkType(type);
		setBookMarkTypeId(id);
		setAlertVisibility(true);
	};

	const deleteBookMark = (type, typeId) => {
		deleteBookmark(type, typeId);
		setBookMarked(false);
		route.params.onCallBack('', 1);
		setAlertVisibility(false);
	};

	const onShare = async () => {
		if (data.url === '') {
			alert('Cannot Share this product');
			return;
		}
		try {
			const result = await Share.share({
				message: data.url
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const addProdToCart = quantity => {
		let cartIndex;
		for (let index = 0; index < ShareData.getInstance().cart.length; index++) {
			// check booth id
			const element = ShareData.getInstance().cart[index];
			if (element.id === booth.id) {
				cartIndex = index;
				break;
			}
		}

		if (cartIndex === undefined) {
			// booth not already exists
			const tempCart = ShareData.getInstance().cart;
			tempCart.push({
				...booth,
				products: [
					{
						...data,
						quantity
					}
				]
			});
			ShareData.getInstance().setCart(tempCart);
		} else {
			let cartContainsProductID = 0;
			const currentCartItem = ShareData.getInstance().cart[cartIndex];
			currentCartItem.products.forEach(element => {
				if (element.id === data.id) {
					// check prod id
					cartContainsProductID = data.id;
				}
			});

			const tempCart = ShareData.getInstance().cart;
			if (cartContainsProductID !== 0) {
				tempCart[cartIndex] = {
					...tempCart[cartIndex],
					products: tempCart[cartIndex].products.map(item => ({
						...item,
						quantity: item.id === cartContainsProductID ? item.quantity + quantity : item.quantity
					}))
				};
			} else {
				tempCart[cartIndex] = {
					...tempCart[cartIndex],
					products: [
						...tempCart[cartIndex].products,
						{
							...data,
							quantity
						}
					]
				};
				ShareData.getInstance().setCart(tempCart);
			}
			ShareData.getInstance().setCart(tempCart);
		}

		setCartCount(ShareData.getInstance().cart.length); // setstate
	};

	const Header = () => (
		<View style={[styles.headerContainer, {}]}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: 14 }
				]}
				onPress={() => {
					navigation.goBack();
				}}>
				<IonIcons name='ios-chevron-back-sharp' size={RFValue(24)} color={colors.secondaryText} />
			</Pressable>
			<View style={styles.headerLeftContainer}>
				{/* <Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.onPressBookmarkIcon
					]}
					onPress={() => {
						navigation.navigate('MyCart');
					}}
				>
					<Entypo
						name='shopping-cart'
						size={RFValue(22)}
						color={colors.secondaryText}
					/>
					{cartCount > 0 && (
						<Text
							style={{
								fontSize: RFValue(10),
								position: 'absolute',
								color: '#fff',
								backgroundColor: colors.primaryColor,
								top: -7,
								right: -5,
								height: RFValue(17),
								width: RFValue(17),
								borderRadius: 1000,
								textAlignVertical: 'center',
								textAlign: 'center'
							}}
						>
							{cartCount}
						</Text>
					)}
				</Pressable> */}
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.onPressBookmarkIcon
					]}
					onPress={() => {
						bookMarked ? showAlert('products', data.id) : saveBookMark('products', data.id);
					}}>
					<FIcon
						name={bookMarked ? 'bookmark' : 'bookmark-o'}
						size={RFValue(20)}
						color={bookMarked ? colors.primaryColor : colors.secondaryText}
					/>
				</Pressable>
				{/* <Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						{ borderRadius: 4 }
					]}
					onPress={() => onShare()}
				>
					<MaterialCommunityIcons
						name='share-variant'
						size={RFValue(20)}
						color={colors.secondaryText}
					/>
				</Pressable> */}
			</View>
		</View>
	);

	const ProductDetails = () => (
		<View>
			<Pressable onPress={() => setFullImageVisible(true)}>
				<FastImage style={styles.productImage} source={{ uri: data.image }} />
			</Pressable>
			<Text style={[exStyles.infoLargeM18, styles.productName]}>{data.name}</Text>
			<View style={styles.productPriceContainer}>
				<Text style={[exStyles.mediumTitleMed20, { color: colors.primaryColor }]}>
					<Text style={styles.priceText}>{'Price '}</Text>
					{' $'}
					{data.price}
				</Text>
			</View>
		</View>
	);

	const ProductHighlights = () => (
		<View style={{ marginTop: 40 }}>
			<Text style={[exStyles.infoLargeM16, styles.productHighlights]}>Product Highlights</Text>
			<View style={{ paddingVertical: 30, paddingLeft: 16 }}>
				<HTML source={{ html: data.highlights == null ? ' ' : data.highlights }} />
			</View>
		</View>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
			<StatusBar theme='light' backgroundColor='white' barStyle='dark-content' />
			<Header
				onCartPress={() => {
					//   navigation.navigate("MyCart");
				}}
			/>
			<ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 10 }}>
				<ProductDetails />
				<View style={styles.aboutProduct}>
					<AboutText about=' Product' text={data.description == null ? '' : data.description} justify />
				</View>
				{/* <View style={{ marginTop: 20 }}>
					<FormButton
						title='Add To Cart'
						extraStyle={styles.formButton}
						onPress={() => {
							setCartPopupVisible(true);
						}}
					/>
				</View> */}
				<ProductHighlights />
			</ScrollView>
			<AlertModal
				visible={alertVisibility}
				type={bookMarkType}
				text='Bookmark'
				typeId={bookMarkTypeId}
				onYes={deleteBookMark}
				onClose={() => {
					setAlertVisibility(false);
				}}
			/>
			<ModalAddProductToCart
				visible={cartPopupVisible}
				onClose={() => {
					setCartPopupVisible(false);
				}}
				onConfirm={quantity => {
					setCartPopupVisible(false);

					addProdToCart(quantity);
				}}
				data={data}
			/>
			<FullImageView visible={fullImageVisible} url={data.image} onClose={() => setFullImageVisible(false)} />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		height: RFValue(50)
	},
	headerLeftContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	onPressBookmarkIcon: {
		padding: 2,
		borderRadius: RFValue(4),
		marginRight: RFValue(20)
	},

	// product Image , categories and Text
	productImage: {
		height: screenWidth * 0.7,
		width: screenWidth,
		resizeMode: 'stretch',
		justifyContent: 'center',
		alignItems: 'center'
	},
	productName: {
		color: colors.primaryText,
		marginHorizontal: RFValue(16),
		marginTop: 24
	},
	priceText: {
		fontSize: 12,
		color: colors.secondaryText,
		marginHorizontal: RFValue(16),
		padding: 4,
		marginTop: RFValue(10)
	},
	categoriesContainer: {
		flexDirection: 'row',
		marginHorizontal: RFValue(10),
		marginVertical: RFValue(10)
	},
	productPriceContainer: {
		flexDirection: 'row',
		marginHorizontal: RFValue(16),
		marginTop: RFValue(8)
	},
	oldPrice: {
		color: 'black',
		fontSize: RFValue(20),
		textDecorationLine: 'line-through',
		marginStart: RFValue(10)
	},

	itemKeywordTag: {
		borderWidth: RFValue(1),
		fontSize: RFValue(11),
		paddingHorizontal: RFValue(7),
		paddingVertical: RFValue(2),
		borderRadius: RFValue(10),
		marginEnd: RFValue(10)
	},

	// contact
	boothContactContainer: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		marginVertical: 30,
		paddingHorizontal: 60
	},
	contactSeparator: {
		backgroundColor: 'grey',
		height: 30,
		width: 1,
		alignSelf: 'center'
	},

	// formButtonn
	formButton: {
		alignSelf: 'center',
		width: RFValue(192),
		borderRadius: RFValue(20)
	},

	aboutProduct: {
		marginHorizontal: RFValue(16),
		marginTop: RFValue(24)
	},

	productHighlights: {
		paddingStart: 24,
		color: colors.secondaryText,
		backgroundColor: colors.unSelected,
		paddingVertical: 8
	},

	bulletPointText: {
		fontSize: RFValue(16),
		color: 'black',
		marginHorizontal: RFValue(10),
		marginTop: RFValue(10)
	},

	// seller
	sellerText: {
		paddingStart: RFValue(24),
		fontSize: RFValue(16),
		color: 'grey',
		backgroundColor: '#F2F2F2',
		paddingVertical: RFValue(5),
		marginTop: RFValue(10)
	},
	sellerInfoContaienr: {
		flexDirection: 'row',
		borderColor: '#cecece',
		paddingStart: RFValue(16),
		paddingVertical: 4,
		paddingEnd: RFValue(20),
		alignItems: 'center',
		marginTop: RFValue(26),
		marginBottom: 12
	},
	sellerImage: {
		height: RFValue(60),
		width: RFValue(60),
		marginEnd: RFValue(16),
		resizeMode: 'stretch'
	},
	sellerBrand: {
		flex: 1,
		fontSize: RFValue(18),
		color: 'black'
	},
	more: {
		paddingStart: RFValue(24),
		fontSize: RFValue(16),
		color: 'grey',
		paddingVertical: RFValue(5),
		marginBottom: RFValue(10)
	},
	moreItemContainer: {
		alignSelf: 'center',
		marginVertical: RFValue(10),
		borderRadius: 4,
		padding: 4
	},
	viewMoreText: {
		fontSize: 18,
		color: colors.primaryColor,
		textDecorationLine: 'underline'
	},

	// Similar Products
	similarProducts: {
		paddingStart: RFValue(24),
		fontSize: RFValue(16),
		color: 'grey',
		backgroundColor: '#F2F2F2',
		paddingVertical: RFValue(5),
		marginBottom: RFValue(10),
		marginTop: RFValue(10)
	},
	itemSimilarProductImage: {
		height: RFValue(88),
		width: RFValue(88),
		resizeMode: 'stretch',
		borderRadius: RFValue(5),
		alignSelf: 'center',
		overflow: 'hidden'
	},
	itemSimilarProductOff: {
		position: 'absolute',
		bottom: 0,
		width: '100%',
		textAlign: 'center',
		backgroundColor: '#eb5757',
		textAlignVertical: 'center',
		paddingVertical: 4,
		color: '#fff',
		fontWeight: 'bold',
		fontSize: RFValue(11)
	},

	itemSimilarProductPrice: {
		color: colors.primaryColor,
		fontSize: RFValue(14),
		fontWeight: 'bold',
		alignSelf: 'center',
		marginTop: RFValue(10)
	},
	itemSimilarProductOldPrice: {
		color: 'grey',
		fontSize: RFValue(14),
		textDecorationLine: 'line-through'
	},

	// Text
	txtBlogTitle: {
		fontSize: RFValue(16),
		color: 'black',
		flex: 1,
		marginStart: 10
	},
	icon: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	txtDetails: {
		fontSize: RFValue(12),
		color: 'grey',
		marginStart: RFValue(5)
	}
});

// export default memo(Lobby);
export default withDimensions(withTheme(memo(BoothProductDetails)));
