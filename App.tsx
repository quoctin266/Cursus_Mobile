import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "react-native";
import StackRouter from "./components/router/Stack.router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const theme = {
  ...MD3LightTheme, // or MD3DarkTheme
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: true,
      refetchInterval: 1000 * 20,
      staleTime: 1000 * 20,
    },
  },
});

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <StatusBar backgroundColor="black" barStyle="light-content" />
              <StackRouter />
            </NavigationContainer>
          </QueryClientProvider>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
