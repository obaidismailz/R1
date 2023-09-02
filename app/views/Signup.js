import * as React from 'react';
import { memo } from 'react';
import { SafeAreaView, StyleSheet, StatusBar } from 'react-native';

import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { WebView } from 'react-native-webview';
import { ShareData } from '@utils';

const Signup = ({ navigation, route, ...props }) => {
	const { theme } = props;

	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<StatusBar backgroundColor={colors.black} barStyle='light-content' />
			<Header
				title={route.params.header}
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>

			<WebView style={{ backgroundColor: 'white' }} source={{ uri: ShareData.getInstance().baseUrl + route.params.url }} />
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

export default memo(Signup);
