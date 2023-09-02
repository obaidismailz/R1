import React, { memo } from 'react';
import { View, StyleSheet, Dimensions, Text, Pressable } from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import AIcons from 'react-native-vector-icons/AntDesign';
import FIcons from 'react-native-vector-icons/FontAwesome5';
import { withDimensions } from '../dimensions';
import { withTheme } from '../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const SurveyAlert = ({ navigation, ...props }) => {
	const { theme } = props;

	const HeaderIcon = () => (
		<>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.headerContainer
				]}
				onPress={props.onClose}>
				<AIcons name='close' color={colors.primaryText} size={24} />
			</Pressable>
			<FIcons name='clipboard-list' size={60} color={colors.tertiaryColor} style={{ alignSelf: 'center' }} />
		</>
	);
	return (
		<Modal
			backdropColor='#000000'
			useNativeDriver
			backdropOpacity={0.4}
			animationIn='fadeInUpBig'
			animationOut='fadeOutDownBig'
			isVisible={props.visible}
			customBackdrop={null}
			hideModalContentWhileAnimating={false}
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			style={{ margin: 0 }}>
			<View style={styles.container}>
				<View style={styles.contentContainer}>
					<HeaderIcon />
					<Pressable
						style={({ pressed }) => [
							{
								backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
							},
							{ marginTop: 10, padding: 2, borderRadius: 4 }
						]}
						onPress={() => {
							props.onClose();
							navigation.navigate('WebviewScreen', {
								title: 'Survey',
								link: props.url
							});
						}}>
						<Text style={[exStyles.mediumTitleMed20, { textAlign: 'center', color: colors.secondaryColor }]}>
							Take the following survey to provide your feedback
						</Text>
					</Pressable>
					<Text
						style={[
							exStyles.infoSmallM11,
							{
								textAlign: 'center',
								color: colors.secondaryText,
								marginTop: 24
							}
						]}>
						Tap to take the survey, Cancel to take it another time!
					</Text>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: RFValue(24)
	},
	contentContainer: {
		backgroundColor: '#ffffff',
		width: '100%',
		paddingHorizontal: RFValue(24),
		paddingVertical: 24,
		borderRadius: RFValue(40)
	},
	headerContainer: {
		alignSelf: 'flex-end',
		alignItems: 'center',
		justifyContent: 'center',

		borderRadius: 26 / 2,
		padding: 2
	}
});

export default withDimensions(withTheme(memo(SurveyAlert)));
