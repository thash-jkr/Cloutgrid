import { StyleSheet } from "react-native";

const profileStyles = StyleSheet.create({
  profile: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    flex: 1,
    justifyContent: "center",
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
    flex: 1,
    justifyContent: "center",
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  profileData: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
  },
  profileCount: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  profileBio: {
    alignItems: "flex-start",
    justifyContent: "center",
    width: 400,
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
    marginBottom: 20,
    flexDirection: "row",
  },
  profileBottom: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#dddddd",
    flex: 3,
    justifyContent: "center",
    width: "100%",
  },
  profilePicture: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  footer : {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  }
});

export default profileStyles;
