import React, { memo } from 'react';
import {
	View, Text, TouchableOpacity, Dimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import { settings as RocketChatSettings } from '@rocket.chat/sdk';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemAuditoruimView = ({ ...props }, ref) => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={styles.container}
		onPress={props.onPress && props.onPress}
	>
		<View style={{ flexDirection: 'row', marginBottom: 10 }}>
			<Text
				numberOfLines={1}
				style={[exStyles.infoLargeM18, { color: colors.primaryText }]}
			>
				{props.data.name}
			</Text>
		</View>
		<View style={styles.imageContainer}>
			<FastImage
				style={styles.image}
				source={{
					uri: props.data.image,
					headers: RocketChatSettings.customHeaders,
					priority: FastImage.priority.high
				}}
			/>
		</View>
		<View style={{ height: RFValue(15) }} />
	</TouchableOpacity>
);

const styles = {
	container: {
		borderColor: '#cecece',
		borderBottomWidth: 1,
		paddingBottom: RFValue(5),
		paddingTop: RFValue(15)
	},
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: RFValue(10),
		overflow: 'hidden'
	},
	image: {
		height: screenWidth * 0.4,
		width: '100%',
		resizeMode: 'stretch'
	}
};

export default memo(ItemAuditoruimView);
