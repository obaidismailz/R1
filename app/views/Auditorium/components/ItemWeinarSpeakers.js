import React, { memo, useState, useImperativeHandle } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, Dimensions, Share, ImageBackground } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { FormButton } from '@components';
import FastImage from '@rocket.chat/react-native-fast-image';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export default ItemAuditoriumStaff = memo(({ ...props }) => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={{
			flexDirection: 'row',
			marginHorizontal: RFValue(10),
			paddingVertical: RFValue(10),
			borderColor: '#cecece',
			alignItems: 'center'
		}}
		onPress={props.onPress}>
		<FastImage
			style={{
				height: RFValue(60),
				width: RFValue(60),
				borderRadius: RFValue(60)
			}}
			source={{
				uri: props.data.image,
				headers: RocketChatSettings.customHeaders,
				priority: FastImage.priority.low
			}}
		/>
		<View style={{ marginStart: RFValue(20) }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: RFValue(5)
				}}>
				<View
					style={{
						paddingHorizontal: RFValue(10),
						borderRadius: RFValue(10),
						marginEnd: RFValue(10),
						backgroundColor: '#2775EE',
						color: 'white',
						height: RFValue(24),
						justifyContent: 'center'
					}}>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: 'white'
							}
						]}>
						Speaker
					</Text>
				</View>
				<>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoLargeM16,
							{ color: colors.primaryText, width: '55%' }
						]}>{`${props.data.fname} ${props.data.lname}`}</Text>
					<Text style={[exStyles.customStatus, { color: colors.secondaryText }]}>
						{props.data.job_title}
						{props.data.company_name == '' ? '' : `\n@ ${props.data.company_name}`}
					</Text>
				</>
			</View>
		</View>
	</TouchableOpacity>
));

// {
// 	props.data.user.job_title + props.data.user.company_name == ''
// 		? ''
// 		: ` \n@ ${ props.data.user.company_name }`;
// }
