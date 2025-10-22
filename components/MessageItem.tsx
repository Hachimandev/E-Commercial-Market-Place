import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { Badge } from "react-native-paper";
import { COLORS, SIZES } from "../constants/styles";

interface MessageItemProps {
  avatar: ImageSourcePropType;
  name: string;
  message: string;
  time: string;
  unreadCount: number;
  onPress?: () => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  avatar,
  name,
  message,
  time,
  unreadCount,
  onPress,
}) => {
  const isUnread = unreadCount > 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={avatar} style={styles.avatar} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.name, isUnread && styles.nameUnread]}>
            {name}
          </Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.row}>
          <Text
            style={[styles.message, isUnread && styles.messageUnread]}
            numberOfLines={1}
          >
            {message}
          </Text>
          {isUnread && <Badge style={styles.badge}>{unreadCount}</Badge>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: SIZES.padding,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SIZES.padding,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    color: COLORS.text,
  },
  nameUnread: {
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  message: {
    fontSize: 14,
    color: COLORS.textLight,
    flex: 1,
  },
  messageUnread: {
    color: COLORS.text,
    fontWeight: "500",
  },
  badge: {
    backgroundColor: COLORS.primary,
    marginLeft: 10,
  },
});

export default MessageItem;
