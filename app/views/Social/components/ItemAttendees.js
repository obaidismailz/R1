import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo } from 'react';
import {
	View, StyleSheet, Pressable, Text, Dimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { colors, exStyles } from '@styles';
import { withDimensions } from '../../../dimensions';
import { withTheme } from '../../../theme';
import { goRoom } from '../../../utils/goRoom';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemAttendees = ({ isMasterDetail, ...props }) => (
	<Pressable
		style={({ pressed }) => [
			{
				backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
			},
			styles.container
		]}
		onPress={props.onPress && props.onPress}
	>
		<FastImage style={styles.userAvatar} source={{ uri: props.data.image }} />
		<View style={{ justifyContent: 'center', marginStart: 15, flex: 1 }}>
			<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
				{props.data.fname} {props.data.lname}
			</Text>
			<Text style={{ color: 'grey', fontSize: 13 }}>
				{props.data.user_roles.name}
			</Text>
		</View>
		<View style={styles.iconContainer}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.icon
				]}
				onPress={() => {
					const item = {
						_id: props.data.rc_user_id,
						status: 'offline',
						name: props.data.fname,
						username: props.data.username,
						outside: 'true',
						rid: props.data.username,
						t: 'd',
						search: true
					};
					goRoom({ item, isMasterDetail });
				}}
			>
				<Text
					style={[
						exStyles.descriptionSmallText,
						{ color: colors.secondaryText, padding: 4 }
					]}
				>
					{'Say Hi '}
					<IonIcons
						name='ios-chatbubbles-outline'
						size={24}
						color={colors.secondaryText}
					/>
				</Text>
			</Pressable>
		</View>
	</Pressable>
);

const styles = StyleSheet.create({
	container: {
		width: screenWidth,
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: RFValue(24),
		paddingVertical: 24
	},
	userAvatar: {
		height: 60,
		width: 60,
		borderRadius: 30,
		resizeMode: 'contain',
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},
	iconContainer: {
		justifyContent: 'center',
		marginStart: 10,
		alignItems: 'flex-end'
	},
	icon: {
		padding: 2,
		borderRadius: 4
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10)
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey'
		// marginTop: RFValue(10),
	}
});

export default withDimensions(withTheme(memo(ItemAttendees)));
