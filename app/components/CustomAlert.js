import React, { memo } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FAIcons from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { withDimensions } from '../dimensions';
import { withTheme } from '../theme';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const CustomAlert = ({ ...props }) => {
	const { theme } = props;

	const HeaderIcon = () => (
		<View style={[styles.headerContainer, { backgroundColor: props.status == 'SUCCESS' ? '#458D39' : 'red' }]}>
			{props.status == 'SUCCESS' ? (
				<FAIcons name={props.status == 'SUCCESS' ? 'check' : 'close'} color='white' size={40} />
			) : (
				<AntDesign name='close' color='white' size={40} />
			)}
		</View>
	);

	const FormButtons = () => (
		<TouchableOpacity activeOpacity={0.7} style={styles.yesButtonContainer} onPress={props.ok}>
			<Text style={styles.yesButtonText}>Ok</Text>
		</TouchableOpacity>
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
			deviceWidth={deviceWidth}
			deviceHeight={deviceHeight}
			style={{ margin: 0 }}>
			<View style={styles.container}>
				<View style={styles.contentContainer}>
					<HeaderIcon />
					<Text style={styles.alertText}>{props.text}</Text>
					<FormButtons />
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
		height: 300,
		paddingHorizontal: RFValue(24),
		borderRadius: RFValue(40)
	},
	headerContainer: {
		width: RFValue(60),
		height: RFValue(60),
		borderRadius: RFValue(60 / 2),
		alignSelf: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 50,
		paddingVertical: 13
	},
	alertText: {
		alignSelf: 'center',
		justifyContent: 'center',
		fontSize: 18,
		fontWeight: '500',
		textAlign: 'center',
		marginTop: 16,
		paddingHorizontal: 40
	},
	formButtonContainer: {
		alignSelf: 'center',
		justifyContent: 'center'
	},
	cancelButtonContaier: {
		width: deviceWidth * 0.35,
		paddingVertical: 13,
		borderRadius: 16,
		borderWidth: 2,
		borderColor: colors.primaryColor,
		alignItems: 'center'
	},
	cancelButtonText: {
		color: colors.primaryColor,
		fontSize: 20,
		fontWeight: '500'
	},
	yesButtonContainer: {
		width: deviceWidth * 0.35,
		paddingVertical: 13,
		borderRadius: 16,
		backgroundColor: colors.primaryColor,
		alignItems: 'center',
		alignSelf: 'center',
		marginTop: 16
	},
	yesButtonText: { color: 'white', fontSize: 20, fontWeight: '500' }
});

export default withDimensions(withTheme(memo(CustomAlert)));
