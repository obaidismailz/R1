import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../styles';
import CustomPicker from './CustomPicker';
import CustomTextField from './CustomTextField';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;
const PersonalDetailForm = ({ ...props }) => (
	<>
		{/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}> */}
		<CustomTextField
			isVisible={1}
			width={screenWidth * 0.9}
			placeholder='First Name *'
			autoCapitalize='words'
			keyboardType='url'
			onSubmitEditing={() => {}}
			onChangeText={props.setFirstName}
			borderExtraStyle={{
				borderColor: props.fieldType == 1 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 1}
		/>
		<CustomTextField
			isVisible={1}
			width={screenWidth * 0.9}
			placeholder='Last Name *'
			autoCapitalize='words'
			keyboardType='url'
			onChangeText={props.setLastName}
			onSubmitEditing={() => {}}
			borderExtraStyle={{
				borderColor: props.fieldType == 2 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 2}
		/>
		{/* </View> */}
		<CustomTextField
			width={screenWidth * 0.9}
			isVisible={1}
			placeholder='Phone Number'
			autoCapitalize='none'
			keyboardType='numeric'
			onChangeText={props.setPhoneNumber}
			onSubmitEditing={() => {}}
			borderExtraStyle={{
				borderColor: props.fieldType == 3 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 3}
		/>
		<CustomTextField
			width={screenWidth * 0.9}
			isVisible={1}
			placeholder='Username *'
			autoCapitalize='none'
			keyboardType='url'
			onChangeText={props.setUserName}
			onSubmitEditing={() => {}}
			borderExtraStyle={{
				borderColor: props.fieldType == 4 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 4}
		/>
		<CustomTextField
			isVisible={1}
			width={screenWidth * 0.9}
			placeholder='Email *'
			autoCapitalize='none'
			keyboardType='url'
			onChangeText={props.setEmail}
			onSubmitEditing={() => {}}
			borderExtraStyle={{
				borderColor: props.fieldType == 5 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 5}
		/>
		<CustomTextField
			isVisible={1}
			width={screenWidth * 0.9}
			placeholder='Password *'
			secureTextEntry
			autoCapitalize='none'
			keyboardType='url'
			isPassword
			onChangeText={props.setPassword}
			onSubmitEditing={() => {}}
			a
			borderExtraStyle={{
				borderColor: props.fieldType == 6 || props.fieldType == 7 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 6}
		/>
		<CustomTextField
			isVisible={1}
			secureTextEntry
			width={screenWidth * 0.9}
			placeholder='Confirm Password *'
			autoCapitalize='none'
			keyboardType='url'
			isPassword
			onSubmitEditing={() => {}}
			onChangeText={props.setConfirmPassword}
			borderExtraStyle={{
				borderColor: props.fieldType == 6 || props.fieldType == 7 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 6}
		/>
		<CustomPicker
			visibility={1}
			onPress={props.onClickPicker}
			option={props.pickerOption}
			extraStyles={{
				borderBottomColor: props.fieldType == 8 ? colors.primaryColor : '#cecece'
			}}
			text={props.fieldType == 8}
		/>
	</>
);

const styles = StyleSheet.create({});

export default PersonalDetailForm;
