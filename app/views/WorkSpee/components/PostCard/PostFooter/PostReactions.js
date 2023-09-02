import React, { useState, useRef, memo } from 'react';
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Animated,
	Pressable
} from 'react-native';
import FastImage from '@rocket.chat/react-native-fast-image';
import { colors } from '@styles';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { SOCIAL_SOCKET } from '../../../../../utils/Constants';
import {
	likeComment,
	likePost,
	likeReply
} from '../../../../../apis/LoopExpoApi';
import { exStyles } from '../../../../../styles';
import { commentReactionUpdate } from '../../../../../actions/social/comments';
import { postReactionUpdate } from '../../../../../actions/social/newsfeed';
import { replyReactionUpdate } from '../../../../../actions/social/reply';

const qs = require('qs');

const images = {
	like_gif: require('../../../../../assets/Images/reactions/like.gif'),
	like_static: require('../../../../../assets/Images/reactions/ic_like.png'),
	like_static_fill: require('../../../../../assets/Images/reactions/thumbsupfill.png'),
	love_gif: require('../../../../../assets/Images/reactions/love.gif'),
	love_static: require('../../../../../assets/Images/reactions/love2.png'),
	haha_gif: require('../../../../../assets/Images/reactions/haha.gif'),
	haha_static: require('../../../../../assets/Images/reactions/haha2.png'),
	wow_gif: require('../../../../../assets/Images/reactions/wow.gif'),
	wow_static: require('../../../../../assets/Images/reactions/wow2.png'),
	sad_gif: require('../../../../../assets/Images/reactions/sad.gif'),
	sad_static: require('../../../../../assets/Images/reactions/sad2.png'),
	angry_gif: require('../../../../../assets/Images/reactions/angry.gif'),
	angry_static: require('../../../../../assets/Images/reactions/angry2.png')
};

