import React, { memo } from 'react';
import {
	View, Text, StyleSheet, Pressable
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ShareData } from '@utils';
import { exStyles } from '@styles';
import Navigation from '../../../../../lib/Navigation';
import { themes } from '../../../../../constants/colors';
import { withTheme } from '../../../../../theme';
import { withDimensions } from '../../../../../dimensions';

const CreatePostContainer = ({ ...props }) => {
	const { theme } = props;

	const navigateToCreatePostView = () => {
		Navigation.navigate('CreatePostView');
	};

	return (
		<View style={styles.createPostContainer}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.containerPressed
				]}
				onPress={navigateToCreatePostView}
			>
				<FastImage
					style={styles.imageAvtar}
					resizeMode='cover'
					source={{ uri: ShareData.getInstance().image }}
				/>
				<Text
					style={[
						exStyles.descriptionSmallText,
						{ color: '#000000', opacity: 0.4 }
					]}
				>
					Whats on your mind?
				</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	createPostContainer: {
		flexDirection: 'row',
		alignSelf: 'center',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingHorizontal: RFValue(24),
		width: '100%',
		height: 40,
		marginTop: 16
	},
	containerPressed: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		height: 40,
		borderWidth: 0.5,
		borderRadius: 20,
		borderColor: 'rgba(0, 0, 0, 0.4)'
	},
	imageAvtar: {
		height: 40,
		width: 40,
		marginRight: 10,
		borderRadius: 20,
		borderWidth: 0.5,
		borderColor: 'rgba(0, 0, 0, 0.4)'
	}
});

export default withDimensions(withTheme(memo(CreatePostContainer)));
