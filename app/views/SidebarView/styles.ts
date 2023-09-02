import { colors } from '@styles';
import { StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

import sharedStyles from '../Styles';

export default StyleSheet.create({
	container: {
		flex: 1
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemCurrent: {
		backgroundColor: '#E1E5E8'
	},
	itemHorizontal: {
		marginHorizontal: 10,
		width: 30,
		alignItems: 'center'
	},
	itemCenter: {
		flex: 1
	},
	itemText: {
		marginVertical: 16,
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	separator: {
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginVertical: 4
	},
	header: {
		paddingVertical: 16,
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerTextContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'flex-start'
	},
	headerUsername: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	username: {
		fontSize: 14,
		...sharedStyles.textMedium
	},
	avatar: {
		marginHorizontal: 10
	},
	currentServerText: {
		fontSize: 14,
		...sharedStyles.textSemibold
	},
	version: {
		marginHorizontal: 10,
		marginBottom: 10,
		fontSize: 13,
		...sharedStyles.textSemibold
	},
	inverted: {
		transform: [{ scaleY: -1 }]
	},
	powerBy: {
		fontWeight: '400',
		fontSize: 16,
		lineHeight: 24,
		letterSpacing: 0.6,
		color: colors.primaryText
	},
	txtName: {
		color: 'white',
		fontWeight: 'bold',
		letterSpacing: 0.2,
		fontSize: RFValue(14)
	},
	itemDrawerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		alignItems: 'center',
		marginVertical: RFValue(14)
	},
	imgProfile: {
		width: 24,
		height: 24,
		tintColor: colors.secondaryText,
		resizeMode: 'contain'
	},
	txtBadge: {
		color: 'white',
		padding: 4,
		textAlign: 'center'
	},
	badgeContainer: {
		width: RFValue(50),
		justifyContent: 'center',
		alignItems: 'center'
	},
	headerContainer: {
		paddingHorizontal: 16,
		backgroundColor: colors.secondaryColor,
		paddingBottom: 12
	},
	imgProfilePic: {
		height: RFValue(48),
		width: RFValue(48),
		borderRadius: RFValue(48) / 2,
		marginRight: RFValue(6)
	},
	txtEmail: {
		color: 'white',
		width: '90%',
		fontWeight: '400',
		letterSpacing: 0.2,
		fontSize: RFValue(12)
	}
});
