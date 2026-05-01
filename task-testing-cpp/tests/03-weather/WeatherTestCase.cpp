#include "WeatherTestCase.h"
#include "WeatherMock.h"

TEST(WeatherTestCase, GetTemperature) {
    WeatherMock w;
    EXPECT_EQ(w.GetTemperature("Moscow"), 20);
}

TEST(WeatherTestCase, DifferenceString) {
    WeatherMock w;
    auto result = w.GetDifferenceString("A", "B");

    EXPECT_TRUE(result.find("Weather in") != std::string::npos);
}

TEST(WeatherTestCase, TomorrowTemperature) {
    WeatherMock w;
    EXPECT_EQ(w.GetTomorrowTemperature("Moscow"), 25);
}

TEST(WeatherTestCase, TomorrowDiff) {
    WeatherMock w;
    auto result = w.GetTomorrowDiff("Moscow");

    EXPECT_TRUE(result.find("tomorrow") != std::string::npos);
}