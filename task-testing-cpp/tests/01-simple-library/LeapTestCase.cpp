#include "LeapTestCase.h"
#include "Functions.h"

TEST(LeapTestCase, LeapYear) {
    EXPECT_TRUE(IsLeap(2020));
}

TEST(LeapTestCase, NotLeapYear) {
    EXPECT_FALSE(IsLeap(2019));
}

TEST(LeapTestCase, CenturyNotLeap) {
    EXPECT_FALSE(IsLeap(1900));
}

TEST(LeapTestCase, CenturyLeap) {
    EXPECT_TRUE(IsLeap(2000));
}

TEST(LeapTestCase, InvalidYear) {
    EXPECT_THROW(IsLeap(0), std::invalid_argument);
}
TEST(LeapTestCase, FebruaryLeap) {
    EXPECT_EQ(GetMonthDays(2020, 2), 29);
}

TEST(LeapTestCase, FebruaryNotLeap) {
    EXPECT_EQ(GetMonthDays(2019, 2), 28);
}

TEST(LeapTestCase, ThirtyDays) {
    EXPECT_EQ(GetMonthDays(2021, 4), 30);
}

TEST(LeapTestCase, ThirtyOneDays) {
    EXPECT_EQ(GetMonthDays(2021, 1), 31);
}

TEST(LeapTestCase, Special1930) {
    EXPECT_EQ(GetMonthDays(1930, 5), 30);
}

TEST(LeapTestCase, InvalidMonth) {
    EXPECT_THROW(GetMonthDays(2020, 13), std::out_of_range);
}