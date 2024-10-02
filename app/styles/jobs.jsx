import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const jobsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#E6E9E3",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  jobs: {
    width: width * 0.95,
  },
  job: {
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  jobImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  h2: {
    fontSize: 18,
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
  jobDetail: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  jobDetailText: {
    marginBottom: 10,
    fontSize: 13,
  },
  jobData: {
    marginTop: 30,
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  input: {
    width: width * 0.8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginBottom: 20,
    backgroundColor: "#ECEEEA",
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: width * 0.9,
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
});

export default jobsStyles;
