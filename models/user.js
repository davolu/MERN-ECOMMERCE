const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');

const user = new mongoose.Schema({

    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true,
        required: true,
        unique: 50
    },
    password_hashed: {
        type: String,
        required: true
    },
    about:{
        type: String,
        trim: true,
         maxlength: 160
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }

},

{ timestamps: true }
);

     user
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = uuidv1();
        this.password_hashed = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

    user.methods = {
        authenticate: function(plainText) {
            return this.encryptPassword(plainText) === this.password_hashed;
        },
    
        encryptPassword: function(password) {
            if (!password) return '';
            try {
                return crypto
                    .createHmac('sha1', this.salt)
                    .update(password)
                    .digest('hex');
            } catch (err) {
                return '';
            }
        }
    };

    module.exports = mongoose.model('User', user);