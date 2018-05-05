const mongoose = require('mongoose');

mongoose.connect('mongodb://spoichat:spoichat@ds021046.mlab.com:21046/spoichat');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.registerUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log(err);
            } else {
                newUser.password = hash;
                newUser.save(callback);
            }
        })
    })
}

module.exports.getUserByUsername = (userName, callback) => {
    const query = { userName };
    User.findOne(query, callback);
}

module.exports.getUserByEmail = (email, callback) => {
    const query = { email };
    User.findOne(query, callback);
}

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    })
}