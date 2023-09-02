import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import colors from './colors';

export const exStyles = StyleSheet.create({
	textInputStyle: {
		flex: 1,
		paddingHorizontal: RFValue(0),
		fontSize: RFValue(15),
		color: '#BAB8B8',
		color: '#000'
	},

	buttonStyleDefault: {
		backgroundColor: colors.blue,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: RFValue(5),
		height: RFValue(40)
	},

	buttonTextDefault: {
		fontSize: RFValue(15),
		color: colors.white
	},

	// above are being used

	viewRow: {
		flexDirection: 'row'
	},
	justAlign: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	headingView: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 5,
		backgroundColor: '#48a9ee',
		marginVertical: 10,
		// padding: RFValue(7),
		overflow: 'hidden',
		height: 40
	},
	txtHeading1: {
		fontSize: RFValue(17),
		fontWeight: 'bold',
		color: '#4c4c4c',
		color: '#000'
	},
	txtHeading2: {
		fontSize: RFValue(16),
		color: '#000'
	},
	txtHeading3: {
		fontSize: RFValue(14),
		color: '#000'
	},
	txtClickable: {
		fontSize: RFValue(14),
		color: 'grey',
		borderBottomColor: 'grey'
		// marginBottom: 5,
		// borderBottomWidth: 1,
		// textDecorationLine: 'underline',
	},
	catagoryImage: {
		height: RFValue(45),
		width: RFValue(45),
		resizeMode: 'contain'
	},
	screenHeader: {
		// fontFamily: "Roboto-Regular",
		color: '#000',
		fontSize: RFValue(18)
	},
	itemDetailsBasic: {
		// fontFamily: "Roboto-Regular",
		color: '#000',
		fontSize: RFValue(16)
	},
	itemPriceh1: {
		// fontFamily: "Roboto-Regular",
		color: '#000',
		fontSize: RFValue(20)
	},
	fab: {
		position: 'absolute',
		bottom: 30,
		right: 30,
		elevation: 5,
		height: 55,
		width: 55,
		borderRadius: 55,
		backgroundColor: colors.secondaryColor,
		justifyContent: 'center',
		alignItems: 'center'
	},

	// Text Styles
	largeTitleR28: {
		fontSize: 28,
		lineHeight: 32,
		fontWeight: '400',
		fontStyle: 'normal'
	},
	mediumTitleMed20: {
		fontSize: 20,
		lineHeight: 32,
		fontWeight: '500',
		fontStyle: 'normal'
	},
	ButtonSM20: {
		fontSize: 20,
		lineHeight: 28,
		fontWeight: '500',
		fontStyle: 'normal'
	},
	infoLargeM18: {
		fontSize: 18,
		lineHeight: 28,
		fontWeight: '500',
		fontStyle: 'normal',
		letterSpacing: 0.1
	},
	infoLargeM16: {
		fontSize: 16,
		lineHeight: 24,
		fontWeight: '500',
		fontStyle: 'normal',
		letterSpacing: 0.6
	},
	infoDetailR16: {
		fontSize: 16,
		lineHeight: 24,
		fontWeight: '400',
		fontStyle: 'normal',
		letterSpacing: 0.3
	},
	infoLink14Med: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '500',
		fontStyle: 'normal',
		letterSpacing: 0.6
	},
	TabAllCapsMed14: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '500',
		fontStyle: 'normal',
		letterSpacing: 1.25
	},
	descriptionSmallText: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '400',
		fontStyle: 'normal',
		letterSpacing: 0.2
	},
	TopTabSM14: {
		fontSize: 14,
		lineHeight: 16,
		fontWeight: '600',
		fontStyle: 'normal',
		letterSpacing: 1.25
	},
	TopTabR14: {
		fontSize: 14,
		lineHeight: 16,
		fontWeight: '400',
		fontStyle: 'normal',
		letterSpacing: 1.25
	},
	customStatus: {
		fontSize: 12,
		lineHeight: 18,
		fontWeight: '600',
		fontStyle: 'normal',
		letterSpacing: 0.5
	},
	infoSmallM11: {
		fontSize: 11,
		lineHeight: 14,
		fontWeight: '500',
		fontStyle: 'normal',
		letterSpacing: 0.6
	},
	tabR11: {
		fontSize: 11,
		lineHeight: 14,
		fontWeight: '400',
		fontStyle: 'normal',
		letterSpacing: 0.8
	},
	TabB11: {
		fontSize: 11,
		lineHeight: 14,
		fontWeight: '700',
		fontStyle: 'normal',
		letterSpacing: 0.8
	},
	underScoreSM14: {
		fontSize: 14,
		lineHeight: 20,
		fontWeight: '600',
		fontStyle: 'normal',
		letterSpacing: 0.6
	}
});
