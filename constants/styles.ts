// E-Commercial-Market-Place/constants/styles.ts

import { StyleSheet } from 'react-native';


export const COLORS = {
  primary: '#008B8B', 
  primaryLight: '#B2DFDB',
  secondary: '#FF6347', 
  background: '#FFFFFF',
  textDark: "#1E293B",
  surface: '#F5F5F5',
  text: '#333333',
  textLight: '#888888',
  border: '#EEEEEE',
  accent: '#FFD700', 
  success: '#4CAF50',    
  info: '#2196F3',        
  warning: '#FF9800',     
  error: '#F44336',     
  white: '#FFFFFF'
};

export const SIZES = {
  padding: 15,
  radius: 10,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 14,
};


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
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },

  viewAllText: {
    fontSize: SIZES.body,
    color: COLORS.textLight,
  },

  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: COLORS.background, 
  },

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