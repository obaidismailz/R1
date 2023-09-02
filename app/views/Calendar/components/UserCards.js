import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const UserInfoCard = ({ ...props }) => {
	const { user } = props;
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'flex-start',
				padding: 16,
				backgroundColor: colors.unSelected,
				marginVertical: 16
			}}
		>
			<FastImage
				source={{ uri: user.image }}
				style={{ width: 60, height: 60, borderRadius: 30 }}
			/>
			<View style={{ marginStart: 10 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View
						style={{
							backgroundColor: colors.secondaryColor,
							paddingVertical: 2,
							paddingHorizontal: 8,
							borderRadius: 12
						}}
					>
						<Text style={[exStyles.infoLink14Med, { color: colors.white }]}>
							{user.user_roles.name}
						</Text>
					</View>
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
						{`  ${ user.fname } ${ user.lname }`}
					</Text>
				</View>
				<Text style={[exStyles.customStatus, { color: colors.secondaryText }]}>
					{`  ${ user.job_title }`}
				</Text>
				<View style={{ flexDirection: 'row' }}>
					<Text
						style={[exStyles.customStatus, { color: colors.secondaryText }]}
					>
						{user.company_name == '' ? '' : ` @${ user.company_name },`}
					</Text>

					{user.profile == undefined || user.profile == '' ? null : (
						<Text
							style={[exStyles.customStatus, { color: colors.secondaryText }]}
						>
							{` ${ user.profile.address }`}
						</Text>
					)}
				</View>
			</View>
		</View>
	);
};

const BoothOwnerCard = ({ ...props }) => {
	const { boothOwner } = props;
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'flex-start',
				padding: 16,
				backgroundColor: colors.unSelected,
				marginVertical: 16
			}}
		>
			<FastImage
				source={{ uri: boothOwner.image }}
				style={{ width: 60, height: 60, borderRadius: 30 }}
			/>
			<View style={{ marginStart: 10 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<View
						style={{
							backgroundColor: colors.secondaryColor,
							paddingVertical: 2,
							paddingHorizontal: 8,
							borderRadius: 12
						}}
					>
						<Text style={[exStyles.infoLink14Med, { color: colors.white }]}>
							Booth Owner
						</Text>
					</View>
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
						{`  ${ boothOwner.fname } ${ boothOwner.lname }`}
					</Text>
				</View>
			</View>
		</View>
	);
};

const TimeCard = props => (
	<TouchableOpacity
		style={[styles.containerTileSwitch, props.style]}
		activeOpacity={props.onPress === undefined ? 1 : 0.7}
		onPress={props.onPress && props.onPress}
	>
		<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
			{props.title}
		</Text>
		{props.children}
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	containerTileSwitch: {
		width: screenWidth,
		backgroundColor: 'white',
		borderColor: '#cecece',
		paddingHorizontal: RFValue(20),
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: RFValue(50)
	}
});

export { BoothOwnerCard, UserInfoCard, TimeCard };
