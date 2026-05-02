#include "LeapTestCase.h"
#include "Functions.h"
#include <gtest/gtest.h>
#include <stdexcept>

TEST(IsLeapTest, ThrowsOnInvalidYear) {
    EXPECT_THROW(IsLeap(0), std::invalid_argument);
    EXPECT_THROW(IsLeap(-400), std::invalid_argument);
}

TEST(IsLeapTest, TypicalLeapYear) {
    EXPECT_TRUE(IsLeap(2004));
    EXPECT_TRUE(IsLeap(1996));
}

TEST(IsLeapTest, CenturyLeapYear) {
    EXPECT_TRUE(IsLeap(2000));
    EXPECT_TRUE(IsLeap(1600));
}

TEST(IsLeapTest, TypicalCommonYear) {
    EXPECT_FALSE(IsLeap(2001));
    EXPECT_FALSE(IsLeap(2003));
}

TEST(IsLeapTest, CenturyCommonYear) {
    EXPECT_FALSE(IsLeap(1900));
    EXPECT_FALSE(IsLeap(2100));
}