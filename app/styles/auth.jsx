import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const authStyles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    padding: 20,
    alignItems: "center",
    width: width * 0.9,
  },
  card: {
    margin: 10,
    width: 300,
    height: 200,
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#CAF0F8",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  h1: {
    fontSize: 30,
    marginBottom: 20,
    // fontFamily: "Tinos-Bold",
  },
  h2: {
    fontSize: 25,
    marginBottom: 20,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  h3: {
    fontSize: 15,
    marginBottom: 20,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  loginButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  input: {
    width: width * 0.9,
    height: height * 0.06,
    padding: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    // fontFamily: "FacultyGlyphic-Regular",
  },
  inputText: {
    fontFamily: "Tinos-Italic",
    color: "#8e8e8e"
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContainer: {
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  picker: {
    width: width * 0.6,
    color: "#000",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  footerText: {
    color: "#000",
    marginRight: 5,
    // fontFamily: "FacultyGlyphic-Regular",
  },
});

export default authStyles;
