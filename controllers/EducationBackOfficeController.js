import Education from '../models/Education.js';

export const getAll = async (req, res) => {
    return res.status(200).json(await Education.find())
};

export const add = async (req, res) => {
    return res.status(200).json(await (new Education(req.body).save()))
};

export const update = async (req, res) => {
    return res.status(200).json(await Education.findByIdAndUpdate(req.body._id, {$set: req.body}))
};

export const remove = async (req, res) => {
    return res.status(200).json(await Education.findByIdAndDelete(req.params.id))
};