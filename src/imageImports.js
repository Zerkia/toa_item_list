function importAll(r) {
  return r.keys().map((item, index) => ({ 
    id: index + 1, 
    src: r(item), 
    alt: `ToA Item ${index + 1}` 
  }));
}

const images = importAll(require.context('./images', false, /\.(png|jpe?g|svg)$/));

export default images;
