import * as React from 'react';
import {
	memo, useState, useEffect, createRef
} from 'react';
import {
	View,
	Text,
	SafeAreaView,
	StyleSheet,
	TextInput,
	TouchableOpacity
} from 'react-native';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import ActionSheet from 'react-native-actionsheet';
import { FormButton } from '../components';

const Report = ({ navigation, route }) => {
	const actionSheetRef = createRef();

	const [selectedReason, setSelectedReason] = useState(-1);
	const [reason, setReason] = useState('');
	useEffect(() => {}, []);

	return (
		<>
			<SafeAreaView style={{ backgroundColor: '#2775EE' }} />
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
				<Header
					title='Report'
					theme='light'
					onBackPress={() => {
						navigation.goBack();
					}}
					onChangeSearch={() => {}}
				/>

				<View
					style={{
						flex: 1,
						paddingHorizontal: RFValue(20),
						paddingVertical: RFValue(10)
					}}
				>
					<Text
						style={{
							fontSize: RFValue(16),
							color: 'black',
							textAlign: 'center'
						}}
					>
						Hi Micheal Jame. Please take a moment to share with us why you want
						to report this. Thankyou.
					</Text>

					<Text style={styles.txtBtnTitle}>Report Reason*</Text>
					<TouchableOpacity
						activeOpacity={0.8}
						style={styles.btn}
						onPress={() => {
							actionSheetRef.current.show();
						}}
					>
						<Text style={{ color: 'black', flex: 1 }}>
							{selectedReason < 0
								? 'Select a reason for reporting'
								: REASON_ARRAY[selectedReason]}
						</Text>
					</TouchableOpacity>

					<Text style={styles.txtBtnTitle}>Description*</Text>
					<TextInput
						multiline
						numberOfLines={5}
						style={styles.inputDescription}
						placeholder='Share some details regarding your report.'
						value={reason}
						onChangeText={txt => setReason(txt)}
					/>
					<Text
						style={{
							color: 'grey',
							alignSelf: 'flex-end',
							fontSize: RFValue(12)
						}}
					>
						0/240
					</Text>
					<View style={{ flex: 1 }} />
					<FormButton
						title='Submit'
						onPress={() => {}}
						extraStyle={{ marginBottom: RFValue(20) }}
					/>
				</View>
				<ActionSheet
					ref={actionSheetRef}
					title=''
					options={REASON_ARRAY}
					cancelButtonIndex={REASON_ARRAY.length - 1}
					destructiveButtonIndex={REASON_ARRAY.length - 1}
					onPress={(index) => {
						/* do something */
						// alert(index)
						setSelectedReason(index);
					}}
				/>
			</SafeAreaView>
		</>
	);
};

const REASON_ARRAY = [
	'Nudity',
	'Violence',
	'Harrassment',
	'Sucide or Self-Injury',
	'False Information',
	'Spam',
	'Unauthorized Sales',
	'Hate Speech',
	'Terrorism',
	'Gross Content',
	'Something else',
	'Cancel'
];

const styles = StyleSheet.create({
	images: {
		height: RFValue(250),
		width: RFValue(250),
		marginTop: RFValue(-60),
		alignSelf: 'center',
		resizeMode: 'contain'
	},

	textInput: {
		flex: 1,
		paddingVertical: 15,
		paddingStart: 15,
		fontSize: RFValue(16),
		color: '#48a9ee'
	},

	heading: {
		alignSelf: 'center',
		color: 'red',
		fontSize: RFValue(22),
		marginTop: RFValue(20),
		fontWeight: 'bold'
	},
	txtBtnTitle: {
		fontSize: RFValue(16),
		fontWeight: 'bold',
		color: 'black',
		marginTop: RFValue(20),
		marginBottom: RFValue(10)
	},
	btn: {
		padding: RFValue(10),
		borderWidth: 1,
		borderRadius: 5,
		elevation: 3,
		backgroundColor: '#fff',
		borderColor: '#cecece',
		flexDirection: 'row',
		alignItems: 'center'
	},
	inputDescription: {
		padding: RFValue(10),
		fontSize: RFValue(14),
		borderWidth: 1,
		borderRadius: 5,
		elevation: 3,
		backgroundColor: '#fff',
		borderColor: '#cecece',
		textAlignVertical: 'top'
	}
});

export default memo(Report);
