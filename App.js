import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventStack from "./screens/EventStack";
import FavoritesScreen from "./screens/FavoritesScreen";
import Icon from "react-native-vector-icons/FontAwesome";


const Tab = createBottomTabNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#10ac84",
          tabBarInactiveTintColor: "#95a5a6",
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
          },
          tabBarIcon: ({ focused, color }) => {
            let iconName;

            if (route.name === "EventStack") {
              iconName = focused ? "calendar" : "calendar-o";
            } else if (route.name === "FavoritesScreen") {
              iconName = focused ? "heart" : "heart-o";
            }

            return <Icon name={iconName} size={24} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          component={EventStack} 
          name="EventStack" 
          options={{ title: "Events" }}
        />
        <Tab.Screen 
          component={FavoritesScreen} 
          name="FavoritesScreen" 
          options={{ title: "Favorites" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
}); 