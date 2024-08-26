import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";

// const destination = {
//   latitude: 10.736044103832672,
//   longitude: 106.690223250707,
// };
const destination = {
  latitude: 10.729659614142228,
  longitude: 106.68635857220754,
};

const CompanyLocation = () => {
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (errorMsg) alert(errorMsg);
  }, [errorMsg]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 10.732486097255796,
          longitude: 106.68674110977318,
          latitudeDelta: 0.0222,
          longitudeDelta: 0.0121,
        }}
        zoomControlEnabled
        showsMyLocationButton
        showsUserLocation
        showsCompass
      >
        <Marker coordinate={destination} title="Cursus" />

        {location !== null && (
          <MapViewDirections
            origin={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            destination={destination}
            apikey={process.env.GOOGLE_MAPS_APIKEY}
            strokeWidth={2}
            strokeColor="red"
          />
        )}
      </MapView>
    </SafeAreaView>
  );
};

export default CompanyLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },
  map: {
    flex: 1,
  },
});
