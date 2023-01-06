const Blog = require('../models/blog');

exports.create = (blogData) => Blog.create(blogData);

exports.getAll = () => Blog.find().lean();

exports.getOne = (blogId) => Blog.findById(blogId);

exports.getOwned =(userId) => Blog.find({owner: userId}).lean()

exports.update = (blogId, blogData) => Blog.findByIdAndUpdate(blogId, blogData, { runValidators: true });

exports.delete = (blogId) => Blog.findByIdAndDelete(blogId);