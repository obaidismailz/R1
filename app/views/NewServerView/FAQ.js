import React, { memo, useState } from 'react';
import { View, Text, SafeAreaView as SafeAreaViewNative, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ActivityIndicator, Header, NoRecordFound } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import { VEXPO_FAQ } from '../../constants/constantData';

const FAQ = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const [faq, setFaq] = useState(VEXPO_FAQ);

	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground
				}}
			/>

			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<Header
				title='FAQs & Help'
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					flex: 1
				}}>
				<View style={{ paddingHorizontal: RFValue(20) }}>
					<FlatList
						data={faq}
						renderItem={({ item, index }) => (
							<View
								style={{
									paddingVertical: RFValue(10)
								}}>
								<TouchableOpacity
									activeOpacity={1}
									style={styles.itemHeader}
									onPress={() => {
										setFaq(data =>
											data.map((element, i) => ({
												...element,
												isOpen: i === index ? !element.isOpen : false
											}))
										);
									}}>
									<Text style={[exStyles.infoLargeM16, { color: colors.darkText, flex: 1 }]}>{item.question}</Text>
									<MaterialIcons
										name={item.isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
										size={24}
										color={colors.darkText}
									/>
								</TouchableOpacity>
								{item.isOpen && <Text style={[exStyles.infoDetailR16, styles.txtAnswer]}>{item.answer}</Text>}
							</View>
						)}
					/>
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		paddingHorizontal: RFValue(20),
		paddingVertical: RFValue(10)
	},
	txtNote: {
		color: colors.secondaryText,
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		alignContent: 'center',
		textAlignVertical: 'center',
		paddingHorizontal: 32
	},
	itemHeader: {
		flexDirection: 'row',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 10,
		backgroundColor: colors.unSelected,
		alignItems: 'center'
	},
	imgDropDwn: {
		height: RFValue(30),
		width: RFValue(30),
		tintColor: '#1A1A1A'
	},
	txtAnswer: {
		color: colors.primaryText,
		flex: 1,
		marginHorizontal: 16,
		marginTop: 8
	}
});

export default withDimensions(withTheme(memo(FAQ)));
