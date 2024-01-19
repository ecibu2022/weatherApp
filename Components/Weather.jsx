import { React, useEffect, useState } from 'react'
import * as Location from 'expo-location';
import { SafeAreaView, StyleSheet, Text, Alert, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native';

// Weather API from open weather map website
const weatherAPI = "308115c954c1a57a6749551a0311a52c";
const url = `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${weatherAPI}`;

function Weather() {
    const [forecast, setforecast] = useState(null);
    const [refreshing, setrefreshing] = useState(false);

    const loadForecast = async () => {
        setrefreshing(true);

        // Ask for permissions to access location
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert("Permission for location denied");
            setrefreshing(false);
            return;
        }

        // Get current location
        let location = await Location.getCurrentPositionAsync({
            enableHighAccuracy: true
        });

        try {
            // Fetch weather
            const response = await fetch(`${url}&lat=${location.coords.latitude}&lon=${location.coords.longitude}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(`Weather API error: ${data.message}`);
            }

            // set the forecast
            setforecast(data);
        } catch (error) {
            console.error('Error fetching weather data:', error.message);
            Alert.alert('Something went wrong. Please try again later.');
        } finally {
            setrefreshing(false);
        }
    }


    // useEffect is a hook that runs after the component is rendered
    useEffect(() => {
        loadForecast();
    }, []);

    if (!forecast) {
        return (
            <SafeAreaView style={styles.loading}>
                <Text>Loading...</Text>
                <ActivityIndicator size='large' />
            </SafeAreaView>
        );
    }

    const currentWeather = forecast.weather[0];
    const iconUrl = `https://openweathermap.org/img/wn/${currentWeather.icon}.png`;
    const tempWeather = forecast.main;
    const latitude = forecast.coord;

    return (
        <SafeAreaView style={styles.content}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => loadForecast()}
                        style={{ marginTop: 50 }}
                    />
                }
            >

                <Text>Latitude {latitude.lat}</Text>
                <Text>Longitude {latitude.lon}</Text>

                {/* Access properties from currentWeather as needed */}
                <Text>Main Weather: {currentWeather.main}</Text>
                <Text>Description: {currentWeather.description}</Text>
                {/* Add more information as needed */}
                <Image
                    source={{ uri: iconUrl }}
                    style={styles.image}
                />

                {/* Display temperature-related information */}
                <Text>Temperature: {tempWeather.temp} °C</Text>
                <Text>Feels Like: {tempWeather.feels_like} °C</Text>
                <Text>Min Temperature: {tempWeather.temp_min} °C</Text>
                <Text>Max Temperature: {tempWeather.temp_max} °C</Text>
                <Text>Pressure: {tempWeather.pressure} hPa</Text>
                <Text>Humidity: {tempWeather.humidity}%</Text>

            </ScrollView>
        </SafeAreaView>
    );
}

export default Weather

const styles = StyleSheet.create({
    content: {
        padding: 40,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        padding: 5,
        borderRadius: 100,
        backgroundColor: '#fff',
    }
})