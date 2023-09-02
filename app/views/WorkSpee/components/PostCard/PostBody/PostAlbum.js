import React, { useState } from 'react';
import {
	StyleSheet,
	FlatList,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import FullImageView from '../../../../../components/FullImageView';

const PostAlbum = ({ ...props }) => {
	const [loading, setLoading] = useState(true);
	const [fullImageVisible, setFullImageVisible] = useState(false);
	const [fullImageUrl, setFullImageUrl] = useState('');

	return (
		<FlatList
			data={props.albumData}
			horizontal
			showsHorizontalScrollIndicator={false}
			renderItem={({ item }) => (
				<TouchableOpacity
					activeOpacity={0.9}
					onPress={() => {
						setFullImageVisible(true), setFullImageUrl(item.image);
					}}
				>
					<FastImage
						onLoadEnd={() => setLoading(false)}
						source={{
							uri: item.image
						}}
						style={styles.image}
						resizeMode='cover'
					/>
					<ActivityIndicator
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 100
						}}
						animating={loading}
						color='#000000AA'
					/>
					<FullImageView
						visible={fullImageVisible}
						url={fullImageUrl}
						onClose={() => setFullImageVisible(false)}
					/>
				</TouchableOpacity>
			)}
		/>
	);
};

export default PostAlbum;

const styles = StyleSheet.create({
	postContainer: {
		width: '100%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center'
	},
	// album Image styling
	image: {
		width: 300,
		aspectRatio: 18 / 14,
		marginHorizontal: 0.5
	}
});
