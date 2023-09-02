import * as React from 'react';
import {
	memo, useRef, useState, useEffect, useImperativeHandle
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
	TouchableOpacity
} from 'react-native';

import { AuthInput, ActivityIndicator, Header } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { WebView } from 'react-native-webview';

const WebviewScreen = ({ navigation, route }) => {
	const [loading, setLoading] = useState(true);
	useEffect(() => {}, []);

	return (
		<>
			<SafeAreaView style={{ backgroundColor: '#2775EE' }} />
			<StatusBar
				backgroundColor={colors.secondaryColor}
				barStyle='light-content'
			/>
			<Header
				title={route.params.title !== undefined ? route.params.title : ''}
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<WebView
					javaScriptEnabled
					onLoad={
						route.params.backOnLoad
						&& setTimeout(() => {
							navigation.goBack();
						}, 500)
					}
					source={{ uri: route.params.link }}
					onLoadEnd={() => setLoading(false)}
				/>
				{loading && <ActivityIndicator />}
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
	}
});

export default memo(WebviewScreen);
