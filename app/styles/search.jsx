import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E6E9E3",
    alignItems: "center",
  },
  searchBar: {
    height: 50,
    width: width * 0.95,
    borderRadius: 25,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  searchResult: {
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    width: width * 0.95,
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
