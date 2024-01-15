const Project = require('../models/project');
const Milestone = require('../models/milestone');

exports.getMyProjects = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const bids = await Project.getProjectsByUserId(user_id);
        res.json(bids);
    } catch (error) {
        next(error);
    }
};

exports.getProjectMilestones = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const milestone = new Milestone();
        const milestones = await milestone.getMilestonesByProjectId(projectId);
        res.json(milestones);
    } catch (error) {
        next(error);
    }
};