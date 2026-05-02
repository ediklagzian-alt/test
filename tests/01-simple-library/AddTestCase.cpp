#include "AddTestCase.h"
#include "Functions.h"
#include <gtest/gtest.h>

TEST(AddTest, PositiveNumbers) {
    EXPECT_EQ(Add(2, 3), 5);
}

TEST(AddTest, NegativeNumbers) {
    EXPECT_EQ(Add(-2, -3), -5);
}

TEST(AddTest, MixedSigns) {
    EXPECT_EQ(Add(-2, 3), 1);
}

TEST(AddTest, Zero) {
    EXPECT_EQ(Add(0, 5), 5);
    EXPECT_EQ(Add(0, 0), 0);
}