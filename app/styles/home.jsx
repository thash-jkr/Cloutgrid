import { StyleSheet } from "react-native";

const homeStyles = StyleSheet.create({
  home: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    flex: 1,
    justifyContent: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  logo: {
    fontSize: 50,
    color: "#000",
  },
  logoSide: {
    color: "#344e41",
  },
  h1: {
    fontSize: 40,
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
  bell: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  bars: {
    width: "100%",
  },
  bar: {
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  toggle: {
    margin: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleText: {
    fontSize: 10,
    marginRight: 10,
    marginLeft: 10,
  },
});

export default homeStyles;
