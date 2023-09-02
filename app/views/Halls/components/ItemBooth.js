import React, { memo, useState, useEffect } from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	TouchableOpacity,
	Dimensions,
	Pressable
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import FIcon from 'react-native-vector-icons/FontAwesome';
import { saveBookmark, deleteBookmark } from '../../../utils/Repository';
import AlertModal from '../../../components/AlertModal';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemBooth = ({ ...props }, ref) => {
	const { theme } = props;
	const [loading, setLoading] = useState(true);
	const [bookMarked, setBookMarked] = useState(
		!(
			props.data.bookmark === null
			|| props.data.bookmark === ''
			|| props.data.bookmark === undefined
		)
	);
	const [alertVisibility, setAlertVisibility] = useState(false);
	const [bookMarkType, setBookMarkType] = useState('');
	const [bookMarkTypeId, setBookMarkTypeId] = useState('');

	function onLoadEnd() {
		setLoading(false);
	}

	function saveBookMark(type, id) {
		saveBookmark(type, id).then((res) => {
			props.updateBoothBookmark(res, props.index);
		});
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
		props.removeBoothBookmark(props.index);
	};

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={styles.itemContainer}
			onPress={props.onPress && props.onPress}
		>
			<View style={styles.boothItemHeader}>
				<FastImage style={styles.itemLogo} source={{ uri: props.data.logo }} />
				<Text style={[exStyles.infoLargeM18, styles.txtBlogTitle]}>
					{props.data.name}
				</Text>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.bookmarkIconContainer
					]}
					// onPress={() => {
					//   bookMarked
					//     ? showAlert("booth", props.data.id)
					//     : saveBookMark("booth", props.data.id);
					// }}
				>
					{/* <FIcon
            name={bookMarked ? "bookmark" : "bookmark-o"}
            size={RFValue(20)}
            color={bookMarked ? colors.primaryColor : "#7E8389"}
          /> */}
				</Pressable>
			</View>
			<View
				style={{
					alignItems: 'center',
					justifyContent: 'center'
				}}
			>
				<FastImage
					onLoadEnd={onLoadEnd}
					resizeMode='cover'
					style={styles.itemImage}
					source={{ uri: props.data.image }}
				/>
				<ActivityIndicator
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 100
					}}
					animating={loading}
				/>
			</View>
			<AlertModal
				visible={alertVisibility}
				type={bookMarkType}
				text='Bookmark'
				typeId={bookMarkTypeId}
				onYes={deleteBookMark}
				onClose={() => {
					setAlertVisibility(false);
				}}
			/>
		</TouchableOpacity>
	);
};

const styles = {
	itemContainer: {
		paddingHorizontal: RFValue(16),
		paddingVertical: 20,
		paddingBottom: 20
	},
	boothItemHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8
	},
	itemLogo: {
		height: RFValue(30),
		width: RFValue(30),
		resizeMode: 'cover',
		borderRadius: RFValue(100),
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},
	bookmarkIconContainer: {
		paddingVertical: 3,
		paddingHorizontal: 5,
		marginEnd: -5
	},
	itemImage: {
		height: screenWidth * 0.4,
		width: screenWidth - RFValue(50),

		borderRadius: RFValue(5)
	},
	txtBlogTitle: {
		color: colors.primaryText,
		flex: 1,
		marginStart: 10
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey',
		marginBottom: RFValue(3)
	},
	icon: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	txtDetails: {
		fontSize: RFValue(12),
		color: 'grey',
		marginStart: RFValue(5)
	},
	absolutePlay: {
		height: RFValue(60),
		width: RFValue(60),
		resizeMode: 'contain',
		tintColor: 'white'
	}
};

export default memo(ItemBooth);
