import { Platform } from 'react-native';

export const SOCIAL_SOCKET = 'https://socket.team-collaboration.com:3000';

export const VISITORS = `/visitor?platform=${Platform.OS == 'ios' ? 'ios' : 'android'}`;
export const LOGIN = '/api/user/login';
export const GET_EVENTS = '/api/agenda/get_all_event_data';
export const LOGIN_SETTING = '/api/get/login/settings';
export const SIGNUP_SETTING = '/api/registration_form_rules/get';
export const SIGNUP_INTERESTS = '/api/interests/get';
export const COUNTRIES_LIST = '/api/countries/list';
export const REGISTER_USER = '/api/user/register';

// Hall API's Constants
export const ACTIVE_HALLS = '/api/halls/active_list';
export const HALL_DETAILS = '/api/halls/detail';

// Booths Api
export const ACTIVE_BOOTHS = '/api/booth/get_active_booth_list';
export const BOOTH_DETAILS = '/api/booth/get_booth_record';
export const BOOTH_PRODUCT_CATEGORIES = '/api/booth/categories/';
export const SUGGESTED_BOOTHS = '/api/booth/get_suggested_booths';
export const GET_ALL_Booths = '/api/get/all/booths';
export const CITY_LOCATIONS = '/api/property/locations/get';

// EComm APi
export const SAVE_ORDER = '/api/order/save';
export const GET_ORDERS = '/api/order/listing';

// webinar API's
export const GET_ALL_WEBINARS = '/api/get/all/webinars';
export const GET_WEBINARS = '/api/webinars';
export const GET_WEBINAR_BY_ID = '/api/webinar';
export const GET_USER_PROFILE = '/api/user/profile_by_username';
export const GET_FAQS = '/api/exhibition/faqs';
export const GET_LIVE_COUNTS = '/api/live_webinars/count';

// profile Update API's
export const GET_MY_PROFILE = '/api/user/profile';
export const UPDATE_PROFILE = '/api/user/profile/update';
export const MY_QRCODE = '/api/generate-qrcode';

// Bookmarks and Briefcases API's
export const GET_BOOKMARKS = '/api/bookmarks';
export const DELETE_BOOKMARKS = '/api/bookmark/delete';

export const FORGOT_PASSWORD = '/api/user/forget_password';
export const GET_RECORDING_URL = '/api/webinars/recordings';

export const ADD_TO_BRIEFCASE = '/api/add/briefcase';

export const SAVE_BOOKMARK = '/api/bookmark/save';
export const DELET_BOOKMARK = '/api/bookmark/delete';

export const SAVE_BRIEFCASE = '/api/add/briefcase';
export const DELETE_BRIEFCASE = '/api/delete/briefcase';
export const GET_BRIEFCASE = '/api/get/briefcase';

// Privacy Policy API
export const GET_PRIVACY_POLICY = '/api/privacy_policy';
export const ACTIVE_AUDITORIUMS = '/api/auditorium/active_list';
export const CONTACT_US = '/api/contact/send_msg';

// lobby API's
export const GET_WEBINAR_BY_SPEAKERS = '/api/get/webinars';
export const ATTENDEES = '/api/user/get_suggested_attendees';
export const ALL_SPEAKERS = '/api/get/all/speakers';
export const ALL_WEBINARS = '/api/get/webinar/upcoming';
export const ALL_PRODUCTS = '/api/get/all/products';
export const GET_EVENT_AGENDA = '/api/agenda/get_all_data';
export const GET_LOBBY_IMAGE = '/api/lobby/get_mobile_lobby';
export const GET_ALL_SPONSERS = '/api/sponsors/get_all';
export const GET_LOBBY_ABOUT = '/api/get/event/description';

// Calender API's
export const GET_CALENDAR_EVENTS = '/api/calendar/get_events?info=event';
export const ADD_CALENDAR_EVENTS = '/api/calendar';
export const GET_CALENDAR_ATTENDEES = '/api/calendar/create';
export const GET_AVAILABLE_TIME_SLOTS = '/api/get/calendar/slots/';
export const GET_MEETINGS_BY_USER = '/api/calendar/get/meetings/';
export const SAVE_MEETING_BOOTH = '/api/calendar/meeting/save';
export const SAVE_MEETING_PERSONAL = '/api/personal/calendar/meeting/save';

// Notifications
export const READ_NOTIFICATIONS = '/api/read_user_notification';
export const GET_NOTIFICATIONS = '/api/user_notification_list';
export const POST_FCM_TOKEN = '/api/create_fcm_token';

// Exchange contact API's
export const GET_EXCHNGE_CONTACTS = '/api/exchange_contacts/get';
export const SAVE_EXCHNGE_CONTACTS = '/api/exchange_contacts/save';

// Search
export const GET_SEARCH_RESULT = '/api/generic_search';
export const SEARCH_PROPERTIES = '/api/properties/get';
// Gamificatiion

export const GET_SPINNERWHEEL_DATA = '/api/spin/wheel/settings';
export const GET_LEADEROARD_RANKINGS = '/api/get/leaderboard/points';
export const GET_SCORE_CRITERION = '/api/get/creterion';
export const GET_INCENTIVES_DATA = '/api/get/incentives';
export const GET_MY_POINTS = '/api/get/user/activities';
export const GET_SURVEYS = '/api/survey_places/get/all';

// social TimeLine API's
export const GET_POSTS = '/apis/get_posts';
export const DELETE_POST = '/app_api.php?application=react_app&type=react_posts&access_token=';
export const EDIT_POST = '/app_api.php?application=react_app&type=react_posts&access_token=';
export const CREATE_POST = '/app_api.php?application=phone&type=new_post';
export const SHARE_POST = '/api/posts?access_token=';
export const POLLING_VOTE = '/api/vote_up?access_token=';
export const GET_MENTION_USERS = '/app_api.php?application=phone&type=get_mention_users';

// social comment Api's
export const GET_COMMENTS = '/apis/get_comments';
export const REGISTER_COMMENTS = '/api/comments?action=create&access_token=';
export const EDIT_COMMENT = '/app_api.php?application=react_app&type=react_posts&access_token=';
export const DELETE_COMMENT = '/app_api.php?application=react_app&type=react_posts&access_token=';

// social comment_replies Api's
export const GET_COMMENT_REPLIES = '/apis/get_comment_replies';
export const DELETE_REPLY = '/api/comments?access_token=';
export const REGISTER_REPLY = '/api/comments?action=create_reply&access_token=';
export const EDIT_REPLY = '/api/comments?action=edit_reply&access_token=';

// social Like_reactions Api's
export const POST_REACTION = '/apis/register_reaction';
export const COMMENT_REACTION = '/api/comments?action=reaction_comment&access_token=';
export const REPLY_REACTION = '/api/comments?action=reaction_reply&access_token=';
export const LIKES_DETAIL = '/api/get-reactions?access_token=';

export const NO_INTERNET_TITLE = 'No Internet';
export const NO_INTERNET_MESSAGE = 'Please check your internet connection and try again.';

export const LOOPEXPO_APP_VERSION = 'version 1.16';

export const ALPHABETS = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z'
];
