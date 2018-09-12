'use strict';
module.exports = {
  port:8081,
  url:'mongodb://localhost:27017/loveManagement',
    session: {
        name: 'SID',
        secret: 'SID',
        cookie: {
            httpOnly: true,
            secure:   false,
            maxAge:   365 * 24 * 60 * 60 * 1000,
        }
    }
};