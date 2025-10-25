import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // Cần cài: npx expo install expo-image-picker
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
// Cần Picker, cài: npx expo install @react-native-picker/picker
import { Picker } from "@react-native-picker/picker";

// @ts-ignore
const AddEditProductScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "");
  const [category, setCategory] = useState(
    product?.category?.id || "electronics"
  );
  const [image, setImage] = useState<string | null>(
    product?.image?.uri || null
  );

  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Beauty", value: "beauty" },
    { label: "Fresh Fruits", value: "fresh fruits" },
  ];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
    };
    console.log("Saving product:", productData);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ padding: 10 }}
        >
          <Ionicons name="close-outline" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Product" : "Add New Product"}
        </Text>
        <TouchableOpacity onPress={handleSave} style={{ padding: 10 }}>
          <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Image Picker */}
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.productImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={COLORS.textLight}
              />
              <Text style={{ color: COLORS.textLight }}>Select Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Form Fields */}
        <Text style={styles.label}>Product Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter product name"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price ($)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="0"
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categories.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>
      </ScrollView>
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
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  container: { padding: SIZES.padding },
  imagePicker: { alignItems: "center", marginBottom: 20 },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: { width: 150, height: 150, borderRadius: SIZES.radius },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
    color: COLORS.text,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  inputGroup: { width: "48%" },
  pickerContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    marginBottom: 15,
  },
});

export default AddEditProductScreen;
