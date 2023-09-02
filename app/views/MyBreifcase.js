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
	TouchableOpacity,
	Platform,
	Modal
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { noInternetAlert } from '@utils/Network';
import {
	ProgressDialog,
	Header,
	FormButton,
	ActivityIndicator,
	NoRecordFound
} from '@components';
import RNFetchBlob from 'rn-fetch-blob';

import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import {
	getBriefcases as getBriefcasesApi,
	deleteBriefcase as deleteBriefcaseApi
} from '@apis/BriefcaseApis';
import ItemAuditoriumResource from './Auditorium/components/ItemAuditoriumResource';
import StatusBar from '../containers/StatusBar';
import { themes } from '../constants/colors';
import { withDimensions } from '../dimensions';
import { withTheme } from '../theme';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const MyBookmarks = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [loading, setLoading] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [progressVisible, setProgressVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const [confirmationPopup, setConfirmationPopup] = useState(false);
	const [currentItem, setCurrentItem] = useState({ id: '', type: '' });

	const webinarCatLlistRef = useRef(null);
	const [filter, setFilter] = useState('');

	const [myBreifcaseFillter, setMyBreifcaseFillter] = useState([
		{ value: 'Webinars', selected: true, key: 'webinar' },
		{ value: 'Documents', selected: false, key: 'document' },
		{ value: 'Videos', selected: false, key: 'video' },
		{ value: 'Handout', selected: false, key: 'handout' }
	]);
	const [bookmarks, setBookmarks] = useState([]);
	let downloading = null;
	useEffect(() => {
		getData();
	}, [useIsFocused()]);

	useEffect(() => {
		myBreifcaseFillter.forEach((element) => {
			if (element.selected) {
				setFilter(element.key);
			}
		});
	}, [myBreifcaseFillter]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getBriefcase();
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

	const getBriefcase = () => {
		setLoading(true);
		getBriefcasesApi()
			.then((response) => {
				setLoadingDone(true);
				setLoading(false);

				if (response.data._metadata.status === 'SUCCESS') {
					console.error('briefcases ' + JSON.stringify(response.data.records));
					setBookmarks(response.data.records);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const briefcaseCallback = (resp) => {
		getBriefcase();
	};

	const deleteBookmarks = () => {
		const params = {
			type: currentItem.type,
			type_id: currentItem.id
		};
		setLoading(true);
		deleteBriefcaseApi(params)
			.then((response) => {
				console.error(JSON.stringify(response.data));
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					getBriefcase();
				}
			})
			.catch((e) => {
				setLoading(false);
				console.error(JSON.stringify(e));
			});
	};

	const downloadDocument = (file) => {
		setProgressVisible(true);
		const fileName = file.substring(file.lastIndexOf('/') + 1);
		downloading = RNFetchBlob.config({
			addAndroidDownloads: {
				useDownloadManager: true, // <-- this is the only thing required
				notification: true,
				// mime : 'text/plain',
				description: 'Downloading Handout'
			},
			fileCache: true,
			path: `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`
		}).fetch('GET', file, {});

		downloading.progress({ count: 1, interval: 1 }, onProgress).then(() => {
			alert(`file downloaded:\n${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}`);
			setProgressVisible(false);
			setProgress(0);
		});
	};

	const onProgress = (written, total) => {
		setProgress((written / total) * 100); // %age
	};

	const stopDownloading = () => {
		setProgressVisible(false);
		setProgress(0); // %age
		if (downloading !== undefined && downloading.cancel !== undefined) {
			downloading.cancel((err) => { });
		}
	};

	const renderFilters = () => (
		<FlatList
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingVertical: 16
			}}
			ref={webinarCatLlistRef}
			horizontal
			style={{
				backgroundColor: 'white',
				paddingStart: RFValue(10)
			}}
			data={myBreifcaseFillter}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						styles.itemFilter,
						{
							backgroundColor: item.selected
								? colors.primaryColor
								: colors.unSelected
						}
					]}
					onPress={() => {
						const d = [...myBreifcaseFillter];
						for (let i = 0; i < d.length; i++) {
							const element = d[i];
							if (i === index) {
								d[i].selected = true;
							} else {
								d[i].selected = false;
							}
						}
						setMyBreifcaseFillter(d);
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

	const ConfirmationPopup = ({ ...props }) => (
		<Modal
			transparent
			animationType='fade'
			backdropColor='black'
			backdropOpacity={0.5}
			onRequestClose={() => {
				console.log('Modal has been closed.');
			}}
			{...props}
		>
			<View style={styles.modalStyle}>
				<View style={styles.layoutStyle}>
					<Text
						style={{
							color: 'black',
							fontSize: RFValue(18),
							textAlign: 'center'
						}}
					>
						Are you sure you want to remove this Bookmark?
					</Text>
					<View style={{ flexDirection: 'row', marginTop: RFValue(15) }}>
						<FormButton
							isWhite
							extraStyle={{ flex: 1, marginEnd: RFValue(10) }}
							textStyle={{ fontSize: RFValue(20) }}
							title='Cancel'
							onPress={() => setConfirmationPopup(false)}
						/>
						<FormButton
							extraStyle={{ flex: 1, marginStart: RFValue(10) }}
							textStyle={{ fontSize: RFValue(20) }}
							title='Yes'
							onPress={() => {
								setConfirmationPopup(false);
								deleteBookmarks();
							}}
						/>
					</View>
				</View>
			</View>
		</Modal>
	);

	return (
		<>
			<SafeAreaView
				style={{ backgroundColor: themes[theme].headerBackground }}
			/>
			<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
				<StatusBar
					theme={theme}
					backgroundColor={themes[theme].headerBackground}
				/>

				<View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
					<Header
						title='My Briefcase'
						theme={theme}
						onBackPress={() => {
							navigation.goBack();
						}}
						onChangeSearch={(txt) => { }}
					/>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							backgroundColor: 'white'
						}}
					>
						{renderFilters()}
					</View>

					<FlatList
						data={bookmarks.filter(item => item.type.includes(filter))}
						renderItem={({ item }) => (
							<ItemAuditoriumResource
								style={{
									borderBottomWidth: 1,
									borderColor: '#cecece',
									overflow: 'hidden'
								}}
								file_extension={item.type === 'handout' ? "pdf" : item.document && item.document.file_extension}
								image={
									item.type === 'webinar'
										? item.webinar.image
										: item.type === 'handout' ? item.webinar.handout_image
											: item.type === 'video'
												? `https://img.youtube.com/vi/${item.video.video_id}/hqdefault.jpg`
												: item.type === 'document'
													? item.document.file
													: ''
								}
								handout_title={
									item.type === 'webinar'
										? item.webinar.topic
										: item.type === 'handout' ? item.webinar.topic
											: item.type === 'video'
												? item.video.title
												: item.type === 'document'
													? item.document.title
													: ''
								}
								detail={
									item.type === 'handout' ? "Document" :
										item.type === 'webinar'
											? item.webinar.handout_title
											// : item.type === 'handout' ? item.webinar.handout_title
											: item.type === 'video'
												? 'Video'
												: item.type === 'document'
													? 'Document'
													: ''
								}
								isBriefcased
								onBreifcase={() => {
									if (item.type === 'webinar') {
										setCurrentItem({ id: item.webinar.id, type: item.type });
									} else if (item.type === 'handout') {
										setCurrentItem({ id: item.webinar.id, type: item.type });
									} else if (item.type === 'video') {
										setCurrentItem({ id: item.video.id, type: item.type });
									} else {
										setCurrentItem({ id: item.document.id, type: item.type });
									}
									setConfirmationPopup(true);
								}}
								onPress={() => {
									if (item.type === 'webinar' || item.type === 'handout') {
										navigation.navigate('WebinarDetails', {
											webinar: {
												...item.webinar,
												image: ''
											},
											getWebinarID: true,
											briefcaseCallback
										});
									} else if (item.type === 'video') {
										navigation.navigate('WebviewScreen', {
											title: item.video.title,
											link: `https://www.youtube.com/watch?v=${item.video_id}`
										});
									} else if (Platform.OS === 'ios') {
										navigation.navigate('WebviewScreen', {
											link: item.document.file
										});
									} else {
										downloadDocument(item.document.file);
									}
								}}
							/>
						)}
					/>

					<ConfirmationPopup visible={confirmationPopup} />

					{loadingDone
						&& bookmarks.filter(item => item.type.includes(filter)).length
						=== 0 && <NoRecordFound />}
				</View>
				{loading ? (
					<ActivityIndicator absolute size='large' theme={theme} />
				) : null}
				{/* {progressVisible ? (
          <ProgressDialog
            progress={progress}
            visible
            onCancel={stopDownloading}
          />
        ) : null} */}
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
	itemFilter: {
		marginEnd: RFValue(15),
		paddingVertical: 4,
		justifyContent: 'center',
		paddingHorizontal: 12,
		borderRadius: 10
	}
});

// home tab whole, auditorim

// export default memo(Lobby);
export default withDimensions(withTheme(memo(MyBookmarks)));
