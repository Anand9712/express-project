const asyncHandler = require("express-async-handler");
const contact = require("../models/contactModel");
//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts =asyncHandler(async(req, res) => {
    const contacts = await contact.find({user_id : req.User.id});
    res.status(200).json({contacts});
});

//@desc create new contacts
//@route POST /api/contacts
//@access private
const createContact =asyncHandler(async(req, res) => {
    console.log("The request body is:",req.body);
    const {name,email,phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error(" All fields are mandatory");
    }
    const Contact = await contact.create({
        name,
        email,
        phone,
        user_id : req.User.id,
    });
    res.status(201).json({Contact});
});


//@desc Get all contacts
//@route GET /api/contacts/:id
//@access private
const getContact =asyncHandler(async(req, res) => {
    const Contact =await contact.findById(req.params.id);
    if(!Contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    res.status(200).json(Contact);
});

//@desc update contacts
//@route PUT /api/contacts/:id
//@access private
const updateContact =asyncHandler(async(req, res) => {
    const Contact =await contact.findById(req.params.id);
    if(!Contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if (Contact.user_id.toString() !== req.User.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
      }

    const updatedContact = await contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(updatedContact);
});


//@desc delete contacts
//@route DELETE /api/contacts/:id
//@access public
const deleteContact =asyncHandler(async(req, res) => {
    const Contact = await contact.findById(req.params.id);
    if(!Contact){
        res.status(404);
        throw new Error("Contact Not Found");
    }
    if (Contact.user_id.toString() !== req.User.id) {
        res.status(403);
        throw new Error("User don't have permission to update other user contacts");
      }
    await contact.deleteOne({ _id: req.params.id });
    res.status(200).json(Contact);
});



module.exports = {getContacts,createContact,getContact,updateContact,deleteContact};