import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TabParamList } from "../../custom/router.types";
import {
  FontAwesome,
  MaterialIcons,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import Home from "../Home/Home";
import Account from "../Account/Account";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { BrowseStackProps } from "../../custom/component.props";
import MyLearning from "../MyLearning/MyLearning";
import { useAppSelector } from "../../redux/hooks";
import UserMyLearning from "../MyLearning/UserMyLearning";
import Search from "../Search/Search";
import { Badge } from "react-native-paper";

const Tab = createBottomTabNavigator<TabParamList>();

function TabRouter({ navigation }: BrowseStackProps) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { itemsList } = useAppSelector((state) => state.cart);

  return (
    <Tab.Navigator
      screenOptions={{ unmountOnBlur: true, tabBarActiveTintColor: "#ff6000" }}
    >
      <Tab.Screen
        name="Browse"
        component={Home}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" size={20} color={color} />
          ),
          title: "",
          headerStyle: {
            backgroundColor: "#ff6000",
          },
          headerRight: () =>
            isAuthenticated ? (
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => navigation.navigate("Cart")}
              >
                {itemsList && itemsList.length > 0 && (
                  <Badge style={styles.badge}>{itemsList?.length ?? 0}</Badge>
                )}
                <MaterialIcons name="shopping-cart" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ marginRight: 16 }}
                onPress={() => navigation.navigate("SignIn")}
              >
                <Text style={styles.signinText}>SIGN IN</Text>
              </TouchableOpacity>
            ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="search" size={20} color={color} />
          ),
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="MyLearning"
        component={isAuthenticated ? UserMyLearning : MyLearning}
        options={{
          tabBarLabel: "My learning",
          tabBarIcon: ({ color }) => (
            <AntDesign name="play" size={20} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#ff6000",
          },
          headerTitleStyle: {
            color: "white",
          },
          title: "My courses",
          headerRight: () =>
            isAuthenticated ? (
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => navigation.navigate("Cart")}
              >
                {itemsList && itemsList.length > 0 && (
                  <Badge style={styles.badge}>{itemsList?.length ?? 0}</Badge>
                )}
                <MaterialIcons name="shopping-cart" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <></>
            ),
        }}
      />

      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarLabel: "Account",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="account-circle" size={20} color={color} />
          ),
          headerStyle: {
            backgroundColor: "#ff6000",
          },
          headerTitleStyle: {
            color: "white",
          },
          headerRight: () =>
            isAuthenticated ? (
              <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => navigation.navigate("Cart")}
              >
                {itemsList && itemsList.length > 0 && (
                  <Badge style={styles.badge}>{itemsList?.length ?? 0}</Badge>
                )}
                <MaterialIcons name="shopping-cart" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <></>
            ),
        }}
      />

      {/* <Tab.Screen
        name="NearbyJob"
        options={{
          tabBarLabel: "Nearby",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="near-me" size={20} color={color} />
          ),
          headerShown: false,
        }}
      >
        {(props) => (
          <ScrollView
            style={{ paddingHorizontal: 16 }}
            showsVerticalScrollIndicator={false}
          >
            <NearbyJob {...props} />
          </ScrollView>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Setting"
        component={DrawerRouter}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={20} color={color} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  signinText: {
    fontWeight: "600",
    color: "white",
    fontSize: 16,
  },
  badge: {
    position: "absolute",
    left: 12,
    bottom: 12,
    zIndex: 1,
  },
});
export default TabRouter;
