import * as React from "react";
import { memo, useRef, useState, useEffect, useImperativeHandle } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { AuthInput, Header, ActivityIndicator } from "@components";
import { RFValue } from "react-native-responsive-fontsize";
import { colors, exStyles } from "@styles";
import { WebView } from "react-native-webview";

const LiveWebinar = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {}, []);

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.secondaryColor }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
        <StatusBar
          backgroundColor={colors.secondaryColor}
          barStyle={"light-content"}
        />
        <Header
          title={route.params.header !== undefined ? route.params.header : ""}
          theme={"light"}
          onBackPress={() => {
            navigation.goBack();
          }}
        />
        <WebView
          source={{ uri: route.params.link }}
          onLoadEnd={() => setLoading(false)}
        />
        {/* {loading && <ActivityIndicator />} */}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  images: {
    height: RFValue(250),
    width: RFValue(250),
    marginTop: RFValue(-60),
    alignSelf: "center",
    resizeMode: "contain",
  },

  textInput: {
    flex: 1,
    paddingVertical: 15,
    paddingStart: 15,
    fontSize: RFValue(16),
    color: "#48a9ee",
  },

  heading: {
    alignSelf: "center",
    color: "red",
    fontSize: RFValue(22),
    marginTop: RFValue(20),
    fontWeight: "bold",
  },
});

export default memo(LiveWebinar);
