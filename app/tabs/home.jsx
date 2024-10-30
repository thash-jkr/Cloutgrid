import {
  View,
  Text,
  Image,
  StatusBar,
  ScrollView,
  TextInput,
  RefreshControl,
  Dimensions,
  SafeAreaView
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBell, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { TouchableOpacity } from "react-native";
import { Modalize } from "react-native-modalize";

import homeStyles from "../styles/home";
import CustomButton from "../components/CustomButton";
import Config from "../config";

const Home = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const commentModal = useRef(null);
  const { height } = Dimensions.get("window");

  const fetchPosts = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(`${Config.BASE_URL}/posts/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.data) {
        setPosts(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${postId}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            like_count:
              response.data.message === "Post liked"
                ? post.like_count + 1
                : post.like_count - 1,
            is_liked: response.data.message === "Post liked",
          };
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSelectComment = async (post) => {
    setSelectedPost(post);
    commentModal.current?.open();

    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.get(
        `${Config.BASE_URL}/posts/${post.id}/comments/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const accessToken = await SecureStore.getItemAsync("access");
      const response = await axios.post(
        `${Config.BASE_URL}/posts/${selectedPost.id}/comments/`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const dateParser = (dateTime) => {
    const [date, time] = dateTime.split("T");
    return new Date(date).toDateString();
  };

  return (
    <SafeAreaView style={homeStyles.home}>
      <StatusBar backgroundColor="#ECEEEA" />
      <View style={homeStyles.header}>
        <View>
          <Text style={homeStyles.h2}>
            Clout<Text style={homeStyles.logoSide}>Grid</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={homeStyles.bell}
          onPress={() => navigation.navigate("Notifications")}
        >
          <FontAwesomeIcon icon={faBell} size={25} />
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={homeStyles.postContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.length > 0 ? (
          posts.map((post) => (
            <View key={post.id} style={homeStyles.post}>
              <View style={homeStyles.postHeader}>
                <Image
                  style={homeStyles.profilePicture}
                  source={{
                    uri: `${post.author.profile_photo}`,
                  }}
                />
                <Text style={homeStyles.postAuthor}>{post.author.name}</Text>
              </View>
              <Image
                style={homeStyles.postImage}
                source={{ uri: `${post.image}` }}
              />
              <View style={homeStyles.postFooter}>
                <View style={homeStyles.postFooterIcons}>
                  <TouchableOpacity onPress={() => handleLike(post.id)}>
                    <FontAwesomeIcon
                      icon={faHeart}
                      size={25}
                      style={{ color: post.is_liked ? "green" : "black" }}
                    />
                  </TouchableOpacity>
                  <Text>
                    <Text>{post.like_count} Likes </Text>
                    <Text>|</Text>
                    <Text> {post.comment_count} Comments</Text>
                  </Text>
                  <TouchableOpacity onPress={() => handleSelectComment(post)}>
                    <FontAwesomeIcon icon={faComment} size={25} />
                  </TouchableOpacity>
                </View>
                <View style={homeStyles.postFooterText}>
                  <Text>
                    <Text style={homeStyles.postFooterTextBold}>
                      {post.author.username}
                    </Text>
                    {"  "}
                    <Text>{post.caption}</Text>
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>

      <Modalize
        ref={commentModal}
        adjustToContentHeight={true}
        onClose={() => setComments([])}
        HeaderComponent={
          <View style={homeStyles.modalHeader}>
            <Text style={homeStyles.headerText}>Comments</Text>
          </View>
        }
      >
        <View style={homeStyles.modal}>
          <ScrollView>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={homeStyles.comment}>
                  <Text>
                    <Text style={homeStyles.commentAuthor}>
                      {comment.user.username}
                    </Text>
                    <Text> - {dateParser(comment.commented_at)}</Text>
                  </Text>
                  <Text>{comment.content}</Text>
                </View>
              ))
            ) : (
              <Text>No comments yet</Text>
            )}
          </ScrollView>

          <View style={homeStyles.commentInputContainer}>
            <TextInput
              style={homeStyles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={(value) => setNewComment(value)}
            />
            <CustomButton
              title="Post"
              onPress={handleAddComment}
              disabled={newComment.length === 0}
            />
          </View>
        </View>
      </Modalize>
    </SafeAreaView>
  );
};

export default Home;
