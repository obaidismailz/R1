// import NetInfo from "@react-native-community/netinfo";
import {
  NO_INTERNET_TITLE,
  NO_INTERNET_MESSAGE,
} from "@utils/Constants";
import { showErrorAlert, showConfirmationAlert } from "@utils/info";

export const checkInternet = new Promise((resolve, reject) => {
  // NetInfo.fetch().then((state) => {
  //   if (state.isConnected) resolve();
  //   else reject();
  // });
  resolve();
});

export const noInternetAlert = (obj) => {
  showConfirmationAlert({
    title: NO_INTERNET_TITLE,
    message: NO_INTERNET_MESSAGE,
    confirmationText: "Retry",
    dismissText: "Cancel",
    onCancel: () => {},
    // onPress: async () => {},
    ...obj,
  });
};
