import React, { memo } from 'react';
import { View, Text, StyleSheet, SafeAreaView as SafeAreaViewNative, Dimensions } from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '../styles';
import { Header, FormButton } from '../components';
import { themes } from '../constants/colors';
import SafeAreaView from '../containers/SafeAreaView';
import StatusBar from '../containers/StatusBar';
import { withDimensions } from '../dimensions';
import { withTheme } from '../theme';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ErrorPage404 = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { errorText } = route.params;
	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground
				}}
			/>
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle='light-content' />
			<Header
				title='Error'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					backgroundColor: colors.white,
					flex: 1
				}}>
				<View
					style={{
						paddingTop: screenHeight * 0.2,
						marginHorizontal: 16
					}}>
					<FastImage
						style={{
							width: screenWidth * 0.3,
							height: screenWidth * 0.3,
							alignSelf: 'center'
						}}
						source={require('../static/icons/pagenotfound.png')}
					/>
					<Text
						style={{
							color: colors.primaryColor,
							marginTop: 40,
							fontSize: 40,
							fontWeight: '600',
							lineHeight: 38,
							letterSpacing: 0.8
						}}>
						Oops!
					</Text>
					<Text
						style={{
							color: colors.darkText,
							fontSize: 28,
							fontWeight: '700',
							lineHeight: 28,
							marginTop: 12
						}}>
						There's an error
					</Text>
					<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, marginTop: 4 }]}>{errorText}</Text>
					<FormButton title='Try again' textStyle={exStyles.ButtonSM20} onPress={() => navigation.goBack()} />
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({});

export default withDimensions(withTheme(memo(ErrorPage404)));
