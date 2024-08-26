import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
// import Profile from "../Profile/Profile";
import { DrawerParamList } from "../../custom/router.types";

const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerRouter() {
  return (
    // <Drawer.Navigator initialRouteName="Profile">
    //   <Drawer.Screen name="Profile" component={Profile} />
    // </Drawer.Navigator>
    <></>
  );
}

export default DrawerRouter;
