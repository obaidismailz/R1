import * as React from 'react';
import { memo, useState, useRef, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, Dimensions, FlatList, TouchableOpacity, Text } from 'react-native';
import { Header, ActivityIndicator } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import { useIsFocused } from '@react-navigation/native';
import { ItemWebinarList } from './components';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import { GET_ALL_WEBINARS } from '../../utils/Constants';
import { getNotifications } from '../../apis/Notifications';
import BlinkView from 'react-native-smooth-blink-view';
import { useSelector } from 'react-redux';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Auditorium = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const isFocused = useIsFocused();
	const data = useSelector(state => state.webinars);
	const [webinarCategories, setwebinarCategories] = useState([]);
	const webinarCatLlistRef = useRef(null);
	const [webinarsList, setWebinarsList] = useState([]);
	const [filterWebinarList, setFilterWebinarList] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [notificationBadge, setNotificationBadge] = useState('');

	useEffect(() => {
		getData();
		if (isFocused && ShareData.getInstance().shouldRefreshAuditoriums) {
			if (isFocused) {
				getNotifications()
					.then(resp => {
						setNotificationBadge(resp.notification_count);
					})
					.catch(() => {});
			}
		}
		return () => {
			setFilterWebinarList([]);
			setWebinarsList([]);
		};
	}, [isFocused]);

	const getData = () => {
		setwebinarCategories([
			{ value: 'All', selected: true },
			{ value: 'Upcoming', selected: false },
			{
				value: 'Live',
				selected: false
			},
			{ value: 'Recorded', selected: false }
		]);
		if (ShareData.getInstance().internetConnected) {
			getwebinars(true, 'All');
		} else {
			noInternetAlert({
				onPress: async () => {
					getData();
				}
			});
		}
	};

	const getwebinars = (reload, tab) => {
		setLoading(true);
		setFilterWebinarList([]);
		setWebinarsList([]);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_ALL_WEBINARS,
			headers: {
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(response => {
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setWebinarsList(response.data.records);
					if (reload) {
						setFilterWebinarList(response.data.records);
					} else {
						setFilterWebinarList(webinarsList.filter(data => data.status == tab));
					}
				}
			})
			.catch(e => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const listSeparator = () => <View style={styles.separatorView} />;

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
							getwebinars(true, 'All');
							// setFilterWebinarList(webinarsList);
						} else {
							getwebinars(false, item.value.toLocaleLowerCase());
							// setTimeout(() => {

							// }, 2000);
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
					{data.liveWebinars.length > 0 && (
						<BlinkView
							containerStyle={{
								backgroundColor: item.selected ? 'white' : 'red',
								width: index === 2 ? 8 : 0,
								height: item.value === 'Live' ? 8 : 0,
								borderRadius: 10,
								justifyContent: 'center',
								alignItems: 'center',
								marginLeft: item.value === 'Live' ? 8 : 0
							}}
							delayVisible={500}
							delayInvisible={0}
							duration={500}
							blinking></BlinkView>
					)}
				</TouchableOpacity>
			)}
		/>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<Header
				title='Events'
				theme={theme}
				badgeCount={notificationBadge}
				onMenuPress={() => {
					navigation.toggleDrawer();
				}}
				onNotificationPress={() => {
					navigation.navigate('Notifications');
				}}
				onSearchPress={txt => {
					navigation.navigate('GenericSearch');
				}}
			/>
			<View
				style={{
					flex: 1,
					backgroundColor: colors.white
				}}>
				<FlatList
					showsVerticalScrollIndicator={false}
					data={filterWebinarList}
					ItemSeparatorComponent={listSeparator}
					ListHeaderComponent={<WebinarCatList />}
					ListFooterComponent={<View style={{ height: 24 }} />}
					ListEmptyComponent={
						loading ? (
							<ActivityIndicator absolute size='large' theme={theme} />
						) : (
							<Text style={[exStyles.infoLargeM18, { alignSelf: 'center', color: colors.primaryText }]}>
								Webinars not available{' '}
							</Text>
						)
					}
					renderItem={({ item, index }) => (
						<View
							style={{
								width: '100%',
								justifyContent: 'center'
							}}>
							<ItemWebinarList
								data={item}
								onPress={() => {
									navigation.navigate('WebinarDetails', {
										webinar: item,
										briefcaseCallback: () => {}
									});
								}}
							/>
						</View>
					)}
					refreshing={false}
					onRefresh={() => {
						getData();
					}}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	tabbarContainer: {
		flexDirection: 'row',
		backgroundColor: 'white',
		marginHorizontal: 8,
		paddingHorizontal: 2,
		borderRadius: 10
	},
	animatedView: {
		position: 'absolute',
		width: '50%',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		marginVertical: 2,
		backgroundColor: colors.secondaryColor,
		borderRadius: 8
	},
	tab: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		paddingVertical: 6
	},
	hallCount: {
		color: colors.secondaryText,
		marginVertical: 8,
		marginBottom: 20,
		textAlign: 'center'
	},

	productCat: {
		alignItems: 'center',
		marginVertical: 24,
		paddingLeft: 16
	},
	productItem: {
		marginEnd: RFValue(15),
		paddingVertical: RFValue(4),
		justifyContent: 'center',
		paddingHorizontal: RFValue(12),
		borderRadius: RFValue(10)
	},
	separatorView: {
		marginStart: 24,
		marginEnd: 24,
		marginVertical: 24,
		height: 1,
		backgroundColor: colors.separatorColor
	}
});

// home tab whole, auditorim

// export default memo(Auditorium);
export default withDimensions(withTheme(memo(Auditorium)));
