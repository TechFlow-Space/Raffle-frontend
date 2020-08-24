export const formatAddress = (addr) => {
  return (addr.slice(0, 8) + '...' + addr.slice(-4,));
}

export const numberWithCommas = x => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

