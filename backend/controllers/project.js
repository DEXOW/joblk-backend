const Project = require('../models/project');
const Milestone = require('../models/milestone');
const Job = require('../models/job');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ keyFilename: './path-to-your-keyfile.json' });

exports.getMyProjects = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const user_type = req.params.user_type;
        var bids;

        if (!user_type) {
            return res.status(404).json({ error: 'Missing required fields' });
        }

        if (user_type == `"client"`) {
            bids = await Project.getProjectsForClient(user_id);
        } else if (user_type == `"freelancer"`) {
            bids = await Project.getProjectsForFreelancer(user_id);
        } else {
            return res.status(404).json({ error: 'Invalid user type' });
        }

        res.json(bids);
    } catch (error) {
        next(error);
    }
};

exports.getProjectClientMilestones = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;
        const project = new Project();

        const currentProject = await project.get(projectId);
        if (!currentProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const job = await Project.getJobByProjectId(projectId);

        if (job.client_id != userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const milestone = new Milestone();
        const milestones = await milestone.getMilestonesByProjectId(projectId);

        res.json(milestones);
    } catch (error) {
        next(error);
    }
};

exports.getProjectFreelancerMilestones = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;
        const project = new Project();

        const currentProject = await project.get(projectId);
        if (!currentProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const job = await Project.getJobByProjectId(projectId);

        if (job.freelancer_id != userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const milestone = new Milestone();
        const milestones = await milestone.getMilestonesByProjectId(projectId);

        res.json(milestones);
    } catch (error) {
        next(error);
    }
};

exports.completeProject = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const project = new Project();
        const job = new Job();
        const currentJob = await Project.getJobByProjectId(id);
        const milestone = new Milestone();
        const currentProject = await project.get(id);

        if (!currentProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (currentJob.client_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const milestones = await milestone.getMilestonesByProjectId(id);

        const allMilestonesCompleted = milestones.every(m => m.status === 3);
        if (!allMilestonesCompleted) {
            return res.status(400).json({ error: 'All milestones must be completed' });
        }

        await project.update(id, { status: 2 });
        await job.update(currentJob.id, { job_status: 3 });

        res.status(200).json({ code: "SUCCESS", message: 'Project is completed' });
    } catch (error) {
        next(error);
    }
};