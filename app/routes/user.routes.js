module.exports = (app) => {
    const user = require('../controllers/user.controller');    
    //admin
    app.post('/api/user/createuser', user.createuser);
    app.post('/api/admin/loginuser', user.loginuser);
}