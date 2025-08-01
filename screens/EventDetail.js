import { useState, useEffect } from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { FirebaseDB } from "../config/FirebaseConfig";

const EventDetail = ({ navigation, route }) => {
  const { event } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const docRef = doc(FirebaseDB, "Favorites", event.id);
      const docSnap = await getDoc(docRef);
      setIsFavorite(docSnap.exists());
    } catch (error) {
      console.log(error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const docRef = doc(FirebaseDB, "Favorites", event.id);
      
      if (isFavorite) {
        await deleteDoc(docRef);
        setIsFavorite(false);
        Alert.alert("Removed from Favorites", "Event has been removed from your favorites.");
      } else {
        await setDoc(docRef, event);
        setIsFavorite(true);
        Alert.alert("Added to Favorites", "Event has been added to your favorites.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image 
          source={{ uri: event.image }} 
          style={styles.eventImage}
          defaultSource={require('../assets/event_placeholder.png')}
        />
        
        <View style={styles.content}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          
          <Text style={styles.description}>{event.description}</Text>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date and Time</Text>
            <Text style={styles.sectionText}>{event.date} · {event.time}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.sectionText}>{event.location}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About the Event</Text>
            <Text style={styles.sectionText}>{event.about}</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.getTicketsButton}>
          <Text style={styles.getTicketsText}>Get Tickets</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={toggleFavorite}
        >
          <Icon 
            name={isFavorite ? "heart" : "heart-o"} 
            size={20} 
            color={isFavorite ? "white" : "#10ac84"} 
          />
          <Text style={[styles.favoriteText, isFavorite && styles.favoriteTextActive]}>
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  eventImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  content: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#34495e",
    lineHeight: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: "#7f8c8d",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  getTicketsButton: {
    flex: 1,
    backgroundColor: "#10ac84",
    paddingVertical: 15,
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
  },
  getTicketsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  favoriteButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingVertical: 15,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#10ac84",
  },
  favoriteButtonActive: {
    backgroundColor: "#10ac84",
  },
  favoriteText: {
    color: "#10ac84",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  favoriteTextActive: {
    color: "white",
  },
});

export default EventDetail; 