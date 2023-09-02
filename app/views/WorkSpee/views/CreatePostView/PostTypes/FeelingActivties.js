import React, { useState, useEffect, memo } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text, FlatList, Pressable, TextInput, SafeAreaView } from 'react-native';
import { colors } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as HeaderButton from '../../../../../containers/HeaderButton';
import { withDimensions } from '../../../../../dimensions';
import { withTheme } from '../../../../../theme';
import { themes } from '../../../../../constants/colors';

const { screenWidth } = Dimensions.get('screen');
const { screenheight } = Dimensions.get('screen');

const FeelingActivties = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;
	const [tabIndex, setTabIndex] = useState(0);
	const [select, setSelect] = useState(false);
	const [activityText, setActivityText] = useState('');
	const [activityName, setActivityName] = useState('');
	const [activityType, setActivityType] = useState('');
	const [feelings, setFeelings] = useState([
		{
			id: 'happy',
			name: 'Happy',
			unicode: '😄'
		},
		{
			id: 'loved',
			name: 'Loved',
			unicode: '😍'
		},
		{
			id: 'sad',
			name: 'Sad',
			unicode: '😞'
		},
		{
			id: 'so_sad',
			name: 'Very Sad',
			unicode: '😭'
		},
		{
			id: 'angry',
			name: 'Angry',
			unicode: '😠'
		},
		{
			id: 'confused',
			name: 'Confused',
			unicode: '😕'
		},
		{
			id: 'smirk',
			name: 'Hot',
			unicode: '😏'
		},
		{
			id: 'broke',
			name: 'Broken',
			unicode: '💔'
		},
		{
			id: 'expressionless',
			name: 'Expressionless',
			unicode: '😑'
		},
		{
			id: 'cool',
			name: 'Cool',
			unicode: '😎'
		},
		{
			id: 'funny',
			name: 'Funny',
			unicode: '😂'
		},
		{
			id: 'tired',
			name: 'Tired',
			unicode: '😫'
		},
		{
			id: 'lovely',
			name: 'Lovely',
			unicode: '❤'
		},
		{
			id: 'blessed',
			name: 'Blessed',
			unicode: '😇'
		},
		{
			id: 'shocked',
			name: 'Shocked',
			unicode: '😱'
		},
		{
			id: 'sleepy',
			name: 'Sleepy',
			unicode: '😴'
		},
		{
			id: 'pretty',
			name: 'Pretty',
			unicode: '☺'
		},
		{
			id: 'bored',
			name: 'Bored',
			unicode: '😒'
		}
	]);

	const [activities, setActivities] = useState([
		{
			id: 'Traveling to',
			name: 'traveling',
			icon: require('@assets/Traveling.png')
		},
		{
			id: 'Watching',
			name: 'watching',
			icon: require('@assets/Watching.png')
		},
		{
			id: 'Listening to',
			name: 'listening',
			icon: require('@assets/Listening.png')
		},
		{
			id: 'Playing',
			name: 'playing',
			icon: require('@assets/Playing.png')
		}
	]);

	useEffect(() => {}, []);

	setHeader = () => {
		navigation.setOptions({
			title: 'What are you doing?',
			headerLeft: isMasterDetail ? undefined : () => <HeaderButton.CancelModal onPress={close} />,
			headerRight: () => <HeaderButton.Item title='Done' testID='status-view-submit' onPress={() => onDone()} />
		});
	};

	close = () => {
		navigation.goBack();
	};

	const onDone = () => {
		activityName == '' ? null : onSelelctActivity(activityType, activityName, '', activityName);
	};

	onSelelctActivity = (type, name, smily, id) => {
		route.params.feeling(type, name, smily, id);
		navigation.goBack();
	};

	const Tabs = () => (
		<View style={styles.tabContainer}>
			<TouchableOpacity
				style={[styles.tabStyle, { borderColor: tabIndex === 0 ? 'white' : colors.secondaryColor }]}
				onPress={() => {
					setTabIndex(0);
				}}>
				<Text style={{ color: 'white' }}>Feeling</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.tabStyle, { borderColor: tabIndex === 1 ? 'white' : colors.secondaryColor }]}
				onPress={() => setTabIndex(1)}>
				<Text style={{ color: 'white' }}>Activities</Text>
			</TouchableOpacity>
		</View>
	);

	const separator = () => (
		<View
			style={{
				borderWidth: 0.5,
				borderTopColor: colors.unSelected,
				opacity: 0.2
			}}
		/>
	);

	const Feelings = () => (
		<FlatList
			data={feelings}
			contentContainerStyle={{ marginTop: 20, paddingBottom: 16 }}
			ItemSeparatorComponent={separator}
			renderItem={({ item }) => (
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						[styles.activitiesContainer, { justifyContent: 'flex-start', paddingVertical: 16 }]
					]}
					onPress={() => {
						onSelelctActivity('feelings', item.name, item.unicode, item.id);
					}}>
					<Text style={{ fontSize: 24, marginRight: 10 }}>{item.unicode}</Text>
					<Text style={[styles.feelingText, { fontSize: 16 }]}>{item.name}</Text>
				</Pressable>
			)}
		/>
	);

	const Activities = () => (
		<FlatList
			data={activities}
			contentContainerStyle={{ marginTop: 20 }}
			ItemSeparatorComponent={separator}
			renderItem={({ item }) => (
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.activitiesContainer
					]}
					onPress={() => {
						setActivityType(item.name);
						setSelect(true);
					}}>
					<View style={{ flexDirection: 'row' }}>
						<FastImage style={{ width: 24, height: 24, marginRight: 16 }} source={item.icon} />
						<Text style={styles.feelingText}>{`${item.id}...`}</Text>
					</View>
					<MaterialIcons name='keyboard-arrow-right' size={30} color={colors.secondaryText} />
				</Pressable>
			)}
		/>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].backgroundColor, flex: 1 }}>
			{setHeader()}
			<Tabs />
			{select ? (
				<View style={styles.searchFieldContainer}>
					<Text style={{ color: colors.primaryText, fontSize: 16 }}>{activityType}</Text>
					<View style={styles.separator} />
					<TextInput
						placeholder='Type here'
						placeholderTextColor='rgba(0,0,0,0.3)'
						style={styles.textInput}
						onChangeText={setActivityName}
						value={activityName}
						keyboardType='default'
					/>
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : '#7E8389'
							},
							styles.closeButton
						]}
						onPress={() => {
							setActivityName('');
							setSelect(false);
						}}>
						<Icon name='times' size={15} color='#ffffff' />
					</Pressable>
				</View>
			) : null}
			{tabIndex == 0 ? <Feelings /> : <Activities />}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	view: {
		flex: 1,
		backgroundColor: '#E5E5E5'
	},
	tabContainer: {
		width: screenWidth,
		flexDirection: 'row',
		backgroundColor: colors.secondaryColor
	},
	tabStyle: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: 40,
		borderBottomWidth: 3
	},
	activitiesContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		paddingVertical: 24,
		alignItems: 'center'
	},
	feelingText: {
		fontSize: 20,
		fontWeight: '600',
		lineHeight: 24,
		letterSpacing: 0.3,
		color: colors.primaryText
	},
	searchFieldContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 50,
		backgroundColor: '#ffffff',
		opacity: 0.6,
		paddingHorizontal: 16
	},
	textInput: {
		marginHorizontal: 16,
		height: 50,
		color: '#000000',
		flex: 1
	},
	separator: {
		height: '100%',
		width: 0.5,
		backgroundColor: colors.secondaryText,
		marginLeft: 8
	},
	closeButton: {
		position: 'absolute',
		right: RFValue(18),
		top: RFValue(18),
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: RFValue(10),
		width: RFValue(20),
		height: RFValue(20)
	}
});

export default withDimensions(withTheme(memo(FeelingActivties)));
