import Formation from '../models/formation.js';

export const getAll = async (req, res) => {
    return res.status(200).json(await Formation.find())
};

export const add = async (req, res) => {
    return res.status(200).json(await (new Formation(req.body)).save())
};

export const update = async (req, res) => {
    return res.status(200).json(await Formation.findByIdAndUpdate(req.body._id, {$set: req.body}))
};

export const remove = async (req, res) => {
    return res.status(200).json(await Formation.findByIdAndDelete(req.params.id))
};