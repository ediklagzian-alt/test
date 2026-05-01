#include "TreeTestCase.h"
#include "Tree.h"

#include <filesystem>
#include <fstream>

namespace fs = std::filesystem;

TEST(TreeTestCase, InvalidPath) {
    EXPECT_THROW(GetTree("non_existing_path", false), std::invalid_argument);
}

TEST(TreeTestCase, NotDirectory) {
    std::ofstream("temp.txt");
    EXPECT_THROW(GetTree("temp.txt", false), std::invalid_argument);
    fs::remove("temp.txt");
}

TEST(TreeTestCase, SimpleTree) {
    fs::create_directory("test_dir");
    std::ofstream("test_dir/file.txt");

    auto tree = GetTree("test_dir", false);

    EXPECT_EQ(tree.name, "test_dir");
    EXPECT_TRUE(tree.is_dir);
    EXPECT_EQ(tree.children.size(), 1);

    fs::remove_all("test_dir");
}

TEST(TreeTestCase, DirsOnly) {
    fs::create_directory("test_dir");
    fs::create_directory("test_dir/sub");
    std::ofstream("test_dir/file.txt");

    auto tree = GetTree("test_dir", true);

    EXPECT_EQ(tree.children.size(), 1); // только папка

    fs::remove_all("test_dir");
}

TEST(TreeTestCase, FilterEmpty) {
    fs::create_directory("test_dir");
    fs::create_directory("test_dir/empty");

    auto tree = GetTree("test_dir", false);

    FilterEmptyNodes(tree, "test_dir");

    EXPECT_FALSE(fs::exists("test_dir/empty"));

    fs::remove_all("test_dir");
}