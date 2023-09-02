import React from 'react';
import { I18nManager } from 'react-native';
import { createStackNavigator, StackNavigationOptions, CardStyleInterpolators } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ThemeContext } from '../theme';
import { ModalAnimation, StackAnimation, defaultHeader, themedHeader } from '../utils/navigation';
import Sidebar from '../views/SidebarView';
// Chats Stack
import RoomView from '../views/RoomView';
import RoomsListView from '../views/RoomsListView';
import RoomActionsView from '../views/RoomActionsView';
import RoomInfoView from '../views/RoomInfoView';
import RoomInfoEditView from '../views/RoomInfoEditView';
import RoomMembersView from '../views/RoomMembersView';
import SearchMessagesView from '../views/SearchMessagesView';
import SelectedUsersView from '../views/SelectedUsersView';
import InviteUsersView from '../views/InviteUsersView';
import InviteUsersEditView from '../views/InviteUsersEditView';
import MessagesView from '../views/MessagesView';
import AutoTranslateView from '../views/AutoTranslateView';
import DirectoryView from '../views/DirectoryView';
import NotificationPrefView from '../views/NotificationPreferencesView';
import ForwardLivechatView from '../views/ForwardLivechatView';
import LivechatEditView from '../views/LivechatEditView';
import PickerView from '../views/PickerView';
import ThreadMessagesView from '../views/ThreadMessagesView';
import TeamChannelsView from '../views/TeamChannelsView';
import MarkdownTableView from '../views/MarkdownTableView';
import ReadReceiptsView from '../views/ReadReceiptView';
import CannedResponsesListView from '../views/CannedResponsesListView';
import CannedResponseDetail from '../views/CannedResponseDetail';
import { themes } from '../constants/colors';
// Profile Stack
import ProfileView from '../views/ProfileView';
import UserPreferencesView from '../views/UserPreferencesView';
import UserNotificationPrefView from '../views/UserNotificationPreferencesView';
// Display Preferences View
import DisplayPrefsView from '../views/DisplayPrefsView';
// Settings Stack
import SettingsView from '../views/SettingsView';
import SecurityPrivacyView from '../views/SecurityPrivacyView';
import E2EEncryptionSecurityView from '../views/E2EEncryptionSecurityView';
import LanguageView from '../views/LanguageView';
import ThemeView from '../views/ThemeView';
import DefaultBrowserView from '../views/DefaultBrowserView';
import ScreenLockConfigView from '../views/ScreenLockConfigView';
// Admin Stack
import AdminPanelView from '../views/AdminPanelView';
// NewMessage Stack
import NewMessageView from '../views/NewMessageView';
import CreateChannelView from '../views/CreateChannelView';
// E2ESaveYourPassword Stack
import E2ESaveYourPasswordView from '../views/E2ESaveYourPasswordView';
import E2EHowItWorksView from '../views/E2EHowItWorksView';
// E2EEnterYourPassword Stack
import E2EEnterYourPasswordView from '../views/E2EEnterYourPasswordView';
// InsideStackNavigator
import AttachmentView from '../views/AttachmentView';
import ModalBlockView from '../views/ModalBlockView';
import JitsiMeetView from '../views/JitsiMeetView';
import StatusView from '../views/StatusView';
import ShareView from '../views/ShareView';
import CreateDiscussionView from '../views/CreateDiscussionView';
import QueueListView from '../ee/omnichannel/views/QueueListView';
import AddChannelTeamView from '../views/AddChannelTeamView';
import AddExistingChannelView from '../views/AddExistingChannelView';
import SelectListView from '../views/SelectListView';
import DiscussionsView from '../views/DiscussionsView';
import {
	AdminPanelStackParamList,
	ChatsStackParamList,
	DisplayPrefStackParamList,
	DrawerParamList,
	E2EEnterYourPasswordStackParamList,
	E2ESaveYourPasswordStackParamList,
	InsideStackParamList,
	NewMessageStackParamList,
	ProfileStackParamList,
	SettingsStackParamList,
	TabParamList,
	SocialStackParamList,
	AuditoriumStackParamList
} from './types';

import { enableScreens } from 'react-native-screens';

import Exhibition from '../views/Exhibition';
import Auditorium from '../views/Auditorium';
import AuditoriumDetails from '../views/Auditorium/AuditoriumDetails';
import WebinarDetails from '../views/Auditorium/WebinarDetails';
import LiveWebinar from '../views/Auditorium/LiveWebinar';
import VideoPlayer from '../views/Auditorium/VideoPlayer';

