import React, { useState, memo } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	Dimensions,
	TouchableOpacity,
	Platform,
	TextInput,
	Animated
} from 'react-native';
import Modal from 'react-native-modal';
import FastImage from '@rocket.chat/react-native-fast-image';
import axios from 'axios';
import { withDimensions } from '../../../../dimensions';
import { withTheme } from '../../../../theme';
import { SHARE_POST } from '../../../../utils/Constants';
import { ShareData } from '@utils';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '../../../../styles';
let qs = require('qs');

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const SharePostOptions = ({ isMasterDetail, user, ...props }) => {
	const { theme } = props;

	const item = props.item;
	const [sharePostText, setSharePostText] = useState('');

	const renderOutSideTouchable = onTouch => {
		const view = <View style={{ flex: 1, width: '100%' }} />;
		if (!onTouch) return view;
		return (
			<TouchableWithoutFeedback onPress={onTouch} style={{ flex: 1, width: '100%' }}>
				{view}
			</TouchableWithoutFeedback>
		);
	};

	const SheetItems = () => (
		<View
			style={{
				backgroundColor: '#ffffff',
				marginBottom: Platform.OS === 'ios' ? 25 : 10
			}}>
			<View style={styles.avtarContainerInDropDown}>
				<FastImage
					style={styles.imageAvtar}
					resizeMode={'cover'}
					source={{
						uri: 'https://s-media-cache-ak0.pinimg.com/736x/43/cd/6e/43cd6e82491bf130d97624c198ee1a3f--funny-movie-quotes-funny-movies.jpg',
						priority: FastImage.priority.high
					}}
				/>
				<Text style={styles.nameTextStyle}>Salman</Text>
			</View>
			<View style={styles.textInputContainer}>
				<TextInput
					multiline={true}
					placeholder='Say somthing about this...'
					placeholderTextColor='#000000AA'
					style={styles.inputfieldStyle}
					value={sharePostText}
					onChangeText={val => {
						setSharePostText(val);
					}}></TextInput>
			</View>
			<TouchableOpacity style={styles.shareButtonStyle} onPress={() => sharePostOnTimeLine()}>
				<Text style={styles.sharebuttonTextStyle}>Share Now</Text>
			</TouchableOpacity>
		</View>
	);

	const sharePostOnTimeLine = async () => {
		let params = {
			type: 'share_post_on_timeline',
			id: item.post_id,
			user_id: ShareData.getInstance().user_id,
			text: sharePostText
		};
		await axios({
			method: 'POST',
			url: SHARE_POST + ShareData.getInstance().timeline_token,
			data: qs.stringify(params)
		})
			.then(response => {
				if (response.data.api_status == 200) {
					setSharePostText('');
					props.onClose();
				}
			})
			.catch(error => {
				alert(error);
			});
	};

	return (
		<Modal
			backdropColor='#000000'
			backdropOpacity={0.5}
			animationIn={'slideInUp'}
			animationOut={'slideOutDown'}
			isVisible={props.visible}
			backdropTransitionInTiming={300}
			backdropTransitionOutTiming={0}
			customBackdrop={null}
			hideModalContentWhileAnimating={false}
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			style={{ margin: 0 }}>
			<View
				style={{
					flex: 1
				}}>
				{renderOutSideTouchable(props.onClose)}
				<View style={styles.bottomSheetContentContainer}>
					<View style={styles.header}>
						<View style={styles.panelHeader}>
							<View style={styles.panelHandle} />
						</View>
					</View>
					<SheetItems />
				</View>
			</View>
		</Modal>
	);
};

export default withDimensions(withTheme(memo(SharePostOptions)));

const styles = StyleSheet.create({
	bottomSheetContentContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		borderTopLeftRadius: RFValue(24),
		borderTopRightRadius: RFValue(24)
		// maxHeight: deviceHeight * 0.6,
	},
	header: {
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderTopLeftRadius: RFValue(24),
		borderTopRightRadius: RFValue(24)
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
	//sheet items
	bottomSheetItemContainer: {
		backgroundColor: '#ffffff',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginLeft: 35,
		marginBottom: 20,
		marginTop: 20
	},
	// avatar
	avtarContainerInDropDown: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 15,
		marginLeft: 20
	},
	imageAvtar: {
		height: 46,
		width: 46,
		borderRadius: 23,
		marginRight: 8
	},
	textInputContainer: {
		marginTop: 10,
		marginLeft: 17,
		marginBottom: 21
	},

	inputfieldStyle: {
		color: '#000000',
		fontStyle: 'normal',
		fontSize: 14,
		fontWeight: '400',
		lineHeight: 18.75
	},

	nameTextStyle: {
		fontSize: 14,
		lineHeight: 16,
		fontWeight: 'bold',
		fontStyle: 'normal'
	},

	shareButtonStyle: {
		width: 100,
		height: 30,
		backgroundColor: colors.primaryColor,
		borderRadius: 4,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'flex-end',
		marginRight: 15
	},
	sharebuttonTextStyle: {
		color: '#ffffff',
		fontStyle: 'normal',
		fontSize: 12,
		fontWeight: 'bold',
		lineHeight: 18.75,
		alignItems: 'center'
	},

	bottomSheetIconStyle: {
		marginRight: 16,
		color: '#000000'
	},

	bottomSheetTestStyle: {
		fontSize: 14,
		lineHeight: 16,
		fontWeight: '400',
		fontStyle: 'normal'
	},
	bottomSheetItemSeparator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.04)'
	}
});
