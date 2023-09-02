import React, { memo, useState } from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Pressable
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import IonIcons from 'react-native-vector-icons/Ionicons';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ItemAuditoriumResource = ({ ...props }, ref) => {
	const [source, setSource] = useState({
		uri: props.image
	});

	const image = (type) => {
		if (type == 'pdf') {
			return (
				<FastImage
					style={styles.resourceImage}
					source={require('@assets/pdf.png')}
				/>
			);
		} else if (type == 'xlsx' || type == 'xls') {
			return (
				<FastImage
					style={styles.resourceImage}
					source={require('@assets/excle.png')}
				/>
			);
		} else if (type == 'docx' || type == 'doc') {
			return (
				<FastImage
					style={styles.resourceImage}
					source={require('@assets/docs.png')}
				/>
			);
		} else if (type == 'pptx' || type == 'ppt') {
			return (
				<FastImage
					style={styles.resourceImage}
					source={require('@assets/ppt.png')}
				/>
			);
		}
		return (
			<FastImage
				style={styles.resourceImage}
				source={require('@assets/Image.png')}
			/>
		);
	};

	const placeholder = (type) => {
		console.error(type);
		if (source.uri !== '' && source.uri !== null && source.uri !== undefined) {
			return source;
		}
		if (type == 'pdf') {
			return require('@assets/pdf.png');
		} else if (type == 'xlsx' || type == 'xls') {
			return require('@assets/excle.png');
		} else if (type == 'docx' || type == 'doc') {
			return require('@assets/docs.png');
		} else if (type == 'pptx' || type == 'ppt') {
			return require('@assets/ppt.png');
		}
		return require('@assets/Image.png');
	};

	const placeholdeR = (type) => {
		if (type == 'pdf') {
			return '@assets/pdf.png';
		} else if (type == 'xlsx' || type == 'xls') {
			return '@assets/excle.png';
		} else if (type == 'docx' || type == 'doc') {
			return '@assets/docs.png';
		} else if (type == 'pptx' || type == 'ppt') {
			return '@assets/ppt.png';
		}
	};

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={[
				{
					height: RFValue(88),
					marginTop: 32,
					marginHorizontal: RFValue(16),
					flexDirection: 'row',
					justifyContent: 'center',
					alignItems: 'center'
				},
				props.style
			]}
			onPress={props.onPress && props.onPress}
		>
			{props.detail && props.detail === 'Document' ? (
				image(props.file_extension)
			) : (
				<FastImage
					style={{
						height: RFValue(88),
						width: RFValue(88),
						resizeMode: 'stretch',
						borderRadius: RFValue(5),
						overflow: 'hidden'
					}}
					source={placeholder(props.file_extension)}
				/>
			)}

			<View style={{ paddingStart: 10, flex: 1, alignSelf: 'center' }}>
				<Text style={[exStyles.TopTabR14, { color: colors.primaryText }]}>
					{props.handout_title}
				</Text>
				{/* <Text style={{color: 'red'}}>{source.uri}</Text> */}
				<Text style={[exStyles.TopTabR14, { color: colors.primaryText }]}>
					{props.detail ? props.detail : ''}
				</Text>
			</View>
			<View>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
						},
						{ paddingHorizontal: 4, borderRadius: 4 }
					]}
					onPress={props.onBreifcase}
				>
					<IonIcons
						name={props.isBriefcased ? 'briefcase' : 'md-briefcase-outline'}
						size={24}
						color={
							props.isBriefcased ? colors.primaryColor : colors.secondaryText
						}
					/>
				</Pressable>
			</View>
		</TouchableOpacity>
	);
};

const styles = {
	resourceImage: {
		height: RFValue(88),
		width: RFValue(88),
		resizeMode: 'stretch',
		// borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.2)',
		borderRadius: RFValue(10),
		overflow: 'hidden',
		justifyContent: 'center'
	},
	resourceTypeIcon: {
		alignSelf: 'center'
	},
	onPressable: { borderRadius: 4, padding: 4 }
};

export default memo(ItemAuditoriumResource);