import Notifications from '../views/Notifications/Notifications';

import Halls from '../views/Halls';
import HallDetails from '../views/Halls/HallDetails';
import BoothDetails from '../views/Halls/Booth/BoothDetails';
import BoothProductDetails from '../views/Halls/BoothProductDetails';
import AllProducts from '../views/Halls/AllProducts';
import Calendar from '../views/Calendar/Calendar';
import CreateMeeting from '../views/Calendar/BookMeeting';
import AttendeesCalendar from '../views/Calendar/AttendeesCalendar';

import Social from '../views/Social';
import LoopUserProfile from '../views/LoopUserProfile';
import Attendees from '../views/ExchangeContact/Attendees';
import ExchangeContactProfile from '../views/ExchangeContact/ExchangeContactProfile';

import TimeLineScreen from '../views/WorkSpee/views/NewsFeed';
import CreatePostView from '../views/WorkSpee/views/CreatePostView';
import CommnetsView from '../views/WorkSpee/views/CommentsView';
import EditPrivacyView from '../views/WorkSpee/views/EditPrivacyView';
import EditPostView from '../views/WorkSpee/views/EditPostView';

import MyBreifcase from '../views/MyBreifcase';
import MyBookmarks from '../views/MyBookmarks';
import GenericSearch from '../views/Searching/GenericSearch';
import Settings from '../views/Settings';
import ChangePassword from '../views/ChangePassword';

import WebviewScreen from '../views/WebviewScreen';
import Report from '../views/Report';
import ContactUs from '../views/ContactUs';
import FAQScreen from '../views/FAQScreen';
import PrivacyPolicy from '../views/PrivacyPolicy';
import AboutEvent from '../views/Exhibition/AboutEvent';

import MyCart from '../views/EComm/MyCart';
import CartDetails from '../views/EComm/CartDetails';
import MyOrders from '../views/EComm/MyOrders';
import OrderDetails from '../views/EComm/OrderDetails';
import AddAddress from '../views/EComm/AddAddress';
import MyAddress from '../views/EComm/MyAddress';

import Profile from '../views/User/Profile';
import EditProfile from '../views/User/EditProfile';
import Privacy from '../views/User/Privacy';

// workspee NewsFeed Stack
// workspee Inside StackNavigator
import CheckInView from '../views/WorkSpee/views/CreatePostView/PostTypes/CheckInView';
import GifView from '../views/WorkSpee/views/CreatePostView/PostTypes/GifView';
import MentionUserView from '../views/WorkSpee/views/CreatePostView/PostTypes/MentionUserView';
import CreatePollsView from '../views/WorkSpee/views/CreatePostView/PostTypes/CreatePollsView';
import FeelingActivties from '../views/WorkSpee/views/CreatePostView/PostTypes/FeelingActivties';
import Gamification from '../views/Gamification/SpinTheWheel';
import LeaderBoard from '../views/Gamification/LeaderBoard';
import QRCodeView from '../views/User/QRCodeView';
import Surveys from '../views/Gamification/SurveyPolls/Surveys';
import ScavangerHunt from '../views/Gamification/ScavangerHunt/ScavangerHunt';
import QRScanView from '../views/User/QRCodeScanner';
import AvailableSlots from '../views/Calendar/AvailableSlots';

import TabBar from './TabBar';
import { postFcmToken } from '@apis/Notifications';



const HallsStack = createStackNavigator<HallsStackParamList>();
const HallsStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<HallsStack.Navigator
			screenOptions={{
				...defaultHeader,
				...themedHeader(theme),
				...StackAnimation,
				headerShown: false
			}}
		>
			<HallsStack.Screen name='Halls' component={Halls} />
			<HallsStack.Screen name='HallDetails' component={HallDetails} />
		</HallsStack.Navigator>
	);
};

const AuditoriumStack = createStackNavigator<AuditoriumStackParamList>();
const AuditoriumStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<AuditoriumStack.Navigator
			screenOptions={{
				...defaultHeader,
				...themedHeader(theme),
				...StackAnimation,
				headerShown: false
			}}
		>
			<AuditoriumStack.Screen name='Auditorium' component={Auditorium} />
			<AuditoriumStack.Screen
				name='AuditoriumDetails'
				component={AuditoriumDetails}
			/>
			<AuditoriumStack.Screen
				name='WebinarDetails'
				component={WebinarDetails}
			/>
		</AuditoriumStack.Navigator>
	);
};

