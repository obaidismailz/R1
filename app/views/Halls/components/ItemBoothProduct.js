import React, { memo, useState, useImperativeHandle } from "react";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { colors, exStyles } from "@styles";
import FastImage from "@rocket.chat/react-native-fast-image";

const screenHeight = Dimensions.get("screen").height;
const screenWidth = Dimensions.get("screen").width;

const ItemBoothProduct = ({ ...props }, ref) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.productContainer}
      onPress={props.onPress && props.onPress}
    >
      <FastImage
        style={styles.productImage}
        source={{ uri: props.data.image }}
      />
      <Text numberOfLines={2} style={styles.productName}>
        {props.data.name}
      </Text>
      <Text style={styles.priceText}>Price</Text>
      <Text style={styles.price}>{"$" + props.data.price + "  "}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    width: screenWidth * 0.5,
  },
  productImage: {
    height: RFValue(150),
    width: RFValue(150),
    resizeMode: "stretch",
    borderRadius: RFValue(12),
    alignSelf: "center",
    overflow: "hidden",
    borderWidth: 0.25,
    borderColor: "rgba(0,0,0,0.2)",
  },
  offerText: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    textAlign: "center",
    backgroundColor: "#eb5757",
    textAlignVertical: "center",
    paddingVertical: 4,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  productName: {
    color: "#424242",
    fontSize: 12,
    alignSelf: "center",
    width: screenWidth * 0.4,
    fontWeight: "400",
    marginTop: 10,
  },
  priceText: {
    color: "#12121D",
    fontSize: 11,
    width: screenWidth * 0.4,
    alignSelf: "center",
    marginTop: 6,
    opacity: 0.3,
    fontWeight: "400",
  },
  price: {
    color: colors.primaryColor,
    fontSize: 14,
    fontWeight: "bold",
    width: screenWidth * 0.4,
    alignSelf: "center",
  },
  previousPrice: {
    color: "grey",
    fontSize: 14,
    textDecorationLine: "line-through",
  },
});

export default memo(ItemBoothProduct);
