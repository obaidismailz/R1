import FastImage from '@rocket.chat/react-native-fast-image';
import React, {
	useCallback,
	useRef,
	useEffect,
	useState,
	useMemo
} from 'react';
import {
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	View,
	Platform
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment, { duration } from 'moment';
import { colors, exStyles } from '../../../styles';
import Navigation from '../../../lib/Navigation';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const calculateTimeLeft = (time) => {
	const eventTime = time;
	const currentTime = Math.floor(Date.now() / 1000).toString();
	const leftTime = eventTime - currentTime;
	let duration = moment.duration(leftTime, 'seconds');
	const interval = 1000;
	if (duration.asSeconds() <= 0) {
		clearInterval(interval);
	}
	duration = moment.duration(duration.asSeconds() - 1, 'seconds');
	return `${ duration.days() } Days ${ duration.hours() } Hours ${ duration.minutes() } Minutes `;
};

const ItemWebinarLobby = ({ ...props }) => {
	const arr = props.item.start_time.split(/[- :]/);
	const date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
	const [timeLeft, setTimeLeft] = useState(
		calculateTimeLeft(parseInt(date / 1000))
	);

	useEffect(() => {
		setTimeout(() => {
			setTimeLeft(calculateTimeLeft(parseInt(date / 1000)));
		}, 1000);
	});
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				Navigation.navigate('WebinarDetails', {
					webinar: props.item,
					briefcaseCallback: null
				});
			}}
			style={{ marginLeft: RFValue(16) }}
		>
			<FastImage
				style={{
					width: 240,
					height: 98,
					borderRadius: 10,
					borderWidth: 0.5,
					borderColor: 'rgba(0,0,0,0.4)',
					resizeMode: 'cotain'
				}}
				source={{ uri: props.item.image }}
			>
				<View style={styles.liveTextContainer}>
					<Text
						style={[
							Platform.OS == 'android' ? styles.liveText : null,
							{ color: '#fff' }
						]}
					>
						{props.item.status}
					</Text>
				</View>
			</FastImage>
			<Text style={[exStyles.descriptionSmallText, styles.textSpacing]}>
				{props.item.topic}
			</Text>
			{Date.now() / 1000 > date / 1000 ? (
				<Text
					style={[
						exStyles.tabR11,
						{
							color: colors.secondaryColor
						}
					]}
				>
					Starting any minute now...
				</Text>
			) : (
				<Text
					style={[
						exStyles.tabR11,
						{
							color:
								props.item.status == 'upcoming' ? colors.primaryColor : 'grey'
						}
					]}
				>
					{`Start In ${ timeLeft }`}
				</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	liveTextContainer: {
		paddingHorizontal: 10,
		paddingBottom: 2,
		borderRadius: 5,
		backgroundColor: colors.secondaryColor,
		position: 'absolute',
		bottom: 5,
		left: 5
	},

	textSpacing: {
		marginTop: RFValue(8),
		paddingHorizontal: 2,
		color: colors.primaryText,
		textAlign: 'justify'
	}
});
export default ItemWebinarLobby;
