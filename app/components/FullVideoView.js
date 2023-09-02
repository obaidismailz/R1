import React, { memo, useState, useCallback } from 'react';
import { View, Dimensions, TouchableOpacity, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

import Icon from 'react-native-vector-icons/FontAwesome5';
import YoutubePlayer from 'react-native-youtube-iframe';

import { withDimensions } from '../dimensions';
import { withTheme } from '../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const FullVideoView = ({ isMasterDetail, ...props }) => {
	const { theme } = props;
	const [loading, setLoading] = useState(true);

	Content = () => (
		<View
			style={{
				flex: 1,
				justifyContent: 'center'
			}}>
			<ActivityIndicator size='large' animating={loading} color='#ffffff' />
			<YoutubePlayer height={300} play videoId={props.videoId} onReady={() => setLoading(false)} forceAndroidAutoplay />
		</View>
	);

	return (
		<Modal
			isVisible={props.visible}
			backdropColor='#000000'
			animationIn='zoomIn'
			animationOut='zoomOut'
			animationInTiming={200}
			animationOutTiming={1000}
			backdropTransitionInTiming={600}
			backdropTransitionOutTiming={600}
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			avoidKeyboard
			coverScreen
			swipeThreshold={0.5}
			swipeDirection='down'
			onSwipeComplete={props.onClose}
			style={{ margin: 0 }}>
			<View
				style={{
					flex: 1
				}}>
				<View style={styles.header}>
					<TouchableOpacity onPress={() => props.onClose()} style={styles.closeButton}>
						<Icon name='times' size={12} color='#ffffff' />
					</TouchableOpacity>
				</View>
				<Content />
			</View>
		</Modal>
	);
};

export default withDimensions(withTheme(memo(FullVideoView)));

const styles = StyleSheet.create({
	header: {
		height: 45,
		marginTop: 50,
		justifyContent: 'flex-start',
		marginHorizontal: 15
	},

	closeButton: {
		height: 30,
		width: 30,
		borderRadius: 15,
		backgroundColor: '#3695FF',
		alignItems: 'center',
		justifyContent: 'center'
	},

	postContainer: {
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center'
	}
});
