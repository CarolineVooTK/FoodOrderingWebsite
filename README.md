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
| Caroline Voo | Customer Route 2    | 
| Chai Seng Loi   | Vendor Route 2    |
| Jin Yuan Hee (Kane)    | Vendor Route 3      |
| Sam Nee    | Customer Route 3, Vendor Route 1    |
| Yuchen Cai (Cynthia)   | Customer Route 1     |

## General info
In this Project, we are creating a web-based application for a food van franchise 'Snacks in a Van' which allows Vendors to share their location and menu to Customers who can browse different foods and make orders online.

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

#### How our routes work:
Our Node server is hosted by Heroku and connects to a MongoDB cloud cluster which contains our database.  To get or submit data to our database, several REST requests can be made to various routes, the details of which are outlined below.

#### Customer Routes

| Purpose | Type | Path | How to use: |
| :---         |     :---      |       :---      |         :--- |
| View menu of snacks (including pictures and prices) | -     |  - |
| View details of a snack  | -     |  - |
| Customer starts a new order by requesting a snack   | POST | /orders/createNewOrder/ | **req.body** = menuitem: object ID String, quantity: Int, price: Decimal, customerId: object ID String, vendorId: object ID String |

#### Vendor Routes

| Purpose | Type | Path | How to use: |
| :---         |     :---     |     :---     |        :--- |
| Setting van status (vendor sends location, marks van as ready-for-orders) | PUT  | /vendors/:vendorId/setVendorActive | **req.params** = vendorId: object ID String<br>**req.body** = longitude: Decimal, latitude: Decimal, textlocation: String |
| Show list of all outstanding orders  | -     |  - |
| Mark an order as "fulfilled" (ready to be picked up by customer)    | PUT      | /orders/:orderId/setOrdersFulfilled  | **req.params** = orderId: Object ID of of an order<br>**req.body** = status of orders<br>**Result** = Status of the order will become Fulfilled. |

**Our Progress:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [x] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

