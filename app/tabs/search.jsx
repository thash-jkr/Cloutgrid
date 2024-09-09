import React, { useState } from "react";
import {
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import searchStyles from "../styles/search";
import { useNavigation } from "@react-navigation/native";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length > 1) {
      try {
        const response = await axios.get(
          `http://192.168.1.106:8001/search?q=${query}`
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const renderResult = ({ item, type }) => (
    <TouchableOpacity
      style={searchStyles.searchResult}
      onPress={() => {
        setSearchQuery("");
        navigation.navigate("Profiles", { username: item.user.username });
      }}
    >
      <Image
        source={{
          uri: `http://192.168.1.106:8001${item.user.profile_photo}`,
        }}
        style={searchStyles.searchImage}
      />
      <Text style={searchStyles.resultText}>{item.user.name}</Text>
    </TouchableOpacity>
  );

  let combinedResults = [];
  if (searchResults.creators) {
    combinedResults = [
      ...searchResults.creators.map((creator) => ({
        ...creator,
        type: "creator",
      })),
    ];
  }
  if (searchResults.businesses) {
    combinedResults = [
      ...combinedResults,
      ...searchResults.businesses.map((business) => ({
        ...business,
        type: "business",
      })),
    ];
  }

  return (
    <SafeAreaView style={searchStyles.container}>
      <TextInput
        style={searchStyles.searchBar}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={combinedResults}
        keyExtractor={(item, index) => `${item.user.id}-${index}`}
        renderItem={({ item }) => renderResult({ item, type: item.type })}
        ListEmptyComponent={() => (
          <Text style={searchStyles.emptyText}>No users found.</Text>
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
