import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EventList from "./EventList";
import EventDetail from "./EventDetail";

const Stack = createNativeStackNavigator();

const headerOption = () => ({
  headerStyle: { backgroundColor: "#10ac84" },
  headerTintColor: "white",
  headerTitleStyle: { fontWeight: "bold" },
});

const EventStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        component={EventList} 
        name="EventList" 
        options={{ 
          title: "Events",
          ...headerOption(),
        }}
      />
      <Stack.Screen 
        component={EventDetail} 
        name="EventDetail" 
        options={{ 
          title: "Event Details",
          ...headerOption(),
        }}
      />
    </Stack.Navigator>
  );
};

export default EventStack; 