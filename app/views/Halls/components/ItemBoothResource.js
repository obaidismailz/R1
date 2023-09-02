import React, { memo, useState, useImperativeHandle } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, Image } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import FastImage from '@rocket.chat/react-native-fast-image';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcons from 'react-native-vector-icons/Ionicons';
import AlertModal from '../../../components/AlertModal';
import { deleteBriefcase, saveBriefcase } from '../../../utils/Repository';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

const ItemBoothResourceVideos = ({ ...props }, ref) => {
	const [alertVisibility, setAlertVisibility] = useState(false);
	const [briefCased, setBriefCased] = useState(props.data.briefcase != '');
	const [resourceType, setResourceType] = useState('');
	const [resourceTypeId, setResourceTypeId] = useState('');

	function saveBriefCase(type, id) {
		saveBriefcase(type, id).then(res => {
			props.updateVideoResource(props.index, res);
		});

		setBriefCased(true);
	}

	const showAlert = (type, id) => {
		setResourceType(type);
		setResourceTypeId(id);
		setAlertVisibility(true);
	};

	const deleteBriefCase = (type, typeId) => {
		setBriefCased(false);
		setAlertVisibility(false);
		deleteBriefcase(type, typeId);
		props.DeleteVideoBriefCase(props.index);
	};

	return (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
				},
				styles.resourcesContainer
			]}
			onPress={props.onPress && props.onPress}>
			<FastImage
				style={styles.resourceImage}
				source={{
					uri: `https://img.youtube.com/vi/${props.data.video_id}/hqdefault.jpg`
				}}>
				<MaterialCommunityIcons name='play-circle-outline' size={48} color='white' style={styles.resourceTypeIcon} />
			</FastImage>
			<View style={{ paddingStart: 10, flex: 1 }}>
				<Text style={[exStyles.TopTabR14, { color: colors.primaryText, marginBottom: 4 }]}>{props.data.title}</Text>
				{/* <Text style={[exStyles.tabR11, { color: colors.secondaryText }]}>
					{props.data.title}
				</Text> */}
			</View>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.onPressable
				]}
				onPress={() => {
					briefCased ? showAlert('video', props.data.id) : saveBriefCase('video', props.data.id);
				}}>
				<IonIcons
					name={briefCased ? 'briefcase' : 'md-briefcase-outline'}
					size={RFValue(20)}
					color={briefCased ? colors.primaryColor : '#7E8389'}
				/>
			</Pressable>
			<AlertModal
				visible={alertVisibility}
				type={resourceType}
				text='Briefcase'
				typeId={resourceTypeId}
				onYes={deleteBriefCase}
				onClose={() => {
					setAlertVisibility(false);
				}}
			/>
		</Pressable>
	);
};

const ItemBoothResourceDocs = ({ ...props }, ref) => {
	const [alertVisibility, setAlertVisibility] = useState(false);
	const [briefCased, setBriefCased] = useState(props.data.briefcase != '');
	const [resourceType, setResourceType] = useState('');
	const [resourceTypeId, setResourceTypeId] = useState('');

	function saveBriefCase(type, id) {
		saveBriefcase(type, id).then(res => {
			props.updateDocsResource(props.index, res);
		});
		setBriefCased(true);
	}

	const showAlert = (type, id) => {
		setResourceType(type);
		setResourceTypeId(id);
		setAlertVisibility(true);
	};

	const deleteBriefCase = (type, typeId) => {
		setBriefCased(false);
		setAlertVisibility(false);
		deleteBriefcase(type, typeId);
		props.DeleteDocsBriefCase(props.index);
	};

	const image = type => {
		if (type == 'pdf') {
			return <FastImage style={styles.resourceImage} source={require('@assets/pdf.png')} />;
		} else if (type == 'xlsx' || type == 'xls') {
			return <FastImage style={styles.resourceImage} source={require('@assets/excle.png')} />;
		} else if (type == 'docx' || type == 'doc') {
			return <FastImage style={styles.resourceImage} source={require('@assets/docs.png')} />;
		} else if (type == 'pptx' || type == 'ppt') {
			return <FastImage style={styles.resourceImage} source={require('@assets/ppt.png')} />;
		}
	};

	return (
		<Pressable
			style={({ pressed }) => [
				{
					backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
				},
				styles.resourcesContainer
			]}
			onPress={props.onPress && props.onPress}>
			{image(props.data.file_extension)}
			<View style={{ paddingStart: 10, flex: 1 }}>
				<Text style={[exStyles.TopTabR14, { color: colors.primaryText, marginBottom: 4 }]}>{props.data.title}</Text>
				{/* <Text style={[exStyles.tabR11, { color: colors.secondaryText }]}>{props.data.title}</Text> */}
			</View>
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'transparent'
					},
					styles.onPressable
				]}
				onPress={() => {
					briefCased ? showAlert('document', props.data.id) : saveBriefCase('document', props.data.id);
				}}>
				<IonIcons
					name={briefCased ? 'briefcase' : 'md-briefcase-outline'}
					size={RFValue(20)}
					color={briefCased ? colors.primaryColor : '#7E8389'}
				/>
			</Pressable>
			<AlertModal
				visible={alertVisibility}
				type={resourceType}
				typeId={resourceTypeId}
				onYes={deleteBriefCase}
				onClose={() => {
					setAlertVisibility(false);
				}}
			/>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	resourcesContainer: {
		height: RFValue(88),
		paddingLeft: RFValue(16),
		paddingRight: RFValue(24),
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start'
	},
	resourceImage: {
		height: RFValue(88),
		width: RFValue(88),
		resizeMode: 'stretch',
		borderWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.2)',
		borderRadius: RFValue(10),
		overflow: 'hidden',
		justifyContent: 'center'
	},
	resourceTypeIcon: {
		alignSelf: 'center'
	},
	onPressable: { borderRadius: 4, padding: 4 }
});

export { ItemBoothResourceDocs, ItemBoothResourceVideos };
