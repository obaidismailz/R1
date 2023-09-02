import React, { useState, useRef, useEffect } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Text,
	Dimensions,
	Pressable
} from 'react-native';
import { colors } from '@styles';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { ShareData } from '@utils';
import moment from 'moment';
import { ActivityIndicator } from 'react-native-paper';
import { postPollingVote } from '../../../../../apis/LoopExpoApi';

const screenWidth = Dimensions.get('window').width;
const PostPolls = (props) => {
	const [pollData, setPollData] = useState(props.pollData);
	const [pollVote, setPollVote] = useState(props.pollVote);
	const [loading, setLoading] = useState(false);
	const [pollingOpen, setPollingOpen] = useState(
		new Date(props.pollLastDate * 1000) > new Date()
	);

	function vottingPoll(optionId) {
		setLoading(true);
		postPollingVote(optionId).then((response) => {
			if (response.api_status === 200) {
				setPollVote([
					{
						post_id: response.votes.post_id,
						user_id: ShareData.getInstance().userId,
						option_id: optionId
					}
				]);
				setPollData(response.votes);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	}

	const separator = () => <View style={{ marginVertical: 6 }} />;
	const Footer = () => (
		<View style={styles.listFooter}>
			<Text style={styles.pollLastDate}>{`${ pollData[0].all } votes`}</Text>
			<Text style={styles.dot}>{' .  '}</Text>
			<Text style={styles.pollLastDate}>
				{pollingOpen ? daysLeft : 'Poll Ended'}
			</Text>
		</View>
	);

	const daysLeft = `Poll Last Date: ${ moment
		.unix(props.pollLastDate)
		.format('D MMM') }`;

	const OpenPoll = ({ item }) => (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				marginHorizontal: 16,
				flex: 1,
				borderWidth: pollVote.length == 0 ? 0 : 0.5,
				borderRadius: pollVote.length == 0 ? 16 : 6,
				borderColor: pollVote.length == 0 ? colors.secondaryColor : '#CFE7FB'
			}}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				style={[
					styles.pollAnswersContainer,
					{
						flex:
							pollVote.length == 0
								? 1
								: item.percentage == '0%'
									? 1
									: parseFloat(item.percentage) / 100.0,
						justifyContent: pollVote.length == 0 ? 'center' : 'flex-start',
						backgroundColor:
							pollVote.length !== 0 && item.percentage !== '0%'
								? '#CFE7FB'
								: '#FFFFFF',
						borderWidth: pollVote.length == 0 ? 1 : 0.5,
						borderRadius: pollVote.length == 0 ? 16 : 6,
						borderColor:
							pollVote.length == 0 ? colors.secondaryColor : '#CFE7FB'
					}
				]}
				onPress={() => {
					pollVote.length > 0 ? null : vottingPoll(item.id);
				}}
			>
				<Text style={styles.optionText}>{item.text}</Text>
				{pollVote.length !== 0 && pollVote[0].option_id == item.id ? (
					<Icon
						name='checkcircle'
						size={12}
						color={colors.secondaryText}
						style={styles.checkIconStyle}
					/>
				) : null}
			</TouchableOpacity>
			{pollVote.length !== 0 ? (
				<View style={styles.pollVotingPercentage}>
					<Text>{pollVote.length > 0 ? item.percentage : '0%'}</Text>
				</View>
			) : null}
		</View>
	);

	const ClosePoll = ({ item }) => (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				marginHorizontal: 16,
				flex: 1,
				borderWidth: 0.5,
				borderRadius: 6,
				borderColor: '#CFE7FB'
			}}
		>
			<TouchableOpacity
				activeOpacity={0.7}
				style={[
					styles.pollAnswersContainer,
					{
						flex:
							item.percentage == '0%' ? 1 : parseFloat(item.percentage) / 100.0,
						justifyContent: 'flex-start',
						backgroundColor: item.percentage !== '0%' ? '#CFE7FB' : '#FFFFFF',
						borderWidth: 0.5,
						borderRadius: 6,
						borderColor: '#CFE7FB'
					}
				]}
			>
				<Text style={styles.optionText}>{item.text}</Text>
				{pollVote.length !== 0 && pollVote[0].option_id == item.id ? (
					<Icon
						name='checkcircle'
						size={12}
						color={colors.secondaryText}
						style={styles.checkIconStyle}
					/>
				) : null}
			</TouchableOpacity>

			<View style={styles.pollVotingPercentage}>
				<Text>{item.percentage}</Text>
			</View>
		</View>
	);

	return (
		<View>
			<FlatList
				data={pollData}
				ItemSeparatorComponent={separator}
				ListFooterComponent={<Footer />}
				renderItem={({ item }) => (pollingOpen ? <OpenPoll item={item} /> : <ClosePoll item={item} />)
				}
			/>
			{loading ? (
				<ActivityIndicator color='grey' style={styles.loader} />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	postContainer: {
		width: '100%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center'
	},

	// Polling post styling
	pollingDetailContainer: { marginHorizontal: 15 },
	pollingTextContainer: { color: '#000000', fontSize: 16 },
	pollAnswersContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 4,
		paddingHorizontal: 16
	},
	checkIconStyle: { marginHorizontal: 5 },
	pollVotingPercentage: {
		position: 'absolute',
		right: 24
	},
	voteCount: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		position: 'absolute',
		right: 16,
		top: -16,
		padding: 4,
		borderRadius: 8,
		backgroundColor: colors.secondaryColor
	},
	optionText: {
		fontSize: 16,
		fontWeight: '400',
		letterSpacing: 0.6,
		color: 'black'
	},
	pollLastDate: {
		fontWeight: '500',
		marginRight: 8,
		color: colors.primaryText
	},
	listFooter: {
		flexDirection: 'row',
		marginHorizontal: 16,
		paddingLeft: 8,
		marginTop: 8,
		alignItems: 'center',
		backgroundColor: '#F2F2F2'
	},
	dot: {
		fontSize: 20,
		fontWeight: '600',
		position: 'relative',
		color: colors.primaryText,
		bottom: 5
	},
	loader: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	}
});

export default PostPolls;
