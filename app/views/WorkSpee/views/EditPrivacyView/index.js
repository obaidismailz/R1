import React, { memo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IonIcons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import SafeAreaView from '../../../../containers/SafeAreaView';
import { themes } from '../../../../constants/colors';
import { withTheme } from '../../../../theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';
import ActivityIndicator from '../../../../containers/ActivityIndicator';
import { TIMELINE_BASE_URL } from '../../../../utils/Constants';
import { ShareData } from '@utils';
import { withDimensions } from '../../../../dimensions';
import StatusBar from '../../../../containers/StatusBar';
import { RFValue } from 'react-native-responsive-fontsize';

let qs = require('qs');
const EditPrivacyView = ({ navigation, isMasterDetail, route, ...props }) => {
	const { theme } = props;

	//if value == 1 navigate from create post screen to edit privacy screen
	// if value == 0 navigate from TimeLine screen to edit privacy screen
	const navigationScreen = route.params.navigationScreen;
	// const domain2 = route.params.domain2;
	// const userToken = route.params.access_token;
	// const postId = route.params.postId;
	const userId = route.params.userId;

	const [loading, setLoading] = useState(false);
	// if navigationScreen == 1
	//set check value equal to postPrivacy value passed from create post screen
	//else set value which is passed from the timeline view
	const [checkValue, setCheckValue] = useState(
		route.params.navigationScreen == 1 ? route.params.createPostPrivacy : route.params.showPostPrivacy
	);

	const Header = () => (
		<View style={styles.headerContaier}>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					{ borderRadius: 16 }
				]}
				onPress={() => navigation.goBack()}>
				<IonIcons name='close' size={RFValue(24)} color='#7E8389' />
			</Pressable>
			<Text style={[styles.headerText]}>Edit Privacy</Text>
		</View>
	);

	PageHeading = () => (
		<View style={styles.pageHeadingContainer}>
			<Text style={styles.headingText}>Who can see your post ?</Text>
			<View style={styles.pageHeadingSeparator}></View>
		</View>
	);

	onSelectPrivacy = value => {
		if (navigationScreen == 1) {
			setCheckValue(value);
			route.params.selectedPostPrivacy(value);
			navigation.goBack();
		} else if (navigationScreen == 0) {
			onEditPostPrivacy(value);
			setCheckValue(value);
		}
	};

	const onEditPostPrivacy = async privacyValue => {
		setLoading(true);
		let params = {
			process: 'React_Update_Post_Privacy',
			post_id: postId,
			privacy_type: privacyValue,
			user_id: userId
		};
		await axios({
			method: 'post',
			url:
				TIMELINE_BASE_URL +
				'/app_api.php?application=react_app&type=react_posts&access_token=' +
				ShareData.getInstance().timeline_token,
			data: qs.stringify(params)
		})
			.then(response => {
				response.data.status == 200 ? setLoading(false) : null;
				navigation.goBack();
			})
			.catch(error => {
				alert(error);
			});
	};

	const PrivacyOptions = () => (
		<View>
			<TouchableOpacity style={styles.privacyOption} onPress={() => onSelectPrivacy(3)}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-start'
					}}>
					<Icon name='lock' size={20} color='#9D9D9D' />
					<Text style={styles.privacyOptionText}>Only Me</Text>
				</View>
				<Icon
					name={checkValue === 3 ? 'check-circle' : 'circle'}
					color={checkValue === 3 ? '#2c9dd1' : '#C7C7C7'}
					size={20}
					style={styles.iconStyle}
				/>
			</TouchableOpacity>
			<View style={styles.itemSeparator}></View>
			<TouchableOpacity style={styles.privacyOption} onPress={() => onSelectPrivacy(0)}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-start'
					}}>
					<Icon name='globe' size={20} color='#9D9D9D' />
					<Text style={styles.privacyOptionText}>Everyone</Text>
				</View>
				<Icon
					name={checkValue === 0 ? 'check-circle' : 'circle'}
					color={checkValue === 0 ? '#2c9dd1' : '#C7C7C7'}
					size={20}
					style={styles.iconStyle}
				/>
			</TouchableOpacity>
			<View style={styles.itemSeparator}></View>
			<TouchableOpacity style={styles.privacyOption} onPress={() => onSelectPrivacy(2)}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-start'
					}}>
					<Icon name='user-alt' size={20} color='#9D9D9D' />
					<Text style={styles.privacyOptionText}>Colleagues I Follow</Text>
				</View>
				<Icon
					name={checkValue === 2 ? 'check-circle' : 'circle'}
					color={checkValue === 2 ? '#2c9dd1' : '#C7C7C7'}
					size={20}
					style={styles.iconStyle}
				/>
			</TouchableOpacity>
			<View style={styles.itemSeparator}></View>
			<TouchableOpacity style={styles.privacyOption} onPress={() => onSelectPrivacy(1)}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-start'
					}}>
					<Icon name='users' size={20} color='#9D9D9D' />
					<Text style={styles.privacyOptionText}>Colleagues Follow me</Text>
				</View>
				<Icon
					name={checkValue === 1 ? 'check-circle' : 'circle'}
					color={checkValue === 1 ? '#2c9dd1' : '#C7C7C7'}
					size={20}
					style={styles.iconStyle}
				/>
			</TouchableOpacity>
			<View style={styles.itemSeparator}></View>
		</View>
	);

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: '#ffffff' }}>
			<StatusBar theme={'light'} backgroundColor={themes[theme].headerBackground} barStyle='dark-content' />
			<Header />
			{loading ? (
				<View>
					<ActivityIndicator></ActivityIndicator>
				</View>
			) : null}
			<PageHeading />
			<PrivacyOptions />
		</SafeAreaView>
	);
};

export default withDimensions(withTheme(memo(EditPrivacyView)));
