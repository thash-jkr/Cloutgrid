import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const profileStyles = StyleSheet.create({
  profile: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    justifyContent: "center",
    height: height * 0.95,
  },
  h2 : {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  profileTop: {
    padding: 10,
    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.25,
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
    bottom: 20,
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
    fontSize: 16,
    fontWeight: "bold",
  },
  profileSocial: {
    backgroundColor: "#f0f0f0",
    width: width,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default profileStyles;
