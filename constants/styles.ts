// E-Commercial-Market-Place/constants/styles.ts

import { StyleSheet } from 'react-native';

// Nơi định nghĩa các màu sắc chủ đạo
export const COLORS = {
  primary: '#008B8B', // Màu xanh/teal active
  secondary: '#FF6347', // Màu cam/đỏ (Beauty)
  background: '#FFFFFF',
  surface: '#F5F5F5', // Nền của search bar
  text: '#333333',
  textLight: '#888888',
  border: '#EEEEEE',
  accent: '#FFD700', // Màu sao (star)
};

// Nơi định nghĩa các kích thước
export const SIZES = {
  padding: 15,
  radius: 10,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 14,
};

// Nơi định nghĩa các style dùng chung
export const globalStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    backgroundColor: COLORS.background,
  },
  // Style cho tiêu đề (ví dụ: "Recommended for you")
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  // Style cho text "View all"
  viewAllText: {
    fontSize: SIZES.body,
    color: COLORS.textLight,
  },
  // Style cho bóng đổ (shadow)
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: COLORS.background, // Cần có background để shadow hoạt động
  },
  // Header chung cho các màn hình (giống "All Deals")
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: 'bold',
  },
  headerIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
});