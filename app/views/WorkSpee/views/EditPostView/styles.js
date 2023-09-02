import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  container: {
    backgroundColor: "#000000",
  },
  separatorLine: {
    width: "100%",
    alignSelf: "center",
    height: 1.5,
    backgroundColor: "#C7C7C7",
    opacity: 0.5,
  },

  //Comment Field
  showCommentFieldBottom: {
    position: "relative",
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    marginBottom: 10,
    backgroundColor: "#ffffff",
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
    fontSize: 16,
    fontWeight: "400",
    marginRight: 10,
    marginLeft: 10,
    flex: 1,
    textAlignVertical: "top",
  },
  smilyIconStyle: {
    color: "#B8B8B8",
    marginRight: 10,
  },
});
