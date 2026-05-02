#include "TreeTestCase.h"
#include "Tree.h"
#include <gtest/gtest.h>
#include <filesystem>
#include <fstream>
#include <stdexcept>
#include <cstdlib>

namespace fs = std::filesystem;

class TreeTest : public TreeTestCase {
protected:
    fs::path tmp_dir;

    void SetUp() override {
        tmp_dir = fs::temp_directory_path() /
                  ("tree_test_" + std::to_string(rand()));
        fs::create_directories(tmp_dir);
    }

    void TearDown() override {
        fs::remove_all(tmp_dir);
    }

    void createFile(const fs::path& relative) {
        auto full = tmp_dir / relative;
        fs::create_directories(full.parent_path());
        std::ofstream(full) << "data";
    }

    void createDir(const fs::path& relative) {
        fs::create_directories(tmp_dir / relative);
    }
};

TEST_F(TreeTest, GetTree_NonExistentPath_Throws) {
    EXPECT_THROW(GetTree((tmp_dir / "nonexistent").string(), false),
                 std::invalid_argument);
}

TEST_F(TreeTest, GetTree_FileInsteadOfDir_Throws) {
    createFile("file.txt");
    EXPECT_THROW(GetTree((tmp_dir / "file.txt").string(), false),
                 std::invalid_argument);
}

TEST_F(TreeTest, GetTree_EmptyDirectory) {
    auto root = GetTree(tmp_dir.string(), false);
    EXPECT_EQ(root.name, tmp_dir.filename().string());
    EXPECT_TRUE(root.is_dir);
    EXPECT_TRUE(root.children.empty());
}

TEST_F(TreeTest, GetTree_DirsOnly_True_SkipsFiles) {
    createFile("readme.txt");
    createDir("subdir");
    createFile("subdir/hidden.txt");

    auto root = GetTree(tmp_dir.string(), true);
    ASSERT_EQ(root.children.size(), 1);
    EXPECT_EQ(root.children[0].name, "subdir");
    EXPECT_TRUE(root.children[0].is_dir);
    EXPECT_TRUE(root.children[0].children.empty());
}

TEST_F(TreeTest, GetTree_DirsOnly_False_IncludesFiles) {
    createFile("readme.txt");
    createDir("src");
    createFile("src/main.cpp");

    auto root = GetTree(tmp_dir.string(), false);
    ASSERT_EQ(root.children.size(), 2);
    bool has_file = false, has_dir = false;
    for (auto& c : root.children) {
        if (c.name == "readme.txt" && !c.is_dir) {
            has_file = true;
            EXPECT_TRUE(c.children.empty());
        }
        if (c.name == "src" && c.is_dir) {
            has_dir = true;
            ASSERT_EQ(c.children.size(), 1);
            EXPECT_EQ(c.children[0].name, "main.cpp");
            EXPECT_FALSE(c.children[0].is_dir);
        }
    }
    EXPECT_TRUE(has_file);
    EXPECT_TRUE(has_dir);
}

TEST_F(TreeTest, GetTree_NestedDirectories) {
    createDir("a/b/c");
    createFile("a/b/c/deep.txt");

    auto root = GetTree(tmp_dir.string(), false);
    ASSERT_EQ(root.children.size(), 1);
    EXPECT_EQ(root.children[0].name, "a");
    auto& a = root.children[0];
    ASSERT_EQ(a.children.size(), 1);
    EXPECT_EQ(a.children[0].name, "b");
    auto& b = a.children[0];
    ASSERT_EQ(b.children.size(), 1);
    EXPECT_EQ(b.children[0].name, "c");
    auto& c = b.children[0];
    ASSERT_EQ(c.children.size(), 1);
    EXPECT_EQ(c.children[0].name, "deep.txt");
}

TEST_F(TreeTest, FilterEmptyNodes_RootEmptyAndDefaultPath_Throws) {
    auto root = GetTree(tmp_dir.string(), false);
    EXPECT_TRUE(root.children.empty());
    EXPECT_THROW(FilterEmptyNodes(root, tmp_dir), std::runtime_error);
}

TEST_F(TreeTest, FilterEmptyNodes_RemovesEmptySubdirectories) {
    createDir("empty_dir");
    createFile("file.txt");
    createDir("sub/empty_inside");
    createFile("sub/not_empty/data.txt");

    auto root = GetTree(tmp_dir.string(), false);
    FilterEmptyNodes(root, tmp_dir);

    EXPECT_FALSE(fs::exists(tmp_dir / "empty_dir"));
    EXPECT_FALSE(fs::exists(tmp_dir / "sub/empty_inside"));
    EXPECT_TRUE(fs::exists(tmp_dir / "file.txt"));
    EXPECT_TRUE(fs::exists(tmp_dir / "sub"));
    EXPECT_TRUE(fs::exists(tmp_dir / "sub/not_empty"));
    EXPECT_TRUE(fs::exists(tmp_dir / "sub/not_empty/data.txt"));
}

TEST_F(TreeTest, FilterEmptyNodes_NonEmptyDirectoriesSurvive) {
    createDir("keep_me");
    createFile("keep_me/doc.txt");

    auto root = GetTree(tmp_dir.string(), false);
    FilterEmptyNodes(root, tmp_dir);

    EXPECT_TRUE(fs::exists(tmp_dir / "keep_me"));
    EXPECT_TRUE(fs::exists(tmp_dir / "keep_me/doc.txt"));
}