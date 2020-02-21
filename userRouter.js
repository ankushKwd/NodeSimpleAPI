const uc = require ('./Controllers/UserController');
const express = require ('express');
const router = express.Router ();

router.route ('/users').post (uc.saveUser).get (uc.getAllUsers);

router
  .route ('/:id')
  .get (uc.getOneUser)
  .patch (uc.updateUser)
  .delete (uc.deleteUser);

module.exports = router;
