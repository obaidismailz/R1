import React, { useState, memo, useEffect } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableWithoutFeedback,
	Dimensions,
	Pressable,
	Platform,
	TextInput,
	Animated,
	FlatList,
	ActivityIndicator,
	SafeAreaView
} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwosome from 'react-native-vector-icons/FontAwesome';
import OctIcon from 'react-native-vector-icons/Octicons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { ShareData } from '@utils';
import { colors, exStyles } from '@styles';
import { withDimensions } from '../../../dimensions';
import { withTheme } from '../../../theme';
import { likeDetail } from '../../../apis/LoopExpoApi';
import Navigation from '../../../lib/Navigation';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const LikesDetailModal = ({ ...props }) => {
	const [likes, setLikes] = useState([]);
	const [filterLikes, setFilterLikes] = useState([]);
	const reactions = 'like,love,haha,wow,sad,angry';
	const [loading, setLoading] = useState(true);
	const [height, setHeight] = useState(deviceHeight * 0.5);
	const [selectedType, setSelectedType] = useState(0);

	const [reactionTypes] = useState([
		{
			id: 0,
			type: 'All',
			image: ''
		},
		{
			id: 1,
			type: 'like',
			image: require('../../../assets/Images/reactions/like.gif')
		},
		{
			id: 2,
			type: 'love',
			image: require('../../../assets/Images/reactions/love.gif')
		},
		{
			id: 3,
			type: 'haha',
			image: require('../../../assets/Images/reactions/haha.gif')
		},
		{
			id: 4,
			type: 'wow',
			image: require('../../../assets/Images/reactions/wow.gif')
		},
		{
			id: 5,
			type: 'sad',
			image: require('../../../assets/Images/reactions/sad.gif')
		},
		{
			id: 6,
			type: 'angry',
			image: require('../../../assets/Images/reactions/angry.gif')
		}
	]);

	useEffect(() => {
		likeDetail(props.type, props.data, reactions).then(response => {
			setLikes(
				likes.concat(
					response.records.like,
					response.records.love,
					response.records.haha,
					response.records.wow,
					response.records.sad,
					response.records.angry
				)
			);
			setFilterLikes(
				filterLikes.concat(
					response.records.like,
					response.records.love,
					response.records.haha,
					response.records.wow,
					response.records.sad,
					response.records.angry
				)
			);
			setLoading(false);
		});
	}, []);

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

	TabHeader = () => (
		<View style={{ borderBottomWidth: 1, borderBottomColor: colors.separatorColor }}>
			<FlatList
				horizontal
				data={reactionTypes}
				showsHorizontalScrollIndicator={false}
				style={{
					alignSelf: 'center',
					marginTop: 32,
					marginBottom: 16,
					marginHorizontal: 8
				}}
				renderItem={({ item, index }) => (
					<Pressable
						style={{ marginHorizontal: 16 }}
						onPress={() => {
							filterLikesList(item.id);
							setSelectedType(item.id);
						}}>
						{item.image == '' ? (
							<Text
								style={[
									exStyles.infoDetailR16,
									{
										color: selectedType == 0 ? colors.secondaryColor : colors.primaryText
									}
								]}>
								{`${item.type} ${loading ? '' : likes.length}`}
							</Text>
						) : (
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<FastImage style={{ height: 24, width: 24, marginEnd: 4 }} source={item.image} />
								<Text
									style={[
										exStyles.infoDetailR16,
										{
											color:
												selectedType == 1 && item.id == 1
													? colors.secondaryColor
													: selectedType == 2 && item.id == 2
													? '#ED5167'
													: (selectedType == 3 && item.id == 3) ||
													  (selectedType == 4 && item.id == 4) ||
													  (selectedType == 5 && item.id == 5)
													? '#FFD96A'
													: selectedType == 6 && item.id == 6
													? '#F6876B'
													: colors.primaryText
										}
									]}>
									{item.type}
								</Text>
							</View>
						)}
					</Pressable>
				)}
			/>
		</View>
	);

	userSeparator = () => (
		<View
			style={{
				height: 1,
				backgroundColor: colors.separatorColor,
				marginStart: 84
			}}
		/>
	);

	filterLikesList = id => {
		if (id == 0) {
			setFilterLikes(likes);
		} else {
			setFilterLikes(likes.filter(data => data.reaction == id));
		}
	};

	const SheetItems = () => (
		<View
			style={{
				backgroundColor: '#ffffff',
				height
			}}>
			<FlatList
				data={filterLikes}
				ListEmptyComponent={loading ? <ActivityIndicator size='small' /> : null}
				ItemSeparatorComponent={userSeparator}
				renderItem={({ item, index }) => (
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
							},
							styles.pressed
						]}
						onPress={() => {
							props.onClose();
							item.user_id == ShareData.getInstance().user_id
								? Navigation.navigate('ProfileStackNavigator')
								: Navigation.navigate('LoopUserProfile', {
										username: item.username
								  });
						}}>
						<FastImage style={{ height: 44, width: 44, borderRadius: 44 / 2 }} source={{ uri: item.avatar }} />
						<Text style={(exStyles.infoLargeM16, { color: colors.primaryText, marginStart: 16 })}>
							{`${item.first_name} ${item.last_name}`}
						</Text>
					</Pressable>
				)}
			/>
			<View style={styles.bottomSheetItemSeparator} />
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
			<SafeAreaView style={{ flex: 1 }} />

			{renderOutSideTouchable(props.onClose)}
			<SafeAreaView
				style={{
					backgroundColor: 'white',
					borderTopLeftRadius: 40,
					borderTopRightRadius: 40
				}}>
				<View style={styles.bottomSheetContentContainer}>
					{TabHeader()}
					<SheetItems />
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	bottomSheetContentContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		borderTopLeftRadius: 32,
		borderTopRightRadius: 32
		// maxHeight: deviceHeight * 0.6,
	},
	header: {
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderTopLeftRadius: 40,
		borderTopRightRadius: 40
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
	pressed: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 24,
		paddingVertical: 16
	}
});

export default withDimensions(withTheme(memo(LikesDetailModal)));
