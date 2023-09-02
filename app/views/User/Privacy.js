import * as React from 'react';
import { memo, useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import { Header, LoadingDialog } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { colors, exStyles } from '../../styles';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import { UPDATE_PROFILE } from '@utils/Constants';
import { ShareData } from '@utils';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Privacy = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { user } = route.params;
	const [isPrivate] = useState(route.params.user.profile.is_private);
	const [loading, setLoading] = useState(false);
	const [intrest, set_intrest] = useState(
		user.user_interest.length > 0 ? user.user_interest.map(item => item.categories.name).join(',') : ''
	);
	useEffect(() => {}, []);

	const privacyCallback = async isPrivate => {
		setLoading(true);

		const formData = new FormData();

		formData.append('first_name', user.fname);
		console.error(`data= ${JSON.stringify(formData)}`);
		formData.append('last_name', user.lname);
		formData.append('website', user.profile.website);
		formData.append('about_me', user.profile.about_me);
		formData.append('gender', user.profile.gender);
		formData.append('designation', user.job_title);
		formData.append('company', user.company_name);
		formData.append('address', user.profile.address);
		formData.append('linkedin_link', user.linkedin_link);
		formData.append('facebook_link', user.facebook_link);
		formData.append('twitter_link', user.twitter_link);
		formData.append('phone_number', user.profile.phone_number);
		formData.append('is_private', isPrivate);
		formData.append('intrest', intrest);
		fetch(ShareData.getInstance().baseUrl + UPDATE_PROFILE, {
			method: 'POST',
			body: formData,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
				Authorization: `Bearer ${ShareData.getInstance().access_token}`
			}
		})
			.then(res => res.json())
			.then(response => {
				setLoading(false);
				navigation.goBack();
			})
			.catch(error => {
				alert(error);
				setLoading(false);
			});
	};

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<Header
					title='Set Profile Visibility'
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
				/>
				<ScrollView style={{ flex: 1 }} contentContainerStyle={{}}>
					<Text style={[exStyles.descriptionSmallText, styles.txtNote11]}>
						Set your profile visibility to private if you want to hide all the additional profile information from all users.
					</Text>

					<TouchableOpacity
						activeOpacity={0.7}
						style={styles.containerTile}
						onPress={() => {
							privacyCallback(false);
						}}>
						<Text style={[exStyles.infoDetailR16, { flex: 1, color: colors.primaryText }]}>Set to Public</Text>
						{isPrivate !== 1 && <FeatherIcon name='check' size={24} color={colors.primaryText} />}
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={0.7}
						style={styles.containerTile}
						onPress={() => {
							privacyCallback(true);
						}}>
						<Text style={[exStyles.infoDetailR16, { flex: 1, color: colors.primaryText }]}>Set to Private</Text>
						{isPrivate === 1 && <FeatherIcon name='check' size={24} color={colors.primaryText} />}
					</TouchableOpacity>
				</ScrollView>
				<LoadingDialog visible={loading} />
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	txtNote11: {
		paddingHorizontal: 24,
		color: colors.secondaryText,
		marginVertical: 24,
		textAlign: 'center',
		marginBottom: 24
	},
	containerTile: {
		flexDirection: 'row',
		paddingVertical: RFValue(15),
		paddingEnd: 24,
		marginStart: 24,
		borderBottomWidth: 0.5,
		borderColor: 'rgba(	126, 131, 137, 0.2)',
		borderBottomWidth: 1
	},
	imgCheck: {
		height: RFValue(15),
		width: RFValue(15),
		resizeMode: 'contain'
	}
});

export default withDimensions(withTheme(memo(Privacy)));
