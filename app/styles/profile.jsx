import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const profileStyles = StyleSheet.create({
  profile: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    justifyContent: "center",
    height: height * 0.95,
  },
  h1 : {
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  h2 : {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  profileTop: {
    padding: 10,
    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.25,
    marginTop: Platform.OS === "ios" ? height * 0.1 : 0,
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.9,
  },
  profileData: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.6,
  },
  profileCount: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBio: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: width * 0.9,
    marginTop: 20,
  },
  profileArea: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    padding: 5,
    backgroundColor: "#DBE3D3",
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  button: {
    flexDirection: "row",
  },
  profileBottom: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: width,
    height: height * 0.7,
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  footer : {
    position: 'absolute',
    bottom: Platform.OS == "ios" ? 40 : 20,
    width: '100%',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 0.95 * width,
    height: 0.6 * height,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.9,
    margin: 10,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#f0f0f0",
    color: "#000",
  },
  tabText: {
    fontSize: width * 0.03,
    fontWeight: "bold",
  },
  profileSocial: {
    width: width,
    height: Platform.OS == "ios" ? height * 0.55 : height * 0.65,
    alignItems: "center",
    justifyContent: "center",
  },
  settings: {
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    justifyContent: "flex-start",
    height: height * 0.95,
  },
  settingsButtons: {
    marginTop: 20,
    width: width * 0.9,
  },
});

export default profileStyles;
