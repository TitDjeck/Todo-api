var bcrypt = require("bcrypt");
var _ = require("underscore");
var cryptojs = require("crypto-js");
var jwt = require("jsonwebtoken");

module.exports = function(sequelize, DataTypes) {
	var Token = sequelize.define('token', {
        token: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [1]
            },
            set: function(value){
                var hash = cryptojs.MD5(value).toString();
                
                this.setDataValue("token", value);
                this.setDataValue("tokenHash", hash);
            }
        },
        tokenHash:{
            type: DataTypes.STRING
        }
    });
    
    return Token;
};