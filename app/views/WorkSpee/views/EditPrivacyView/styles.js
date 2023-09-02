import { StyleSheet, Dimensions } from "react-native";

export default StyleSheet.create({
  headerContaier: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "500",
    color: "#424242",
    marginLeft: 30,
  },
  container: {
    backgroundColor: "#000000",
  },
  pageHeadingContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginTop: 10,
    marginBottom: 5,
    marginHorizontal: 10,
  },
  pageHeadingSeparator: {
    height: 1,
    backgroundColor: "#C7C7C7",
    marginTop: 20,
    opacity: 0.5,
  },
  headingText: {
    fontSize: 18,
    fontWeight: "600",
    fontStyle: "normal",
    color: "#000000",
  },
  privacyOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginVertical: 15,
  },
  privacyOptionText: {
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "normal",
    color: "#343435",
    marginLeft: 10,
  },
  iconStyle: {
    marginRight: 10,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: "#C7C7C7",
    marginLeft: 35,
    marginRight: 20,
    opacity: 0.5,
  },
});
