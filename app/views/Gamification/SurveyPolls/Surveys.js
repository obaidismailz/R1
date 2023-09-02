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
import { useIsFocused } from '@react-navigation/native';
import { noInternetAlert } from '@utils/Network';
import { themes } from '../../../constants/colors';
import { GET_SURVEYS } from '../../../utils/Constants';

const Surveys = ({ navigation, route }) => {
	const actionSheetRef = createRef();
	const [tabIndex, setTabIndex] = useState(0);
	const [loading, setLoading] = useState(false);
	const [loadingDone, setLoadingDone] = useState(false);
	const [faq, setFaq] = useState([]);
	const [filterResults, setFilterResults] = useState([]);

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
			url: GET_SURVEYS,
			headers: {
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				setLoading(false);
				setLoadingDone(true);
				if (response.data._metadata.status === 'SUCCESS') {
					setFaq(response.data.records);
					setFilterResults(response.data.records);
				}
			})
			.catch((e) => {
				setLoading(false);
				console.log(JSON.stringify(e));
			});
	};

	const Tabs = () => (
		<View
			style={{
				backgroundColor: colors.secondaryColor,
				paddingBottom: 4
			}}
		>
			<View style={styles.tabbarContainer}>
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 0 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => {
						setTabIndex(0);
						setFilterResults(faq.filter(res => res.user_visit == ''));
					}}
				>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 0 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 0 ? '700' : '500'
							}
						]}
					>
						Available
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 1 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => {
						setTabIndex(1);
						setFilterResults(faq.filter(res => res.user_visit !== ''));
					}}
				>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 1 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 1 ? '700' : '500'
							}
						]}
					>
						Visited
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<Header
				title='Surveys & Polls'
				theme='light'
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<Tabs />
				<View style={styles.mainContainer}>
					<Text style={[exStyles.infoLinkMed14, styles.txtNote]}>
						Take the following surveys & polls to earn some extra points
					</Text>

					<FlatList
						showsVerticalScrollIndicator={false}
						data={filterResults}
						renderItem={({ item, index }) => (
							<View
								style={{
									paddingVertical: RFValue(10)
								}}
							>
								<TouchableOpacity
									activeOpacity={0.7}
									style={styles.itemHeader}
									onPress={() => {
										navigation.navigate('WebviewScreen', {
											title: item.survey.title,
											link: item.survey.url
										});
									}}
								>
									<Text
										style={[
											exStyles.infoLargeM16,
											{ color: colors.darkText, flex: 1 }
										]}
									>
										{item.survey.title}
									</Text>
								</TouchableOpacity>
							</View>
						)}
					/>
					{loadingDone && faq.length === 0 && <NoRecordFound />}
				</View>
				{loading ? (
					<ActivityIndicator absolute size='large' theme='light' />
				) : null}
			</View>
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
	},
	tabbarContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		marginHorizontal: 8,
		paddingHorizontal: 2,
		paddingVertical: 2,
		borderRadius: 10
	},
	animatedView: {
		position: 'absolute',
		width: '33%',
		top: 0,
		left: 0,
		bottom: 0,
		marginVertical: 2,
		backgroundColor: colors.secondaryColor,
		borderRadius: 8
	},
	tab: {
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		borderRadius: 8,
		paddingVertical: 4
	}
});

export default memo(Surveys);
