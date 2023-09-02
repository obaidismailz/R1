import * as React from 'react';
import { memo, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import TimeLineScreen from '../WorkSpee/views/NewsFeed';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import Attendees from './Attendees';
import MyTimeLine from './MyTimeLine';
import { getNotifications } from '../../apis/Notifications';
import { useIsFocused } from '@react-navigation/native';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Social = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const [tabIndex, setTabIndex] = useState(0);
	const [xTabOne, setXTabOne] = useState(0);
	const [xTabTwo, setXTabTwo] = useState(0);
	const [xTabThree, setXTabThree] = useState(0);
	const [translateX, setTranslateX] = useState(new Animated.Value(0));
	const [notificationBadge, setNotificationBadge] = useState('');

	useEffect(() => {
		ShareData.getInstance()
			.loadShareData()
			.then(() => {});
	}, []);

	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused)
			getNotifications()
				.then(resp => {
					setNotificationBadge(resp.notification_count);
				})
				.catch(() => {});
	}, [isFocused]);

	const handleSlide = type => {
		Animated.spring(translateX, {
			toValue: type,
			duration: 250
		}).start();
	};

	const renderTabs = () => (
		<View
			style={{
				backgroundColor: colors.secondaryColor,
				paddingBottom: 4
			}}>
			<View style={styles.tabbarContainer}>
				{/* <Animated.View
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
				/> */}
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 0 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => setTabIndex(0)}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 0 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 0 ? '700' : '500'
							}
						]}>
						NewsFeed
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 1 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => setTabIndex(1)}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 1 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 1 ? '700' : '500'
							}
						]}>
						My Timeline
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 2 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => setTabIndex(2)}>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 2 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 2 ? '700' : '500'
							}
						]}>
						Attendees
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle={'light-content'} />
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<Header
					title='Community'
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
				{tabIndex === 0 ? (
					<TimeLineScreen />
				) : tabIndex === 1 ? (
					<MyTimeLine navigation={navigation} route={route} isMasterDetail={isMasterDetail} />
				) : tabIndex === 2 ? (
					<Attendees navigation={navigation} isMasterDetail={isMasterDetail} route={route} {...props} />
				) : null}
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	tabbarContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		marginHorizontal: 8,
		paddingHorizontal: 2,
		paddingVertical: 2,
		borderRadius: 10
	},
	animatedView: {
		position: 'absolute',
		width: '33%',
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
		borderRadius: 8,
		paddingVertical: 4
	}
});

// home tab whole, auditorim

// export default memo(Lobby);
export default withDimensions(withTheme(memo(Social)));
