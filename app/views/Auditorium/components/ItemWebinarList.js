import React, { memo } from 'react';
import { View, Image, Text, Pressable, TouchableOpacity, Dimensions, Share } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { FormButton } from '@components';
import FastImage from '@rocket.chat/react-native-fast-image';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemWebinarList = ({ ...props }, ref) => {
	const onShare = async () => {
		try {
			const result = await Share.share({
				message: props.data.status == 'recorded' ? props.data.recorded_url : props.data.join_url
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<TouchableOpacity
			activeOpacity={0.85}
			style={{
				marginHorizontal: 16,
				width: props.width
			}}
			onPress={props.onPress}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
				<Text numberOfLines={1} style={[exStyles.infoLargeM18, { color: colors.primaryText, width: '85%' }]}>
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
					}}>
					<MaterialCommunityIcons name='share-variant' size={22} color={colors.secondaryText} />
				</Pressable>
			</View>
			<Text
				style={[
					exStyles.infoLink14Med,
					{
						color: props.data.status === 'live' ? colors.primaryColor : 'grey'
					}
				]}>
				{props.data.start_time}
			</Text>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 10,
					marginTop: 8
				}}>
				<FastImage
					style={{
						borderRadius: 10,
						height: screenWidth * 0.4,
						width: '100%',
						resizeMode: 'cover'
					}}
					source={
						props.data.original_image == ''
							? require('../../../static/images/placeholder.jpg')
							: {
									uri: props.data.original_image,
									headers: RocketChatSettings.customHeaders,
									priority: FastImage.priority.high
							  }
					}>
					{props.status ? <Text style={styles.liveText}>{props.data.status}</Text> : null}
				</FastImage>
				{props.data.status === 'live' ? (
					<FormButton
						opacity={1}
						title='JOIN NOW'
						extraStyle={{
							position: 'absolute',
							width: RFValue(145),
							borderRadius: RFValue(15)
						}}
						onPress={props.onPress}
					/>
				) : props.data.status == 'recorded' ? (
					<TouchableOpacity style={{ position: 'absolute' }} onPress={props.onPress}>
						<Image style={styles.absolutePlay} source={require('@assets/Play.png')} />
					</TouchableOpacity>
				) : null}
				{props.data.status === 'live' && (
					<View
						style={{
							position: 'absolute',
							bottom: RFValue(10),
							left: RFValue(10),
							paddingHorizontal: 12,
							paddingVertical: 2,
							borderRadius: 6,
							backgroundColor: colors.secondaryColor,
							justifyContent: 'center'
						}}>
						<Text style={[exStyles.customStatus, { color: 'white', textAlign: 'center' }]}>LIVE</Text>
					</View>
				)}
			</View>
		</TouchableOpacity>
	);
};

const styles = {
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10),
		flex: 1
	},
	shareIcon: {
		paddingHorizontal: 3,
		borderRadius: 4
	},
	icon: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	txtDetails: {
		fontSize: RFValue(12),
		color: 'grey',
		marginStart: RFValue(5)
	},
	absolutePlay: {
		height: RFValue(60),
		width: RFValue(60),
		resizeMode: 'contain',
		tintColor: 'white'
	},
	liveText: {
		color: '#fff',
		paddingHorizontal: 10,
		paddingBottom: 2,
		borderRadius: 5,
		backgroundColor: colors.secondaryColor,
		position: 'absolute',
		bottom: 5,
		left: 5
	}
};

export default memo(ItemWebinarList);
