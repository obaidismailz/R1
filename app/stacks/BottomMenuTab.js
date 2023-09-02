import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View, Image, Text } from 'react-native';

import { colors, exStyles } from '@styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { themes } from '../constants/colors';
import BlinkView from 'react-native-smooth-blink-view';
import { useDispatch, useSelector } from 'react-redux';
import { clearData, fetchLiveWebinars } from '../actions/expo/webinars';
import { io } from 'socket.io-client';
import { ShareData } from '@utils';

const BottomMenuTab = ({ theme, iconName, index, isCurrent }) => {
	const dispatch = useDispatch();
	const data = useSelector(state => state.webinars);

	const socket = io(`${ShareData.getInstance().baseUrl}:4007`, {
		transports: ['websocket'],
		rejectUnauthorized: false,
		autoConnect: true
	});

	useEffect(() => {
		socket.on('started-webinar-id', () => {
			dispatch(clearData());
			dispatch(fetchLiveWebinars());
		});
		socket.on('end-webinar-id', () => {
			dispatch(clearData());
			dispatch(fetchLiveWebinars());
		});

		if (data.liveWebinars.length == 0) {
			dispatch(fetchLiveWebinars());
		}
		return () => {};
	}, []);

	return (
		<View
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				marginBottom: 2
			}}>
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				{data.liveWebinars.length > 0 && (
					<BlinkView
						containerStyle={{
							backgroundColor: 'red',
							width: index === 2 ? 30 : 0,
							height: 12,
							borderRadius: 10,
							justifyContent: 'center',
							alignItems: 'center'
						}}
						delayVisible={500}
						delayInvisible={0}
						duration={500}
						blinking>
						<Text
							style={{
								fontSize: 10,
								color: '#fff'
							}}>
							LIVE
						</Text>
					</BlinkView>
				)}

				<Image
					style={[
						{
							height: 24,
							width: 24,
							alignSelf: 'center'
						}
					]}
					source={
						index === 0
							? isCurrent
								? require('../static/icons/Lobby_Filled.png')
								: require('../static/icons/Lobby_outline.png')
							: index === 1
							? isCurrent
								? require('../static/icons/Halls_Filled.png')
								: require('../static/icons/Halls_outline.png')
							: index === 2
							? isCurrent
								? require('../static/icons/Auditorium_Filled.png')
								: require('../static/icons/Auditorium_outline.png')
							: index === 3
							? isCurrent
								? require('../static/icons/Social_filled.png')
								: require('../static/icons/Social_outline.png')
							: index === 4
							? isCurrent
								? require('../static/icons/Chats_Filled.png')
								: require('../static/icons/Chats_outline.png')
							: null
					}
				/>

				<Text
					style={{
						fontSize: 10,
						lineHeight: 14,
						fontStyle: 'normal',
						color: colors.white,
						marginTop: 2,
						textAlign: 'center',
						width: '100%',
						letterSpacing: 0,
						fontWeight: isCurrent ? '600' : '400'
					}}>
					{index === 0
						? 'Lobby'
						: index === 1
						? 'S Offices'
						: index === 2
						? 'Events'
						: index === 3
						? 'Community'
						: index === 4
						? 'Chat'
						: ''}
				</Text>
			</View>
		</View>
	);
};

export default BottomMenuTab;
