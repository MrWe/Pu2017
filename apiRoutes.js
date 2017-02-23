var express = require('express')
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
var router = express.Router()



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://aurora-80cde.firebaseio.com"
});


var db = admin.database();

router.post('/store_content', function(req, res) {
  console.log(req.query);
  var ref = db.ref("aurora");
  var scriptsRef = ref.child("scripts");
  scriptsRef.set({
      script: "test"

  });
});


module.exports = router;
