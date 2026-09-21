/*
 * KKfootprint's customer-facing tour source of truth.
 * Keep prices and operational identifiers here; translated marketing copy stays
 * in index.html until dedicated tour pages are introduced.
 *
 * KKF_TOUR_CATALOG_JSON:{"city":{"name":"City Tour","adult":100,"child":80},"mengalum":{"name":"Mengalum Island","adult":350,"child":280},"mantanani":{"name":"Mantanani Island Snorkeling","adult":320,"child":260},"island":{"name":"Twin Island Hopping","adult":269,"child":245},"culture":{"name":"Mari Mari Cultural Village","adult":260,"child":null},"firefly":{"name":"Firefly Safari","adult":230,"child":200},"kundasang":{"name":"Kundasang ATV & Farm","adult":350,"child":280},"rental_car":{"name":"Rental Car with Driver","adult":450,"child":null,"durationHours":10,"additionalHour":50}}
 */
window.KKFTourCatalog = Object.freeze({
  city: Object.freeze({ category: 'CITY', adult: 100, child: 80, image: '/images/tours/city-tour-800.webp' }),
  mengalum: Object.freeze({ category: 'ISLAND', adult: 350, child: 280, image: '/images/tours/mengalum-island-800.webp' }),
  mantanani: Object.freeze({ category: 'ISLAND', adult: 320, child: 260, combo_firefly_adult: 560, combo_firefly_child: 495, image: '/images/tours/mantanani-island-800.webp' }),
  island: Object.freeze({ category: 'ISLAND', adult: 269, child: 245, image: '/images/tours/island-hopping-800.webp' }),
  culture: Object.freeze({ category: 'CULTURE', adult: 260, child: null, image: '/images/tours/mari-mari-cultural-village-800.webp' }),
  firefly: Object.freeze({ category: 'NATURE', adult: 230, child: 200, image: '/images/tours/firefly-800.webp' }),
  kundasang: Object.freeze({ category: 'MOUNTAIN', adult: 350, child: 280, image: '/images/tours/kundasang-highlights-800.webp' }),
  rental_car: Object.freeze({ category: 'PRIVATE', adult: 450, child: null, durationHours: 10, additionalHour: 50 }),
});
