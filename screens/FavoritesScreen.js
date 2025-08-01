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
  Alert,
} from "react-native";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FirebaseDB } from "../config/FirebaseConfig";
import Icon from "react-native-vector-icons/FontAwesome";

const FavoritesScreen = ({ navigation, route }) => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);

  const getFavoriteEvents = async () => {
    try {
      const collectionRef = collection(FirebaseDB, "Favorites");

      const favoriteDocs = await getDocs(collectionRef);
      const localFavorites = [];
      favoriteDocs.forEach((doc) => {
        const Event = {
          id: doc.id,
          ...doc.data(),
        };

        localFavorites.push(Event);
      });
      setFavoriteEvents(localFavorites);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFavoriteEvents();
  }, []);

  const removeFromFavorites = async (eventId) => {
    try {
      await deleteDoc(doc(FirebaseDB, "Favorites", eventId));
      setFavoriteEvents(favoriteEvents.filter(event => event.id !== eventId));
      Alert.alert("Removed", "Event has been removed from favorites.");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to remove event from favorites.");
    }
  };

  const clearAllFavorites = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all events from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            try {
              const collectionRef = collection(FirebaseDB, "Favorites");
              const favoriteDocs = await getDocs(collectionRef);
              
              // Delete each document one by one (simpler pattern like Examples)
              for (const doc of favoriteDocs.docs) {
                await deleteDoc(doc.ref);
              }
              
              setFavoriteEvents([]);
              Alert.alert("Cleared", "All favorites have been removed.");
            } catch (error) {
              console.log(error);
              Alert.alert("Error", "Failed to clear all favorites.");
            }
          },
        },
      ]
    );
  };

  const FavoriteEventItem = ({ item }) => (
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
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => removeFromFavorites(item.id)}
      >
        <Icon name="times" size={20} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        {favoriteEvents.length > 0 && (
          <TouchableOpacity 
            style={styles.clearAllButton}
            onPress={clearAllFavorites}
          >
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {favoriteEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-o" size={80} color="#bdc3c7" />
          <Text style={styles.emptyText}>No favorite events yet</Text>
          <Text style={styles.emptySubtext}>
            Events you add to favorites will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          keyExtractor={(item) => item.id}
          data={favoriteEvents}
          renderItem={({ item }) => <FavoriteEventItem item={item} />}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  clearAllButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 6,
  },
  clearAllText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#7f8c8d",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#bdc3c7",
    textAlign: "center",
    lineHeight: 22,
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
  removeButton: {
    padding: 10,
    justifyContent: "center",
  },
  separator: {
    height: 1,
    backgroundColor: "#ecf0f1",
    marginHorizontal: 15,
  },
});

export default FavoritesScreen; 