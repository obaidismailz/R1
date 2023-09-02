import React, { memo, useState, useEffect } from 'react';
import {
	Pressable,
	Text,
	TouchableOpacity,
	Dimensions,
	FlatList,
	View
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { getWebinarsInAuditorium } from '../../../apis/LoopExpoApi';
import ItemWebinar from './ItemWebinar';
import Navigation from '../../../lib/Navigation';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemAuditoruimList = ({ ...props }, ref) => {
	const [open, setOpen] = useState(false);
	const [webinar, setWebinarList] = useState([]);

	useEffect(() => {
		getWebinarsInAuditorium(props.data.id).then((response) => {
			if (response._metadata.status === 'SUCCESS') {
				setWebinarList(response.records);
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
						{`${ webinar.length } Webinars`}
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
						size={20}
						color={colors.secondaryText}
					/>
				</Pressable>
			</TouchableOpacity>
			{open ? (
				<FlatList
					data={webinar}
					style={{ marginTop: RFValue(24), marginLeft: RFValue(30) }}
					renderItem={({ item, index }) => (
						<ItemWebinar
							data={item}
							onPress={() => {
								Navigation.navigate('WebinarDetails', {
									webinar: item,
									briefcaseCallback: () => {}
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
	}
};

export default memo(ItemAuditoruimList);
