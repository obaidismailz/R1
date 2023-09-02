import FastImage from '@rocket.chat/react-native-fast-image';
import React from 'react';
import {
	View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '../../../styles';

const Itemauditoriumstaff = ({ ...props }) => (
	<TouchableOpacity
		activeOpacity={0.8}
		onPress={props.onPress && props.onPress}
		style={{
			flexDirection: 'row',
			marginHorizontal: RFValue(24),
			paddingVertical: RFValue(10),
			borderColor: '#cecece',
			alignItems: 'center'
		}}
		onPress={props.onPress}
	>
		<FastImage
			style={{
				height: RFValue(60),
				width: RFValue(60),
				borderWidth: 1,
				borderColor: colors.black20,
				borderRadius: RFValue(60)
			}}
			source={{
				uri: props.data.image,
				priority: FastImage.priority.low
			}}
		/>
		<View style={{ flex: 1, marginStart: RFValue(10) }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center'
				}}
			>
				<View
					style={{
						paddingHorizontal: RFValue(10),
						borderRadius: RFValue(10),
						marginEnd: RFValue(5),
						backgroundColor: colors.secondaryColor,
						color: 'white',
						height: RFValue(24),
						justifyContent: 'center'
					}}
				>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: 'white'
							}
						]}
					>
						Speaker
					</Text>
				</View>
				<Text
					numberOfLines={2}
					lineBreakMode='tail'
					style={[
						exStyles.infoLargeM16,
						{
							flex: 1,
							color: colors.primaryText
						}
					]}
				>
					{`${ props.data.fname } ${ props.data.lname }`}
				</Text>
			</View>
			<Text
				style={[
					exStyles.customStatus,
					{
						color: colors.secondaryText,
						marginTop: RFValue(2)
					}
				]}
			>
				{props.data.job_title === null
					? ''
					: props.data.job_title + props.data.company_name === null
						? ''
						: +'\n' + props.data.company_name}
			</Text>
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({});

export default Itemauditoriumstaff;
