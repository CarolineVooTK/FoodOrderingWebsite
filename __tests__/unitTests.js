const mongoose = require('mongoose')
const vendorController = require("../data/controllers/vendor-controller.js")
const VendorModel = require("../data/models/Vendor");
const OrderModel = require("../data/models/Order");
const vendors = VendorModel.vendors;
const orders = OrderModel.orders;

describe("Unit testing setVendorActive vendorController.js with valid information", () => {
    const req = {
        body:{longitude:99, latitude:99, textlocation:"victoria market"},
        // assuming the vendor is logined with session.passport.user = "6075878024b5d615b324ee1d"
        session:{passport:{user:"6075878024b5d615b324ee1d"}},
    };
    // response object with render and status
    // in vendorController it is called by res.status(200).render
    const res = {
        render: jest.fn(),
        status: jest.fn(() => res)
    }; 

    beforeAll(() => {
        res.render.mockClear();
        // mock data for vendor
        vendors.findById = jest.fn().mockResolvedValue([{
            orders: [ "607b912c24b5d615b324ee2b" ],
            _id: "6075878024b5d615b324ee1d",
            name: 'Vendor 1',
            email: 'vendor@test.com',
            location: { coordinates: [ 99, 99 ], type: 'Point' },
            active: true,
            menu: [
              { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
              { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
              { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
              { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
              { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
              { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
              { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
              { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
            ],
            password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
            textlocation: 'jest test location'
          }])

        // mock rating for the vendor
        orders.aggregate = jest.fn().mockResolvedValue([{
            _id: null, rating: 2, count: 2
        }])

        // mock data for vendors
        vendors.findOneAndUpdate = jest.fn().mockResolvedValue([{
            orders: [ "607b912c24b5d615b324ee2b" ],
            _id: "6075878024b5d615b324ee1d",
            name: 'Vendor 1',
            email: 'vendor@test.com',
            location: { coordinates: [ 99, 99 ], type: 'Point' },
            active: true,
            menu: [
              { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
              { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
              { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
              { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
              { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
              { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
              { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
              { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
            ],
            password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
            textlocation: 'jest test location'
          }])
          
        vendors.findById.mockImplementationOnce(()=> ({
            lean: jest.fn().mockReturnValue({
                orders: [ "607b912c24b5d615b324ee2b" ],
                _id: "6075878024b5d615b324ee1d",
                name: 'Vendor 1',
                email: 'vendor@test.com',
                location: { coordinates: [ 99, 99 ], type: 'Point' },
                active: true,
                menu: [
                  { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
                  { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
                  { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
                  { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
                  { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
                  { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
                  { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
                  { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
                ],
                password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
                textlocation: 'jest test location'
            }),
            }));
        // testing setVendorActive
        vendorController.setVendorActive(req,res)
      });
      test("Test case 1: using valid vendor id with valid location to set active", () => {    
        expect(res.render ).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.render).toHaveBeenCalledWith("vendorProfile", {
            vendor_status: "Active", vendor: {
                orders: [ "607b912c24b5d615b324ee2b" ],
                _id: "6075878024b5d615b324ee1d",
                name: 'Vendor 1',
                email: 'vendor@test.com',
                location: { coordinates: [ 99, 99 ], type: 'Point' },
                active: true,
                menu: [
                  { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
                  { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
                  { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
                  { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
                  { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
                  { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
                  { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
                  { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
                ],
                password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
                textlocation: 'jest test location'
            }, rating: 2, count: 2,});
    });
  });



  describe("Unit testing setVendorActive vendorController.js with invalid location information(missing textlocation)", () => {
    // missing textlocation
    const req = {
        body:{longitude:99, latitude:99},
        session:{passport:{user:"6075878024b5d615b324ee1d"}},
    };
    // response object with render and status
    // in vendorController it is called by res.status(200).render
    const res = {
        render: jest.fn(),
        status: jest.fn(() => res)
    }; 

    beforeAll(() => {
        res.render.mockClear();
        // mock data for vendor
        vendors.findById = jest.fn().mockResolvedValue([{
            orders: [ "607b912c24b5d615b324ee2b" ],
            _id: "6075878024b5d615b324ee1d",
            name: 'Vendor 1',
            email: 'vendor@test.com',
            location: { coordinates: [ 99, 99 ], type: 'Point' },
            active: true,
            menu: [
              { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
              { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
              { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
              { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
              { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
              { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
              { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
              { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
            ],
            password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
            textlocation: 'jest test location'
          }])

        // mock rating for the vendor
        orders.aggregate = jest.fn().mockResolvedValue([{
            _id: null, rating: 2, count: 2
        }])

        vendors.findOneAndUpdate = jest.fn().mockResolvedValue([{
            orders: [ "607b912c24b5d615b324ee2b" ],
            _id: "6075878024b5d615b324ee1d",
            name: 'Vendor 1',
            email: 'vendor@test.com',
            location: { coordinates: [ 99, 99 ], type: 'Point' },
            active: true,
            menu: [
              { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
              { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
              { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
              { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
              { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
              { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
              { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
              { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
            ],
            password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
            textlocation: 'jest test location'
          }])
          
        vendors.findById.mockImplementationOnce(()=> ({
            lean: jest.fn().mockReturnValue({
                orders: [ "607b912c24b5d615b324ee2b" ],
                _id: "6075878024b5d615b324ee1d",
                name: 'Vendor 1',
                email: 'vendor@test.com',
                location: { coordinates: [ 99, 99 ], type: 'Point' },
                active: true,
                menu: [
                  { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
                  { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
                  { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
                  { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
                  { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
                  { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
                  { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
                  { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
                ],
                password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
                textlocation: 'jest test location'
            }),
            }));
        vendorController.setVendorActive(req,res)
      });

      test("Test case 1: using valid vendor id with invalid location(Missing textlocation) to set active", () => {    
        expect(res.render ).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.render).toHaveBeenCalledWith("vendorProfile", {
            vendor_error: "Error wrong data",
            vendor_status: "Off",
          });
    });
  });

describe("Unit testing setVendorOff vendorController.js with valid information", () => {
  const req = {
      // assuming the vendor is logined with session.passport.user = "6075878024b5d615b324ee1d"
      session:{passport:{user:"6075878024b5d615b324ee1d"}},
  };
  // response object with render and status
  // in vendorController it is called by res.status(200).render
  const res = {
      render: jest.fn(),
      status: jest.fn(() => res)
  }; 
  beforeAll(() => {
      res.render.mockClear();
      // mock data for vendor
      vendors.findById = jest.fn().mockResolvedValue([{
          orders: [ "607b912c24b5d615b324ee2b" ],
          _id: "6075878024b5d615b324ee1d",
          name: 'Vendor 1',
          email: 'vendor@test.com',
          location: { coordinates: [ 99, 99 ], type: 'Point' },
          active: true,
          menu: [
            { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
            { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
            { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
            { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
            { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
            { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
            { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
            { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
          ],
          password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
          textlocation: 'jest test location'
        }])

      // mock rating for the vendor
      orders.aggregate = jest.fn().mockResolvedValue([{
          _id: null, rating: 2, count: 2
      }])

      vendors.findOneAndUpdate = jest.fn().mockResolvedValue([{
          orders: [ "607b912c24b5d615b324ee2b" ],
          _id: "6075878024b5d615b324ee1d",
          name: 'Vendor 1',
          email: 'vendor@test.com',
          location: { coordinates: [ 99, 99 ], type: 'Point' },
          active: true,
          menu: [
            { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
            { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
            { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
            { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
            { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
            { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
            { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
            { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
          ],
          password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
          textlocation: 'jest test location'
        }])
        
      vendors.findById.mockImplementationOnce(()=> ({
          lean: jest.fn().mockReturnValue({
              orders: [ "607b912c24b5d615b324ee2b" ],
              _id: "6075878024b5d615b324ee1d",
              name: 'Vendor 1',
              email: 'vendor@test.com',
              location: { coordinates: [ 99, 99 ], type: 'Point' },
              active: true,
              menu: [
                { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
                { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
                { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
                { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
                { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
                { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
                { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
                { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
              ],
              password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
              textlocation: 'jest test location'
          }),
          }));
      vendorController.setVendorOff(req,res)
    });
    test("Test case 1: using valid vendor id with valid location to set active", () => {    
      expect(res.render ).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.render).toHaveBeenCalledWith("vendorProfile", {
          vendor_status: "Off", vendor: {
              orders: [ "607b912c24b5d615b324ee2b" ],
              _id: "6075878024b5d615b324ee1d",
              name: 'Vendor 1',
              email: 'vendor@test.com',
              location: { coordinates: [ 99, 99 ], type: 'Point' },
              active: true,
              menu: [
                { menuitem: "607a431a24b5d615b324ee1e", quantity: 20 },
                { menuitem: "607b75ab24b5d615b324ee27", quantity: 10 },
                { menuitem: "60815f9824b5d615b324ee3c", quantity: 20 },
                { menuitem: "60815ff324b5d615b324ee3d", quantity: 10 },
                { menuitem: "6081605b24b5d615b324ee3e", quantity: 20 },
                { menuitem: "608160c024b5d615b324ee3f", quantity: 10 },
                { menuitem: "6081614c24b5d615b324ee40", quantity: 20 },
                { menuitem: "608161df24b5d615b324ee41", quantity: 10 }
              ],
              password: '$2a$10$3rqBgzXZaPQsQyTSZ0Yj1.L1g.CDbarI2m1L1Pp2Hn9M9/zstjUJK',
              textlocation: 'jest test location'
          }, rating: 2, count: 2,});
  });
});