import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const jobsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  h1: {
    fontSize: 24,
    marginBottom: 20,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  jobs: {
    width: width * 0.95,
  },
  job: {
    padding: 10,
    backgroundColor: "#fff",
    margin: 5,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  h2: {
    fontSize: 18,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  modalHeader: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    // fontFamily: "FacultyGlyphic-Regular",
    borderBottomWidth: 1,
  },
  modal: {
    padding: 20,
    height: height * 0.7,
    position: "relative",
  },
  jobDetail: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  jobDetailText: {
    marginBottom: 10,
    fontSize: 13,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  jobData: {
    marginTop: 30,
    fontSize: 20,
    // fontFamily: "FacultyGlyphic-Regular",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
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
  picker: {
    width: width * 0.6,
    color: "#000",
  },
  jobDelete: {
    marginLeft: 10,
    position: "absolute",
    right: 30,
    top: 20,
  },
  deleteIcon: {
    color: "red",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: width * 0.95,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    position: "relative"
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    // fontFamily: "FacultyGlyphic-Regular",
  },
});

export default jobsStyles;
