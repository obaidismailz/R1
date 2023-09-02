import * as React from 'react';
import {
	memo, useRef, useState, useEffect, createRef
} from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	StatusBar,
	ScrollView,
	KeyboardAvoidingView,
	Alert,
	TextInput,
	TouchableOpacity,
	Pressable
} from 'react-native';
import HTML from 'react-native-render-html';
import { useIsFocused } from '@react-navigation/native';

import { AuthInput, ActivityIndicator, Header } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
// import {
//   MaterialCommunityIcons,
//   Feather,
//   FontAwesome5,Ionicons
// } from "@expo/vector-icons";
import { colors, exStyles } from '@styles';
import { WebView } from 'react-native-webview';
import { ShareData } from '@utils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';

import { GET_PRIVACY_POLICY } from '@utils/Constants';
import { noInternetAlert } from '@utils/Network';
import { FormButton } from '../components';

const PrivacyPolicy = ({ navigation, route }) => {
	const actionSheetRef = createRef();

	const [loading, setLoading] = useState(false);
	const [pPolicy, setPpolicy] = useState({ value: '' });

	useEffect(() => {
		getData();
	}, [useIsFocused()]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getPolicy();
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async() => {
					getData();
				}
			});
		}
	};

	const getPolicy = () => {
		setLoading(true);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_PRIVACY_POLICY,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoading(false);
				if (response.data._metadata.status === 'SUCCESS') {
					setPpolicy(response.data.records);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};
	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />

			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<Header
					title='TOU & Privacy Policy'
					theme='light'
					onBackPress={() => {
						navigation.goBack();
					}}
				/>

				<ScrollView
					style={{
						flex: 1,
						paddingHorizontal: RFValue(20),
						paddingVertical: RFValue(10)
					}}
				>
					<HTML
						source={{
							html: pPolicy.value
						}}
					/>
				</ScrollView>
				{loading ? (
					<ActivityIndicator absolute size='large' theme='light' />
				) : null}
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	images: {
		height: RFValue(250),
		width: RFValue(250),
		marginTop: RFValue(-60),
		alignSelf: 'center',
		resizeMode: 'contain'
	},

	textInput: {
		flex: 1,
		paddingVertical: 15,
		paddingStart: 15,
		fontSize: RFValue(16),
		color: '#48a9ee'
	},

	heading: {
		alignSelf: 'center',
		color: 'red',
		fontSize: RFValue(22),
		marginTop: RFValue(20),
		fontWeight: 'bold'
	},
	txtBtnTitle: {
		fontSize: RFValue(16),
		fontWeight: 'bold',
		color: 'black',
		marginTop: RFValue(20),
		marginBottom: RFValue(10)
	},
	btn: {
		padding: RFValue(10),
		borderWidth: 1,
		borderRadius: 5,
		elevation: 3,
		backgroundColor: '#fff',
		borderColor: '#cecece',
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputDescription: {
		padding: RFValue(10),
		fontSize: RFValue(14),
		borderWidth: 1,
		borderRadius: 5,
		elevation: 3,
		backgroundColor: '#fff',
		borderColor: '#cecece',
		textAlignVertical: 'top'
	}
});

export default memo(PrivacyPolicy);
