const mongoose = require('mongoose');

const Usersettingschema = mongoose.Schema({
    settingtype: String,
    settingdata: Object
});

module.exports = mongoose.model('Usersettings', Usersettingschema);