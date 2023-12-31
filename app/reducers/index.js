import { combineReducers } from 'redux';

import inquiry from '../ee/omnichannel/reducers/inquiry';
import settings from './settings';
import login from './login';
import meteor from './connect';
import room from './room';
import rooms from './rooms';
import server from './server';
import selectedUsers from './selectedUsers';
import createChannel from './createChannel';
import app from './app';
import sortPreferences from './sortPreferences';
import share from './share';
import customEmojis from './customEmojis';
import activeUsers from './activeUsers';
import usersTyping from './usersTyping';
import inviteLinks from './inviteLinks';
import createDiscussion from './createDiscussion';
import enterpriseModules from './enterpriseModules';
import encryption from './encryption';
import permissions from './permissions';
import roles from './roles';

import eventInfo from './expo/eventInfo';
import webinars from './expo/webinars';
import posts from './social/newsfeed';
import attendees from './social/attendees';
import comments from './social/comments';
import reply from './social/reply';
import myPosts from './social/myTimeline';

export default combineReducers({
	settings,
	login,
	meteor,
	server,
	selectedUsers,
	createChannel,
	app,
	room,
	rooms,
	sortPreferences,
	share,
	customEmojis,
	activeUsers,
	usersTyping,
	inviteLinks,
	createDiscussion,
	inquiry,
	enterpriseModules,
	encryption,
	permissions,
	roles,
	eventInfo,
	posts,
	attendees,
	comments,
	reply,
	myPosts,
	webinars
});
