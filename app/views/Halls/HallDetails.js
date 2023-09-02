import * as React from 'react';
import { memo, useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, SafeAreaView, StyleSheet, Dimensions, FlatList } from 'react-native';
import { Header, FormButton } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import FastImage from '@rocket.chat/react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import { ItemBooth } from './components';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import ModalSelectBooth from './components/ModalSelectBooth';
import ActivityIndicator from '../../containers/ActivityIndicator';
import AboutText from '../../components/AboutText';
import { getBoothListInHall } from '../../apis/LoopExpoApi';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const HallDetails = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState('');
	const [imageloading, setImageLoading] = useState(true);
	const [booths, setBooths] = useState([]);
	const [selectBoothPopup, setSelectBoothPopup] = useState(false);
	const { hall } = route.params;

	const refModal = useRef(null);
	useEffect(() => {
		getData();
		return () => {
			FastImage.clearMemoryCache();
		};
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getBoothList();
		} else {
			noInternetAlert({
				onCancel: () => {
					navigation.goBack();
				},
				onPress: async () => {
					getData();
				}
			});
		}
	};

	const getBoothList = () => {
		setLoading(true);
		getBoothListInHall(hall.id).then(response => {
			if (response._metadata.status === 'SUCCESS') {
				setBooths(response.records);
				setLoading(false);
			} else {
				setLoading(false);
			}
		});
	};

	const onLoadEnd = () => {
		setImageLoading(false);
	};

	const HallDetails = () => (
		<View>
			<View>
				<FastImage onLoadEnd={onLoadEnd} style={styles.hallImage} source={{ uri: hall.image }} />
				<ActivityIndicator style={styles.activityIndicator} animating={imageloading} color='#000000AA' />
			</View>
			<Text style={[exStyles.ButtonSM20, styles.hallNameText]}>{hall.name}</Text>
			<View style={styles.hallDetailText}>
				<AboutText about='' text={hall.description} justify />
			</View>
			<FormButton
				title='JUMP TO BOOTH'
				extraStyle={styles.jumpToBoothButton}
				onPress={() => {
					setSelectBoothPopup(true);
					setBooths(booths);
				}}
			/>
			<View style={styles.sortContainer}>
				<Text style={[exStyles.infolink14Med, { color: colors.secondaryText }]}>
					<Text style={[exStyles.infolink14Med, { color: '#000000' }]}>{booths.length}</Text> Booths
				</Text>
			</View>
		</View>
	);

	const boothItemSeparator = () => <View style={styles.separatorView} />;

	return (
		<SafeAreaView theme={theme} style={{ backgroundColor: themes[theme].headerBackground, flex: 1 }}>
			<View style={{ flex: 1, backgroundColor: colors.white }}>
				<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
				<Header
					title=''
					theme={theme}
					onBackPress={() => {
						navigation.goBack();
					}}
					// onChangeSearch={(txt) => {}}
				/>

				<FlatList
					data={booths}
					ListHeaderComponent={<HallDetails />}
					ListEmptyComponent={loading ? <ActivityIndicator theme={theme} /> : null}
					ItemSeparatorComponent={boothItemSeparator}
					renderItem={({ item, index }) => (
						<ItemBooth
							data={item}
							index={index}
							onPress={() => {
								navigation.navigate('BoothDetails', {
									booth: item
								});
							}}
						/>
					)}
				/>
				<ModalSelectBooth
					visible={selectBoothPopup}
					booths={booths}
					onClose={() => {
						setSelectBoothPopup(false);
					}}
				/>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	hallImage: {
		height: screenWidth * 0.5,
		width: screenWidth,
		resizeMode: 'stretch'
	},
	activityIndicator: {
		position: 'absolute',
		left: 0,
		right: 0,
		bottom: 100
	},
	hallNameText: {
		color: colors.primaryText,
		marginVertical: RFValue(16),
		marginHorizontal: RFValue(16)
	},
	hallDetailText: {
		marginHorizontal: 16
	},
	jumpToBoothButton: {
		width: screenWidth * 0.5,
		alignSelf: 'center',
		marginTop: 56,
		borderRadius: 20
	},
	sortContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 40,
		backgroundColor: '#F2F2F2',
		paddingHorizontal: 24,
		paddingVertical: 4
	},
	onPressSortStyle: {
		borderRadius: 5,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 4
	},
	txtBlogTitle: {
		fontSize: RFValue(18),
		color: 'black',
		marginTop: RFValue(10)
	},
	txtDate: {
		fontSize: RFValue(12),
		color: 'grey',
		marginBottom: RFValue(3)
	},
	icon: {
		height: RFValue(20),
		width: RFValue(20),
		resizeMode: 'contain'
	},
	txtDetails: {
		fontSize: RFValue(12),
		color: 'grey',
		marginStart: RFValue(5)
	},
	separatorView: {
		marginStart: 24,
		marginEnd: 24,
		height: 1,
		backgroundColor: colors.separatorColor
	}
});

// home tab whole, auditorim

// export default memo(Halls);
export default withDimensions(withTheme(memo(HallDetails)));
