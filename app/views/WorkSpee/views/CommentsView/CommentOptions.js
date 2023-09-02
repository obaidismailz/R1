import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Dimensions, Pressable, Platform } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ShareData } from '@utils';
import { withDimensions } from '../../../../dimensions';
import { withTheme } from '../../../../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const CommentOptions = ({ ...props }) => {
	const { theme } = props;

	const renderOutSideTouchable = onTouch => {
		const view = <View style={{ flex: 1, width: '100%' }} />;
		if (!onTouch) {
			return view;
		}
		return (
			<TouchableWithoutFeedback onPress={onTouch} style={{ flex: 1, width: '100%' }}>
				{view}
			</TouchableWithoutFeedback>
		);
	};

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
			{props.data.user_id == ShareData.getInstance().user_id ? (
				<View>
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
							},
							styles.bottomSheetItemContainer
						]}
						onPress={() => props.onEditComment(props.data.id, props.data.text)}>
						<Icon name='pen' size={18} style={styles.bottomSheetIconStyle} />
						<Text style={styles.bottomSheetTestStyle}>Edit Comment</Text>
					</Pressable>
					<View style={styles.bottomSheetItemSeparator} />
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
							},
							styles.bottomSheetItemContainer
						]}
						onPress={() => props.onDeleteComment(props.data.id)}>
						<Icon name='trash-alt' size={18} style={styles.bottomSheetIconStyle} />
						<Text style={styles.bottomSheetTestStyle}>Delete Comment</Text>
					</Pressable>
				</View>
			) : null}
		</View>
	);

	return (
		<Modal
			backdropColor='#000000'
			backdropOpacity={0.5}
			animationIn='slideInUp'
			animationOut='slideOutDown'
			isVisible={props.visible}
			backdropTransitionInTiming={100}
			backdropTransitionOutTiming={Platform.OS == 'ios' ? 100 : 0}
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
					<Header />
					<SheetItems />
				</View>
			</View>
		</Modal>
	);
};

export default withDimensions(withTheme(memo(CommentOptions)));

const styles = StyleSheet.create({
	bottomSheetContentContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		borderTopLeftRadius: 26,
		borderTopRightRadius: 26
	},
	header: {
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderTopLeftRadius: 26,
		borderTopRightRadius: 26
	},
	panelHeader: {
		alignItems: 'center'
	},
	panelHandle: {
		width: 85,
		height: 5,
		borderRadius: 8,
		backgroundColor: '#B8B8B8',
		marginTop: 14,
		marginBottom: 6
	},
	// sheet items
	bottomSheetItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingLeft: 36,
		paddingBottom: 24,
		paddingTop: 24
	},

	bottomSheetIconStyle: {
		marginRight: 24
	},

	bottomSheetTestStyle: {
		fontSize: 16,
		lineHeight: 16,
		fontWeight: '400',
		fontStyle: 'normal',
		color: '#424242'
	},
	bottomSheetItemSeparator: {
		height: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.08)'
	}
});
