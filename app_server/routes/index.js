/**
 * http://usejsdoc.org/
 */
var express = require('express');
var router = express.Router();
var ctrlMain = require("../controllers/main");

/*
 * GET home page.
 */
router.get('/', ctrlMain.home);
router.get('/search', ctrlMain.search);
router.get('/details', ctrlMain.details);
router.get('/community', ctrlMain.get_community_data);
router.get('/tables', ctrlMain.get_table_data);
router.get('/ssl', ctrlMain.ssl);
router.get('/domestic', ctrlMain.domestic);
router.get('/safeareas', ctrlMain.safeareas);
router.get('/2019', ctrlMain.twenty_nineteen);
module.exports = router;
