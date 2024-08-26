import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../custom/router.types";
import { StyleSheet } from "react-native";
import IntroPage from "../Intro/IntroPage";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import EmailSignUp from "../Auth/EmailSignUp";
import EmailSignIn from "../Auth/EmailSignIn";
import { useAppSelector } from "../../redux/hooks";
import TabRouter from "./Tab.router";
import Account from "../Account/Account";
import Status from "../Account/Status";
import Search from "../Search/Search";
import SearchResult from "../Search/SearchResult";
import CategorySearch from "../Search/CategorySearch";
import CategoryPage from "../CategoryList/CategoryPage";
import InstructorDetail from "../Instructor/InstructorDetail";
import InstructorCourses from "../Instructor/InstructorCourses";
import CourseDetail from "../Course/CourseDetail";
import AllFeedback from "../Course/AllFeedback";
import PreviewCourse from "../Course/PreviewCourse";
import Cart from "../Purchase/Cart";
import Checkout from "../Purchase/Checkout";
import PaymentStatus from "../Purchase/PaymentStatus";
import PaymentGate from "../Purchase/PaymentGate";
import Profile from "../Account/Profile";
import Security from "../Account/Security";
import LearnCourse from "../Course/LearnCourse/LearnCourse";
import AccountVerify from "../Auth/AccountVerify";
import VerifySuccess from "../Auth/VerifySuccess";
import ResetPassword from "../Auth/ResetPassword";
import RequestStatus from "../Auth/RequestStatus";
import FeatureList from "../FeatureList/FeatureList";
import NewestList from "../NewestList/NewestList";
import CompanyLocation from "../Account/CompanyLocation";

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackRouter() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Home" : "Intro"}
      screenOptions={{ animation: "ios" }}
    >
      {isAuthenticated === false && (
        <>
          <Stack.Screen
            name="Intro"
            component={IntroPage}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EmailSignUp"
            component={EmailSignUp}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="EmailSignIn"
            component={EmailSignIn}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="AccountVerify"
            component={AccountVerify}
            options={{
              title: "OTP Verification",
              headerTitleAlign: "center",
              headerTitleStyle: {
                color: "gray",
              },
              headerShadowVisible: false,
            }}
          />

          <Stack.Screen
            name="VerifySuccess"
            component={VerifySuccess}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="RequestStatus"
            component={RequestStatus}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}

      <Stack.Group navigationKey={isAuthenticated ? "user" : "guest"}>
        <Stack.Screen
          name="Home"
          component={TabRouter}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Search"
          component={Search}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Account"
          component={Account}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CompanyLocation"
          component={CompanyLocation}
          options={{
            headerStyle: {
              backgroundColor: "#ff6000",
            },
            headerTintColor: "white",
          }}
        />

        <Stack.Screen
          name="Status"
          component={Status}
          options={{
            headerStyle: {
              backgroundColor: "#ff6000",
            },
            headerTintColor: "white",
          }}
        />

        <Stack.Screen
          name="SearchResult"
          component={SearchResult}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CategorySearch"
          component={CategorySearch}
          options={{
            title: "",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="CategoryPage"
          component={CategoryPage}
          options={{
            title: "Categories",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="InstructorDetail"
          component={InstructorDetail}
          options={{
            title: "Instructor",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="InstructorCourses"
          component={InstructorCourses}
          options={{
            title: "Instructor",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="CourseDetail"
          component={CourseDetail}
          options={{
            title: "",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="AllFeedback"
          component={AllFeedback}
          options={{
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="PreviewCourse"
          component={PreviewCourse}
          options={{
            title: "",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "black",
            },
          }}
        />

        <Stack.Screen
          name="FeatureList"
          component={FeatureList}
          options={{
            title: "Featured Courses",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />

        <Stack.Screen
          name="NewestList"
          component={NewestList}
          options={{
            title: "Newest Courses",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: "#ff6000",
            },
          }}
        />
      </Stack.Group>

      {isAuthenticated === true && (
        <>
          <Stack.Screen
            name="Cart"
            component={Cart}
            options={{
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "#ff6000",
              },
            }}
          />

          <Stack.Screen
            name="Checkout"
            component={Checkout}
            options={{
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "#ff6000",
              },
            }}
          />

          <Stack.Screen
            name="PaymentGate"
            component={PaymentGate}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="PaymentStatus"
            component={PaymentStatus}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "#ff6000",
              },
            }}
          />

          <Stack.Screen
            name="Security"
            component={Security}
            options={{
              title: "Account security",
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "#ff6000",
              },
            }}
          />

          <Stack.Screen
            name="LearnCourse"
            component={LearnCourse}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "60%",
    height: "60%",
    borderRadius: 12 / 1.25,
  },
  container: {
    width: 60,
    height: 60,
    borderRadius: 12 / 1.25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StackRouter;
