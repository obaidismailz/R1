import FastImage from '@rocket.chat/react-native-fast-image';
import moment from 'moment';
import React, { memo, useState, useEffect } from 'react';
import {
	View,
	StyleSheet,
	SafeAreaView as SafeAreaViewNative,
	TouchableOpacity,
	Dimensions,
	Text
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { themes } from '../../constants/colors';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import { withDimensions } from '../../dimensions';
import { colors, exStyles } from '../../styles';
import { withTheme } from '../../theme';
import { VISITORS } from '../../utils/Constants';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const calculateTimeLeft = (time) => {
	const eventTime = time;
	const currentTime = Math.floor(Date.now() / 1000).toString();
	const leftTime = eventTime - currentTime;
	let duration = moment.duration(leftTime, 'seconds');
	const interval = 1000;
	if (duration.asSeconds() <= 0) {
		clearInterval(interval);
	}
	duration = moment.duration(duration.asSeconds() - 1, 'seconds');
	return `${ duration.days() }\t\t     ${ duration.hours() }\t\t    ${ duration.minutes() }  `;
};

const ComingSoonView = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { exhibition, contact } = route.params;
	const dates = exhibition.start_date;
	const arr = dates.split(/[- :]/);
	const date = new Date(arr[0], arr[1] - 1, arr[2]);
	const [timeLeft, setTimeLeft] = useState(
		calculateTimeLeft(parseInt(date / 1000))
	);

	useEffect(() => {
		// alert(moment(exhibition.start_date).format('DD'));

		setTimeout(() => {
			setTimeLeft(calculateTimeLeft(parseInt(date / 1000)));
		}, 1000);
	});

	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{ backgroundColor: colors.unSelected }}
			/>
			<StatusBar backgroundColor={colors.unSelected} barStyle='dark-content' />
			<SafeAreaView
				theme={theme}
				style={{
					flex: 1,
					backgroundColor: colors.unSelected,
					paddingHorizontal: 8
				}}
			>
				<TouchableOpacity
					style={{
						backgroundColor: colors.unSelected
					}}
					onPress={() => navigation.goBack()}
				>
					<IonIcons
						name='ios-chevron-back-sharp'
						size={32}
						color={colors.primaryText}
					/>
				</TouchableOpacity>
				<View
					style={{
						marginTop: 40,
						alignItems: 'center',
						alignSelf: 'center',
						alignContent: 'center',
						width: screenWidth * 0.9,
						borderRadius: 12,
						paddingVertical: 32,
						backgroundColor: 'white',
						borderWidth: 0.5,
						borderColor: colors.black40
					}}
				>
					<TouchableOpacity
						onPress={() => navigation.navigate('OutSideWebviewScreen', {
							title: '',
							link: exhibition.logo_url
						})
						}
						activeOpacity={0.9}
					>
						<FastImage
							style={styles.imgLogo}
							source={{ uri: exhibition.logo }}
						/>
					</TouchableOpacity>
					<Text
						style={[
							exStyles.ButtonSM20,
							{ color: colors.primaryText, marginTop: RFValue(18) }
						]}
					>
						{exhibition.name}
					</Text>
					<Text style={[exStyles.TopTabSM14, { color: colors.primaryText }]}>
						{`${ moment(exhibition.start_date).format('MMM DD') } - ${ moment(
							exhibition.end_date
						).format('MMM DD, YYYY') }`}
					</Text>
					<Text
						style={[
							exStyles.tabR11,
							{ color: colors.primaryText, marginTop: RFValue(8) }
						]}
					>
						{contact.address}
					</Text>
					<View
						style={{
							backgroundColor: colors.unSelected,
							paddingVertical: 16,
							width: '100%',
							alignItems: 'center',
							marginVertical: RFValue(24)
						}}
					>
						<Text
							style={[exStyles.largeTitleR28, { color: colors.secondaryColor }]}
						>
							Coming Soon
						</Text>
						<Text
							style={[
								exStyles.largeTitleR28,
								{ color: colors.primaryText, marginVertical: RFValue(18) }
							]}
						>
							{moment(dates).format('DD') > new Date().getDate()
								? timeLeft
								: '00\t\t' + '00\t\t' + '00'}
						</Text>
						<Text style={[exStyles.infoSm, { color: colors.primaryText }]}>
							{' Days\t\t ' + ' Hours\t\t' + ' Minutes '}
						</Text>
					</View>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: colors.primaryColor,
								marginHorizontal: 40,
								textAlign: 'center'
							}
						]}
					>
						{`You will be able to Sign In from 12 AM, ${ moment(
							exhibition.start_date
						).format('MMM DD yyyy') }`}
					</Text>
				</View>

				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: RFValue(20)
					}}
				>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: colors.secondaryText,
								justifyContent: 'center',
								alignItems: 'center',
								alignSelf: 'center',
								textAlignVertical: 'top'
							}
						]}
					>
						Don't have an account?
					</Text>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Signup', {
								header: 'Sign up',
								url: VISITORS
							});
						}}
					>
						<Text
							style={[exStyles.infoLink14Med, { color: colors.secondaryColor }]}
						>
							{' '}
							Sign Up Here
						</Text>
					</TouchableOpacity>
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	imgLogo: {
		height: 80,
		width: 80,
		borderRadius: 16,
		overflow: 'hidden',
		resizeMode: 'cover',
		borderWidth: 1,
		borderColor: colors.black20
	}
});

export default withDimensions(withTheme(memo(ComingSoonView)));
