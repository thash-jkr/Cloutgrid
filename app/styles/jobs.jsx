import { StyleSheet } from "react-native";

const jobsStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  jobs: {
    width: "100%",
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
    height: 600,
  },
  jobDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobDetailText: {
    marginRight: 10,
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
  }
});

export default jobsStyles;