const SocialStack = createStackNavigator<SocialStackParamList>();
const SocialStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<SocialStack.Navigator
			screenOptions={{
				...defaultHeader,
				...themedHeader(theme),
				...StackAnimation,
				headerShown: false
			}}
		>
			<SocialStack.Screen name='Social' component={Social} />
			<SocialStack.Screen name='TimeLineScreen' component={TimeLineScreen} />
		</SocialStack.Navigator>
	);
};

// NewMessageStackNavigator
const ExchangeContact = createStackNavigator();
const ExchangeContactStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<ExchangeContact.Navigator
			screenOptions={{
				...defaultHeader,
				...themedHeader(theme),
				...StackAnimation,
				headerShown: false
			}}
		>
			<ExchangeContact.Screen
				name='ExchangeContactAttendees'
				component={Attendees}
				options={{ headerShown: false }}
			/>
			<ExchangeContact.Screen
				name='ExchangeContactProfile'
				component={ExchangeContactProfile}
				options={{
					headerShown: false,
					cardStyleInterpolator:
						CardStyleInterpolators.forRevealFromBottomAndroid
				}}
			/>
		</ExchangeContact.Navigator>
	);
};

const Tab = createBottomTabNavigator<TabParamList>();
const BotttomTabNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	enableScreens();
	return (
		<Tab.Navigator
			lazy
			detachInactiveScreens={false}
			backBehavior='initialRoute'
			tabBarOptions={{ keyboardHidesTabBar: true }}
			tabBar={props => <TabBar theme={theme} {...props} />}
		>	
			<Tab.Screen name='Exhibition' component={Exhibition} />
			<Tab.Screen name='HallsStack' component={HallsStackNavigator} />
			<Tab.Screen name='AuditoriumStack' component={AuditoriumStackNavigator} />
			<Tab.Screen
				name='SocialStackNavigator'
				component={SocialStackNavigator}
			/>
			<Tab.Screen name='Chat' component={ChatsStackNavigator} />
		</Tab.Navigator>
	);
};

// ChatsStackNavigator
const ChatsStack = createStackNavigator<ChatsStackParamList>();
const ChatsStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<ChatsStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<ChatsStack.Screen name='RoomsListView' component={RoomsListView} />
		</ChatsStack.Navigator>
	);
};

// ProfileStackNavigator
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	return (
		<ProfileStack.Navigator
		initialRouteName='Profile'
		screenOptions={{
			// ...defaultHeader,
			// ...themedHeader(theme),
			// ...StackAnimation,
			headerShown: false
		}}
			// screenOptions={{
			// 	...defaultHeader, ...themedHeader(theme), ...StackAnimation
			// } as StackNavigationOptions}
		>
			
			<ProfileStack.Screen name='Profile' component={Profile} />
			<ProfileStack.Screen name='EditProfile' component={EditProfile} />
			<ProfileStack.Screen
				name='Privacy'
				component={Privacy}
				options={{
					headerShown: false,
					cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
				}}
			/>
			{/* <ProfileStack.Screen name='ProfileView' component={ProfileView} options={ProfileView.navigationOptions} />
			<ProfileStack.Screen name='UserPreferencesView' component={UserPreferencesView} />
			<ProfileStack.Screen
				name='UserNotificationPrefView'
				component={UserNotificationPrefView}
				options={UserNotificationPrefView.navigationOptions}
			/>
			<ProfileStack.Screen name='PickerView' component={PickerView} options={PickerView.navigationOptions} /> */}
		</ProfileStack.Navigator>
	);
};

// SettingsStackNavigator
const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<SettingsStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<SettingsStack.Screen name='SettingsView' component={SettingsView} options={SettingsView.navigationOptions} />
			<SettingsStack.Screen name='SecurityPrivacyView' component={SecurityPrivacyView} />
			<SettingsStack.Screen
				name='E2EEncryptionSecurityView'
				component={E2EEncryptionSecurityView}
				options={E2EEncryptionSecurityView.navigationOptions}
			/>
			<SettingsStack.Screen name='LanguageView' component={LanguageView} options={LanguageView.navigationOptions} />
			<SettingsStack.Screen name='ThemeView' component={ThemeView} options={ThemeView.navigationOptions} />
			<SettingsStack.Screen
				name='DefaultBrowserView'
				component={DefaultBrowserView}
				options={DefaultBrowserView.navigationOptions}
			/>
			<SettingsStack.Screen
				name='ScreenLockConfigView'
				component={ScreenLockConfigView}
				options={ScreenLockConfigView.navigationOptions}
			/>
		</SettingsStack.Navigator>
	);
};

