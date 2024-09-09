import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  home: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    flex: 1,
    justifyContent: "center",
  },
  logo: {
    fontSize: 50,
    color: "#000",
  },
  logoSide: {
    color: "#344e41",
  },
  h2: {
    fontSize: 30,
  },
  split: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  p: {
    marginTop: 10,
    marginBottom: 10,
    textAlign: "justify",
    fontSize: 17,
  },
  kid: {
    width: 300,
    height: 300,
    objectFit: "cover"
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
    position: "absolute",
    top: 50,
    left: 20,
  },
});

export default homeStyles;
