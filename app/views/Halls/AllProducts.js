import React, { memo, useState } from 'react';

import {
	View,
	Text,
	FlatList,
	StyleSheet,
	SafeAreaView,
	Pressable
} from 'react-native';
import { Header } from '@components';
import { RFValue } from 'react-native-responsive-fontsize';
import { colors, exStyles } from '@styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { withTheme } from '../../theme';
import { withDimensions } from '../../dimensions';
import { themes } from '../../constants/colors';
import StatusBar from '../../containers/StatusBar';
import ItemBoothProduct from './components/ItemBoothProduct';

const AllProducts = ({ navigation, route, ...props }) => {
	const { theme } = props;

	const { productsList } = route.params;
	const { productCategories } = route.params;
	const [selectedProductId, setSelectedProductId] = useState(0);
	const [filterProductsList, setFilterProductsList] = useState(productsList);

	const filterProducts = (categoryId) => {
		setFilterProductsList(
			productsList.filter(data => data.category_id === categoryId)
		);
		setSelectedProductId(categoryId);
	};

	const renderProductCatList = () => (
		<FlatList
			contentContainerStyle={styles.contentContainerStyleCatrgories}
			horizontal
			ListHeaderComponent={(
				<Pressable
					style={[
						styles.itemCategories,
						{
							backgroundColor:
								selectedProductId == 0 ? colors.primaryColor : '#F2F2F2'
						}
					]}
					onPress={() => {
						setFilterProductsList(productsList);
						setSelectedProductId(0);
					}}
				>
					<Text
						numberOfLines={1}
						style={[
							exStyles.infoDetailR16,
							{
								color: selectedProductId == 0 ? 'white' : 'grey'
							}
						]}
					>
						All
					</Text>
				</Pressable>
			)}
			showsHorizontalScrollIndicator={false}
			data={productCategories}
			renderItem={({ item, index }) => (
				<Pressable
					style={[
						styles.itemCategories,
						{
							backgroundColor:
								selectedProductId == item.id ? colors.primaryColor : '#F2F2F2'
						}
					]}
					onPress={() => {
						filterProducts(item.id);
					}}
				>
					<Text
						numberOfLines={1}
						style={[
							styles.categoriesText,
							{
								color: selectedProductId == item.id ? 'white' : 'grey'
							}
						]}
					>
						{item.name}
					</Text>
				</Pressable>
			)}
		/>
	);

	const productSeparator = () => (
		<View
			style={{
				marginBottom: 32
			}}
		/>
	);
	const renderProuctsSecction = () => (
		<View style={{ backgroundColor: 'white' }}>
			<View style={styles.productSortContainer}>
				<Text style={[exStyles.infoLink14Med, { color: colors.primaryText }]}>
					{productsList.length}{' '}
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						Items
					</Text>
				</Text>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : '#ececec'
						},
						styles.onPressSortStyle
					]}
				>
					<MaterialIcons
						name='arrow-drop-down'
						size={RFValue(24)}
						color={colors.secondaryText}
					/>
				</Pressable>
			</View>

			{productCategories.length == 0 ? null : renderProductCatList()}

			<FlatList
				key='_'
				data={filterProductsList}
				numColumns={2}
				keyExtractor={item => item}
				contentContainerStyle={styles.productContainer}
				ItemSeparatorComponent={productSeparator}
				renderItem={({ item, index }) => (
					<ItemBoothProduct
						data={item}
						index={index}
						onPress={() => {
							navigation.navigate('BoothProductDetails', {
								data: item,
								onCallBack: (res, type) => {
									type == 0
										? (filterProductsList[index].bookmark = {
											id: res.id,
											type_id: res.type_id
										  })
										: (filterProductsList[index].bookmark = '');
									setFilterProductsList(filterProductsList);
								}
							});
						}}
					/>
				)}
			/>
		</View>
	);

	return (
		<>
			<SafeAreaView
				theme={theme}
				style={{ backgroundColor: themes[theme].headerBackground }}
			/>
			<StatusBar
				theme={theme}
				backgroundColor={themes[theme].headerBackground}
			/>
			<Header
				title='Products'
				theme={theme}
				onBackPress={() => {
					navigation.goBack();
				}}
				onChangeSearch={(txt) => {}}
				onNotificationPress={() => {}}
			/>
			{renderProuctsSecction()}
		</>
	);
};

const styles = StyleSheet.create({
	// Categories Type
	contentContainerStyleCatrgories: {
		alignItems: 'center',
		marginTop: RFValue(24),
		paddingVertical: 10,
		paddingLeft: RFValue(33)
	},
	itemCategories: {
		marginEnd: RFValue(15),
		paddingVertical: RFValue(4),
		height: RFValue(32),
		justifyContent: 'center',
		paddingHorizontal: RFValue(12),
		borderRadius: RFValue(10)
	},
	categoriesText: {
		fontSize: 16,
		maxWidth: RFValue(200)
	},
	// sorting Container
	productSortContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 12,
		backgroundColor: '#ececec',
		paddingHorizontal: 20,
		paddingVertical: 5,
		borderRadius: 3
	},
	productContainer: {
		alignItems: 'center',
		marginTop: 32,
		paddingBottom: 250
	},
	onPressSortStyle: { borderRadius: 20 }
});

export default withDimensions(withTheme(memo(AllProducts)));
