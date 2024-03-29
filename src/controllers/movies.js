/**
 * <p></p>
 *
 * @className movies
 * @author jiangyu
 * @create 2017-02-03 22:12
 * @version v1.0
 */
//引用movieModel.js文件
var MovieModel = require('../models/movieModel');
//引入express模块
var express = require('express');
//引入formidable，用于解析表单提交的数据
var formidable = require('formidable');
//引入fs模块，用于文件操作
var fs = require('fs');
//引入superagent模块，superagent是客户端请求代理模块，用于处理get,post,put,delete,head请求
var request = require('superagent');
//引入自定义的参数配置文件
var paramsConfig = require('../config/paramsConf.js');

//上传图片方法
exports.uploadPic = function(req,res){
    //创建Formidable.IncomingForm对象
    var form = new formidable.IncomingForm();
    //设置上传图片的位置，就是配置文件里定义的路径
    form.uploadDir = paramsConfig.uploadDir;
    //保留后缀格式
    form.keepExtensions = true;
    //解析表单数据，如果有key:value的键值对数据则保存在fields里，这里只处理图片文件，所以fields里面没有数据，files为解析出来的文件对象集合
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log(err);
        }
        //获取文件对象集合里的file对象路径，如'.\\public\\upload\\123.jpg'
        var path = files.file.path;
        //获取路径中最后一个'\'的索引，"\\"表示\，前面一个斜杠表示转义符
        var index = path.lastIndexOf("\\");
        //截取path中最后一个斜杠后面的字符串，即图片存入数据库的名称('123.jpg')
        var serverPicName = path.substring(index + 1, path.length);
        //把数据库中的图片名称返回给客户端
        res.send(serverPicName);
    });
};

// 新增一条电影数据方法
exports.create = function(req, res){
    //将req.body赋值给一个新对象mymovie
    var mymovie = req.body;
    //将req.body提交过来的showDate放入movieSchema里定义的meta属性里
    mymovie.meta = {};
    mymovie.meta.showDate = mymovie.showDate;
    //以mymovie对象实例化一个MovieModel对象：newMovie
    var newMovie = new MovieModel(mymovie);
    //newMovie调用mongoose的save方法将数据存入mongodb数据库
    newMovie.save(function (err, movie) {
        if (err) {
            console.log(err);
        }
        //res.send({message: 'add a movie'})
    });
};

// 获取搜有的电影数据方法
exports.list = function(req,res){
    // 这里直接通过MovieModel调用mongoose封装的find()方法
    MovieModel.find(function(err,movie){
        if(err){
            return res.send(err);
        }
        // 以json格式返回电影数据给前端
        res.json(movie);
    });
};

// update a movie
exports.update = function(req,res){
    // Movie.findById(req.params.id,callback)
    MovieModel.findById({_id:req.params.id},function(err,movie){
        if(err){
            return res.send(err);
        }
        for(prop in req.body){
            movie[prop] = req.body[prop];
        }
        var updateMovie = new MovieModel(movie);

        updateMovie.save(function(err){
            if(err){
                return res.send(err);
            }
            res.json({message:"update a movie"});
        });
    });
};

//delete a movie
exports.delete = function(res,req){
    MovieModel.remove({_id:req.params.id},function(err,movie){
        if(err){
            return res.send(err);
        }
        res.json({message:"delete a movie"});
    });
}