const PostReactions = ({ ...props }) => {
	const { item } = props;
	const [reactionType, setReactionType] = useState(item.reactions.type);

	const [currentSpeed] = useState(1);

	const [isLongTouch, setIsLongTouch] = useState(false);
	const [isLiked, setIsLiked] = useState(item.reactions.is_reacted);
	const [whichIconUserChoose, setWhichIconUserChoose] = useState(0);
	const [currentIconFocus, setCurrentIconFocus] = useState(0);
	const [previousIconFocus, setPreviousIconFocus] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [isDraggingOutside, setIsDraggingOutside] = useState(false);
	const [isJustDragInside, setIsJustDragInside] = useState(true);
	// Duration animation
	const durationAnimationBox = 500;
	const durationAnimationQuickTouch = 500;
	const durationAnimationLongTouch = 150;
	const durationAnimationIconWhenDrag = 150;
	const durationAnimationIconWhenRelease = 1000;

	// ------------------------------------------------------------------------------
	// Animation button when quick touch button
	const tiltIconAnim = useRef(new Animated.Value(0)).current;
	const zoomIconAnim = useRef(new Animated.Value(0)).current;
	const zoomTextAnim = useRef(new Animated.Value(0)).current;

	// ------------------------------------------------------------------------------
	// Animation when button long touch button
	const tiltIconAnim2 = useRef(new Animated.Value(0)).current;
	const zoomIconAnim2 = useRef(new Animated.Value(0)).current;
	const zoomTextAnim2 = useRef(new Animated.Value(0)).current;
	// Animation of the box
	const fadeBoxAnim = useRef(new Animated.Value(0)).current;

	// Animation for emoticons
	const moveRightGroupIcon = useRef(new Animated.Value(10)).current;
	// Like
	const pushIconLikeUp = useRef(new Animated.Value(0)).current;
	// I don't know why, but when I set to 0.0, it seem blink,
	// so temp solution is set to 0.01
	const zoomIconLike = useRef(new Animated.Value(0.01)).current;
	// Love
	const pushIconLoveUp = useRef(new Animated.Value(0)).current;
	const zoomIconLove = useRef(new Animated.Value(0.01)).current;
	// Haha
	const pushIconHahaUp = useRef(new Animated.Value(0)).current;
	const zoomIconHaha = useRef(new Animated.Value(0.01)).current;
	// Wow
	const pushIconWowUp = useRef(new Animated.Value(0)).current;
	const zoomIconWow = useRef(new Animated.Value(0.01)).current;
	// Sad
	const pushIconSadUp = useRef(new Animated.Value(0)).current;
	const zoomIconSad = useRef(new Animated.Value(0.01)).current;
	// Angry
	const pushIconAngryUp = useRef(new Animated.Value(0)).current;
	const zoomIconAngry = useRef(new Animated.Value(0.01)).current;

	// ------------------------------------------------------------------------------
	// Animation for zoom emoticons when drag
	const zoomIconChosen = useRef(new Animated.Value(1)).current;
	const zoomIconNotChosen = useRef(new Animated.Value(1)).current;
	const zoomIconWhenDragOutside = useRef(new Animated.Value(1)).current;
	const zoomIconWhenDragInside = useRef(new Animated.Value(1)).current;
	const zoomBoxWhenDragInside = useRef(new Animated.Value(1)).current;
	const zoomBoxWhenDragOutside = useRef(new Animated.Value(0.95)).current;

	// Animation for text description at top icon
	const pushTextDescriptionUp = useRef(new Animated.Value(60)).current;
	const zoomTextDescription = useRef(new Animated.Value(1)).current;

	const dispatch = useDispatch();

	// for reactions
	onReactions = () => {
		setIsLongTouch(true);
		doAnimationLongTouch();
	};

	// for simple like and quick touch
	onLike = () => {
		if (isLongTouch) {
			setIsLongTouch(false);
		} else if (isLiked) {
			setIsLiked(false);
			setWhichIconUserChoose(0);
			postReaction(0);
		} else if (!isLiked) {
			setIsLiked(true);
			setWhichIconUserChoose(1);
			doAnimationQuickTouch();
			postReaction(1);
		}
	};

	const socket = io(SOCIAL_SOCKET, {
		transports: ['websocket'],
		rejectUnauthorized: false,
		autoConnect: true
	});

	// post, comment & reply like API call
	async function postReaction(type) {
		updateReactionButtonState(type);
		props.reactiontype == 'post'
			? likePost(item.id, type).then((response) => {
				dispatch(
					postReactionUpdate(
						response.records.post_id,
						response.records.reactions
					)
				);
				socket.emit('new_post_reaction', { post_id: item.id });
			  })
			: props.reactiontype == 'comments'
				? likeComment(item.id, type).then((response) => {
					dispatch(
						commentReactionUpdate(response.comment_id, response.reactions)
					);
					socket.emit('new_comment_reaction', { comment_id: item.id });
			  })
				: likeReply(item.id, type).then((response) => {
					console.error(response);
					dispatch(
						replyReactionUpdate(
							response.reply_id,
							response.comment_id,
							response.reactions
						)
					);
			  });
	}

	// updating reaction type state
	function updateReactionButtonState(type) {
		if (type == 1) {
			setReactionType('like');
		} else if (type == 2) {
			setReactionType('love');
		} else if (type == 3) {
			setReactionType('haha');
		} else if (type == 4) {
			setReactionType('wow');
		} else if (type == 5) {
			setReactionType('sad');
		} else if (type == 6) {
			setReactionType('angry');
		} else if (type == 0) {
			setReactionType('');
		}
	}

	// Animation button when quick touch button
	const doAnimationQuickTouch = () => {
		if (!isLiked) {
			setIsLiked(true);
			tiltIconAnim.setValue(0);
			zoomIconAnim.setValue(0);
			zoomTextAnim.setValue(0);

			Animated.parallel([
				Animated.timing(tiltIconAnim, {
					toValue: 1,
					duration: durationAnimationQuickTouch * currentSpeed,
					useNativeDriver: true
				}),
				Animated.timing(zoomIconAnim, {
					toValue: 1,
					duration: durationAnimationQuickTouch * currentSpeed,
					useNativeDriver: true
				}),
				Animated.timing(zoomTextAnim, {
					toValue: 1,
					duration: durationAnimationQuickTouch * currentSpeed,
					useNativeDriver: true
				})
			]).start();
		} else {
			setIsLiked(false);
			tiltIconAnim.setValue(1);
			zoomIconAnim.setValue(1);
			zoomTextAnim.setValue(1);
			Animated.parallel([
				Animated.timing(tiltIconAnim, {
					toValue: 0,
					duration: durationAnimationQuickTouch * currentSpeed,
					useNativeDriver: true
				}),
				Animated.timing(zoomIconAnim, {
					toValue: 0,
					duration: durationAnimationQuickTouch * currentSpeed,
					useNativeDriver: true
				}),
				Animated.timing(zoomTextAnim, {
					toValue: 0,
					duration: durationAnimationQuickTouch * currentSpeed,
					useNativeDriver: true
				})
			]).start();
		}
	};

	const doAnimationLongTouch = () => {
		// setIsLongTouch(true);
		tiltIconAnim2.setValue(0);
		zoomIconAnim2.setValue(1);
		zoomTextAnim2.setValue(1);

		fadeBoxAnim.setValue(0);

		moveRightGroupIcon.setValue(10);

		pushIconLikeUp.setValue(0);
		zoomIconLike.setValue(0.01);

		pushIconLoveUp.setValue(0);
		zoomIconLove.setValue(0.01);

		pushIconHahaUp.setValue(0);
		zoomIconHaha.setValue(0.01);

		pushIconWowUp.setValue(0);
		zoomIconWow.setValue(0.01);

		pushIconSadUp.setValue(0);
		zoomIconSad.setValue(0.01);

		pushIconAngryUp.setValue(0);
		zoomIconAngry.setValue(0.01);

		Animated.parallel([
			// Button
			Animated.timing(tiltIconAnim2, {
				toValue: 1,
				duration: durationAnimationLongTouch * currentSpeed,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconAnim2, {
				toValue: 0.8,
				duration: durationAnimationLongTouch * currentSpeed,
				useNativeDriver: true
			}),
			Animated.timing(zoomTextAnim2, {
				toValue: 0.8,
				duration: durationAnimationLongTouch * currentSpeed,
				useNativeDriver: true
			}),

			// Box
			Animated.timing(fadeBoxAnim, {
				toValue: 1,
				duration: durationAnimationBox * currentSpeed,
				delay: 350,
				useNativeDriver: true
			}),

			// Group emoticon
			Animated.timing(moveRightGroupIcon, {
				toValue: 20,
				duration: durationAnimationBox * currentSpeed,
				useNativeDriver: true
			}),

			Animated.timing(pushIconLikeUp, {
				toValue: 25,
				duration: 250 * currentSpeed,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconLike, {
				toValue: 1,
				duration: 250 * currentSpeed,
				useNativeDriver: true
			}),

			Animated.timing(pushIconLoveUp, {
				toValue: 25,
				duration: 250 * currentSpeed,
				delay: 50,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconLove, {
				toValue: 1,
				duration: 250 * currentSpeed,
				delay: 50,
				useNativeDriver: true
			}),

			Animated.timing(pushIconHahaUp, {
				toValue: 25,
				duration: 250 * currentSpeed,
				delay: 100,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconHaha, {
				toValue: 1,
				duration: 250 * currentSpeed,
				delay: 100,
				useNativeDriver: true
			}),

			Animated.timing(pushIconWowUp, {
				toValue: 25,
				duration: 250 * currentSpeed,
				delay: 150,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconWow, {
				toValue: 1,
				duration: 250 * currentSpeed,
				delay: 150,
				useNativeDriver: true
			}),

			Animated.timing(pushIconSadUp, {
				toValue: 25,
				duration: 250 * currentSpeed,
				delay: 200,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconSad, {
				toValue: 1,
				duration: 250 * currentSpeed,
				delay: 200,
				useNativeDriver: true
			}),

			Animated.timing(pushIconAngryUp, {
				toValue: 25,
				duration: 250 * currentSpeed,
				delay: 250,
				useNativeDriver: true
			}),
			Animated.timing(zoomIconAngry, {
				toValue: 1,
				duration: 250 * currentSpeed,
				delay: 250,
				useNativeDriver: true
			})
		]).start();
	};

	const renderButton = () => {
		const tiltBounceIconAnim = tiltIconAnim.interpolate({
			inputRange: [0, 0.2, 0.8, 1],
			outputRange: ['0deg', '20deg', '-15deg', '0deg']
		});
		const zoomBounceIconAnim = zoomIconAnim.interpolate({
			inputRange: [0, 0.2, 0.8, 1],
			outputRange: [1, 0.8, 1.15, 1]
		});
		const zoomBounceTextAnim = zoomIconAnim.interpolate({
			inputRange: [0, 0.2, 0.8, 1],
			outputRange: [1, 0.8, 1.15, 1]
		});

		const tiltBounceIconAnim2 = tiltIconAnim2.interpolate({
			inputRange: [0, 1],
			outputRange: ['0deg', '20deg']
		});

		return (
			<Pressable
				style={({ pressed }) => [
					{
						backgroundColor: pressed ? 'rgba(0, 0, 0, 0.06)' : 'white'
					},
					styles.viewBtn
				]}
				onPress={onLike}
				onLongPress={onReactions}
			>
				{props.iconVisible == false ? null : (
					<Animated.Image
						source={getIconBtn(reactionType)}
						style={[
							styles.imgLikeInBtn,
							{
								transform: [
									{
										rotate: isLongTouch
											? tiltBounceIconAnim2
											: tiltBounceIconAnim
									},
									{ scale: isLongTouch ? zoomIconAnim2 : zoomBounceIconAnim }
								]
							}
						]}
					/>
				)}

				<Animated.Text
					style={[
						exStyles.infoLink14Med,
						{ color: getColorTextBtn(reactionType) },
						{
							transform: [
								{
									scale: isLongTouch ? zoomTextAnim2 : zoomBounceTextAnim
								}
							]
						}
					]}
				>
					{getTextBtn(reactionType)}
				</Animated.Text>
			</Pressable>
		);
	};

	const getColorTextBtn = (type) => {
		if (type == 'like' || whichIconUserChoose == 1) {
			return '#3b5998';
		} else if (type == 'love' || whichIconUserChoose == 2) {
			return '#ED5167';
		} else if (
			type == 'haha'
			|| type == 'wow'
			|| type == 'sad'
			|| whichIconUserChoose == 3
			|| whichIconUserChoose == 4
			|| whichIconUserChoose == 5
		) {
			return '#FFD96A';
		} else if (type == 'angry' || whichIconUserChoose == 6) {
			return '#F6876B';
		} else if (type == '' || whichIconUserChoose == 0) {
			return colors.secondaryText;
		}
	};

	const getIconBtn = (type) => {
		if (type == 'like' || whichIconUserChoose == 1) {
			return images.like_static_fill;
		} else if (type == 'love' || whichIconUserChoose == 2) {
			return images.love_static;
		} else if (type == 'haha' || whichIconUserChoose == 3) {
			return images.haha_static;
		} else if (type == 'wow' || whichIconUserChoose == 4) {
			return images.wow_static;
		} else if (type == 'sad' || whichIconUserChoose == 5) {
			return images.sad_static;
		} else if (type == 'angry' || whichIconUserChoose == 6) {
			return images.angry_static;
		} else if (type == '' || whichIconUserChoose == 0) {
			return images.like_static;
		}
	};

	const getTextBtn = (type) => {
		if (type == 'like' || whichIconUserChoose == 1) {
			return 'Like';
		} else if (type == 'love' || whichIconUserChoose == 2) {
			return 'Love';
		} else if (type == 'haha' || whichIconUserChoose == 3) {
			return 'Haha';
		} else if (type == 'wow' || whichIconUserChoose == 4) {
			return 'Wow';
		} else if (type == 'sad' || whichIconUserChoose == 5) {
			return 'Sad';
		} else if (type == 'angry' || whichIconUserChoose == 6) {
			return 'Angry';
		} else if (type == '' || whichIconUserChoose == 0) {
			return 'Like';
		}
	};

	const renderGroupIcon = () => (isLongTouch ? (
		<Animated.View
			style={[
				styles.viewWrapGroupIcon,
				{
					left: props.panPosition
						? -100
						: props.reactiontype == 'reply'
							? -140
							: 10
				}
			]}
		>
			{/* Icon Like */}
			<TouchableOpacity
				style={styles.viewWrapIcon}
				onPress={() => {
					setWhichIconUserChoose(1);
					setIsLongTouch(false);
					setIsLiked(true);
					postReaction(1);
				}}
			>
				{currentIconFocus === 1 ? (
					<Animated.View
						style={[
							styles.viewWrapTextDescription,
							{
								bottom: pushTextDescriptionUp,
								transform: [{ scale: zoomTextDescription }]
							}
						]}
					>
						<Text style={styles.textDescription}>Like</Text>
					</Animated.View>
				) : null}
				<Animated.View
					style={{
						// marginBottom: pushIconLikeUp,
						transform: [
							{
								scale: isDragging
									? currentIconFocus === 1
										? zoomIconChosen
										: previousIconFocus === 1
											? zoomIconNotChosen
											: isJustDragInside
												? zoomIconWhenDragInside
												: 0.8
									: isDraggingOutside
										? zoomIconWhenDragOutside
										: zoomIconLike
							}
						]
					}}
				>
					<FastImage style={styles.imgIcon} source={images.like_gif} />
				</Animated.View>
			</TouchableOpacity>

			{/* Icon Love */}
			<TouchableOpacity
				style={styles.viewWrapIcon}
				onPress={() => {
					setWhichIconUserChoose(2);
					setIsLongTouch(false);
					setIsLiked(true);
					postReaction(2);
				}}
			>
				{currentIconFocus === 2 ? (
					<Animated.View
						style={[
							styles.viewWrapTextDescription,
							{
								bottom: pushTextDescriptionUp,
								transform: [{ scale: zoomTextDescription }]
							}
						]}
					>
						<Text style={styles.textDescription}>Love</Text>
					</Animated.View>
				) : null}
				<Animated.View
					style={{
						// marginBottom: pushIconLoveUp,
						transform: [
							{
								scale: isDragging
									? currentIconFocus === 2
										? zoomIconChosen
										: previousIconFocus === 2
											? zoomIconNotChosen
											: isJustDragInside
												? zoomIconWhenDragInside
												: 0.8
									: isDraggingOutside
										? zoomIconWhenDragOutside
										: zoomIconLove
							}
						]
					}}
				>
					<FastImage style={styles.imgIcon} source={images.love_gif} />
				</Animated.View>
			</TouchableOpacity>

			{/* Icon haha */}
			<TouchableOpacity
				style={styles.viewWrapIcon}
				onPress={() => {
					setWhichIconUserChoose(3);
					setIsLongTouch(false);
					setIsLiked(true);
					postReaction(3);
				}}
			>
				{currentIconFocus === 3 ? (
					<Animated.View
						style={[
							styles.viewWrapTextDescription,
							{
								bottom: tpushTextDescriptionUp,
								transform: [{ scale: zoomTextDescription }]
							}
						]}
					>
						<Text style={styles.textDescription}>Haha</Text>
					</Animated.View>
				) : null}
				<Animated.View
					style={{
						// marginBottom: pushIconHahaUp,
						transform: [
							{
								scale: isDragging
									? currentIconFocus === 3
										? zoomIconChosen
										: previousIconFocus === 3
											? zoomIconNotChosen
											: isJustDragInside
												? zoomIconWhenDragInside
												: 0.8
									: isDraggingOutside
										? zoomIconWhenDragOutside
										: zoomIconHaha
							}
						]
					}}
				>
					<FastImage style={styles.imgIcon} source={images.haha_gif} />
				</Animated.View>
			</TouchableOpacity>

			{/* Icon wow */}
			<TouchableOpacity
				style={styles.viewWrapIcon}
				onPress={() => {
					setWhichIconUserChoose(4);
					setIsLongTouch(false);
					setIsLiked(true);
					postReaction(4);
				}}
			>
				{currentIconFocus === 4 ? (
					<Animated.View
						style={[
							styles.viewWrapTextDescription,
							{
								bottom: pushTextDescriptionUp,
								transform: [{ scale: zoomTextDescription }]
							}
						]}
					>
						<Text style={styles.textDescription}>Wow</Text>
					</Animated.View>
				) : null}
				<Animated.View
					style={{
						// marginBottom: pushIconWowUp,
						transform: [
							{
								scale: isDragging
									? currentIconFocus === 4
										? zoomIconChosen
										: previousIconFocus === 4
											? zoomIconNotChosen
											: isJustDragInside
												? zoomIconWhenDragInside
												: 0.8
									: isDraggingOutside
										? zoomIconWhenDragOutside
										: zoomIconWow
							}
						]
					}}
				>
					<FastImage style={styles.imgIcon} source={images.wow_gif} />
				</Animated.View>
			</TouchableOpacity>

			{/* Icon sad */}
			<TouchableOpacity
				style={styles.viewWrapIcon}
				onPress={() => {
					setWhichIconUserChoose(5);
					setIsLongTouch(false);
					setIsLiked(true);
					postReaction(5);
				}}
			>
				{currentIconFocus === 5 ? (
					<Animated.View
						style={[
							styles.viewWrapTextDescription,
							{
								bottom: pushTextDescriptionUp,
								transform: [{ scale: zoomTextDescription }]
							}
						]}
					>
						<Text style={styles.textDescription}>Sad</Text>
					</Animated.View>
				) : null}
				<Animated.View
					style={{
						// marginBottom: pushIconSadUp,
						transform: [
							{
								scale: isDragging
									? currentIconFocus === 5
										? zoomIconChosen
										: previousIconFocus === 5
											? zoomIconNotChosen
											: isJustDragInside
												? zoomIconWhenDragInside
												: 0.8
									: isDraggingOutside
										? zoomIconWhenDragOutside
										: zoomIconSad
							}
						]
					}}
				>
					<FastImage style={styles.imgIcon} source={images.sad_gif} />
				</Animated.View>
			</TouchableOpacity>

			{/* Icon angry */}
			<TouchableOpacity
				style={styles.viewWrapIcon}
				onPress={() => {
					setWhichIconUserChoose(6);
					setIsLongTouch(false);
					setIsLiked(true);
					postReaction(6);
				}}
			>
				{currentIconFocus === 6 ? (
					<Animated.View
						style={[
							styles.viewWrapTextDescription,
							{
								bottom: pushTextDescriptionUp,
								transform: [{ scale: zoomTextDescription }]
							}
						]}
					>
						<Text style={styles.textDescription}>Angry</Text>
					</Animated.View>
				) : null}
				<Animated.View
					style={{
						// marginBottom: pushIconAngryUp,
						transform: [
							{
								scale: isDragging
									? currentIconFocus === 6
										? zoomIconChosen
										: previousIconFocus === 6
											? zoomIconNotChosen
											: isJustDragInside
												? zoomIconWhenDragInside
												: 0.8
									: isDraggingOutside
										? zoomIconWhenDragOutside
										: zoomIconAngry
							}
						]
					}}
				>
					<FastImage style={styles.imgIcon} source={images.angry_gif} />
				</Animated.View>
			</TouchableOpacity>
		</Animated.View>
	) : null);

	return (
		<View>
			{isLongTouch ? (
				<Animated.View
					style={[
						styles.animatedViewBox,
						{
							opacity: fadeBoxAnim,
							left: props.panPosition
								? -100
								: props.reactiontype == 'reply'
									? -140
									: 10,
							transform: [
								{
									scale: isDragging
										? previousIconFocus === 0
											? zoomBoxWhenDragInside
											: 0.95
										: isDraggingOutside
											? zoomBoxWhenDragOutside
											: 1.0
								}
							]
						}
					]}
				/>
			) : null}
			{renderGroupIcon()}
			{renderButton()}
		</View>
	);
};

export default memo(PostReactions);

const styles = StyleSheet.create({
	// animatedView container
	animatedViewBox: {
		borderRadius: 30,
		width: 320,
		height: 50,
		marginLeft: 5,
		bottom: 50,
		position: 'absolute',
		// Has to set color for elevation
		backgroundColor: 'white',
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 5 },
		shadowOpacity: 0.2,
		shadowRadius: 2
		// elevation: 6,
	},

	// Button like
	viewBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 4,
		borderRadius: 4
	},
	textBtn: {
		color: 'grey',
		fontWeight: '500',
		fontStyle: 'normal',
		fontSize: 14,
		lineHeight: 20,
		letterSpacing: 0.6
	},
	imgLikeInBtn: {
		width: 16,
		height: 16,
		marginRight: 5,
		color: colors.secondaryText
	},
	// Group icon
	viewWrapGroupIcon: {
		flexDirection: 'row',
		width: 320,
		position: 'absolute',
		bottom: 55,
		alignItems: 'flex-end',
		justifyContent: 'space-around',
		paddingLeft: 5,
		paddingRight: 5
	},
	viewWrapIcon: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	imgIcon: {
		width: 36,
		height: 36
	},
	viewWrapTextDescription: {
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 10,
		paddingLeft: 7,
		paddingRight: 7,
		paddingTop: 2,
		paddingBottom: 2,
		position: 'absolute'
	},
	textDescription: {
		color: 'black',
		fontSize: 14
	},

	// Group jump icon
	viewWrapGroupJumpIcon: {
		flexDirection: 'row',
		width: 330,
		height: 140,
		borderWidth: 1,
		borderColor: 'green',
		marginTop: 30,
		marginLeft: 10,
		position: 'absolute',
		alignItems: 'flex-end'
	},

	buttonContainer: {
		position: 'absolute',
		top: 200,
		left: 50,
		alignSelf: 'center',
		alignContent: 'center',
		justifyContent: 'center',
		width: 60,
		borderColor: '#000000',
		borderWidth: 1
	},
	textStyle: {
		color: '#000000'
	},

	footerButtonText: {
		fontWeight: '500',
		fontStyle: 'normal',
		fontSize: 14
	}
});
