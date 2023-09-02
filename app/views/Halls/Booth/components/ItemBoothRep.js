import * as React from 'react';
import {
	View, Text, StyleSheet, Dimensions, Pressable
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export default ItemBoothRep = ({ ...props }) => (
	<Pressable
		style={({ pressed }) => [
			{
				backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
			},
			styles.boothRepContainer
		]}
		onPress={props.onPress}
	>
		<FastImage
			style={styles.boothRepImage}
			source={{ uri: props.data.user.image }}
		/>
		<View style={{ marginStart: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					marginBottom: RFValue(5)
				}}
			>
				<View style={styles.boothRep}>
					<Text style={[exStyles.infoLink14Med, { color: 'white' }]}>
						Booth Rep
					</Text>
				</View>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
					{props.data.user.fname} {props.data.user.lname}
				</Text>
			</View>
			<Text style={[exStyles.infoSmallM11, { color: colors.secondaryText }]}>
				{props.data.user.job_title + props.data.user.company_name == ''
					? ''
					: ` \n@ ${ props.data.user.company_name }`}
			</Text>
		</View>
	</Pressable>
);

const styles = StyleSheet.create({
	// booth rep
	boothRepContainer: {
		flexDirection: 'row',
		paddingHorizontal: 30,
		alignItems: 'center',
		paddingVertical: RFValue(6)
	},
	boothRepImage: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(60)
	},
	boothRep: {
		paddingVertical: 2,
		paddingHorizontal: 12,
		borderRadius: 10,
		marginEnd: 8,
		backgroundColor: colors.secondaryColor
	}
});
