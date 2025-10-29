import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { globalStyles, COLORS, SIZES } from "../../constants/styles";
import { api } from "../../api/api";

// @ts-ignore
const AddEditProductScreen = ({ route, navigation }) => {
  const { product, onGoBack } = route.params || {};
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [stock, setStock] = useState(product?.stock?.toString() || "");
  const [category, setCategory] = useState(
    product?.category?.name || "electronics"
  );
  const [image, setImage] = useState<string | null>(product?.imageURL || null);
  const [loading, setLoading] = useState(false);

  const categories = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Beauty", value: "beauty" },
    { label: "Fresh Fruits", value: "fresh fruits" },
  ];

  // Mở thư viện ảnh
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Lưu hoặc cập nhật sản phẩm
  const handleSave = async () => {
    if (!name || !price || !stock) {
      Alert.alert(
        "Thiếu thông tin",
        "Vui lòng nhập đầy đủ các trường bắt buộc."
      );
      return;
    }

    const newProduct = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category: { name: category },
      imageURL: image ? image.split("/").pop() : "placeholder.png", // Giả lập ảnh cục bộ
    };

    try {
      setLoading(true);

      if (isEditing) {
        await api.put(`/api/products/${product.productId}`, newProduct);
        Alert.alert("Thành công", "Đã cập nhật sản phẩm!");
      } else {
        await api.post("/api/products", newProduct);
        Alert.alert("Thành công", "Đã thêm sản phẩm mới!");
      }

      if (onGoBack) onGoBack();
      navigation.goBack();
    } catch (error: any) {
      console.error("❌ Lỗi lưu sản phẩm:", error.message);
      Alert.alert("Lỗi", "Không thể lưu sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Product" : "Add Product"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: SIZES.padding, paddingBottom: 100 }}
      >
        <Text style={styles.label}>Tên sản phẩm</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên sản phẩm"
        />

        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả sản phẩm"
          multiline
        />

        <Text style={styles.label}>Giá ($)</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="Nhập giá sản phẩm"
        />

        <Text style={styles.label}>Số lượng tồn</Text>
        <TextInput
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          placeholder="Nhập số lượng tồn"
        />

        <Text style={styles.label}>Danh mục</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(value) => setCategory(value)}
            style={{ color: COLORS.text }}
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

        <Text style={styles.label}>Ảnh sản phẩm</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 120, height: 120, borderRadius: 8 }}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="camera-outline"
                size={40}
                color={COLORS.textLight}
              />
              <Text style={{ color: COLORS.textLight }}>Chọn ảnh</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? "Cập nhật" : "Thêm mới"}
            </Text>
          )}
        </TouchableOpacity>
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
    paddingHorizontal: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
    color: COLORS.text,
    marginTop: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  imagePicker: {
    marginTop: 5,
    marginBottom: 20,
    alignItems: "center",
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddEditProductScreen;
