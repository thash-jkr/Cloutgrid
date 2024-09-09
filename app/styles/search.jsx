import { StyleSheet } from "react-native";

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  searchBar: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    marginTop: 40,
  },
  searchResult: {
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  searchImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  resultText: {
    marginLeft: 10,
    fontSize: 17,
  }
});

export default searchStyles;
