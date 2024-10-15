import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const homeStyles = StyleSheet.create({
  home: {
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
    height: height * 0.03,
    paddingHorizontal: 20,
  },
  bell: {
    color: "green",
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  logo: {
    fontSize: 50,
    color: "#000",
    fontFamily: "Rufina_700Bold",
  },
  logoSide: {
    color: "#344e41",
  },
  h1: {
    fontSize: 40,
  },
  h2: {
    fontSize: 25,
    fontFamily: "Rufina_400Regular",
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
    width: width * 0.5,
    height: width * 0.5,
    objectFit: "contain",
  },
  ccc: {
    textAlign: "center",
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
    position: "absolute",
    top: 50,
    left: 20,
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
  horizontalScroll: {
    padding: 20,
    height: height * 0.2,
    justifyContent: "flex-start",
  },
  scrollBlock: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginRight: 15,
    width: width * 0.9,
    justifyContent: "center",
    alignItems: "center",
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  horizontalScrollContent: {
    flexDirection: "row",
    marginVertical: 5,
  },
});

export default homeStyles;
