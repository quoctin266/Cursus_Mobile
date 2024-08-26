import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import * as ImagePicker from "expo-image-picker";
import { Buffer } from "buffer";
import { Snackbar, TextInput } from "react-native-paper";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import moment from "moment";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { patchUpdateUser } from "../../services/user.service";
import { IUpdateProfile } from "../../custom/request.interface";
import { update } from "../../redux/slices/auth.slice";

const defaultImg = require("../../assets/default.jpg");

interface Inputs {
  firstName: string;

  lastName: string;

  username: string;

  phone: string;

  description: string;

  address: string;

  biography: string;
}

function Profile() {
  const {
    imageUrl,
    id,
    username,
    firstName,
    lastName,
    phone,
    description,
    dob,
    address,
    biography,
  } = useAppSelector((state) => state.auth.userInfo);

  const [image, setImage] = useState(imageUrl);
  const [imageData, setImageData] = useState(null);
  const [date, setDate] = useState(moment(dob).toDate());

  const [showAlert, setShowAlert] = useState(false);
  const [alert, setAlert] = useState("");
  const [isError, setIsError] = useState(false);

  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      firstName,
      lastName,
      username,
      phone,
      address,
      description,
      biography,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: { userInfo: IUpdateProfile; id: string }) => {
      return patchUpdateUser(data.userInfo, data.id);
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        dispatch(update(response.data));
        setAlert(response.message);
        setIsError(false);
      } else {
        setIsError(true);
        if (response.message) setAlert(response.message);
        else setAlert(response.error as string);
      }
      setShowAlert(true);
    },
    retry: 3,
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageData({
        data: result.assets[0].base64,
        mimetype: result.assets[0].mimeType,
        size: Buffer.from(result.assets[0].base64, "base64").length,
        name: result.assets[0].uri.split("/").pop(),
        isMobile: true,
      });
    }
  };

  const onChange = (event: DateTimePickerEvent, selectedDate: Date) => {
    setDate(selectedDate);
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutation.mutate({
      userInfo: { ...data, dob: date.toISOString(), file: imageData },
      id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Public profile</Text>
          <Text style={styles.headerSubTitle}>
            Add information about yourself
          </Text>

          <View style={styles.imageContainer}>
            <Text style={{ fontWeight: "600" }}>Image preview</Text>
            {image ? (
              <Image
                source={{ uri: image }}
                resizeMode="contain"
                style={styles.image}
              />
            ) : (
              <Image
                source={defaultImg}
                resizeMode="contain"
                style={styles.image}
              />
            )}

            <TouchableOpacity
              style={styles.buttonUpload}
              onPress={() => pickImage()}
            >
              <Text style={styles.btnUploadText}>Upload image</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={{ fontWeight: "600", marginBottom: 12 }}>Basic</Text>

          <View style={{ marginBottom: 16 }}>
            <Controller
              control={control}
              rules={{
                required: "Required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label=""
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="First name"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="firstName"
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Controller
              control={control}
              rules={{
                required: "Required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="Last name"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="lastName"
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Controller
              control={control}
              rules={{
                required: "Required",
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="Username"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="username"
            />
            {errors.username && (
              <Text style={styles.errorText}>{errors.username.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <Controller
              control={control}
              rules={{
                required: "Required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Invalid phone number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  keyboardType="phone-pad"
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="Phone number"
                  style={styles.input}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone.message}</Text>
            )}
          </View>

          <View style={{ marginBottom: 16 }}>
            <TextInput
              showSoftInputOnFocus={false}
              mode="outlined"
              activeOutlineColor="black"
              placeholder="dd/mm/yyyy"
              style={styles.input}
              right={
                <TextInput.Icon icon="calendar-blank" onPress={showMode} />
              }
              onPressIn={showMode}
              value={moment(date).format("DD/MM/yyyy")}
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  multiline
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="Address"
                  style={[styles.input, { paddingVertical: 16 }]}
                  numberOfLines={6}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="address"
            />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  multiline
                  mode="outlined"
                  activeOutlineColor="black"
                  placeholder="Short description"
                  style={[styles.input, { paddingVertical: 16 }]}
                  numberOfLines={3}
                  value={value}
                  onChangeText={onChange}
                />
              )}
              name="description"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              mutation.isPending ? { backgroundColor: "#ff9c60" } : {},
            ]}
            disabled={mutation.isPending}
            onPress={handleSubmit(onSubmit)}
          >
            {mutation.isPending && <ActivityIndicator color={"white"} />}
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Snackbar
        visible={showAlert}
        onDismiss={() => setShowAlert(false)}
        onIconPress={() => setShowAlert(false)}
        duration={5000}
        style={{ backgroundColor: isError ? "#bb2124" : "#22bb33" }}
      >
        {alert}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    marginTop: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "500",
    marginBottom: 3,
  },
  headerSubTitle: {
    fontSize: 16,
    color: "gray",
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: 330,
    height: 230,
    borderWidth: 0.5,
    borderColor: "black",
    marginTop: 8,
    alignSelf: "center",
  },
  buttonUpload: {
    paddingVertical: 16,
    marginVertical: 12,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  btnUploadText: {
    textAlign: "center",
    fontWeight: "500",
    fontSize: 16,
  },
  body: {
    paddingHorizontal: 15,
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#FAFAFC",
  },
  button: {
    paddingVertical: 12,
    backgroundColor: "#ff6000",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    width: 100,
  },
  btnText: {
    textAlign: "center",
    fontWeight: "800",
    color: "white",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    marginTop: 6,
  },
});

export default Profile;
