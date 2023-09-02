import * as React from 'react';
import {
	memo, useState, useEffect, createRef
} from 'react';
import {
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	FlatList
} from 'react-native';
import { ActivityIndicator, Header, NoRecordFound } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import { GET_FAQS } from '@utils/Constants';
import { useIsFocused } from '@react-navigation/native';
import { noInternetAlert } from '@utils/Network';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { themes } from '../constants/colors';

const FAQScreen = ({ navigation, route }) => {
	const actionSheetRef = createRef();

	const [loading, setLoading] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [faq, setFaq] = useState([]);

	useEffect(() => {
		getData();
	}, [useIsFocused()]);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getFaq();
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async() => {
					getData();
				}
			});
		}
	};

	const getFaq = () => {
		setLoading(true);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_FAQS,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoading(false);
				setLoadingDone(true);
				if (response.data._metadata.status === 'SUCCESS') {
					setFaq(
						response.data.records.map((item, index) => ({
							...item,
							isOpen: false
						}))
					);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};
	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<Header
				title='FAQs & Help'
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>

			<View style={[styles.mainContainer, { flex: 1 }]}>
				<Text style={[exStyles.infoLinkMed14, styles.txtNote]}>
					{'If you cant find the answer you are looking for then '}
					<Text
						style={[
							exStyles.infoLinkMed14,
							{
								color: colors.secondaryColor,
								textAlign: 'center'
							}
						]}
						onPress={() => {
							navigation.navigate('ContactUs');
						}}
					>
						Contact us here!
					</Text>
				</Text>

				<FlatList
					data={faq}
					renderItem={({ item, index }) => (
						<View
							style={{
								paddingVertical: RFValue(10)
							}}
						>
							<TouchableOpacity
								activeOpacity={1}
								style={styles.itemHeader}
								onPress={() => {
									setFaq(data => data.map((element, i) => ({
										...element,
										isOpen: i === index ? !element.isOpen : false
									})));
								}}
							>
								<Text
									style={[
										exStyles.infoLargeM16,
										{ color: colors.darkText, flex: 1 }
									]}
								>
									{item.question}
								</Text>
								<MaterialIcons
									name={
										item.isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
									}
									size={24}
									color={colors.darkText}
								/>
							</TouchableOpacity>
							{item.isOpen && (
								<Text style={[exStyles.infoDetailR16, styles.txtAnswer]}>
									{item.answer}
								</Text>
							)}
						</View>
					)}
				/>
				{loadingDone && faq.length === 0 && <NoRecordFound />}
			</View>
			{loading ? (
				<ActivityIndicator absolute size='large' theme='light' />
			) : null}
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

export default memo(FAQScreen);
