import React from "react";
import {
  ActivityIndicator as RNActivityIndicator,
  StyleSheet,
  Modal,
  View,
} from "react-native";
import { PropTypes } from "prop-types";
import { themes } from "../constants/colors";

const ActivityIndicator = ({ theme, absolute, ...props }) => (
  <Modal
    transparent={true}
    animationType="fade"
    backdropColor={"black"}
    backdropOpacity={0.5}
    onRequestClose={() => {
      console.log("Modal has been closed.");
    }}
    {...props}
  >
    <View style={styles.modalStyle}>
      <RNActivityIndicator
        style={[styles.indicator, absolute && styles.absolute]}
        color={themes[theme].auxiliaryText}
        {...props}
      />
    </View>
  </Modal>
);

ActivityIndicator.propTypes = {
  theme: PropTypes.string,
  absolute: PropTypes.bool,
  props: PropTypes.object,
};

ActivityIndicator.defaultProps = {
  theme: "light",
};

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: "#fff",
    alignSelf: "center",
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0)",
    width: "100%",
    height: "100%",
  },
  layoutStyle: {
    backgroundColor: "#fff",
    alignSelf: "center",
    alignItems: "center",
    paddingLeft: 20,
    margin: 0,
    justifyContent: "center",
    flexDirection: "row",
    width: "80%",
    height: 80,
    borderRadius: 8,
  },
  indicator: {
    padding: 16,
    flex: 1,
  },
  absolute: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ActivityIndicator;
