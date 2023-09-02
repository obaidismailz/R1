import React, { memo } from 'react';
import {
	View,
	Image,
	Text,
	TouchableOpacity,
	Dimensions,
	Pressable,
	Modal,
	Linking,
	SafeAreaView,
	StyleSheet
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import Navigation from '../../../lib/Navigation';
const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const ModalBoothContactDetails = ({ ...props }, ref) => {
	const Header = () => (
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
			<Text style={[exStyles.mediumTitleMed20, { color: colors.secondaryText, textAlign: 'center' }]}>Contact Details</Text>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.headerCloseIcon
				]}
				onPress={() => {
					props.onClose();
				}}>
				<MaterialIcons name='close' size={24} color={colors.primaryText} />
			</Pressable>
		</View>
	);

	const Body = () => (
		<>
			{/* socials */}
			<View style={styles.itemHeadingContainer}>
				<Feather name='users' size={RFValue(20)} style={styles.iconStyle} />
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>Social</Text>
			</View>
			<View style={styles.socialIconContainer}>
				{props.data.facebook_link == null || props.data.facebook_link == '' ? null : (
					<TouchableOpacity
						style={{ padding: 10 }}
						onPress={() => {
							Linking.openURL(props.data.facebook_link);
						}}>
						<Image style={styles.socialIconStyle} source={require('@assets/fb.png')} />
					</TouchableOpacity>
				)}
				{props.data.linkedin == null || props.data.linkedin == '' ? null : (
					<TouchableOpacity
						style={{ padding: 10 }}
						onPress={() => {
							Linking.openURL(props.data.linkedin);
						}}>
						<Image style={styles.socialIconStyle} source={require('@assets/linkedin.png')} />
					</TouchableOpacity>
				)}
				{props.data.instagram_link == null || props.data.instagram_link == '' ? null : (
					<TouchableOpacity
						style={{ padding: 10 }}
						onPress={() => {
							Linking.openURL(props.data.instagram_link);
						}}>
						<Image style={styles.socialIconStyle} source={require('@assets/instagram.png')} />
					</TouchableOpacity>
				)}

				{props.data.twitter_link == null || props.data.twitter_link == '' ? null : (
					<TouchableOpacity
						style={{ padding: 10 }}
						onPress={() => {
							Linking.openURL(props.data.twitter_link);
						}}>
						<Image style={styles.socialIconStyle} source={require('@assets/twitter.png')} />
					</TouchableOpacity>
				)}
				{props.data.whatapp_link == null || props.data.whatapp_link == '' ? null : (
					<TouchableOpacity
						onPress={() => {
							Linking.openURL(`whatsapp://send?phone=${props.data.whatapp_link}&text=${''}`);
						}}
						style={{ padding: 10 }}>
						<Image style={styles.socialIconStyle} source={require('@assets/whatsapp.png')} />
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.separator} />
			{/* email */}
			<View style={styles.itemHeadingContainer}>
				<MaterialIcons name='email-outline' size={RFValue(20)} style={styles.iconStyle} />
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>Email</Text>
			</View>
			<TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(`mailto:${props.data.email}`)}>
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							color: colors.secondaryColor,
							alignSelf: 'center',
							textDecorationLine: 'underline'
						}
					]}>
					{props.data.email}
				</Text>
			</TouchableOpacity>
			<View style={styles.separator} />
			{/* Phone */}
			<View style={styles.itemHeadingContainer}>
				<MaterialIcons name='phone' size={RFValue(20)} style={styles.iconStyle} />
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>Phone</Text>
			</View>
			<TouchableOpacity activeOpacity={0.7} onPress={() => Linking.openURL(`tel:${props.data.contact_number}`)}>
				<Text style={[exStyles.infoDetailR16, styles.numberText]}>{props.data.contact_number}</Text>
			</TouchableOpacity>
			<View style={styles.separator} />

			{/* Address */}
			<View style={styles.itemHeadingContainer}>
				<Icon name='location-on' size={RFValue(22)} style={styles.iconStyle} />
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>Address</Text>
			</View>
			<Text style={[exStyles.infoDetailR16, styles.address]}>{props.data.address}</Text>
			<View style={styles.separator} />
			{/* website */}
			<View style={styles.itemHeadingContainer}>
				<MaterialIcons name='web' size={RFValue(22)} style={styles.iconStyle} />
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText }]}>Website</Text>
			</View>
			<TouchableOpacity
				activeOpacity={0.7}
				onPress={() => {
					props.onClose();
					Navigation.navigate('WebviewScreen', {
						title: props.data.website,
						link: props.data.website
					});
				}}>
				<Text style={[exStyles.infoDetailR16, styles.address, { color: colors.secondaryColor }]}>{props.data.website}</Text>
			</TouchableOpacity>
		</>
	);

	return (
		<Modal
			animationType='slide'
			transparent
			visible={props.visible}
			onRequestClose={() => {
				props.onClose();
			}}>
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					<Header />
					<Body />
				</View>
			</SafeAreaView>
		</Modal>
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

	separator: {
		height: 1,
		backgroundColor: '#000000',
		opacity: 0.2,
		marginTop: 14,
		marginLeft: 24
	},

	// Header

	headerCloseIcon: {
		position: 'absolute',
		right: RFValue(28),
		alignSelf: 'flex-end',
		borderRadius: 24 / 2
	},

	// body
	itemHeadingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
		marginTop: 30
	},

	// social
	iconStyle: {
		marginStart: 30,
		marginEnd: 20,
		color: colors.secondaryText
	},
	socialIconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	socialIconStyle: {
		height: RFValue(24),
		width: RFValue(24),
		resizeMode: 'contain'
	},

	// phone
	landlineAndMobile: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: screenWidth * 0.5,
		alignSelf: 'center'
	},
	numberText: {
		color: colors.secondaryText,
		textDecorationLine: 'underline',
		textAlign: 'center',
		marginBottom: 10
	},

	// Address
	address: {
		color: colors.secondaryText,
		alignSelf: 'center',
		width: screenWidth * 0.6
	}
});

export default memo(ModalBoothContactDetails);
