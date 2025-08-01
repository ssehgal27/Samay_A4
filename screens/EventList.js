import { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../config/FirebaseConfig";

const EventList = ({ navigation, route }) => {
  const [eventList, setEventList] = useState([]);

  const getAllEvents = async () => {
    try {
      const collectionRef = collection(FirebaseDB, "events");

      const eventDocs = await getDocs(collectionRef);
      const localEvents = [];
      eventDocs.forEach((doc) => {
        const Event = {
          id: doc.id,
          ...doc.data(),
        };

        localEvents.push(Event);
      });
      setEventList(localEvents);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllEvents();
  }, []);

  const EventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventItem}
      onPress={() => {
        navigation.navigate("EventDetail", { event: item });
      }}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.eventImage}
        defaultSource={require('../assets/event_placeholder.png')}
      />
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventDate}>{item.date}</Text>
        <Text style={styles.eventTime}>{item.time}</Text>
        <Text style={styles.eventLocation}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        keyExtractor={(item) => item.id}
        data={eventList}
        renderItem={({ item }) => <EventItem item={item} />}
        ItemSeparatorComponent={() => {
          return (
            <View style={styles.separator} />
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  eventItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  eventTime: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  separator: {
    height: 1,
    backgroundColor: "#ecf0f1",
    marginHorizontal: 15,
  },
});

export default EventList; 