import * as React from 'react';
import { memo, useRef, useState, useEffect } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Dimensions,
	FlatList,
	Pressable,
	TouchableOpacity,
	Platform,
	Share,
	SafeAreaView
} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { ProgressDialog } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ActionSheet } from 'react-native-cross-actionsheet';
import { noInternetAlert } from '@utils/Network';
import RNFetchBlob from 'rn-fetch-blob';
import { ShareData } from '@utils';
import { withTheme } from '../../../theme';
import { withDimensions } from '../../../dimensions';
import { themes } from '../../../constants/colors';
import StatusBar from '../../../containers/StatusBar';
import ItemBoothProduct from '../components/ItemBoothProduct';
import { ItemBoothResourceDocs, ItemBoothResourceVideos } from '../components/ItemBoothResource';
import ItemBoothWebinar from '../components/ItemBoothWebinar';
import { BOOTH_DETAILS, BOOTH_PRODUCT_CATEGORIES, GET_RECORDING_URL, DELETE_BOOKMARKS } from '../../../utils/Constants';
import ActivityIndicator from '../../../containers/ActivityIndicator';
import AlertModal from '../../../components/AlertModal';
import { saveBookmark, deleteBookmark } from '../../../utils/Repository';
import AboutText from '../../../components/AboutText';
import BoothInfo from './components/BoothInfo';
import BoothReps from './BoothReps';
import SectionHeader from './components/SectionHeader';
import SurveyAlert from '../../../components/SurveyAlert';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const BoothDetails = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const { booth } = route.params;
	const [boothDetail, setBoothDetail] = useState('');
	const [boothRep, setBoothRep] = useState([]);

	const [loading, setLoading] = useState(true);
	const [productTabIndex, setProductTabIndex] = useState('');

	const [productStatus, setProductStatus] = useState('');
	const [productCategories, setProductCategories] = useState([]);
	const [selectedProductId, setSelectedProductId] = useState(0);
	const [productsList, setProductsList] = useState([]);
	const [filterProductsList, setFilterProductsList] = useState([]);

	const [videoStatus, setVideoStatus] = useState('');
	const [documentStatus, setDocumentStatus] = useState('');
	const [resourcesCategories, setResourcesCategories] = useState(0);
	const [resourcesDocsList, setResourcesDocsList] = useState([]);
	const [resourcesVideosList, setResourcesVideosList] = useState([]);

	const [webinarStatus, setWebinarStatus] = useState('');
	const [webinarCategories, setwebinarCategories] = useState([
		{ value: 'All', selected: true },
		{ value: 'Upcoming', selected: false },
		{
			value: 'Live',
			selected: false
		},
		{ value: 'Recorded', selected: false }
	]);
	const webinarCatLlistRef = useRef(null);
	const [webinarsList, setWebinarsList] = useState([]);
	const [filterWebinarList, setFilterWebinarList] = useState([]);

	const [alertVisibility, setAlertVisibility] = useState(false);
	const [bookMarked, setBookMarked] = useState(booth.bookmark != '');
	const [bookMarkType, setBookMarkType] = useState('');
	const [bookMarkTypeId, setBookMarkTypeId] = useState('');
	const [progressVisible, setProgressVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const [surveyVisible, setSurveyVisible] = useState(true);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getBoothDetails();
			getBoothProducts();
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async () => {
					getData();
				}
			});
		}
	};

	const getBoothDetails = async () => {
		await axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + BOOTH_DETAILS}/${booth.id}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				if (response.data._metadata.status === 'SUCCESS') {
					setBoothDetail(response.data.records);
					setBoothRep(response.data.records.booth_rep);
					setProductsList(response.data.records.products);
					setFilterProductsList(response.data.records.products);
					setResourcesDocsList(response.data.records.documents);
					setResourcesVideosList(response.data.records.booth_videos);
					setWebinarsList(response.data.records.webinars);
					setFilterWebinarList(response.data.records.webinars);
					response.data.records.menu.map(ele => {
						if (ele.booth_template_menu.title == 'Videos') {
							setVideoStatus(ele.status);
						} else if (ele.booth_template_menu.title == 'Documents') {
							setDocumentStatus(ele.status);
						} else if (ele.booth_template_menu.title == 'Products') {
							setProductStatus(ele.status);
						} else if (ele.booth_template_menu.title == 'Webinars') {
							setWebinarStatus(ele.status);
						}

						if (productStatus == 1 && webinarStatus == 1 && (videoStatus == 1 || documentStatus == 1)) {
							setProductTabIndex(0);
						} else if (productStatus == 1 && webinarStatus == '' && (videoStatus == '' || documentStatus == '')) {
							setProductTabIndex(0);
						} else if (productStatus == '' && webinarStatus == '' && (videoStatus == 1 || documentStatus == 1)) {
							setProductTabIndex(1);
						} else if (productStatus == '' && webinarStatus == 1 && (videoStatus == '' || documentStatus == '')) {
							setProductTabIndex(2);
						} else {
							setProductTabIndex('');
						}
					});
				}
				setLoading(false);
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				setLoading(false);
			});
	};

	const getBoothProducts = () => {
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + BOOTH_PRODUCT_CATEGORIES + booth.id,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				if (response.data._metadata.status === 'SUCCESS') {
					console.log(response.data.records);
					setProductCategories(response.data.records);
				}
			})
			.catch(e => {
				console.log(JSON.stringify(e));
				setLoading(false);
			});
	};

	function saveBookMark(type, id) {
		saveBookmark(type, id).then(res => {
			setBoothDetail({ ...boothDetail, bookmark: res });
		});
	}

	const deleteBookMark = (type, typeId) => {
		deleteBookmark(type, typeId);
		setBoothDetail({ ...boothDetail, bookmark: '' });
		setAlertVisibility(false);
	};

	const showAlert = (type, id) => {
		setBookMarkType(type);
		setBookMarkTypeId(id);
		setAlertVisibility(true);
	};

	const downloadDocument = file => {
		setProgressVisible(true);
		const fileName = file.substring(file.lastIndexOf('/') + 1);
		RNFetchBlob.config({
			addAndroidDownloads: {
				useDownloadManager: true, // <-- this is the only thing required
				notification: true,
				// mime : 'text/plain',
				description: 'Downloading Handout'
			},
			fileCache: true
		})
			.fetch('GET', file, {})
			.progress({ count: 1, interval: 1 }, onProgress)
			.then(() => {
				alert(`file downloaded:\n${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`);
				setProgressVisible(false);
				setProgress(0);
			});
	};

	const onProgress = (written, total) => {
		setProgress((written / total) * 100); // %age
	};

	const Header = () => (
		<View style={styles.headerContaier}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: RFValue(12) }
				]}
				onPress={() => navigation.goBack()}>
				<IonIcons name='ios-chevron-back-sharp' size={RFValue(24)} color='#7E8389' />
			</Pressable>
			<View style={styles.headerRightIconsContainer}>
				{/* <Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						{ borderRadius: RFValue(10), marginRight: RFValue(20) }
					]}
				>
					<FeatherIcon name='search' size={RFValue(20)} color='#7E8389' />
				</Pressable> */}

				{loading ? null : (
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
							},
							styles.onPressBookmarkIcon
						]}
						onPress={() => (boothDetail.bookmark !== '' ? showAlert('booth', booth.id) : saveBookMark('booth', booth.id))}>
						<FIcon
							name={boothDetail.bookmark !== '' ? 'bookmark' : 'bookmark-o'}
							size={RFValue(20)}
							color={boothDetail.bookmark !== '' ? colors.primaryColor : '#7E8389'}
						/>
					</Pressable>
				)}
				{/* <Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						{ borderRadius: RFValue(2) }
					]}
					onPress={onPressOptions}
				>
					<FeatherIcon
						name='more-vertical'
						size={RFValue(20)}
						color='#7E8389'
					/>
				</Pressable> */}
			</View>
		</View>
	);

	const onShare = async () => {
		try {
			const result = await Share.share({
				message: booth.share_url
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

	const onPressOptions = () => {
		ActionSheet.options({
			options: [
				{
					text: 'share',
					onPress: () => {
						onShare();
					}
				}
			],
			cancel: { onPress: () => console.log('cancel') }
		});
	};

	// Booth Products

	const BoothItems = () => (
		<View style={styles.tabContainer}>
			{productStatus == 1 ? (
				<Pressable
					onPress={() => setProductTabIndex(0)}
					style={[
						styles.productsTab,
						{
							borderColor: productTabIndex === 0 ? colors.primaryColor : '#fff'
						}
					]}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: productTabIndex === 0 ? colors.primaryColor : 'grey'
							}
						]}>
						PRODUCTS
					</Text>
				</Pressable>
			) : null}
			{documentStatus !== 1 && videoStatus !== 1 ? null : (
				<Pressable
					onPress={() => setProductTabIndex(1)}
					style={[
						styles.productsTab,
						{
							borderColor: productTabIndex === 1 ? colors.primaryColor : '#fff'
						}
					]}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: productTabIndex === 1 ? colors.primaryColor : 'grey'
							}
						]}>
						RESOURCES
					</Text>
				</Pressable>
			)}

			{webinarStatus == 1 ? (
				<Pressable
					onPress={() => setProductTabIndex(2)}
					style={[
						styles.productsTab,
						{
							borderColor: productTabIndex === 2 ? colors.primaryColor : '#fff'
						}
					]}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: productTabIndex === 2 ? colors.primaryColor : 'grey'
							}
						]}>
						WEBINARS
					</Text>
				</Pressable>
			) : null}
		</View>
	);

	const filterProducts = categoryId => {
		setFilterProductsList(productsList.filter(data => data.category_id === categoryId));
		setSelectedProductId(categoryId);
	};

	// Booth products

	const ProductCatList = () => (
		<FlatList
			contentContainerStyle={styles.productCat}
			showsHorizontalScrollIndicator={false}
			ListHeaderComponent={
				<Pressable
					style={[
						styles.productItem,
						{
							backgroundColor: selectedProductId == 0 ? colors.primaryColor : '#F2F2F2'
						}
					]}
					onPress={() => {
						setFilterProductsList(productsList);
						setSelectedProductId(0);
					}}>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoDetailR16,
							{
								color: selectedProductId == 0 ? 'white' : 'grey'
							}
						]}>
						All
					</Text>
				</Pressable>
			}
			horizontal
			data={productCategories}
			renderItem={({ item, index }) => (
				<Pressable
					style={[
						styles.productItem,
						{
							backgroundColor: selectedProductId === item.id ? colors.primaryColor : '#F2F2F2'
						}
					]}
					onPress={() => {
						filterProducts(item.id);
					}}>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoDetailR16,
							{
								color: selectedProductId == item.id ? 'white' : 'grey'
							}
						]}>
						{item.name}
					</Text>
				</Pressable>
			)}
		/>
	);

	const productSeparator = () => (
		<View
			style={{
				marginBottom: 32
			}}
		/>
	);

	const bookmarkProduct = (res, type, index) => {
		if (type == 0) {
			filterProductsList[index].bookmark = {
				id: res.id,
				type_id: res.type_id
			};
			productsList[index].bookmark = {
				id: res.id,
				type_id: res.type_id
			};
		} else {
			filterProductsList[index].bookmark = '';
			productsList[index].bookmark = '';
		}
		setFilterProductsList(filterProductsList);
		setProductsList(productsList);
	};

	const ProductsSection = () => (
		<View>
			<FlatList
				data={filterProductsList.slice(0, 6)}
				numColumns={2}
				horizontal={false}
				contentContainerStyle={{
					alignItems: 'center',
					marginTop: 20
				}}
				keyExtractor={item => item}
				ListEmptyComponent={loading ? <ActivityIndicator /> : null}
				ItemSeparatorComponent={productSeparator}
				renderItem={({ item, index }) => (
					<ItemBoothProduct
						data={item}
						index={index}
						onPress={() => {
							navigation.navigate('BoothProductDetails', {
								booth,
								data: item,
								onCallBack: (res, type) => {
									bookmarkProduct(res, type, index);
								}
							});
						}}
					/>
				)}
			/>
			{productsList.length > 6 ? (
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.viewAllContainer
					]}
					onPress={() => {
						navigation.navigate('AllProducts', {
							productsList,
							productCategories
						});
					}}>
					<Text style={styles.viewAll}>View All</Text>
				</Pressable>
			) : null}
		</View>
	);

	// Booth Resources
	const updateVideoResource = (index, res) => {
		resourcesVideosList[index].briefcase = { id: res.id, type_id: res.type_id };
		setResourcesVideosList(resourcesVideosList);
	};

	const DeleteVideoBriefCase = index => {
		resourcesVideosList[index].briefcase = '';
		setResourcesVideosList(resourcesVideosList);
	};

	const updateDocsResource = (index, res) => {
		resourcesDocsList[index].briefcase = { id: res.id, type_id: res.type_id };
		setResourcesDocsList(resourcesDocsList);
	};

	const DeleteDocsBriefCase = index => {
		resourcesDocsList[index].briefcase = '';
		setResourcesDocsList(resourcesDocsList);
	};

	const resourcseSeparator = () => (
		<View
			style={{
				marginBottom: 24
			}}
		/>
	);
	const ResourcesSecction = () => (
		<View>
			<SectionHeader length={resourcesVideosList.length + resourcesDocsList.length} text='Items' about={false} />

			{resourcesVideosList.length > 0 || resourcesDocsList.length > 0 ? (
				<View style={styles.categoriesTypeContainer}>
					<Pressable
						onPress={() => setResourcesCategories(0)}
						style={[
							styles.tab,
							{
								backgroundColor: resourcesCategories === 0 ? colors.primaryColor : '#F2F2F2'
							}
						]}>
						<Text
							style={[
								exStyles.infoDetailR16,
								,
								{
									color: resourcesCategories === 0 ? 'white' : 'grey'
								}
							]}>
							Videos
						</Text>
					</Pressable>
					<Pressable
						onPress={() => setResourcesCategories(1)}
						style={[
							styles.tab,
							{
								backgroundColor: resourcesCategories === 1 ? colors.primaryColor : '#F2F2F2'
							}
						]}>
						<Text
							style={[
								exStyles.infoDetailR16,
								{
									color: resourcesCategories === 1 ? 'white' : 'grey'
								}
							]}>
							Documents
						</Text>
					</Pressable>
				</View>
			) : null}

			{resourcesCategories === 0 ? (
				<FlatList
					data={resourcesVideosList}
					contentContainerStyle={{ marginTop: 24 }}
					ItemSeparatorComponent={resourcseSeparator}
					renderItem={({ item, index }) => (
						<ItemBoothResourceVideos
							data={item}
							index={index}
							updateVideoResource={updateVideoResource}
							DeleteVideoBriefCase={DeleteVideoBriefCase}
							onPress={() => {
								navigation.navigate('WebviewScreen', {
									title: item.title,
									link: `https://www.youtube.com/watch?v=${item.video_id}`
								});
							}}
						/>
					)}
				/>
			) : (
				<FlatList
					data={resourcesDocsList}
					contentContainerStyle={{ marginTop: 40 }}
					ItemSeparatorComponent={resourcseSeparator}
					renderItem={({ item, index }) => (
						<ItemBoothResourceDocs
							data={item}
							index={index}
							updateDocsResource={updateDocsResource}
							DeleteDocsBriefCase={DeleteDocsBriefCase}
							onPress={() => {
								// navigation.navigate("WebviewScreen", {
								//   title: item.title,
								//   link: item.file,
								//   // backOnLoad: true,
								// });
								// console.error(JSON.stringify(item))
								if (Platform.OS === 'ios') {
									navigation.navigate('WebviewScreen', { link: item.file });
								} else {
									downloadDocument(item.file);
								}
							}}
						/>
					)}
				/>
			)}
		</View>
	);

	// BoothWeinar
	const getRecordingUrl = data => {
		// alert()
		setLoading(true);
		axios({
			method: 'GET',
			url: `${ShareData.getInstance().baseUrl + GET_RECORDING_URL}/${data.instance_id}`,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				setLoading(false);
				// console.error(JSON.stringify(response.data));
				if (response.data._metadata.status === 'SUCCESS') {
					// navigation.navigate("LiveWebinar", {
					//   link: item.start_url,
					// });
				}
			})
			.catch(e => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const WebinarCatList = () => (
		<FlatList
			contentContainerStyle={styles.productCat}
			ref={webinarCatLlistRef}
			showsHorizontalScrollIndicator={false}
			horizontal
			data={webinarCategories}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						styles.productItem,
						{
							backgroundColor: item.selected ? colors.primaryColor : colors.unSelected
						}
					]}
					onPress={() => {
						webinarCatLlistRef.current.scrollToIndex({
							index,
							viewPosition: 0.5
						});
						const d = [...webinarCategories];
						for (let i = 0; i < d.length; i++) {
							const element = d[i];
							if (i === index) {
								d[i].selected = true;
							} else {
								d[i].selected = false;
							}
						}
						setwebinarCategories(d);
						if (item.value == 'All') {
							setFilterWebinarList(webinarsList);
						} else {
							setFilterWebinarList(webinarsList.filter(data => data.status == item.value.toLocaleLowerCase()));
						}
					}}>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoDetailR16,
							{
								color: item.selected ? 'white' : colors.secondaryText
							}
						]}>
						{item.value}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);
	const webinarSeparator = () => (
		<View
			style={{
				height: 1,
				backgroundColor: '#000000',
				opacity: 0.2,
				marginVertical: RFValue(24),
				marginHorizontal: RFValue(24)
			}}
		/>
	);
	const WebinarSection = () => (
		<View>
			<SectionHeader length={webinarsList.length} text='Webinars' about={false} />
			{webinarsList.length > 0 ? <WebinarCatList /> : null}
			<FlatList
				data={filterWebinarList}
				ItemSeparatorComponent={webinarSeparator}
				contentContainerStyle={{
					marginTop: 24
				}}
				renderItem={({ item, index }) => (
					<ItemBoothWebinar
						data={item}
						index={index}
						onPress={() => {
							navigation.navigate('WebinarDetails', {
								webinar: item,
								briefcaseCallback: null
							});
						}}
					/>
				)}
			/>
		</View>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
			<StatusBar theme='light' backgroundColor='white' barStyle='dark-content' />
			<Header />
			<ScrollView style={{ flex: 1, backgroundColor: colors.white }} contentContainerStyle={{ paddingBottom: 10 }}>
				<BoothInfo
					theme={theme}
					booth={booth}
					boothCat={boothDetail.booth_categories}
					boothOwner={boothDetail.booth_owner}
					boothRep={boothRep}
					navigation={navigation}
				/>
				<View style={{ marginTop: 30 }}>
					<SectionHeader length='' text='About Booth' about />
					<View style={{ marginHorizontal: 20, marginTop: 32 }}>
						<AboutText about='' text={booth.description} justify />
					</View>
					<BoothReps boothRep={boothRep} navigation={navigation} />
				</View>
				{loading ? null : <BoothItems />}
				{productTabIndex === 0 ? (
					<>
						<SectionHeader length={productsList.length} text='Products' about={false} />
						{ProductCatList()}
						<ProductsSection />
					</>
				) : productTabIndex === 1 ? (
					<ResourcesSecction />
				) : productTabIndex === 2 ? (
					<WebinarSection />
				) : null}
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
			<SurveyAlert
				visible={booth.name == 'Vexpo' ? surveyVisible : false}
				navigation={navigation}
				url='https://form.jotform.com/220132178815451'
				onClose={() => setSurveyVisible(false)}
			/>
			{/* {progressVisible ? (
				<ProgressDialog
					progress={progress}
					visible
					onCancel={() => setProgressVisible(false)}
				/>
			) : null} */}
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	// Header styling
	headerContaier: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		height: RFValue(40)
	},
	headerRightIconsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	},
	onPressBookmarkIcon: {
		padding: 2,
		borderRadius: 4,
		marginRight: RFValue(20)
	},

	// booth products, res, and webinar Tab
	tabContainer: {
		flexDirection: 'row',
		borderTopWidth: 1,
		borderBottomWidth: 1,
		borderColor: '#ececec',
		marginTop: 40
	},
	productsTab: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
		borderBottomWidth: 2
	},

	// Booth Products list

	productCat: {
		alignItems: 'center',
		marginTop: RFValue(24),
		paddingLeft: RFValue(33)
	},
	productItem: {
		marginEnd: RFValue(15),
		paddingVertical: RFValue(4),
		justifyContent: 'center',
		paddingHorizontal: RFValue(12),
		borderRadius: RFValue(10)
	},

	// sort
	sortItemContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		backgroundColor: '#ececec',
		paddingHorizontal: 20,
		paddingVertical: 4,
		borderRadius: 3
	},
	onPressSortStyle: { borderRadius: 20 },

	// Resources
	categoriesTypeContainer: {
		flexDirection: 'row',
		marginTop: RFValue(24),
		justifyContent: 'center',
		paddingHorizontal: 32
	},

	tab: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 4,
		marginRight: 16,
		paddingHorizontal: 12,
		borderRadius: 10,
		width: RFValue(132)
	},

	tabText: {
		fontSize: 16,
		fontWeight: '500',
		lineHeight: 24
	},

	// booth rep
	boothRepContainer: {
		flexDirection: 'row',
		paddingHorizontal: 30,
		alignItems: 'center',
		paddingVertical: RFValue(6)
	},
	boothRepImage: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(60)
	},
	boothRep: {
		paddingVertical: 2,
		paddingHorizontal: 12,
		borderRadius: 10,
		marginEnd: 8,
		backgroundColor: '#2775EE'
	},
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
	},

	// ViewAll
	viewAllContainer: { alignSelf: 'center', marginTop: 24 },
	viewAll: {
		fontSize: 18,
		color: '#FB275D',
		fontWeight: '500',
		lineHeight: 20,
		textDecorationLine: 'underline'
	}
});
export default withDimensions(withTheme(memo(BoothDetails)));
