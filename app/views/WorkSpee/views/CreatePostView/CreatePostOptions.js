import React, { useState, memo, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	Dimensions,
	Pressable,
	Platform,
	TouchableOpacity,
	Image
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwosome from 'react-native-vector-icons/FontAwesome';
import OctIcon from 'react-native-vector-icons/Octicons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ShareData } from '@utils';
import { RFValue } from 'react-native-responsive-fontsize';
import { withDimensions } from '../../../../dimensions';
import { withTheme } from '../../../../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const CreatePostOptions = ({ ...props }) => {
	const { theme } = props;

	function renderOutSideTouchable(onTouch) {
		const view = <View style={{ flex: 1, width: '100%' }} />;
		if (!onTouch) {
			return view;
		}
		return (
			<TouchableWithoutFeedback onPress={onTouch} style={{ flex: 1, width: '100%' }}>
				{view}
			</TouchableWithoutFeedback>
		);
	}

	const Header = () => (
		<View style={styles.header}>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle} />
			</View>
		</View>
	);

	const SheetItems = () => (
		<View
			style={{
				backgroundColor: '#ffffff',
				marginBottom: Platform.OS === 'ios' ? 20 : 0
			}}>
			{props.video == null && props.gif == null && props.file == null ? (
				<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onImagePick()}>
					<Image style={{ height: 20, width: 20, marginRight: 16 }} source={require('../../../../static/icons/gallery.png')} />
					<Text style={styles.bottomSheetTestStyle}>Photo</Text>
				</TouchableOpacity>
			) : null}

			{props.image == null && props.gif == null && props.file == null ? (
				<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onVideoPick()}>
					<Image style={{ height: 17, width: 22, marginRight: 16 }} source={require('../../../../static/icons/video.png')} />
					<Text style={styles.bottomSheetTestStyle}>Video</Text>
				</TouchableOpacity>
			) : null}

			{/* <TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onMentionUser()}>
				<Image style={{ height: 22, width: 18.86, marginRight: 16 }} source={require('../../../../static/icons/user.png')} />
				<Text style={styles.bottomSheetTestStyle}>Mention</Text>
			</TouchableOpacity> */}

			{props.image == null && props.video == null && props.file == null ? (
				<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onGifPick()}>
					<Image style={{ height: 20, width: 20, marginRight: 16 }} source={require('../../../../static/icons/gif.png')} />
					<Text style={styles.bottomSheetTestStyle}>Gif</Text>
				</TouchableOpacity>
			) : null}

			<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onFeelingPick()}>
				<Image style={{ height: 20, width: 20, marginRight: 15 }} source={require('../../../../static/icons/smilewink.png')} />
				<Text style={styles.bottomSheetTestStyle}>Feeling/Activity</Text>
			</TouchableOpacity>

			{/* {props.image == null && props.gif == null && props.video == null ? (
				<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onFilePick()}>
					<Image style={{ height: 15.83, width: 12.67, marginRight: 21 }} source={require('../../../../static/icons/file.png')} />
					<Text style={styles.bottomSheetTestStyle}>File</Text>
				</TouchableOpacity>
			) : null} */}

			<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onCreatePoll()}>
				<Image style={{ height: 20, width: 20, marginRight: 16 }} source={require('../../../../static/icons/polling.png')} />
				<Text style={styles.bottomSheetTestStyle}>Polls</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.checkIn()}>
				<Image
					style={{ height: 19.79, width: 16.67, marginRight: 16 }}
					source={require('../../../../static/icons/location.png')}
				/>
				<Text style={styles.bottomSheetTestStyle}>Checking In</Text>
			</TouchableOpacity>

			{/* {props.image == null && props.gif == null && props.video == null && props.file == null ? (
				<TouchableOpacity style={styles.bottomSheetItemContainer} onPress={() => props.onMusicPick()}>
					<Image style={{ height: 16, width: 16, marginRight: 16 }} source={require('../../../../static/icons/music.png')} />
					<Text style={styles.bottomSheetTestStyle}>Music</Text>
				</TouchableOpacity>
			) : null} */}
		</View>
	);

	return (
		<Modal
			backdropColor='#000000'
			backdropOpacity={0.3}
			animationIn='slideInUp'
			animationOut='slideOutDown'
			useNativeDriver
			isVisible={props.visible}
			backdropTransitionInTiming={0}
			backdropTransitionOutTiming={0}
			customBackdrop={null}
			hideModalContentWhileAnimating={false}
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
					backgroundColor: 'transparent'
				}}>
				{renderOutSideTouchable(props.onClose)}
				<View style={styles.bottomSheetContentContainer}>
					<Header />
					<SheetItems />
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	bottomSheetContentContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		borderTopLeftRadius: RFValue(30),
		borderTopRightRadius: RFValue(30)
	},
	header: {
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderTopLeftRadius: RFValue(30),
		borderTopRightRadius: RFValue(30)
	},
	panelHeader: {
		alignItems: 'center'
	},
	panelHandle: {
		width: 85,
		height: 5,
		borderRadius: 8,
		backgroundColor: '#B8B8B8',
		marginTop: 13,
		marginBottom: 5
	},
	// sheet items
	bottomSheetItemContainer: {
		backgroundColor: '#ffffff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginLeft: 35,
		marginBottom: 12,
		marginTop: 12
	},

	bottomSheetItemImage: {
		height: 20,
		width: 20,
		marginRight: 16
	},

	bottomSheetTestStyle: {
		fontSize: 14,
		lineHeight: 16,
		fontWeight: '500',
		fontStyle: 'normal'
	},
	bottomSheetItemSeparator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.04)'
	}
});

export default withDimensions(withTheme(memo(CreatePostOptions)));
