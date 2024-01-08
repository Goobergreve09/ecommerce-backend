const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/api/tags', async (req, res) => {
  try {
    // find all tags
    const tagData = await Tag.findAll({
      include: [
        { model: Product },
        { model: ProductTag },
      ],
    });

    res.json(tagData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const tagData = await Tag.findOne({
      where: { id: tagId },
      include: [{ model: Product, through: ProductTag }],
    });

    if (!tagData) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.json(tagData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { tag_name } = req.body;

    const newTag = await Tag.create({ tag_name });

    res.status(201).json(newTag);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;
    const { tag_name } = req.body;

    const updatedTag = await Tag.update(
      { tag_name },
      {
        where: {
          id: tagId,
        },
      }
    );

    if (updatedTag[0] === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json({ message: 'Tag updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagId = req.params.id;

    const deletedTagRows = await Tag.destroy({
      where: {
        id: tagId,
      },
    });

    if (deletedTagRows === 0) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(204).end(); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