// AdminPanelStackNavigator
const AdminPanelStack = createStackNavigator<AdminPanelStackParamList>();
const AdminPanelStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<AdminPanelStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<AdminPanelStack.Screen name='AdminPanelView' component={AdminPanelView} options={AdminPanelView.navigationOptions} />
		</AdminPanelStack.Navigator>
	);
};

// DisplayPreferenceNavigator
const DisplayPrefStack = createStackNavigator<DisplayPrefStackParamList>();
const DisplayPrefStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<DisplayPrefStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<DisplayPrefStack.Screen name='DisplayPrefsView' component={DisplayPrefsView} />
		</DisplayPrefStack.Navigator>
	);
};

// DrawerNavigator
const Drawer = createDrawerNavigator<DrawerParamList>();
const DrawerNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<Drawer.Navigator
			drawerContent={({ navigation, state }) => <Sidebar navigation={navigation} state={state} />}
			drawerPosition={I18nManager.isRTL ? 'right' : 'left'}
			screenOptions={{ swipeEnabled: false }}
			drawerType='front'
			drawerStyle={{ width: '80%' }}
			overlayColor={`rgba(0,0,0,${themes[theme].backdropOpacity})`}>
			<Drawer.Screen name='ChatsStackNavigator' component={BotttomTabNavigator} />
			<Drawer.Screen
			name='ProfileStackNavigator'
				component={ProfileStackNavigator}
			/>
		<Drawer.Screen name='MyBreifcase' component={MyBreifcase} />
		<Drawer.Screen name='MyBookmarks' component={MyBookmarks} />
		<Drawer.Screen name='GenericSearch' component={GenericSearch} />
		<Drawer.Screen name='ChangePassword' component={ChangePassword} />
		<Drawer.Screen name='ContactUs' component={ContactUs} />
		<Drawer.Screen name='FAQScreen' component={FAQScreen} />
		<Drawer.Screen name='PrivacyPolicy' component={PrivacyPolicy} />
		<Drawer.Screen
			name='GamificationView'
			component={Gamification}
			options={{ headerShown: false }}
		/>
		<Drawer.Screen
			name='LeaderBoard'
			component={LeaderBoard}
			options={{ headerShown: false }}
		/>
			{/* <Drawer.Screen name='SettingsStackNavigator' component={SettingsStackNavigator} />
			<Drawer.Screen name='AdminPanelStackNavigator' component={AdminPanelStackNavigator} />
			<Drawer.Screen name='DisplayPrefStackNavigator' component={DisplayPrefStackNavigator} /> */}
		</Drawer.Navigator>
	);
};

// NewMessageStackNavigator
const NewMessageStack = createStackNavigator<NewMessageStackParamList>();
const NewMessageStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<NewMessageStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<NewMessageStack.Screen name='NewMessageView' component={NewMessageView} options={NewMessageView.navigationOptions} />
			<NewMessageStack.Screen name='SelectedUsersViewCreateChannel' component={SelectedUsersView} />
			<NewMessageStack.Screen
				name='CreateChannelView'
				component={CreateChannelView}
				options={CreateChannelView.navigationOptions}
			/>
			<NewMessageStack.Screen name='CreateDiscussionView' component={CreateDiscussionView} />
		</NewMessageStack.Navigator>
	);
};

// E2ESaveYourPasswordStackNavigator
const E2ESaveYourPasswordStack = createStackNavigator<E2ESaveYourPasswordStackParamList>();
const E2ESaveYourPasswordStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<E2ESaveYourPasswordStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<E2ESaveYourPasswordStack.Screen
				name='E2ESaveYourPasswordView'
				component={E2ESaveYourPasswordView}
				options={E2ESaveYourPasswordView.navigationOptions}
			/>
			<E2ESaveYourPasswordStack.Screen
				name='E2EHowItWorksView'
				component={E2EHowItWorksView}
				options={E2EHowItWorksView.navigationOptions}
			/>
		</E2ESaveYourPasswordStack.Navigator>
	);
};

