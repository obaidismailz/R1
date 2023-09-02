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
	TouchableOpacity,
	FlatList,
	Animated
} from 'react-native';
import { Header, ActivityIndicator } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { ACTIVE_AUDITORIUMS } from '@utils/Constants';
import { ShareData } from '@utils';
import { noInternetAlert } from '@utils/Network';
import { ItemAuditoriumView, ItemAuditoruimList } from './components';
import { colors, exStyles } from '../../styles';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Auditorium = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [webinarCategories, setWebinarCategories] = useState([
		{ value: 'All Webinars', selected: true },
		{ value: 'Upcoming', selected: false },
		{
			value: 'Past',
			selected: false
		},
		{ value: 'Recent', selected: false }
	]);
	const [auditoriums, setAuditoriums] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [tabIndex, setTabIndex] = useState(0);
	const webinarCatLlistRef = useRef(null);

	const [xTabOne, setXTabOne] = useState(0);
	const [xTabTwo, setXTabTwo] = useState(0);
	const [translateX, setTranslateX] = useState(new Animated.Value(0));

	useEffect(() => {
		getData();
	}, []);

	const handleSlide = (type) => {
		Animated.spring(translateX, {
			toValue: type,
			duration: 250
		}).start();
	};

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getAuditoriums();
		} else {
			noInternetAlert({
				onPress: async() => {
					getData();
				}
			});
		}
	};

	const getAuditoriums = () => {
		setLoading(true);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + ACTIVE_AUDITORIUMS,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoading(false);
				console.error(JSON.stringify(response.data));
				if (response.data._metadata.status === 'SUCCESS') {
					setAuditoriums(response.data.records);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const renderTabs = () => (
		<View
			style={{
				backgroundColor: colors.secondaryColor,
				paddingBottom: 4
			}}
		>
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
					}}
				>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 0 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 0 ? '700' : '500'
							}
						]}
					>
						Auditorium View
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[styles.tab]}
					onLayout={event => setXTabTwo(event.nativeEvent.layout.x)}
					onPress={() => {
						handleSlide(xTabTwo);
						setTabIndex(1);
					}}
				>
					<Text
						style={[
							exStyles.TopTabSM14,,
							{
								color: tabIndex === 1 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 1 ? '700' : '500'
							}
						]}
					>
						List View
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	const listSeparator = () => <View style={{ marginBottom: 40 }} />;

	return (
		<SafeAreaView
			theme={theme}
			style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}
		>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<Header
				title='Auditorium'
				theme={theme}
				onMenuPress={() => {
					navigation.toggleDrawer();
				}}
				onChangeSearch={(txt) => {}}
				onNotificationPress={() => {
					navigation.navigate('Notifications');
				}}
			/>
			{renderTabs()}
			<View
				style={{
					flex: 1,
					backgroundColor: colors.white
				}}
			>
				{tabIndex == 0 ? (
					loading ? (
						<ActivityIndicator absolute size='large' theme={theme} />
					) : (
						<FlatList
							data={auditoriums.filter(item => item.name.includes(search))}
							contentContainerStyle={{ marginHorizontal: RFValue(16) }}
							renderItem={({ item, index }) => (
								<ItemAuditoriumView
									data={item}
									onPress={() => {
										navigation.navigate('AuditoriumDetails', {
											auditorium: item
										});
									}}
								/>
							)}
						/>
					)
				) : tabIndex == 1 ? (
					<FlatList
						style={{ flex: 1 }}
						data={auditoriums.filter(item => item.name.includes(search))}
						ItemSeparatorComponent={listSeparator}
						ListHeaderComponent={(
							<Text style={[exStyles.infoLink14Med, styles.hallCount]}>
								{`${ auditoriums.length } Auditorium`}
							</Text>
						)}
						contentContainerStyle={{
							paddingHorizontal: RFValue(16)
						}}
						renderItem={({ item, index }) => <ItemAuditoruimList data={item} />}
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
	}
});

// home tab whole, auditorim

// export default memo(Auditorium);
export default withDimensions(withTheme(memo(Auditorium)));
