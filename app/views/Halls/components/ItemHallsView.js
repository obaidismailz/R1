import React, { memo, useState } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	ActivityIndicator
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '@styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ItemHallsView = ({ ...props }, ref) => {
	const { theme } = props;
	const [loading, setLoading] = useState(true);

	function onLoadEnd() {
		setLoading(false);
	}

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.itemContainer}
			onPress={props.onPress && props.onPress}
		>
			<Text
				numberOfLines={1}
				style={[exStyles.infoLargeM18, { color: colors.primaryText }]}
			>
				{props.data.name}
			</Text>
			<View style={styles.imageContainer}>
				<FastImage
					onLoad={onLoadEnd}
					style={styles.image}
					source={{ uri: props.data.image, priority: FastImage.priority.high }}
				/>
				<ActivityIndicator
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 100
					}}
					animating={loading}
					theme={theme}
				/>
			</View>
			<View style={{ height: RFValue(15) }} />
		</TouchableOpacity>
	);
};

const styles = {
	itemContainer: {
		borderColor: '#cecece',
		borderBottomWidth: 1,
		paddingBottom: RFValue(5),
		paddingTop: RFValue(10)
	},
	imageContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		height: screenWidth * 0.4,
		marginTop: RFValue(13),
		borderRadius: RFValue(10),
		overflow: 'hidden'
	},
	image: {
		height: '100%',
		width: '100%',
		resizeMode: 'stretch',
		overflow: 'hidden'
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: colors.primaryText,
		marginTop: RFValue(10),
		flex: 1
	}
};

export default memo(ItemHallsView);
