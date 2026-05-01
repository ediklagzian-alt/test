#pragma once
#include <gmock/gmock.h>
#include <Weather.h>

class WeatherMock : public Weather {
public:
    MOCK_METHOD(cpr::Response, Get,
                (const std::string& city, const cpr::Url& url), (override));
};