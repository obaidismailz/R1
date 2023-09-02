import React, { memo } from 'react';
import FastImage from '@rocket.chat/react-native-fast-image';
import moment from 'moment';
import {
	View, StyleSheet, Pressable, Text
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { themes } from '../../../constants/colors';
import { withDimensions } from '../../../dimensions';
import { colors, exStyles } from '../../../styles';
import { withTheme } from '../../../theme';

const ItemEvent = ({ ...props }) => {
	const { theme } = props;
	return (
		<>
			<Pressable
				activeOpacity={0.7}
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.container
				]}
				onPress={props.onPress}
			>
				<FastImage style={styles.logo} source={{ uri: props.item.logo }} />
				<View style={{ flex: 1, justifyContent: 'center' }}>
					<Text
						style={[
							exStyles.infoLargeM16,
							{
								color: colors.primaryText
							}
						]}
					>
						{props.item.name}
					</Text>
					<Text
						style={[
							exStyles.infoLargeM16,
							{
								color: colors.primaryText
							}
						]}
					>
						{props.item.address}
					</Text>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: colors.secondaryText
							}
						]}
					>
						{`${ moment(props.item.event_start_date).format(
							'MMM DD, YYYY'
						) } to ${ moment(props.item.event_end_date).format('MMM DD, YYYY') }`}
					</Text>
				</View>
			</Pressable>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingVertical: RFValue(8),
		paddingHorizontal: RFValue(16)
	},
	logo: {
		height: RFValue(80),
		width: RFValue(80),
		borderWidth: 1,
		borderColor: colors.black20,
		borderRadius: RFValue(80),
		marginEnd: RFValue(10),
		resizeMode: 'contain',
		backgroundColor: '#fff'
	}
});

export default withDimensions(withTheme(memo(ItemEvent)));
