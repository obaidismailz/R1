import * as React from 'react';
import { memo, useRef, useState, useEffect, createRef } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { noInternetAlert } from '@utils/Network';
import { Header, ActivityIndicator, FormButton } from '@components';
import RNFetchBlob from 'rn-fetch-blob';
import ActionSheet from 'react-native-actionsheet';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import { ShareData } from '@utils';
import { getSearchResults, getPropertyResults } from '@apis/Search';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ItemAuditoriumResource from '../Auditorium/components/ItemAuditoriumResource';
import StatusBar from '../../containers/StatusBar';
import { themes } from '../../constants/colors';
import { withDimensions } from '../../dimensions';
import { withTheme } from '../../theme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ModalSelectBooth from '../../views/Halls/components/ModalSelectBooth';
import { getAllBooths, getAllLocations } from '../../apis/LoopExpoApi';
import LocationsModal from './LocationsModal';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const GenericSearch = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [results, setResults] = useState([]);
	const [recentSearches, setRecentSearches] = useState(ShareData.getInstance().recentSearches);
	const [currentFilter, setCurrentFilter] = useState('booths');
	const [searchFilter, setSearchFilter] = useState([
		{ value: 'Booths', selected: true },
		{ value: 'Users', selected: false },
		{ value: 'Webinars', selected: false },
		{ value: 'Properties', selected: false }
	]);
	const [locationModelVisibility, setLocationModelVisibility] = useState(false);
	const citySheetRef = createRef();

	const sqftSheetRef = createRef();

	const [cityValue, setCityValue] = useState('');

	const [locationValue, setLocationValue] = useState('Select Location');
	const [locationItems, setLocationItems] = useState([]);

	const [categoryValue, setCategoryValue] = useState('Select Category');
	const [categoryId, setCategoryId] = useState(null);
	const categorySheetRef = createRef();

	const [areaMin, setAreaMin] = useState(null);
	const [areaMax, setAreaMax] = useState(null);

	const [priceMin, setPriceMin] = useState(null);
	const [priceMax, setPriceMax] = useState(null);

	const [beds, setBeds] = useState();
	const [baths, setBaths] = useState();

	const [sqftValue, setSqftValue] = useState('Sq.ft.');

	const [booth, setbooth] = useState({
		id: null,
		name: 'Select Smart Offices',
		logo: ''
	});
	const [boothModelVisibility, setBoothModelVisibility] = useState(false);
	const [boothList, setBoothList] = useState([]);
	const [propertyResult, setPropertyResult] = useState([]);

	useEffect(() => {
		setCurrentFilter(searchFilter.find(element => element.selected === true).value.toLocaleLowerCase());
		setResults([]);
		getBooths();
		cityLocation();
	}, [searchFilter]);

	useEffect(() => {
		console.error(JSON.stringify(recentSearches));
	}, [useIsFocused()]);

	const getBooths = () => {
		getAllBooths().then(res => {
			if (res._metadata.status == 'SUCCESS') {
				setBoothList(res.records);
			}
		});
	};

	const cityLocation = () => {
		getAllLocations().then(res => {
			if (res._metadata.status == 'SUCCESS') {
				setLocationItems(res.records);
			}
		});
	};

	const onPickBooth = booth => {
		setbooth(booth);
	};

	const onPicklocation = location => {
		setLocationValue(location.location);
	};

	const radioPress = i => {
		setSearchFilter(prevState =>
			prevState.map((item, index) => (index === i ? { ...item, selected: true } : { ...item, selected: false }))
		);
	};

	const updateRecentSearches = () => {
		if (ShareData.getInstance().recentSearches.length > 0 && ShareData.getInstance().recentSearches[0] === search) {
			return;
		}
		if (ShareData.getInstance().recentSearches.length === 0) {
			ShareData.getInstance().setRecentSearches([search]);
		} else if (ShareData.getInstance().recentSearches.length < 5) {
			ShareData.getInstance().setRecentSearches([search, ...ShareData.getInstance().recentSearches]);
		} else if (ShareData.getInstance().recentSearches.length >= 5) {
			const dataArr = ShareData.getInstance().recentSearches;
			dataArr.pop();
			dataArr.unshift(search);
			ShareData.getInstance().setRecentSearches(dataArr);
		}
		setRecentSearches(ShareData.getInstance().recentSearches);
	};

	const getResults = () => {
		if (search === '') {
			return;
		}
		setLoading(true);
		updateRecentSearches();

		getSearchResults({ module: currentFilter, search_data: search })
			.then(data => {
				setLoading(false);
				console.error(JSON.stringify(recentSearches));
				if (data._metadata.status === 'SUCCESS') {
					setResults(data.records);
				} else {
					alert(data._metadata.message);
				}
			})
			.catch(e => {
				setLoading(false);
				alert('Something went wrong, try again later');
			});
	};

	const submit = () => {
		let param;
		setLoading(true);
		if (cityValue == '') {
			return;
		}

		param = {
			city: cityValue,
			location: locationValue == '' ? undefined : locationValue,
			category_id: categoryId == null ? undefined : categoryId,
			area_min: areaMin == null ? undefined : areaMin,
			area_max: areaMax == null ? undefined : areaMax,
			area_unit: sqftValue,
			price_min: priceMin == null ? undefined : priceMin,
			price_max: priceMax == null ? undefined : priceMax,
			booth_id: booth.id
		};
		getPropertyResults(param).then(res => {
			if (res._metadata.status === 'SUCCESS') {
				setPropertyResult(res.records);
			} else {
				setPropertyResult(res.records);
				alert(res._metadata.message);
			}
			setLoading(false);
			// reset();
		});
	};

	function reset() {
		setCityValue('');
		setLocationValue('');
		setCategoryValue('');
		setCategoryId(null);
		setBeds(null);
		setBaths(null);
		setAreaMin(null);
		setAreaMax(null);
		setPriceMin(null);
		setPriceMax(null);
		setbooth({
			id: undefined,
			name: 'Select Smart Offices',
			logo: ''
		});
	}

	const PropertSearch = () => (
		<View style={{ marginHorizontal: 8 }}>
			<CustomPicker
				value={cityValue == '' ? 'Select City' : cityValue}
				onPress={() => {
					citySheetRef.current.show();
				}}
			/>
			<CustomPicker
				value={locationValue == '' ? 'Select Location' : locationValue}
				onPress={() => {
					setLocationModelVisibility(true);
				}}
			/>
			<CustomPicker
				value={categoryValue == '' ? 'Select Category' : categoryValue}
				onPress={() => {
					categorySheetRef.current.show();
				}}
			/>

			{/* Apartment Data */}
			{categoryId == 1 && (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-evenly',
						alignItems: 'center',
						marginTop: 36,
						marginBottom: 16
					}}>
					<Text style={{ fontSize: 16, marginEnd: 16, alignSelf: 'center' }}>Beds</Text>
					<TextInput
						style={{
							width: '30%',
							marginHorizontal: 14,
							borderBottomWidth: 0.5,
							borderColor: 'rgba(	126, 131, 137, 0.2)',
							fontSize: 16
						}}
						placeholder={'0'}
						keyboardType='decimal-pad'
						onChange={setBeds}
						value={beds}
					/>
					<Text style={{ fontSize: 16, marginEnd: 16, alignSelf: 'center' }}>Baths</Text>
					<TextInput
						style={{
							width: '30%',
							marginHorizontal: 14,
							borderBottomWidth: 0.5,
							borderColor: 'rgba(	126, 131, 137, 0.2)',
							fontSize: 16
						}}
						placeholder={'0'}
						keyboardType='decimal-pad'
						value={baths}
						onChange={setBaths}
					/>
				</View>
			)}

			{/* Area */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly'
				}}>
				<Text style={{ fontSize: 16, marginEnd: 16, alignSelf: 'center' }}>Area</Text>
				<TextInput
					style={{
						width: '25%',
						marginHorizontal: 14,
						borderBottomWidth: 0.5,
						borderColor: 'rgba(	126, 131, 137, 0.2)',
						fontSize: 16
					}}
					keyboardType='decimal-pad'
					placeholder={'Min'}
					onChange={setAreaMin}
					value={areaMin}
				/>
				<TextInput
					style={{
						width: '25%',
						marginHorizontal: 14,
						borderBottomWidth: 0.5,
						borderColor: 'rgba(	126, 131, 137, 0.2)',
						fontSize: 16
					}}
					placeholder={'Max'}
					keyboardType='decimal-pad'
					onChange={setAreaMax}
					value={areaMax}
				/>
				<CustomPicker
					value={sqftValue}
					onPress={() => {
						sqftSheetRef.current.show();
					}}
				/>
			</View>
			{/* prices */}
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					marginVertical: 8
				}}>
				<Text style={{ fontSize: 16, marginHorizontal: 16 }}>Price</Text>
				<TextInput
					style={{
						height: 60,
						width: '35%',
						marginHorizontal: 14,
						borderBottomWidth: 0.5,
						borderColor: 'rgba(	126, 131, 137, 0.2)',
						fontSize: 16
					}}
					keyboardType='decimal-pad'
					placeholder={'Min'}
					value={priceMin}
					onChange={setPriceMin}
				/>
				<TextInput
					style={{
						height: 60,
						width: '35%',
						marginHorizontal: 14,
						borderBottomWidth: 0.5,
						borderColor: 'rgba(	126, 131, 137, 0.2)',
						fontSize: 16
					}}
					placeholder={'Max'}
					keyboardType='decimal-pad'
					value={priceMax}
					onChange={setPriceMax}
				/>
				<Text style={{ fontSize: 16, marginHorizontal: 16 }}>PKR</Text>
			</View>
			<CustomPicker
				value={booth.name}
				onPress={() => {
					setBoothModelVisibility(true);
				}}
			/>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
				<FormButton
					title='Search'
					extraStyle={{
						width: ' 65%',
						marginTop: RFValue(20),
						backgroundColor: '#F6A83B',
						borderColor: '#F6A83B'
					}}
					onPress={() => submit()}
				/>
				<FormButton
					title='Reset'
					extraStyle={{
						width: ' 30%',
						marginTop: RFValue(20),
						backgroundColor: colors.secondaryColor,
						borderColor: colors.secondaryColor
					}}
					onPress={() => {
						reset();
						setPropertyResult([]);
					}}
				/>
			</View>

			<ActionSheet
				ref={citySheetRef}
				options={['Lahore', 'Islamabad', 'Karachi', 'Cancel']}
				cancelButtonIndex={3}
				destructiveButtonIndex={3}
				onPress={index => {
					if (index === 0) {
						setCityValue('Lahore');
						setLocationValue('Select Location');
					}
					if (index === 1) {
						setCityValue('Islamabad');
						setLocationValue('Select Location');
					}
					if (index === 2) {
						setCityValue('Karachi');
						setLocationValue('Select Location');
					}
				}}
			/>
			<LocationsModal
				visible={locationModelVisibility}
				city={cityValue}
				locations={locationItems}
				onPick={onPicklocation}
				onClose={() => {
					setLocationModelVisibility(false);
				}}
			/>
			<ActionSheet
				ref={categorySheetRef}
				options={['Apartment', 'Shop', 'Residential Plot', 'Commercial Plot', 'Cancel']}
				cancelButtonIndex={4}
				destructiveButtonIndex={4}
				onPress={index => {
					if (index === 0) {
						setCategoryId(1);
						setCategoryValue('Apartment');
					}
					if (index === 1) {
						setCategoryId(2);
						setCategoryValue('Shop');
					}
					if (index === 2) {
						setCategoryId(3);
						setCategoryValue('Residential Plot');
					}
					if (index === 3) {
						setCategoryId(4);
						setCategoryValue('Commercial Plot');
					}
				}}
			/>
			<ActionSheet
				ref={sqftSheetRef}
				options={['Sq.ft', 'Marla', 'Kanal', 'Cancel']}
				cancelButtonIndex={3}
				destructiveButtonIndex={3}
				onPress={index => {
					if (index === 0) {
						setSqftValue('Sq.ft');
					}
					if (index === 1) {
						setSqftValue('Marla');
					}
					if (index === 2) {
						setSqftValue('Kanal');
					}
				}}
			/>
			<ModalSelectBooth
				picker
				visible={boothModelVisibility}
				booths={boothList}
				onPick={onPickBooth}
				onClose={() => {
					setBoothModelVisibility(false);
				}}
			/>
		</View>
	);

	return (
		<>
			<SafeAreaView style={{ backgroundColor: themes[theme].headerBackground }} />
			<SafeAreaView theme={theme} style={{ backgroundColor: 'white', flex: 1 }}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />

				<View style={{ flex: 1, backgroundColor: '#fff' }}>
					<Header
						title='My Briefcase'
						theme={theme}
						onBackPress={() => {
							navigation.goBack();
						}}
						hideField={currentFilter == 'properties' ? true : false}
						defaultFocus
						placeholder='Search booth or products'
						value={search}
						onSubmitEditing={getResults}
						onChangeSearch={txt => setSearch(txt)}
					/>

					<View style={{ flex: 1, marginHorizontal: 16 }}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								paddingVertical: RFValue(8)
							}}>
							<FlatList
								data={searchFilter}
								horizontal
								showsHorizontalScrollIndicator={false}
								renderItem={({ item, index }) => (
									<RadioButton isChecked={item.selected} title={item.value} onPress={() => radioPress(index)} />
								)}
							/>
						</View>

						{results.length > 0 && (
							<View style={styles.txtTicker}>
								<Text style={[exStyles.infoLargeM16, { color: colors.secondaryText }]}>
									{currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}
								</Text>
							</View>
						)}

						{results.length === 0 && !loading && currentFilter !== 'properties' ? (
							<>
								<Text style={exStyles.ButtonSM20}>Recent Searches</Text>
								{recentSearches.map((item, index) => (
									<TouchableOpacity
										style={{ flexDirection: 'row', paddingVertical: 10 }}
										activeOpacity={0.7}
										onPress={() => {
											setSearch(item);
											getResults();
										}}>
										<MaterialCommunityIcons name='history' size={24} color='#7E8389' />
										<Text
											style={{
												...exStyles.infoDetailR16,
												marginStart: RFValue(10)
											}}>
											{item}
										</Text>
									</TouchableOpacity>
								))}
							</>
						) : null}

						{currentFilter == 'properties' && (
							<FlatList
								showsVerticalScrollIndicator={false}
								data={propertyResult}
								ListHeaderComponent={<PropertSearch />}
								renderItem={({ item, index }) => <ItemProperty data={item} onPress={() => {}} />}
							/>
						)}

						<FlatList
							data={results}
							showsVerticalScrollIndicator={false}
							renderItem={
								({ item, index }) =>
									currentFilter === 'users' ? (
										<ItemUser
											data={item}
											onPress={() => {
												navigation.navigate('LoopUserProfile', {
													username: item.username
												});
											}}
										/>
									) : currentFilter === 'booths' ? (
										<ItemBooth
											data={item}
											onPress={() => {
												navigation.navigate('BoothDetails', {
													booth: { ...item, image: '' },
													onCallBackHallBooths: (res, type) => {}
												});
											}}
										/>
									) : (
										<ItemWebinar
											data={item}
											onPress={() => {
												navigation.navigate('WebinarDetails', {
													webinar: {
														...item,
														image: ''
													},
													getWebinarID: true
												});
											}}
										/>
									)
								// null
							}
						/>
					</View>
				</View>
				{loading ? <ActivityIndicator absolute size='large' theme={theme} /> : null}
			</SafeAreaView>
		</>
	);
};

