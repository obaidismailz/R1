import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { View, TextInput, StyleSheet, FlatList, Pressable, Text, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from '@rocket.chat/react-native-fast-image';
import axios from 'axios';
import { ShareData } from '@utils';
import * as HeaderButton from '../../../../../containers/HeaderButton';

import { withTheme } from '../../../../../theme';
import { withDimensions } from '../../../../../dimensions';
import { themes } from '../../../../../constants/colors';
import StatusBar from '../../../../../containers/StatusBar';
import { GET_MENTION_USERS, TIMELINE_BASE_URL } from '../../../../../utils/Constants';

const qs = require('qs');

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const MentionUserView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	const [data, setData] = useState([]);
	const [name, setName] = useState('a');
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState([]);

	useEffect(() => {
		setHeader();
		fetchUsers();
	}, []);

	setHeader = () => {
		navigation.setOptions({
			title: 'Add Friends',
			headerLeft: isMasterDetail ? undefined : () => <HeaderButton.CancelModal onPress={close} />,
			headerRight: () => <HeaderButton.Item title='Done' onPress={() => onDone()} testID='status-view-submit' />
		});
	};

	close = () => {
		navigation.goBack();
	};

	const fetchUsers = async () => {
		const params = {
			user_id: ShareData.getInstance().user_id,
			s: ShareData.getInstance().timeline_token,
			term: name,
			limit: 20
		};
		await axios({
			method: 'POST',
			url: ShareData.getInstance().socialBaseUrl + GET_MENTION_USERS,
			data: qs.stringify(params)
		})
			.then(response => {
				setData(response.data.users);
				setLoading(false);
			})
			.catch(error => {
				console.error(error);
			});
	};

	function onSearch(value) {
		setName(value);
		fetchUsers();
	}

	onDone = () => {
		route.params.selectedUser(user);
		navigation.goBack();
	};

	renderUser = ({ item }) => (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
				},
				styles.touchableContainer
			]}
			onPress={() => {
				if (user.includes(`@${item.username}`)) {
					setUser(user.filter(e => e !== `@${item.username}`));
				} else {
					setUser(arr => [...arr, `@${item.username}`]);
				}
			}}>
			<View style={styles.userContainer}>
				<FastImage
					style={styles.avatar}
					source={{
						uri: item.img,
						priority: FastImage.priority.high
					}}
				/>
				<Text>{item.username}</Text>
			</View>
			<Icon
				name={user.includes(`@${item.username}`) ? 'check-circle' : 'circle'}
				color={user.includes(`@${item.username}`) ? '#2c9dd1' : '#C7C7C7'}
				size={20}
				style={styles.iconStyle}
			/>
		</Pressable>
	);

	userSeparator = () => (
		<View
			style={{
				height: 1,
				backgroundColor: '#000000',
				opacity: 0.1,
				marginLeft: 55,
				marginRight: 15
			}}
		/>
	);

	return (
		<View style={styles.view}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<View style={styles.searchFieldContainer}>
				<TextInput
					placeholder='Search Friends'
					placeholderTextColor='#000000'
					style={styles.textInput}
					onChangeText={text => {
						onSearch(text);
					}}
				/>
				<View style={styles.Separator} />
			</View>
			<View style={{ width: screenWidth, flex: 1 }}>
				{loading ? (
					<ActivityIndicator size='large' color='grey' />
				) : (
					<FlatList
						data={data}
						showsVerticalScrollIndicator={false}
						keyExtractor={(item, index) => index.toString()}
						renderItem={renderUser}
						ItemSeparatorComponent={userSeparator}
						contentContainerStyle={{ paddingBottom: 30 }}
					/>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		width: screenWidth,
		alignItems: 'center',
		backgroundColor: '#E5E5E5'
	},
	touchableContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 10
	},
	avatar: {
		height: 46,
		width: 46,
		borderRadius: 23,
		marginRight: 5
	},
	searchFieldContainer: {
		height: 50,
		marginTop: 10,
		marginBottom: 10,
		width: '100%'
	},
	textInput: {
		marginHorizontal: 15,
		height: 50,
		color: '#000000'
	},
	Separator: {
		height: 1,
		backgroundColor: '#9CA2A8',
		marginHorizontal: 15
	},
	userContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginLeft: 15
	},
	iconStyle: {
		marginRight: 20
	}
});

export default withDimensions(withTheme(memo(MentionUserView)));
