import { ImageSourcePropType } from "react-native";
import { API_BASE_URL } from "../api/api"; 

export const LOCAL_IMAGE_MAP: Record<string, ImageSourcePropType> = {

  //eclectronics
  "iphone15.jpg": require("../assets/img/iphone.png"),
  "macbook.jpg": require("../assets/img/macbook.png"),
  "headphone1.png": require("../assets/img/headphone1.png"),
  "headphone2.png": require("../assets/img/headphone2.png"),
  "headphone3.png": require("../assets/img/headphone3.png"),
  "headphone4.png": require("../assets/img/headphone4.png"),


  //beauty
  "lipstick.jpg": require("../assets/img/lipstick.png"),
  "beauty": require("../assets/img/beauty.png"),
  "lipstick1.jpg": require("../assets/img/mascara.png"),
  "facecream.jpg": require("../assets/img/facecream.png"),


  //fruits
  "mango.jpg": require("../assets/img/cherry.png"),
  "banana.jpg": require("../assets/img/banana.png"),
  
  
  //fashion
  "shoes-men": require("../assets/img/shoes-sale-50.png"),
  "shoes-men1": {
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3qQQWF7_uUS5dRzlHv9WlVITF_6kFEEkCTw&s",
  },
  "shoes-men2": {
    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKS6wfKrq5rZ1O23jS9ebftoql1WehYznmyw&s"
  },

  "handbag.jpg": require("../assets/img/tuixach-sale-30.png"),
  "men_tshirt.jpg": {
    uri: "https://www.innblac.uk/cdn/shop/files/INNBLAC_Kangaroo_Pocket_Thumb_Holes_hoodie_0_3_600x.jpg?v=1724742660",
  },
  "men_tshirt1.jpg": {
    uri: "https://www.innblac.com/cdn/shop/files/INNBLAC_Kangaroo_Pocket_Thumb_Holes_hoodie__0_2_150x.jpg?v=1735822377",
  },
  "men_tshirt2.jpg": {
    uri: "https://www.innblac.com/cdn/shop/files/INNBLAC_Kangaroo_Pocket_Thumb_Holes_hoodie__0_5_150x.jpg?v=1735822384",
  },
  "men_tshirt3.jpg": {
    uri: "https://www.innblac.com/cdn/shop/files/INNBLAC_Kangaroo_Pocket_Thumb_Holes_hoodie__0_4_150x.jpg?v=1735822382",
  },

  "samsung_galaxy_s25": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mg7rka5x67ewcc@resize_w450_nl.webp" },
  "xiaomi_14_pro": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m5tq2quch2nse6@resize_w450_nl.webp" },
  "oppo_find_x6": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-md1328iw0hile2@resize_w450_nl.webp" },
  "vivo_x90_pro": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1qjpnrrs5hbcc@resize_w450_nl.webp" },

  "adidas_hoodie": { uri: "https://down-vn.img.susercontent.com/file/sg-11134201-7reoz-m8d96ej7js7l9c@resize_w450_nl.webp" },
  "nike_jogger": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3kcs81ppjfsef@resize_w450_nl.webp" },
  "puma_sneakers": { uri: "https://down-vn.img.susercontent.com/file/vn-11134275-7ras8-mbgkb3vtnvxc77@resize_w450_nl.webp" },
  "levis_jeans": { uri: "https://down-vn.img.susercontent.com/file/sg-11134275-824gh-megwncihd15382@resize_w450_nl.webp" },

  "chanel_foundation": { uri: "https://down-vn.img.susercontent.com/file/sg-11134201-824ia-mfm9tawy35e690@resize_w450_nl.webp" },
  "dior_lipstick": { uri: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTKY9xc5JONjR0sS34OWSq3tOzxJPeM2Mj0xnC56lKVStPlMXQUfwwRuzRvEnSdWvT-O_2ra004VEEIxpJrDufuvSLE3EdVY5_bJzkkkU2JxpCqF95hbRYWp_6jHLG4exReQwqNrA&usqp=CAc" },
  "loreal_mascara": { uri: "https://down-vn.img.susercontent.com/file/vn-11134201-7ra0g-m93y3d0pqceceb@resize_w450_nl.webp" },
  "laneige_cream": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1wmib5ox177ec@resize_w450_nl.webp" },

  "dragon_fruit": { uri: "https://bizweb.dktcdn.net/thumb/1024x1024/100/390/808/products/thanh-long-600x600.jpg?v=1600505776873" },
  "strawberry": { uri: "https://trongraudothi.com/Uploads/rausach/rausach/avata/img/20150806172324d%20(1)_QHWV.jpg" },
  "apple_fuji": { uri: "https://uglyfoodco.com/cdn/shop/files/food3052161605668097831087_1800x1800.jpg?v=1692203688" },
  "orange_valencia": { uri: "https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/f29c0a57a3664fe67bd8e0bdfe660d5c" },


  // Beauty / Son môi
  "dior_lipstick_variant1": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m31hcwap42y827.webp" },
  "dior_lipstick_variant2": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m4qz0a1gdn7z43@resize_w450_nl.webp" },
  "chanel_foundation_variant1": { uri: "https://down-vn.img.susercontent.com/file/sg-11134201-824it-mfm9taq3ucy002@resize_w450_nl.webp" },

  // Fashion / Quần áo
  "adidas_hoodie_variant1": { uri: "https://down-vn.img.susercontent.com/file/sg-11134201-7repq-m8d96ej7jqo07e@resize_w450_nl.webp" },
  "adidas_hoodie_variant2": { uri: "https://down-vn.img.susercontent.com/file/sg-11134201-7renk-m8d9jmo4qoiv12@resize_w450_nl.webp" },
  "nike_jogger_variant1": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m3kcs81po4ad9a@resize_w450_nl.webp" },
  "puma_sneakers_variant1": { uri: "https://down-vn.img.susercontent.com/file/vn-11134275-7ras8-mbgkb3v9q24k31@resize_w450_nl.webp" },
  "puma_sneakers_variant2": { uri: "https://down-vn.img.susercontent.com/file/vn-11134275-7ras8-mbgkb3uppgsk5f@resize_w450_nl.webp" },
  "levis_jeans_variant1": { uri: "https://down-vn.img.susercontent.com/file/sg-11134275-824i8-megwnegaxiwxf5@resize_w450_nl.webp" },

  // Electronics / Điện thoại=
  "samsung_galaxy_s25_black": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ra0g-m7j925wn1qf045@resize_w450_nl.webp" },
  "xiaomi_14_pro_blue": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-mdklabyb4dyp01@resize_w450_nl.webp" },
  "oppo_find_x6_white": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-md1328k00a58d1@resize_w450_nl.webp" },
  "vivo_x90_pro_gold": { uri: "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m1qjpnrrqqwv27@resize_w450_nl.webp" },

  // Fresh Fruits / Trái cây
  "dragon_fruit_slice": { uri: "" },
  "strawberry_basket": { uri: "" },
  "apple_fuji_cut": { uri: "" },
  "orange_valencia_cut": { uri: "" },
};

export const getLocalImage = (
  imageURL?: string,
  apiBaseUrl?: string
): ImageSourcePropType => {

  if (imageURL && LOCAL_IMAGE_MAP[imageURL]) {
    return LOCAL_IMAGE_MAP[imageURL];
  }
  if (imageURL && (imageURL.startsWith('http://') || imageURL.startsWith('https://'))) {
      return { uri: imageURL };
  }
  if (imageURL && apiBaseUrl) {
    return { uri: `${apiBaseUrl}/api/files/images/${imageURL}` };
  }
  // if (imageURL) {
  //   return { uri: `${API_BASE_URL}/api/files/images/${imageURL}` }; 
  // }

  return require("../assets/icon.png");
};