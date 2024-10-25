import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const homeStyles = StyleSheet.create({
  home: {
    alignItems: "center",
    backgroundColor: "#ECEEEA",
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
  post: {
    width: width,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBlockColor: "#000",
    borderBottomWidth: 1,
  },
  profilePicture: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
  postImage: {
    width: width,
    height: height * 0.4,
  },
  postFooter: {
    borderTopColor: "#000",
    borderTopWidth: 1,
  },
  postFooterIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  postFooterText: {
    padding: 10,
  },
  postFooterTextBold: {
    fontWeight: "bold",
  },
  modalHeader: {
    padding: 15,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modal: {
    padding: 20,
    height: height * 0.7,
    position: "relative",
  },
  comment: {
    padding: 10,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
  },
  commentAuthor: {
    fontWeight: "bold",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    padding: 10,
  },
  commentInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    marginRight: 10,
  }
});

export default homeStyles;
