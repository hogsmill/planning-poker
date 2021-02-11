
const defValues = {
  'fibonacci': [
    { order: 1, name: '1', include: true },
    { order: 2, name: '2', include: true },
    { order: 3, name: '3', include: true },
    { order: 4, name: '5', include: true },
    { order: 5, name: '8', include: true },
    { order: 6, name: '13', include: true }
  ],
  't-shirt': [
    { order: 1, name: 'XS', include: true },
    { order: 2, name: 'S', include: true },
    { order: 3, name: 'M', include: true },
    { order: 4, name: 'L', include: true },
    { order: 5, name: 'XL', include: true }
  ],
  'relative': [
    { order: 1, name: 'XS', include: true, icon: 'agile_sims_relative_xs.png' },
    { order: 2, name: 'S', include: true, icon: 'agile_sims_relative_s.png' },
    { order: 3, name: 'M', include: true, icon: 'agile_sims_relative_m.png' },
    { order: 4, name: 'L', include: true, icon: 'agile_sims_relative_l.png' },
    { order: 5, name: 'XL', include: true, icon: 'agile_sims_relative_xl.png' }
  ],
  'fruit': [
    { order: 1, name: 'grape', include: true, icon: 'agile_sims_fruit_grape.jpg' },
    { order: 2, name: 'cherry', include: true, icon: 'agile_sims_fruit_cherry.jpg' },
    { order: 3, name: 'apple', include: true, icon: 'agile_sims_fruit_apple.jpg' },
    { order: 4, name: 'kiwi', include: true, icon: 'agile_sims_fruit_kiwi.jpg' },
    { order: 5, name: 'watermelon', include: true, icon: 'agile_sims_fruit_watermelon.jpg' },
    { order: 6, name: 'pineapple', include: true, icon: 'agile_sims_fruit_pineapple.jpg' }
  ],
  'custom': []
}

module.exports = {

  defaultValues: function() {
    return defValues
  }
}
