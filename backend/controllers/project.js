const Project = require('../models/project');
const Milestone = require('../models/milestone');
const axios = require('axios');

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


exports.createMilestone = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.id;
        const { name, description, due_date, priority } = req.body;
        const project = new Project();

        const currentProject = await project.get(projectId);
        if (!currentProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const job = await Project.getJobByProjectId(projectId);
        if (job.client_id != userId) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (currentProject.status == 2) {
            return res.status(400).json({ code: "ERROR", message: 'Project has been completed' });
        }

        if (!name || !description || !due_date || !priority) {
            return res.status(400).json({ code: "ERROR", message: 'Missing required fields' });
        }

        const milestone = new Milestone();
        const finalMilestoneDueDate = await milestone.getDueDateOfFinalMilestone(projectId);
        const mostRecentMilestoneDueDate = await milestone.getDueDateOfMostRecentMilestone(projectId);
        const newDueDate = new Date(due_date).getTime();

        if (mostRecentMilestoneDueDate && (newDueDate >= finalMilestoneDueDate || newDueDate <= mostRecentMilestoneDueDate)) {
            return res.status(400).json({ code: "ERROR", message: 'Due date must be between the most recent and final milestone due dates' });
        }

        const finalOrderNumber = await milestone.getOrderNumberOfFinalMilestone(projectId);
        await milestone.incrementOrderNumber(finalOrderNumber);

        const totalPriority = await milestone.calculateTotalPriority(projectId);

        const milestoneBudget = (currentProject.budget / totalPriority) * priority;

        const newMilestone = await milestone.create({
            project_id: projectId,
            name: name,
            description: description,
            due_date: due_date,
            priority: priority,
            budget: milestoneBudget,
            status: 1,
            order_number: finalOrderNumber,
        });

        await milestone.updateBudgets(projectId);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone created successfully', milestone: newMilestone });
    } catch (error) {
        next(error);
    }
}

exports.updateMilestoneData = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { name, description, due_date, priority } = req.body;
        const milestone = new Milestone();
        const project = new Project();

        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const currentProject = await project.get(currentMilestone.project_id);
        const job = await Project.getJobByProjectId(currentProject.id);

        if (job.client_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const finalMilestone = await milestone.getFinalMilestone(currentMilestone.project_id);
        const mostRecentMilestoneDueDate = await milestone.getDueDateOfMostRecentMilestone(currentMilestone.project_id);

        if (currentMilestone.id === finalMilestone.id && due_date === finalMilestone.due_date) {
            return res.status(400).json({ code: "ERROR", message: 'Cannot update due date of the final milestone' });
        }

        if (due_date && mostRecentMilestoneDueDate && (new Date(due_date) >= new Date(finalMilestone.due_date) || new Date(due_date) <= new Date(mostRecentMilestoneDueDate))) {
            return res.status(400).json({ code: "ERROR", message: 'Due date must be between the most recent and final milestone due dates' });
        }

        let updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (due_date !== undefined) updateData.due_date = due_date;
        if (priority !== undefined) {
            updateData.priority = priority;
            const totalPriority = await milestone.calculateTotalPriority(currentMilestone.project_id);
            updateData.budget = (currentProject.budget / totalPriority) * priority;
        }
        updateData.updated_at = new Date();

        await milestone.update(id, updateData);

        if (priority !== undefined) {
            await milestone.updateBudgets(currentMilestone.project_id);
        }

        res.status(200).json({ code: "SUCCESS", message: 'Milestone updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.uploadMilestoneContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { links } = req.body;
        const milestone = new Milestone();
        const project = new Project();
        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const currentProject = await project.get(currentMilestone.project_id);
        const job = await Project.getJobByProjectId(currentProject.id);

        if (job.client_id != id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        for (let link of links) {
            try {
                const response = await axios.head(link);
                if (response.status !== 200) {
                    throw new Error(`Link ${link} is invalid.`);
                }
            } catch (error) {
                return res.status(400).json({ error: error.message });
            }
        }

        await milestone.addContent(id, JSON.stringify(links));

        res.status(200).json({ code: "SUCCESS", message: 'Links uploaded successfully' });
    } catch (error) {
        next(error);
    }
};

exports.completeMilestone = async (req, res, next) => {
    try {
        const { id } = req.body;
        const milestone = new Milestone();
        const project = new Project();
        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const currentProject = await project.get(currentMilestone.project_id);
        const job = await Project.getJobByProjectId(currentProject.id);

        if (job.client_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const milestones = await milestone.getAllOrderedByOrderNumber();

        if (Number(milestones[0].id) !== Number(id)) {
            return res.status(400).json({ code: "ERROR", message: 'This milestone cannot be completed yet.' });
        }

        await milestone.updateStatus(id, 2);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone completed successfully' });
    } catch (error) {
        next(error);
    }
}

exports.updateProjectStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { user_type, status } = req.body;
        const project = new Project();
        const milestone = new Milestone();
        const currentProject = await project.get(id);

        if (!currentProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const job = await Project.getJobByProjectId(currentProject.id);

        if ((job.freelancer_id != user_id && user_type === 'freelancer') || (job.client_id != user_id && user_type === 'client')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        if (currentProject.status == 5) {
            return res.status(400).json({ code: "ERROR", message: 'Project has been completed' });
        }

        if (status != currentProject.status + 1) {
            return res.status(400).json({ code: "ERROR", message: 'Too High' });
        }

        if (status == 4 && currentProject.payment_status != 2) {
            return res.status(400).json({ code: "ERROR", message: 'Payment must be completed before moving to active status' });
        }

        if (status === 5) {
            const milestones = await milestone.getMilestonesByProjectId(id);
            const allMilestonesCompleted = milestones.every(m => m.status === 2);
            if (!allMilestonesCompleted) {
                return res.status(400).json({ error: 'All milestones must be completed' });
            }

            const allMilestonesPaymentsCompleted = milestones.every(m => m.payment_status === 2);
            if (!allMilestonesPaymentsCompleted) {
                return res.status(400).json({ error: 'All milestone payments must be completed' });
            }
        }

        await project.update(id, { status: status });

        res.status(200).json({ code: "SUCCESS", message: 'Project status updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.updateProjectPaymentStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { status } = req.body;
        const project = new Project();
        const milestone = new Milestone();
        const currentProject = await project.get(id);

        if (!currentProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (status != 4) {
            return res.status(400).json({ code: "ERROR", message: 'Invalid status' });
        }

        if (currentProject.payment_status == 2) {
            return res.status(400).json({ code: "ERROR", message: 'Payment has already been completed' });
        }

        res.status(200).json({ code: "SUCCESS", message: 'Project status updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.deleteMilestone = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const milestone = new Milestone();
        const project = new Project();
        const orderNumber = await milestone.getOrderNumber(id);
        const currentMilestone = await milestone.get(id);

        if (!currentMilestone) {
            return res.status(404).json({ error: 'Milestone not found' });
        }

        const currentProject = await project.get(currentMilestone.project_id);
        const job = await Project.getJobByProjectId(currentProject.id);
        if (job.client_id != user_id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const finalMilestone = await milestone.getFinalMilestone(currentMilestone.project_id);
        if (currentMilestone.id === finalMilestone.id) {
            return res.status(400).json({ code: "ERROR", message: 'Cannot delete the final milestone' });
        }

        await milestone.delete(id);
        await milestone.decrementOrderNumbers(orderNumber);
        await milestone.updateBudgets(currentMilestone.project_id);

        res.status(200).json({ code: "SUCCESS", message: 'Milestone deleted successfully' });
    } catch (error) {
        next(error);
    }
};