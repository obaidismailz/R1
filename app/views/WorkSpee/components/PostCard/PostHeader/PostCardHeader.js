import React from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import FastImage from '@rocket.chat/react-native-fast-image';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import Navigation from '../../../../../lib/Navigation';
import Smily from './smily';

const { width } = Dimensions.get('screen');

const PostCardHeader = ({ ...props }) => {
	const { theme } = props;

	const navigateToProfile = () => {
		ShareData.getInstance().user_id == props.item.user.user_id
			? Navigation.navigate('ProfileStackNavigator')
			: Navigation.navigate('LoopUserProfile', {
				username: props.item.user.username
			  });
	};

	const Name = () => (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
				},
				{ padding: 2 }
			]}
			onPress={() => navigateToProfile()}
		>
			<Text
				style={[
					exStyles.infoLargeM16,
					{
						paddingLeft: 12,
						color: colors.primaryText
					}
				]}
			>
				{props.item.user.first_name == ''
					? props.item.user.username
					: `${ props.item.user.first_name } ${ props.item.user.last_name }`}
			</Text>
		</Pressable>
	);

	const CheckingIn = () => (
		<View style={styles.nameAndTypeTextContainer}>
			<Pressable onPress={() => navigateToProfile()}>
				<Text
					style={[
						exStyles.infoLargeM16,
						{
							color: colors.primaryText
						}
					]}
				>
					{props.item.user.first_name == ''
						? props.item.user.username
						: `${ props.item.user.first_name } ${ props.item.user.last_name }`}{' '}
					<Icon name='map-marker-alt' size={18} color='red' />
					<Text> at </Text>
					{props.item.postMap}
				</Text>
			</Pressable>
		</View>
	);

	const Feeling = () => (
		<View style={[styles.nameAndTypeTextContainer, { width: '95%' }]}>
			<Pressable onPress={() => navigateToProfile()}>
				<Text
					numberOfLines={2}
					style={[
						exStyles.infoLargeM16,
						{
							color: colors.primaryText
						}
					]}
				>
					{props.item.user.first_name == ''
						? props.item.user.username
						: `${ props.item.user.first_name } ${ props.item.user.last_name }`}
					<Text>{` is feeling ${ props.item.postFeeling } `}</Text>
					<Smily id={props.item.postFeeling} />
				</Text>
			</Pressable>
		</View>
	);

	const Traveling = () => (
		<View style={[styles.nameAndTypeTextContainer, { width: '95%' }]}>
			<Pressable onPress={() => navigateToProfile()}>
				<Text
					style={[
						exStyles.infoLargeM16,
						{
							color: colors.primaryText
						}
					]}
				>
					{props.item.user.first_name == ''
						? props.item.user.username
						: `${ props.item.user.first_name } ${ props.item.user.last_name }`}{' '}
					<FastImage
						style={styles.icon}
						source={require('@assets/Traveling.png')}
					/>
					<Text>{' is traveling to '}</Text>
					{props.item.postTraveling}
				</Text>
			</Pressable>
		</View>
	);

	const Watching = () => (
		<View style={[styles.nameAndTypeTextContainer, { width: '90%' }]}>
			<Pressable onPress={() => navigateToProfile()}>
				<Text
					numberOfLines={2}
					style={[
						exStyles.infoLargeM16,
						{
							color: colors.primaryText
						}
					]}
				>
					{props.item.user.first_name == ''
						? props.item.user.username
						: `${ props.item.user.first_name } ${ props.item.user.last_name }`}{' '}
					<FastImage
						style={styles.icon}
						source={require('@assets/Watching.png')}
					/>
					<Text>{' is watching '}</Text>
					{props.item.postWatching}
				</Text>
			</Pressable>
		</View>
	);

	const Playing = () => (
		<View style={[styles.nameAndTypeTextContainer, { width: '90%' }]}>
			<Pressable onPress={() => navigateToProfile()}>
				<Text
					numberOfLines={2}
					style={[
						exStyles.infoLargeM16,
						{
							color: colors.primaryText
						}
					]}
				>
					{props.item.user.first_name == ''
						? props.item.user.username
						: `${ props.item.user.first_name } ${ props.item.user.last_name }`}{' '}
					<FastImage
						style={styles.icon}
						source={require('@assets/Playing.png')}
					/>
					<Text>{' is playing '}</Text>
					{props.item.postPlaying}
				</Text>
			</Pressable>
		</View>
	);

	const Listening = () => (
		<View style={[styles.nameAndTypeTextContainer, { width: '90%' }]}>
			<Pressable onPress={() => navigateToProfile()}>
				<Text
					numberOfLines={2}
					style={[
						exStyles.infoLargeM16,
						{
							color: colors.primaryText
						}
					]}
				>
					{props.item.user.first_name == ''
						? props.item.user.username
						: `${ props.item.user.first_name } ${ props.item.user.last_name }`}{' '}
					<FastImage
						style={styles.icon}
						source={require('@assets/Listening.png')}
					/>
					<Text>{' is listening to '}</Text>
					{props.item.postListening}
				</Text>
			</Pressable>
		</View>
	);

	return (
		<View style={styles.cardHeader}>
			<TouchableOpacity onPress={() => navigateToProfile()}>
				<FastImage
					source={{ uri: props.item.user.avatar }}
					style={styles.imageStyle}
				/>
			</TouchableOpacity>
			<View>
				{props.item.postMap !== '' ? (
					<CheckingIn />
				) : props.item.postFeeling !== '' ? (
					<Feeling />
				) : props.item.postTraveling !== '' ? (
					<Traveling />
				) : props.item.postWatching !== '' ? (
					<Watching />
				) : props.item.postPlaying !== '' ? (
					<Playing />
				) : props.item.postListening !== '' ? (
					<Listening />
				) : (
					<Name />
				)}
				<Text
					style={[
						exStyles.infoSmallM11,
						{ paddingLeft: 12, color: colors.primaryText }
					]}
				>
					Posted{' '}
					{moment.unix(props.item.time).local().startOf('seconds').fromNow()}
				</Text>
			</View>
			{props.bottomOption == false ? null : (
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.iconContainer
					]}
					onPress={props.onPress && props.onPress}
				>
					<Icon name='ellipsis-v' size={16} color='#7E8389' />
				</Pressable>
			)}
		</View>
	);
};

export default PostCardHeader;

const styles = StyleSheet.create({
	cardHeader: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		marginRight: 8,
		marginBottom: 8,
		paddingVertical: 5
	},

	imageStyle: {
		height: 44,
		width: 44,
		borderRadius: 22,
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},

	nameAndTypeTextContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		paddingLeft: 12,
		paddingVertical: 2
	},

	iconContainer: {
		height: 30,
		width: 20,
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: 0
	},
	icon: {
		height: 18,
		width: 18
	}
});
