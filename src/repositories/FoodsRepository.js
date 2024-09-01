const knex = require('../database/knex')

class FoodsRepository {
  async findAll(searchTerm) {
    let result

    const researchedIngredients = await knex('ingredients').whereLike('title', `${searchTerm}%`)

    if (researchedIngredients.length > 0) {
      const researchedFoods = await knex('foods')

      result = researchedFoods.map(food => {
        const ingredients = researchedIngredients.filter(ingredient => ingredient.food_id === food.id)
    
        return {
          ...food,
          ingredients: ingredients.map(ingredient => ingredient.title)
        }
      })
    } else {
      result = await knex('foods').whereLike('name', `${searchTerm}%`)
    }
  
    return result;
  }
  
  async findById(id) {
    const food = await knex('foods').where({id}).first()
    const ingredients = await knex('ingredients').where({food_id: id}).orderBy('title')

    return { food, ingredients }
  }

  async create({ user_id, image, name, category, price, description }) {
    const [food_id] = await knex('foods').insert({ user_id, image, name, category, price, description })
    return food_id
  }

  async delete(id) {
    await knex('foods').where({ id }).del()
  }

  async insertIngredients(ingredients) {
    await knex('ingredients').insert(ingredients)
  }

  async updateImage(id, image) {
    await knex('foods').update({ image }).where({ id })
  }
}

module.exports = FoodsRepository