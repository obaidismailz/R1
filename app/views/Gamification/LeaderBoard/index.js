import * as React from 'react';
import { memo, useEffect, useState } from 'react';
import {
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { ShareData } from '@utils';
import { noInternetAlert } from '@utils/Network';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FIcons from 'react-native-vector-icons/FontAwesome5';
import MCIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { withTheme } from '../../../theme';
import { withDimensions } from '../../../dimensions';
import { themes } from '../../../constants/colors';
import StatusBar from '../../../containers/StatusBar';
import {
	getInCentives,
	getMyPoints,
	getRankings,
	getScoreCriterion
} from '../../../apis/LoopExpoApi';
import Rankings from './Rankings';
import { ActivityIndicator } from '../../../components';
import MyPoints from './MyPoints';
import ScoringCriterionModal from './ScoringCriterionModal';
import InCentives from './Incentives';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const Leaderboards = ({ navigation, route, ...props }) => {
	const { theme } = props;
	const [tabIndex, setTabIndex] = useState(0);
	const [rankings, setRankings] = useState([]);
	const [criterion, setCriterion] = useState([]);
	const [myPoints, setMyPoints] = useState([]);
	const [inCentives, setInCentives] = useState([]);
	const [loading, setLoading] = useState(true);
	const [openScoringCriterion, setOpenScoringCriterion] = useState(false);

	useEffect(() => {
		getData();
	}, []);

	const getData = () => {
		if (ShareData.getInstance().internetConnected) {
			getLeaderBoardData();
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

	const getLeaderBoardData = () => {
		getRankings().then((response) => {
			setRankings(response.records);
			setLoading(false);
		});
		getScoreCriterion().then((response) => {
			setCriterion(response.records);
		});
		getInCentives().then((response) => {
			setInCentives(response.records);
		});
		getMyPoints().then((response) => {
			setMyPoints(response.records);
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
					onPress={() => setTabIndex(0)}
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
						Rankings
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 1 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => setTabIndex(1)}
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
						My Points
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tab,
						{
							backgroundColor: tabIndex === 2 ? colors.secondaryColor : 'white'
						}
					]}
					onPress={() => setTabIndex(2)}
				>
					<Text
						style={[
							exStyles.TopTabSM14,
							{
								color: tabIndex === 2 ? 'white' : colors.secondaryColor,
								fontWeight: tabIndex === 2 ? '700' : '500'
							}
						]}
					>
						Prizes
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	return (
		<>
			<SafeAreaView
				style={{ backgroundColor: themes[theme].headerBackground }}
			/>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<Header
				title='LeaderBoard'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
				buttonText='Criterion'
				textButtonPress={() => {
					setOpenScoringCriterion(true);
				}}
			/>
			<SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
				<Tabs />
				{tabIndex == 0 ? (
					loading ? (
						<ActivityIndicator theme={theme} size='large' />
					) : (
						<Rankings theme={theme} rankings={rankings} />
					)
				) : tabIndex == 1 ? (
					<MyPoints theme={theme} points={myPoints} myPoints={rankings[2]} />
				) : (
					<InCentives theme={theme} inCentives={inCentives} />
				)}
			</SafeAreaView>
			<ScoringCriterionModal
				visible={openScoringCriterion}
				criterion={criterion}
				onClose={() => {
					setOpenScoringCriterion(false);
				}}
			/>
		</>
	);
};

const styles = StyleSheet.create({
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

export default withDimensions(withTheme(memo(Leaderboards)));
