import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import axios from "axios";
let qs = require("qs");

const PostCommentField = (props) => {
  const [commentFieldText, setCommentFieldText] = useState("");
  const [sendButton, setSendButton] = useState(false);
  const [domain] = useState(props.domain);

  function submitComment() {
    postNewComment(commentFieldText);
    setCommentFieldText("");
  }

  postNewComment = async (text) => {
    let params = {
      post_id: props.item.id,
      text: text,
      user_id: props.currentUserId,
    };
    await axios({
      method: "post",
      url: domain + "register_comment",
      data: qs.stringify(params),
    })
      .then((response) => {})
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <View style={styles.showCommentFieldandAvatarContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri:
              "https://s-media-cache-ak0.pinimg.com/736x/43/cd/6e/43cd6e82491bf130d97624c198ee1a3f--funny-movie-quotes-funny-movies.jpg",
          }}
          style={styles.imageStyle}
        />
      </View>
      <View style={styles.commentfieldAndSmilyIcon}>
        <TextInput
          style={styles.inputfieldStyle}
          placeholder="Add comment..."
          placeholderTextColor="#707070"
          onSubmitEditing={() => Keyboard.dismiss()}
          onChangeText={(text) => {
            setCommentFieldText(text), setSendButton(true);
          }}
          value={commentFieldText}
        />
        {sendButton == true && commentFieldText != "" ? (
          <TouchableOpacity onPress={() => submitComment()}>
            <Icon
              style={styles.smilyIconStyle}
              name="location-arrow"
              color="#127BF1"
              size={16}
            ></Icon>
          </TouchableOpacity>
        ) : (
          <Icon
            style={styles.smilyIconStyle}
            name="smile-wink"
            color="#B8B8B8"
            size={16}
          ></Icon>
        )}
      </View>
    </View>
  );
};

export default PostCommentField;

const styles = StyleSheet.create({
  showCommentFieldandAvatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginLeft: 5,
    marginRight: 10,
    marginTop: 15,
    marginBottom: 11,
  },
  avatarContainer: {
    marginLeft: 17,
  },
  imageStyle: {
    height: 35,
    width: 35,
    alignItems: "center",
    borderRadius: 35 / 2,
  },
  commentfieldAndSmilyIcon: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 5,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  inputfieldStyle: {
    color: "#707070",
    fontStyle: "normal",
    fontSize: 10,
    fontWeight: "400",
    marginRight: 10,
    marginLeft: 10,
    width: 230,
  },
  smilyIconStyle: {
    marginRight: 10,
  },
});
