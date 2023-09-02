import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo, useState } from 'react';
import {
	Text, Pressable, Dimensions, StyleSheet
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { colors, exStyles } from '@styles';
import AlertModal from '../../../components/AlertModal';
import { saveBookmark, deleteBookmark } from '../../../utils/Repository';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const BoothModalListItem = ({ ...props }) => {
	const [alertVisibility, setAlertVisibility] = useState(false);
	const [bookMarked, setBookMarked] = useState(
		!(
			props.item.bookmarked === null
			|| props.item.bookmarked === undefined
			|| props.item.bookmarked === ''
		)
	);
	const [bookMarkType, setBookMarkType] = useState('');
	const [bookMarkTypeId, setBookMarkTypeId] = useState('');

	function saveBookMark(type, id) {
		saveBookmark(type, id);
		setBookMarked(true);
	}

	const showAlert = (type, id) => {
		setBookMarkType(type);
		setBookMarkTypeId(id);
		setAlertVisibility(true);
	};

	const deleteBookMark = (type, typeId) => {
		deleteBookmark(type, typeId);
		setBookMarked(false);
		setAlertVisibility(false);
	};

	return (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
				},
				styles.itemContainer
			]}
			onPress={props.onPress && props.onPress}
		>
			<FastImage style={styles.image} source={{ uri: props.item.logo }} />
			<Text style={[exStyles.infoLargeM18, styles.txtBlogTitle]}>
				{props.item.name}
			</Text>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.bookmarkIcon
				]}
				// onPress={() => {
				//   bookMarked
				//     ? showAlert("booth", props.item.id)
				//     : saveBookMark("booth", props.item.id);
				// }}
			>
				{/* <FIcon
          name={bookMarked ? "bookmark" : "bookmark-o"}
          size={RFValue(20)}
          color={bookMarked ? colors.primaryColor : "#7E8389"}
        /> */}
			</Pressable>
			<AlertModal
				visible={alertVisibility}
				type={bookMarkType}
				type='Bookmark'
				typeId={bookMarkTypeId}
				onYes={deleteBookMark}
				onClose={() => {
					setAlertVisibility(false);
				}}
			/>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		height: screenHeight,
		width: screenWidth
	},
	modalView: {
		height: screenHeight,
		width: screenWidth,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(32)
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginStart: 28,
		marginEnd: 28,
		alignItems: 'center'
	},
	itemContainer: {
		flexDirection: 'row',
		paddingHorizontal: RFValue(20),
		alignItems: 'center',
		paddingVertical: RFValue(16)
	},
	image: {
		resizeMode: 'cover',
		height: RFValue(44),
		width: RFValue(44),
		borderRadius: RFValue(100),
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},
	bookmarkIcon: {
		paddingVertical: 3,
		paddingHorizontal: 5,
		marginEnd: -5
	},
	txtBlogTitle: {
		color: colors.primaryText,
		flex: 1,
		marginStart: 10
	}
});

export default memo(BoothModalListItem);
