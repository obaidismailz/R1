import React, { useState } from 'react';
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Pressable,
	ActivityIndicator,
	Linking
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import FullImageView from '../../../../../components/FullImageView';

const PostContentImage = (props) => {
	const [loading, setLoading] = useState(true);
	const [fullImageVisible, setFullImageVisible] = useState(false);
	function onLoadEnd() {
		setLoading(false);
	}
	return (
		<>
			<TouchableOpacity
				activeOpacity={0.9}
				onPress={() => setFullImageVisible(true)}
			>
				<View style={styles.postContainer}>
					<FastImage
						onLoadEnd={onLoadEnd}
						source={{ uri: props.item.postFile.url }}
						style={styles.postImage}
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
				</View>
			</TouchableOpacity>
			<FullImageView
				visible={fullImageVisible}
				url={props.item.postFile.url}
				onClose={() => setFullImageVisible(false)}
			/>
		</>
	);
};

const PostContentMap = (props) => {
	const [loading, setLoading] = useState(true);
	function onLoadEnd() {
		setLoading(false);
	}
	return (
		<View style={styles.postContainer}>
			<FastImage
				onLoadEnd={onLoadEnd}
				source={{
					uri: `https://maps.googleapis.com/maps/api/staticmap?center=${ props.postMap }&zoom=13&size=600x250&maptype=roadmap&markers=color:red%7C${ props.postMap }&key= AIzaSyBpb3cDLn6K6bqrO3j-uraVfyCrLQmaJ-g`
				}}
				style={{ width: '100%', aspectRatio: 18 / 9 }}
				resizeMode='contain'
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
		</View>
	);
};

const PostContentFile = (props) => {
	const [loading, setLoading] = useState(true);
	function onLoadEnd() {
		setLoading(false);
	}
	return (
		<Pressable onPress={() => Linking.openURL(props.item.postFile.url)}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<View style={{ marginRight: 10 }}>
					<FastImage
						onLoadEnd={onLoadEnd}
						source={{
							uri:
								'https://www.sat7uk.org/wp-content/uploads/2018/11/kisspng-pdf-computer-icons-encapsulated-postscript-logo-pdf-5afde5cc758a98.9626072515265888764815.png'
						}}
						style={{ height: 50, width: 50 }}
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
				</View>
				<Text>{props.item.postFile.postFileName}</Text>
			</View>
		</Pressable>
	);
};

export { PostContentImage, PostContentMap, PostContentFile };

const styles = StyleSheet.create({
	postContainer: {
		width: '100%',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center',
		marginTop: 8
	},

	// Image styling
	postImage: {
		aspectRatio: 17 / 14,
		width: '100%'
	},

	// album Image styling
	image: {
		width: 300,
		marginHorizontal: 0.5
	}
});
