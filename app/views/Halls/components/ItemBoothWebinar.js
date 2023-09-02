import React, { memo, useState, useImperativeHandle } from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet,
	Pressable,
	Dimensions,
	Share
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { FormButton } from '@components';
import FastImage from '@rocket.chat/react-native-fast-image';
import { TouchableOpacity } from 'react-native-gesture-handler';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemBoothWebinar = ({ ...props }, ref) => {
	const onShare = async() => {
		try {
			const result = await Share.share({
				message: props.data.join_url
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
				} else {
				}
			} else if (result.action === Share.dismissedAction) {
			}
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.webinarContainer}
			onPress={props.onPress}
		>
			<View style={styles.webinarTextContainer}>
				<Text
					numberOfLines={1}
					style={[
						exStyles.infoLargeM18,
						{ color: colors.primaryText, flex: 1 }
					]}
				>
					{props.data.topic}
				</Text>

				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.shareIcon
					]}
					onPress={() => {
						onShare();
					}}
				>
					<MaterialCommunityIcons
						name='share-variant'
						size={24}
						color={colors.secondaryText}
					/>
				</Pressable>
			</View>
			<Text
				numberOfLines={1}
				style={[
					exStyles.infoLink14Med,
					{ color: colors.primaryColor, flex: 1, marginBottom: 8 }
				]}
			>
				{`Event Start Time ${ props.data.start_time }`}
			</Text>
			<FastImage
				style={styles.webinarImage}
				source={{ uri: props.data.image }}
			/>
			<View style={styles.liveText}>
				<Text
					style={[
						exStyles.customStatus,
						{ color: 'white', textAlign: 'center' }
					]}
				>
					{props.data.status}
				</Text>
			</View>
			{props.data.status == 'live' || props.data.status == 'Live' ? (
				<FormButton title='JOIN NOW' extraStyle={styles.formButton} />
			) : null}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	webinarContainer: {
		marginHorizontal: RFValue(16),
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	webinarTextContainer: { flex: 1, flexDirection: 'row', alignItems: 'center' },
	shareIcon: {
		paddingHorizontal: 3,
		borderRadius: 4
	},
	formButton: {
		paddingHorizontal: 20,
		position: 'absolute',
		left: 100,
		right: 100,
		top: 90,
		bottom: 90,
		borderRadius: 15
	},
	webinarImage: {
		height: RFValue(160),
		width: RFValue(88),
		width: '100%',
		resizeMode: 'stretch',
		borderRadius: RFValue(10),
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center'
	},
	liveText: {
		paddingHorizontal: 10,
		paddingVertical: 2,
		borderRadius: 8,
		backgroundColor: colors.secondaryColor,
		position: 'absolute',
		bottom: 8,
		left: 8
	}
});

export default memo(ItemBoothWebinar);