const CustomPicker = ({ ...props }) => (
	<View>
		<TouchableOpacity
			activeOpacity={0.7}
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				borderBottomWidth: 0.5,
				borderColor: 'rgba(	126, 131, 137, 0.2)',
				paddingVertical: 16
			}}
			onPress={props.onPress}>
			<Text
				style={[
					exStyles.infoDetailR16,
					{
						maxWidth: '85%',
						color: colors.primaryText
					}
				]}
				numberOfLines={1}>
				{props.value}
			</Text>
			<MaterialIcons name='arrow-drop-down' size={RFValue(24)} color={colors.primaryText} style={{ marginStart: 16 }} />
		</TouchableOpacity>
	</View>
);

const RadioButton = props => (
	<TouchableOpacity
		activeOpacity={0.7}
		onPress={props.onPress}
		style={{
			flexDirection: 'row',
			alignItems: 'center',
			marginEnd: 16,
			paddingVertical: 4
		}}>
		<View
			style={{
				borderWidth: 2,
				borderRadius: 40,
				padding: 2,
				borderColor: props.isChecked ? colors.primaryColor : '#7E8389'
			}}>
			<View
				style={{
					height: 4,
					width: 4,
					backgroundColor: props.isChecked ? colors.primaryColor : undefined,
					borderRadius: RFValue(40)
				}}
			/>
		</View>
		<Text
			style={{
				color: props.isChecked ? colors.primaryColor : '#7E8389',
				paddingStart: RFValue(10),
				...exStyles.infoLargeM18
			}}>
			{props.title}
		</Text>
	</TouchableOpacity>
);

