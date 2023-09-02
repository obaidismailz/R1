import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@styles';
import { ShareData } from '@utils';
import FastImage from '@rocket.chat/react-native-fast-image';

const FeelingsAndActivites = ({ ...props }) => {
	const traveling = require('@assets/Traveling.png');
	const watching = require('@assets/Watching.png');
	const listening = require('@assets/Listening.png');
	const playing = require('@assets/Playing.png');

	return (
		<View style={[styles.nameAndTypeTextContainer, { width: '80%' }]}>
			<Text style={styles.userNameText}>
				{ShareData.getInstance().name}
				<Text>{'  is  '}</Text>
				{props.activityType == 'feelings' ? (
					<>
						<Text style={styles.userNameText}>
							{`${ 'feeling' + ' ' }${ props.activityName } `}
						</Text>
						<Text style={{ fontSize: 24 }}>{props.smily}</Text>
					</>
				) : (
					<>
						<FastImage
							style={styles.activityIcon}
							source={
								props.activityType == 'traveling'
									? traveling
									: props.activityType == 'listening'
										? listening
										: props.activityType == 'watching'
											? watching
											: playing
							}
						/>
						<Text style={styles.userNameText}>
							{`  ${ props.activityType } `}
						</Text>
						<Text style={{ fontSize: 24 }}>{props.activityName}</Text>
					</>
				)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	nameAndTypeTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingHorizontal: 12,
		paddingVertical: 2
	},
	userNameText: {
		fontSize: 20,
		fontStyle: 'normal',
		fontWeight: '600',
		color: colors.secondaryText
	},
	activityIcon: {
		height: 20,
		width: 20
	}
});

export default FeelingsAndActivites;
