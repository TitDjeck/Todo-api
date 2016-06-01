var bcrypt = require("bcrypt");
var _ = require("underscore");
var cryptojs = require("crypto-js");
var jwt = require("jsonwebtoken");

module.exports = function(sequelize, DataTypes) {
	var User = sequelize.define('user', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        salt: {
            type: DataTypes.STRING
        },
        password_hash: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate:{
                len: [7, 100]
            },
            set: function(value){
                var salt = bcrypt.genSaltSync(10);
                var hashedPassword = bcrypt.hashSync(value, salt);
                
                this.setDataValue("password", value);
                this.setDataValue("salt", salt);
                this.setDataValue("password_hash", hashedPassword);
            }
        }
    }, {
        hooks: {
            beforeValidate: function(user, options){
                if(typeof user.email === "string"){
                    user.email = user.email.toLowerCase();
                }
            }
        },
        classMethods: {
            authenticate: function(body){
                return new Promise(function(resolve, reject){
                    if(typeof body.email !== "string" || typeof body.password != "string"){
                        reject();
                    } else {
                        User.findOne({where: {email: body.email}})
                            .then(function(_user){
                                if(!_user || !bcrypt.compareSync(body.password, _user.get('password_hash'))){
                                    reject();
                                } else {
                                    resolve(_user);
                                }
                            })
                            .catch(function(eror){
                                reject();
                            });
                    }	
                });
            },
            findByToken: function(token){
                return new Promise(function(resolve, reject){
                    try {
                        var decodeJWT = jwt.verify(token, "qwerty098");
                        var bytes = cryptojs.AES.decrypt(decodeJWT.token, "abc123pouet");
                        var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));
                        
                        User.findById(tokenData.id)
                            .then(function(user){
                                if(user){
                                    resolve(user);
                                } else {
                                    reject();
                                }
                            })
                            .catch(function(error){
                                console.error(error);
                                reject(error);
                            });
                    } catch (error) {
                        console.error(error);
                        reject();
                    }
                });
            }
        },
        instanceMethods: {
            toPublicJSON: function(){
                var json = this.toJSON();
                return _.pick(json, "id", "email", "createdAt", "updatedAt");
            },
            generateToken: function(type){
                if(!_.isString(type)){
                    return undefined;
                }
                try{
                    var stringData = JSON.stringify({id: this.get('id'), type: type});
                    var encrypedData = cryptojs.AES.encrypt(stringData, "abc123pouet").toString();
                    var token = jwt.sign({
                        token: encrypedData
                    }, "qwerty098");
                    
                    return token;
                } catch(err){
                    return undefined;
                }
            }
        }
    });
    return user;
};
    