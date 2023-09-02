import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Pressable, SafeAreaView } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, exStyles } from '@styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ShareData } from '@utils';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import Navigation from '../../lib/Navigation';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

class QRScanView extends Component {
	onSuccess = e => {
		const username = this.getParameterByName('username', e.data);
		if (e.data.includes(ShareData.getInstance().baseUrl)) {
			Navigation.navigate('LoopUserProfile', { username });
		}
		setTimeout(() => {
			this.scanner.reactivate();
		}, 3000);
	};

	getParameterByName(name, url) {
		name = name.replace(/[\[\]]/g, '\\$&');
		const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
		const results = regex.exec(url);
		if (!results) {
			return null;
		}
		if (!results[2]) {
			return '';
		}
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<QRCodeScanner
					ref={node => {
						this.scanner = node;
					}}
					onRead={this.onSuccess}
					topContent={
						<View
							style={{
								alignSelf: 'flex-start',
								flex: 1,
								marginTop: 16,
								marginStart: 16
							}}>
							<Pressable
								style={({ pressed }) => [
									{
										backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
									},
									styles.closeButton
								]}
								onPress={() => {
									Navigation.back();
								}}>
								<MCIcons name='window-close' size={24} color={colors.white} />
							</Pressable>
						</View>
					}
					bottomContent={
						<TouchableOpacity
							activeOpacity={0.7}
							style={styles.button2}
							onPress={() => {
								Navigation.back();
							}}>
							<AntDesign name='scan1' size={24} color={colors.white} />
							<Text style={[exStyles.ButtonSM20, { color: colors.white, marginStart: 6 }]}>Back to my QR Code</Text>
						</TouchableOpacity>
					}
				/>
			</SafeAreaView>
		);
	}
}

export default withDimensions(withTheme(withSafeAreaInsets(QRScanView)));

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'black',
		flex: 1
	},
	centerText: {
		flex: 1,
		fontSize: 18,
		padding: 32,
		color: '#777'
	},
	textBold: {
		fontWeight: '500',
		color: '#fff'
	},
	buttonText: {
		fontSize: 21,
		color: 'rgb(0,122,255)'
	},
	buttonTouchable: {
		padding: 16
	},
	closeButton: {
		borderRadius: 16,
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	},
	button2: {
		marginTop: 16,
		width: screenWidth * 0.7,
		backgroundColor: 'rgba(225,225,225, 0.1)',
		paddingVertical: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 24,
		borderRadius: 32,
		borderWidth: 1,
		borderColor: 'white',
		alignItems: 'center'
	}
});
