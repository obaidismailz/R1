import React, { Component } from 'react';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerNavigationState } from '@react-navigation/native';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import FastImage from '@rocket.chat/react-native-fast-image';

import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { ScrollView, Text, TouchableWithoutFeedback, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { dequal } from 'dequal';
import FontIcon5 from 'react-native-vector-icons/FontAwesome5';
import FontIcon from 'react-native-vector-icons/FontAwesome';
import IonIcons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import CookieManager from '@react-native-cookies/cookies';
import AsyncStorage from '@react-native-community/async-storage';

import Avatar from '../../containers/Avatar';
import Status from '../../containers/Status/Status';
import log, { events, logEvent } from '../../utils/log';
import I18n from '../../i18n';
import scrollPersistTaps from '../../utils/scrollPersistTaps';
import { CustomIcon } from '../../lib/Icons';
import { themes } from '../../constants/colors';
import { withTheme } from '../../theme';
import { getUserSelector } from '../../selectors/login';
// import SafeAreaView from '../../containers/SafeAreaView';
import Navigation from '../../lib/Navigation';
import SidebarItem from './SidebarItem';
import styles from './styles';
import { DrawerParamList } from '../../stacks/types';
import { logout as logoutAction } from '../../actions/login';
import { clearPosts as clearPostsAction } from '../../actions/social/newsfeed';
import AppVersion from '../../containers/AppVersion';
import { showErrorAlert, showConfirmationAlert } from '../../utils/info';
import { appStart as appStartAction, ROOT_LOADING } from '../../actions/app';
import database from '../../lib/database';
interface ISeparatorProps {
	theme: string;
}

// TODO: remove this
const Separator = React.memo(({ theme }: ISeparatorProps) => (
	<View style={[styles.separator, { borderColor: themes[theme].separatorColor }]} />
));

interface ISidebarState {
	showStatus: boolean;
}

interface ISidebarProps {
	baseUrl: string;
	navigation: DrawerNavigationProp<DrawerParamList>;
	state: DrawerNavigationState<DrawerParamList>;
	Site_Name: string;
	user: {
		statusText: string;
		status: string;
		username: string;
		name: string;
		roles: string[];
	};
	theme?: string;
	loadingServer: boolean;
	useRealName: boolean;
	allowStatusMessage: boolean;
	isMasterDetail: boolean;
	viewStatisticsPermission: string[];
	viewRoomAdministrationPermission: string[];
	viewUserAdministrationPermission: string[];
	viewPrivilegedSettingPermission: string[];
}

class Sidebar extends Component<ISidebarProps, ISidebarState> {
	constructor(props: ISidebarProps) {
		super(props);
		this.state = {
			showStatus: false,
			isAdmin: false,
			url: '',
			userName: '',
			profileImage: '',
			email: ''
		};
	}

	componentDidMount() {
		this.loadUserData();
	}

	async loadUserData() {
		const value = await AsyncStorage.getItem('url');

		let domain = '';
		if (value != null) {
			domain = value.toUpperCase();
		}

		const valueData = await AsyncStorage.getItem('user');

		const data = JSON.parse(valueData);
		console.error(`=>${ data.email }`);
		this.setState({
			url: domain,
			userName: `${ data.fname } ${ data.lname }`,
			profileImage: data.image,
			email: data.email
		});
	}

	shouldComponentUpdate(nextProps: ISidebarProps, nextState: ISidebarState) {
		const { showStatus } = this.state;
		const {
			Site_Name,
			user,
			baseUrl,
			state,
			isMasterDetail,
			useRealName,
			theme,
			viewStatisticsPermission,
			viewRoomAdministrationPermission,
			viewUserAdministrationPermission,
			viewPrivilegedSettingPermission
		} = this.props;
		// Drawer navigation state
		if (state?.index !== nextProps.state?.index) {
			return true;
		}
		if (nextState.showStatus !== showStatus) {
			return true;
		}
		if (nextProps.Site_Name !== Site_Name) {
			return true;
		}
		if (nextProps.Site_Name !== Site_Name) {
			return true;
		}
		if (nextProps.baseUrl !== baseUrl) {
			return true;
		}
		if (nextProps.theme !== theme) {
			return true;
		}
		if (!dequal(nextProps.user, user)) {
			return true;
		}
		if (nextProps.isMasterDetail !== isMasterDetail) {
			return true;
		}
		if (nextProps.useRealName !== useRealName) {
			return true;
		}
		if (!dequal(nextProps.viewStatisticsPermission, viewStatisticsPermission)) {
			return true;
		}
		if (!dequal(nextProps.viewRoomAdministrationPermission, viewRoomAdministrationPermission)) {
			return true;
		}
		if (!dequal(nextProps.viewUserAdministrationPermission, viewUserAdministrationPermission)) {
			return true;
		}
		if (!dequal(nextProps.viewPrivilegedSettingPermission, viewPrivilegedSettingPermission)) {
			return true;
		}
		return false;
	}

	getIsAdmin() {
		const {
			user,
			viewStatisticsPermission,
			viewRoomAdministrationPermission,
			viewUserAdministrationPermission,
			viewPrivilegedSettingPermission
		} = this.props;
		const { roles } = user;
		const allPermissions = [
			viewStatisticsPermission,
			viewRoomAdministrationPermission,
			viewUserAdministrationPermission,
			viewPrivilegedSettingPermission
		];
		let isAdmin = false;

		if (roles) {
			isAdmin = allPermissions.reduce((result: boolean, permission) => {
				if (permission) {
					return result || permission.some(r => roles.indexOf(r) !== -1);
				}
				return result;
			}, false);
		}
		return isAdmin;
	}

	sidebarNavigate = (route: string) => {
		// @ts-ignore
		logEvent(events[`SIDEBAR_GO_${route.replace('StackNavigator', '').replace('View', '').toUpperCase()}`]);
		Navigation.navigate(route);
	};

	get currentItemKey() {
		const { state } = this.props;
		return state?.routeNames[state?.index];
	}

	onPressUser = () => {
		const { navigation, isMasterDetail } = this.props;
		if (isMasterDetail) {
			return;
		}
		navigation.closeDrawer();
	};

	checkCookiesAndLogout = async() => {
		const { logout, user, clearPosts } = this.props;
		const db = database.servers;
		const usersCollection = db.collections.get('users');
		clearPosts();
		try {
			const userRecord = await usersCollection.find(user.id);
			if (!userRecord.loginEmailPassword) {
				showConfirmationAlert({
					title: I18n.t('Clear_cookies_alert'),
					message: I18n.t('Clear_cookies_desc'),
					confirmationText: I18n.t('Clear_cookies_yes'),
					dismissText: I18n.t('Clear_cookies_no'),
					onPress: async() => {
						await CookieManager.clearAll(true);

						logout();
					},
					onCancel: () => {
						logout();
					}
				});
			} else {
				logout();
			}
		} catch {
			// Do nothing: user not found
		}
	};

	handleLogout = () => {
		logEvent(events.SE_LOG_OUT);
		showConfirmationAlert({
			message: I18n.t('You_will_be_logged_out_of_this_application'),
			confirmationText: I18n.t('Logout'),
			onPress: this.checkCookiesAndLogout
		});
	};

	renderAdmin = () => {
		const { theme, isMasterDetail } = this.props;
		if (!this.getIsAdmin()) {
			return null;
		}
		const routeName = isMasterDetail ? 'AdminPanelView' : 'AdminPanelStackNavigator';
		return (
			<>
				<Separator theme={theme!} />
				<SidebarItem
					text={I18n.t('Admin_Panel')}
					left={<CustomIcon name='settings' size={20} color={themes[theme!].titleText} />}
					onPress={() => this.sidebarNavigate(routeName)}
					testID='sidebar-admin'
					theme={theme!}
					current={this.currentItemKey === routeName}
				/>
			</>
		);
	};

	
	ItemDrawer = props => (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.itemDrawerContainer}
			onPress={props.onPress && props.onPress}
		>
			<View
				style={{
					width: RFValue(50),
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				{props.icon}
			</View>
			<Text
				style={[
					exStyles.infoLink14Med,
					{ flex: 1, color: 'black', opacity: 0.87 }
				]}
			>
				{props.textContent}
			</Text>
			{props.badgeCount
				&& props.badgeCount !== 0
				&& props.badgeCount !== ''
				&& props.badgeCount !== '0' && (
				<View style={styles.badgeContainer}>
					<Text style={[exStyles.infoLink14Med, styles.txtBadge]}>
						{props.badgeCount}
					</Text>
				</View>
			)}
		</TouchableOpacity>
	);

	DrawerHeader = () => (
		<View style={styles.headerContainer}>
			<TouchableOpacity
				onPress={() => this.props.navigation.navigate('Settings')}
			>
				<IonIcons
					name='settings'
					size={24}
					color='white'
					style={{ alignSelf: 'flex-end' }}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					marginTop: 8,
					justifyContent: 'center',
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center'
				}}
				activeOpacity={0.75}
				onPress={() => {
					this.props.navigation.closeDrawer();
					this.props.navigation.navigate('ProfileStackNavigator');
				}}
			>
				<FastImage
					style={styles.imgProfilePic}
					source={{ uri: ShareData.getInstance().image }}
				/>
				<View style={{ justifyContent: 'center', width: '73%' }}>
					<Text style={[exStyles.infoLargeM16, { color: 'white' }]}>
						{ShareData.getInstance().name}
					</Text>
					<Text
						numberOfLines={1}
						style={[
							exStyles.descriptionSmallText,
							{ color: 'white', width: '90%' }
						]}
					>
						{ShareData.getInstance().email}
					</Text>
				</View>
				<MIcons
					name='keyboard-arrow-right'
					size={36}
					style={{ right: 24 }}
					color='white'
				/>
			</TouchableOpacity>
		</View>
	);

	renderNavigation = () => {
		const { theme } = this.props;
		return (
			<>
				<SidebarItem
					text={I18n.t('Chats')}
					left={<CustomIcon name='message' size={20} color={themes[theme!].titleText} />}
					onPress={() => this.sidebarNavigate('ChatsStackNavigator')}
					testID='sidebar-chats'
					theme={theme!}
					current={this.currentItemKey === 'ChatsStackNavigator'}
				/>
				<SidebarItem
					text={I18n.t('Profile')}
					left={<CustomIcon name='user' size={20} color={themes[theme!].titleText} />}
					onPress={() => this.sidebarNavigate('ProfileStackNavigator')}
					testID='sidebar-profile'
					theme={theme!}
					current={this.currentItemKey === 'ProfileStackNavigator'}
				/>
				<SidebarItem
					text={I18n.t('Display')}
					left={<CustomIcon name='sort' size={20} color={themes[theme!].titleText} />}
					onPress={() => this.sidebarNavigate('DisplayPrefStackNavigator')}
					testID='sidebar-display'
					theme={theme!}
					current={this.currentItemKey === 'DisplayPrefStackNavigator'}
				/>
				<SidebarItem
					text={I18n.t('Settings')}
					left={<CustomIcon name='administration' size={20} color={themes[theme!].titleText} />}
					onPress={() => this.sidebarNavigate('SettingsStackNavigator')}
					testID='sidebar-settings'
					theme={theme!}
					current={this.currentItemKey === 'SettingsStackNavigator'}
				/>
				{this.renderAdmin()}
			</>
		);
	};

	renderCustomStatus = () => {
		const { user, theme } = this.props;
		return (
			<SidebarItem
				text={user.statusText || I18n.t('Edit_Status')}
				left={<Status size={24} status={user?.status} />}
				theme={theme!}
				right={<CustomIcon name='edit' size={20} color={themes[theme!].titleText} />}
				onPress={() => this.sidebarNavigate('StatusView')}
				testID='sidebar-custom-status'
			/>
		);
	};

	render() {
		const { user, Site_Name, baseUrl, useRealName, allowStatusMessage, isMasterDetail, theme } = this.props;

		if (!user) {
			return null;
		}
		//old RC Drawer
		// return (
		// 	<SafeAreaView testID='sidebar-view' style={{ backgroundColor: themes[theme!].focusedBackground }} vertical={isMasterDetail}>
		// 		<ScrollView
		// 			style={[
		// 				styles.container,
		// 				{
		// 					backgroundColor: isMasterDetail ? themes[theme!].backgroundColor : themes[theme!].focusedBackground
		// 				}
		// 			]}
		// 			{...scrollPersistTaps}>
		// 			<TouchableWithoutFeedback onPress={this.onPressUser} testID='sidebar-close-drawer'>
		// 				<View style={styles.header}>
		// 					<Avatar text={user.username} style={styles.avatar} size={30} />
		// 					<View style={styles.headerTextContainer}>
		// 						<View style={styles.headerUsername}>
		// 							<Text numberOfLines={1} style={[styles.username, { color: themes[theme!].titleText }]}>
		// 								{useRealName ? user.name : user.username}
		// 							</Text>
		// 						</View>
		// 						<Text
		// 							style={[styles.currentServerText, { color: themes[theme!].titleText }]}
		// 							numberOfLines={1}
		// 							accessibilityLabel={`Connected to ${baseUrl}`}>
		// 							{Site_Name}
		// 						</Text>
		// 					</View>
		// 				</View>
		// 			</TouchableWithoutFeedback>

		// 			<Separator theme={theme!} />

		// 			{allowStatusMessage ? this.renderCustomStatus() : null}
		// 			{!isMasterDetail ? (
		// 				<>
		// 					<Separator theme={theme!} />
		// 					{this.renderNavigation()}
		// 					<Separator theme={theme!} />
		// 				</>
		// 			) : (
		// 				<>{this.renderAdmin()}</>
		// 			)}
		// 		</ScrollView>
		// 	</SafeAreaView>
		// );
	
		return (
			<>
				<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
				<SafeAreaView
					testID='sidebar-view'
					style={{ backgroundColor: '#fff', flex: 1 }}
					vertical={isMasterDetail}
					theme={theme}
				>
					<this.DrawerHeader />
					<ScrollView
						showsVerticalScrollIndicator={false}
						style={[
							styles.container,
							{
								backgroundColor: isMasterDetail
									? themes[theme].backgroundColor
									: themes[theme].focusedBackground
							}
						]}
						{...scrollPersistTaps}
					>
						<this.ItemDrawer
							icon={(
								<MCIcons
									name='qrcode-scan'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='My QR Code'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('QRCodeView', {
									qrImage: null,
									user: null
								});
							}}
						/>
						<this.ItemDrawer
							icon={(
								<FontIcon
									name='bookmark'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='My Bookmarks'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('MyBookmarks');
							}}
						/>
						<this.ItemDrawer
							icon={(
								<IonIcons
									name='briefcase'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='My Briefcase'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('MyBreifcase');
							}}
						/>
						<this.ItemDrawer
							icon={(
								<FontIcon5
									name='calendar-alt'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='My Calendar'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('Calendar');
							}}
						/>
						<this.ItemDrawer
							icon={(
								<FontIcon
									name='address-book'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='Exchange Contacts'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('ExchangeContactStackNavigator');
							}}
						/>
						{/* <View style={styles.itemSeparator} />
						<this.ItemDrawer
							icon={(
								<Entypo
									name='shopping-cart'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='My Cart'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('MyCart');
							}}
						/>
						<this.ItemDrawer
							icon={(
								<FontIcon5
									name='clipboard-list'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='My Orders'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('MyOrders');
							}}
						/> */}
						{/* <View style={styles.itemSeparator} />
						<this.ItemDrawer
							icon={(
								<Entypo
									name='bar-graph'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='Leaderboards'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('LeaderBoard');
							}}
						/>
						<this.ItemDrawer
							icon={(
								<MCIcons
									name='ship-wheel'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='Spin the wheel'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('GamificationView');
							}}
						/>

						<this.ItemDrawer
							icon={(
								<FontIcon5
									name='poll-h'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='Surveys and Polls'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('SurveysPolls');
							}}
						/>

						<this.ItemDrawer
							icon={(
								<MCIcons
									name='treasure-chest'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='Scavanger Hunt'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('ScavangerHunt');
							}}
						/> */}
						<View style={styles.itemSeparator} />
						<this.ItemDrawer
							icon={(
								<Entypo
									name='help-with-circle'
									size={24}
									color={colors.secondaryText}
								/>
							)}
							textContent='FAQs & Help'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('FAQScreen');
							}}
						/>
						<this.ItemDrawer
							icon={
								<FontIcon5 name='lock' size={24} color={colors.secondaryText} />
							}
							textContent='Privacy Policy'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.props.navigation.navigate('PrivacyPolicy');
							}}
						/>
						<this.ItemDrawer
							icon={
								<MCIcons name='logout' size={24} color={colors.secondaryText} />
							}
							textContent='Logout'
							onPress={() => {
								this.props.navigation.closeDrawer();
								this.handleLogout();
							}}
						/>
					</ScrollView>
					<View
						style={{
							alignItems: 'center',
							backgroundColor: isMasterDetail
								? themes[theme].backgroundColor
								: themes[theme].focusedBackground
						}}
					>
						<AppVersion theme={theme} />
						{/* <Text
							style={[exStyles.infoLink14Med, { color: 'rgba(0,0,0,0.4)' }]}
						>
							{LOOPEXPO_APP_VERSION}
						</Text> */}
						<View
							style={{
								flexDirection: 'row',
								marginTop: 8
							}}
						>
							<Text
								style={[
									exStyles.infoLargeM16,
									{ color: colors.primaryText, alignSelf: 'flex-end' }
								]}
							>
								{'Powered by  '}
							</Text>
							<FastImage
								style={{
									width: RFValue(60),
									height: 32,
									padding: 2
								}}
								source={require('../../assets/Images/logo3x.png')}
							/>
						</View>
					</View>
				</SafeAreaView>
			</>
		)
	}
}

const mapStateToProps = (state: any) => ({
	Site_Name: state.settings.Site_Name,
	user: getUserSelector(state),
	baseUrl: state.server.server,
	loadingServer: state.server.loading,
	useRealName: state.settings.UI_Use_Real_Name,
	allowStatusMessage: state.settings.Accounts_AllowUserStatusMessageChange,
	isMasterDetail: state.app.isMasterDetail,
	viewStatisticsPermission: state.permissions['view-statistics'],
	viewRoomAdministrationPermission: state.permissions['view-room-administration'],
	viewUserAdministrationPermission: state.permissions['view-user-administration'],
	viewPrivilegedSettingPermission: state.permissions['view-privileged-setting']
});

const mapDispatchToProps = dispatch => ({
	logout: () => dispatch(logoutAction()),
	selectServerRequest: params => dispatch(selectServerRequestAction(params)),
	toggleCrashReport: params => dispatch(toggleCrashReportAction(params)),
	toggleAnalyticsEvents: params => dispatch(toggleAnalyticsEventsAction(params)),
	appStart: params => dispatch(appStartAction(params)),
	clearPosts: () => dispatch(clearPostsAction())
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Sidebar)) as any;
