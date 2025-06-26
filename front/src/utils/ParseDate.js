function parseDate(date) {
  let ydm,
    hms = null;
  date.map((v) => {
    ydm = v.date.slice(0, 10).split("-").reverse().join("-");
    hms = v.date.slice(11, -1).slice(0, -7);
    v.date = hms + "  " + ydm;
  });
}

export { parseDate };
