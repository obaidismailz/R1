import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { exStyles, colors } from '../../../styles';

ItemContactUs = props => (
	<>
		<View style={styles.txtHeading}>
			<Text style={[exStyles.infoLargeM16, { color: colors.darkText }]}>Contact Us</Text>
		</View>
		<View style={{ marginHorizontal: 16 }}>
			<View
				style={{
					flexDirection: 'row',
					marginTop: RFValue(10),
					alignItems: 'center'
				}}>
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							width: 70,
							color: colors.secondaryText,
							textAlign: 'right',
							marginRight: 6
						}
					]}>
					{'Phone' + ': '}
				</Text>
				<TouchableOpacity activeOpacity={1}>
					<Text
						style={[
							exStyles.TabAllCapsMed14,
							{
								color: colors.secondaryColor
							}
						]}>
						{props.data.phone_no}
					</Text>
				</TouchableOpacity>
			</View>

			<View
				style={{
					flexDirection: 'row',
					marginTop: RFValue(10),
					alignItems: 'flex-start'
				}}>
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							width: 70,
							color: colors.secondaryText,
							textAlign: 'right',
							marginRight: 6
						}
					]}>
					{'Address' + ': '}
				</Text>
				<TouchableOpacity activeOpacity={1}>
					<Text
						style={[
							exStyles.TabAllCapsMed14,
							{
								textAlign: 'justify',
								width: '35%',
								color: colors.secondaryColor
							}
						]}>
						{props.data.address}
					</Text>
				</TouchableOpacity>
			</View>

			<View
				style={{
					flexDirection: 'row',
					marginTop: RFValue(10),
					alignItems: 'center',
					marginBottom: RFValue(80)
				}}>
				<Text
					style={[
						exStyles.infoDetailR16,
						{
							width: 70,
							color: colors.secondaryText,
							textAlign: 'right',
							marginRight: 6
						}
					]}>
					{'Email' + ': '}
				</Text>
				<TouchableOpacity activeOpacity={1}>
					<Text
						style={[
							exStyles.TabAllCapsMed14,
							{
								color: colors.secondaryColor
							}
						]}>
						{props.data.contact_email}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	</>
);

const styles = StyleSheet.create({
	txtHeading: {
		marginTop: 24,
		paddingStart: 32,
		backgroundColor: colors.unSelected,
		paddingVertical: 4
	}
});

export default ItemContactUs;
