import React, { memo } from 'react';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Dimensions, Pressable, Platform } from 'react-native';
import Modal from 'react-native-modal';
import IonIcons from 'react-native-vector-icons/Ionicons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { FlatList } from 'react-native-gesture-handler';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { withDimensions } from '../../../dimensions';
import { withTheme } from '../../../theme';
import { goRoom } from '../../../utils/goRoom';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const SelectChatModalBooth = ({ isMasterDetail, ...props }) => {
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

	const goToChatRoom = data => {
		props.onClose();
		const item = {
			_id: '',
			status: 'offline',
			name: data.user.fname,
			username: data.user.username,
			outside: 'true',
			rid: data.user.username,
			t: 'd',
			search: true
		};
		goRoom({ item, isMasterDetail });
	};

	const User = ({ ...props }) => (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
				},
				styles.boothRepContainer
			]}
			onPress={() => goToChatRoom(props.data)}>
			<FastImage style={styles.boothRepImage} source={{ uri: props.data.user.image }} />
			<View>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>
					{props.data.user.fname} {props.data.user.lname}
				</Text>
				<Text
					style={[
						exStyles.infoSmallM11,
						{
							fontWeight: '600',
							color: props.type == 'owner' ? colors.primaryColor : colors.secondaryText
						}
					]}>
					{props.type == 'owner' ? 'owner' : 'rep'}
				</Text>
			</View>

			<IonIcons name='ios-chatbubbles-outline' size={RFValue(24)} color={colors.secondaryText} style={styles.icon} />
		</Pressable>
	);

	const SheetItems = () => (
		<View
			style={{
				backgroundColor: '#ffffff',
				marginBottom: Platform.OS === 'ios' ? 32 : 0
			}}>
			<FlatList
				data={props.boothRep}
				ListHeaderComponent={
					<>
						<User data={{ user: props.owner }} type='owner' />
					</>
				}
				renderItem={({ item, index }) => <User data={item} type='Rep' />}
			/>
		</View>
	);

	return (
		<Modal
			backdropColor='#000000'
			useNativeDriver
			backdropOpacity={0.5}
			animationIn='slideInUp'
			animationOut='slideOutDown'
			isVisible={props.visible}
			backdropTransitionInTiming={200}
			backdropTransitionOutTiming={Platform.OS == 'ios' ? 100 : 0}
			customBackdrop={null}
			hideModalContentWhileAnimating={false}
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			style={{ margin: 0 }}>
			<View style={{ flex: 1 }}>
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
	},

	// Booth Rep
	boothRepContainer: {
		flexDirection: 'row',
		paddingHorizontal: RFValue(16),
		alignItems: 'center',
		paddingVertical: RFValue(6)
	},
	boothRepImage: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(60),
		marginRight: RFValue(8)
	},
	icon: { position: 'absolute', right: 16 }
});

export default withDimensions(withTheme(memo(SelectChatModalBooth)));
