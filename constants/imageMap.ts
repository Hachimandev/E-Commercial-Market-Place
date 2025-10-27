import { ImageSourcePropType } from "react-native";

// Bản đồ ánh xạ ảnh cục bộ (local)
export const LOCAL_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  "iphone15.jpg": require("../assets/img/iphone.png"),
  "macbook.jpg": require("../assets/img/macbook.png"),
  "lipstick.jpg": require("../assets/img/lipstick.png"),
  "mango.jpg": require("../assets/img/cherry.png"),

  "headphone1.png": require("../assets/img/headphone1.png"),
  "headphone2.png": require("../assets/img/headphone2.png"),
  "headphone3.png": require("../assets/img/headphone2.png"),
  "handbag.jpg": require("../assets/img/headphone2.png"),
  "facecream.jpg": require("../assets/img/headphone2.png"),
  "banana.jpg": require("../assets/img/headphone2.png"),

  "men_tshirt.jpg": {
    uri: "https://www.innblac.uk/cdn/shop/files/INNBLAC_Kangaroo_Pocket_Thumb_Holes_hoodie_0_3_600x.jpg?v=1724742660",
  },
};

export const getLocalImage = (
  imageURL?: string,
  apiBaseUrl?: string
): ImageSourcePropType => {
  if (imageURL && LOCAL_IMAGE_MAP[imageURL]) {
    return LOCAL_IMAGE_MAP[imageURL];
  }

  if (imageURL && apiBaseUrl) {
    return { uri: `${apiBaseUrl}/images/${imageURL}` };
  }

  return require("../assets/icon.png");
};
