import FastImage from '@rocket.chat/react-native-fast-image';
import React, { memo } from 'react';
import { FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import SectionHeader from './components/SectionHeader';

const ImageBanners = ({ navigation, lobbybanner, hasImages }) => (
	<>
		{hasImages ? <SectionHeader title='Selling partners' onPress={() => {}} pressable={false} /> : null}
		<FlatList
			style={{ marginTop: 16, paddingStart: 24, paddigEnd: 8 }}
			data={lobbybanner}
			horizontal
			contentContainerStyle={{ paddingEnd: 24 }}
			showsHorizontalScrollIndicator={false}
			renderItem={({ item }) =>
				item.mobile_image == '' ? null : (
					<TouchableOpacity
						activeOpacity={0.6}
						style={styles.shadowBox1}
						onPress={() =>
							item.link == ''
								? null
								: navigation.navigate('WebviewScreen', {
										title: item.link,
										link: item.link
								  })
						}>
						<FastImage
							resizeMode='contain'
							style={styles.bannerImage1}
							source={{
								uri: item.mobile_image
							}}
							parallaxFactor={0.5}
						/>
					</TouchableOpacity>
				)
			}
		/>
	</>
);

const styles = StyleSheet.create({
	bannerImage1: {
		height: 90,
		width: 120,
		justifyContent: 'center',
		borderRadius: 8
	},
	shadowBox1: {
		margin: 8,
		borderWidth: 1,
		borderColor: 'rgba(0,0,0,0.1)',
		borderRadius: 8
	}
});

export default memo(ImageBanners);