const ItemProperty = props => (
	<TouchableOpacity onPress={props.onPress} style={styles.listItemContainer}>
		<Image style={styles.imgListItem} source={{ uri: props.data.image }} />
		<View style={{ flex: 1 }}>
			<Text numberOfLines={1} style={{ color: 'black', ...exStyles.infoLargeM16 }}>
				{`${props.data.name}`}
			</Text>
			<Text numberOfLines={2} style={{ color: 'grey', ...exStyles.infoLargeM14 }}>
				{`${props.data.location},  ${props.data.city.toUpperCase()}`}
			</Text>
		</View>
	</TouchableOpacity>
);

const ItemUser = props => (
	<TouchableOpacity onPress={props.onPress} style={styles.listItemContainer}>
		<Image style={styles.imgListItem} source={{ uri: props.data.image }} />
		<View style={{ flex: 1 }}>
			<Text numberOfLines={1} style={{ color: 'black', ...exStyles.infoLargeM16 }}>
				{`${props.data.fname} ${props.data.lname}`}
			</Text>
			<Text numberOfLines={2} style={{ color: 'grey', ...exStyles.infoLargeM14 }}>
				{`${props.data.job_title} @ ${props.data.company_name}`}
			</Text>
		</View>
	</TouchableOpacity>
);

