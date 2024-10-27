// Array of image names in the order they should appear
const imageNames = [
  "01_Tumeken's_guardian_detail",
  "02_Tumeken's_shadow_(uncharged)_detail",
  "03_Elidinis'_ward_detail",
  "04_Masori_mask_detail",
  "05_Masori_body_detail",
  "06_Masori_chaps_detail",
  "07_Lightbearer_detail",
  "08_Osmumten's_fang_detail",
  "09_Thread_of_elidinis_detail",
  "10_Breach_of_the_scarab_detail",
  "11_Eye_of_the_corruptor_detail",
  "12_Jewel_of_the_sun_detail",
  "13_Menaphite_ornament_kit_detail",
  "14_Cursed_phalanx_detail",
  "15_Masori_crafting_kit_detail",
  "16_Cache_of_runes_detail",
  "17_Remnant_of_ba-ba_detail",
  "18_Remnant_of_kephri_detail",
  "19_Remnant_of_akkha_detail",
  "20_Remnant_of_zebak_detail",
  "21_Ancient_remnant_detail"
];

// This function will dynamically import images as needed
const importImage = (name) => {
  return import(`./images/${name}.png`).then(image => ({
    id: imageNames.indexOf(name) + 1,
    src: image.default,
    alt: `ToA Item ${name.split('_')[0]}`,
    loading: 'lazy'
  }));
};

// This function will get a single image by its index
export const getImage = async (index) => {
  if (index < 1 || index > imageNames.length) {
    throw new Error('Invalid image index');
  }
  return await importImage(imageNames[index - 1]);
};

// This function will get all images
export const getAllImages = async () => {
  return await Promise.all(imageNames.map(importImage));
};
