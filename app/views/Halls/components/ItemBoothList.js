import React, { memo } from 'react';
import {
	View, Text, TouchableOpacity, Dimensions
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import { Svg, Path } from 'react-native-svg';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemBoothList = ({ ...props }, ref) => {
	const { theme } = props;

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.itemContainer}
			onPress={props.onPress && props.onPress}
		>
			<View style={styles.boothItemHeader}>
				<FastImage style={styles.itemLogo} source={{ uri: props.data.logo }} />
				<Text style={[exStyles.infoLargeM16, styles.txtBlogTitle]}>
					{props.data.name}
				</Text>
			</View>
		</TouchableOpacity>
	);
};

const styles = {
	itemContainer: {
		alignItems: 'center',
		backgroundColor: colors.unSelected,
		paddingHorizontal: RFValue(4),
		marginBottom: RFValue(8),
		paddingVertical: RFValue(4),
		borderRadius: 10
	},
	boothItemHeader: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemLogo: {
		resizeMode: 'cover',
		height: 30,
		width: 30,
		borderRadius: 30 / 2,
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},

	txtBlogTitle: {
		color: colors.primaryText,
		flex: 1,
		marginStart: 10
	}
};

export default memo(ItemBoothList);
