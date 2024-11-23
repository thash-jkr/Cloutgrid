import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const homeStyles = StyleSheet.create({
  home: {
    alignItems: "center",
    // backgroundColor: "#ECEEEA",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    // backgroundColor: "#f0f0f0",
  },
  bell: {
    color: "green",
  },
  logoImage: {
    width: 40,
    height: 40,
    marginLeft: 20,
  },
  logo: {
    fontSize: 50,
    color: "#000",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Tinos-Bold",
  },
  logoSide: {
    color: "#344e41",
    fontFamily: "Tinos-Bold",
  },
  h1: {
    fontSize: 40,
    fontFamily: "FacultyGlyphic-Regular",
  },
  h2: {
    fontSize: 25,
    fontFamily: "Tinos-Bold",
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
    backgroundColor: "#DBE3D3",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    width: "90%",
  },
  toggle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  toggleText: {
    fontSize: 17,
    marginRight: 10,
    marginLeft: 10,
    fontFamily: "FacultyGlyphic-Regular",
  },
  postContainer: {
    marginTop: 10,
  },
  post: {
    width: width,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
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
    borderTopColor: "#000",
    borderTopWidth: 1,
  },
  postAuthor: {
    fontFamily: "FacultyGlyphic-Regular",
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
    fontFamily: "FacultyGlyphic-Regular",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postFooterTextBold: {
    fontFamily: "Tinos-Bold",
    fontSize: 17,
  },
  modalHeader: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontFamily: "FacultyGlyphic-Regular",
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
    fontFamily: "FacultyGlyphic-Regular",
  }
});

export default homeStyles;
