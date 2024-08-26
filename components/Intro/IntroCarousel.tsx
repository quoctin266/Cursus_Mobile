import * as React from "react";
import { Dimensions, Text, View, StyleSheet, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import { useState } from "react";

const carouselData = [
  {
    image: require("../../assets/pngwing.com.png"),
    title: "Take Video Courses",
    subtitle: "From cooking to coding and everything in between",
  },
  {
    image: require("../../assets/teacher.png"),
    title: "Learn from the Best",
    subtitle:
      "Approach expert-instructors, vetted by more than 50 million learners",
  },
  {
    image: require("../../assets/pace.png"),
    title: "Go at Your Own Pace",
    subtitle: "Lifetime access to purchased courses, anytime, anywhere",
  },
];

function IntroCarousel() {
  const width = Dimensions.get("window").width;
  const [index, setIndex] = useState(0);

  return (
    <>
      <View style={{ flex: 3 }}>
        <Carousel
          autoPlay
          autoPlayInterval={3000}
          width={width}
          data={carouselData}
          scrollAnimationDuration={500}
          onSnapToItem={(index) => setIndex(index)}
          renderItem={({ item, index }) => (
            <View style={styles.carouselItem} key={index}>
              <Image
                source={item.image}
                resizeMode="contain"
                style={styles.carouselImg}
              />

              <View style={styles.textContainer}>
                <Text style={[styles.text, styles.title]}>{item.title}</Text>
                <Text style={[styles.text, styles.subtitle]}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={{ flex: 1, alignItems: "center", marginTop: 40 }}>
        <AnimatedDotsCarousel
          length={carouselData.length}
          currentIndex={index}
          maxIndicators={4}
          interpolateOpacityAndColor={true}
          activeIndicatorConfig={{
            color: "white",
            margin: 5,
            opacity: 1,
            size: 8,
          }}
          inactiveIndicatorConfig={{
            color: "white",
            margin: 5,
            opacity: 0.5,
            size: 8,
          }}
          decreasingDots={[
            {
              config: { color: "white", margin: 3, opacity: 0.5, size: 6 },
              quantity: 1,
            },
            {
              config: { color: "white", margin: 3, opacity: 0.5, size: 4 },
              quantity: 1,
            },
          ]}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  carouselItem: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  carouselImg: {
    height: "30%",
    tintColor: "white",
    marginBottom: 40,
  },
  textContainer: {
    paddingHorizontal: 30,
  },
  text: {
    textAlign: "center",
    color: "white",
  },
  title: {
    fontWeight: "600",
    fontSize: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
  },
});

export default IntroCarousel;
