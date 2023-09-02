import React, { useState, memo } from 'react';
import {
	View, StyleSheet, Text, Pressable
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import OctIcons from 'react-native-vector-icons/Octicons';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors, exStyles } from '@styles';
import PostReactions from './PostReactions';
import Navigation from '../../../../../lib/Navigation';
import LikesDetailModal from '../../LikesDetailModal';

const PostLikeCommentShareButton = (props) => {
	const { reactions, comment_count } = props.item;

	const [visible, setVisible] = useState(false);

	const navigateToCommentsView = () => {
		Navigation.navigate('CommentsView', {
			postItem: props.item
		});
	};

	return (
		<>
			<View style={styles.cardFooter}>
				<Pressable
					style={styles.cardFooterReactionConntainer}
					onPress={() => setVisible(true)}
				>
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						{reactions.count == 0 ? '' : 'Like'}
					</Text>
					{reactions.count > 0 ? (
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'flex-start',
								alignItems: 'center',
								marginHorizontal: 8
							}}
						>
							{reactions.like > 0 ? (
								<FastImage
									source={require('../../../../../assets/Images/reactions/thumbsupfill.png')}
									style={{ width: 20, height: 20 }}
								/>
							) : null}
							{reactions.love > 0 ? (
								<FastImage
									source={require('../../../../../assets/Images/reactions/love2.png')}
									style={styles.reactionImages}
								/>
							) : null}
							{reactions.haha > 0 ? (
								<FastImage
									source={require('../../../../../assets/Images/reactions/haha2.png')}
									style={styles.reactionImages}
								/>
							) : null}

							{reactions.wow > 0 ? (
								<FastImage
									source={require('../../../../../assets/Images/reactions/wow2.png')}
									style={{ width: 20, height: 20 }}
								/>
							) : null}
							{reactions.sad > 0 ? (
								<FastImage
									source={require('../../../../../assets/Images/reactions/sad2.png')}
									style={styles.reactionImages}
								/>
							) : null}
							{reactions.angry > 0 ? (
								<FastImage
									source={require('../../../../../assets/Images/reactions/angry2.png')}
									style={styles.reactionImages}
								/>
							) : null}
						</View>
					) : null}
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						{reactions.count == 0 ? '' : reactions.count}
					</Text>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.onPressCommentContainer
					]}
					onPress={() => {
						navigateToCommentsView();
					}}
				>
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						{comment_count == 0 ? '' : `${ comment_count } comments`}
					</Text>
				</Pressable>
			</View>
			<View style={styles.separatorLine} />
			{/* Buttons */}
			<View style={styles.cardFooter2}>
				<PostReactions reactiontype='post' item={props.item} />
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.footerButtonContainer
					]}
					onPress={() => {
						navigateToCommentsView();
					}}
				>
					<OctIcons
						name='comment'
						size={16}
						style={styles.styleIcon}
						color={colors.secondaryText}
					/>
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						Comment
					</Text>
				</Pressable>
				<Pressable
					style={({ pressed }) => [
						{
							backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
						},
						styles.footerButtonContainer
					]}
					onPress={props.onClickShare}
				>
					<Icon
						name='share-alt'
						size={14}
						style={styles.styleIcon}
						color={colors.secondaryText}
					/>
					<Text
						style={[exStyles.infoLink14Med, { color: colors.secondaryText }]}
					>
						Share
					</Text>
				</Pressable>
			</View>
			<View
				style={{
					height: 6,
					backgroundColor: colors.secondaryText,
					opacity: 0.2
				}}
			/>
			{visible ? (
				<LikesDetailModal
					visible={visible}
					type='post'
					data={props.item.id}
					onClose={() => setVisible(false)}
				/>
			) : null}
		</>
	);
};

export default memo(PostLikeCommentShareButton);

const styles = StyleSheet.create({
	// Like comment share counter
	cardFooter: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingTop: 8,
		paddingBottom: 12
	},
	cardFooterReactionConntainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	reactionImages: {
		width: 20,
		height: 20
	},
	onPressCommentContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: 2,
		borderRadius: 4
	},

	styleIcon: {
		color: '#000000',
		paddingRight: 5
	},

	separatorLine: {
		width: '100%',
		alignSelf: 'center',
		height: 0.5,
		backgroundColor: '#000000',
		opacity: 0.2
	},

	// Like Comment Share Button

	cardFooter2: {
		paddingVertical: 8,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 32
	},

	footerButtonContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		padding: 4,
		borderRadius: 4
	},
	footerButtonText: {
		fontWeight: '500',
		fontStyle: 'normal',
		fontSize: 14,
		letterSpacing: 0.6,
		color: colors.secondaryText
	},
	styleIcon: {
		marginRight: 5
	}
});
