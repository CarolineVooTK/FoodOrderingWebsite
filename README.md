**The University of Melbourne**
# INFO30005 – Web Information Technologies

## Links
[The Heroku App](https://web-info-tech-group-3.herokuapp.com/)

MongoDB Link = "mongodb+srv://admin:g_3_pass@cluster0.nvrgb.mongodb.net/snacks?retryWrites=true&w=majority"

# Group 3 Project Repository

Welcome!

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Code Implementation](#code-implementation)
* [Adding Images](#adding-images)

## Team Members

| Name | Server Routes |
| :---         |     :---     |
| Caroline Voo | -     | 
| Chai Seng Loi   | -     |
| Jin Yuan Hee (Kane)    | -      |
| Sam Nee    | Vendor Route 1, Customer Route 3     |
| Yuchen Cai (Cynthia)   | -      |

## General info
In this Project, we are creating an web-based application for a food van franchise 'Snacks in a Van'.

## Technologies
Project is created with:
* NodeJs 14.16.1
* Heroku 7.52.0
* MongoDB Atlas
* Express 4.17.1
* Express Handlebars 5.3.0
* Mongoose 5.12.3

## Code Implementation

### Server

#### Customer Routes

| Purpose | Type | Path | How to use: |
| :---         |     :---      |       :---      |         :--- |
| View menu of snacks (including pictures and prices) | -     |  - |
| View details of a snack  | -     |  - |
| Customer starts a new order by requesting a snack   | POST | /orders/createNewOrder | **req.body** = menuitem: menu item object id, quantity, price, customerId: customer object id, vendorId: vendor object id |

#### Vendor Routes

| Purpose | Type | Path | How to use: |
| :---         |     :---     |     :---     |        :--- |
| Setting van status (vendor sends location, marks van as ready-for-orders) | PUT  | /vendors/:vendorId/setVendorActive | **req.params** (vendorId) = Object ID of the vendor<br>**req.body** = longitude, latitude, textlocation |
| Show list of all outstanding orders  | -     |  - |
| Mark an order as "fulfilled" (ready to be picked up by customer)    | -      |  - |

**Our Progress:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

