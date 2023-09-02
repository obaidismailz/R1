import * as React from 'react';
import { memo, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, SafeAreaView, TouchableOpacity, Text, Animated } from 'react-native';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import { useIsFocused } from '@react-navigation/native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ItemHallsListView, ItemHallsView } from './components';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import ActivityIndicator from '../../containers/ActivityIndicator';
import { getActiveHalls } from '../../apis/LoopExpoApi';
import { getNotifications } from '../../apis/Notifications';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Halls = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [notificationBadge, setNotificationBadge] = useState('');
	const [halls, setHalls] = useState([]);
	const [tabIndex, setTabIndex] = useState(0);
	const [xTabOne, setXTabOne] = useState(0);
	const [xTabTwo, setXTabTwo] = useState(0);
	const [translateX, setTranslateX] = useState(new Animated.Value(0));

	useEffect(() => {
		getData();
	}, []);

	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			getNotifications()
				.then(resp => {
					setNotificationBadge(resp.notification_count);
				})
				.catch(() => {});
		}
	}, [isFocused]);

	const handleSlide = type => {
		Animated.spring(translateX, {
			toValue: type,
			duration: 250
		}).start();
	};

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getHalls();
		} else {
			noInternetAlert({
				onPress: async () => {
					getData();
				}
			});
		}
	};

	const getHalls = () => {
		setLoading(true);
		getActiveHalls().then(response => {
			if (response._metadata.status === 'SUCCESS') {
				setHalls(response.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const renderTabs = () => (
		<View
			style={{
				backgroundColor: colors.secondaryColor,
				paddingBottom: 4
			}}>
			<View style={styles.tabbarContainer}>
				<Animated.View
					style={[
						styles.animatedView,
						{
							marginLeft: tabIndex === 0 ? 1 : 0,
							transform: [
								{
									translateX
								}
							]
						}
					]}
				/>
				<TouchableOpacity
					style={[styles.tab]}
					onLayout={event => setXTabOne(event.nativeEvent.layout.x)}
					onPress={() => {
						handleSlide(xTabOne);
						setTabIndex(0);
					}}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 0 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 0 ? '700' : '500'
							}
						]}>
						Offices View
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab]}
					onLayout={event => setXTabTwo(event.nativeEvent.layout.x)}
					onPress={() => {
						handleSlide(xTabTwo);
						setTabIndex(1);
					}}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 1 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 1 ? '700' : '500'
							}
						]}>
						List View
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const hallsListSeparator = () => <View style={{ marginBottom: 40 }} />;

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle={'light-content'} />
			<Header
				title='S Offices'
				theme={theme}
				badgeCount={notificationBadge}
				onMenuPress={() => {
					navigation.toggleDrawer();
				}}
				// onChangeSearch={(txt) => {}}
				// onCartPress={() => {
				// 	navigation.navigate('MyCart');
				// }}
				onNotificationPress={() => {
					navigation.navigate('Notifications');
				}}
				onSearchPress={txt => {
					navigation.navigate('GenericSearch');
				}}
			/>

			{renderTabs()}
			<View style={{ backgroundColor: colors.white, flex: 1 }}>
				{tabIndex == 0 ? (
					loading ? (
						<ActivityIndicator absolute size='large' theme={theme} />
					) : (
						<FlatList
							style={{ flex: 1 }}
							data={halls}
							contentContainerStyle={{ paddingHorizontal: RFValue(16) }}
							ListEmptyComponent={
								loading ? (
									<ActivityIndicator absolute size='large' theme={theme} />
								) : (
									<Text style={[exStyles.infoLargeM18, { alignSelf: 'center', color: colors.primaryText }]}>
										Offices not available{' '}
									</Text>
								)
							}
							renderItem={({ item, index }) => (
								<ItemHallsView
									data={item}
									onPress={() =>
										navigation.navigate('HallDetails', {
											hall: item
										})
									}
								/>
							)}
						/>
					)
				) : tabIndex == 1 ? (
					<FlatList
						style={{ flex: 1 }}
						data={halls}
						ItemSeparatorComponent={hallsListSeparator}
						ListHeaderComponent={
							<Text style={[exStyles.infoLink14Med, styles.hallCount]}>
								{halls.length > 1 ? `${halls.length} Offices` : null}
							</Text>
						}
						contentContainerStyle={{
							paddingHorizontal: RFValue(16)
						}}
						renderItem={({ item, index }) => <ItemHallsListView data={item} />}
					/>
				) : null}
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
	tabText: {
		fontWeight: '600'
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10)
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey',
		marginBottom: RFValue(3)
	}
});

// home tab whole, auditorim

// export default memo(Halls);
export default withDimensions(withTheme(memo(Halls)));
