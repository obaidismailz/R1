import React, { memo } from 'react';
import {
	FlatList,
	View,
	Text,
	Pressable,
	Dimensions,
	Modal,
	SafeAreaView
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, exStyles } from '@styles';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ScoringCriterionModal = ({ ...props }, ref) => {
	const { criterion } = props;

	const ModalHeader = () => (
		<View>
			<View style={styles.modalHeader}>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transprent'
						},
						styles.closeButton
					]}
					onPress={() => {
						props.onClose();
					}}
				>
					<MaterialCommunityIcons
						name='window-close'
						size={24}
						color={colors.secondaryText}
					/>
				</Pressable>
				<Text
					style={[
						exStyles.mediumTitleMed20,
						{
							color: colors.primaryText
						}
					]}
				>
					View Scoring Criterion
				</Text>
				<View />
			</View>
			<View style={{ height: RFValue(20) }} />
		</View>
	);

	const separator = () => <View style={styles.separator} />;

	const ModalBody = () => (
		<FlatList
			data={criterion}
			ListHeaderComponent={(
				<>
					<Text
						style={[
							exStyles.infoLink14Med,
							{
								color: colors.secondaryText,
								textAlign: 'center',
								marginHorizontal: 32,
								marginBottom: 32
							}
						]}
					>
						View all the activities for which points are being awarded
					</Text>
				</>
			)}
			style={{ marginBottom: 96 }}
			ItemSeparatorComponent={separator}
			renderItem={({ item, index }) => (
				<View
					style={{
						flexDirection: 'row',
						marginHorizontal: 24,
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<View>
						<Text
							style={[
								exStyles.infoLargeM16,
								{
									color: colors.primaryText
								}
							]}
						>
							{item.area.name}
						</Text>
						<Text
							style={[
								exStyles.infoLargeM16,
								{
									color: colors.secondaryText
								}
							]}
						>
							({item.criteria.name})
						</Text>
					</View>

					<Text
						style={[
							exStyles.infoLargeM16,
							{
								color: colors.secondaryColor
							}
						]}
					>
						{`${ item.score } pts Each`}
					</Text>
				</View>
			)}
		/>
	);

	return (
		<Modal
			animationType='slide'
			transparent
			statusBarTranslucent={false}
			visible={props.visible}
			onRequestClose={() => {
				props.onClose();
			}}
		>
			<SafeAreaView style={styles.centeredView}>
				<View style={styles.modalView}>
					<ModalHeader />
					<ModalBody />
				</View>
			</SafeAreaView>
		</Modal>
	);
};

const styles = {
	centeredView: {
		flex: 1
	},
	modalView: {
		height: screenHeight,
		width: screenWidth,
		backgroundColor: 'white',
		borderTopRightRadius: RFValue(40),
		borderTopLeftRadius: RFValue(40),
		borderWidth: 1,
		borderColor: '#cecece',
		paddingTop: RFValue(24)
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginStart: 28,
		marginEnd: 28,
		alignItems: 'center'
	},
	closeButton: {
		borderRadius: 16,
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center'
	},
	separator: {
		height: 1,
		backgroundColor: colors.separatorColor,
		marginHorizontal: 24,
		marginVertical: 16
	}
};

export default memo(ScoringCriterionModal);