const ItemBooth = props => (
	<TouchableOpacity onPress={props.onPress} style={styles.listItemContainer}>
		<Image style={styles.imgListItem} source={{ uri: props.data.logo }} />
		<View style={{ flex: 1 }}>
			<Text numberOfLines={1} style={{ color: 'black', ...exStyles.infoLargeM16 }}>
				{`${props.data.name}`}
			</Text>
			<Text numberOfLines={2} style={{ color: 'grey', ...exStyles.infoLargeM14 }}>
				{props.data.products === undefined || props.data.products === null || props.data.products === ''
					? '0 Products'
					: `${props.data.products.length} Products`}
			</Text>
		</View>
	</TouchableOpacity>
);

const ItemWebinar = props => (
	<TouchableOpacity onPress={props.onPress} style={styles.listItemContainer}>
		<Image style={styles.imgListItem} source={{ uri: props.data.image }} />
		<View style={{ flex: 1 }}>
			<Text numberOfLines={1} style={{ color: 'black', ...exStyles.infoLargeM16 }}>
				{`${props.data.topic}`}
			</Text>
			<Text
				numberOfLines={2}
				style={[{ color: 'grey', ...exStyles.infoLargeM14 }, props.data.status === 'live' && styles.txtLive]}>
				{props.data.status === 'live' ? 'LIVE' : ''}
			</Text>
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	listItemContainer: {
		flexDirection: 'row',
		marginStart: RFValue(10),
		borderTopWidth: 0.5,
		borderColor: '#cecece',
		paddingVertical: RFValue(10),
		alignItems: 'center'
	},
	imgListItem: {
		height: RFValue(60),
		width: RFValue(60),
		borderRadius: RFValue(100),
		marginEnd: RFValue(20)
	},
	txtLive: {
		color: '#fff',
		backgroundColor: colors.secondaryColor,
		alignSelf: 'flex-start',
		paddingHorizontal: RFValue(7),
		borderRadius: RFValue(3),
		marginTop: RFValue(2)
	},
	txtTicker: {
		paddingStart: 24,
		paddingVertical: 8,
		marginVertical: 10,
		backgroundColor: colors.unSelected,
		width: screenWidth,
		marginStart: -RFValue(20)
	}
});

export default withDimensions(withTheme(memo(GenericSearch)));
