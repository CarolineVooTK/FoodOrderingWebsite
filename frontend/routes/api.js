const axios = require("axios");

// server to send requests to
// const BASE_URL = "https://web-info-tech-group-3.herokuapp.com";
const BASE_URL = "http://localhost:4000";


// checkauthentication
const customerAuth = async (req, res,next) => {
  // console.log("cusAuth")
  let data = null;
  data = await axios
    .post(BASE_URL + "/customer/custAuth",{email: req.username, password: req.password})
    .then((data) => {
      // console.log("data = ", data)
      if (data.status == 200){
        // console.log("data.status = 200")
      }
      return data;
    })
    .catch((err) => {
      // console.log(err);
    });
  return data;
};

const addNewCustomer = async (req, res,next) => {
  // console.log("addnewcust: req = ",req)
  let data = null;
  data = await axios
    .post(BASE_URL + "/customer/addcustomer",{email: req.username, password: req.password, 
                                              givenName: req.givenName, familyName:req.familyName})
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

// add new item into an order if the item is not in the order yet
const addNewItemInOrder = async (req, res) => {
  let data = null ; 
  data = await axios 
  .post(BASE_URL + "/menu/addNewItemInOrder")
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

// get all vendors
const getAllVendors = async () => {
  let data = null;
  data = await axios
    .get(BASE_URL + "/vendors")
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

// get one vendor by object id
const getSingleVendor = async (vendor) => {
  let data = null;
  data = await axios
    .get(BASE_URL + `/vendors/${vendor.id}`)
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
// get vendor rating
const getVendorRating = async (vendor) => {
  let data = null;
  data = await axios
    .get(BASE_URL + `/orders/${vendor.vendorId}/rating`)
    .then((data) => {
      if (data.data) {
        return data.data;
      }
      return [{ rating: 0, count: 0 }];
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
};

const getMenu = async () => {
  let data = null;
  data = await axios
    .get(BASE_URL + "/menu")
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

const getVendorMenu = async (vendorId) => {
  let data = null;
  data = await axios
    .get(BASE_URL + `/menu/${vendorId}`)
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



module.exports = 
{ 
  getSingleVendor, 
  getMenu, 
  getVendorMenu, 
  getAllVendors, 
  getVendorRating, 
  customerAuth,
  addNewCustomer,
  addNewItemInOrder
};
