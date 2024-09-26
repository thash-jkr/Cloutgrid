import { StyleSheet } from "react-native";

const authStyles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#E6E9E3",
    flex: 1,
    justifyContent: "center",
  },
  loginContainer: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#E6E9E3",
  },
  card: {
    margin: 10,
    width: 300,
    height: 200,
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBE3D3",
    shadowColor: "rgba(50, 50, 93, 0.25)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  h1: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  loginButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 400,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginBottom: 20,
    backgroundColor: "#ECEEEA",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    marginBottom: 20,
    height: 30,
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
  },
});

export default authStyles;
