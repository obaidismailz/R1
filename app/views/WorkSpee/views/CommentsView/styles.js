import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors } from '@styles';

export default StyleSheet.create({
	headerContaier: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: RFValue(8),
		backgroundColor: colors.secondaryColor
	},
	headerName: {
		fontSize: 20,
		fontWeight: '500',
		lineHeight: 24,
		color: 'white',
		textAlign: 'center'
	},
	scrollViewContainer: {
		flex: 1,
		backgroundColor: '#ffffff'
	},
	container: {
		backgroundColor: '#000000'
	},
	separatorLine: {
		width: '100%',
		alignSelf: 'center',
		height: 1.5,
		backgroundColor: '#C7C7C7',
		opacity: 0.5
	},

	// Comment Field
	showCommentFieldBottom: {
		position: 'relative',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
		paddingHorizontal: 16,
		backgroundColor: '#ffffff'
	},
	imageStyle: {
		height: 35,
		width: 35,
		alignItems: 'center',
		borderRadius: 35 / 2
	},
	commentfieldAndSmilyIcon: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
	},
	replyContainer: {
		flex: 1,
		marginLeft: 6,
		borderRadius: 20,
		backgroundColor: 'rgba(0,0,0,0.04)',
		justifyContent: 'center'
	},
	inputfieldStyle: {
		color: 'rgba(0, 0, 0, 0.6)',
		fontStyle: 'normal',
		fontSize: 14,
		fontWeight: '500',
		marginRight: 10,
		flex: 1
	},
	smilyIconStyle: {
		marginRight: 10
	},
	sendButton: {
		marginLeft: 8
	},
	addIcon: {
		marginHorizontal: 8
	},
	emptyCommetText: {
		fontSize: 28,
		color: 'rgba(0,0,0,0.2)',
		fontWeight: '400'
	},
	previewCommentImageStyle: {
		width: RFValue(80),
		height: RFValue(80),
		resizeMode: 'contain',
		borderRadius: 10
	},
	fileCancelButton: {
		height: 20,
		width: 20,
		borderRadius: 10,
		backgroundColor: '#3695FF',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'absolute',
		right: 0
	},
	imagePreviewContainer: {
		backgroundColor: '#ffffff',
		paddingLeft: 16
	},
	spinnerTextStyle: {
		color: '#FFF',
		fontStyle: 'normal',
		fontSize: 15,
		fontWeight: '500'
	}
});
