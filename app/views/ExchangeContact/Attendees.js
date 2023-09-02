import * as React from 'react';
import {
	memo, useRef, useState, useEffect
} from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	StyleSheet,
	Dimensions,
	FlatList,
	TouchableOpacity,
	SectionList
} from 'react-native';
import { GET_EXCHNGE_CONTACTS, ALPHABETS } from '@utils/Constants';
import { Header, LoadingDialog } from '@components';
import axios from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import { noInternetAlert } from '@utils/Network';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Attendees = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const filterList = useRef(null);
	const [filter, setFilter] = useState([
		{ value: 'All', selected: true, key: 'all' },
		{ value: 'Exchanged', selected: false, key: 'exchanged' },
		{ value: 'Requested', selected: false, key: 'requested' },
		{ value: 'Pending', selected: false, key: 'pending' }
	]);
	const listRef = useRef(undefined);
	const [loading, setLoading] = useState(false);
	const [contacts, setContacts] = useState([]);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getContacts()
				.then((data) => {
					const sortedData = data.sort((a, b) => a.exchanged_with_user.fname.localeCompare(
						b.exchanged_with_user.fname
					));

					const sectionArray = ALPHABETS.map((item, index) => ({
						title: item,
						data: sortedData
							.filter(
								i => i.exchanged_with_user.fname.charAt(0).toLowerCase()
									=== item.toLowerCase()
							)
							.map(item => ({
								...item,
								status:
									item.approved_status === 'true'
										? 'exchanged'
										: item.request_status === 'true'
											? 'requested'
											: 'pending'
							}))
					}));
					setContacts(sectionArray);
					setLoading(false);
				})
				.catch((e) => {
					setLoading(false);
					console.error(e);
				});
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

	const getContacts = async() => new Promise((resolve, reject) => {
		setLoading(true);
		axios({
			method: 'GET',
			url: ShareData.getInstance().baseUrl + GET_EXCHNGE_CONTACTS,
			data: {},
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${ ShareData.getInstance().access_token }`
			}
		})
			.then((response) => {
				// console.error(JSON.stringify(response));
				if (response.status === 200 || response.status === 600) {
					if (response.data._metadata.status === 'SUCCESS') {
						resolve(response.data.records);
					} else {
						reject(response.data._metadata.message);
					}
				} else {
					reject('Failed to get Notifications, Please try again ');
				}
			})
			.catch((error) => {
				setLoading(false);
				reject(`Failed to get Notifications, Please try again ${ error }`);
			});
	});

	const scrollSectionList = (alphabet) => {
		for (let index = 0; index < contacts.length; index++) {
			const element = contacts[index];
			if (element.title === alphabet && element.data.length > 0) {
				listRef.current.scrollToLocation({
					animated: true,
					itemIndex: 0,
					sectionIndex: index
				});
			}
		}
	};

	const renderAttendeesCatList = () => (
		<FlatList
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.filterListContainer}
			ref={filterList}
			horizontal
			style={{
				flexGrow: 0
			}}
			data={filter}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					activeOpacity={0.8}
					style={[
						styles.itemFilter,
						{
							backgroundColor: item.selected ? colors.primaryColor : 'white',
							borderWidth: item.selected ? 0 : 1
						}
					]}
					onPress={() => {
						const d = [...filter];
						for (let i = 0; i < d.length; i++) {
							const element = d[i];
							if (i === index) {
								d[i].selected = true;
							} else {
								d[i].selected = false;
							}
						}
						setFilter(d);
					}}
				>
					<Text
						numberOfLines={1}
						style={{
							color: item.selected ? 'white' : 'grey',
							maxWidth: RFValue(200)
						}}
					>
						{item.value}
					</Text>
				</TouchableOpacity>
			)}
		/>
	);

	return (
		<>
			<SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
			<Header
				title='Exchange Contacts'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
				onChangeSearch={(txt) => {}}
			/>
			<SafeAreaView
				style={{
					flex: 1,
					backgroundColor: colors.white,
					justifyContent: 'center'
				}}
			>
				{renderAttendeesCatList()}

				<SectionList
					ref={listRef}
					sections={contacts}
					sections={
						filter.find(item => item.selected === true).key === 'all'
							? contacts
							: contacts.map(item => ({
								...item,
								data: item.data.filter(
									(item, index) => filter.find(item => item.selected === true).key
											=== item.status
								)
							  }))
					}
					renderItem={({ item }) => (
						<ItemAttendee
							data={item}
							onPress={() => navigation.navigate('ExchangeContactProfile', {
								data: item,
								getData
							})
							}
							// onPress={() => console.error(JSON.stringify(item))}
						/>
					)}
					renderSectionHeader={obj => (obj.section.data.length > 0 ? (
						<Text style={styles.txtSectionHeader}>{obj.section.title}</Text>
					) : null)
					}
					onScrollToIndexFailed={() => {}}
				/>
				<FlatList
					data={ALPHABETS}
					style={styles.alphabetsList}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={{ paddingHorizontal: RFValue(5) }}
							onPress={() => {
								scrollSectionList(item);
							}}
						>
							<Text style={styles.txtAlphabet}>{item}</Text>
						</TouchableOpacity>
					)}
				/>
				{loading ? <LoadingDialog visible /> : null}
			</SafeAreaView>
		</>
	);
};

const ItemAttendee = props => (
	<TouchableOpacity
		activeOpacity={0.8}
		style={styles.itemAttendeeContainer}
		onPress={props.onPress && props.onPress}
	>
		<Image
			style={styles.itemAttendeeImage}
			source={{ uri: '' }}
			source={{ uri: props.data.exchanged_with_user.image }}
		/>
		<View
			style={{ justifyContent: 'center', marginStart: RFValue(15), flex: 1 }}
		>
			<Text style={{ fontSize: RFValue(18), color: 'black' }}>
				{`${ props.data.exchanged_with_user.fname } ${ props.data.exchanged_with_user.lname }`}
			</Text>
			<Text style={{ color: 'grey', fontSize: RFValue(13) }}>
				{props.data.exchanged_with_user.job_title}
			</Text>
		</View>
		<Text
			style={[
				styles.txtExchange,
				props.data.approved_status === 'true'
					? { color: colors.secondaryColor }
					: {}
			]}
		>
			{props.data.pending_status === 'true' ? 'Pending..' : null}
			{props.data.request_status === 'true' ? 'Requested' : null}
			{props.data.approved_status === 'true' ? 'Exchanged!' : null}
		</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10)
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey'
	},
	itemAttendeeContainer: {
		width: screenWidth,
		backgroundColor: 'white',
		borderBottomWidth: 0.5,
		borderColor: '#cecece',
		paddingVertical: RFValue(20),
		paddingHorizontal: RFValue(10),
		flexDirection: 'row',
		alignItems: 'center'
	},
	itemAttendeeImage: {
		height: RFValue(50),
		width: RFValue(50),
		borderRadius: RFValue(60),
		resizeMode: 'contain'
	},
	txtExchange: {
		position: 'absolute',
		right: RFValue(20),
		bottom: RFValue(20),
		fontSize: RFValue(14),
		color: colors.primaryColor
	},
	alphabetsList: { position: 'absolute', right: 0, zIndex: 1000 },
	txtSectionHeader: {
		color: 'grey',
		fontWeight: 'bold',
		paddingStart: 10,
		paddingVertical: 3
	},
	itemFilter: {
		marginEnd: RFValue(15),
		borderColor: '#cecece',
		height: RFValue(30),
		justifyContent: 'center',
		paddingHorizontal: RFValue(13),
		borderRadius: RFValue(10)
	},
	filterListContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: RFValue(10),
		paddingBottom: RFValue(10),
		paddingHorizontal: RFValue(10)
		// width: screenWidth,
	},
	txtAlphabet: {
		color: '#2F80ED',
		fontSize: RFValue(11),
		fontWeight: '700'
	}
});

// home tab whole, auditorim

// export default memo(Lobby);
export default withDimensions(withTheme(memo(Attendees)));
