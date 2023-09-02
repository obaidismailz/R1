import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@styles';

import { RFValue } from 'react-native-responsive-fontsize';
import sharedStyles from '../../../Styles';

export default StyleSheet.create({
	container: {
		flex: 1
	},
	list: {
		width: '100%'
	},
	dropdownContainerHeader: {
		height: 41,
		borderBottomWidth: StyleSheet.hairlineWidth,
		alignItems: 'center',
		flexDirection: 'row'
	},
	sortToggleContainerClose: {
		position: 'absolute',
		top: 0,
		width: '100%'
	},
	userNameText: {
		fontSize: 12,
		fontWeight: '400',
		color: '#343435'
	},
	queueToggleText: {
		fontSize: 16,
		flex: 1,
		...sharedStyles.textRegular
	},
	dropdownContainer: {
		width: '100%',
		position: 'absolute',
		top: 0,
		borderBottomWidth: StyleSheet.hairlineWidth
	},
	sortItemButton: {
		height: 57,
		justifyContent: 'center'
	},
	ItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 30,
		marginLeft: 20
	},
	statusIconBackgroundView: {
		width: 18,
		height: 18,
		borderRadius: 9,
		backgroundColor: '#56c765'
	},
	sortItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 12
	},
	ItemText: {
		fontSize: 12,
		color: '#343435',
		fontWeight: '400',
		flex: 1,
		...sharedStyles.textRegular
	},
	backdrop: {
		...StyleSheet.absoluteFill
	},
	sortSeparator: {
		height: StyleSheet.hairlineWidth,
		marginHorizontal: 12,
		flex: 1
	},
	sortIcon: {
		width: 22,
		height: 22,
		marginHorizontal: 12
	},
	queueIcon: {
		width: 22,
		height: 22,
		marginHorizontal: 12
	},
	groupTitleContainer: {
		paddingHorizontal: 12,
		paddingTop: 8,
		paddingBottom: 0
	},
	groupTitle: {
		fontSize: 14,
		letterSpacing: 0.27,
		flex: 1,
		// lineHeight: 24,
		...sharedStyles.textBold
	},
	serverHeader: {
		justifyContent: 'space-between'
	},
	serverHeaderText: {
		fontSize: 16,
		marginLeft: 12,
		...sharedStyles.textRegular
	},
	serverHeaderAdd: {
		fontSize: 16,
		marginRight: 12,
		paddingVertical: 10,
		...sharedStyles.textRegular
	},
	serverItem: {
		height: 68
	},
	serverItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 68
	},
	serverIcon: {
		width: 42,
		height: 42,
		marginHorizontal: 12,
		marginVertical: 13,
		borderRadius: 4,
		resizeMode: 'contain'
	},
	serverTextContainer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	serverName: {
		fontSize: 18,
		...sharedStyles.textSemibold
	},
	serverUrl: {
		fontSize: 16,
		...sharedStyles.textRegular
	},
	serverSeparator: {
		height: StyleSheet.hairlineWidth,
		marginLeft: 72
	},
	encryptionButton: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12
	},
	encryptionIcon: {
		...sharedStyles.textMedium
	},
	encryptionText: {
		flex: 1,
		fontSize: 16,
		marginHorizontal: 16,
		...sharedStyles.textMedium
	},
	omnichannelToggle: {
		marginRight: 12
	},

	safeAreaView: {
		backgroundColor: '#E9E9E9'
	},

	headerItemRightContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
	profileItemContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 16
	},

	avtarcontainer: {
		flex: 1,
		height: 36,
		width: 36,
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 12,
		borderRadius: 18
	},
	imageAvtar: {
		height: 36,
		width: 36,
		borderRadius: 19
	},
	iconInDropDown: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
		marginRight: 10,
		marginLeft: 28
	},
	iconLeftInDropDown: {
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 20
	},
	avtarContainerInDropDown: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 18,
		marginRight: 10,
		marginLeft: 20
	},
	statusColorInDropDown: {
		height: 9,
		width: 9,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#56C765',
		borderRadius: 4.5,
		marginRight: 23,
		marginLeft: 33
	},
	signOutContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 12,
		marginBottom: 20
	},

	// Post Cards styling

	cardContainer: {
		backgroundColor: '#ffffff'
	},
	//   followTextContainer: {
	// 	flexDirection: 'row',
	//   },
	followText: {
		color: '#00008B',
		fontWeight: 'bold',
		paddingLeft: 5
	},
	imageContainer: {
		flex: 1,
		width: 35,
		height: 35,
		borderRadius: 35 / 2,
		marginLeft: 17
	},
	imageStyle: {
		height: 35,
		width: 35,
		alignItems: 'center',
		borderRadius: 35 / 2
	},

	styleIcon: {
		color: '#000000',
		paddingRight: 5
	},
	separatorLine: {
		width: '100%',
		alignSelf: 'center',
		height: 1,
		backgroundColor: '#C7C7C7',
		opacity: 0.5
	},
	newPostButtonContainer: {
		flex: 1,
		position: 'absolute',
		top: 50,
		left: Dimensions.get('screen').width * 0.35,
		borderRadius: 15,
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center'
	},
	newPostButton: {
		backgroundColor: '#ffffff',
		width: 100,
		height: 30,
		borderRadius: 15
	},
	newPostButtonGradient: {
		width: 100,
		height: 30,
		alignItems: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		borderRadius: 15
	},
	newPostText: {
		fontStyle: 'normal',
		fontSize: 14,
		fontWeight: '500',
		color: '#ffffff',
		alignSelf: 'center'
	},
	// loading text
	spinnerTextStyle: {
		color: '#FFF',
		fontStyle: 'normal',
		fontSize: 15,
		fontWeight: '500'
	},
	emptyList: {
		marginTop: 16,
		alignItems: 'center'
	},
	emptyText: {
		fontSize: 22,
		fontWeight: '600',
		color: colors.secondaryText,
		letterSpacing: 0.6,
		lineHeight: 24
	},
	postContainer: {
		paddingBottom: 100
	},
	noPostContainerText: {
		alignItems: 'center',
		paddingVertical: 32,
		backgroundColor: '#F7F7F7'
	},
	noMorePosts: {
		fontSize: RFValue(16),
		fontWeight: '500',
		color: colors.secondaryText
	}
});
