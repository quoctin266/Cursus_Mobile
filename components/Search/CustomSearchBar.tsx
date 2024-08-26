import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Badge, Searchbar } from "react-native-paper";
import { RootStackParamList } from "../../custom/router.types";
import { MaterialIcons } from "@expo/vector-icons";
import { useAppSelector } from "../../redux/hooks";

function CustomSearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [icon, setIcon] = useState("");

  const { itemsList } = useAppSelector((state) => state.cart);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const searchBarRef = useRef(null);

  const handleClickIcon = () => {
    if (icon) {
      setIcon("");
      searchBarRef?.current.blur();
    } else {
      setIcon("arrow-left");
      searchBarRef?.current.focus();
    }
  };

  return (
    <View style={styles.searchBarContainer}>
      <Searchbar
        ref={searchBarRef}
        icon={icon}
        placeholder="Search"
        mode="view"
        elevation={1}
        showDivider={false}
        style={styles.searchBar}
        inputStyle={{
          minHeight: 0,
        }}
        value={searchQuery}
        onFocus={() => setIcon("arrow-left")}
        onBlur={() => setIcon("")}
        onChangeText={setSearchQuery}
        onIconPress={handleClickIcon}
        onSubmitEditing={() =>
          navigation.navigate("SearchResult", { searchQuery })
        }
      />

      {isAuthenticated && (
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          {itemsList && itemsList.length > 0 && (
            <Badge style={styles.badge}>{itemsList?.length ?? 0}</Badge>
          )}
          <MaterialIcons name="shopping-cart" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ff6000",
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  searchBar: {
    borderRadius: 5,
    backgroundColor: "#F3F4F8",
    height: 50,
    flex: 1,
  },
  badge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    zIndex: 1,
  },
});

export default CustomSearchBar;
