import React, { useState, memo } from 'react';
import { View, Dimensions, TouchableOpacity, Platform, ActivityIndicator, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FastImage from '@rocket.chat/react-native-fast-image';
import { withTheme } from '../theme';
import { withDimensions } from '../dimensions';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const FullImageView = ({ isMasterDetail, ...props }) => {
	const { theme } = props;
	const [loading, setLoading] = useState(true);

	onLoadEnd = () => {
		setLoading(false);
	};

	Content = () => (
		<View style={styles.postContainer}>
			<FastImage
				onLoadEnd={onLoadEnd}
				source={{ uri: props.url }}
				style={{
					width: deviceWidth,
					height: '90%',
					justifyContent: 'center',
					alignContent: 'center'
				}}
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
				color='#ffffff'
			/>
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
					flex: 1,
					flexDirection: 'column'
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

export default withDimensions(withTheme(memo(FullImageView)));

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
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'center',
		alignContent: 'center',
		alignSelf: 'center'
	}
});
