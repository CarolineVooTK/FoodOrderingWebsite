const MenuModel = require("../models/MenuItem");
const menuitems = MenuModel.menuitems;
let ObjectId = require("mongoose").Types.ObjectId;

const getAll = async (req, res) => {
    result = await menuitems.find( 
        {}, 
        {name: true, 
        photo: true, 
        price: true, 
        ingredients: true, 
        description: true, 
        _id: false} )
    res.send(result)
}