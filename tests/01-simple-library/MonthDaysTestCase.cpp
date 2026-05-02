#include <gtest/gtest.h>
#include "Functions.h"
#include <stdexcept>

TEST(GetMonthDaysTest, InvalidMonth) {
    EXPECT_THROW(GetMonthDays(2020, 0), std::out_of_range);
    EXPECT_THROW(GetMonthDays(2020, 13), std::out_of_range);
    EXPECT_THROW(GetMonthDays(1930, -1), std::out_of_range);
}

TEST(GetMonthDaysTest, SpecialYear1930) {
    EXPECT_EQ(GetMonthDays(1930, 1), 30);
    EXPECT_EQ(GetMonthDays(1930, 2), 30);
    EXPECT_EQ(GetMonthDays(1930, 4), 30);
    EXPECT_EQ(GetMonthDays(1930, 12), 30);
}

TEST(GetMonthDaysTest, FebruaryLeapYear) {
    EXPECT_EQ(GetMonthDays(2020, 2), 29);
    EXPECT_EQ(GetMonthDays(2000, 2), 29);
}

TEST(GetMonthDaysTest, FebruaryCommonYear) {
    EXPECT_EQ(GetMonthDays(2019, 2), 28);
    EXPECT_EQ(GetMonthDays(1900, 2), 28);
}

TEST(GetMonthDaysTest, ThirtyDayMonths) {
    EXPECT_EQ(GetMonthDays(2021, 4), 30);
    EXPECT_EQ(GetMonthDays(2021, 6), 30);
    EXPECT_EQ(GetMonthDays(2021, 9), 30);
    EXPECT_EQ(GetMonthDays(2021, 11), 30);
}

TEST(GetMonthDaysTest, ThirtyOneDayMonths) {
    EXPECT_EQ(GetMonthDays(2021, 1), 31);
    EXPECT_EQ(GetMonthDays(2021, 3), 31);
    EXPECT_EQ(GetMonthDays(2021, 5), 31);
    EXPECT_EQ(GetMonthDays(2021, 7), 31);
    EXPECT_EQ(GetMonthDays(2021, 8), 31);
    EXPECT_EQ(GetMonthDays(2021, 10), 31);
    EXPECT_EQ(GetMonthDays(2021, 12), 31);
}