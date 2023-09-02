import React from 'react';
import {
	View, Text, StyleSheet, Platform, Dimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { colors, exStyles } from '@styles';

const MentionUsersAndLocation = ({ ...props }) => (props.mentionUsers == 0 ? (
	props.postMap == '' ? (
		<Text
			style={[exStyles.mediumTitleMed20, { color: colors.secondaryText }]}
		>
			{' '}
			{ShareData.getInstance().name}
		</Text>
	) : (
		<View style={styles.textWrap}>
			<Text
				style={[exStyles.mediumTitleMed20, { color: colors.secondaryText }]}
			>
				{' '}
				{ShareData.getInstance().name}
			</Text>
			<Text> at</Text>
			<Text style={styles.userNameText}>{props.postMap}</Text>
		</View>
	)
) : (
	<View style={styles.textWrap}>
		<Text
			style={[exStyles.mediumTitleMed20, { color: colors.secondaryText }]}
		>
			{ShareData.getInstance().name}
		</Text>
		<Text> is with </Text>
		<Text style={styles.userNameText}>
			{props.mentionUsers[0].replace('@', '')}
		</Text>
		{props.mentionUsers.length > 1 ? (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'flex-start',
					alignItems: 'center'
				}}
			>
				<Text> and </Text>
				<Text style={styles.userNameText}>
					{props.mentionUsers.length - 1} others.
				</Text>
			</View>
		) : null}
		{props.postMap == '' ? null : (
			<View style={styles.textWrap}>
				<Text> at</Text>
				<Text style={styles.userNameText}>{props.postMap}</Text>
			</View>
		)}
	</View>
));

const styles = StyleSheet.create({
	mentionUsersAndPoilicyContainer: {
		flex: 1,
		flexWrap: 'wrap',
		justifyContent: 'flex-start'
	},

	userNameText: {
		fontSize: 20,
		fontStyle: 'normal',
		fontWeight: '600',
		color: colors.secondaryText
	},

	textWrap: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	}
});

export default MentionUsersAndLocation;
