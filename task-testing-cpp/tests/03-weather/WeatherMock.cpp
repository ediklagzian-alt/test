#include "WeatherMock.h"

cpr::Response WeatherMock::Get(const std::string& city, const cpr::Url& url) {
    cpr::Response r;
    r.status_code = 200;

    if (url.str().find("locations") != std::string::npos) {
        r.text = R"([{"Key":"123"}])";
    } else if (url.str().find("forecasts") != std::string::npos) {
        r.text = R"({
            "DailyForecasts":[
                {},
                {"Temperature":{"Maximum":{"Value":25}}}
            ]
        })";
    } else {
        r.text = R"([
            {"Temperature":{"Metric":{"Value":20}}}
        ])";
    }

    return r;
}