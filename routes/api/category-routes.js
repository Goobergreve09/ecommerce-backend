const router = require("express").Router();
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  try {
    // find all categories
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
      // be sure to include its associated Products
    });

    res.json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find the category by its `id` value
    const categoryId = req.params.id;
    const categoryData = await Category.findOne({
      where: { id: categoryId },
      include: [{ model: Product }],
    });

    // Check if the category is found
    if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Send the category data with associated products
    res.json(categoryData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    // Get category data from the request body
    const { category_name } = req.body;

    // Create a new category
    const newCategory = await Category.create({
      category_name,
    });

    // Send the newly created category as a response
    res.status(201).json(newCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Get the category id from the URL parameter
    const categoryId = req.params.id;
    const { category_name } = req.body;

    // Update the category by its id
    const updatedCategory = await Category.update(
      { category_name },
      {
        where: {
          id: categoryId,
        },
      }
    );

    // Check if any category was updated
    if (updatedCategory[0] === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    const deletedCategoryRows = await Category.destroy({
      where: {
        id: categoryId,
      },
    });

    // Check if any category was deleted
    if (deletedCategoryRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(204).end(); // 204 means "No Content"
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
