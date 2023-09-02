import * as React from 'react';
import {
	memo, useRef, useState, useEffect
} from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView as SafeAreaViewNative,
	StyleSheet,
	Pressable,
	Dimensions,
	FlatList,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native';
import { LoadingDialog } from '@components';
import IonIcons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import { GET_NOTIFICATIONS, READ_NOTIFICATIONS } from '@utils/Constants';
import { noInternetAlert } from '@utils/Network';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import StatusBar from '../../containers/StatusBar';
import SafeAreaView from '../../containers/SafeAreaView';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Notifications = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [notifications, setNotifications] = useState([]);
	const [count, setcount] = useState('');
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const listRef = useRef(undefined);

	useEffect(() => {
		setPage(1);
		getData();
	}, [useIsFocused()]);

	// useEffect(() => {
	// 	let tempCount = 0;
	// 	notifications.forEach(element => {
	// 		element.user_notifications[0].is_read !== 1 && ++tempCount;
	// 	});
	// 	setcount(tempCount)
	// }, [notifications]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getNotifications()
				.then((data) => {
					if (data.data !== undefined && data.data.length > 0) {
						setcount(data.notification_count);
						setNotifications(n => [...n, ...data.data]);
						setPage(data.current_page + 1);
						readNotification();
					}
				})
				.catch((e) => {});
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

	const getNotifications = async() => new Promise((resolve, reject) => {
		setLoading(true);
		axios({
			method: 'GET',
			url: `${
				ShareData.getInstance().baseUrl + GET_NOTIFICATIONS
			}?page=${ page }&count=20`,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoading(false);
				if (response.status === 200 || response.status === 600) {
					if (response.data._metadata.status === 'SUCCESS') {
						resolve(response.data.records);
					} else {
						reject(response.data._metadata.message);
					}
				} else {
					reject('Failed to get Notifications, Please try again ');
				}
			})
			.catch((error) => {
				setLoading(false);
				reject(`Failed to get Notifications, Please try again ${ error }`);
			});
	});

	const readNotification = async() => {
		axios({
			method: 'POST',
			url: ShareData.getInstance().baseUrl + READ_NOTIFICATIONS,
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		});
	};

	return (
		<>
			<SafeAreaViewNative style={{ backgroundColor: colors.secondaryColor }} />
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground,
					flex: 1
				}}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: '#fff',
						borderTopRightRadius: RFValue(40),
						borderTopLeftRadius: RFValue(40),
						overflow: 'hidden'
					}}
				>
					<View style={styles.header}>
						<Pressable
							style={({ pressed }) => [
								{
									backgroundColor: pressed
										? 'rgba(0, 0, 0, 0.06)'
										: 'transparent'
								},
								{ borderRadius: 24 / 2 }
							]}
							onPress={() => navigation.goBack()}
						>
							<IonIcons name='close' size={32} color={colors.secondaryText} />
						</Pressable>
						<Text
							style={[
								exStyles.mediumTitleMed20,
								{ flex: 1, color: colors.primaryText, textAlign: 'center' }
							]}
						>
							Notifications
						</Text>
					</View>

					{notifications.length !== 0 && count !== undefined && count !== '' ? (
						<Text
							style={[
								exStyles.infoLink14Med,
								{
									color: colors.secondaryText,
									alignSelf: 'center'
								}
							]}
						>
							You have{' '}
							<Text
								style={[
									exStyles.infoLink14Med,
									{ fontWeight: 'bold', color: colors.primaryText }
								]}
							>
								{`${ count } unread`}
							</Text>{' '}
							messages
						</Text>
					) : null}

					<FlatList
						ref={listRef}
						refreshing={loading}
						style={{ marginTop: 16 }}
						data={notifications}
						renderItem={({ item }) => (
							<ItemNotification
								data={item}
								onPress={() => {
									if (item.notification_type === 'webinar') {
										navigation.navigate('WebinarDetails', {
											webinar: { id: item.link }
										});
									}
								}}
							/>
						)}
						onEndReachedThreshold={0.01}
						onEndReached={({ distanceFromEnd }) => {
							getData();
						}}
						ListFooterComponent={() => (loading && notifications.length > 0 ? (
							<ActivityIndicator color={colors.secondaryColor} size='large' />
						) : null)
						}
					/>
				</View>
				{loading && notifications.length === 0 ? (
					<LoadingDialog visible />
				) : null}
			</SafeAreaView>
		</>
	);
};

const ItemNotification = props => (
	<TouchableOpacity
		activeOpacity={0.7}
		style={{
			width: screenWidth,
			paddingVertical: 16,
			paddingHorizontal: 16,
			flexDirection: 'row'
		}}
		onPress={props.onPress && props.onPress}
	>
		<Image
			style={{
				height: 32,
				width: 32,
				borderRadius: 32 / 2,
				resizeMode: 'contain'
			}}
			source={
				props.data.notification_type === 'announcement'
					? require('@assets/Announcement_Noti.png')
					: props.data.notification_type === 'user'
						? require('@assets/ExchangeContact_Noti.png')
						: require('@assets/Calendar_Noti.png')
			}
		/>
		<View style={{ flex: 1, marginStart: RFValue(10) }}>
			<Text style={[exStyles.infoDetailR16, { color: colors.secondaryText }]}>
				{props.data.description}
				{props.data.message !== undefined && props.data.message !== '' ? (
					<Text
						style={[
							exStyles.infoLargeM16,
							{
								color: colors.primaryText,
								fontWeight: '700'
							}
						]}
					>
						{`${ props.data.message } `}
					</Text>
				) : null}
			</Text>
			<Text
				style={[
					exStyles.infoLargeM16,
					{ color: colors.primaryText, fontWeight: '600' }
				]}
			>
				{moment(props.data.created_at).fromNow()}
			</Text>
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingTop: 24,
		paddingHorizontal: 24,
		marginBottom: 16,
		borderBottomWidth: 0.5,
		borderColor: 'rgba(	126, 131, 137, 0.2)',
		paddingBottom: 8
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10)
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey'
	},
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
	}
});

// home tab whole, auditorim

// export default memo(Lobby);
export default withDimensions(withTheme(memo(Notifications)));
