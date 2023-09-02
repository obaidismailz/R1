import * as React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Pressable, TouchableOpacity, Linking } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormButton } from '@components';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import ModalBoothContactDetails from '../../components/ModalBoothContactDetails';
import SelectChatModalBooth from '../../components/SelectChatModalBooth';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

export default BoothInfo = ({ booth, boothCat, boothOwner, boothRep, theme, navigation, isMasterDetail, ...props }) => {
	const [loading, setLoading] = useState(true);
	const [chatModalVisible, setChatModalVisible] = useState(false);
	const [contactPopupVisible, setContactPopupVisible] = useState(false);

	const Socials = () => (
		<View style={styles.socialContainer}>
			{booth.facebook_link == '' ? null : (
				<TouchableOpacity
					style={{ padding: 10 }}
					onPress={() => {
						Linking.openURL(booth.facebook_link);
					}}>
					<FastImage style={styles.socialIcon} source={require('@assets/fb.png')} />
				</TouchableOpacity>
			)}
			{booth.linkedin == '' ? null : (
				<TouchableOpacity
					style={{ padding: 10 }}
					onPress={() => {
						Linking.openURL(booth.linkedin);
					}}>
					<FastImage style={styles.socialIcon} source={require('@assets/linkedin.png')} />
				</TouchableOpacity>
			)}
			{booth.instagram_link == '' ? null : (
				<TouchableOpacity
					style={{ padding: 10 }}
					onPress={() => {
						Linking.openURL(booth.instagram_link);
					}}>
					<FastImage style={styles.socialIcon} source={require('@assets/instagram.png')} />
				</TouchableOpacity>
			)}
			{booth.twitter_link == '' ? null : (
				<TouchableOpacity
					style={{ padding: 10 }}
					onPress={() => {
						Linking.openURL(booth.twitter_link);
					}}>
					<FastImage style={styles.socialIcon} source={require('@assets/twitter.png')} />
				</TouchableOpacity>
			)}
			{booth.whatapp_link == '' ? null : (
				<TouchableOpacity
					onPress={() => {
						Linking.openURL(`whatsapp://send?phone=${booth.whatapp_link}&text=${''}`);
					}}
					style={{ padding: 10 }}>
					<FastImage style={styles.socialIcon} source={require('@assets/whatsapp.png')} />
				</TouchableOpacity>
			)}
		</View>
	);

	const BoothContact = () => (
		<View style={styles.boothContactContainer}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: 15 }
				]}
				onPress={() => {
					if (boothOwner !== null && boothOwner !== undefined) {
						setChatModalVisible(true);
					}
				}}>
				<IonIcons name='ios-chatbubbles-outline' size={28} color={colors.secondaryText} />
			</Pressable>
			<View style={styles.contactSeparator} />
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: 5 }
				]}
				onPress={() => {
					Linking.openURL(`mailto:${booth.email}`);
				}}>
				<MaterialCommunityIcons name='email-outline' size={28} color={colors.secondaryText} />
			</Pressable>
			<View style={styles.contactSeparator} />
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: 5 }
				]}
				onPress={() => {
					Linking.openURL(`tel:${booth.contact_number}`);
				}}>
				<MaterialCommunityIcons name='phone' size={28} color={colors.secondaryText} />
			</Pressable>
		</View>
	);

	const BoothFormButton = () => (
		<View style={styles.boothFormButtonContainer}>
			<FormButton
				title={'CONTACT\n DETAILS'}
				isDisabled={boothOwner == null && boothOwner == undefined}
				extraStyle={{ paddingHorizontal: 38, marginEnd: 18 }}
				onPress={() => setContactPopupVisible(true)}
			/>
			<FormButton
				title={'BOOK A\n MEETING'}
				isDisabled={boothOwner == null && boothOwner == undefined}
				extraStyle={{ paddingHorizontal: 38, marginStart: 18 }}
				onPress={() => {
					navigation.navigate('CreateMeeting', {
						boothOwner
					});
				}}
			/>
		</View>
	);

	return (
		<>
			<View>
				<FastImage
					onLoadEnd={() => setLoading(false)}
					style={styles.boothImage}
					resizeMode='contain'
					source={{ uri: booth.image }}>
					<ActivityIndicator
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							bottom: 100
						}}
						animating={loading}
						theme={theme}
					/>
					<FastImage style={styles.boothLogo} source={{ uri: booth.logo }} />
				</FastImage>

				<Text style={[exStyles.largeTitleR28, styles.boothName]}>{booth.name}</Text>
				<Socials />

				<View style={{ alignItems: 'center' }}>
					<FlatList
						data={boothCat}
						horizontal
						ListEmptyComponent={loading ? <ActivityIndicator /> : null}
						renderItem={({ item }) => (
							<View style={styles.boothCategoriesContainer}>
								<Text style={[exStyles.infoSmallM11, { color: colors.secondaryText }]}>{item.categories.name}</Text>
							</View>
						)}
					/>
				</View>
				<BoothContact />
				<BoothFormButton />
			</View>
			<ModalBoothContactDetails
				visible={contactPopupVisible}
				data={booth}
				onClose={() => {
					setContactPopupVisible(false);
				}}
			/>
			<SelectChatModalBooth
				visible={chatModalVisible}
				boothRep={boothRep}
				owner={boothOwner}
				isMasterDetail={isMasterDetail}
				onClose={() => setChatModalVisible(false)}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	boothImage: {
		height: 260,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},

	boothLogo: {
		backgroundColor: 'white',
		position: 'absolute',
		bottom: RFValue(0),
		left: RFValue(16),
		height: RFValue(80),
		width: RFValue(80),
		borderRadius: RFValue(40),
		resizeMode: 'contain',
		borderColor: 'rgba(0,0,0,0.4)',
		borderWidth: 0.5
	},
	// boothName
	boothName: {
		marginTop: 16,
		textAlign: 'center',
		color: colors.primaryText,
		marginHorizontal: 24
	},
	// socials
	socialContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: RFValue(8)
	},

	socialIcon: {
		height: RFValue(24),
		width: RFValue(24),
		resizeMode: 'contain'
	},

	// boothcategories

	boothCat: {
		alignItems: 'center',
		marginTop: RFValue(8)
	},

	boothCategoriesContainer: {
		paddingHorizontal: 5,
		paddingVertical: 1,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: colors.secondaryText,
		marginHorizontal: 3
	},

	// contact
	boothContactContainer: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center',
		paddingHorizontal: 60,
		marginTop: 22
	},
	contactSeparator: {
		backgroundColor: 'grey',
		height: 30,
		width: 1,
		alignSelf: 'center'
	},

	// booth form Button
	boothFormButtonContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingHorizontal: 48,
		marginTop: 16
	}
});
