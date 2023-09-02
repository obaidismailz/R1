import React, { memo, useState, useEffect } from 'react';
import {
	Text,
	TouchableOpacity,
	Dimensions,
	Pressable,
	FlatList,
	View
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Navigation from '../../../lib/Navigation';
import { getBoothListInHall } from '../../../apis/LoopExpoApi';
import ItemBootList from './ItemBoothList';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ItemHallsListView = ({ navigation, ...props }, ref) => {
	const { theme } = props;
	const [open, setOpen] = useState(false);
	const [booth, setBoothList] = useState([]);

	useEffect(() => {
		getBoothListInHall(props.data.id).then((response) => {
			if (response._metadata.status === 'SUCCESS') {
				setBoothList(response.records);
			}
		});
	}, []);

	return (
		<>
			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.itemContainer}
				onPress={() => {
					open ? setOpen(false) : setOpen(true);
				}}
			>
				<FastImage
					style={styles.image}
					source={{
						uri: props.data.image,
						priority: FastImage.priority.high
					}}
				/>
				<View style={{ marginLeft: 16, flex: 1 }}>
					<Text
						numberOfLines={1}
						style={[exStyles.infoLargeM18, { color: colors.primaryText }]}
					>
						{props.data.name}
					</Text>
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						{`${ booth.length } Booths`}
					</Text>
				</View>
				<Pressable
					style={styles.iconContainer}
					onPress={() => {
						open ? setOpen(false) : setOpen(true);
					}}
				>
					<MaterialIcons
						name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
						size={22}
						color={colors.secondaryText}
					/>
				</Pressable>
			</TouchableOpacity>
			{open ? (
				<FlatList
					data={booth}
					style={{ marginTop: RFValue(24), marginLeft: RFValue(30) }}
					renderItem={({ item, index }) => (
						<ItemBootList
							data={item}
							onPress={() => {
								Navigation.navigate('BoothDetails', {
									booth: item
								});
							}}
						/>
					)}
				/>
			) : null}
		</>
	);
};

const styles = {
	itemContainer: {
		flexDirection: 'row'
	},
	image: {
		height: RFValue(30),
		width: RFValue(30),
		borderRadius: RFValue(30) / 2,
		resizeMode: 'stretch',
		overflow: 'hidden'
	},
	iconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 24,
		width: 24,
		borderRadius: 24 / 2,
		backgroundColor: colors.unSelected,
		marginLeft: 8
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: colors.primaryText,
		flex: 1,
		letterSpacing: 0.1
	},
	boothCount: {
		fontSize: RFValue(14),
		color: colors.secondaryText,
		fontWeightt: '500',
		letterSpacing: 0.3
	}
};

export default memo(ItemHallsListView);
