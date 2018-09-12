'use strict';
const express = require('express');
import Admin from '../controller/admin/admin.js';
const router = express.Router();
router.post('/register',Admin.register);
router.post('/login',Admin.login);
router.get('/getUserList',Admin.getUserList);
export default router;