// E2EEnterYourPasswordStackNavigator
const E2EEnterYourPasswordStack = createStackNavigator<E2EEnterYourPasswordStackParamList>();
const E2EEnterYourPasswordStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);

	return (
		<E2EEnterYourPasswordStack.Navigator
			screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...StackAnimation } as StackNavigationOptions}>
			<E2EEnterYourPasswordStack.Screen
				name='E2EEnterYourPasswordView'
				component={E2EEnterYourPasswordView}
				options={E2EEnterYourPasswordView.navigationOptions}
			/>
		</E2EEnterYourPasswordStack.Navigator>
	);
};

// InsideStackNavigator
const InsideStack = createStackNavigator<InsideStackParamList>();
const InsideStackNavigator = () => {
	const { theme } = React.useContext(ThemeContext);
	React.useEffect(() => {
		postFcmToken();
	}, []);

	return (
		<InsideStack.Navigator mode='modal' screenOptions={{ ...defaultHeader, ...themedHeader(theme), ...ModalAnimation }}>
			<InsideStack.Screen name='DrawerNavigator' component={DrawerNavigator} options={{ headerShown: false }} />
			<InsideStack.Screen
				name='ExchangeContactStackNavigator'
				component={ExchangeContactStackNavigator}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen name='NewMessageStackNavigator' component={NewMessageStackNavigator} options={{ headerShown: false }} />
			<InsideStack.Screen
				name='E2ESaveYourPasswordStackNavigator'
				component={E2ESaveYourPasswordStackNavigator}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='E2EEnterYourPasswordStackNavigator'
				component={E2EEnterYourPasswordStackNavigator}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen name='AttachmentView' component={AttachmentView} />
			<InsideStack.Screen name='StatusView' component={StatusView} />
			<InsideStack.Screen name='ShareView' component={ShareView} />
			<InsideStack.Screen name='ModalBlockView' component={ModalBlockView} options={ModalBlockView.navigationOptions} />
			<InsideStack.Screen name='JitsiMeetView' component={JitsiMeetView} options={{ headerShown: false }} />
			
			<InsideStack.Screen
			// name="SettingsStackNavigator"
			name='Settings'
				component={SettingsStackNavigator}
				options={{headerShown: false}}
		/>

			{/* new stacks */}
			<InsideStack.Screen
				name='LoopUserProfile'
				component={LoopUserProfile}
				options={{ headerShown: false }}
			/>
						{/* WorkSpee Inside StackNavigator */}
			<InsideStack.Screen
				name='CommentsView'
				component={CommnetsView}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forRevealFromBottomAndroid,
					headerShown: false
				}}
			/>

			<InsideStack.Screen name='CreatePostView'
				component={CreatePostView} options={{
					headerShown: false
				}} />
			<InsideStack.Screen
				name='EditPrivacyView'
				component={EditPrivacyView}
				options={{
					headerShown: false
				}}
			/>
			<InsideStack.Screen name='EditPostView' component={EditPostView} />
			<InsideStack.Screen name='GifView' component={GifView} />
			<InsideStack.Screen
				name='FeelingActivitesView'
				component={FeelingActivties}
			/>
			<InsideStack.Screen name='MentionUser' component={MentionUserView} />
			<InsideStack.Screen name='CheckInView' component={CheckInView} />
			<InsideStack.Screen name='CreatePollsView' component={CreatePollsView} />
			<InsideStack.Screen
				name='LiveWebinar'
				component={LiveWebinar}
				options={{
					headerShown: false
				}}
			/>
			<InsideStack.Screen
				name='BoothDetails'
				component={BoothDetails}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forRevealFromBottomAndroid,
					headerShown: false
				}}
			/>
			<InsideStack.Screen
				name='BoothProductDetails'
				component={BoothProductDetails}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forRevealFromBottomAndroid,
					headerShown: false
				}}
			/>
			<HallsStack.Screen
				name='AllProducts'
				component={AllProducts}
				options={{
					cardStyleInterpolator:
						CardStyleInterpolators.forRevealFromBottomAndroid,
					headerShown: false
				}}
			/>
			<InsideStack.Screen
				name='Notifications'
				component={Notifications}
				options={{ headerShown: false }}
			/>

			<InsideStack.Screen
				name='WebinarDetails'
				component={WebinarDetails}
				options={{ headerShown: false }}
			/>

			<InsideStack.Screen
				name='WebviewScreen'
				component={WebviewScreen}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='Report'
				component={Report}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='Calendar'
				component={Calendar}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='CreateMeeting'
				component={CreateMeeting}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='AttendeesCalendar'
				component={AttendeesCalendar}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='AvailableTimeSlots'
				component={AvailableSlots}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='VideoPlayer'
				component={VideoPlayer}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='AboutEvent'
				component={AboutEvent}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='MyCart'
				component={MyCart}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='MyOrders'
				component={MyOrders}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='OrderDetails'
				component={OrderDetails}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='CartDetails'
				component={CartDetails}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='AddAddress'
				component={AddAddress}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='MyAddress'
				component={MyAddress}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='QRCodeView'
				component={QRCodeView}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='QRScanView'
				component={QRScanView}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='SurveysPolls'
				component={Surveys}
				options={{ headerShown: false }}
			/>
			<InsideStack.Screen
				name='ScavangerHunt'
				component={ScavangerHunt}
				options={{ headerShown: false }}
			/>
			{/* Chat Remaining Stacks */}
			<ChatsStack.Screen name='RoomView' component={RoomView} />
			<ChatsStack.Screen name='RoomActionsView' component={RoomActionsView} options={RoomActionsView.navigationOptions} />
			<ChatsStack.Screen name='SelectListView' component={SelectListView} options={SelectListView.navigationOptions} />
			<ChatsStack.Screen name='RoomInfoView' component={RoomInfoView} options={RoomInfoView.navigationOptions} />
			<ChatsStack.Screen name='RoomInfoEditView' component={RoomInfoEditView} options={RoomInfoEditView.navigationOptions} />
			<ChatsStack.Screen name='RoomMembersView' component={RoomMembersView} options={RoomMembersView.navigationOptions} />
			<ChatsStack.Screen name='DiscussionsView' component={DiscussionsView} />
			<ChatsStack.Screen
				name='SearchMessagesView'
				component={SearchMessagesView}
				options={SearchMessagesView.navigationOptions}
			/>
			<ChatsStack.Screen name='SelectedUsersView' component={SelectedUsersView} />
			<ChatsStack.Screen name='InviteUsersView' component={InviteUsersView} options={InviteUsersView.navigationOptions} />
			<ChatsStack.Screen
				name='InviteUsersEditView'
				component={InviteUsersEditView}
				options={InviteUsersEditView.navigationOptions}
			/>
			<ChatsStack.Screen name='MessagesView' component={MessagesView} />
			<ChatsStack.Screen name='AutoTranslateView' component={AutoTranslateView} options={AutoTranslateView.navigationOptions} />
			<ChatsStack.Screen name='DirectoryView' component={DirectoryView} options={DirectoryView.navigationOptions} />
			<ChatsStack.Screen
				name='NotificationPrefView'
				component={NotificationPrefView}
				options={NotificationPrefView.navigationOptions}
			/>
			<ChatsStack.Screen
				name='ForwardLivechatView'
				component={ForwardLivechatView}
				options={ForwardLivechatView.navigationOptions}
			/>
			<ChatsStack.Screen name='LivechatEditView' component={LivechatEditView} options={LivechatEditView.navigationOptions} />
			<ChatsStack.Screen name='PickerView' component={PickerView} options={PickerView.navigationOptions} />
			<ChatsStack.Screen
				name='ThreadMessagesView'
				component={ThreadMessagesView}
				options={ThreadMessagesView.navigationOptions}
			/>
			<ChatsStack.Screen name='TeamChannelsView' component={TeamChannelsView} />
			<ChatsStack.Screen name='CreateChannelView' component={CreateChannelView} options={CreateChannelView.navigationOptions} />
			<ChatsStack.Screen name='AddChannelTeamView' component={AddChannelTeamView} />
			<ChatsStack.Screen
				name='AddExistingChannelView'
				component={AddExistingChannelView}
				options={AddExistingChannelView.navigationOptions}
			/>
			<ChatsStack.Screen name='MarkdownTableView' component={MarkdownTableView} options={MarkdownTableView.navigationOptions} />
			<ChatsStack.Screen name='ReadReceiptsView' component={ReadReceiptsView} options={ReadReceiptsView.navigationOptions} />
			<ChatsStack.Screen name='QueueListView' component={QueueListView} options={QueueListView.navigationOptions} />
			<ChatsStack.Screen name='CannedResponsesListView' component={CannedResponsesListView} />
			<ChatsStack.Screen name='CannedResponseDetail' component={CannedResponseDetail} />
		</InsideStack.Navigator>
	);
};

export default InsideStackNavigator;
