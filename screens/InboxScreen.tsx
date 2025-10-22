import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SegmentedButtons } from "react-native-paper";
import { globalStyles, COLORS, SIZES } from "../constants/styles";
import MessageItem from "../components/MessageItem";

// Dữ liệu giả
const chatMessages = [
  {
    id: "1",
    name: "Support Team",
    message: "Hello! How can we help you today?",
    time: "10:30 AM",
    unread: 2,
    avatar: require("../assets/img/headphone1.png"),
  },
  {
    id: "2",
    name: "Seller: Nike Store",
    message: "Your order #12345 has shipped!",
    time: "Yesterday",
    unread: 0,
    avatar: require("../assets/img/headphone1.png"),
  },
];

const promoMessages = [
  {
    id: "1",
    name: "Black Friday Sale",
    message: "Get 50% off on all electronics!",
    time: "2d ago",
    unread: 1,
    avatar: require("../assets/img/headphone1.png"),
  },
  {
    id: "2",
    name: "Adidas",
    message: "New collection has arrived.",
    time: "3d ago",
    unread: 0,
    avatar: require("../assets/img/headphone1.png"),
  },
];

// @ts-ignore
const InboxScreen = ({ navigation }) => {
  const [segment, setSegment] = useState("chats");

  const dataToRender = segment === "chats" ? chatMessages : promoMessages;

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.headerTitle}>Inbox</Text>
      </View>

      <View style={styles.container}>
        <SegmentedButtons
          value={segment}
          onValueChange={setSegment}
          style={styles.segmentedButtons}
          buttons={[
            {
              value: "chats",
              label: "Chats",
            },
            {
              value: "promos",
              label: "Promotions",
            },
          ]}
          theme={{
            colors: { primary: COLORS.primary, outline: COLORS.border },
          }}
        />

        <FlatList
          data={dataToRender}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageItem
              name={item.name}
              message={item.message}
              time={item.time}
              unreadCount={item.unread}
              avatar={item.avatar}
              onPress={() => {
                // (Trong tương lai)
                // if (segment === 'chats') {
                //   navigation.navigate('Chat', { chatId: item.id, name: item.name });
                // }
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  segmentedButtons: {
    marginBottom: SIZES.padding,
  },
});

export default InboxScreen;
