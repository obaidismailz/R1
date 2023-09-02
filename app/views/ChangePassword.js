import * as React from "react";
import { memo, useRef, useState, useEffect, useImperativeHandle } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  AuthInput,
  LoadingDialog,
  FormButton,
  PasswordInput,
} from "@components";
import axios from "axios";
import { RFValue } from "react-native-responsive-fontsize";
import { colors, exStyles } from "@styles";
import { WebView } from "react-native-webview";
import { CHANGE_PASSWORD } from "@utils/Constants";
import { ShareData } from "@utils";

const ChangePassword = ({ navigation, route }) => {
  const reffEmail = useRef(null);
  const reffPassword = useRef(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {}, []);

  const submit = async () => {
    setLoading(true);
    let params = {
      email: ShareData.getInstance().email,
      password: password,
      password_confirmation: confirmPassword,
      token: ShareData.getInstance().access_token,
    };
    axios({
      method: "POST",
      url: CHANGE_PASSWORD,
      data: params,
    })
      .then((response) => {
        setLoading(false);
        console.error(JSON.stringify(response.data));
        if (response.status === 200 || response.status === 600) {
          if (response.data._metadata.status === "SUCCESS") {
            alert(
              response.data._metadata.message +
                "\n\n" +
                response.data._metadata.errors[0]
            );
          } else {
            alert(
              response.data._metadata.message +
                "\n\n" +
                response.data._metadata.errors[0]
            );
          }
        } else {
          alert("Failed to reset password, Please try again later.");
        }
      })
      .catch((error) => {
        setLoading(false);
        alert("Failed to reset password, Please try again later" + error);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <StatusBar
        backgroundColor={colors.secondaryColor}
        backgroundColor={colors.white}
        barStyle={"dark-content"}
      />
      {/*  */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: RFValue(30),
        }}
      >
        <TouchableOpacity
          style={{
            paddingVertical: RFValue(5),
            paddingHorizontal: RFValue(5),
            position: "absolute",
            top: RFValue(10),
          }}
          onPress={() => navigation.goBack()}
        >
          <Image
            style={{
              height: 40,
              width: 40,
              resizeMode: "contain",
              transform: [{ rotate: "180deg" }],
            }}
            source={require("@assets/NextIcon.png")}
          />
        </TouchableOpacity>
        <Image
          style={styles.images}
          source={require("@assets/ResetPassword.png")}
        />
        <Text
          style={{
            color: colors.primaryColor,
            alignSelf: "center",
            fontSize: RFValue(25),
            textAlign: "center",
          }}
        >
          {"Reset Your\n Password?"}
        </Text>
        <Text
          style={{
            color: "grey",
            alignSelf: "center",
            fontSize: RFValue(14),
            marginTop: RFValue(5),
            marginBottom: RFValue(50),
            textAlign: "center",
          }}
        >
          {"Create your new password!"}
        </Text>

        <PasswordInput
          marginStyle={{ marginTop: RFValue(10), width: "100%" }}
          value={password}
          placeholder={"New Password"}
          autoCapitalize={"none"}
          keyboardType={"url"}
          onSubmitEditing={() => {}}
          onChangeText={(text) => {
            setPassword(text);
          }}
        />
        <PasswordInput
          // reff={reffPassword}
          marginStyle={{ marginTop: RFValue(10), width: "100%" }}
          value={confirmPassword}
          placeholder={"Confirm New Password"}
          autoCapitalize={"none"}
          keyboardType={"url"}
          onSubmitEditing={() => {}}
          onChangeText={(text) => {
            setConfirmPassword(text);
          }}
        />

        <FormButton
          title={"Send"}
          extraStyle={{ marginTop: RFValue(80) }}
          onPress={() => {
            submit();
          }}
        />
      </KeyboardAvoidingView>
      <LoadingDialog visible={loading} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  images: {
    height: RFValue(80),
    width: RFValue(80),
    marginBottom: RFValue(40),
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

export default memo(ChangePassword);
