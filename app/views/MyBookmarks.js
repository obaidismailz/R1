import * as React from 'react';
import {
	memo, useRef, useState, useEffect
} from 'react';
import {
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	FlatList,
	TouchableOpacity
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import HTML from 'react-native-render-html';
import { noInternetAlert } from '@utils/Network';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { Header, ActivityIndicator, NoRecordFound } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import {
	getBookmarks as getBookmarksApi,
	deleteBookmark as deleteBookmarkApi
} from '@apis/BookmarkApis';
import FastImage from '@rocket.chat/react-native-fast-image';
import Spinner from 'react-native-loading-spinner-overlay';
import StatusBar from '../containers/StatusBar';
import { themes } from '../constants/colors';
import { withDimensions } from '../dimensions';
import { withTheme } from '../theme';
import AlertModal from '../components/AlertModal';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const MyBookmarks = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [refreshing, setRefreshing] = useState(false);
	const [loading, setLoading] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [currentItem, setCurrentItem] = useState({});
	const bookmarkCatLlistRef = useRef(null);
	const [bookmarksCategories, setBookmarksCategories] = useState([
		{ value: 'All', selected: true, key: 'all' },
		{ value: 'Users', selected: false, key: 'user' },
		{ value: 'Booths', selected: false, key: 'booth' },
		{ value: 'Products', selected: false, key: 'products' }
	]);
	const [bookmarks, setBookmarks] = useState([]);
	const [alertVisibility, setAlertVisibility] = useState(false);

	useEffect(() => {
		getData();
		return () => {
			setBookmarks([]);
		};
	}, [useIsFocused()]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getBookmarks();
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async() => {
					getData();
				}
			});
		}
	};

	const getBookmarks = () => {
		setLoading(true);
		getBookmarksApi()
			.then((response) => {
				setLoadingDone(true);
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setBookmarks(response.data.records);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const deleteBookmarks = () => {
		setRefreshing(true);
		setAlertVisibility(false);
		const params = {
			type: currentItem.type,
			type_id: currentItem.type_id
		};
		deleteBookmarkApi(params)
			.then((response) => {
				if (response.data._metadata.status === 'SUCCESS') {
					setBookmarks(
						bookmarks.filter(item => currentItem.type_id !== item.type_id)
					);
					setRefreshing(false);
				}
			})
			.catch((e) => {
				setRefreshing(false);
				console.error(JSON.stringify(params));
				console.error(JSON.stringify(e));
			});
	};

	const renderFilters = () => (
		<FlatList
			contentContainerStyle={styles.categoryFlatlist}
			ref={bookmarkCatLlistRef}
			horizontal
			showsHorizontalScrollIndicator={false}
			style={{
				backgroundColor: 'white'
			}}
			data={bookmarksCategories}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						styles.categoryItem,
						{
							backgroundColor: item.selected
								? colors.primaryColor
								: colors.unSelected
						}
					]}
					onPress={() => {
						const d = [...bookmarksCategories];
						for (let i = 0; i < d.length; i++) {
							const element = d[i];
							if (i === index) {
								d[i].selected = true;
							} else {
								d[i].selected = false;
							}
						}
						setBookmarksCategories(d);
					}}
				>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoDetailR16,
							{
								color: item.selected ? 'white' : colors.secondaryText
							}
						]}
					>
						{item.value}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);

	const ItemBookmark = props => (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.itemBookmarkContainer}
			onPress={props.onPress && props.onPress}
		>
			<FastImage
				style={styles.itemBookmarkImage}
				source={{
					uri:
						props.data.type === 'user'
							? props.data.user.image
							: props.data.type === 'booth'
								? props.data.booth.image
								: props.data.type === 'products'
									? props.data.product.image
									: null
				}}
			/>
			<View style={{ marginStart: 15, flex: 1 }}>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
					{props.data.type === 'user'
						? `${ props.data.user.fname } ${ props.data.user.lname }`
						: props.data.type === 'booth'
							? props.data.booth.name
							: props.data.type === 'products'
								? props.data.product.name
								: null}
				</Text>
				{props.data.type === 'products' ? (
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
						{props.data.product.price}
					</Text>
				) : null}
				{props.data.type === 'booth' || props.data.type === 'products' ? (
					<View style={{ maxHeight: 100, overflow: 'hidden' }}>
						<HTML
							source={{
								html:
									props.data.type === 'booth'
										? props.data.booth.description
										: props.data.type === 'products'
											? props.data.product.description
											: null
							}}
						/>
					</View>
				) : null}
				{props.data.type === 'user' ? (
					<Text
						style={[exStyles.customStatus, { color: colors.secondaryText }]}
					>
						{props.data.type === 'user' ? props.data.user.email : null}
					</Text>
				) : null}
			</View>
			<View
				style={{
					marginStart: 10,
					alignItems: 'flex-end',
					justifyContent: 'space-between'
				}}
			>
				<TouchableOpacity
					style={styles.btnBookmark}
					onPress={() => {
						setCurrentItem(props.data);
						setAlertVisibility(true);
					}}
				>
					<FIcon name='bookmark' size={24} color={colors.primaryColor} />
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	return (
		<>
			<SafeAreaView
				theme={theme}
				style={{ backgroundColor: themes[theme].headerBackground }}
			/>

			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<Header
				title='My Bookmarks'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
				onChangeSearch={(txt) => {}}
			/>
			<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
				<View
					style={[
						styles.justAlign,
						{
							backgroundColor: 'white'
						}
					]}
				>
					{renderFilters()}
				</View>
				<Spinner
					cancelable={false}
					animation='fade'
					visible={refreshing}
					textContent='Refreshing...'
					textStyle={styles.spinnerTextStyle}
				/>
				<FlatList
					data={bookmarks.filter(
						item => bookmarksCategories.filter(item => item.selected)[0].key
								=== 'all'
							|| item.type
								=== bookmarksCategories.filter(item => item.selected)[0].key
					)}
					renderItem={({ item }) => (
						<ItemBookmark
							data={item}
							onPress={() => {
								if (item.type === 'user') {
									navigation.navigate('LoopUserProfile', {
										username: item.user.username
									});
								} else if (item.type === 'booth') {
									navigation.navigate('BoothDetails', {
										booth: item.booth,
										onCallBackHallBooths: (res, type) => {}
									});
								} else if (item.type === 'products') {
									navigation.navigate('BoothProductDetails', {
										data: {
											...item.product
										},
										onCallBack: (res, type) => {}
									});
								}
							}}
						/>
					)}
				/>

				{loadingDone && bookmarks.length === 0 && <NoRecordFound />}
				<AlertModal
					visible={alertVisibility}
					type=''
					text='Bookmark'
					typeId=''
					onYes={deleteBookmarks}
					onClose={() => {
						setAlertVisibility(false);
					}}
				/>
				{loading ? (
					<ActivityIndicator absolute size='large' theme={theme} />
				) : null}
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	modalStyle: {
		backgroundColor: '#fff',
		alignSelf: 'center',
		margin: 0,
		justifyContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',
		width: '100%',
		height: '100%'
	},
	layoutStyle: {
		backgroundColor: '#fff',
		alignSelf: 'center',
		alignItems: 'center',
		margin: 0,
		justifyContent: 'center',
		width: '80%',
		borderRadius: RFValue(40),
		paddingHorizontal: RFValue(20),
		paddingVertical: RFValue(24),
		paddingTop: RFValue(54)
	},
	categoryFlatlist: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 24,
		paddingBottom: RFValue(10),
		paddingStart: 32,
		backgroundColor: 'white'
	},
	categoryItem: {
		marginEnd: RFValue(15),
		paddingVertical: 4,
		justifyContent: 'center',
		paddingHorizontal: RFValue(13),
		borderRadius: 10
	},
	itemBookmarkContainer: {
		width: screenWidth,
		backgroundColor: 'white',
		borderBottomWidth: 0.5,
		borderColor: '#cecece',
		paddingVertical: RFValue(20),
		paddingHorizontal: RFValue(10),
		flexDirection: 'row'
	},
	itemBookmarkImage: {
		height: RFValue(60),
		width: RFValue(60),
		borderWidth: 0.5,
		borderColor: colors.black20,
		borderRadius: RFValue(60),
		resizeMode: 'contain'
	},
	imgBookmark: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	btnBookmark: {
		paddingVertical: 3,
		paddingHorizontal: RFValue(10),
		marginEnd: -5
	},
	txtPopupTitle: {
		color: 'black',
		fontSize: RFValue(18),
		textAlign: 'center'
	},
	justAlign: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	spinnerTextStyle: {
		color: colors.primaryText,
		fontStyle: 'normal',
		fontSize: 18,
		fontWeight: '600'
	}
});

export default withDimensions(withTheme(memo(MyBookmarks)));
