import * as React from 'react';
import {
	memo, useRef, useState, useEffect
} from 'react';
import {
	View,
	Text,
	Pressable,
	SafeAreaView,
	StyleSheet,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	FlatList
} from 'react-native';
import {
	Header,
	ActivityIndicator,
	NoRecordFound,
	AboutText
} from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { GET_WEBINARS } from '@utils/Constants';
import { ShareData } from '@utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';
import HTML from 'react-native-render-html';
import { mapValues } from 'lodash';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { ItemWebinarList } from './components';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const AuditoriumDetails = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { auditorium } = route.params;
	const [webinarCategories, setWebinarCategories] = useState([
		{ value: 'All', selected: true, key: '' },
		{ value: 'Upcoming', selected: false, key: 'upcoming' },
		{ value: 'Live', selected: false, key: 'live' },
		{
			value: 'Past',
			selected: false,
			key: 'recorded'
		}
	]);
	const [filter, setFilter] = useState('');
	const [auditoriums, setAuditoriums] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [search, setSearch] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);
	const webinarCatLlistRef = useRef(null);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getWebinars();
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

	useEffect(() => {
		webinarCategories.forEach((element) => {
			if (element.selected) {
				setFilter(element.key);
			}
		});
	}, [webinarCategories]);

	const briefcaseCallback = (resp) => {
		setAuditoriums(a => a.map((item, index) => {
			if (index === currentIndex) {
				return { ...item, briefcase: resp };
			} else {
				return item;
			}
		}));
	};

	const getWebinars = () => {
		setLoading(true);
		axios({
			method: 'GET',
			url: `${ ShareData.getInstance().baseUrl + GET_WEBINARS }/${ auditorium.id }`,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoadingDone(true);
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setAuditoriums(response.data.records);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const renderWebinarFilters = () => (
		<FlatList
			contentContainerStyle={styles.filterList}
			ref={webinarCatLlistRef}
			horizontal
			style={{
				flex: 0,
				flexGrow: 0
			}}
			data={webinarCategories}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						{
							backgroundColor: item.selected
								? colors.primaryColor
								: colors.unSelected
						},
						styles.containerFilterItem
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
						setWebinarCategories(d);
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

	const webinarSeparator = () => (
		<View
			style={{
				marginVertical: 24,
				height: 0.5,
				backgroundColor: 'black',
				opacity: 0.2,
				marginStart: RFValue(24)
			}}
		/>
	);

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
				<Header
					title={auditorium.name}
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
					// onChangeSearch={(txt) => {}}
				/>

				<ScrollView style={{ flex: 1 }}>
					<View>
						<FastImage
							style={styles.imgBanner}
							source={{
								uri: auditorium.image,
								headers: RocketChatSettings.customHeaders,
								priority: FastImage.priority.high
							}}
						/>

						<Text style={[exStyles.ButtonSM20, styles.txtTitle]}>
							{auditorium.name}
						</Text>

						<View style={styles.containerDescription}>
							<AboutText
								about=' auditorium'
								text={auditorium.description}
								justify
							/>
						</View>

						<View style={styles.containerTicker}>
							<Text
								style={[exStyles.infolink14Med, { color: colors.primaryText }]}
							>
								{`${
									auditoriums.filter(item => item.status.includes(filter))
										.length
								} Webinars`}
							</Text>
							<Pressable
								style={({ pressed }) => [
									{
										backgroundColor: pressed
											? 'rgba(0, 0, 0, 0.06)'
											: 'transparent'
									},
									styles.onPressSortStyle
								]}
							>
								<MaterialIcons
									name='arrow-drop-down'
									size={RFValue(24)}
									color={colors.secondaryText}
								/>
							</Pressable>
						</View>

						{renderWebinarFilters()}
						<FlatList
							ItemSeparatorComponent={webinarSeparator}
							contentContainerStyle={{ marginTop: 40 }}
							data={auditoriums.filter(item => item.status.includes(filter))}
							renderItem={({ item, index }) => (
								<ItemWebinarList
									data={item}
									onPress={() => {
										navigation.navigate('WebinarDetails', {
											webinar: item,
											briefcaseCallback
										});
									}}
								/>
							)}
						/>
						{loadingDone
							&& auditoriums.filter(item => item.status.includes(filter))
								.length === 0 && (
								<NoRecordFound style={{ marginTop: RFValue(15) }} />
						)}
					</View>
				</ScrollView>
				{loading ? (
					<ActivityIndicator absolute size='large' theme={theme} />
				) : null}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	filterList: {
		alignItems: 'center',
		paddingTop: 24,
		paddingHorizontal: 32
	},
	containerFilterItem: {
		marginEnd: RFValue(15),
		paddingVertical: 4,
		justifyContent: 'center',
		paddingHorizontal: RFValue(10),
		borderRadius: RFValue(10)
	},

	imgBanner: {
		height: screenWidth * 0.5,
		width: screenWidth,
		resizeMode: 'stretch'
	},

	onPressSortStyle: {
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 4
	},
	txtTitle: {
		color: colors.primaryText,
		marginVertical: RFValue(16),
		marginHorizontal: RFValue(16)
	},
	containerDescription: {
		marginHorizontal: RFValue(16),
		marginBottom: RFValue(10)
	},
	containerTicker: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 10,
		backgroundColor: colors.unSelected,
		paddingHorizontal: 24,
		paddingVertical: 4
	},
	imgDropDwn: {
		resizeMode: 'contain',
		height: RFValue(10),
		width: RFValue(10)
	}
});

export default withDimensions(withTheme(memo(AuditoriumDetails)));
