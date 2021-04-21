**The University of Melbourne**
# INFO30005 – Web Information Technologies

## Links
[The Heroku App](https://web-info-tech-group-3.herokuapp.com/)

MongoDB Link = "mongodb+srv://admin:g_3_pass@cluster0.nvrgb.mongodb.net/snacks?retryWrites=true&w=majority"

# Group 3 Project Repository

Welcome!

We have added to this repository a `README.md`, `.gitignore`, and `.gitattributes`.

* **README.md**: is the document you are currently reading. It should be replaced with information about your project, and instructions on how to use your code in someone else's local computer.

* **.gitignore**: lets you filter out files that should not be added to git. For example, Windows 10 and Mac OS create hidden system files (e.g., .DS_Store) that are local to your computer and should not be part of the repository. This files should be filtered by the `.gitignore` file. This initial `.gitignore` has  been created to filter local files when using MacOS and Node. Depending on your project make sure you update the `.gitignore` file.  More information about this can be found in this [link](https://www.atlassian.com/git/tutorials/saving-changes/gitignore).

* **.gitattributes**: configures the line ending of files, to ensure consistency across development environments. More information can be found in this [link](https://git-scm.com/docs/gitattributes).

Remember that _"this document"_ can use `different formats` to **highlight** important information. This is just an example of different formating tools available for you. For help with the format you can find a guide [here](https://docs.github.com/en/github/writing-on-github).

## Team Members

## Table of contents
* [Team Members](#team-members)
* [General Info](#general-info)
* [Technologies](#technologies)
* [Code Implementation](#code-implementation)
* [Server](#Server)
* [Adding Images](#adding-images)

## Team Members

| Name | Tasks | State |
| :---         |     :---:      |          ---: |
| Caroline Voo | -     |  - |
| Chai Seng Loi   | -     |  - |
| Jin Yuan Hee (Kane)    | -      |  - |
| Sam Nee    | Vendor Route 1, Customer Route 3     |  - |
| Yuchen Cai (Cynthia)   | -      |  - |

## General info
In this Project, we are creating an web-based application for a food van franchise 'Snacks in a Van'.

## Technologies
Project is created with:
* NodeJs 14.16.X
* Heroku
* MongoDB

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

```HTML
<!--
Example code from: https://www.w3schools.com/jsref/met_win_alert.asp
__>

<!DOCTYPE html>
<html>
<body>

<p>Click the button to display an alert box.</p>

<button onclick="myFunction()">Try it</button>

<script>
function myFunction() {
  alert("Hello! I am an alert box!");
}
</script>

</body>
</html>
```

## Adding Images

You can use images/gif hosted online:

<p align="center">
  <img src="https://github.com/Martin-Reinoso/sandpit-Profile/raw/main/Images_Readme/01.gif"  width="300" >
</p>

Or you can add your own images from a folder in your repo with the following code. The example has a folder `Gifs` with an image file `Q1-1.gif`:
```HTML
<p align="center">
  <img src="Gifs/Q1-1.gif"  width="300" >
</p>
```

To create a gif from a video you can follow this [link](https://ezgif.com/video-to-gif/ezgif-6-55f4b3b086d4.mov).

You can use emojis :+1: but do not over use it, we are looking for professional work. If you would not add them in your job, do not use them here! :shipit:

**Now Get ready to complete all the tasks:**

- [x] Read the Project handouts carefully
- [x] User Interface (UI)mockup
- [ ] App server mockup
- [ ] Front-end + back-end (one feature)
- [ ] Complete system + source code
- [ ] Report on your work(+ test1 feature)

