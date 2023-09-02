import React, { memo, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView as SafeAreaViewNative, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Header, LoadingDialog } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import Axios from 'axios';
import FastImage from '@rocket.chat/react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import SafeAreaView from '../../containers/SafeAreaView';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import { colors, exStyles } from '../../styles';
import ItemEvent from './components/ItemEvents';
import { fetchEventInformation } from '../../actions/expo/eventInfo';
import { API_SAAS } from '../../constants/apisPath';
import { QA_INSTANCE } from '../../constants/constantData';
import { ShareData } from '@utils';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const EventListView = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const { token } = route.params;
	const [loading, setLoading] = useState(true);
	const [event, setEvent] = useState([]);
	const dispatch = useDispatch();
	const state = useSelector(state => state.eventInfo);
	const [eventCategories, setEventCategories] = useState([
		{ value: 'All Events', selected: true, key: 'All Events' },
		{ value: 'Upcoming', selected: false, key: 'Upcoming' },
		{ value: 'Ongoing', selected: false, key: 'Ongoing' }
	]);

	useEffect(() => {
		getInstances();
	}, []);

	const getInstances = () => {
		Axios({
			method: 'GET',
			url: API_SAAS.saas_url,
			headers: {
				token
			}
		})
			.then(response => {
				if (response.status == 200) {
					setEvent([...QA_INSTANCE, ...response.data.success.data]);
					setLoading(false);
				} else {
					alert('Something Went Wrong! Please Try again');
					setLoading(false);
				}
			})
			.catch(e => {
				console.error(e);
				setLoading(false);
			});
	};

	const EventCategoryList = () => (
		<FlatList
			contentContainerStyle={styles.listContainer}
			horizontal
			showsHorizontalScrollIndicator={false}
			data={eventCategories}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						styles.categoryContainer,
						{
							backgroundColor: item.selected ? colors.primaryColor : colors.unSelected
						}
					]}
					onPress={() => {
						const d = [...eventCategories];
						for (let i = 0; i < d.length; i++) {
							const element = d[i];
							if (i === index) {
								d[i].selected = true;
							} else {
								d[i].selected = false;
							}
						}
						setEventCategories(d);
					}}>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoDetailR16,
							{
								color: item.selected ? 'white' : colors.secondaryText
							}
						]}>
						{item.value}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);

	const listSeparator = () => (
		<View
			style={{
				marginHorizontal: RFValue(16),
				height: 0.5,
				backgroundColor: colors.black20
			}}
		/>
	);

	const Branding = () => (
		<View
			style={{
				alignItems: 'center',
				paddingBottom: RFValue(16),
				backgroundColor: 'white'
			}}>
			<View
				style={{
					flexDirection: 'row',
					marginTop: 8
				}}>
				<Text style={[exStyles.infoLargeM16, { color: colors.primaryText, alignSelf: 'flex-end' }]}>{'Powered by  '}</Text>
				<FastImage
					style={{
						width: RFValue(60),
						height: 32,
						padding: 2
					}}
					source={require('../../static/images/logo3x.png')}
				/>
			</View>
		</View>
	);

	return (
		<>
			<SafeAreaViewNative
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground
				}}
			/>

			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} barStyle='light-content' />
			<Header
				title='Events'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
			/>
			<SafeAreaView
				theme={theme}
				style={{
					backgroundColor: themes[theme].headerBackground,
					flex: 1
				}}>
				<View style={styles.container}>
					{loading ? (
						<View />
					) : event.length > 0 ? (
						<FlatList
							data={event}
							ItemSeparatorComponent={listSeparator}
							ListHeaderComponent={<EventCategoryList />}
							ListHeaderComponentStyle={{ marginBottom: 16 }}
							renderItem={({ item, index }) =>
								item.is_active == 1 ? (
									<ItemEvent
										item={item}
										onPress={() => {
											ShareData.getInstance().setBaseUrl(item.domain, item.sub_domain);
											dispatch(fetchEventInformation(item.instances));
										}}
									/>
								) : null
							}
						/>
					) : (
						<Text
							style={[
								exStyles.largeTitleR28,
								{
									marginTop: screenHeight * 0.35,
									color: colors.primaryText,
									justifyContent: 'center',
									alignSelf: 'center'
								}
							]}>
							No Events Available
						</Text>
					)}
				</View>
				<Branding />
				{state.loading ? <LoadingDialog visible /> : null}
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.white
	},
	listContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 32,
		paddingBottom: RFValue(10),
		marginStart: RFValue(8),
		backgroundColor: 'white',
		width: '100%'
	},
	categoryContainer: {
		marginEnd: RFValue(15),
		height: RFValue(30),
		justifyContent: 'center',
		paddingHorizontal: RFValue(8),
		borderRadius: RFValue(10)
	}
});

export default withDimensions(withTheme(memo(EventListView)));
