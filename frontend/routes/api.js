const axios = require("axios");

// server to send requests to
// const BASE_URL = "https://web-info-tech-group-3.herokuapp.com";
const BASE_URL = "http://localhost:4000";

// get one vendor by object id
const getSingleVendor = async () => {
  let data = null;
  data = await axios
    .get(BASE_URL + "/vendors" + "/6075878024b5d615b324ee1d")
    .then((data) => {
      if (data.data) {
        return data.data;
      }
      return [];
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};

module.exports = { getSingleVendor };
