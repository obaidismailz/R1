import * as React from 'react';
import { memo, useEffect, createRef, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/FontAwesome5';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { ActionSheet } from 'react-native-cross-actionsheet';
import { withTheme } from '../../../theme';
import { withDimensions } from '../../../dimensions';
import { themes } from '../../../constants/colors';
import StatusBar from '../../../containers/StatusBar';
import SpinWheel from './SpinWheel';
import { getSpinnerWheelData } from '../../../apis/LoopExpoApi';
import { FormButton } from '../../../components';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Gamification = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const actionSheetRef = createRef();
	const [wheelData, setWheelData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [spinning, setSpinning] = useState(false);
	const [results, setResults] = useState([]);
	const [totalPoints, setTotalPoints] = useState(0);

	const childRef = createRef();

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			spinnerWheelData();
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

	const onPressOptions = () => {
		ActionSheet.options({
			options: [
				{
					text: 'Leaderboards',
					onPress: () => {}
				},
				{
					text: 'Surveys',
					onPress: () => {}
				},
				{
					text: 'Scavanger hunt',
					onPress: () => {}
				}
			],
			cancel: { onPress: () => console.log('cancel') }
		});
	};

	const spinnerWheelData = () => {
		getSpinnerWheelData().then(response => {
			if (response._metadata.status == 'SUCCESS') {
				console.error(response);
				setWheelData(response.records);
				setLoading(false);
			}
		});
	};

	const WheelPlaceholder = () => (
		<View style={{ alignItems: 'center', justifyContent: 'center' }}>
			{/* <SkeletonPlaceholder
				highlightColor='rgba(0, 0, 0, 0.14)'
				backgroundColor='lightgrey'
				speed={1000}
			>
				<View
					style={{
						width: 320,
						height: 320,
						borderRadius: 320 / 2,
						justifyContent: 'center',
						alignItems: 'center',
						marginHorizontal: 24,
						marginTop: 12,
						marginBottom: 16
					}}
				/>
			</SkeletonPlaceholder> */}
		</View>
	);
	const listSeparator = () => <View style={styles.separatorView} />;

	updateArray = value => {
		setSpinning(false);
		setResults(results => [...results, value]);
		setTotalPoints(totalPoints + value.score);
	};

	return (
		<>
			<SafeAreaView style={{ backgroundColor: themes[theme].headerBackground }} />
			<StatusBar theme={theme} backgroundColor={themes[theme].headerBackground} />
			<Header
				title='Spin the Wheel'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
				onOptionsPress={() => {
					onPressOptions();
				}}
			/>
			<SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
				<View style={{ flex: 1 }}>
					<View
						style={{
							backgroundColor: themes[theme].headerBackground,
							borderBottomEndRadius: 40,
							borderBottomStartRadius: 40,
							paddingBottom: 8
						}}>
						<Text
							style={[
								exStyles.infoLink14Med,
								{
									color: 'white',
									textAlign: 'center',
									marginHorizontal: 74,
									marginTop: 8
								}
							]}>
							Try your luck now and earn points more points more amazing gifts!
						</Text>
						{loading ? <WheelPlaceholder /> : <SpinWheel ref={childRef} data={wheelData} onCallBack={updateArray} />}
						<Text style={[exStyles.largeTitleR28, { textAlign: 'center', color: 'white' }]}>
							{'Total Points: '}
							<Text style={{ fontWeight: '700' }}>{totalPoints}</Text>
						</Text>
					</View>
					<FlatList
						style={{ marginTop: 24 }}
						data={results}
						ItemSeparatorComponent={listSeparator}
						renderItem={({ item, index }) => (
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									marginHorizontal: 32
								}}>
								<Text style={[exStyles.mediumTitleMed20, { color: colors.primaryText }]}>{item.label}</Text>
								<View
									style={{
										paddingHorizontal: 24,
										paddingVertical: 2,
										borderRadius: 8,
										borderWidth: 1,
										borderColor: colors.black20,
										backgroundColor: colors.unSelected
									}}>
									<Text style={[exStyles.infoDetailR16, { color: colors.darkText }]}>{`${item.score} Pts`}</Text>
								</View>
							</View>
						)}
					/>
					<FormButton
						title='Spin Now'
						extraStyle={styles.spinnButton}
						onPress={() => {
							if (!spinning) {
								setSpinning(true);
								childRef.current.spin();
							}
						}}
					/>
				</View>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	spinnButton: {
		width: screenWidth * 0.8,
		height: 54,
		alignSelf: 'center',
		marginVertical: 15,
		borderRadius: 16
	},
	separatorView: {
		marginStart: 32,
		marginEnd: 32,
		marginVertical: 12,
		height: 1,
		backgroundColor: colors.separatorColor
	}
});

export default withDimensions(withTheme(memo(Gamification)));
