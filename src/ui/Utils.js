 
export function composeClasses(destination, ...srcs) {
  if (srcs == null) return destination;
  srcs.forEach(src => {
    if (src == null) return;
    if (typeof(src) != 'object') return;
    Object.keys(src).forEach(key => {
      let value = src[key];

      if (destination[key] == null) {   
        destination[key] = [];
      } else if (!Array.isArray(destination[key])) {
        destination[key] = [destination[key]];
      }

      const dstValue = destination[key];
      
      if (!Array.isArray(value)) value = [value];
      value.forEach(elem => { dstValue.push(elem); });
    }); 
  });

  return destination;
}
