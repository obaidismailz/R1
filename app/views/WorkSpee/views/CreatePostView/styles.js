import { StyleSheet, Platform, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '@styles';

export default StyleSheet.create({
	headerContaier: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: RFValue(22),
		marginTop: 8,
		paddingVertical: RFValue(10)
	},
	headerText: {
		fontSize: 20,
		fontWeight: '500',
		color: '#424242'
	},

	postButtonText: {
		fontSize: 16,
		fontWeight: '400',
		color: '#424242'
	},

	roundedView: {
		flex: 1,
		backgroundColor: 'white'
	},
	// avatar container
	profileItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: RFValue(24),
		marginRight: 10
	},

	// Bottom Privacy Button Container
	bottomPrivacyButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	bottomPrivacyButtonText: {
		fontSize: 14,
		fontStyle: 'normal',
		fontWeight: '500',
		color: '#737474',
		marginLeft: 5
	},

	avtarContainerInDropDown: {
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		marginLeft: 20
	},
	avtarcontainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		borderRadius: 18
	},
	imageAvtar: {
		height: RFValue(54),
		width: RFValue(54),
		borderRadius: RFValue(54 / 2),
		borderWidth: 1,
		borderColor: '#999999'
	},

	mentionUsersAndPoilicyContainer: {
		flex: 1,
		flexWrap: 'wrap',
		justifyContent: 'flex-start'
	},

	userNameText: {
		fontSize: 20,
		fontStyle: 'normal',
		fontWeight: '600',
		color: colors.secondaryText
	},

	textWrap: {
		flexWrap: 'wrap',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center'
	},

	privacyButton: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignSelf: 'baseline',
		paddingLeft: 5,
		borderColor: '#3695FF',
		borderWidth: 1,
		borderRadius: 35,
		paddingRight: 5,
		height: 25,
		alignItems: 'center'
	},
	privacyText: {
		fontSize: 10,
		fontStyle: 'normal',
		fontWeight: '400',
		color: '#3695FF'
	},

	textInputContainer: {
		marginLeft: 16,
		marginBottom: 20
	},

	postInputFieldBottomContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#ffffff',
		height: 55,
		paddingHorizontal: 36,
		marginBottom: Platform.OS === 'ios' ? 0 : 0,
		borderTopWidth: 1,
		borderColor: 'rgba(0,0,0,0.2)',
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 0
	},

	bottomTextStyle: {
		color: '#343435',
		fontStyle: 'normal',
		fontSize: 14,
		fontWeight: '500',
		lineHeight: 16
	},

	iconButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		height: 50,
		marginLeft: 20
	},

	// loading text
	spinnerTextStyle: {
		color: '#FFF',
		fontStyle: 'normal',
		fontSize: 15,
		fontWeight: '500'
	},

	// confirmation message
	dropdownContainer: {
		position: 'absolute',
		top: 0,
		borderRadius: 30,
		shadowColor: '#000000',
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 4 },
		shadowRadius: 3,
		marginLeft: Dimensions.get('screen').width * 0.3,
		elevation: 3
	},

	// Bottom Sheet styling
	bottomPanelSheetContainer: {
		backgroundColor: '#FFFFFF',
		height: 500
	},
	// header
	header: {
		backgroundColor: '#FFFFFF',
		shadowColor: '#000000',
		shadowOffset: { width: -0, height: -3 },
		shadowRadius: 2,
		shadowOpacity: 0.08,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25
	},
	panelHeader: {
		alignItems: 'center'
	},
	panelHandle: {
		width: 85,
		height: 5,
		borderRadius: 8,
		backgroundColor: '#B8B8B8',
		marginTop: 13,
		marginBottom: 10
	},

	// Bottom sheet item styling
	bottomSheetItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		marginLeft: 35
	},
	bottomSheetItemImage: {
		height: 20,
		width: 20,
		marginRight: 16
	},
	bottomSheetItemText: {
		fontSize: 14,
		lineHeight: 16,
		fontWeight: '500',
		fontStyle: 'normal'
	},

	pdfContainer: {
		flex: 1,
		alignItems: 'center',
		padding: 5,
		backgroundColor: '#E5E5E5',
		borderRadius: 20
	},
	pdf: {
		flex: 1,
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 70,
		justifyContent: 'center',
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#E5E5E5',
		width: Dimensions.get('screen').width,
		height: Dimensions.get('screen').height
	},
	filePreviewContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		marginLeft: 16,
		marginRight: 16,
		borderRadius: 10
	},
	previewImageStyle: {
		width: '100%',
		aspectRatio: 15 / 9,
		borderRadius: 20,
		resizeMode: 'contain'
	},
	fileCancelButton: {
		height: 30,
		width: 30,
		borderRadius: 15,
		backgroundColor: '#3695FF',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		top: 10,
		right: 10
	},
	confirmationMessageText: {
		color: '#fff',
		alignSelf: 'center',
		fontSize: 15,
		fontWeight: '600'
	},
	confirmationMessageView: {
		width: 130,
		height: 40,
		borderRadius: 30,
		justifyContent: 'center'
	},
	headerContaier: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		height: RFValue(40)
	},
	headerRightIconsContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center'
	}
});
