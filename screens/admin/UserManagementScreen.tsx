import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SegmentedButtons } from "react-native-paper";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import SearchBar from "../../components/SearchBar";

// Mock Data
const mockUsers = [
  {
    id: "1",
    name: "Le Van C",
    email: "levanc@email.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    status: "Active",
    role: "BUYER",
  },
  {
    id: "2",
    name: "Pham Thi D",
    email: "phamthid@email.com",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    status: "Active",
    role: "BUYER",
  },
  {
    id: "3",
    name: "Nguyen Van A",
    email: "nguyenvana@email.com",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    status: "Banned",
    role: "SELLER",
  },
  {
    id: "4",
    name: "Tran Thi B",
    email: "tranthib@email.com",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    status: "Active",
    role: "SELLER",
  },
];

const UserListItem: React.FC<{
  item: any;
  onToggleBan: (id: string, currentStatus: string) => void;
  onEditRole: (id: string) => void;
}> = ({ item, onToggleBan, onEditRole }) => (
  <View style={[styles.listItem, globalStyles.shadow]}>
    <Image source={{ uri: item.avatar }} style={styles.itemAvatar} />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1}>
        {item.name} ({item.role})
      </Text>
      <Text style={styles.itemEmail} numberOfLines={1}>
        {item.email}
      </Text>
    </View>
    <View style={styles.itemActions}>
      <Text
        style={[
          styles.itemStatus,
          item.status === "Banned" && styles.itemStatusBanned,
        ]}
      >
        {item.status}
      </Text>
      {/* Nút Ban/Unban - Dùng Switch hoặc Button tùy ý */}
      <TouchableOpacity
        onPress={() => onToggleBan(item.id, item.status)}
        style={styles.actionButton}
      >
        <Ionicons
          name={
            item.status === "Active"
              ? "ban-outline"
              : "checkmark-circle-outline"
          }
          size={22}
          color={item.status === "Active" ? "red" : "green"}
        />
      </TouchableOpacity>
      {/* Nút Edit Role (Placeholder) */}
      <TouchableOpacity
        onPress={() => onEditRole(item.id)}
        style={styles.actionButton}
      >
        <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  </View>
);

// @ts-ignore
const UserManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState(mockUsers);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) => {
    const statusMatch = filter === "All" || user.status === filter;
    const nameMatch = user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return statusMatch && (nameMatch || emailMatch);
  });

  const handleToggleBan = (userId: string, currentStatus: string) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: currentStatus === "Active" ? "Banned" : "Active",
            }
          : user
      )
    );
    console.log(
      `${currentStatus === "Active" ? "Banning" : "Unbanning"} user:`,
      userId
    );
  };

  const handleEditRole = (userId: string) => {
    alert(`Edit role for user: ${userId} (Not implemented)`);
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ padding: 10 }}
        >
          <Ionicons name="menu-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        <SearchBar
          onSubmitEditing={setSearchQuery}
          initialQuery={searchQuery}
        />

        {/* Filter Buttons */}
        <SegmentedButtons
          value={filter}
          onValueChange={setFilter}
          style={styles.segmentedButtons}
          buttons={[
            { value: "All", label: "All Users" },
            { value: "Active", label: "Active" },
            { value: "Banned", label: "Banned" },
          ]}
          theme={{
            colors: { primary: COLORS.primary, outline: COLORS.border },
          }}
        />

        <FlatList
          data={filteredUsers}
          renderItem={({ item }) => (
            <UserListItem
              item={item}
              onToggleBan={handleToggleBan}
              onEditRole={handleEditRole}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: "center",
                color: COLORS.textLight,
                marginTop: 30,
              }}
            >
              No users found.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: { flex: 1, padding: SIZES.padding },
  segmentedButtons: { marginBottom: SIZES.padding },
  listItem: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius,
    padding: 10,
    marginBottom: SIZES.padding,
    alignItems: "center",
  },
  itemAvatar: { width: 45, height: 45, borderRadius: 22.5, marginRight: 10 },
  itemInfo: { flex: 1, marginRight: 10 },
  itemName: { fontSize: 16, fontWeight: "600", marginBottom: 3 },
  itemEmail: { fontSize: 12, color: COLORS.textLight },
  itemActions: { flexDirection: "row", alignItems: "center" },
  itemStatus: {
    fontSize: 12,
    fontWeight: "bold",
    color: "green",
    marginRight: 10,
  },
  itemStatusBanned: { color: "red" },
  actionButton: { padding: 5, marginLeft: 5 },
});

export default UserManagementScreen;
