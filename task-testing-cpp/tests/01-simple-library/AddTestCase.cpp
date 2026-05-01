#include "AddTestCase.h"
#include "Functions.h"

TEST(AddTestCase, Positive) {
    EXPECT_EQ(Add(2, 3), 5);
}

TEST(AddTestCase, Negative) {
    EXPECT_EQ(Add(-2, -3), -5);
}

TEST(AddTestCase, Mixed) {
    EXPECT_EQ(Add(-2, 3), 1);
}