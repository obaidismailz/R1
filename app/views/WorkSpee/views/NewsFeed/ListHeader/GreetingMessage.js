import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import { withTheme } from '../../../../../theme';
import { withDimensions } from '../../../../../dimensions';

const GreetingMessage = ({ ...props }) => {
	const [_message, setMessage] = React.useState(true);

	const currentTime = new Date().getHours();

	function message() {
		if (currentTime >= 0 && currentTime < 12) {
			return 'Good morning';
		} else if (currentTime >= 12 && currentTime <= 18) {
			return 'Good afternoon';
		} else {
			return 'Good evening';
		}
	}

	return _message ? (
		<View style={styles.createGreetingsContainer}>
			<FastImage
				source={
					currentTime >= 0 && currentTime < 12
						? require('../../../../../static/icons/goodmorning.png')
						: currentTime >= 12 && currentTime <= 18
						? require('../../../../../static/icons/goodafternoon.png')
						: require('../../../../../static/icons/goodevening.png')
				}
				style={{ width: RFValue(40), height: RFValue(40) }}
			/>
			<View style={{ marginHorizontal: 32 }}>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
					{message()}, {`${ShareData.getInstance().name} `}!
				</Text>
				<Text style={[exStyles.infoSmallM11, styles.createGreetingsTextContent2]}>
					May this day be light, blessed, productive and efficient for you
				</Text>
			</View>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : '#7E8389'
					},
					styles.closeButton
				]}
				onPress={() => setMessage(false)}>
				<Icon name='times' size={16} color='#ffffff' />
			</Pressable>
		</View>
	) : (
		<View
			style={{
				marginTop: 16,
				height: 6,
				backgroundColor: colors.secondaryText,
				opacity: 0.2
			}}
		/>
	);
};

const styles = StyleSheet.create({
	createGreetingsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		paddingVertical: RFValue(24),
		paddingHorizontal: RFValue(26),
		backgroundColor: '#F7F7F7',
		marginTop: 12
	},

	createGreetingsTextContent2: {
		marginTop: 8,
		color: colors.secondaryText,
		textAlign: 'center'
	},
	closeButton: {
		position: 'absolute',
		right: 16,
		top: 16,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: RFValue(10),
		width: RFValue(20),
		height: RFValue(20)
	}
});
export default withDimensions(withTheme(memo(GreetingMessage)));
